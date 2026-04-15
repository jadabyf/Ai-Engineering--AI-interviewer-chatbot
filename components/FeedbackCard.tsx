"use client";

// FeedbackCard — displays the structured evaluation result.
// Shows score, overall feedback, strengths, improvements, and rubric note.

import { EvaluationResult } from "@/types";

interface FeedbackCardProps {
  evaluation: EvaluationResult;
}

// Score → color mapping
function scoreColor(score: number): string {
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-yellow-600";
  if (score >= 4) return "text-orange-500";
  return "text-red-500";
}

function scoreBg(score: number): string {
  if (score >= 8) return "bg-green-50 border-green-200";
  if (score >= 6) return "bg-yellow-50 border-yellow-200";
  if (score >= 4) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}

export default function FeedbackCard({ evaluation }: FeedbackCardProps) {
  const { score, feedback, strengths, improvements, rubricNotes } = evaluation;

  return (
    <div className={`rounded-xl border-2 p-5 mt-2 ${scoreBg(score)}`}>
      {/* Score Banner */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`text-4xl font-extrabold ${scoreColor(score)}`}>
          {score}<span className="text-lg font-semibold text-gray-400">/10</span>
        </div>
        <p className="text-sm text-gray-700 font-medium leading-snug">{feedback}</p>
      </div>

      {/* Strengths */}
      <div className="mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wide text-green-700 mb-2">
          ✅ Strengths
        </h4>
        <ul className="space-y-1">
          {strengths.map((s, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements */}
      <div className="mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-2">
          💡 Areas to Improve
        </h4>
        <ul className="space-y-1">
          {improvements.map((imp, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>{imp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Rubric Note */}
      {rubricNotes && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 italic">{rubricNotes}</p>
        </div>
      )}
    </div>
  );
}
