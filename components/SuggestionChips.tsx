"use client";

// SuggestionChips — renders a horizontal scrollable row of clickable chips.
// Each chip triggers an action when clicked.

import { SuggestionChip } from "@/types";

interface SuggestionChipsProps {
  chips: SuggestionChip[];
  onChipClick: (chip: SuggestionChip) => void;
}

export default function SuggestionChips({ chips, onChipClick }: SuggestionChipsProps) {
  if (chips.length === 0) return null;

  const primaryActionOrder = [
    "next-question",
    "rewrite-answer",
    "detailed-critique",
    "change-genre",
  ] as const;

  const primaryPicked: SuggestionChip[] = [];
  for (const action of primaryActionOrder) {
    const found = chips.find((chip) => chip.action === action);
    if (found && !primaryPicked.some((chip) => chip.label === found.label)) {
      primaryPicked.push(found);
    }
  }

  const filler = chips.filter(
    (chip) => !primaryPicked.some((picked) => picked.label === chip.label)
  );
  const primaryChips = [...primaryPicked, ...filler].slice(0, 4);
  const moreOptions = chips.filter(
    (chip) => !primaryChips.some((primary) => primary.label === chip.label)
  );

  function displayLabel(chip: SuggestionChip) {
    if (chip.action === "change-genre") return "Change Topic";
    if (chip.action === "rewrite-answer") return "Rewrite My Answer";
    if (chip.action === "detailed-critique") return "Detailed Analysis";
    return chip.label;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {primaryChips.map((chip, i) => (
        <button
          key={`${chip.action}-${i}`}
          onClick={() => onChipClick(chip)}
          className="
            inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium
            bg-(--accent-violet)/15 border border-(--accent-violet)/35 text-(--brand-primary)
            hover:bg-(--accent-violet)/25 hover:border-(--brand-primary)
            active:scale-[0.99]
            transition-all duration-150 cursor-pointer
            whitespace-nowrap
          "
        >
          {displayLabel(chip)}
        </button>
      ))}

      {moreOptions.length > 0 && (
        <details className="relative">
          <summary className="list-none inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium border border-(--border-soft) text-(--text-secondary) bg-white hover:bg-(--bg-main) transition-colors cursor-pointer">
            More Options
          </summary>
          <div className="absolute right-0 z-20 mt-2 min-w-52.5 rounded-xl border border-(--border-soft) bg-white p-2 shadow-sm">
            {moreOptions.map((chip, i) => (
              <button
                key={`${chip.action}-${chip.label}-${i}`}
                onClick={() => onChipClick(chip)}
                className="w-full text-left rounded-lg px-3 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-main) transition-colors"
              >
                {displayLabel(chip)}
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
