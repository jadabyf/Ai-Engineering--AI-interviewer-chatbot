import { McpRequest, McpResponse, McpToolName } from "@/types/mcp";

import { evaluateAnswerHandler } from "@/server/tools/evaluateAnswer";
import { generateQuestionHandler } from "@/server/tools/generateQuestion";
import { getSuggestionChipsHandler } from "@/server/tools/getSuggestionChips";
import { improveAnswerHandler } from "@/server/tools/improveAnswer";
import { constructiveCriticismHandler } from "@/server/tools/constructiveCriticism";
import { setCustomQuestionHandler } from "@/server/tools/setCustomQuestion";
import { switchTopicHandler } from "@/server/tools/switchTopic";
import { analyzeAnswerHandler } from "@/server/tools/analyzeAnswer";
import { chooseBestFeedbackModeHandler } from "@/server/tools/chooseBestFeedbackMode";
import { detectAnswerPatternsHandler } from "@/server/tools/detectAnswerPatterns";
import { detectInappropriateAnswerHandler } from "@/server/tools/detectInappropriateAnswer";
import { dissectAnswerHandler } from "@/server/tools/dissectAnswer";
import { generateTargetedCoachingHandler } from "@/server/tools/generateTargetedCoaching";
import { recommendFollowupQuestionHandler } from "@/server/tools/recommendFollowupQuestion";
import { runFeedbackPipelineHandler } from "@/server/tools/runFeedbackPipeline";
import { scoreAnswerDimensionsHandler } from "@/server/tools/scoreAnswerDimensions";
import { summarizeFeedbackHandler } from "@/server/tools/summarizeFeedback";

type McpToolHandler<T extends McpToolName> = (input: McpRequest<T>["input"]) => unknown;

const handlers: { [K in McpToolName]: McpToolHandler<K> } = {
  generate_question: generateQuestionHandler,
  evaluate_answer: evaluateAnswerHandler,
  improve_answer: improveAnswerHandler,
  get_suggestion_chips: getSuggestionChipsHandler,
  switch_topic: switchTopicHandler,
  constructive_criticism: constructiveCriticismHandler,
  set_custom_question: setCustomQuestionHandler,
  analyze_answer: analyzeAnswerHandler,
  dissect_answer: dissectAnswerHandler,
  generate_targeted_coaching: generateTargetedCoachingHandler,
  detect_answer_patterns: detectAnswerPatternsHandler,
  detect_inappropriate_or_unprofessional_answer: detectInappropriateAnswerHandler,
  recommend_followup_question: recommendFollowupQuestionHandler,
  score_answer_dimensions: scoreAnswerDimensionsHandler,
  summarize_feedback: summarizeFeedbackHandler,
  choose_best_feedback_mode: chooseBestFeedbackModeHandler,
  run_feedback_pipeline: runFeedbackPipelineHandler,
};

// Small MCP-style router used by API routes.
export async function handleMcpRequest<T extends McpToolName>(
  request: McpRequest<T>
): Promise<McpResponse<T>> {
  try {
    const handler = handlers[request.tool] as McpToolHandler<T>;

    if (!handler) {
      return {
        ok: false,
        tool: request.tool,
        error: `Unknown MCP tool: ${request.tool}`,
      };
    }

    const data = handler(request.input) as McpResponse<T> extends { ok: true; data: infer D } ? D : never;

    return {
      ok: true,
      tool: request.tool,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      tool: request.tool,
      error: error instanceof Error ? error.message : "Unexpected MCP server error",
    };
  }
}
