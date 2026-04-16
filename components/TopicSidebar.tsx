"use client";

import { genres } from "@/lib/genres";
import { InterviewGenre } from "@/types";

interface TopicSidebarProps {
  selectedTopic: InterviewGenre | null;
  onSelectTopic: (topic: InterviewGenre) => void;
  onStartNewSession: () => void;
}

export default function TopicSidebar({ selectedTopic, onSelectTopic, onStartNewSession }: TopicSidebarProps) {
  return (
    <aside className="h-full overflow-hidden rounded-2xl border border-(--border-soft) bg-(--bg-sidebar) shadow-sm p-4 sm:p-5">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-(--brand-primary) text-white flex items-center justify-center font-bold text-sm">
            AI
          </div>
          <div>
            <h1 className="text-base font-bold text-(--text-primary)">Interview Coach</h1>
            <p className="text-xs text-(--text-secondary)">Practice workspace</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onStartNewSession}
        className="btn-gradient w-full mb-4 rounded-xl px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-150 hover:shadow"
      >
        Start New Session
      </button>

      <p className="text-xs font-semibold text-(--text-secondary) uppercase tracking-[0.18em] mb-3">
        Interview Topics
      </p>

      <div className="space-y-2">
        {genres.map((topic) => {
          const isActive = selectedTopic === topic.id;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelectTopic(topic.id)}
              aria-pressed={isActive}
              className={[
                "w-full rounded-xl border px-3 py-2 text-left transition-all duration-150",
                "hover:border-(--accent-violet) hover:bg-white/70",
                isActive
                  ? "border-(--brand-primary) bg-white ring-1 ring-(--accent-violet) shadow-sm border-l-4"
                  : "border-(--border-soft) bg-white",
              ].join(" ")}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg leading-none" aria-hidden>
                  {topic.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-(--text-primary) leading-snug">{topic.label}</p>
                  <p className="text-xs text-(--text-secondary) line-clamp-2 mt-0.5">{topic.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-(--border-soft) bg-white/60 p-3">
        <p className="text-xs text-(--text-secondary) font-medium">Session History</p>
        <p className="text-xs text-(--text-secondary)/80 mt-1">Coming soon</p>
      </div>
    </aside>
  );
}
