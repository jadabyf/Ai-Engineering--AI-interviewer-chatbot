import { InterviewGenre } from "@/types";

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "of",
  "for",
  "in",
  "on",
  "at",
  "is",
  "are",
  "was",
  "were",
  "be",
  "this",
  "that",
  "it",
  "i",
  "we",
  "you",
  "my",
  "our",
  "with",
  "as",
  "by",
  "from",
  "about",
  "how",
  "what",
  "when",
  "why",
  "which",
  "did",
  "do",
  "does",
  "have",
  "has",
]);

const PROFANITY_PATTERNS = [/\bfuck\b/i, /\bshit\b/i, /\bbitch\b/i, /\basshole\b/i, /\bdamn\b/i];
const AGGRESSIVE_PATTERNS = [/\bidiot\b/i, /\bstupid\b/i, /\bhate\b/i, /\bwhatever\b/i, /\bnot my problem\b/i];
const DISMISSIVE_PATTERNS = [/\bdon'?t care\b/i, /\bwho cares\b/i, /\bjust do it\b/i, /\bdeal with it\b/i];

export const topicRecommendedFlow: Record<InterviewGenre, string[]> = {
  behavioral: ["Context", "Responsibility", "Action", "Result"],
  technical: ["Problem", "Approach", "Reasoning", "Outcome"],
  hr: ["Direct answer", "Evidence", "Role fit", "Close"],
  product: ["User problem", "Tradeoff", "Decision", "Metric"],
  leadership: ["Challenge", "Ownership", "Execution", "Impact"],
  "customer-support": ["Empathy", "Diagnosis", "Resolution", "Follow-up"],
  sales: ["Discovery", "Value mapping", "Objection handling", "Next step"],
  internship: ["Motivation", "Project evidence", "Learning goal", "Contribution"],
  stress: ["Stabilize", "Prioritize", "Communicate", "Reflect"],
  teamwork: ["Shared goal", "Collaboration", "Conflict handling", "Result"],
};

export function cleanWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function wordCount(text: string): number {
  return cleanWords(text).length;
}

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function containsAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export function extractQuestionKeywords(question: string): string[] {
  return cleanWords(question).filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

export function relevanceScore(question: string, answer: string): number {
  const qWords = extractQuestionKeywords(question);
  if (qWords.length === 0) return 6;

  const answerWords = new Set(cleanWords(answer));
  const overlap = qWords.filter((word) => answerWords.has(word)).length;
  const ratio = overlap / qWords.length;

  if (ratio >= 0.75) return 10;
  if (ratio >= 0.55) return 8;
  if (ratio >= 0.35) return 6;
  if (ratio >= 0.2) return 4;
  return 2;
}

export function hasOwnership(answer: string): boolean {
  return /\b(i|my|me|i led|i decided|i owned|i implemented|i built)\b/i.test(answer);
}

export function hasMetric(answer: string): boolean {
  return /(\d+%|\d+\s*(days?|weeks?|months?|hours?|mins?|tickets?|users?|customers?|bugs?)|\$\d+)/i.test(
    answer
  );
}

export function hasResultLanguage(answer: string): boolean {
  return /\b(result|outcome|impact|improved|reduced|increased|achieved|delivered)\b/i.test(answer);
}

export function hasReasoning(answer: string): boolean {
  return /\b(because|therefore|so that|tradeoff|reason|given that|due to)\b/i.test(answer);
}

export function hasActionLanguage(answer: string): boolean {
  return /\b(implemented|created|designed|led|coordinated|fixed|resolved|prioritized|tested|shipped)\b/i.test(
    answer
  );
}

export function inferAnswerType(answer: string): "direct" | "story" | "technical-walkthrough" | "mixed" | "unclear" {
  const sentenceCount = splitSentences(answer).length;
  const hasStoryMarkers = /\b(when|situation|task|then|after|finally|result)\b/i.test(answer);
  const hasTechnicalMarkers = /\b(architecture|algorithm|tradeoff|debug|latency|scalability|complexity)\b/i.test(answer);

  if (sentenceCount <= 1) return "direct";
  if (hasStoryMarkers && hasTechnicalMarkers) return "mixed";
  if (hasTechnicalMarkers) return "technical-walkthrough";
  if (hasStoryMarkers) return "story";
  return sentenceCount > 2 ? "mixed" : "unclear";
}

export function detectToneFlags(answer: string): string[] {
  const flags: string[] = [];

  if (containsAny(answer, PROFANITY_PATTERNS)) flags.push("profanity");
  if (containsAny(answer, AGGRESSIVE_PATTERNS)) flags.push("aggressive");
  if (containsAny(answer, DISMISSIVE_PATTERNS)) flags.push("dismissive");
  if (/\b(never|always|obviously)\b/i.test(answer)) flags.push("overconfident");

  return flags;
}

export function professionalismScore(answer: string): number {
  let score = 10;
  const toneFlags = detectToneFlags(answer);

  if (toneFlags.includes("profanity")) score -= 5;
  if (toneFlags.includes("aggressive")) score -= 3;
  if (toneFlags.includes("dismissive")) score -= 2;
  if (/\b(um|like|you know)\b/i.test(answer)) score -= 1;

  return Math.max(1, Math.min(10, score));
}

export function confidenceFromSignals(strengthCount: number, issueCount: number): "low" | "medium" | "high" {
  if (strengthCount >= 4 && issueCount <= 2) return "high";
  if (strengthCount >= 2 && issueCount <= 4) return "medium";
  return "low";
}

export function shortSummaryFromIssues(issues: string[], strengths: string[]): string {
  if (issues.length === 0) {
    return "Strong answer with clear relevance and good structure.";
  }

  const firstIssue = issues[0];
  if (firstIssue === "too-short") return "Answer is too short to show depth.";
  if (firstIssue === "low-relevance") return "Answer does not directly address the question.";
  if (firstIssue === "missing-results") return "Good effort, but outcome and impact are missing.";
  if (firstIssue === "professionalism-risk") return "Tone needs to be more professional for interviews.";

  if (strengths.length > 0) {
    return `${strengths[0]} Next focus: ${firstIssue.replace(/-/g, " ")}.`;
  }

  return "Needs clearer structure and stronger evidence.";
}
