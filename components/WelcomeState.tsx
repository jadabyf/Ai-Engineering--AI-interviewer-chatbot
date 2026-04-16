"use client";

interface WelcomeStateProps {
  onOpenTopicGuide: () => void;
}

export default function WelcomeState({ onOpenTopicGuide }: WelcomeStateProps) {
  return (
    <div className="rounded-2xl border border-(--border-soft) bg-linear-to-br from-white via-(--accent-violet)/10 to-(--accent-blue)/15 p-6 sm:p-8 shadow-sm mb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--brand-primary) mb-3">
        Welcome
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-(--text-primary) leading-tight">
        Your Personal AI Interview Coach
      </h2>
      <p className="mt-3 text-sm sm:text-base text-(--text-secondary) max-w-2xl leading-relaxed">
        Choose an interview topic from the sidebar to enter practice mode. Once selected, this workspace becomes your live coaching chat with questions, scoring, and answer improvement.
      </p>
      <button
        type="button"
        onClick={onOpenTopicGuide}
        className="mt-5 rounded-xl border border-(--border-soft) bg-white px-4 py-2 text-sm font-semibold text-(--text-primary) hover:border-(--accent-violet) hover:text-(--brand-primary) transition-colors"
      >
        How Practice Mode Works
      </button>
    </div>
  );
}
