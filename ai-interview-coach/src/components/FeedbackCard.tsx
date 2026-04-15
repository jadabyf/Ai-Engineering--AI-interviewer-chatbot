import { EvaluationResult, ImprovedAnswerResult } from "@/types/interview";
import styles from "./InterviewCoach.module.css";

interface FeedbackCardProps {
  evaluation: EvaluationResult;
  improved: ImprovedAnswerResult;
}

export function FeedbackCard({ evaluation, improved }: FeedbackCardProps) {
  return (
    <section className={styles.card} aria-live="polite">
      <h2 className={styles.cardTitle}>Feedback</h2>

      <div className={styles.scoreRow}>
        <span className={styles.scoreLabel}>Score</span>
        <span className={styles.scoreValue}>{evaluation.score}/10</span>
      </div>

      <p className={styles.feedbackText}>{evaluation.feedback}</p>

      <div className={styles.listBlock}>
        <h3>Strengths</h3>
        {evaluation.strengths.length > 0 ? (
          <ul>
            {evaluation.strengths.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyText}>No strengths detected yet. Add more detail next round.</p>
        )}
      </div>

      <div className={styles.listBlock}>
        <h3>Improvements</h3>
        {evaluation.improvements.length > 0 ? (
          <ul>
            {evaluation.improvements.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyText}>Great work. Try keeping this quality in future answers.</p>
        )}
      </div>

      <div className={styles.listBlock}>
        <h3>Improved Answer</h3>
        <p className={styles.improvedAnswer}>{improved.improvedAnswer}</p>
      </div>
    </section>
  );
}
