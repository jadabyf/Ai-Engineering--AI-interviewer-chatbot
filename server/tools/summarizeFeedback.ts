import { SummarizeFeedbackResult } from "@/types/coaching";
import { SummarizeFeedbackInput } from "@/types/mcp";

export function summarizeFeedbackHandler(input: SummarizeFeedbackInput): SummarizeFeedbackResult {
  const score = input.analysisResult.score;
  const issue = input.analysisResult.coachingPriority[0];

  let summary = "Solid baseline answer with clear intent.";
  if (score <= 4) summary = "Answer is currently weak and needs clearer structure and evidence.";
  if (score >= 5 && score <= 7) summary = "Promising answer, but key details are still missing.";
  if (score >= 8) summary = "Strong answer with minor refinement opportunities.";

  if (issue === "professionalism-risk") {
    summary = "Main issue is tone professionalism, which can hurt interview outcomes.";
  }

  return {
    summary,
    topImprovements: input.coachingResult.topProblemsToFix.slice(0, 2),
  };
}
