# 🇮🇳 NammaSahay

### A multilingual, voice-first AI companion for India's citizens

> **Ask naturally. Speak naturally. Understand documents. Get help in
> your language.**

NammaSahay is a citizen-focused AI assistant built with **Sarvam AI**
for **Sarvam Campus '26 × IIT Madras**.

It combines multilingual chat, speech recognition, speech synthesis, and
document intelligence into one simple interface so users can interact
with digital services without needing to be fluent in English or
comfortable with complex forms and portals.

[![Built with Sarvam
AI](https://img.shields.io/badge/Built%20with-Sarvam%20AI-5B5BF7?style=for-the-badge)](https://www.sarvam.ai/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind
CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Source_Code-181717?style=for-the-badge&logo=github)](https://github.com/24f2006688/nammasahay)

**Live Demo:** `YOUR_VERCEL_URL`\
**Source Code:** https://github.com/24f2006688/nammasahay

------------------------------------------------------------------------

## 🧭 The Problem

India is multilingual, but many digital experiences are still designed
around typing, English-first interfaces, and difficult-to-understand
documents.

A citizen may know exactly what they need, but still struggle because: -
information is difficult to understand - service terminology is
unfamiliar - typing is inconvenient - the user is more comfortable
speaking than writing - government letters and forms contain dense
information - regional-language and code-mixed communication is natural

### NammaSahay changes the interaction model.

Instead of forcing the citizen to adapt to the computer:

**the computer adapts to the citizen.**

------------------------------------------------------------------------

# ✨ What NammaSahay Does

  -----------------------------------------------------------------------
  Capability                          What happens
  ----------------------------------- -----------------------------------
  💬 **Ask**                          Ask questions naturally using
                                      Sarvam-105B

  🎙️ **Speak**                        Speak using Sarvam Saaras

  🧠 **Understand**                   Sarvam-105B generates a contextual
                                      response

  🔊 **Listen**                       Bulbul converts responses into
                                      speech

  📄 **Understand Documents**         Sarvam Vision / Document AI
                                      extracts important information

  🌐 **Multilingual**                 Indian-language and code-mixed
                                      interaction
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 🧠 The Core Idea

NammaSahay is not just a chatbot. It is a **multimodal
citizen-assistance layer**.

``` text
                         ┌─────────────────────┐
                         │      CITIZEN        │
                         │ Text / Voice / File │
                         └──────────┬──────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                  🎙️ Voice                     📄 Document
                     │                             │
                     ▼                             ▼
                Saaras STT                  Sarvam Vision
                     │                             │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Sarvam-105B      │
                         │ Understand + Reason │
                         └──────────┬──────────┘
                                    │
                           ┌────────┴────────┐
                           │                 │
                         Text              Voice
                           │                 │
                           ▼                 ▼
                       UI Answer          Bulbul TTS
                                             │
                                             ▼
                                      🔊 Spoken Answer
```

------------------------------------------------------------------------

# 🚀 Demo Experience

## 1. 💬 Ask

Users can type naturally in English, Tamil, Hindi, or mixed language.

Example:

``` text
Aadhaar card-ai eppadi update panrathu?
```

The request is sent to **Sarvam-105B** and returned as a
citizen-friendly explanation.

## 2. 🎙️ Speak

``` text
Citizen speaks
      ↓
Saaras Speech-to-Text
      ↓
Transcript
      ↓
Sarvam-105B
      ↓
Answer
```

## 3. 🔊 Listen

``` text
Sarvam-105B response
        ↓
Bulbul v3
        ↓
Natural Indian-language speech
```

This creates a complete conversational loop:

**Speech → Understanding → Reasoning → Speech**

## 4. 📄 Understand a Document

Users can upload a PDF or image containing a letter, form, certificate,
or other document.

``` text
Document
   ↓
Sarvam Vision / Document AI
   ↓
Structured information
   ↓
Sarvam-105B
   ↓
Simple explanation
```

The goal is not merely OCR.

The goal is:

> **"Tell me what this document means and what I need to do next."**

------------------------------------------------------------------------

# 🇮🇳 Designed for India

NammaSahay is designed around real Indian communication patterns:

-   Native Indian scripts
-   Romanized Indian-language input
-   Code-mixed communication
-   Voice-first interaction
-   Regional-language explanations
-   Documents containing Indian languages

Sarvam provides native Indian-language capabilities across speech, chat,
and document workflows.

------------------------------------------------------------------------

# 🧩 Sarvam AI Stack

### 🧠 Sarvam-105B

Reasoning and conversational engine.

``` text
User intent
    ↓
Context understanding
    ↓
Reasoning
    ↓
Citizen-friendly response
```

### 🎙️ Saaras

Speech-to-text:

``` text
Human speech → Text
```

### 🔊 Bulbul v3

Text-to-speech:

``` text
Text → Natural speech
```

### 👁️ Sarvam Vision / Document AI

Document intelligence:

``` text
PDF / Scan / Image
       ↓
OCR + Structure
       ↓
Fields / Content
       ↓
LLM explanation
```

Official docs: -
https://docs.sarvam.ai/api/getting-started/models/sarvam-105b -
https://docs.sarvam.ai/api/getting-started/models -
https://docs.sarvam.ai/api/getting-started/models/bulbul -
https://docs.sarvam.ai/api/api-guides-tutorials/document-intelligence/overview

------------------------------------------------------------------------

# 🏗️ Technical Architecture

``` text
┌─────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND                     │
│  Chat UI • Voice UI • Document Upload • Language       │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 NEXT.JS API ROUTE                       │
│                       /api/chat                          │
│                                                         │
│  • Validates requests                                   │
│  • Keeps API key server-side                            │
│  • Routes text / voice / document workflows             │
└───────────────┬─────────────────┬───────────────────────┘
                │                 │
                ▼                 ▼
          Sarvam-105B          Saaras
                │                 │
                │                 ▼
                │              Transcript
                │                 │
                └────────┬────────┘
                         ▼
                    Citizen Answer
                         │
                         ▼
                       Bulbul
                         │
                         ▼
                  Spoken Response

                     + Document AI
                         │
                         ▼
                   Sarvam Vision
                         │
                         ▼
                  Structured Data
                         │
                         ▼
                    Sarvam-105B
```

------------------------------------------------------------------------

# 🛠️ Tech Stack

### Frontend

-   Next.js 16
-   React
-   TypeScript
-   Tailwind CSS
-   App Router

### AI

-   Sarvam-105B
-   Saaras Speech-to-Text
-   Bulbul v3 Text-to-Speech
-   Sarvam Vision / Document AI

### Deployment

-   Vercel
-   GitHub

------------------------------------------------------------------------

# 📁 Project Structure

``` text
nammasahay/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── sarvam/
│       └── client.ts
├── public/
├── .env.local
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.ts
└── README.md
```

------------------------------------------------------------------------

# ⚙️ Local Setup

## Prerequisites

-   Node.js 20+
-   npm
-   Git
-   Sarvam API key

## 1. Clone

``` bash
git clone https://github.com/24f2006688/nammasahay.git
cd nammasahay
```

## 2. Install

``` bash
npm install
```

## 3. Configure

Create `.env.local`:

``` env
SARVAM_API_KEY=your_sarvam_api_key
```

**Never commit `.env.local`.**

## 4. Run

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# 🔐 Security

The Sarvam API key stays server-side.

``` text
Browser
   │
   │ No API key
   ▼
Next.js API Route
   │
   │ SARVAM_API_KEY
   ▼
Sarvam API
```

Use:

``` env
SARVAM_API_KEY=...
```

Do **not** expose it through browser-side variables such as:

``` env
NEXT_PUBLIC_SARVAM_API_KEY=...
```

------------------------------------------------------------------------

# 🌐 Deployment

Deploy through Vercel:

1.  Import `24f2006688/nammasahay`
2.  Select Next.js
3.  Add `SARVAM_API_KEY` under Environment Variables
4.  Deploy
5.  Test the live URL

**Live Demo:** `YOUR_VERCEL_URL`

------------------------------------------------------------------------

# 🧪 Demo Scenarios

### Scenario 1 --- Everyday service

``` text
Aadhaar card-ai eppadi update panrathu?
```

``` text
Text / Voice
     ↓
Sarvam-105B
     ↓
Tamil / Tanglish explanation
```

### Scenario 2 --- Voice-first citizen

``` text
எனக்கு பாஸ்போர்ட் apply பண்ணணும்.
என்ன documents வேண்டும்?
```

``` text
Voice → Saaras → Sarvam-105B → Bulbul → Voice
```

### Scenario 3 --- Document understanding

``` text
PDF / Image
    ↓
Sarvam Vision
    ↓
Structured extraction
    ↓
Sarvam-105B
    ↓
"What does this mean?"
"What should I do next?"
```

------------------------------------------------------------------------

# 💡 Why This Architecture?

A conventional chatbot assumes:

``` text
User → Keyboard → English → Chatbot
```

NammaSahay aims for:

``` text
User
 ├── speaks
 ├── types
 └── uploads a document
          ↓
      AI understands
          ↓
  responds in the user's
  preferred language
```

The interface becomes a bridge between people and digital information.

------------------------------------------------------------------------

# 🎯 Design Principles

### 1. Language should not be a barrier

Users should not have to translate their thoughts into English before
asking for help.

### 2. Voice is a first-class input

Speaking can be more natural than typing.

### 3. Documents should become understandable

The useful output is not just extracted text:

-   What is this?
-   What does it mean?
-   What is important?
-   What should I do next?

### 4. Keep interaction simple

The AI complexity stays behind the interface.

``` text
Ask → Understand → Act
```

------------------------------------------------------------------------

# 🔮 Roadmap

## Phase 1 --- Current

-   [x] Multilingual chat
-   [x] Sarvam-105B reasoning
-   [x] Voice input
-   [x] Speech-to-text
-   [x] Text-to-speech
-   [x] Document upload
-   [x] Document extraction
-   [x] Document explanation
-   [x] Responsive web UI

## Phase 2

-   [ ] Conversation history
-   [ ] Automatic language detection
-   [ ] Improved code-mixed handling
-   [ ] Streaming voice interaction
-   [ ] More document templates
-   [ ] Verified official-source layer
-   [ ] Accessibility improvements

## Phase 3

-   [ ] Government-service workflow navigation
-   [ ] Personalized document checklist
-   [ ] Application-status assistance
-   [ ] RAG over verified government information
-   [ ] WhatsApp integration
-   [ ] Low-bandwidth mode
-   [ ] PWA / mobile app

------------------------------------------------------------------------

# 🏆 Hackathon Pitch

### 30-second version

> **NammaSahay is a multilingual, voice-first AI assistant for India's
> citizens. Instead of forcing people to type in English and navigate
> complicated information, users can speak or type naturally in their
> own language. Saaras converts speech to text, Sarvam-105B understands
> the request and generates the response, and Bulbul speaks the answer
> back. Users can also upload government documents and have Sarvam
> Vision extract and explain important information. The goal is simple:
> make digital information understandable and accessible in the language
> people actually use.**

### One-line pitch

> **NammaSahay turns India's complex digital information into a
> conversation people can have in their own language.**

------------------------------------------------------------------------

# 📊 Product Snapshot

  Dimension               NammaSahay
  ----------------------- -----------------------------
  Primary users           Indian citizens
  Interaction             Text + Voice + Documents
  AI reasoning            Sarvam-105B
  Speech recognition      Saaras
  Speech synthesis        Bulbul v3
  Document intelligence   Sarvam Vision / Document AI
  Frontend                Next.js + TypeScript
  Styling                 Tailwind CSS
  Deployment              Vercel
  Repository              `24f2006688/nammasahay`

------------------------------------------------------------------------

# 🌱 Vision

Technology becomes truly useful when people do not have to change
themselves to use it.

NammaSahay is built around one principle:

> ## **AI should meet people where they are --- in their language, their voice, and their everyday context.**

------------------------------------------------------------------------

## 🔗 Links

-   **GitHub:** https://github.com/24f2006688/nammasahay
-   **Live Demo:** `YOUR_VERCEL_URL`
-   **Sarvam AI:** https://www.sarvam.ai/
-   **Sarvam API Docs:** https://docs.sarvam.ai/

------------------------------------------------------------------------

::: {align="center"}
## 🇮🇳 NammaSahay

### **Ask naturally. Speak naturally. Understand documents.**

**Built with ❤️ using Sarvam AI**

**Sarvam Campus '26 × IIT Madras**
:::
