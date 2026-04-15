export type InterviewType = "behavioral" | "technical" | "hr";

export interface EvaluationResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface ImprovedAnswerResult {
  improvedAnswer: string;
}

export interface InterviewTurnResult {
  evaluation: EvaluationResult;
  improved: ImprovedAnswerResult;
}

export interface AnswerHistoryItem {
  question: string;
  answer: string;
  interviewType: InterviewType;
  score: number;
}
