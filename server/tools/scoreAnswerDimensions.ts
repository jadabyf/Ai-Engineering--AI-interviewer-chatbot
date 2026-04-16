import { ScoreAnswerDimensionsResult } from "@/types/analysis";
import { ScoreAnswerDimensionsInput } from "@/types/mcp";
import {
  hasActionLanguage,
  hasMetric,
  hasOwnership,
  hasReasoning,
  professionalismScore,
  relevanceScore,
  splitSentences,
  wordCount,
} from "@/server/tools/answerIntelligenceUtils";

export function scoreAnswerDimensionsHandler(
  input: ScoreAnswerDimensionsInput
): ScoreAnswerDimensionsResult {
  const { question, answer, topic } = input;
  const sentences = splitSentences(answer);
  const wc = wordCount(answer);

  const relevance = relevanceScore(question, answer);

  const structureSignals =
    (sentences.length >= 3 ? 3 : 1) +
    (/\b(first|then|finally|after)\b/i.test(answer) ? 3 : 0) +
    (/\b(situation|task|action|result)\b/i.test(answer) ? 2 : 0) +
    (hasReasoning(answer) ? 2 : 0);
  const structure = Math.min(10, Math.max(1, structureSignals));

  const specificitySignals =
    (hasMetric(answer) ? 4 : 0) +
    (/\b(example|specifically|for instance|for example)\b/i.test(answer) ? 3 : 0) +
    (wc >= 60 ? 3 : wc >= 35 ? 2 : 1);
  const specificity = Math.min(10, Math.max(1, specificitySignals));

  const professionalism = professionalismScore(answer);
  const ownership = hasOwnership(answer) ? 8 : 3;

  const technicalDepthBase = /\b(technical|code|system|query|architecture|api|debug|tradeoff|complexity)\b/i.test(
    answer
  )
    ? 7
    : 3;
  const technicalDepth = topic === "technical" ? technicalDepthBase : Math.max(3, technicalDepthBase - 2);

  return {
    relevance,
    structure,
    specificity,
    professionalism,
    ownership,
    technicalDepth,
  };
}
