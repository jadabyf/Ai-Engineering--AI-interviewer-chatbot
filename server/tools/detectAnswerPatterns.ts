import { DetectAnswerPatternsResult } from "@/types/coaching";
import { DetectAnswerPatternsInput } from "@/types/mcp";
import { hasMetric, hasOwnership, wordCount } from "@/server/tools/answerIntelligenceUtils";

export function detectAnswerPatternsHandler(
  input: DetectAnswerPatternsInput
): DetectAnswerPatternsResult {
  const allAnswers = [...input.previousAnswerHistory, input.currentAnswer];
  const shortCount = allAnswers.filter((answer) => wordCount(answer) < 30).length;
  const missingOwnershipCount = allAnswers.filter((answer) => !hasOwnership(answer)).length;
  const noMetricCount = allAnswers.filter((answer) => !hasMetric(answer)).length;

  const recurringPatterns: string[] = [];
  if (shortCount >= 2) recurringPatterns.push("answers-too-short");
  if (missingOwnershipCount >= 2) recurringPatterns.push("low-ownership-language");
  if (noMetricCount >= 3) recurringPatterns.push("missing-results-or-metrics");

  const allIssues = input.previousAnalysisResults.flatMap((item) => item.detectedIssues);
  const allStrengths = input.previousAnalysisResults.flatMap((item) => item.detectedStrengths);

  const repeatedWeaknesses = Array.from(
    new Set(allIssues.filter((issue, _, arr) => arr.filter((x) => x === issue).length >= 2))
  );
  const repeatedStrengths = Array.from(
    new Set(allStrengths.filter((strength, _, arr) => arr.filter((x) => x === strength).length >= 2))
  );

  const scores = input.previousAnalysisResults.map((item) => item.score);
  const recentAvg = scores.slice(-2).reduce((sum, n) => sum + n, 0) / Math.max(1, scores.slice(-2).length);
  const olderAvg = scores.slice(0, -2).reduce((sum, n) => sum + n, 0) / Math.max(1, scores.slice(0, -2).length);

  const improvementTrend =
    scores.length < 3
      ? "Insufficient history for strong trend detection yet."
      : recentAvg > olderAvg + 0.8
        ? "Improving: recent answers show better structure and relevance."
        : recentAvg < olderAvg - 0.8
          ? "Declining: recent answers are less specific or complete than earlier ones."
          : "Stable: performance is consistent across recent answers.";

  const coachingAdjustment: string[] = [];
  if (recurringPatterns.includes("answers-too-short")) {
    coachingAdjustment.push("Ask user for minimum 4-sentence answers before deep scoring.");
  }
  if (recurringPatterns.includes("missing-results-or-metrics")) {
    coachingAdjustment.push("Prioritize coaching prompts that force outcome statements and metrics.");
  }
  if (recurringPatterns.includes("low-ownership-language")) {
    coachingAdjustment.push("Inject ownership-focused prompts: what did YOU decide and execute?");
  }
  if (coachingAdjustment.length === 0) {
    coachingAdjustment.push("Keep balanced coaching across structure, detail, and relevance.");
  }

  return {
    recurringPatterns,
    improvementTrend,
    repeatedWeaknesses,
    repeatedStrengths,
    coachingAdjustment,
  };
}
