"use client";

/**
 * ChatWindow is the full interview practice workspace.
 *
 * UX model:
 * - Welcome mode before topic selection
 * - Practice mode after topic selection
 *
 * Architecture model:
 * - UI state lives in this component
 * - Interview operations are requested via MCP API route (/api/mcp)
 */

import { useEffect, useRef, useState } from "react";

import FeedbackCard from "@/components/FeedbackCard";
import ImprovedAnswerCard from "@/components/ImprovedAnswerCard";
import MessageBubble from "@/components/MessageBubble";
import SessionSummary from "@/components/SessionSummary";
import StarTipBox from "@/components/StarTipBox";
import SuggestionChips from "@/components/SuggestionChips";
import TopicSidebar from "@/components/TopicSidebar";
import WelcomeState from "@/components/WelcomeState";
import CustomQuestionBox from "@/components/CustomQuestionBox";
import DeepFeedbackPanel from "@/components/DeepFeedbackPanel";

import { callMcpTool } from "@/lib/mcpClient";
import { genres } from "@/lib/genres";
import { AnalyzeAnswerResult } from "@/types/analysis";
import { DeepFeedbackPayload } from "@/types/coaching";
import {
  EvaluationResult,
  HistoryEntry,
  InterviewGenre,
  Question,
  SessionPhase,
  SuggestionChip,
} from "@/types";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export default function ChatWindow() {
  const [phase, setPhase] = useState<SessionPhase>("select-genre");
  const [selectedGenre, setSelectedGenre] = useState<InterviewGenre | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [lastUserAnswer, setLastUserAnswer] = useState("");
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [improvedAnswer, setImprovedAnswer] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [chips, setChips] = useState<SuggestionChip[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content: "Welcome to AI Interview Coach. Pick a topic in the sidebar to enter practice mode.",
    },
  ]);
  const [showStarTip, setShowStarTip] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [answerError, setAnswerError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const [summaryData, setSummaryData] = useState<{
    totalQuestions: number;
    averageScore: number;
  } | null>(null);
  const [deepFeedback, setDeepFeedback] = useState<DeepFeedbackPayload | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalyzeAnswerResult[]>([]);
  const [showDeepFeedback, setShowDeepFeedback] = useState(false);
  const [customQuestionInput, setCustomQuestionInput] = useState("");

  const messageScrollRef = useRef<HTMLDivElement>(null);
  const answerInputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const container = messageScrollRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, evaluationResult, phase, improvedAnswer]);

  useEffect(() => {
    void refreshSuggestionChips("welcome", null);
  }, []);

  function addBotMessage(content: string) {
    setMessages((prev) => [...prev, { role: "bot", content }]);
  }

  function addUserMessage(content: string) {
    setMessages((prev) => [...prev, { role: "user", content }]);
  }

  function handleUseSuggestedResponse(response: string) {
    setUserAnswer(response);
    if (answerError) setAnswerError("");
    addBotMessage("I added a suggested response to your answer box. Edit it so it sounds like you, then send.");
    requestAnimationFrame(() => {
      answerInputRef.current?.focus();
    });
  }

  async function refreshSuggestionChips(
    currentState: "welcome" | "question" | "feedback" | "summary",
    topic: InterviewGenre | null
  ) {
    const response = await callMcpTool("get_suggestion_chips", {
      topic,
      currentState,
    });

    if (response.ok) {
      setChips(response.data.chips);
    }
  }

  async function requestNextQuestion(
    topic: InterviewGenre,
    usedIdsOverride?: string[],
    difficulty?: "easy" | "medium" | "hard"
  ) {
    const response = await callMcpTool("generate_question", {
      topic,
      difficulty,
      usedIds: usedIdsOverride ?? usedQuestionIds,
    });

    if (!response.ok) {
      addBotMessage("I could not generate a question right now. Please try again.");
      return;
    }

    setCurrentQuestion(response.data.question);
    setUsedQuestionIds((prev) => [...prev, response.data.question.id]);
    setDeepFeedback(null);
    setShowDeepFeedback(false);

    addBotMessage(
      `Here is your question:\n\n${response.data.question.text}${
        response.data.tip ? `\n\nTip: ${response.data.tip}` : ""
      }`
    );

    setPhase("question");
    await refreshSuggestionChips("question", topic);
  }

  async function startGenreFlow(genreToStart: InterviewGenre) {
    if (isBusy) return;

    setIsBusy(true);
    const label = genres.find((genre) => genre.id === genreToStart)?.label ?? genreToStart;

    addUserMessage(`I want to practice ${label}.`);

    const switchResponse = await callMcpTool("switch_topic", {
      nextTopic: genreToStart,
    });

    if (!switchResponse.ok) {
      addBotMessage("I could not switch topics right now. Please try again.");
      setIsBusy(false);
      return;
    }

    setSelectedGenre(genreToStart);
    setCurrentQuestion(null);
    setUsedQuestionIds([]);
    setPhase("question");
    setEvaluationResult(null);
    setImprovedAnswer(null);
    setUserAnswer("");
    setLastUserAnswer("");
    setShowStarTip(false);
    setAnswerError("");
    setSummaryData(null);
    setDeepFeedback(null);
    setAnalysisHistory([]);
    setShowDeepFeedback(false);

    addBotMessage(switchResponse.data.confirmation);
    addBotMessage(switchResponse.data.starterMessage);

    if (switchResponse.data.triggerFirstQuestion) {
      await requestNextQuestion(genreToStart, []);
    }

    setIsBusy(false);
  }

  async function handleSubmitAnswer() {
    if (!userAnswer.trim()) {
      setAnswerError("Please type your answer before submitting.");
      return;
    }

    if (!currentQuestion || !selectedGenre) return;

    setAnswerError("");
    addUserMessage(userAnswer);
    setLastUserAnswer(userAnswer);

    const evaluateResponse = await callMcpTool("run_feedback_pipeline", {
      topic: selectedGenre,
      question: currentQuestion.text,
      answer: userAnswer,
      genre: selectedGenre,
      difficulty: currentQuestion.difficulty,
      previousAnswerHistory: history.map((entry) => entry.userAnswer),
      previousAnalysisResults: analysisHistory,
    });

    if (!evaluateResponse.ok) {
      addBotMessage("I could not evaluate your answer right now. Please try again.");
      return;
    }

    const newEntry: HistoryEntry = {
      question: currentQuestion,
      userAnswer,
      evaluation: {
        score: evaluateResponse.data.quickFeedback.score,
        feedback: evaluateResponse.data.quickFeedback.summary,
        strengths: evaluateResponse.data.quickFeedback.strengths,
        improvements: evaluateResponse.data.quickFeedback.topImprovements,
        rubricNotes: "Adaptive feedback generated from multi-tool analysis.",
      },
      improvedAnswer: "",
    };

    setHistory((prev) => [...prev, newEntry]);
    setAnalysisHistory((prev) => [...prev, evaluateResponse.data.deepFeedback.analysis]);
    setEvaluationResult(newEntry.evaluation);
    setDeepFeedback(evaluateResponse.data.deepFeedback);
    setImprovedAnswer(null);
    setShowDeepFeedback(false);
    setPhase("feedback");
    setUserAnswer("");

    await refreshSuggestionChips("feedback", selectedGenre);

    addBotMessage(
      `Score: ${evaluateResponse.data.quickFeedback.score}/10\n\n${evaluateResponse.data.quickFeedback.summary}`
    );

    const firstSuggestion = evaluateResponse.data.deepFeedback.coaching.suggestedResponses[0];
    if (firstSuggestion) {
      addBotMessage(`Suggested response:\n\n${firstSuggestion}`);
    }
  }

  async function handleRewriteAnswer() {
    if (!currentQuestion || !selectedGenre || !lastUserAnswer) {
      addBotMessage("Answer a question first, then I can rewrite your response.");
      return;
    }

    const response = await callMcpTool("improve_answer", {
      topic: selectedGenre,
      question: currentQuestion.text,
      answer: lastUserAnswer,
    });

    if (!response.ok) {
      addBotMessage("I could not rewrite your answer right now. Please try again.");
      return;
    }

    setImprovedAnswer(response.data.improvedAnswer);

    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const latest = updated[updated.length - 1];
      updated[updated.length - 1] = {
        ...latest,
        improvedAnswer: response.data.improvedAnswer,
      };
      return updated;
    });

    addBotMessage("I rewrote your answer with stronger structure and clarity.");
  }

  async function handleDetailedCritique() {
    if (!deepFeedback) {
      addBotMessage("Submit an answer first, then I can show deep analysis.");
      return;
    }
    setShowDeepFeedback(true);
    setPhase("feedback");
    addBotMessage("Deep analysis is ready below with dissection, coaching plan, and a targeted follow-up question.");
  }

  async function handleUseCustomQuestion() {
    if (!selectedGenre) {
      addBotMessage("Choose a topic first, then you can practice your own question.");
      return;
    }

    if (!customQuestionInput.trim()) {
      addBotMessage("Type your custom interview question first.");
      return;
    }

    const response = await callMcpTool("set_custom_question", {
      topic: selectedGenre,
      customQuestion: customQuestionInput,
    });

    if (!response.ok) {
      addBotMessage("I could not set your custom question right now. Please try again.");
      return;
    }

    const customQuestion: Question = {
      id: `custom-${Date.now()}`,
      genre: selectedGenre,
      text: response.data.confirmedQuestion,
      difficulty: "medium",
    };

    setCurrentQuestion(customQuestion);
    setUsedQuestionIds((prev) => [...prev, customQuestion.id]);
    setEvaluationResult(null);
    setImprovedAnswer(null);
    setDeepFeedback(null);
    setShowDeepFeedback(false);
    setUserAnswer("");
    setLastUserAnswer("");
    setPhase("question");

    addUserMessage(`Use this custom question: ${response.data.confirmedQuestion}`);
    addBotMessage(response.data.starterMessage);
    addBotMessage(`Custom question:\n\n${response.data.confirmedQuestion}`);

    setCustomQuestionInput("");
    await refreshSuggestionChips("question", selectedGenre);
  }

  async function handleEvaluateAgain() {
    if (!currentQuestion || !selectedGenre || !lastUserAnswer) {
      addBotMessage("Submit an answer first, then I can re-evaluate it.");
      return;
    }

    const response = await callMcpTool("run_feedback_pipeline", {
      topic: selectedGenre,
      question: currentQuestion.text,
      answer: lastUserAnswer,
      genre: selectedGenre,
      difficulty: currentQuestion.difficulty,
      previousAnswerHistory: history.map((entry) => entry.userAnswer),
      previousAnalysisResults: analysisHistory,
    });

    if (!response.ok) {
      addBotMessage("I could not re-evaluate that answer right now.");
      return;
    }

    setEvaluationResult({
      score: response.data.quickFeedback.score,
      feedback: response.data.quickFeedback.summary,
      strengths: response.data.quickFeedback.strengths,
      improvements: response.data.quickFeedback.topImprovements,
      rubricNotes: "Adaptive feedback generated from multi-tool analysis.",
    });
    setDeepFeedback(response.data.deepFeedback);
    setAnalysisHistory((prev) => [...prev, response.data.deepFeedback.analysis]);
    setShowDeepFeedback(false);
    setPhase("feedback");
    addBotMessage(
      `Re-evaluated score: ${response.data.quickFeedback.score}/10\n\n${response.data.quickFeedback.summary}`
    );

    const firstSuggestion = response.data.deepFeedback.coaching.suggestedResponses[0];
    if (firstSuggestion) {
      addBotMessage(`Suggested response:\n\n${firstSuggestion}`);
    }
  }

  async function handleNextQuestion(harder = false) {
    if (!selectedGenre) {
      addBotMessage("Choose a topic first so I can generate a question.");
      return;
    }

    setEvaluationResult(null);
    setImprovedAnswer(null);
    setUserAnswer("");
    setShowStarTip(false);
    setAnswerError("");

    await requestNextQuestion(selectedGenre, undefined, harder ? "hard" : undefined);
  }

  async function handleChipClick(chip: SuggestionChip) {
    switch (chip.action) {
      case "start-genre": {
        const g = chip.payload?.genre as InterviewGenre;
        if (g) {
          await startGenreFlow(g);
        }
        break;
      }

      case "next-question":
      case "practice-genre": {
        await handleNextQuestion(false);
        break;
      }

      case "harder-question": {
        await handleNextQuestion(true);
        break;
      }

      case "detailed-critique": {
        await handleDetailedCritique();
        break;
      }

      case "change-genre": {
        setPhase("select-genre");
        setSelectedGenre(null);
        setCurrentQuestion(null);
        setEvaluationResult(null);
        setImprovedAnswer(null);
        setUserAnswer("");
        setLastUserAnswer("");
        setShowStarTip(false);
        setAnswerError("");
        setSummaryData(null);
        setUsedQuestionIds([]);
        setDeepFeedback(null);
        setShowDeepFeedback(false);
        addBotMessage("Select a topic in the sidebar to start a new practice flow.");
        await refreshSuggestionChips("welcome", null);
        break;
      }

      case "evaluate-again": {
        await handleEvaluateAgain();
        break;
      }

      case "rewrite-answer": {
        await handleRewriteAnswer();
        break;
      }

      case "star-tip": {
        setShowStarTip(true);
        break;
      }

      case "end-session": {
        const totalQuestions = history.length;
        const averageScore =
          totalQuestions === 0
            ? 0
            : Math.round(
                history.reduce((sum, item) => sum + item.evaluation.score, 0) /
                  totalQuestions
              );

        setSummaryData({ totalQuestions, averageScore });
        setPhase("summary");
        await refreshSuggestionChips("summary", selectedGenre);

        addBotMessage(
          `Session complete. You answered ${totalQuestions} question${
            totalQuestions !== 1 ? "s" : ""
          } with an average score of ${averageScore}/10.`
        );
        break;
      }

      default:
        break;
    }
  }

  function handleHowItWorks() {
    addBotMessage(
      "How it works:\n1) Pick a topic.\n2) Answer the question.\n3) Improve with feedback."
    );
  }

  function handleRestart() {
    setPhase("select-genre");
    setSelectedGenre(null);
    setCurrentQuestion(null);
    setEvaluationResult(null);
    setImprovedAnswer(null);
    setUserAnswer("");
    setLastUserAnswer("");
    setHistory([]);
    setUsedQuestionIds([]);
    setSummaryData(null);
    setChips([]);
    setDeepFeedback(null);
    setAnalysisHistory([]);
    setShowDeepFeedback(false);
    setShowStarTip(false);
    setAnswerError("");
    setMessages([
      {
        role: "bot",
        content: "Welcome back. Choose a topic in the sidebar to begin a new session.",
      },
    ]);
    void refreshSuggestionChips("welcome", null);
  }

  return (
    <div className="app-shell bg-(--bg-main)">
      <main className="h-full p-3 sm:p-4">
        <div className="mx-auto max-w-7xl h-full min-h-0 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-3 sm:gap-4">
          <TopicSidebar
            selectedTopic={selectedGenre}
            onSelectTopic={(topic) => void startGenreFlow(topic)}
            onStartNewSession={handleRestart}
          />

          <section className="h-full min-h-0 rounded-2xl border border-(--border-soft) bg-(--bg-chat) flex flex-col overflow-hidden">
            <header className="shrink-0 border-b border-(--border-soft) px-4 sm:px-6 py-4 bg-(--bg-chat) flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-(--text-primary)">
                  {selectedGenre
                    ? `${genres.find((topic) => topic.id === selectedGenre)?.label ?? selectedGenre} Practice`
                    : "Interview Practice Workspace"}
                </h2>
                <p className="text-xs text-(--text-secondary) mt-0.5">
                  {selectedGenre
                    ? "You are in focused practice mode."
                    : "Select a topic from the sidebar to begin."}
                </p>
              </div>
              {isBusy && (
                <span className="text-xs font-medium text-(--brand-primary)">Working...</span>
              )}
            </header>

            {selectedGenre && currentQuestion && (
              <div className="shrink-0 border-b border-(--border-soft) bg-(--bg-main) px-4 sm:px-6 py-3">
                <p className="text-xs uppercase tracking-wide text-(--text-secondary)">Current Question</p>
                <p className="text-sm sm:text-base font-medium text-(--text-primary) mt-1 line-clamp-2">
                  {currentQuestion.text}
                </p>
              </div>
            )}

            <div
              ref={messageScrollRef}
              className="chat-scroll flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 bg-linear-to-b from-(--bg-main) to-(--bg-chat)"
            >
              {!selectedGenre && <WelcomeState onOpenTopicGuide={handleHowItWorks} />}

              {messages.map((msg, i) => (
                <MessageBubble key={i} role={msg.role} content={msg.content} />
              ))}

              {showStarTip && <StarTipBox onDismiss={() => setShowStarTip(false)} />}

              {phase === "feedback" && evaluationResult && (
                <div className="mt-2">
                  <FeedbackCard evaluation={evaluationResult} />
                </div>
              )}

              {phase === "feedback" && improvedAnswer && (
                <div className="mt-2">
                  <ImprovedAnswerCard improvedAnswer={improvedAnswer} />
                </div>
              )}

              {phase === "feedback" && deepFeedback && showDeepFeedback && (
                <DeepFeedbackPanel
                  payload={deepFeedback}
                  onUseSuggestedResponse={handleUseSuggestedResponse}
                />
              )}

              {phase === "summary" && summaryData && (
                <div className="mt-2">
                  <SessionSummary
                    history={history}
                    totalQuestions={summaryData.totalQuestions}
                    averageScore={summaryData.averageScore}
                    onRestart={handleRestart}
                  />
                </div>
              )}

            </div>

            {selectedGenre && phase !== "summary" && (
              <div className="shrink-0 border-t border-(--border-soft) bg-(--bg-chat) px-4 sm:px-6 py-3">
                <CustomQuestionBox
                  value={customQuestionInput}
                  onChange={setCustomQuestionInput}
                  onUseQuestion={() => void handleUseCustomQuestion()}
                  disabled={isBusy}
                />

                {answerError && <p className="text-xs text-red-500 mb-1">{answerError}</p>}

                <div className="flex items-end gap-2">
                  <textarea
                    ref={answerInputRef}
                    value={userAnswer}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      if (answerError) setAnswerError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        void handleSubmitAnswer();
                      }
                    }}
                    placeholder="Type your answer here... (Ctrl+Enter to send)"
                    rows={3}
                    className="flex-1 resize-none rounded-xl border border-(--border-soft) bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-(--accent-violet) focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => void handleSubmitAnswer()}
                    className="btn-gradient rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-[0.99]"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            <div className="shrink-0 border-t border-(--border-soft) bg-(--bg-chat) px-4 sm:px-6 py-2">
              <SuggestionChips chips={chips} onChipClick={(chip) => void handleChipClick(chip)} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
