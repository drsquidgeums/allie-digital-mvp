# Allie.ai – Digital Learning Support Web Application

<p align="left">
  <strong>AI powered assistive learning tools for students with ADHD and comorbid learning differences.</strong>
</p>

<p align="left">
  <a href="https://alliedigital.org.uk">Website</a> •
  <a href="https://discord.com/invite/wAwjSyqY6a">Discord</a> •
  <a href="https://allie.org.uk">Live App</a>
</p>

---

## ✨ Features

- **Bionic Reading** – Bold the first half of each word to guide the eye and improve reading speed
- **Beeline Reader** – Apply a colour gradient across lines to reduce line-skipping
- **Irlen Overlay** – Customisable colour overlays for visual stress relief
- **Text-to-Speech** – AI-powered voice reading using ElevenLabs
- **Speech-to-Text** – Dictate notes and documents hands-free
- **AI Simplify** – Rewordify complex text into plain language (OpenAI)
- **Document AI Chat** – Ask questions about your documents (Anthropic)
- **Voice AI Assistant** – Conversational AI tutor
- **Learning AI** – Generate flashcards, quizzes, and mind maps from documents
- **Pomodoro Timer** – Built-in focus timer with ambient music
- **Focus Mode** – Distraction-free reading environment
- **Mind Maps** – Visual note-taking and concept mapping
- **PDF & DOCX Support** – Upload and annotate documents in the browser

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| Backend | Supabase (Auth, Database, Edge Functions, Storage) |
| AI | OpenAI, Anthropic, ElevenLabs |
| Editor | TipTap |
| Payments | Stripe |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Supabase project (for backend features)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/allie-web-app.git
cd allie-web-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

The app uses Supabase for backend services. Configure your Supabase URL and anon key in the integration client file or via environment variables.

For AI features, users can provide their own API keys (BYOK) in Settings, or use the shared monthly credit system:

| Provider | Monthly Free Credits |
|----------|---------------------|
| OpenAI | 15 |
| Anthropic | 15 |
| ElevenLabs | 10 |

## 📁 Project Structure

```
src/
├── components/           # UI components
│   ├── ai/               # AI chat & assistants
│   ├── document-viewer/   # Document viewer & toolbar
│   ├── sidebar/           # Navigation sidebar
│   ├── settings/          # Settings panels
│   └── ui/                # shadcn/ui primitives
├── hooks/                 # Custom React hooks
├── pages/                 # Route pages
├── integrations/          # Supabase client & types
└── lib/                   # Utilities
```

## 🤝 Community

Join our Discord server to get help, share feedback, and connect with other users:

[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?logo=discord&logoColor=white)](https://discord.com/invite/wAwjSyqY6a)

## 📄 Licence

This project is open source. See the [Open Source Licence](/open-source-license) page in the app for details.

## 🏢 About

Built by **Allie Digital CIC** — a Community Interest Company dedicated to making education accessible for everyone.

© Allie Digital CIC 2026. All Rights Reserved.
