/**
 * interviewService
 *
 * The service layer is the single entry point for all interview logic.
 * UI components call these functions — they never call tools directly.
 * This keeps the tool layer decoupled and testable independently.
 */

import { generateQuestionTool } from "@/tools/generateQuestionTool";
import { evaluateAnswerTool } from "@/tools/evaluateAnswerTool";
import { improveAnswerTool } from "@/tools/improveAnswerTool";
import { getSuggestionChipsTool } from "@/tools/getSuggestionChipsTool";

import {
  EvaluationResult,
  GenerateQuestionResult,
  HistoryEntry,
  InterviewGenre,
  SuggestionChip,
} from "@/types";

// ─── Start Interview ──────────────────────────────────────────────────────────

/**
 * Called when a user selects a genre and starts the interview.
 * Returns the first question and initial suggestion chips.
 */
export function startInterview(genre: InterviewGenre): {
  questionResult: GenerateQuestionResult;
  chips: SuggestionChip[];
} {
  const questionResult = generateQuestionTool(genre);
  const chips = getSuggestionChipsTool({ phase: "question", genre });
  return { questionResult, chips };
}

// ─── Submit Answer ─────────────────────────────────────────────────────────────

/**
 * Called when a user submits their answer.
 * Orchestrates evaluate + improve + chips tools and returns all results.
 */
export function submitAnswer(
  question: string,
  answer: string,
  genre: InterviewGenre
): {
  evaluation: EvaluationResult;
  improvedAnswer: string;
  chips: SuggestionChip[];
} {
  const evaluation = evaluateAnswerTool(question, answer, genre);
  const { improvedAnswer } = improveAnswerTool(question, answer, genre);
  const chips = getSuggestionChipsTool({ phase: "feedback", genre });

  return { evaluation, improvedAnswer, chips };
}

// ─── Evaluate Existing Answer ─────────────────────────────────────────────────

/**
 * Re-runs evaluation for an existing answer without generating a new question.
 */
export function evaluateExistingAnswer(
  question: string,
  answer: string,
  genre: InterviewGenre
): {
  evaluation: EvaluationResult;
  chips: SuggestionChip[];
} {
  const evaluation = evaluateAnswerTool(question, answer, genre);
  const chips = getSuggestionChipsTool({ phase: "feedback", genre });
  return { evaluation, chips };
}

// ─── Improve Existing Answer ──────────────────────────────────────────────────

/**
 * Produces an improved version for an existing answer.
 */
export function improveExistingAnswer(
  question: string,
  answer: string,
  genre: InterviewGenre
): {
  improvedAnswer: string;
  chips: SuggestionChip[];
} {
  const { improvedAnswer } = improveAnswerTool(question, answer, genre);
  const chips = getSuggestionChipsTool({ phase: "feedback", genre });
  return { improvedAnswer, chips };
}

// ─── Next Question ─────────────────────────────────────────────────────────────

/**
 * Called when a user requests the next question.
 * Accepts an array of already-used question IDs to avoid repetition.
 */
export function nextQuestion(
  genre: InterviewGenre,
  usedIds: string[] = [],
  harder = false
): {
  questionResult: GenerateQuestionResult;
  chips: SuggestionChip[];
} {
  const difficulty = harder ? "hard" : undefined;
  const questionResult = generateQuestionTool(genre, difficulty, usedIds);
  const chips = getSuggestionChipsTool({ phase: "question", genre });
  return { questionResult, chips };
}

// ─── End Session ───────────────────────────────────────────────────────────────

/**
 * Called when a user ends their session.
 * Returns a summary built from the history of answered questions.
 */
export function endSession(history: HistoryEntry[]): {
  totalQuestions: number;
  averageScore: number;
  genre: InterviewGenre | null;
  chips: SuggestionChip[];
} {
  const totalQuestions = history.length;
  const averageScore =
    totalQuestions > 0
      ? Math.round(
          history.reduce((sum, entry) => sum + entry.evaluation.score, 0) / totalQuestions
        )
      : 0;

  // Use the most frequently practiced genre as the session genre
  const genreCounts: Partial<Record<InterviewGenre, number>> = {};
  history.forEach((entry) => {
    const g = entry.question.genre;
    genreCounts[g] = (genreCounts[g] ?? 0) + 1;
  });

  const genre =
    (Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as InterviewGenre) ?? null;

  const chips = getSuggestionChipsTool({ phase: "summary", genre });

  return { totalQuestions, averageScore, genre, chips };
}

// ─── Get Landing Chips ─────────────────────────────────────────────────────────

/**
 * Returns the initial suggestion chips shown on the landing/genre selection screen.
 */
export function getLandingChips(): SuggestionChip[] {
  return getSuggestionChipsTool({ phase: "select-genre", genre: null });
}
