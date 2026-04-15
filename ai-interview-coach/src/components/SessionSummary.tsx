import { AnswerHistoryItem } from "@/types/interview";
import styles from "./InterviewCoach.module.css";

interface SessionSummaryProps {
  history: AnswerHistoryItem[];
}

function getAverageScore(history: AnswerHistoryItem[]) {
  if (history.length === 0) {
    return 0;
  }

  const total = history.reduce((sum, item) => sum + item.score, 0);
  return total / history.length;
}

export function SessionSummary({ history }: SessionSummaryProps) {
  if (history.length === 0) {
    return null;
  }

  const average = getAverageScore(history);
  const lastScore = history[history.length - 1].score;

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Session Summary</h2>
      <div className={styles.summaryGrid}>
        <div>
          <p className={styles.summaryLabel}>Questions Completed</p>
          <p className={styles.summaryValue}>{history.length}</p>
        </div>
        <div>
          <p className={styles.summaryLabel}>Average Score</p>
          <p className={styles.summaryValue}>{average.toFixed(1)}/10</p>
        </div>
        <div>
          <p className={styles.summaryLabel}>Latest Score</p>
          <p className={styles.summaryValue}>{lastScore}/10</p>
        </div>
      </div>
    </section>
  );
}
