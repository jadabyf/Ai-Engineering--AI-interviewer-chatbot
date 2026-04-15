// Shared TypeScript types for AI Interview Coach

// ─── Interview Genres ───────────────────────────────────────────────────────

export type InterviewGenre =
  | "behavioral"
  | "technical"
  | "hr"
  | "product"
  | "leadership"
  | "customer-support"
  | "sales"
  | "internship"
  | "stress"
  | "teamwork";

export interface GenreInfo {
  id: InterviewGenre;
  label: string;
  description: string;
  icon: string; // emoji icon
  tone: string;
  color: string; // Tailwind bg color class
}

// ─── Questions ───────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  genre: InterviewGenre;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  tip?: string; // Optional coaching tip shown alongside the question
}

// ─── Tool Return Types ───────────────────────────────────────────────────────

export interface GenerateQuestionResult {
  question: Question;
  genre: InterviewGenre;
  tip?: string;
}

export interface EvaluationResult {
  score: number; // 1–10
  feedback: string; // Overall summary sentence
  strengths: string[];
  improvements: string[];
  rubricNotes?: string; // Genre-specific rubric hint
}

export interface ImproveAnswerResult {
  improvedAnswer: string;
}

export interface SuggestionChip {
  label: string;
  action: ChipAction;
  payload?: Record<string, string>;
}

export type ChipAction =
  | "start-genre"
  | "next-question"
  | "harder-question"
  | "change-genre"
  | "evaluate-again"
  | "rewrite-answer"
  | "end-session"
  | "star-tip"
  | "practice-genre";

// ─── Session / App State ─────────────────────────────────────────────────────

export type SessionPhase =
  | "select-genre"  // Landing — user picks genre
  | "question"      // Question displayed, waiting for answer
  | "feedback"      // Answer submitted, feedback shown
  | "summary";      // Session ended, summary shown

export interface HistoryEntry {
  question: Question;
  userAnswer: string;
  evaluation: EvaluationResult;
  improvedAnswer: string;
}

export interface SessionState {
  genre: InterviewGenre | null;
  phase: SessionPhase;
  currentQuestion: Question | null;
  userAnswer: string;
  feedback: EvaluationResult | null;
  improvedAnswer: string | null;
  history: HistoryEntry[];
  chips: SuggestionChip[];
}

// ─── Context Object for Chips ─────────────────────────────────────────────────

export interface ChipContext {
  phase: SessionPhase;
  genre: InterviewGenre | null;
}
