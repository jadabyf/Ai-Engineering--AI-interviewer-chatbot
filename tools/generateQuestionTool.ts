/**
 * generateQuestionTool
 *
 * Selects a question from the static question bank for the given genre.
 * Optionally filters by difficulty. Avoids repeating recently asked questions
 * by accepting an array of already-used question IDs.
 */

import { questions } from "@/data/questions";
import { GenerateQuestionResult, InterviewGenre } from "@/types";

export function generateQuestionTool(
  genre: InterviewGenre,
  difficulty?: "easy" | "medium" | "hard",
  usedIds: string[] = []
): GenerateQuestionResult {
  // Filter by genre
  let pool = questions.filter((q) => q.genre === genre);

  // Filter by difficulty if specified
  if (difficulty) {
    const filtered = pool.filter((q) => q.difficulty === difficulty);
    // Fall back to all genre questions if no match at the requested difficulty
    if (filtered.length > 0) {
      pool = filtered;
    }
  }

  // Remove already-used questions to avoid repetition
  const fresh = pool.filter((q) => !usedIds.includes(q.id));

  // If all questions have been used, reset and use the full pool
  const candidates = fresh.length > 0 ? fresh : pool;

  // Pick a random question from the remaining candidates
  const question = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    question,
    genre,
    tip: question.tip,
  };
}
