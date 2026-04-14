# Lumina ✦

So I needed a place to evaluate my texts, write and process prompts for LLMs, and I wanted it to be fast and elegant. So I built Lumina. It's basically a non-bloated and simple alternative to quill-bot.

Lumina is an AI-powered text processing and prompt engineering suite designed to enhance writing, analysis, and LLM interactions. It provides a distraction-free environment for professional writing and AI-driven creative workflows.

## Features

- **Grammar & Style:** Advanced error detection with an optional "informal" mode to keep your natural voice.
- **Paraphrasing:** Rewrite text across multiple styles (Fluent, Formal, Playful, Academic, Slang, etc).
- **Summarization:** Generate high-fidelity summaries and extract key insights.
- **Tone Changer & Analysis:** Deconstruct text sentiment, formality, and emotional resonance. Also change the tone of the text to your desired tone.
- **Prompt Suite:**
  - **Make:** Convert rough concepts into production-ready LLM prompts.
  - **Optimize:** Refine existing prompts for clarity and performance.
  - **Rewrite:** Adapt prompts to new goals or specific stylistic constraints.

## Tech Stack

- **Core:** React 19 + Vite + TypeScript
- **AI Core:** [Vercel AI SDK](https://sdk.vercel.ai/)
- **Models:** Google Gemini 3 (via `@ai-sdk/google`)
- **Styling:** Tailwind CSS 4
- **Animation:** Motion (Framer Motion)
- **Icons:** Lucide React

## Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   bun install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```
4. **Run the development server:**
   ```bash
   bun run dev
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Amanuel Chaka](https://amanuelch.com)
