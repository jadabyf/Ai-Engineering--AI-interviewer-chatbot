"use client";

import { RefObject } from "react";

import FeedbackCard from "@/components/FeedbackCard";
import ImprovedAnswerCard from "@/components/ImprovedAnswerCard";
import MessageBubble from "@/components/MessageBubble";
import SessionSummary from "@/components/SessionSummary";
import StarTipBox from "@/components/StarTipBox";

import { EvaluationResult, HistoryEntry, Question, SessionPhase } from "@/types";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  phase: SessionPhase;
  currentQuestion: Question | null;
  userAnswer: string;
  answerError: string;
  feedback: EvaluationResult | null;
  improvedAnswer: string | null;
  history: HistoryEntry[];
  summaryData: { totalQuestions: number; averageScore: number } | null;
  showStarTip: boolean;
  onDismissStarTip: () => void;
  onUserAnswerChange: (answer: string) => void;
  onSubmitAnswer: () => void;
  onRestart: () => void;
  bottomRef: RefObject<HTMLDivElement | null>;
}

export default function ChatPanel({
  messages,
  phase,
  currentQuestion,
  userAnswer,
  answerError,
  feedback,
  improvedAnswer,
  history,
  summaryData,
  showStarTip,
  onDismissStarTip,
  onUserAnswerChange,
  onSubmitAnswer,
  onRestart,
  bottomRef,
}: ChatPanelProps) {
  const showInput = phase === "question" || (phase === "feedback" && currentQuestion);

  return (
    <section className="h-full min-h-150 rounded-3xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden">
      <header className="border-b border-gray-200 px-4 py-3 bg-white">
        <h2 className="text-base font-semibold text-gray-900">AI Interview Coach</h2>
        <p className="text-xs text-gray-500 mt-0.5">Live practice chat</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 bg-linear-to-b from-gray-50 to-white">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {showStarTip && <StarTipBox onDismiss={onDismissStarTip} />}

        {phase === "feedback" && feedback && (
          <div className="mt-2">
            <FeedbackCard evaluation={feedback} />
          </div>
        )}

        {phase === "feedback" && improvedAnswer && (
          <div className="mt-2">
            <ImprovedAnswerCard improvedAnswer={improvedAnswer} />
          </div>
        )}

        {phase === "summary" && summaryData && (
          <div className="mt-2">
            <SessionSummary
              history={history}
              totalQuestions={summaryData.totalQuestions}
              averageScore={summaryData.averageScore}
              onRestart={onRestart}
            />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {showInput && (
        <div className="border-t border-gray-200 bg-white px-4 py-3">
          {currentQuestion && (
            <p className="text-xs text-gray-500 mb-2 truncate">
              <span className="font-medium">Q:</span> {currentQuestion.text}
            </p>
          )}

          {answerError && <p className="text-xs text-red-500 mb-1">{answerError}</p>}

          <div className="flex gap-2 items-end">
            <textarea
              value={userAnswer}
              onChange={(e) => onUserAnswerChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  onSubmitAnswer();
                }
              }}
              placeholder="Type your answer here... (Ctrl+Enter to submit)"
              rows={3}
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            <button
              type="button"
              onClick={onSubmitAnswer}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors self-end"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
