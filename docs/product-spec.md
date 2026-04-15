# Product Spec — AI Interview Coach

## Project Overview

**AI Interview Coach** is a Next.js web application that simulates mock job interviews across multiple genres. Users select an interview type, receive questions, submit answers, and receive structured feedback along with an improved version of their answer. The app is designed to feel like a lightweight, polished coaching tool — not a rigid quiz.

---

## Target User

- University students preparing for internships or entry-level jobs
- Early-career professionals brushing up on interview skills
- Anyone who wants low-pressure, self-paced interview practice without scheduling a human coach

---

## Goals

1. Let users practice interviews in a conversational, guided experience
2. Cover 10 meaningful interview genres with distinct tones and question styles
3. Provide actionable feedback that teaches — not just scores
4. Use suggestion chips to keep users moving without friction
5. Look polished enough to include in a portfolio

---

## Non-Goals

- This is **not** a real-time AI chat application requiring a language model API
- This does **not** store user data or require authentication
- This does **not** generate a downloadable résumé or cover letter
- This does **not** require a backend database

---

## Core Features

| Feature | Description |
|---|---|
| Genre Selector | Landing screen where user picks an interview type |
| Question Display | Shows the current interview question in a card |
| Answer Input | Text area where user types their response |
| Feedback Section | Structured output: score, strengths, improvements |
| Improved Answer | A rewritten version of the user's answer |
| Suggestion Chips | Clickable chips that guide the next action |
| Session Summary | Optional end-of-session recap with scores |

---

## Interview Genres

Each genre has its own tone, question pool, and evaluation lens:

| Genre | Tone | Focus |
|---|---|---|
| **Behavioral** | Warm, reflective | STAR-method storytelling |
| **Technical** | Precise, analytical | Logic, specificity, clarity |
| **General HR** | Professional, conversational | Culture fit, professionalism |
| **Product / Product Thinking** | Strategic, curious | Tradeoffs, user empathy, prioritization |
| **Leadership** | Direct, accountable | Ownership, decision-making, vision |
| **Customer Support / Service** | Empathetic, calm | Empathy, resolution mindset |
| **Sales / Communication** | Confident, persuasive | Persuasion, clarity, energy |
| **Internship / Entry-Level** | Encouraging, curious | Learning mindset, potential |
| **Stress / Pressure Handling** | Challenging, probing | Calm reasoning, prioritization |
| **Teamwork / Collaboration** | Inclusive, balanced | Communication, conflict resolution |

---

## UX Expectations

- The experience should feel like a focused single-page app (SPA)
- The chat-style layout makes it feel conversational without needing a real chatbot backend
- Suggestion chips appear contextually (after genre select, after feedback, etc.)
- No page reloads between steps — all state transitions are in-memory
- Mobile-responsive

---

## User Flows

### Flow 1 — Start an Interview
1. User lands on homepage
2. User sees genre selector + suggestion chips ("Start Behavioral Interview", etc.)
3. User selects a genre
4. App generates a question and displays it

### Flow 2 — Answer & Get Feedback
1. User reads question
2. User types answer in text area
3. User clicks "Submit Answer"
4. App displays:
   - Score (e.g., 7/10)
   - Feedback (strengths + improvements)
   - Improved answer
5. Suggestion chips appear: "Next Question", "Try Harder Question", "Change Genre", "Evaluate My Answer Again"

### Flow 3 — Continue Practicing
1. User clicks "Next Question"
2. App generates a new question in the same genre
3. Repeat Flow 2

### Flow 4 — Session Summary (optional)
1. User clicks "End Session"
2. App shows summary: questions answered, average score, genre practiced

---

## Acceptance Criteria

- [ ] Genre selector renders all 10 genres
- [ ] Selecting a genre generates and displays a question
- [ ] Submitting an answer returns feedback with score, strengths, improvements
- [ ] An improved answer is displayed after feedback
- [ ] Suggestion chips appear at relevant moments
- [ ] Clicking a chip triggers the correct action
- [ ] "Next Question" generates a new question in the same genre
- [ ] UI is readable and consistent on mobile and desktop
- [ ] No broken states (empty inputs handled gracefully)
