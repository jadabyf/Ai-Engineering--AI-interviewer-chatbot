"use client";

import { GenreInfo, InterviewGenre } from "@/types";

interface InterviewCardProps {
  genre: GenreInfo;
  selectedGenre: InterviewGenre | null;
  onSelect: (genre: InterviewGenre) => void;
}

export default function InterviewCard({ genre, selectedGenre, onSelect }: InterviewCardProps) {
  const isSelected = selectedGenre === genre.id;

  return (
    <button
      type="button"
      onClick={() => onSelect(genre.id)}
      aria-pressed={isSelected}
      className={[
        "group w-full rounded-2xl border-2 p-4 text-left transition-all duration-150 cursor-pointer",
        "hover:scale-[1.015] hover:shadow-md active:scale-[0.99]",
        genre.color,
        isSelected ? "ring-2 ring-indigo-400 border-indigo-500 shadow-md" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl" aria-hidden>
            {genre.icon}
          </p>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">{genre.label}</h3>
          <p className="mt-1 text-xs text-gray-600 leading-relaxed">{genre.description}</p>
        </div>
      </div>
    </button>
  );
}
