import { ImprovedAnswerResult, InterviewType } from "@/types/interview";

function behavioralTemplate(): string {
  return `Situation: In one project, I faced a challenge that required careful collaboration and quick decision-making.\n\nAction: I clarified the goal, communicated with the team, and took ownership of the key tasks needed to move forward.\n\nResult: The outcome was positive because we resolved the issue efficiently and improved the process for future work.\n\n(Adapt this structure to your real story and add a metric if possible.)`;
}

function technicalTemplate(): string {
  return `I would approach this in clear steps. First, I would define the problem and collect relevant metrics. Then, I would identify likely bottlenecks and test possible solutions. After that, I would implement the best option while considering trade-offs such as performance, maintainability, and complexity. Finally, I would validate the result with monitoring and tests.\n\nIn a similar project, I used this method to improve reliability and response time.`;
}

function hrTemplate(): string {
  return `I am excited about this role because it aligns with my skills and long-term growth goals. I bring a professional, collaborative work style and I communicate clearly with teammates and stakeholders. In previous work, I handled feedback constructively and used it to improve results. I am confident I can contribute positively to the team from day one while continuing to learn.`;
}

export function improveAnswerTool(
  question: string,
  answer: string,
  interviewType: InterviewType
): ImprovedAnswerResult {
  // Keep these arguments to mirror an MCP-style tool signature.
  void question;
  void answer;

  if (interviewType === "behavioral") {
    return { improvedAnswer: behavioralTemplate() };
  }

  if (interviewType === "technical") {
    return { improvedAnswer: technicalTemplate() };
  }

  return { improvedAnswer: hrTemplate() };
}
