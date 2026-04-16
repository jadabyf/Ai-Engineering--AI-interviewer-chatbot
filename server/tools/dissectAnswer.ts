import { DissectAnswerResult, DissectedSection } from "@/types/dissection";
import { DissectAnswerInput } from "@/types/mcp";
import {
  hasActionLanguage,
  hasMetric,
  hasOwnership,
  hasReasoning,
  hasResultLanguage,
  splitSentences,
  topicRecommendedFlow,
  wordCount,
} from "@/server/tools/answerIntelligenceUtils";

function scoreSection(section: string): number {
  let score = 0;
  if (section.length >= 40) score += 2;
  if (hasOwnership(section)) score += 2;
  if (hasActionLanguage(section)) score += 2;
  if (hasReasoning(section)) score += 2;
  if (hasResultLanguage(section) || hasMetric(section)) score += 2;
  return score;
}

function createSection(label: string, userText: string): DissectedSection {
  const issueType: string[] = [];
  const whatIsMissing: string[] = [];

  if (!hasOwnership(userText)) {
    issueType.push("low-ownership");
    whatIsMissing.push("Clear first-person ownership");
  }
  if (!hasActionLanguage(userText)) {
    issueType.push("missing-actions");
    whatIsMissing.push("Concrete action steps");
  }
  if (!hasResultLanguage(userText) && !hasMetric(userText)) {
    issueType.push("missing-results");
    whatIsMissing.push("Outcome or measurable impact");
  }
  if (!hasReasoning(userText)) {
    issueType.push("weak-reasoning");
    whatIsMissing.push("Decision logic");
  }

  if (userText.length < 35) {
    issueType.push("too-brief");
    whatIsMissing.push("Sufficient detail");
  }

  const analysis =
    issueType.length === 0
      ? "This section is clear and specific, with solid ownership and outcome signals."
      : `This section is understandable but has ${issueType.length} clear gap${issueType.length > 1 ? "s" : ""}.`;

  const whyItIsWeak =
    issueType.length === 0
      ? "No major weakness detected in this section."
      : "Interviewers may not be able to trust your impact if this part lacks actions, reasoning, or results.";

  const howToImprove =
    issueType.length === 0
      ? "Keep this structure, and tighten phrasing for brevity."
      : "Add one explicit action, one decision reason, and one measurable result in this section.";

  const suggestedRewrite =
    issueType.length === 0
      ? userText
      : "I took ownership, explained why I chose that approach, and delivered a measurable improvement for the team.";

  return {
    label,
    userText,
    analysis,
    issueType,
    whatIsMissing,
    whyItIsWeak,
    howToImprove,
    suggestedRewrite,
  };
}

export function dissectAnswerHandler(input: DissectAnswerInput): DissectAnswerResult {
  const sentences = splitSentences(input.answer);
  const wc = wordCount(input.answer);

  const chunks: string[] = [];
  if (sentences.length <= 2) {
    chunks.push(input.answer.trim());
  } else {
    const third = Math.ceil(sentences.length / 3);
    chunks.push(sentences.slice(0, third).join(" "));
    chunks.push(sentences.slice(third, third * 2).join(" "));
    chunks.push(sentences.slice(third * 2).join(" "));
  }

  const labels = ["Opening", "Middle", "Closing"];
  const sections = chunks
    .filter((chunk) => chunk.trim().length > 0)
    .map((chunk, idx) => createSection(labels[idx] ?? `Section ${idx + 1}`, chunk.trim()));

  if (wc < 18) {
    sections.splice(0, sections.length, {
      label: "Single-line response",
      userText: input.answer.trim(),
      analysis: "The response is too short to demonstrate structured interview thinking.",
      issueType: ["too-short", "insufficient-structure"],
      whatIsMissing: ["Context", "Action detail", "Result", "Reasoning"],
      whyItIsWeak: "One-line answers usually look underprepared in interviews.",
      howToImprove: "Expand into 4 parts: context, your action, your reason, and measurable outcome.",
      suggestedRewrite:
        "In that situation, I clarified the goal, took ownership of the key action, and delivered a measurable improvement for the team.",
    });
  }

  const scores = sections.map((section) => scoreSection(section.userText));
  const maxIndex = scores.indexOf(Math.max(...scores));
  const minIndex = scores.indexOf(Math.min(...scores));

  const missingCoreElements = Array.from(
    new Set(sections.flatMap((section) => section.whatIsMissing))
  );

  return {
    sections,
    missingCoreElements,
    strongestFragment: sections[maxIndex]?.userText ?? input.answer,
    weakestFragment: sections[minIndex]?.userText ?? input.answer,
    recommendedAnswerFlow: topicRecommendedFlow[input.genre],
  };
}
