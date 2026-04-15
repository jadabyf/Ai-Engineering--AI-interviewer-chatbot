# AI Interview Coach

> Practice interviews, get feedback, and improve your answers.

A polished Next.js web application built with **spec-driven development**. The app lets you practice mock interviews across 10 different genres, receive structured AI-style feedback, and see an improved version of your answers — all without requiring an LLM API.

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
├── app/                    # Next.js App Router pages + layout
├── components/             # React UI components
│   ├── ChatWindow.tsx      # Main session component (owns all state)
│   ├── GenreSelector.tsx   # Interview type selection grid
│   ├── MessageBubble.tsx   # Chat message display
│   ├── SuggestionChips.tsx # Contextual action chips
│   ├── FeedbackCard.tsx    # Evaluation result display
│   ├── ImprovedAnswerCard.tsx # Improved answer display
│   ├── SessionSummary.tsx  # End-of-session stats
│   └── StarTipBox.tsx      # STAR method coaching tip
├── tools/                  # Pure tool functions (the AI tool layer)
│   ├── generateQuestionTool.ts
│   ├── evaluateAnswerTool.ts
│   ├── improveAnswerTool.ts
│   └── getSuggestionChipsTool.ts
├── lib/                    # Service layer + genre metadata
│   ├── interviewService.ts # Orchestrates tools; called by UI
│   └── genres.ts           # Genre display info
├── data/
│   └── questions.ts        # 70+ question bank across 10 genres
├── types/
│   └── index.ts            # Shared TypeScript types
└── docs/                   # Spec documents
    ├── product-spec.md
    ├── technical-spec.md
    └── implementation-plan.md
```

---

## Interview Genres

| Genre | Focus |
| --- | --- |
| 🗣️ Behavioral | STAR-method storytelling |
| 💻 Technical | Logic, data structures, system design |
| 🤝 General HR | Culture fit, professionalism |
| 📦 Product Thinking | Tradeoffs, metrics, user empathy |
| 🏆 Leadership | Ownership, decision-making |
| 💬 Customer Support | Empathy, resolution mindset |
| 📈 Sales & Communication | Persuasion, rapport |
| 🎓 Internship / Entry-Level | Learning mindset, potential |
| 🔥 Stress & Pressure | Calm prioritization |
| 👥 Teamwork | Collaboration, conflict handling |

---

## Architecture

The app uses a **three-layer architecture**:

1. **UI Layer** — React components in `components/` and `app/`
2. **Service Layer** — `lib/interviewService.ts` orchestrates all tool calls
3. **Tool Layer** — Pure functions in `tools/` that handle question generation, evaluation, improvement, and chip selection

---

## Development

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # ESLint
```

---

## Deployment

Self-hosted production deployment is documented here:

- [`docs/deployment-self-hosted.md`](docs/deployment-self-hosted.md)

---

## Spec Documents

Read the full spec before diving into the code:

- [`docs/product-spec.md`](docs/product-spec.md) — Goals, features, user flows, acceptance criteria
- [`docs/technical-spec.md`](docs/technical-spec.md) — Architecture, data flow, evaluation logic
- [`docs/implementation-plan.md`](docs/implementation-plan.md) — Milestones, task order, testing checklist
