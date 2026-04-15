/**
 * getSuggestionChipsTool
 *
 * Returns a list of contextual suggestion chips based on the current
 * app phase and genre. Chips guide the user toward the most useful
 * next action at each point in the interview flow.
 */

import { ChipContext, InterviewGenre, SuggestionChip } from "@/types";

// Human-readable genre labels for chips
const genreLabels: Record<InterviewGenre, string> = {
  behavioral: "Behavioral",
  technical: "Technical",
  hr: "HR",
  product: "Product",
  leadership: "Leadership",
  "customer-support": "Customer Support",
  sales: "Sales",
  internship: "Internship",
  stress: "Stress Handling",
  teamwork: "Teamwork",
};

export function getSuggestionChipsTool(context: ChipContext): SuggestionChip[] {
  const { phase, genre } = context;

  // ─── Landing / Genre Selection ────────────────────────────────────────────
  if (phase === "select-genre") {
    return [
      {
        label: "Start Behavioral Interview",
        action: "start-genre",
        payload: { genre: "behavioral" },
      },
      {
        label: "Give Me a Technical Question",
        action: "start-genre",
        payload: { genre: "technical" },
      },
      {
        label: "Ask a Leadership Question",
        action: "start-genre",
        payload: { genre: "leadership" },
      },
      {
        label: "Try Internship Interview",
        action: "start-genre",
        payload: { genre: "internship" },
      },
      {
        label: "Practice Product Thinking",
        action: "start-genre",
        payload: { genre: "product" },
      },
      {
        label: "Test My Stress Handling",
        action: "start-genre",
        payload: { genre: "stress" },
      },
    ];
  }

  // ─── Question Phase (answer not yet submitted) ─────────────────────────────
  if (phase === "question") {
    const chips: SuggestionChip[] = [
      {
        label: "Help Me Practice STAR Method",
        action: "star-tip",
      },
      {
        label: "Skip This Question",
        action: "next-question",
      },
      {
        label: "Change Genre",
        action: "change-genre",
      },
    ];

    // Show genre-specific tip chip
    if (genre === "behavioral") {
      chips.unshift({ label: "Show STAR Tips", action: "star-tip" });
    }
    if (genre === "technical") {
      chips.unshift({ label: "Get a Harder Question", action: "harder-question" });
    }

    return chips;
  }

  // ─── Feedback Phase (answer submitted, feedback shown) ─────────────────────
  if (phase === "feedback") {
    const chips: SuggestionChip[] = [
      {
        label: "Next Question",
        action: "next-question",
      },
      {
        label: "Give Me a Harder Question",
        action: "harder-question",
      },
      {
        label: "Rewrite My Answer Better",
        action: "rewrite-answer",
      },
      {
        label: "Evaluate My Answer Again",
        action: "evaluate-again",
      },
      {
        label: "Change Genre",
        action: "change-genre",
      },
      {
        label: "End Session",
        action: "end-session",
      },
    ];

    // Add a genre-specific practice chip
    if (genre) {
      chips.push({
        label: `More ${genreLabels[genre]} Questions`,
        action: "practice-genre",
        payload: { genre },
      });
    }

    return chips;
  }

  // ─── Summary Phase ────────────────────────────────────────────────────────
  if (phase === "summary") {
    return [
      {
        label: "Start New Session",
        action: "change-genre",
      },
      {
        label: "Practice Behavioral",
        action: "start-genre",
        payload: { genre: "behavioral" },
      },
      {
        label: "Practice Technical",
        action: "start-genre",
        payload: { genre: "technical" },
      },
      {
        label: "Practice Leadership",
        action: "start-genre",
        payload: { genre: "leadership" },
      },
    ];
  }

  return [];
}
