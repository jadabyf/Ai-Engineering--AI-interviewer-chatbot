"use client";

// MessageBubble — renders a single chat message.
// Supports "user" (right-aligned) and "bot" (left-aligned) variants.

interface MessageBubbleProps {
  role: "user" | "bot";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {/* Bot avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-(--brand-primary) flex items-center justify-center text-white text-sm font-bold mr-2 shrink-0 mt-1">
          AI
        </div>
      )}

      <div
        className={`
          max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm
          ${isUser
            ? "bg-linear-to-br from-(--brand-primary) to-(--brand-soft-purple) text-white rounded-br-sm"
            : "bg-(--bg-chat) border border-(--border-soft) text-(--text-primary) rounded-bl-sm"
          }
        `}
      >
        {content}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-(--accent-violet)/25 border border-(--accent-violet)/50 flex items-center justify-center text-(--text-secondary) text-xs font-bold ml-2 shrink-0 mt-1">
          You
        </div>
      )}
    </div>
  );
}
