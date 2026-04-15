# AI Interview Coach

AI Interview Coach is a beginner-friendly Next.js project for practicing mock interviews.

The app demonstrates:

- React / Next.js frontend skills
- MCP-style tool usage (as local function modules)
- AI-agent-like orchestration behavior
- basic eval-style feedback logic

## Features

- Choose interview type: Behavioral, Technical, General HR
- Start interview and receive one question at a time
- Submit answer and get:
  - score (1-10)
  - feedback
  - strengths
  - improvements
  - improved version of your answer
- Continue to next question
- Session summary (questions completed, average score, latest score)
- STAR tip box for behavioral interviews
- Starter question examples by type

## Project Structure

```text
ai-interview-coach/
  src/
    app/
      globals.css
      layout.tsx
      page.tsx
    components/
      FeedbackCard.tsx
      InterviewCoach.module.css
      InterviewCoach.tsx
      SessionSummary.tsx
      StarTipBox.tsx
    lib/
      interviewAgent.ts
    tools/
      evaluateAnswerTool.ts
      generateQuestionTool.ts
      improveAnswerTool.ts
    types/
      interview.ts
```

## How It Works

1. UI layer (`components/`) collects user input and shows outputs.
2. Logic layer (`lib/interviewAgent.ts`) orchestrates tool calls.
3. Tool layer (`tools/`) generates questions, evaluates answers, and improves answers.

## Run Locally

1. Install dependencies

```bash
npm install
```

1. Start development server

```bash
npm run dev
```

1. Open in browser

```text
http://localhost:3000
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Dependencies

Core dependencies:

- next
- react
- react-dom

Dev dependencies:

- typescript
- eslint
- eslint-config-next
- @types/node
- @types/react
- @types/react-dom
