"use client";

import InterviewCard from "@/components/InterviewCard";
import { genres } from "@/lib/genres";
import { InterviewGenre } from "@/types";

interface InterviewCardGridProps {
  selectedGenre: InterviewGenre | null;
  onSelect: (genre: InterviewGenre) => void;
}

export default function InterviewCardGrid({ selectedGenre, onSelect }: InterviewCardGridProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Interview Type</h2>
        <span className="text-xs text-gray-500">Pick one to start instantly</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {genres.map((genre) => (
          <InterviewCard
            key={genre.id}
            genre={genre}
            selectedGenre={selectedGenre}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
