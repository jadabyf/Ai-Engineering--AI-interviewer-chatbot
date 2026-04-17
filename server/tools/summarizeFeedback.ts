import { SummarizeFeedbackResult } from "@/types/coaching";
import { SummarizeFeedbackInput } from "@/types/mcp";

export function summarizeFeedbackHandler(input: SummarizeFeedbackInput): SummarizeFeedbackResult {
  const score = input.analysisResult.score;
  const issue = input.analysisResult.coachingPriority[0];

  const improvementLabels: Record<string, string> = {
    "too-short": "Your answer is too short. Use 4 sentences: context, your action, reasoning, and result.",
    "low-relevance": "Start by directly answering the question before adding background.",
    "low-ownership": "Use first-person ownership language: 'I decided', 'I led', 'I implemented'.",
    "missing-results": "Add a clear outcome with a metric or concrete business/team impact.",
    "weak-reasoning": "Explain why you chose your approach and what tradeoff you considered.",
    "professionalism-risk": "Tone sounds risky for interviews. Use calm, respectful, solution-focused language.",
    "collaboration-risk": "This response signals poor teamwork fit. Reframe to show collaboration and accountability.",
    "weak-structure": "Follow a simple flow: context, action, reasoning, result.",
    "vague-language": "Replace broad claims with one specific example and one measurable outcome.",
    "missing-actions": "Describe exactly what you did, not only what happened around you.",
  };

  let summary = "Solid baseline answer with clear intent.";
  if (score <= 4) summary = "Low-score response: it needs direct relevance, clearer ownership, and a concrete result.";
  if (score >= 5 && score <= 7) summary = "Promising answer, but key details are still missing.";
  if (score >= 8) summary = "Strong answer with minor refinement opportunities.";

  if (issue === "professionalism-risk") {
    summary = "Main issue is tone professionalism, which can hurt interview outcomes.";
  }

  return {
    summary,
    topImprovements: input.coachingResult.topProblemsToFix
      .slice(0, 2)
      .map((issueCode) => improvementLabels[issueCode] ?? issueCode),
  };
}
