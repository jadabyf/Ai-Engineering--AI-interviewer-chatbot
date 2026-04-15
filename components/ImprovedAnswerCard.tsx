"use client";

// ImprovedAnswerCard — displays the AI-improved version of the user's answer.

interface ImprovedAnswerCardProps {
  improvedAnswer: string;
}

export default function ImprovedAnswerCard({ improvedAnswer }: ImprovedAnswerCardProps) {
  return (
    <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-5 mt-2">
      <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-700 mb-3">
        ✨ Improved Answer
      </h4>
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
        {improvedAnswer}
      </p>
      <p className="text-xs text-indigo-400 mt-3 italic">
        This rewrite shows how to structure your answer more effectively for this interview type.
      </p>
    </div>
  );
}
