# Implementation Plan — AI Interview Coach

## Milestones

| Milestone | Deliverable |
|---|---|
| M1 | Spec docs complete |
| M2 | Next.js project scaffolded with types and folder structure |
| M3 | Tool layer implemented and unit-testable |
| M4 | Service layer wiring tools together |
| M5 | Core UI components built |
| M6 | App routes and full user flow working |
| M7 | Polish, responsiveness, and bug fixes |

---

## Task Order & Dependencies

### Phase 1 — Foundations
- [x] Write product-spec.md
- [x] Write technical-spec.md
- [x] Write implementation-plan.md
- [ ] Initialize Next.js project (TypeScript + Tailwind CSS)
- [ ] Create folder structure: app/, components/, tools/, lib/, types/, data/, docs/
- [ ] Define all TypeScript types in types/index.ts

### Phase 2 — Data
- [ ] Create data/questions.ts with 5–8 questions per genre (10 genres = 50–80 questions)
- [ ] Each question object has: id, genre, text, difficulty, tip?

### Phase 3 — Tool Layer
- [ ] Implement tools/generateQuestionTool.ts
- [ ] Implement tools/evaluateAnswerTool.ts (genre-aware, rule-based)
- [ ] Implement tools/improveAnswerTool.ts (genre-aware templates)
- [ ] Implement tools/getSuggestionChipsTool.ts (phase-aware chips)

### Phase 4 — Service Layer
- [ ] Implement lib/interviewService.ts
  - startInterview(genre) → calls generateQuestionTool
  - submitAnswer(question, answer, genre) → calls evaluate + improve + chips
  - nextQuestion(genre) → calls generateQuestionTool + chips
  - endSession(history) → returns summary data

### Phase 5 — UI Components
- [ ] components/GenreSelector.tsx — grid of genre cards
- [ ] components/ChatWindow.tsx — session state owner, renders flow
- [ ] components/MessageBubble.tsx — user vs bot styling
- [ ] components/SuggestionChips.tsx — chip row with click handler
- [ ] components/FeedbackCard.tsx — score + strengths + improvements
- [ ] components/ImprovedAnswerCard.tsx — improved answer block
- [ ] components/SessionSummary.tsx — end-of-session recap
- [ ] components/StarTipBox.tsx — optional STAR tip

### Phase 6 — App Routes
- [ ] app/layout.tsx — root layout with metadata and fonts
- [ ] app/page.tsx — home page, renders ChatWindow
- [ ] app/globals.css — Tailwind base + custom utilities

### Phase 7 — Polish
- [ ] Review all chips for contextual accuracy
- [ ] Test all 10 genre flows end-to-end
- [ ] Verify mobile layout
- [ ] Fix edge cases (empty answer, genre not selected)
- [ ] Review copy/tone for each genre's feedback

---

## Dependencies

| Dependency | Why |
|---|---|
| next | App router, React Server Components support |
| react 18 | UI library |
| typescript | Type safety across tool/service/component layers |
| tailwindcss | Utility-first styling |
| @tailwindcss/typography | Readable prose for feedback text (optional) |
| lucide-react | Clean icons for genre cards and UI accents |

---

## Testing Checklist

- [ ] Genre selector shows all 10 genres
- [ ] Each genre generates a question
- [ ] Answer submission produces feedback with score
- [ ] Score is between 1–10
- [ ] Strengths and improvements are non-empty strings
- [ ] Improved answer is generated and displayed
- [ ] Suggestion chips appear after feedback
- [ ] Chips trigger correct actions (next question, change genre, etc.)
- [ ] Empty answer shows validation message
- [ ] Session summary shows correct stats
- [ ] App renders correctly on mobile (375px) and desktop (1280px)

---

## Polish Checklist

- [ ] Consistent spacing and padding throughout
- [ ] Feedback card has visual hierarchy (score prominent, details below)
- [ ] Chips look polished — pill shape, hover states
- [ ] Genre cards have icons and genre-specific accent color
- [ ] Transitions between phases feel smooth (no jarring repaints)
- [ ] Error states are handled gracefully
- [ ] Typography is readable at all sizes
- [ ] Color contrast is accessible (WCAG AA minimum)
