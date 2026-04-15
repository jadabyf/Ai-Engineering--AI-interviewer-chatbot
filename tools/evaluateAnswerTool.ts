/**
 * evaluateAnswerTool
 *
 * Performs rule-based evaluation of a user's interview answer.
 * Each genre has its own set of signal keywords and rubric criteria.
 * Returns a score (1–10), feedback, strengths, and improvements.
 */

import { EvaluationResult, InterviewGenre } from "@/types";

// ─── Genre-specific signal definitions ───────────────────────────────────────

interface GenreSignals {
  /** Keywords that indicate a strong answer for this genre */
  strengthKeywords: string[];
  /** Structural or content signals that add bonus points */
  bonusSignals: string[];
  /** What a great answer looks like (shown as rubric note) */
  rubricNote: string;
}

const genreSignals: Record<InterviewGenre, GenreSignals> = {
  behavioral: {
    strengthKeywords: [
      "situation",
      "task",
      "action",
      "result",
      "i decided",
      "i implemented",
      "i led",
      "outcome",
      "learned",
      "improved",
      "achieved",
      "contributed",
      "resolved",
      "team",
      "challenge",
    ],
    bonusSignals: ["as a result", "this led to", "the outcome was", "i learned that"],
    rubricNote:
      "Strong behavioral answers follow the STAR method: Situation, Task, Action, Result.",
  },
  technical: {
    strengthKeywords: [
      "algorithm",
      "complexity",
      "time complexity",
      "space complexity",
      "database",
      "cache",
      "tested",
      "scalable",
      "efficient",
      "trade-off",
      "tradeoff",
      "implementation",
      "architecture",
      "data structure",
      "performance",
    ],
    bonusSignals: ["for example", "specifically", "in practice", "this means", "the reason"],
    rubricNote:
      "Strong technical answers are specific, logical, and include real examples or considerations.",
  },
  hr: {
    strengthKeywords: [
      "passionate",
      "motivated",
      "value",
      "growth",
      "team",
      "contribute",
      "experience",
      "strength",
      "improve",
      "learn",
      "professional",
      "goal",
      "opportunity",
      "culture",
      "aligned",
    ],
    bonusSignals: ["in my experience", "i believe", "i value", "i am committed", "i strive"],
    rubricNote:
      "Strong HR answers are professional, self-aware, and clearly communicate your values and goals.",
  },
  product: {
    strengthKeywords: [
      "user",
      "customer",
      "metric",
      "data",
      "priority",
      "tradeoff",
      "trade-off",
      "impact",
      "value",
      "feedback",
      "insight",
      "measure",
      "success",
      "goal",
      "stakeholder",
    ],
    bonusSignals: [
      "based on data",
      "user research",
      "i would prioritize",
      "the tradeoff",
      "success looks like",
    ],
    rubricNote:
      "Strong product answers show user empathy, data-driven thinking, and clear tradeoff reasoning.",
  },
  leadership: {
    strengthKeywords: [
      "i decided",
      "i led",
      "i owned",
      "accountability",
      "direction",
      "vision",
      "aligned",
      "communicated",
      "team",
      "outcome",
      "ownership",
      "responsibility",
      "strategy",
      "delegated",
      "trust",
    ],
    bonusSignals: [
      "i took ownership",
      "i was responsible",
      "the team achieved",
      "i made the decision",
    ],
    rubricNote:
      "Strong leadership answers show clear ownership, decision-making, and focus on outcomes.",
  },
  "customer-support": {
    strengthKeywords: [
      "understand",
      "empathy",
      "i apologize",
      "sorry",
      "listen",
      "resolve",
      "solution",
      "follow up",
      "follow-up",
      "calm",
      "patient",
      "help",
      "escalate",
      "satisfaction",
      "experience",
    ],
    bonusSignals: [
      "i understand how frustrating",
      "i want to make this right",
      "let me help you",
      "i will follow up",
    ],
    rubricNote:
      "Strong customer support answers lead with empathy, then move clearly to resolution.",
  },
  sales: {
    strengthKeywords: [
      "benefit",
      "value",
      "need",
      "solution",
      "close",
      "prospect",
      "objection",
      "trust",
      "relationship",
      "persuade",
      "confident",
      "revenue",
      "pipeline",
      "follow up",
      "qualify",
    ],
    bonusSignals: [
      "i focused on the benefit",
      "i understood their need",
      "i asked questions",
      "i built trust",
    ],
    rubricNote:
      "Strong sales answers show persuasion skills, benefit-first thinking, and relationship building.",
  },
  internship: {
    strengthKeywords: [
      "eager",
      "learn",
      "curious",
      "excited",
      "grow",
      "project",
      "course",
      "skill",
      "improve",
      "opportunity",
      "contribute",
      "goal",
      "potential",
      "experience",
      "developing",
    ],
    bonusSignals: [
      "i am eager to",
      "i want to grow",
      "i am still learning",
      "this will help me",
    ],
    rubricNote:
      "Strong internship answers show genuine curiosity, humility, and a clear growth mindset.",
  },
  stress: {
    strengthKeywords: [
      "prioritize",
      "calm",
      "focused",
      "communicated",
      "escalated",
      "plan",
      "assess",
      "triage",
      "rational",
      "clear",
      "methodical",
      "breathe",
      "organized",
      "first step",
      "delegated",
    ],
    bonusSignals: [
      "i stayed calm",
      "i prioritized",
      "first i assessed",
      "i communicated early",
    ],
    rubricNote:
      "Strong stress answers show calm, rational prioritization and proactive communication.",
  },
  teamwork: {
    strengthKeywords: [
      "we",
      "team",
      "collaborated",
      "communicated",
      "together",
      "shared",
      "supported",
      "listened",
      "aligned",
      "conflict",
      "resolve",
      "role",
      "contribution",
      "feedback",
      "inclusive",
    ],
    bonusSignals: [
      "we worked together",
      "i listened to",
      "we resolved the conflict",
      "i supported my teammate",
    ],
    rubricNote:
      "Strong teamwork answers show inclusive communication, conflict awareness, and collaborative spirit.",
  },
};

// ─── Main evaluator ──────────────────────────────────────────────────────────

export function evaluateAnswerTool(
  _question: string,
  answer: string,
  genre: InterviewGenre
): EvaluationResult {
  const normalized = answer.toLowerCase();
  const signals = genreSignals[genre];

  // Count how many strength keywords appear in the answer
  const keywordHits = signals.strengthKeywords.filter((kw) =>
    normalized.includes(kw)
  ).length;

  // Count how many bonus signal phrases appear
  const bonusHits = signals.bonusSignals.filter((signal) =>
    normalized.includes(signal)
  ).length;

  // Word count contributes to scoring (longer, more detailed answers score higher)
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const lengthBonus = wordCount >= 100 ? 2 : wordCount >= 60 ? 1 : 0;

  // Scoring formula: base 4 + up to 4 from keywords + up to 1 bonus phrase + length
  const rawScore = 4 + Math.min(keywordHits, 4) + Math.min(bonusHits, 1) + lengthBonus;
  const score = Math.min(10, Math.max(1, rawScore));

  // Build strengths based on detected signals
  const strengths = buildStrengths(normalized, genre, keywordHits, wordCount);

  // Build improvements based on gaps
  const improvements = buildImprovements(normalized, genre, keywordHits, wordCount, score);

  // Generate a feedback summary sentence
  const feedback = buildFeedback(score, genre);

  return {
    score,
    feedback,
    strengths,
    improvements,
    rubricNotes: signals.rubricNote,
  };
}

// ─── Helper: build strengths list ─────────────────────────────────────────────

function buildStrengths(
  answer: string,
  genre: InterviewGenre,
  keywordHits: number,
  wordCount: number
): string[] {
  const strengths: string[] = [];

  if (wordCount >= 60) {
    strengths.push("You provided a detailed, substantive answer.");
  }

  if (keywordHits >= 3) {
    const genreStrengthLabel: Record<InterviewGenre, string> = {
      behavioral: "You used STAR-style language effectively.",
      technical: "You demonstrated technical specificity.",
      hr: "You communicated professionally and clearly.",
      product: "You showed product thinking with relevant terms.",
      leadership: "You demonstrated clear ownership and leadership language.",
      "customer-support": "You showed empathy and a resolution-focused approach.",
      sales: "You used persuasive, benefit-oriented language.",
      internship: "You conveyed genuine enthusiasm and a learning mindset.",
      stress: "You demonstrated calm, structured thinking under pressure.",
      teamwork: "You highlighted collaborative communication effectively.",
    };
    strengths.push(genreStrengthLabel[genre]);
  }

  if (answer.includes("example") || answer.includes("instance") || answer.includes("specifically")) {
    strengths.push("You backed up your answer with a concrete example.");
  }

  if (answer.includes("result") || answer.includes("outcome") || answer.includes("achieved")) {
    strengths.push("You connected your actions to a clear result or outcome.");
  }

  if (strengths.length === 0) {
    strengths.push("You made an attempt to address the question.");
  }

  return strengths;
}

// ─── Helper: build improvements list ──────────────────────────────────────────

function buildImprovements(
  answer: string,
  genre: InterviewGenre,
  keywordHits: number,
  wordCount: number,
  score: number
): string[] {
  const improvements: string[] = [];

  if (wordCount < 40) {
    improvements.push("Try to expand your answer with more detail — aim for at least 60–80 words.");
  }

  if (keywordHits < 2) {
    const genreImprovementHint: Record<InterviewGenre, string> = {
      behavioral:
        "Structure your answer using the STAR method: describe the Situation, your Task, the Action you took, and the Result.",
      technical:
        "Add more technical specificity — mention data structures, complexity, or design decisions relevant to your answer.",
      hr: "Use more confident, professional language and tie your answer to the role and company.",
      product:
        "Include user-centric language, metrics, or tradeoff reasoning to strengthen your product thinking.",
      leadership:
        "Use ownership language ('I decided', 'I led') and focus on the outcome of your leadership.",
      "customer-support":
        "Lead with empathy ('I understand how frustrating this must be') before jumping to a solution.",
      sales:
        "Focus on the customer's need and the benefit of your solution — not just the features.",
      internship:
        "Express your eagerness to learn and connect the role to your specific career goals.",
      stress:
        "Show your prioritization logic clearly — explain how you decided what to tackle first and how you communicated.",
      teamwork:
        "Use inclusive language ('we', 'together') and describe how you handled communication and any conflict.",
    };
    improvements.push(genreImprovementHint[genre]);
  }

  if (!answer.includes("example") && !answer.includes("time") && !answer.includes("instance") && score < 7) {
    improvements.push("Add a specific real-world example to make your answer more believable and memorable.");
  }

  if (
    (genre === "behavioral" || genre === "leadership") &&
    !answer.includes("result") &&
    !answer.includes("outcome") &&
    !answer.includes("achieved")
  ) {
    improvements.push("Finish with the result — what happened as a consequence of your actions?");
  }

  if (improvements.length === 0) {
    improvements.push("Consider adding even more specific detail or a quantified outcome to make this answer stand out.");
  }

  return improvements;
}

// ─── Helper: feedback summary sentence ────────────────────────────────────────

function buildFeedback(score: number, genre: InterviewGenre): string {
  const genreLabel: Record<InterviewGenre, string> = {
    behavioral: "behavioral",
    technical: "technical",
    hr: "HR",
    product: "product thinking",
    leadership: "leadership",
    "customer-support": "customer support",
    sales: "sales",
    internship: "entry-level",
    stress: "stress handling",
    teamwork: "teamwork",
  };

  const label = genreLabel[genre];

  if (score >= 9) return `Excellent ${label} answer! This response is polished and well-structured.`;
  if (score >= 7) return `Good ${label} answer. You hit the key points — just a few areas to sharpen.`;
  if (score >= 5) return `Solid start on this ${label} question. With more detail and structure, this can shine.`;
  if (score >= 3) return `Your ${label} answer needs more development. Focus on specificity and structure.`;
  return `This ${label} answer needs significant improvement. Review the rubric note and try again.`;
}
