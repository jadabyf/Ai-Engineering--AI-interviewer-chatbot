"use client";

import { FormEvent, useMemo, useState } from "react";
import { interviewAgent } from "@/lib/interviewAgent";
import { AnswerHistoryItem, ImprovedAnswerResult, InterviewType, EvaluationResult } from "@/types/interview";
import { FeedbackCard } from "./FeedbackCard";
import { SessionSummary } from "./SessionSummary";
import { StarTipBox } from "./StarTipBox";
import styles from "./InterviewCoach.module.css";

const INTERVIEW_TYPES: { label: string; value: InterviewType }[] = [
  { label: "Behavioral", value: "behavioral" },
  { label: "Technical", value: "technical" },
  { label: "General HR", value: "hr" },
];

const STARTER_QUESTIONS: Record<InterviewType, string[]> = {
  behavioral: [
    "Tell me about a time you resolved a team conflict.",
    "Describe a challenge where you showed leadership.",
  ],
  technical: [
    "How would you improve a slow web page?",
    "Explain how you would debug a failing API request.",
  ],
  hr: [
    "Why are you interested in this position?",
    "How do you manage priorities under pressure?",
  ],
};

export function InterviewCoach() {
  const [interviewType, setInterviewType] = useState<InterviewType>("behavioral");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [improved, setImproved] = useState<ImprovedAnswerResult | null>(null);
  const [history, setHistory] = useState<AnswerHistoryItem[]>([]);
  const [error, setError] = useState<string>("");

  const askedQuestions = useMemo(() => history.map((item) => item.question), [history]);

  function startInterview() {
    const result = interviewAgent.startInterview(interviewType, askedQuestions);
    setQuestion(result.question);
    setAnswer("");
    setEvaluation(null);
    setImproved(null);
    setError("");
  }

  function handleSubmitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!question) {
      setError("Start the interview to receive a question first.");
      return;
    }

    if (!answer.trim()) {
      setError("Please write an answer before submitting.");
      return;
    }

    const result = interviewAgent.evaluateAndImprove(question, answer, interviewType);

    setEvaluation(result.evaluation);
    setImproved(result.improved);
    setError("");

    setHistory((prev) => [
      ...prev,
      {
        question,
        answer,
        interviewType,
        score: result.evaluation.score,
      },
    ]);
  }

  function nextQuestion() {
    const result = interviewAgent.startInterview(interviewType, [...askedQuestions, question]);
    setQuestion(result.question);
    setAnswer("");
    setEvaluation(null);
    setImproved(null);
    setError("");
  }

  return (
    <main className={styles.pageWrap}>
      <section className={styles.hero}>
        <p className={styles.badge}>Next.js + MCP-style Tools + Eval Logic</p>
        <h1>AI Interview Coach</h1>
        <p className={styles.subtitle}>
          Practice interviews, get feedback, and improve your answers.
        </p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Start Mock Interview</h2>

        <div className={styles.controls}>
          <label htmlFor="interviewType">Interview Type</label>
          <select
            id="interviewType"
            value={interviewType}
            onChange={(event) => setInterviewType(event.target.value as InterviewType)}
          >
            {INTERVIEW_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <button className={styles.primaryButton} onClick={startInterview} type="button">
            Start Interview
          </button>
        </div>

        <div className={styles.sampleBlock}>
          <p className={styles.sampleTitle}>Starter questions for this type:</p>
          <ul>
            {STARTER_QUESTIONS[interviewType].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {interviewType === "behavioral" && <StarTipBox />}

      {question && (
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Question</h2>
          <p className={styles.questionText}>{question}</p>

          <form onSubmit={handleSubmitAnswer} className={styles.answerForm}>
            <label htmlFor="answer">Your Answer</label>
            <textarea
              id="answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Write your interview answer here..."
              rows={7}
            />
            <button className={styles.primaryButton} type="submit">
              Submit Answer
            </button>
          </form>

          {error && <p className={styles.errorText}>{error}</p>}
        </section>
      )}

      {evaluation && improved && <FeedbackCard evaluation={evaluation} improved={improved} />}

      {evaluation && (
        <section className={styles.actionsRow}>
          <button type="button" onClick={nextQuestion} className={styles.secondaryButton}>
            Next Question
          </button>
        </section>
      )}

      <SessionSummary history={history} />
    </main>
  );
}
