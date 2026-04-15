# Technical Spec — AI Interview Coach

## Architecture Overview

The app uses a three-layer architecture:

```
┌─────────────────────────────────────┐
│           UI / Frontend Layer        │
│  Next.js App Router + React          │
│  components/, app/                   │
└───────────────┬─────────────────────┘
                │ calls
┌───────────────▼─────────────────────┐
│         Logic / Service Layer        │
│  lib/interviewService.ts             │
│  Orchestrates tool calls + state     │
└───────────────┬─────────────────────┘
                │ uses
┌───────────────▼─────────────────────┐
│            Tool Layer               │
│  tools/generateQuestionTool.ts       │
│  tools/evaluateAnswerTool.ts         │
│  tools/improveAnswerTool.ts          │
│  tools/getSuggestionChipsTool.ts     │
└─────────────────────────────────────┘
```

---

## Folder Structure

```
/
├── app/
│   ├── layout.tsx           # Root layout, fonts, metadata
│   ├── page.tsx             # Home page — genre selector + chat init
│   └── globals.css          # Global styles (Tailwind base)
│
├── components/
│   ├── ChatWindow.tsx        # Main conversation container
│   ├── MessageBubble.tsx     # Individual message (user or bot)
│   ├── SuggestionChips.tsx   # Clickable chip row
│   ├── GenreSelector.tsx     # Genre cards grid
│   ├── FeedbackCard.tsx      # Structured feedback display
│   ├── ImprovedAnswerCard.tsx # Improved answer display
│   ├── SessionSummary.tsx    # End-of-session stats card
│   └── StarTipBox.tsx        # STAR method helper tip
│
├── tools/
│   ├── generateQuestionTool.ts   # Returns a question for genre
│   ├── evaluateAnswerTool.ts     # Returns score + feedback
│   ├── improveAnswerTool.ts      # Returns improved answer text
│   └── getSuggestionChipsTool.ts # Returns contextual chip list
│
├── lib/
│   └── interviewService.ts   # Orchestrates tools; single entry point for UI
│
├── types/
│   └── index.ts              # Shared TypeScript types
│
├── docs/
│   ├── product-spec.md
│   ├── technical-spec.md
│   └── implementation-plan.md
│
└── data/
    └── questions.ts          # Static question bank per genre
```

---

## Data Flow

```
User Action (e.g., "Submit Answer")
        │
        ▼
interviewService.ts
  → calls evaluateAnswerTool(question, answer, genre)
  → calls improveAnswerTool(question, answer, genre)
  → calls getSuggestionChipsTool({ phase: 'post-feedback', genre })
        │
        ▼
Component re-renders with new state
  → FeedbackCard receives evaluation result
  → ImprovedAnswerCard receives improved answer
  → SuggestionChips receives chip list
```

---

## State Management Approach

- **No external state library** (no Redux, no Zustand) — React `useState` and `useReducer` are sufficient
- All session state lives in `ChatWindow` (or a parent `useInterview` hook)
- State shape:

```ts
interface SessionState {
  genre: InterviewGenre | null;
  phase: 'select-genre' | 'question' | 'feedback' | 'summary';
  currentQuestion: Question | null;
  userAnswer: string;
  feedback: EvaluationResult | null;
  improvedAnswer: string | null;
  history: HistoryEntry[];
  chips: SuggestionChip[];
}
```

---

## Tool Layer Design

Each tool is a **pure function** — it takes input and returns output with no side effects.

### `generateQuestionTool(genre, difficulty?)`
- Picks from a static question bank filtered by genre
- Returns: `{ question, genre, tip? }`

### `evaluateAnswerTool(question, answer, genre)`
- Runs rule-based evaluation logic per genre
- Checks for keywords, length, structure
- Returns: `{ score, feedback, strengths[], improvements[], rubricNotes? }`

### `improveAnswerTool(question, answer, genre)`
- Rewrites the answer using a template approach
- Injects structure cues appropriate to the genre (STAR, empathy-first, logic-chain, etc.)
- Returns: `{ improvedAnswer }`

### `getSuggestionChipsTool(context)`
- Takes a phase + genre context object
- Returns an array of chips: `{ label, action, payload? }[]`

---

## Component Responsibilities

| Component | Responsibility |
|---|---|
| `GenreSelector` | Render genre grid; emit selected genre to parent |
| `ChatWindow` | Own session state; render conversation flow |
| `MessageBubble` | Display a single user or bot message |
| `SuggestionChips` | Render chip row; emit chip action to parent |
| `FeedbackCard` | Display structured evaluation (score, strengths, improvements) |
| `ImprovedAnswerCard` | Display improved answer text |
| `SessionSummary` | Display end-of-session stats |
| `StarTipBox` | Optional informational box about STAR method |

---

## Evaluation Logic Design

Each genre has its own scoring weight set:

| Genre | Key Signals |
|---|---|
| Behavioral | STAR keywords (Situation, Task, Action, Result), length ≥ 80 words |
| Technical | Specificity keywords (e.g., algorithm, complexity, tested), logical structure |
| HR | Professionalism markers, positive language, appropriate length |
| Product | Tradeoff language, user/customer mention, metrics awareness |
| Leadership | Ownership language ("I decided", "I led"), outcome focus |
| Customer Support | Empathy words ("I understand", "I apologize"), resolution framing |
| Sales | Persuasion cues, benefit language, confidence markers |
| Internship | Learning language ("I am eager", "I am learning"), humility markers |
| Stress | Calm framing ("I prioritized", "I stayed focused"), rational structure |
| Teamwork | Inclusive language ("we", "collaborated"), conflict acknowledgment |

**Scoring formula:** base score (5) + bonus points for each signal hit, capped at 10.

---

## Scalability Notes

- Question bank (`data/questions.ts`) can be extended without touching any tool logic
- Evaluation logic is isolated per genre — adding a new genre only requires a new case in the evaluator
- Tool functions are stateless — they can be called server-side or swapped for real LLM calls later
- The service layer (`interviewService.ts`) is the only place that would change if switching to an API-backed approach

---

## Risks / Assumptions

| Risk | Mitigation |
|---|---|
| Rule-based evaluation may feel shallow | Add enough keyword variety per genre; frame feedback thoughtfully |
| Improved answers are template-generated | Use enough variation in templates to avoid feeling robotic |
| Question bank may feel repetitive | Include at least 5–8 questions per genre; randomize selection |
| No persistence — state lost on refresh | Acceptable for MVP; add localStorage later if needed |
