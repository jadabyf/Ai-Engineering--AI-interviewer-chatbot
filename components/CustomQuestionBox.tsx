"use client";

interface CustomQuestionBoxProps {
  value: string;
  onChange: (value: string) => void;
  onUseQuestion: () => void;
  disabled?: boolean;
}

export default function CustomQuestionBox({
  value,
  onChange,
  onUseQuestion,
  disabled = false,
}: CustomQuestionBoxProps) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Practice your own question..."
        className="flex-1 rounded-lg border border-(--border-soft) bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent-violet)"
      />
      <button
        type="button"
        onClick={onUseQuestion}
        disabled={disabled}
        className="btn-gradient rounded-lg px-3.5 py-2 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Use
      </button>
    </div>
  );
}
