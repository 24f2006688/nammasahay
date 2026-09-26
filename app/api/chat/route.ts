import { NextRequest, NextResponse } from "next/server";

const API = "https://api.sarvam.ai";

function key() {
  const value = process.env.SARVAM_API_KEY;

  if (!value) {
    throw new Error("SARVAM_API_KEY is not configured");
  }

  return value;
}

async function sarvamFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  return fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      "api-subscription-key": key(),
      ...(options.headers || {}),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // =========================================================
    // TEXT CHAT
    // =========================================================

    if (contentType.includes("application/json")) {
      const body = await request.json();

      // ---------------- CHAT ----------------

      if (body.action === "chat") {
        const response = await sarvamFetch("/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "sarvam-105b",
            messages: [
              {
                role: "system",
                content: `You are NammaSahay, a helpful multilingual AI assistant for people in India.

Your job is to explain government services, public services, education, healthcare information, documents and everyday civic processes in simple language.

Rules:
- Understand English, Tamil, Hindi and Romanized Indian languages.
- Reply in the language used by the user.
- If the user mixes English and an Indian language, naturally use the same mixed style.
- Give practical step-by-step instructions.
- Clearly distinguish official requirements from general guidance.
- Never invent government URLs, fees or eligibility requirements.
- Keep answers easy for an ordinary citizen to understand.
- If you are uncertain, say so.
- Do not ask unnecessary questions.`,
              },
              {
                role: "user",
                content: body.message,
              },
            ],
            max_tokens: 800,
            reasoning_effort: null,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Chat error:", data);
          return NextResponse.json(
            { error: data?.error?.message || "Sarvam chat failed" },
            { status: response.status }
          );
        }

        return NextResponse.json({
          answer: data.choices?.[0]?.message?.content || "",
        });
      }

      // ---------------- TEXT TO SPEECH ----------------

      if (body.action === "speak") {
        const response = await sarvamFetch("/text-to-speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: body.text.slice(0, 2500),
            target_language_code: body.language || "ta-IN",
            language_code: body.language || "ta-IN",
            model: "bulbul:v3",
            speaker: body.speaker || "priya",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("TTS error:", data);
          return NextResponse.json(
            { error: data?.error?.message || "Text-to-speech failed" },
            { status: response.status }
          );
        }

        const audio = data.audios?.[0];

        return NextResponse.json({
          audio,
        });
      }
    }

    // =========================================================
    // MULTIPART: VOICE / DOCUMENT
    // =========================================================

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const action = form.get("action");

      // ---------------- SPEECH TO TEXT ----------------

      if (action === "transcribe") {
        const audio = form.get("file");
        const language = String(form.get("language") || "unknown");

        if (!(audio instanceof File)) {
          return NextResponse.json(
            { error: "Audio file is required" },
            { status: 400 }
          );
        }

        const upstream = new FormData();

        upstream.append("file", audio, audio.name || "recording.webm");
        upstream.append("model", "saaras:v4");
        upstream.append("mode", "transcribe");
        upstream.append("language_code", language);

        const response = await sarvamFetch("/speech-to-text", {
          method: "POST",
          body: upstream,
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("STT error:", data);
          return NextResponse.json(
            { error: data?.error?.message || "Speech recognition failed" },
            { status: response.status }
          );
        }

        return NextResponse.json({
          transcript: data.transcript,
          language: data.language_code,
        });
      }

      // ---------------- DOCUMENT ----------------

      if (action === "document") {
        const file = form.get("file");
        const language = String(form.get("language") || "en-IN");

        if (!(file instanceof File)) {
          return NextResponse.json(
            { error: "Document is required" },
            { status: 400 }
          );
        }

        const schema = {
          type: "object",
          properties: {
            document_type: {
              type: "string",
              description: "Type or purpose of the document",
            },
            title: {
              type: "string",
              description: "Title or main heading of the document",
            },
            summary: {
              type: "string",
              description: "Short summary of what the document says",
            },
            important_dates: {
              type: "array",
              items: { type: "string" },
              description: "Important dates mentioned in the document",
            },
            important_amounts: {
              type: "array",
              items: { type: "string" },
              description: "Important amounts, fees or monetary values",
            },
            required_actions: {
              type: "array",
              items: { type: "string" },
              description: "Actions the person needs to take",
            },
          },
        };

        const upload = new FormData();

        upload.append("file", file, file.name);
        upload.append("schema", JSON.stringify(schema));
        upload.append("language", language);
        upload.append("output_format", "json");

        const createResponse = await sarvamFetch(
          "/doc-ai/v1/job/extract",
          {
            method: "POST",
            body: upload,
          }
        );

        const job = await createResponse.json();

        if (!createResponse.ok) {
          console.error("Document create error:", job);

          return NextResponse.json(
            {
              error:
                job?.error?.message ||
                "Document processing could not be started",
            },
            { status: createResponse.status }
          );
        }

        // Poll Document AI job.
        let statusData: any = null;

        for (let i = 0; i < 15; i++) {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const statusResponse = await sarvamFetch(
            `/doc-ai/v1/job/${job.job_id}/status`,
            {
              method: "GET",
            }
          );

          statusData = await statusResponse.json();

          const status = String(statusData.status || "").toLowerCase();

          if (
            status === "completed" ||
            status === "partially_completed" ||
            status === "failed" ||
            status === "rejected"
          ) {
            break;
          }
        }

        const status = String(statusData?.status || "").toLowerCase();

        if (status === "failed" || status === "rejected") {
          return NextResponse.json(
            {
              error:
                statusData?.error?.message ||
                "Document processing failed",
            },
            { status: 500 }
          );
        }

        if (
          status !== "completed" &&
          status !== "partially_completed"
        ) {
          return NextResponse.json(
            {
              error:
                "Document is still processing. Please try again.",
            },
            { status: 202 }
          );
        }

        const resultResponse = await sarvamFetch(
          `/doc-ai/v1/job/${job.job_id}/results`,
          {
            method: "GET",
          }
        );

        const resultData = await resultResponse.json();

        if (!resultResponse.ok) {
          return NextResponse.json(
            {
              error:
                resultData?.error?.message ||
                "Could not retrieve document results",
            },
            { status: resultResponse.status }
          );
        }

        const extracted = resultData.result || resultData;

        // Give the extracted information to 105B
        // for a citizen-friendly explanation.
        const explainResponse = await sarvamFetch(
          "/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "sarvam-105b",
              messages: [
                {
                  role: "system",
                  content:
                    "You are NammaSahay. Explain documents to ordinary Indian citizens in simple language. Do not invent facts. Use only the extracted information provided.",
                },
                {
                  role: "user",
                  content: `Explain this document in simple language.

Extracted information:
${JSON.stringify(extracted, null, 2)}

Give:
1. What this document is
2. What it means
3. Important dates/amounts
4. What the person needs to do next`,
                },
              ],
              max_tokens: 700,
              reasoning_effort: null,
            }),
          }
        );

        const explanationData = await explainResponse.json();

        return NextResponse.json({
          extracted,
          explanation:
            explanationData.choices?.[0]?.message?.content ||
            "Document processed successfully.",
        });
      }
    }

    return NextResponse.json(
      { error: "Unsupported request" },
      { status: 400 }
    );
  } catch (error) {
    console.error("NammaSahay API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}