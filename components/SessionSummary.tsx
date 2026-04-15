"use client";

// SessionSummary — shown at the end of a session.
// Displays total questions answered, average score, and genre practiced.

import { HistoryEntry } from "@/types";
import { genres } from "@/lib/genres";

interface SessionSummaryProps {
  history: HistoryEntry[];
  totalQuestions: number;
  averageScore: number;
  onRestart: () => void;
}

function scoreLabel(avg: number): { label: string; emoji: string } {
  if (avg >= 9) return { label: "Outstanding!", emoji: "🏆" };
  if (avg >= 7) return { label: "Great work!", emoji: "🌟" };
  if (avg >= 5) return { label: "Good effort!", emoji: "👍" };
  return { label: "Keep practicing!", emoji: "💪" };
}

export default function SessionSummary({
  history,
  totalQuestions,
  averageScore,
  onRestart,
}: SessionSummaryProps) {
  const { label, emoji } = scoreLabel(averageScore);

  // Group history by genre for display
  const byGenre = history.reduce<Record<string, HistoryEntry[]>>((acc, entry) => {
    const g = entry.question.genre;
    if (!acc[g]) acc[g] = [];
    acc[g].push(entry);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">{emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800">{label}</h2>
        <p className="text-gray-500 mt-1 text-sm">Here is how your session went.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
          <div className="text-3xl font-extrabold text-indigo-600">{totalQuestions}</div>
          <div className="text-sm text-gray-500 mt-1">Questions Answered</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
          <div className="text-3xl font-extrabold text-indigo-600">{averageScore}/10</div>
          <div className="text-sm text-gray-500 mt-1">Average Score</div>
        </div>
      </div>

      {/* Per-question breakdown */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Question Breakdown</h3>
          <div className="space-y-3">
            {history.map((entry, i) => {
              const genreInfo = genres.find((g) => g.id === entry.question.genre);
              return (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl">{genreInfo?.icon ?? "❓"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 font-medium truncate">
                      {entry.question.text}
                    </p>
                    <p className="text-xs text-gray-400">{genreInfo?.label} · Score: {entry.evaluation.score}/10</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Genres practiced */}
      {Object.keys(byGenre).length > 0 && (
        <div className="text-sm text-gray-500 text-center mb-6">
          Genres practiced:{" "}
          {Object.keys(byGenre).map((g) => {
            const info = genres.find((gi) => gi.id === g);
            return info ? `${info.icon} ${info.label}` : g;
          }).join(" · ")}
        </div>
      )}

      {/* Restart button */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Start a New Session
        </button>
      </div>
    </div>
  );
}
