import { InterviewType } from "@/types/interview";

const QUESTION_BANK: Record<InterviewType, string[]> = {
  behavioral: [
    "Tell me about a time you handled a conflict in a team.",
    "Describe a situation where you had to learn something quickly.",
    "Share a time when you made a mistake and what you learned.",
    "Tell me about a time you took initiative without being asked.",
  ],
  technical: [
    "How would you debug a slow API endpoint?",
    "Explain a project where you designed a feature end-to-end.",
    "How would you improve performance on a page with heavy data rendering?",
    "What trade-offs do you consider when choosing a database?",
  ],
  hr: [
    "Why do you want to work at this company?",
    "How do you handle feedback from managers or peers?",
    "How would your previous teammates describe your work style?",
    "Where do you see your career in the next 2-3 years?",
  ],
};

export function generateQuestionTool(
  interviewType: InterviewType,
  askedQuestions: string[] = []
): string {
  const availableQuestions = QUESTION_BANK[interviewType].filter(
    (question) => !askedQuestions.includes(question)
  );

  const pool = availableQuestions.length > 0 ? availableQuestions : QUESTION_BANK[interviewType];
  const randomIndex = Math.floor(Math.random() * pool.length);

  return pool[randomIndex];
}
