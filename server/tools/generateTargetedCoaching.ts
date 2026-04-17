import { GenerateTargetedCoachingResult } from "@/types/coaching";
import { GenerateTargetedCoachingInput } from "@/types/mcp";
import { topicRecommendedFlow } from "@/server/tools/answerIntelligenceUtils";

const ISSUE_FIX_LIBRARY: Record<
  string,
  { why: string; fix: string; example: string }
> = {
  "too-short": {
    why: "Short responses hide your decision process and make impact unclear.",
    fix: "Use a 4-step flow: context, action, reasoning, result.",
    example: "Context: A release was blocked. Action: I owned root-cause debugging. Reasoning: This path reduced downtime risk. Result: We restored service in 45 minutes.",
  },
  "low-relevance": {
    why: "If the answer misses the question, interviewers assume weak listening.",
    fix: "Start with a direct answer to the exact question before adding detail.",
    example: "To answer your conflict question directly: I resolved the disagreement by aligning both engineers on user-impact data.",
  },
  "low-ownership": {
    why: "Interviewers score your contribution, not generic team activity.",
    fix: "Use first-person verbs to show your own decisions and actions.",
    example: "I proposed the rollback plan, coordinated comms, and personally verified the fix.",
  },
  "missing-results": {
    why: "Without outcome evidence, value is hard to evaluate.",
    fix: "Add one measurable result, even if approximate.",
    example: "This reduced ticket backlog by 28 percent within two weeks.",
  },
  "weak-reasoning": {
    why: "Strong candidates explain why they made a decision.",
    fix: "Add one sentence that states your tradeoff or rationale.",
    example: "I chose the phased rollout because it reduced blast radius while preserving release speed.",
  },
  "professionalism-risk": {
    why: "Interview tone is evaluated as part of role readiness.",
    fix: "Replace emotional wording with objective language.",
    example: "I disagreed with the approach, so I proposed a safer alternative with evidence and aligned the team.",
  },
  "collaboration-risk": {
    why: "Statements that reject teamwork are high risk in interview evaluation.",
    fix: "Acknowledge team value, then explain how you contribute effectively within a team.",
    example: "I do my best work with clear ownership in collaborative teams, so I align on roles early and communicate proactively.",
  },
};

function buildSuggestedResponses(question: string, topic: string, topProblems: string[]): string[] {
  const base = [
    `Direct answer: In this situation, I focused on ${topic === "technical" ? "a structured technical approach" : "clear ownership and collaboration"}.`,
    "Action + reasoning: I chose this approach because it reduced risk and improved team alignment.",
    "Result: This led to a measurable improvement and a better outcome for stakeholders.",
  ];

  if (topProblems.includes("collaboration-risk")) {
    return [
      "I work best in collaborative teams with clear ownership. In one project, I aligned responsibilities early, supported a teammate through a blocker, and we delivered on time.",
      "I value teamwork because strong communication improves outcomes. I proactively share updates, ask for feedback, and help resolve conflicts quickly.",
      "When team dynamics are difficult, I stay professional, clarify goals, and focus on solutions that move the group forward.",
    ];
  }

  if (topProblems.includes("too-short") || topProblems.includes("weak-structure")) {
    return [
      `To answer "${question}": first, I set the context briefly. Then I explain the exact action I took and why. Finally, I close with the measurable result.`,
      "In that case, I took ownership of the key task, coordinated with stakeholders, and delivered a concrete improvement.",
      "My approach was to define the goal, execute a clear plan, and validate success with measurable outcomes.",
    ];
  }

  return base;
}

export function generateTargetedCoachingHandler(
  input: GenerateTargetedCoachingInput
): GenerateTargetedCoachingResult {
  const topProblemsToFix = input.analysisResult.coachingPriority.slice(0, 3);

  const coachingPlan = topProblemsToFix.map((problem) => {
    const rule = ISSUE_FIX_LIBRARY[problem] ?? ISSUE_FIX_LIBRARY["too-short"];
    return {
      problem,
      whyItMatters: rule.why,
      exactFix: rule.fix,
      example: rule.example,
    };
  });

  const flow = topicRecommendedFlow[input.topic];
  const sampleStrongerAnswer = [
    `Question focus: ${input.question}`,
    "",
    `${flow[0]}: Give one-sentence context that directly answers the prompt.`,
    `${flow[1]}: Explain what you personally did and why.`,
    `${flow[2]}: Show your decision logic or tradeoff.`,
    `${flow[3]}: End with a concrete outcome and learning.`,
  ].join("\n");

  const nextAttemptAdvice = [
    "Start with a direct answer in the first sentence.",
    "Include at least one explicit action you took.",
    "Close with one measurable result or impact statement.",
  ];

  const suggestedResponses = buildSuggestedResponses(
    input.question,
    input.topic,
    topProblemsToFix
  );

  return {
    topProblemsToFix,
    coachingPlan,
    sampleStrongerAnswer,
    suggestedResponses,
    nextAttemptAdvice,
  };
}
