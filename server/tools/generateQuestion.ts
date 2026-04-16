import { generateQuestionTool } from "@/tools/generateQuestionTool";
import { GenerateQuestionInput } from "@/types/mcp";

export function generateQuestionHandler(input: GenerateQuestionInput) {
  return generateQuestionTool(input.topic, input.difficulty, input.usedIds ?? []);
}
