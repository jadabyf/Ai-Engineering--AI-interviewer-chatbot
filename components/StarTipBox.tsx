"use client";

// StarTipBox — displays a brief, friendly tip about the STAR method.
// Shown when the user is answering a behavioral question or requests help.

interface StarTipBoxProps {
  onDismiss: () => void;
}

export default function StarTipBox({ onDismiss }: StarTipBoxProps) {
  return (
    <div className="rounded-xl bg-violet-50 border-2 border-violet-200 p-4 mt-2 relative">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-3 text-violet-400 hover:text-violet-600 text-lg leading-none"
        aria-label="Dismiss tip"
      >
        ×
      </button>
      <h4 className="text-sm font-bold text-violet-700 mb-2">⭐ STAR Method Quick Guide</h4>
      <ul className="space-y-1.5 text-sm text-gray-700">
        <li>
          <span className="font-semibold text-violet-600">S — Situation:</span>{" "}
          Set the scene. Where were you, what was the context?
        </li>
        <li>
          <span className="font-semibold text-violet-600">T — Task:</span>{" "}
          What was your responsibility or goal?
        </li>
        <li>
          <span className="font-semibold text-violet-600">A — Action:</span>{" "}
          What specific steps did YOU take? (Focus on &quot;I&quot;, not &quot;we&quot;)
        </li>
        <li>
          <span className="font-semibold text-violet-600">R — Result:</span>{" "}
          What happened? Quantify the outcome if you can.
        </li>
      </ul>
      <p className="text-xs text-violet-400 mt-3 italic">
        Great behavioral answers tell a clear story with a beginning, middle, and measurable end.
      </p>
    </div>
  );
}
