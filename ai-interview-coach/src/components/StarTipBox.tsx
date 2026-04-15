import styles from "./InterviewCoach.module.css";

export function StarTipBox() {
  return (
    <aside className={styles.starTip}>
      <h3>Behavioral Tip: Use STAR</h3>
      <p>
        <strong>S</strong>ituation: Set context.
      </p>
      <p>
        <strong>T</strong>ask: Explain your responsibility.
      </p>
      <p>
        <strong>A</strong>ction: Describe what you did.
      </p>
      <p>
        <strong>R</strong>esult: Share the outcome and what you learned.
      </p>
    </aside>
  );
}
