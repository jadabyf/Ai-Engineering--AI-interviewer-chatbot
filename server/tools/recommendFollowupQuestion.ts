import { RecommendFollowupQuestionResult } from "@/types/coaching";
import { RecommendFollowupQuestionInput } from "@/types/mcp";

const followupByTopic: Record<string, Record<string, string>> = {
  behavioral: {
    "missing-results": "Tell me about a time your work produced a measurable outcome. What changed because of your action?",
    "low-ownership": "Describe a conflict where you personally made the deciding call. What did you choose and why?",
    default: "Walk me through a challenge where your decision changed the final result.",
  },
  technical: {
    "weak-reasoning": "Describe a technical tradeoff you made recently. What options did you compare and why did you choose one?",
    "weak-structure": "Explain how you debugged a production issue, step by step.",
    default: "Explain a system design decision you made and how you validated it.",
  },
};

export function recommendFollowupQuestionHandler(
  input: RecommendFollowupQuestionInput
): RecommendFollowupQuestionResult {
  const issue = input.analysisResult.coachingPriority[0] ?? "default";
  const bank = followupByTopic[input.topic] ?? {};

  const recommendedQuestion = bank[issue] ?? bank.default ?? "Give me another example where you improved a difficult situation.";

  const targetSkill =
    issue === "missing-results"
      ? "Impact communication"
      : issue === "low-ownership"
        ? "Ownership and accountability"
        : issue === "weak-reasoning"
          ? "Decision reasoning"
          : issue === "weak-structure"
            ? "Structured communication"
            : "Applied clarity";

  return {
    recommendedQuestion,
    reason: `Chosen to directly train: ${targetSkill}.`,
    targetSkill,
  };
}
