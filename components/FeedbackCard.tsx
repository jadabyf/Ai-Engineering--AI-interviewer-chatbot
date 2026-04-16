"use client";

// FeedbackCard — displays the structured evaluation result.
// Shows score, overall feedback, strengths, improvements, and rubric note.

import { EvaluationResult } from "@/types";
import { useMemo, useState } from "react";

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
  const [expanded, setExpanded] = useState(false);

  const compactFeedback = useMemo(() => {
    const firstSentence = feedback.split(".")[0]?.trim();
    if (!firstSentence) return "Needs more detail and structure.";
    return `${firstSentence}.`;
  }, [feedback]);

  return (
    <div className={`rounded-xl border p-4 mt-2 ${scoreBg(score)}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`text-4xl font-extrabold ${scoreColor(score)}`}>
            {score}<span className="text-lg font-semibold text-gray-400">/10</span>
          </div>
          <p className="text-sm text-gray-700 font-medium leading-snug">{compactFeedback}</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-xs font-semibold text-(--brand-primary) hover:underline"
        >
          {expanded ? "Hide Detailed Feedback" : "View Detailed Feedback"}
        </button>
      </div>

      <div
        className={[
          "overflow-hidden transition-all duration-200",
          expanded ? "opacity-100 mt-4" : "opacity-0",
        ].join(" ")}
        style={{ maxHeight: expanded ? "900px" : "0px" }}
      >
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

        {rubricNotes && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic">{rubricNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
