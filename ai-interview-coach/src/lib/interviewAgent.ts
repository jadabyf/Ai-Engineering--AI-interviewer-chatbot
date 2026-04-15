import { evaluateAnswerTool } from "@/tools/evaluateAnswerTool";
import { generateQuestionTool } from "@/tools/generateQuestionTool";
import { improveAnswerTool } from "@/tools/improveAnswerTool";
import { InterviewTurnResult, InterviewType } from "@/types/interview";

// Simple orchestrator that behaves like an "agent" coordinating tool calls.
export const interviewAgent = {
  startInterview(interviewType: InterviewType, askedQuestions: string[] = []) {
    const question = generateQuestionTool(interviewType, askedQuestions);

    return { question };
  },

  evaluateAndImprove(
    question: string,
    answer: string,
    interviewType: InterviewType
  ): InterviewTurnResult {
    const evaluation = evaluateAnswerTool(question, answer, interviewType);
    const improved = improveAnswerTool(question, answer, interviewType);

    return {
      evaluation,
      improved,
    };
  },
};
