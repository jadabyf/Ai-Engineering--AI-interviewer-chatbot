import { AnalyzeAnswerResult } from "@/types/analysis";
import { AnalyzeAnswerInput } from "@/types/mcp";
import {
  confidenceFromSignals,
  detectToneFlags,
  hasActionLanguage,
  hasMetric,
  hasOwnership,
  hasReasoning,
  hasResultLanguage,
  inferAnswerType,
  professionalismScore,
  relevanceScore,
  shortSummaryFromIssues,
  splitSentences,
  wordCount,
} from "@/server/tools/answerIntelligenceUtils";

export function analyzeAnswerHandler(input: AnalyzeAnswerInput): AnalyzeAnswerResult {
  const { topic, question, answer } = input;
  const wc = wordCount(answer);
  const sentences = splitSentences(answer);
  const collaborationRisk =
    /\b(i don'?t like working on a team|i hate teamwork|prefer to work alone|don'?t work well with others|teamwork is not for me)\b/i.test(
      answer
    );

  const relevanceToQuestion = relevanceScore(question, answer);
  const completeness = Math.min(10, wc >= 90 ? 10 : wc >= 60 ? 8 : wc >= 35 ? 6 : wc >= 20 ? 4 : 2);
  const specificity =
    (hasMetric(answer) ? 4 : 0) +
    (/\b(example|for example|specifically|for instance)\b/i.test(answer) ? 3 : 0) +
    (hasReasoning(answer) ? 3 : 1);
  const specificityScore = Math.min(10, Math.max(1, specificity));

  const structureSignals =
    (sentences.length >= 3 ? 4 : 2) +
    (/\b(first|then|finally|after|before)\b/i.test(answer) ? 3 : 0) +
    (/\b(situation|task|action|result)\b/i.test(answer) ? 3 : 0);
  const structureQuality = Math.min(10, Math.max(1, structureSignals));

  const professionalism = professionalismScore(answer);
  const toneFlags = detectToneFlags(answer);

  const detectedIssues: string[] = [];
  const detectedStrengths: string[] = [];

  if (wc < 25) detectedIssues.push("too-short");
  if (relevanceToQuestion <= 4) detectedIssues.push("low-relevance");
  if (!hasOwnership(answer)) detectedIssues.push("low-ownership");
  if (!hasActionLanguage(answer)) detectedIssues.push("missing-actions");
  if (!hasResultLanguage(answer)) detectedIssues.push("missing-results");
  if (!hasReasoning(answer) && topic === "technical") detectedIssues.push("weak-reasoning");
  if (professionalism <= 5) detectedIssues.push("professionalism-risk");
  if (collaborationRisk) detectedIssues.push("collaboration-risk");
  if (structureQuality <= 4) detectedIssues.push("weak-structure");
  if (specificityScore <= 4) detectedIssues.push("vague-language");

  if (relevanceToQuestion >= 7) detectedStrengths.push("Answer stays on topic.");
  if (hasOwnership(answer)) detectedStrengths.push("Ownership language is clear.");
  if (hasActionLanguage(answer)) detectedStrengths.push("Actions are described instead of generic claims.");
  if (hasResultLanguage(answer)) detectedStrengths.push("Impact language is present.");
  if (hasMetric(answer)) detectedStrengths.push("Uses measurable details.");
  if (professionalism >= 8 && !collaborationRisk) detectedStrengths.push("Professional interview tone.");
  if (detectedStrengths.length === 0) detectedStrengths.push("Intent to answer the question is present.");

  const weighted =
    relevanceToQuestion * 0.25 +
    completeness * 0.15 +
    specificityScore * 0.2 +
    structureQuality * 0.2 +
    professionalism * 0.2;
  const score = Math.max(1, Math.min(10, Math.round(weighted)));

  const coachingPriority = [...detectedIssues].sort((a, b) => {
    const order: Record<string, number> = {
      "professionalism-risk": 0,
      "low-relevance": 1,
      "too-short": 2,
      "missing-results": 3,
      "low-ownership": 4,
      "weak-reasoning": 5,
      "collaboration-risk": 6,
      "weak-structure": 7,
      "vague-language": 8,
      "missing-actions": 9,
    };
    return (order[a] ?? 99) - (order[b] ?? 99);
  });

  return {
    summary: shortSummaryFromIssues(coachingPriority, detectedStrengths),
    score,
    answerType: inferAnswerType(answer),
    confidenceLevel: confidenceFromSignals(detectedStrengths.length, detectedIssues.length),
    detectedIssues,
    detectedStrengths,
    relevanceToQuestion,
    completeness,
    specificity: specificityScore,
    structureQuality,
    professionalism,
    toneFlags,
    coachingPriority,
    topic,
  };
}
