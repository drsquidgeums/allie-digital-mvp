# Allie.ai – Digital Learning Support Web Application

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

<p align="left">
  <strong>AI powered assistive learning tool for students with ADHD and comorbid learning differences.</strong>
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
git clone https://github.com/drsquidgeums/allie-digital-mvp.git
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

Join our Discord server to get help, share feedback and report issues or bugs, and connect with other users:

[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?logo=discord&logoColor=white)](https://discord.com/invite/wAwjSyqY6a)

## ✨ Contributing
Allie.ai is an open source project built for the ADHD community, and contributions of all kinds are welcome — you don't need to be a developer to help make it better.

**Non-Technical Contributions**

- Bug Reports & Feedback
- If something isn't working as expected or you have a suggestion, open a GitHub Issue and describe what you experienced. Please include your browser, device, and steps to reproduce the issue where possible.
Feature Suggestions Have an idea for a new feature or improvement? We'd love to hear it — open an Issue with the label enhancement and describe what you'd like to see and why it would help.

**Technical Contributions**

- Reporting Bugs with Code Context
- If you've identified a bug and can pinpoint it in the code, open a GitHub Issue with as much technical detail as possible including any relevant error messages or logs.
Submitting a Pull Request

Fork the repository
- Create a new branch for your change (git checkout -b fix/your-fix-name)
- Make your changes and test them locally
- Submit a Pull Request with a clear description of what you changed and why

**Code Guidelines**

- Keep changes focused — one fix or feature per Pull Request
- Follow the existing code style and structure
- All modifications must remain licensed under AGPL v3 — by submitting a Pull Request you agree your contribution will be released under the same licence
  
**This project is maintained by a small team. We review contributions as regularly as we can and appreciate your patience. All contributors are expected to engage respectfully in line with our community ethos.**

## 📄 Licence

This project is open source and licensed under the GNU Affero General Public License v3.0. Check the LICENSE file in the root of this repository for the full licence text, or visit https://www.gnu.org/licenses/agpl-3.0.en.html for more information on permissions.

## 🏢 About

Built by **Allie Digital CIC** — a Community Interest Company dedicated to making education accessible for everyone.

© Allie Digital CIC 2026. All Rights Reserved.
