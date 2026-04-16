import { improveAnswerTool } from "@/tools/improveAnswerTool";
import { ImproveAnswerInput } from "@/types/mcp";

export function improveAnswerHandler(input: ImproveAnswerInput) {
  return improveAnswerTool(input.question, input.answer, input.topic);
}
