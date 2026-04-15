"use client";

// GenreSelector — renders a grid of interview genre cards.
// When a genre is clicked, it calls onSelect with the genre id.

import { genres } from "@/lib/genres";
import { InterviewGenre } from "@/types";

interface GenreSelectorProps {
  onSelect: (genre: InterviewGenre) => void;
}

export default function GenreSelector({ onSelect }: GenreSelectorProps) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        Choose your interview type to begin
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onSelect(genre.id)}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150
              text-left cursor-pointer select-none
              ${genre.color}
            `}
          >
            <span className="text-3xl">{genre.icon}</span>
            <span className="text-sm font-semibold text-gray-800 text-center leading-tight">
              {genre.label}
            </span>
            <span className="text-xs text-gray-500 text-center leading-tight hidden sm:block">
              {genre.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
