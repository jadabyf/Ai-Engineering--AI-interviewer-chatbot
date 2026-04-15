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

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={() => onChipClick(chip)}
          className="
            inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium
            bg-white border border-indigo-300 text-indigo-700
            hover:bg-indigo-50 hover:border-indigo-500
            active:bg-indigo-100
            transition-all duration-150 shadow-sm cursor-pointer
            whitespace-nowrap
          "
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
