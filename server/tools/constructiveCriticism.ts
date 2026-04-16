import { evaluateAnswerTool } from "@/tools/evaluateAnswerTool";
import { improveAnswerTool } from "@/tools/improveAnswerTool";
import { ConstructiveCriticismResult } from "@/types/constructiveCriticism";
import { ConstructiveCriticismInput } from "@/types/mcp";

const topicFrameworks: Record<ConstructiveCriticismInput["topic"], string[]> = {
  behavioral: [
    "Situation: Briefly set the context in one sentence.",
    "Task: Explain your responsibility and target.",
    "Action: Detail what you personally did step by step.",
    "Result: Share measurable impact and your key takeaway.",
  ],
  technical: [
    "Problem framing: Define the technical goal clearly.",
    "Approach: Explain architecture, algorithm, or debugging steps.",
    "Tradeoffs: Mention complexity, scalability, or reliability concerns.",
    "Outcome: State result, validation, and what you learned.",
  ],
  hr: [
    "Direct answer: Respond to the prompt with confidence.",
    "Evidence: Support with one clear example.",
    "Role fit: Connect your values and strengths to the role.",
    "Close: End with enthusiasm and professionalism.",
  ],
  leadership: [
    "Context: Define team challenge and stakes.",
    "Ownership: Clarify your decision-making role.",
    "Execution: Describe communication and alignment actions.",
    "Impact: Share team and business outcomes.",
  ],
  product: [
    "User problem: Identify user pain and objective.",
    "Prioritization: Explain what you would do first and why.",
    "Tradeoffs: Compare options with clear reasoning.",
    "Metrics: Define how success will be measured.",
  ],
  "customer-support": [
    "Empathy first: Acknowledge customer frustration.",
    "Diagnosis: Clarify root cause with questions.",
    "Resolution: Explain step-by-step support actions.",
    "Follow-up: Confirm closure and trust rebuilding.",
  ],
  sales: [
    "Discovery: Ask questions to uncover needs.",
    "Value mapping: Tie solution to business outcomes.",
    "Objections: Address concerns with confidence.",
    "Close: Propose clear next step.",
  ],
  internship: [
    "Mindset: Show curiosity and willingness to learn.",
    "Evidence: Mention project/course experience.",
    "Growth: Explain what skills you want to build.",
    "Contribution: Show how you can help the team quickly.",
  ],
  stress: [
    "Stabilize: Explain how you stay calm and assess urgency.",
    "Prioritize: Share your decision logic.",
    "Communicate: Explain stakeholder updates.",
    "Reflect: Mention lessons learned for future incidents.",
  ],
  teamwork: [
    "Shared objective: Clarify team goal.",
    "Collaboration: Describe communication and coordination.",
    "Conflict handling: Explain how disagreement was resolved.",
    "Result: Share team impact and your contribution.",
  ],
};

export function constructiveCriticismHandler(
  input: ConstructiveCriticismInput
): ConstructiveCriticismResult {
  const { topic, question, answer } = input;
  const normalized = answer.toLowerCase();
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  const baseEvaluation = evaluateAnswerTool(question, answer, topic);
  const rewritten = improveAnswerTool(question, answer, topic).improvedAnswer;

  const weaknesses: string[] = [];
  const missingElements: string[] = [];
  const breakdown: ConstructiveCriticismResult["lineByLineBreakdown"] = [];

  if (wordCount < 45) {
    weaknesses.push("Your answer is currently too short to show depth and credibility.");
    missingElements.push("Specific detail and depth");
    breakdown.push({
      section: "Depth",
      issue: "The response is brief and stays high-level.",
      whyItMatters:
        "Interviewers need enough evidence to trust your skills and judgment.",
      howToImprove:
        "Expand with concrete context, your actions, and measurable outcomes.",
      suggestedRewrite:
        "I handled this by first clarifying the goal, then executing a concrete plan with measurable checkpoints.",
    });
  }

  if (!/\b(i|my|me)\b/.test(normalized)) {
    weaknesses.push("Your ownership is unclear because personal contribution is not explicit.");
    missingElements.push("Ownership language (I decided, I implemented, I led)");
    breakdown.push({
      section: "Ownership",
      issue: "It is hard to tell what you personally did.",
      whyItMatters:
        "Interviewers score accountability and personal impact, not only team activity.",
      howToImprove:
        "Use first-person action verbs and show your decision points.",
      suggestedRewrite:
        "I led the implementation plan, aligned the team, and personally handled the highest-risk tasks.",
    });
  }

  if (!/(result|outcome|improved|reduced|increased|saved|faster|impact|achieved)/.test(normalized)) {
    weaknesses.push("The answer does not clearly show outcomes or measurable impact.");
    missingElements.push("Result or metric");
    breakdown.push({
      section: "Impact",
      issue: "You described effort but not clear results.",
      whyItMatters:
        "Strong interview answers prove value through outcomes.",
      howToImprove:
        "Add one measurable result, even if approximate.",
      suggestedRewrite:
        "As a result, we reduced response time by 30 percent and improved user satisfaction scores.",
    });
  }

  if (topic === "behavioral") {
    if (!/situation|context|when/.test(normalized)) {
      missingElements.push("STAR: Situation context");
    }
    if (!/task|goal|responsib/.test(normalized)) {
      missingElements.push("STAR: Task clarity");
    }
    if (!/action|implemented|led|decided|built/.test(normalized)) {
      missingElements.push("STAR: Action detail");
    }
    if (!/result|outcome|impact|achieved|improved/.test(normalized)) {
      missingElements.push("STAR: Result evidence");
    }
  }

  if (topic === "technical") {
    if (!/because|tradeoff|complexity|performance|debug|test/.test(normalized)) {
      missingElements.push("Technical reasoning and debugging process");
    }
    breakdown.push({
      section: "Technical reasoning",
      issue: "The explanation can be more explicit about decisions and tradeoffs.",
      whyItMatters:
        "Interviewers want to understand how you think, not only the final answer.",
      howToImprove:
        "State your chosen approach, why you chose it, and what alternatives you rejected.",
      suggestedRewrite:
        "I chose this approach because it keeps time complexity lower and simplifies debugging during edge cases.",
    });
  }

  if (weaknesses.length === 0) {
    weaknesses.push("Your answer is solid overall, but it can still be sharper with clearer structure.");
  }

  if (missingElements.length === 0) {
    missingElements.push("No major gaps, focus on precision and stronger storytelling.");
  }

  const followUpAdvice = [
    "Practice this same answer once using the suggested framework, then record yourself for pacing and clarity.",
    "Aim to include one concrete action and one measurable result in every response.",
    "Keep your tone confident: state what you did, why you chose it, and what changed afterward.",
  ];

  const overallAssessment =
    baseEvaluation.score >= 8
      ? "Strong answer with good fundamentals. A few targeted edits can make it interview-ready."
      : baseEvaluation.score >= 6
        ? "Promising answer, but key details are missing. With clearer structure and impact statements, it will improve quickly."
        : "You have the right intent, but the answer needs stronger structure and concrete evidence to be convincing.";

  return {
    overallAssessment,
    score: baseEvaluation.score,
    strengths: baseEvaluation.strengths,
    weaknesses,
    missingElements,
    lineByLineBreakdown: breakdown,
    suggestedAnswerFramework: topicFrameworks[topic],
    betterSampleAnswer: rewritten,
    followUpAdvice,
  };
}
