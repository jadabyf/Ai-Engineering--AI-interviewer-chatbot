import { getSuggestionChipsTool } from "@/tools/getSuggestionChipsTool";
import { GetSuggestionChipsInput } from "@/types/mcp";
import { SuggestionChip } from "@/types";

export function getSuggestionChipsHandler(input: GetSuggestionChipsInput): { chips: SuggestionChip[] } {
  if (input.currentState === "welcome") {
    return {
      chips: [
        { label: "Start Behavioral Interview", action: "start-genre", payload: { genre: "behavioral" } },
        { label: "Give Me a Technical Question", action: "start-genre", payload: { genre: "technical" } },
        { label: "Practice Leadership", action: "start-genre", payload: { genre: "leadership" } },
      ],
    };
  }

  if (input.currentState === "summary") {
    return {
      chips: [
        { label: "Start New Session", action: "change-genre" },
        { label: "Switch to Technical", action: "start-genre", payload: { genre: "technical" } },
        { label: "Practice Leadership", action: "start-genre", payload: { genre: "leadership" } },
      ],
    };
  }

  const phase = input.currentState === "question" ? "question" : "feedback";
  const toolChips = getSuggestionChipsTool({ phase, genre: input.topic });

  if (input.currentState === "feedback") {
    toolChips.unshift({
      label: "Detailed Analysis",
      action: "detailed-critique",
    });
  }

  const extraSwitchChips: SuggestionChip[] = [
    { label: "Switch to Technical", action: "start-genre", payload: { genre: "technical" } },
    { label: "Practice Leadership", action: "start-genre", payload: { genre: "leadership" } },
  ];

  return {
    chips: [...toolChips, ...extraSwitchChips],
  };
}
