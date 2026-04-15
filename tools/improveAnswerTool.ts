/**
 * improveAnswerTool
 *
 * Rewrites the user's answer using genre-appropriate structure and language.
 * This is a template-based improvement — it injects structure cues while
 * preserving the core ideas from the original answer.
 */

import { ImproveAnswerResult, InterviewGenre } from "@/types";

// Genre-specific opening phrases and structural cues
const genreTemplates: Record<
  InterviewGenre,
  { opener: string; structureCues: string[]; closing: string }
> = {
  behavioral: {
    opener: "To walk you through this using the STAR method:",
    structureCues: [
      "The situation I encountered was",
      "My task was to",
      "The action I took was to",
      "As a result,",
    ],
    closing: "This experience reinforced my ability to handle challenges effectively.",
  },
  technical: {
    opener: "Let me break this down clearly:",
    structureCues: [
      "At its core,",
      "The key technical consideration here is",
      "In practice, this means",
      "A concrete example would be",
    ],
    closing: "This approach balances correctness, performance, and maintainability.",
  },
  hr: {
    opener: "I appreciate the opportunity to share my perspective on this:",
    structureCues: [
      "In my experience,",
      "I believe strongly that",
      "This is important to me because",
      "I am committed to",
    ],
    closing: "I look forward to bringing this mindset to this role.",
  },
  product: {
    opener: "From a product thinking perspective:",
    structureCues: [
      "First, I would understand the user's core need by",
      "The key tradeoff here is",
      "I would measure success by",
      "Given limited resources, I would prioritize",
    ],
    closing: "This approach keeps the user at the center while aligning with business goals.",
  },
  leadership: {
    opener: "Here is how I approached this situation as a leader:",
    structureCues: [
      "I took ownership of",
      "My first decision was to",
      "I communicated clearly to the team by",
      "The outcome of my leadership was",
    ],
    closing: "This reinforced my belief that clear ownership and communication drive results.",
  },
  "customer-support": {
    opener: "My first priority in this situation was to make the customer feel heard:",
    structureCues: [
      "I opened by acknowledging their frustration, saying",
      "I then focused on finding a solution by",
      "To resolve it, I",
      "I followed up by",
    ],
    closing: "The customer left the interaction feeling valued and supported.",
  },
  sales: {
    opener: "My approach centered on understanding the customer's real need first:",
    structureCues: [
      "Before pitching, I asked",
      "Once I understood their need, I focused on the benefit:",
      "When they raised an objection, I responded by",
      "I built trust by",
    ],
    closing: "By focusing on value rather than features, I was able to close the conversation positively.",
  },
  internship: {
    opener: "I am genuinely excited about this opportunity, and here is why:",
    structureCues: [
      "In my coursework and projects, I have developed",
      "I am eager to learn more about",
      "I believe this role will help me grow in",
      "I want to contribute to this team by",
    ],
    closing: "I bring a strong learning mindset and a real drive to grow with this team.",
  },
  stress: {
    opener: "When faced with this type of pressure, my approach is to stay calm and methodical:",
    structureCues: [
      "My first step was to assess the situation and prioritize by",
      "I communicated early with stakeholders about",
      "I focused on what I could control, which was",
      "After stabilizing the situation, I reflected on",
    ],
    closing: "Staying focused and communicating proactively are the most important tools under pressure.",
  },
  teamwork: {
    opener: "Collaboration and clear communication are central to how I work:",
    structureCues: [
      "From the start, our team aligned on",
      "When a challenge or conflict arose, I",
      "I supported my teammates by",
      "Together, we achieved",
    ],
    closing: "This experience reminded me that strong teams are built on trust, honesty, and shared purpose.",
  },
};

export function improveAnswerTool(
  question: string,
  answer: string,
  genre: InterviewGenre
): ImproveAnswerResult {
  const template = genreTemplates[genre];

  // Extract the core content from the original answer
  // Trim whitespace and remove any incomplete trailing sentence
  const coreContent = answer.trim().replace(/\s+/g, " ");

  // Build the improved answer by wrapping the user's core ideas in structure
  const improvedAnswer = [
    template.opener,
    "",
    // Weave the user's original content in after the opener
    coreContent,
    "",
    // Add a structural reinforcement sentence
    `${template.structureCues[template.structureCues.length - 1]} the positive impact this had on the outcome.`,
    "",
    template.closing,
  ].join("\n");

  // For question-awareness, include a reference to the topic if the answer is short
  if (answer.trim().split(/\s+/).length < 30) {
    return {
      improvedAnswer: [
        template.opener,
        "",
        `When asked about "${question.substring(0, 60)}...", here is how I would frame my response:`,
        "",
        coreContent,
        "",
        template.closing,
      ].join("\n"),
    };
  }

  return { improvedAnswer };
}
