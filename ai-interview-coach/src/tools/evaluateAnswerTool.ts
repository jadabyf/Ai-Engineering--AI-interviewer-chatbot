import { EvaluationResult, InterviewType } from "@/types/interview";

function containsWords(text: string, words: string[]): number {
  const normalized = text.toLowerCase();
  return words.reduce((total, word) => {
    return total + (normalized.includes(word) ? 1 : 0);
  }, 0);
}

function safeScore(score: number): number {
  return Math.max(1, Math.min(10, score));
}

function evaluateBehavioral(answer: string): EvaluationResult {
  const lowerAnswer = answer.toLowerCase();
  const strengths: string[] = [];
  const improvements: string[] = [];

  const hasSituation = /(situation|context|when)/.test(lowerAnswer);
  const hasAction = /(action|i did|i took|i decided|i led)/.test(lowerAnswer);
  const hasResult = /(result|outcome|impact|learned|improved)/.test(lowerAnswer);
  const hasNumbers = /\d/.test(lowerAnswer);

  let score = 4;

  if (hasSituation) {
    score += 2;
    strengths.push("You gave useful context for your example.");
  } else {
    improvements.push("Add the Situation clearly so the interviewer understands the background.");
  }

  if (hasAction) {
    score += 2;
    strengths.push("You explained what actions you personally took.");
  } else {
    improvements.push("Describe the specific actions you took, not only what the team did.");
  }

  if (hasResult) {
    score += 2;
    strengths.push("You included the result or impact of your actions.");
  } else {
    improvements.push("Include a result so your story has a clear ending.");
  }

  if (hasNumbers) {
    score += 1;
    strengths.push("You used details or metrics, which makes the answer stronger.");
  } else {
    improvements.push("If possible, include one measurable detail (time saved, growth, accuracy, etc.).");
  }

  if (answer.trim().length < 120) {
    score -= 1;
    improvements.push("Your answer is a bit short. Expand with one more concrete detail.");
  }

  return {
    score: safeScore(score),
    feedback:
      "For behavioral questions, strong answers usually follow a Situation-Action-Result style. Keep your story clear and focused.",
    strengths,
    improvements,
  };
}

function evaluateTechnical(answer: string): EvaluationResult {
  const strengths: string[] = [];
  const improvements: string[] = [];

  const clarityWords = containsWords(answer, ["first", "then", "because", "so that", "step"]);
  const logicWords = containsWords(answer, ["trade-off", "compare", "option", "risk", "assumption"]);
  const specificWords = containsWords(answer, ["cache", "index", "api", "database", "test", "monitor"]);
  const hasNumbers = /\d/.test(answer);

  let score = 4;

  if (clarityWords >= 2) {
    score += 2;
    strengths.push("Your explanation has a clear step-by-step flow.");
  } else {
    improvements.push("Improve clarity by presenting your solution in ordered steps.");
  }

  if (logicWords >= 1) {
    score += 2;
    strengths.push("You showed reasoning and considered trade-offs.");
  } else {
    improvements.push("Explain why your approach is better than alternatives.");
  }

  if (specificWords >= 2) {
    score += 2;
    strengths.push("You used technical specifics, which adds credibility.");
  } else {
    improvements.push("Add more technical specifics (tools, patterns, or metrics). ");
  }

  if (hasNumbers) {
    score += 1;
    strengths.push("You used measurable details, which helps interviewers evaluate impact.");
  }

  if (answer.trim().length < 100) {
    score -= 1;
    improvements.push("Your answer is short. Add one concrete example from a project.");
  }

  return {
    score: safeScore(score),
    feedback:
      "For technical interviews, focus on clarity, logic, and specificity. Show both your process and your technical judgment.",
    strengths,
    improvements,
  };
}

function evaluateHR(answer: string): EvaluationResult {
  const strengths: string[] = [];
  const improvements: string[] = [];

  const professionalismWords = containsWords(answer, ["team", "responsibility", "growth", "value", "respect"]);
  const confidenceWords = containsWords(answer, ["i can", "i will", "i am confident", "i have"]);
  const communicationWords = containsWords(answer, ["example", "specifically", "for instance", "clearly"]);

  let score = 4;

  if (professionalismWords >= 2) {
    score += 2;
    strengths.push("Your tone sounds professional and team-oriented.");
  } else {
    improvements.push("Use more professional language and connect your answer to workplace values.");
  }

  if (confidenceWords >= 1) {
    score += 2;
    strengths.push("You communicated confidence in your abilities.");
  } else {
    improvements.push("Use confident statements about what you can contribute.");
  }

  if (communicationWords >= 1 || answer.length > 120) {
    score += 2;
    strengths.push("Your communication is reasonably clear and complete.");
  } else {
    improvements.push("Give one specific example to make your answer easier to trust.");
  }

  if (/(honestly|maybe|not sure)/i.test(answer)) {
    score -= 1;
    improvements.push("Avoid uncertain filler words and keep your tone direct.");
  }

  return {
    score: safeScore(score),
    feedback:
      "For HR-style questions, aim for professionalism, confidence, and clear communication with a practical example.",
    strengths,
    improvements,
  };
}

export function evaluateAnswerTool(
  question: string,
  answer: string,
  interviewType: InterviewType
): EvaluationResult {
  if (!answer.trim()) {
    return {
      score: 1,
      feedback: "Please provide an answer so the coach can evaluate it.",
      strengths: [],
      improvements: ["Write at least 2-4 sentences before submitting."],
    };
  }

  if (interviewType === "behavioral") {
    return evaluateBehavioral(answer);
  }

  if (interviewType === "technical") {
    return evaluateTechnical(answer);
  }

  return evaluateHR(answer);
}
