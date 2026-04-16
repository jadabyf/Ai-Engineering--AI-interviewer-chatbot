import { DetectInappropriateAnswerResult } from "@/types/coaching";
import { DetectInappropriateAnswerInput } from "@/types/mcp";
import { detectToneFlags } from "@/server/tools/answerIntelligenceUtils";

export function detectInappropriateAnswerHandler(
  input: DetectInappropriateAnswerInput
): DetectInappropriateAnswerResult {
  const flags = detectToneFlags(input.answer);
  const reasons: string[] = [];

  if (flags.includes("profanity")) {
    reasons.push("Contains profanity that appears unprofessional in interview settings.");
  }
  if (flags.includes("aggressive")) {
    reasons.push("Language sounds aggressive or disrespectful.");
  }
  if (flags.includes("dismissive")) {
    reasons.push("Tone sounds dismissive of responsibility or collaboration.");
  }

  const flagged = reasons.length > 0;
  const severity: "low" | "medium" | "high" =
    flags.includes("profanity") || flags.includes("aggressive")
      ? "high"
      : flagged
        ? "medium"
        : "low";

  if (!flagged) {
    return {
      flagged: false,
      severity: "low",
      reasons: [],
      interviewRisk: "No strong professionalism risk detected.",
      saferAlternativeTone: "Keep language concise, respectful, and ownership-focused.",
      exampleRewrite: "I stayed calm, explained my reasoning clearly, and focused on a constructive outcome.",
    };
  }

  return {
    flagged: true,
    severity,
    reasons,
    interviewRisk:
      "Interviewers may interpret this tone as poor judgment, low collaboration, or weak professionalism.",
    saferAlternativeTone:
      "Use calm, objective language that focuses on actions, tradeoffs, and outcomes rather than frustration.",
    exampleRewrite:
      "I was frustrated by the issue, but I focused on diagnosing the root cause, aligned with the team, and delivered a clear fix.",
  };
}
