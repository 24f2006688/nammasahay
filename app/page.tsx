"use client";

import { useRef, useState } from "react";

type Language = {
  name: string;
  code: string;
};

const languages: Language[] = [
  { name: "தமிழ்", code: "ta-IN" },
  { name: "हिन्दी", code: "hi-IN" },
  { name: "English", code: "en-IN" },
  { name: "తెలుగు", code: "te-IN" },
  { name: "ಕನ್ನಡ", code: "kn-IN" },
  { name: "മലയാളം", code: "ml-IN" },
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [language, setLanguage] = useState("ta-IN");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentExplanation, setDocumentExplanation] = useState("");
  const [documentData, setDocumentData] = useState<any>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function ask(messageToSend = message) {
    if (!messageToSend.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "chat",
          message: messageToSend,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setAnswer(data.answer);
    } catch (error) {
      setAnswer(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        const file = new File([blob], "voice.webm", {
          type: "audio/webm",
        });

        const form = new FormData();

        form.append("action", "transcribe");
        form.append("file", file);
        form.append("language", language);

        try {
          setLoading(true);

          const response = await fetch("/api/chat", {
            method: "POST",
            body: form,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error);
          }

          setMessage(data.transcript);
          await ask(data.transcript);
        } catch (error) {
          setAnswer(
            error instanceof Error
              ? error.message
              : "Voice processing failed."
          );
        } finally {
          setLoading(false);
        }
      };

      recorderRef.current = recorder;
      recorder.start();

      setRecording(true);
    } catch {
      setAnswer(
        "Microphone permission is required for voice input."
      );
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  }

  async function speak() {
    if (!answer) return;

    try {
      setLoading(true);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "speak",
          text: answer,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      const audio = new Audio(
        `data:audio/wav;base64,${data.audio}`
      );

      await audio.play();
    } catch (error) {
      setAnswer(
        error instanceof Error
          ? error.message
          : "Voice playback failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function processDocument(file: File) {
    setDocumentLoading(true);
    setDocumentExplanation("");
    setDocumentData(null);

    try {
      const form = new FormData();

      form.append("action", "document");
      form.append("file", file);
      form.append("language", language);

      const response = await fetch("/api/chat", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setDocumentData(data.extracted);
      setDocumentExplanation(data.explanation);
    } catch (error) {
      setDocumentExplanation(
        error instanceof Error
          ? error.message
          : "Document processing failed."
      );
    } finally {
      setDocumentLoading(false);
    }
  }

  function useExample(text: string) {
    setMessage(text);
    ask(text);
  }

  return (
    <main className="min-h-screen bg-[#06101d] text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">

        {/* HEADER */}

        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs text-blue-300">
              ● Sarvam AI powered
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Namma<span className="text-blue-400">Sahay</span>
            </h1>

            <p className="mt-2 max-w-xl text-slate-400">
              Your multilingual AI companion for navigating
              India&apos;s everyday services and documents.
            </p>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none"
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </header>

        {/* CAPABILITY STRIP */}

        <div className="mb-6 grid gap-3 md:grid-cols-4">
          {[
            ["💬", "Ask", "Sarvam 105B"],
            ["🎙️", "Speak", "Saaras"],
            ["🔊", "Listen", "Bulbul"],
            ["📄", "Understand", "Sarvam Vision"],
          ].map(([icon, title, subtitle]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
            >
              <div className="text-xl">{icon}</div>
              <div className="mt-2 font-semibold">{title}</div>
              <div className="text-xs text-slate-500">
                {subtitle}
              </div>
            </div>
          ))}
        </div>

        {/* MAIN */}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

          {/* CHAT */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Ask NammaSahay
              </h2>
              <p className="text-sm text-slate-500">
                Type or speak naturally in your language.
              </p>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="உதாரணம்: ஆதார் அட்டையை எப்படி புதுப்பிப்பது?"
              className="h-36 w-full resize-none rounded-2xl border border-slate-700 bg-[#040b15] p-4 text-sm outline-none transition focus:border-blue-500"
            />

            <div className="mt-3 flex gap-3">
              <button
                onClick={() =>
                  recording ? stopRecording() : startRecording()
                }
                className={`flex-1 rounded-xl border py-3 font-medium ${
                  recording
                    ? "border-red-500 bg-red-500/10 text-red-300"
                    : "border-slate-700 bg-slate-800 hover:bg-slate-700"
                }`}
              >
                {recording ? "⏹ Stop recording" : "🎙️ Speak"}
              </button>

              <button
                onClick={() => ask()}
                disabled={loading || !message.trim()}
                className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Thinking..." : "Ask →"}
              </button>
            </div>

            {/* QUICK EXAMPLES */}

            <div className="mt-5">
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-600">
                Try a demo
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    useExample(
                      "Aadhaar card-ai eppadi update panrathu?"
                    )
                  }
                  className="rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:border-blue-500"
                >
                  Aadhaar update
                </button>

                <button
                  onClick={() =>
                    useExample(
                      "What documents are needed to apply for a passport?"
                    )
                  }
                  className="rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:border-blue-500"
                >
                  Passport
                </button>

                <button
                  onClick={() =>
                    useExample(
                      "எனக்கு அரசு திட்டங்கள் பற்றி எளிமையாக சொல்லுங்கள்"
                    )
                  }
                  className="rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:border-blue-500"
                >
                  Tamil
                </button>
              </div>
            </div>

            {/* ANSWER */}

            {answer && (
              <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-300">
                    NammaSahay
                  </span>

                  <button
                    onClick={speak}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800"
                  >
                    🔊 Listen
                  </button>
                </div>

                <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  {answer}
                </div>
              </div>
            )}
          </section>

          {/* DOCUMENT */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <h2 className="text-xl font-semibold">
              📄 Understand a document
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Upload a government letter, certificate,
              application or other document. NammaSahay will
              extract important information and explain it.
            </p>

            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  processDocument(file);
                }
              }}
            />

            <button
              onClick={() => fileRef.current?.click()}
              disabled={documentLoading}
              className="mt-6 w-full rounded-xl border border-dashed border-slate-600 bg-slate-950 py-8 text-sm text-slate-400 hover:border-blue-500 hover:text-blue-300"
            >
              {documentLoading
                ? "🔄 Understanding document..."
                : "📎 Upload PDF / Image"}
            </button>

            {documentExplanation && (
              <div className="mt-5 rounded-2xl bg-slate-950 p-4">
                <div className="mb-2 text-sm font-semibold text-blue-300">
                  Document explanation
                </div>

                <div className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                  {documentExplanation}
                </div>
              </div>
            )}

            {documentData && (
              <details className="mt-4">
                <summary className="cursor-pointer text-xs text-slate-500">
                  View extracted information
                </summary>

                <pre className="mt-2 overflow-auto rounded-xl bg-black p-3 text-xs text-green-300">
                  {JSON.stringify(documentData, null, 2)}
                </pre>
              </details>
            )}
          </section>
        </div>

        {/* ARCHITECTURE */}

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="mb-3 text-xs uppercase tracking-widest text-slate-600">
            Under the hood
          </p>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-lg bg-slate-800 px-3 py-2">
              👤 Citizen
            </span>

            <span className="text-slate-600">→</span>

            <span className="rounded-lg bg-slate-800 px-3 py-2">
              🎙️ Saaras
            </span>

            <span className="text-slate-600">→</span>

            <span className="rounded-lg bg-blue-500/10 px-3 py-2 text-blue-300">
              🧠 Sarvam 105B
            </span>

            <span className="text-slate-600">→</span>

            <span className="rounded-lg bg-slate-800 px-3 py-2">
              🔊 Bulbul
            </span>

            <span className="text-slate-600">or</span>

            <span className="rounded-lg bg-purple-500/10 px-3 py-2 text-purple-300">
              📄 Sarvam Vision
            </span>
          </div>
        </section>

        <footer className="py-6 text-center text-xs text-slate-700">
          NammaSahay • Built with Sarvam AI • Sarvam Campus ’26
        </footer>
      </div>
    </main>
  );
}