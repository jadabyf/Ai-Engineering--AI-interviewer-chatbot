import { ChooseBestFeedbackModeResult } from "@/types/coaching";
import { ChooseBestFeedbackModeInput } from "@/types/mcp";

export function chooseBestFeedbackModeHandler(
  input: ChooseBestFeedbackModeInput
): ChooseBestFeedbackModeResult {
  if (input.professionalismResult.flagged) {
    return {
      mode: "professionalism-warning",
      reason: "Detected unprofessional tone that requires explicit correction.",
    };
  }

  if (input.analysisResult.score <= 4) {
    return {
      mode: "structured-rewrite",
      reason: "Answer quality is low; user needs concrete rewrite guidance.",
    };
  }

  if (input.analysisResult.coachingPriority.length >= 3) {
    return {
      mode: "deep-critique",
      reason: "Multiple gaps detected, so deep analysis is more useful than quick tips.",
    };
  }

  return {
    mode: "quick-summary",
    reason: "Answer has manageable issues and can improve with concise coaching.",
  };
}
