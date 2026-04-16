import { SetCustomQuestionInput } from "@/types/mcp";

export function setCustomQuestionHandler(input: SetCustomQuestionInput): {
  confirmedQuestion: string;
  starterMessage: string;
} {
  const cleaned = input.customQuestion.trim().replace(/\s+/g, " ");
  const confirmedQuestion = cleaned.endsWith("?") ? cleaned : `${cleaned}?`;

  return {
    confirmedQuestion,
    starterMessage:
      "Great choice. I have set your custom interview question and I am ready to evaluate your answer when you submit.",
  };
}
