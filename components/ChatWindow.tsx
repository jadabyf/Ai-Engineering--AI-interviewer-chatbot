"use client";

/**
 * ChatWindow
 *
 * The main interview session component. It owns all session state and
 * orchestrates the full interview flow by calling the service layer.
 *
 * Phases:
 *   select-genre → question → feedback → summary
 */

import { useState, useRef, useEffect } from "react";

import GenreSelector from "@/components/GenreSelector";
import MessageBubble from "@/components/MessageBubble";
import SuggestionChips from "@/components/SuggestionChips";
import FeedbackCard from "@/components/FeedbackCard";
import ImprovedAnswerCard from "@/components/ImprovedAnswerCard";
import SessionSummary from "@/components/SessionSummary";
import StarTipBox from "@/components/StarTipBox";

import {
  startInterview,
  submitAnswer,
  nextQuestion,
  endSession,
  getLandingChips,
} from "@/lib/interviewService";

import { genres } from "@/lib/genres";
import {
  EvaluationResult,
  HistoryEntry,
  InterviewGenre,
  Question,
  SessionPhase,
  SuggestionChip,
} from "@/types";

// ─── Local Types ──────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatWindow() {
  // ─── Session State ─────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<SessionPhase>("select-genre");
  const [genre, setGenre] = useState<InterviewGenre | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);
  const [improvedAnswer, setImprovedAnswer] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [chips, setChips] = useState<SuggestionChip[]>(getLandingChips());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content:
        "👋 Welcome to AI Interview Coach!\n\nChoose an interview type below to get started, or pick from the suggestions.",
    },
  ]);
  const [showStarTip, setShowStarTip] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [answerError, setAnswerError] = useState("");

  // For session summary
  const [summaryData, setSummaryData] = useState<{
    totalQuestions: number;
    averageScore: number;
  } | null>(null);

  // Scroll to bottom on new messages
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, feedback, phase]);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function addBotMessage(content: string) {
    setMessages((prev) => [...prev, { role: "bot", content }]);
  }

  function addUserMessage(content: string) {
    setMessages((prev) => [...prev, { role: "user", content }]);
  }

  // ─── Genre Selection ────────────────────────────────────────────────────────

  function handleGenreSelect(selectedGenre: InterviewGenre) {
    const genreInfo = genres.find((g) => g.id === selectedGenre);
    const { questionResult, chips: newChips } = startInterview(selectedGenre);

    setGenre(selectedGenre);
    setCurrentQuestion(questionResult.question);
    setUsedQuestionIds([questionResult.question.id]);
    setFeedback(null);
    setImprovedAnswer(null);
    setUserAnswer("");
    setPhase("question");
    setChips(newChips);
    setAnswerError("");

    addBotMessage(
      `${genreInfo?.icon ?? "🎯"} Starting your **${genreInfo?.label ?? selectedGenre}** interview.\n\nTone: ${genreInfo?.tone ?? "Professional"}`
    );
    addBotMessage(
      `📋 Here is your question:\n\n${questionResult.question.text}${
        questionResult.tip ? `\n\n💡 Tip: ${questionResult.tip}` : ""
      }`
    );
  }

  // ─── Submit Answer ──────────────────────────────────────────────────────────

  function handleSubmitAnswer() {
    if (!userAnswer.trim()) {
      setAnswerError("Please type your answer before submitting.");
      return;
    }
    if (!currentQuestion || !genre) return;

    setAnswerError("");
    addUserMessage(userAnswer);

    const { evaluation, improvedAnswer: improved, chips: newChips } = submitAnswer(
      currentQuestion.text,
      userAnswer,
      genre
    );

    const newEntry: HistoryEntry = {
      question: currentQuestion,
      userAnswer,
      evaluation,
      improvedAnswer: improved,
    };

    setHistory((prev) => [...prev, newEntry]);
    setFeedback(evaluation);
    setImprovedAnswer(improved);
    setPhase("feedback");
    setChips(newChips);
    setUserAnswer("");

    addBotMessage(
      `Thanks for your answer! Let me evaluate it...\n\nYour score: ${evaluation.score}/10\n\n${evaluation.feedback}`
    );
  }

  // ─── Chip Actions ───────────────────────────────────────────────────────────

  function handleChipClick(chip: SuggestionChip) {
    switch (chip.action) {
      case "start-genre": {
        const g = chip.payload?.genre as InterviewGenre;
        if (g) handleGenreSelect(g);
        break;
      }

      case "next-question":
      case "practice-genre": {
        if (!genre) return;
        const { questionResult, chips: newChips } = nextQuestion(genre, usedQuestionIds, false);
        setCurrentQuestion(questionResult.question);
        setUsedQuestionIds((prev) => [...prev, questionResult.question.id]);
        setFeedback(null);
        setImprovedAnswer(null);
        setUserAnswer("");
        setPhase("question");
        setChips(newChips);
        setShowStarTip(false);
        setAnswerError("");
        addBotMessage(
          `📋 Next question:\n\n${questionResult.question.text}${
            questionResult.tip ? `\n\n💡 Tip: ${questionResult.tip}` : ""
          }`
        );
        break;
      }

      case "harder-question": {
        if (!genre) return;
        const { questionResult, chips: newChips } = nextQuestion(genre, usedQuestionIds, true);
        setCurrentQuestion(questionResult.question);
        setUsedQuestionIds((prev) => [...prev, questionResult.question.id]);
        setFeedback(null);
        setImprovedAnswer(null);
        setUserAnswer("");
        setPhase("question");
        setChips(newChips);
        setShowStarTip(false);
        setAnswerError("");
        addBotMessage(
          `🔥 Here is a harder question for you:\n\n${questionResult.question.text}${
            questionResult.tip ? `\n\n💡 Tip: ${questionResult.tip}` : ""
          }`
        );
        break;
      }

      case "change-genre": {
        setPhase("select-genre");
        setGenre(null);
        setCurrentQuestion(null);
        setFeedback(null);
        setImprovedAnswer(null);
        setUserAnswer("");
        setChips(getLandingChips());
        setShowStarTip(false);
        setAnswerError("");
        addBotMessage("Sure! Choose a different interview type below.");
        break;
      }

      case "evaluate-again": {
        if (!currentQuestion || !genre || !userAnswer) {
          addBotMessage(
            "Type a new answer in the box below, then submit it to get fresh feedback!"
          );
          setPhase("question");
          setFeedback(null);
          setImprovedAnswer(null);
        }
        break;
      }

      case "rewrite-answer": {
        if (improvedAnswer) {
          addBotMessage(`✨ Here is a stronger version of your answer:\n\n${improvedAnswer}`);
        }
        break;
      }

      case "star-tip": {
        setShowStarTip(true);
        break;
      }

      case "end-session": {
        const summary = endSession(history);
        setSummaryData({
          totalQuestions: summary.totalQuestions,
          averageScore: summary.averageScore,
        });
        setPhase("summary");
        setChips(summary.chips);
        addBotMessage(
          `Great session! You answered ${summary.totalQuestions} question${
            summary.totalQuestions !== 1 ? "s" : ""
          } with an average score of ${summary.averageScore}/10.`
        );
        break;
      }

      default:
        break;
    }
  }

  // ─── Restart ────────────────────────────────────────────────────────────────

  function handleRestart() {
    setPhase("select-genre");
    setGenre(null);
    setCurrentQuestion(null);
    setFeedback(null);
    setImprovedAnswer(null);
    setUserAnswer("");
    setHistory([]);
    setUsedQuestionIds([]);
    setSummaryData(null);
    setChips(getLandingChips());
    setShowStarTip(false);
    setAnswerError("");
    setMessages([
      {
        role: "bot",
        content:
          "👋 Welcome back! Choose an interview type below to start a new session.",
      },
    ]);
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full">
      {/* ── Chat Messages ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {/* STAR tip (shown inline) */}
        {showStarTip && <StarTipBox onDismiss={() => setShowStarTip(false)} />}

        {/* Genre Selector (shown in phase: select-genre) */}
        {phase === "select-genre" && (
          <div className="mt-4">
            <GenreSelector onSelect={handleGenreSelect} />
          </div>
        )}

        {/* Feedback Card (shown in phase: feedback) */}
        {phase === "feedback" && feedback && (
          <div className="mt-2">
            <FeedbackCard evaluation={feedback} />
          </div>
        )}

        {/* Improved Answer (shown in phase: feedback) */}
        {phase === "feedback" && improvedAnswer && (
          <ImprovedAnswerCard improvedAnswer={improvedAnswer} />
        )}

        {/* Session Summary (shown in phase: summary) */}
        {phase === "summary" && summaryData && (
          <div className="mt-4">
            <SessionSummary
              history={history}
              totalQuestions={summaryData.totalQuestions}
              averageScore={summaryData.averageScore}
              onRestart={handleRestart}
            />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggestion Chips ───────────────────────────────── */}
      {chips.length > 0 && phase !== "select-genre" && phase !== "summary" && (
        <div className="px-4 pb-2">
          <SuggestionChips chips={chips} onChipClick={handleChipClick} />
        </div>
      )}

      {/* ── Summary Phase Chips ────────────────────────────── */}
      {phase === "summary" && chips.length > 0 && (
        <div className="px-4 pb-2">
          <SuggestionChips chips={chips} onChipClick={handleChipClick} />
        </div>
      )}

      {/* ── Answer Input (visible only during question/feedback phases) ── */}
      {(phase === "question" || (phase === "feedback" && currentQuestion)) && (
        <div className="border-t border-gray-200 bg-white px-4 py-3">
          {/* Current question reminder */}
          {currentQuestion && (
            <p className="text-xs text-gray-500 mb-2 truncate">
              <span className="font-medium">Q:</span> {currentQuestion.text}
            </p>
          )}

          {/* Error */}
          {answerError && (
            <p className="text-xs text-red-500 mb-1">{answerError}</p>
          )}

          <div className="flex gap-2 items-end">
            <textarea
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
                if (answerError) setAnswerError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  handleSubmitAnswer();
                }
              }}
              placeholder="Type your answer here… (Ctrl+Enter to submit)"
              rows={3}
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            <button
              onClick={handleSubmitAnswer}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors self-end"
            >
              Submit
            </button>
          </div>

          {/* Landing chips shown below input in question phase */}
          {phase === "question" && chips.length > 0 && (
            <SuggestionChips chips={chips} onChipClick={handleChipClick} />
          )}
        </div>
      )}
    </div>
  );
}
