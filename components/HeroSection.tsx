"use client";

interface HeroSectionProps {
  onStartPractice: () => void;
  onHowItWorks: () => void;
}

export default function HeroSection({ onStartPractice, onHowItWorks }: HeroSectionProps) {
  return (
    <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-sky-50 p-6 sm:p-8 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-indigo-600 uppercase mb-3">
            AI Interview Training
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Your Personal AI Interview Coach
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Practice smarter. Answer better. Get real-time feedback and become interview ready.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onStartPractice}
              className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Your Practice
            </button>
            <button
              onClick={onHowItWorks}
              className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-all duration-150 hover:border-indigo-300 hover:text-indigo-700"
            >
              How It Works
            </button>
          </div>
        </div>

        <div className="hidden sm:flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white border border-indigo-100 shadow-sm">
          <span className="text-3xl" aria-hidden>
            🎯
          </span>
        </div>
      </div>
    </section>
  );
}
