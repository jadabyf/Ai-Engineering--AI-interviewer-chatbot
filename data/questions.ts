// Static question bank for AI Interview Coach
// Each genre has 7–8 questions across easy/medium/hard difficulties

import { Question } from "@/types";

export const questions: Question[] = [
  // ─── BEHAVIORAL ──────────────────────────────────────────────────────────
  {
    id: "beh-1",
    genre: "behavioral",
    text: "Tell me about a time you faced a significant challenge at work or school. How did you handle it?",
    difficulty: "easy",
    tip: "Use the STAR method: Situation → Task → Action → Result",
  },
  {
    id: "beh-2",
    genre: "behavioral",
    text: "Describe a situation where you had to work with a difficult team member. What did you do?",
    difficulty: "medium",
    tip: "Focus on what YOU did — not what was wrong with the other person.",
  },
  {
    id: "beh-3",
    genre: "behavioral",
    text: "Give me an example of a time you failed. What did you learn from it?",
    difficulty: "medium",
    tip: "Interviewers want to see self-awareness and growth — not a flawless story.",
  },
  {
    id: "beh-4",
    genre: "behavioral",
    text: "Tell me about a time you took initiative beyond your assigned responsibilities.",
    difficulty: "medium",
  },
  {
    id: "beh-5",
    genre: "behavioral",
    text: "Describe a situation where you had to meet a tight deadline. How did you manage it?",
    difficulty: "hard",
    tip: "Highlight your prioritization and time management skills.",
  },
  {
    id: "beh-6",
    genre: "behavioral",
    text: "Tell me about a time you had to convince someone who disagreed with your idea.",
    difficulty: "hard",
  },
  {
    id: "beh-7",
    genre: "behavioral",
    text: "Share an example of when you went above and beyond for a customer or colleague.",
    difficulty: "easy",
  },

  // ─── TECHNICAL ───────────────────────────────────────────────────────────
  {
    id: "tech-1",
    genre: "technical",
    text: "What is the difference between a stack and a queue? When would you use each?",
    difficulty: "easy",
    tip: "Be specific — give a real-world use case for each.",
  },
  {
    id: "tech-2",
    genre: "technical",
    text: "How would you design a URL shortening service like bit.ly?",
    difficulty: "hard",
    tip: "Think about: storage, hashing, redirects, and scalability.",
  },
  {
    id: "tech-3",
    genre: "technical",
    text: "Explain the difference between SQL and NoSQL databases. When would you use one over the other?",
    difficulty: "medium",
  },
  {
    id: "tech-4",
    genre: "technical",
    text: "Walk me through how you would debug a slow API endpoint.",
    difficulty: "medium",
    tip: "Cover: profiling, query analysis, caching, network latency.",
  },
  {
    id: "tech-5",
    genre: "technical",
    text: "What is Big O notation? Why does it matter when writing code?",
    difficulty: "easy",
  },
  {
    id: "tech-6",
    genre: "technical",
    text: "How would you approach testing a new feature before shipping it to production?",
    difficulty: "medium",
  },
  {
    id: "tech-7",
    genre: "technical",
    text: "Explain REST vs GraphQL. What are the tradeoffs between them?",
    difficulty: "hard",
  },

  // ─── GENERAL HR ──────────────────────────────────────────────────────────
  {
    id: "hr-1",
    genre: "hr",
    text: "Tell me about yourself.",
    difficulty: "easy",
    tip: "Keep it professional — past, present, future structure works well.",
  },
  {
    id: "hr-2",
    genre: "hr",
    text: "Why do you want to work at this company?",
    difficulty: "easy",
    tip: "Research the company before answering. Mention specific values or products.",
  },
  {
    id: "hr-3",
    genre: "hr",
    text: "What is your greatest strength and your greatest weakness?",
    difficulty: "medium",
    tip: "For weakness: pick a real one and explain what you are doing to improve.",
  },
  {
    id: "hr-4",
    genre: "hr",
    text: "Where do you see yourself in 5 years?",
    difficulty: "easy",
  },
  {
    id: "hr-5",
    genre: "hr",
    text: "Why are you leaving your current job?",
    difficulty: "medium",
    tip: "Always frame this positively — focus on growth, not complaints.",
  },
  {
    id: "hr-6",
    genre: "hr",
    text: "How do you handle feedback or criticism?",
    difficulty: "medium",
  },
  {
    id: "hr-7",
    genre: "hr",
    text: "What motivates you in your work?",
    difficulty: "easy",
  },

  // ─── PRODUCT / PRODUCT THINKING ──────────────────────────────────────────
  {
    id: "prod-1",
    genre: "product",
    text: "How would you prioritize a backlog of 20 feature requests with limited engineering bandwidth?",
    difficulty: "medium",
    tip: "Mention frameworks like RICE, MoSCoW, or impact vs. effort matrix.",
  },
  {
    id: "prod-2",
    genre: "product",
    text: "Tell me about a product you love and how you would improve it.",
    difficulty: "easy",
    tip: "Structure: What works well → What could be better → Your improvement idea.",
  },
  {
    id: "prod-3",
    genre: "product",
    text: "How would you define the success metrics for a new onboarding flow?",
    difficulty: "medium",
  },
  {
    id: "prod-4",
    genre: "product",
    text: "Walk me through how you would decide to cut a feature from a release.",
    difficulty: "hard",
    tip: "Consider user impact, business risk, and engineering cost.",
  },
  {
    id: "prod-5",
    genre: "product",
    text: "How would you approach building a product for a market you know nothing about?",
    difficulty: "hard",
  },
  {
    id: "prod-6",
    genre: "product",
    text: "Describe a product decision you made (or observed) that involved tradeoffs. What did you choose and why?",
    difficulty: "medium",
  },
  {
    id: "prod-7",
    genre: "product",
    text: "How do you balance user needs with business goals?",
    difficulty: "easy",
  },

  // ─── LEADERSHIP ──────────────────────────────────────────────────────────
  {
    id: "lead-1",
    genre: "leadership",
    text: "Tell me about a time you led a project from start to finish.",
    difficulty: "medium",
    tip: "Show ownership: how you set direction, removed blockers, and drove results.",
  },
  {
    id: "lead-2",
    genre: "leadership",
    text: "How do you handle a situation where your team disagrees with your decision?",
    difficulty: "hard",
  },
  {
    id: "lead-3",
    genre: "leadership",
    text: "Describe a time you had to make a difficult decision with incomplete information.",
    difficulty: "hard",
    tip: "Show how you reasoned through uncertainty — not that you had all the answers.",
  },
  {
    id: "lead-4",
    genre: "leadership",
    text: "How do you motivate team members who are underperforming?",
    difficulty: "medium",
  },
  {
    id: "lead-5",
    genre: "leadership",
    text: "Tell me about a time you mentored or coached someone.",
    difficulty: "easy",
  },
  {
    id: "lead-6",
    genre: "leadership",
    text: "How do you set goals and hold yourself and others accountable?",
    difficulty: "medium",
  },
  {
    id: "lead-7",
    genre: "leadership",
    text: "Describe your leadership style and how it has evolved.",
    difficulty: "easy",
  },

  // ─── CUSTOMER SUPPORT ────────────────────────────────────────────────────
  {
    id: "cs-1",
    genre: "customer-support",
    text: "How would you handle an angry customer who is threatening to cancel their subscription?",
    difficulty: "medium",
    tip: "Lead with empathy, then move to problem-solving.",
  },
  {
    id: "cs-2",
    genre: "customer-support",
    text: "Tell me about a time you turned a negative customer experience into a positive one.",
    difficulty: "medium",
  },
  {
    id: "cs-3",
    genre: "customer-support",
    text: "How do you stay calm when dealing with multiple difficult customers at once?",
    difficulty: "hard",
  },
  {
    id: "cs-4",
    genre: "customer-support",
    text: "How do you balance following company policy with making an unhappy customer feel heard?",
    difficulty: "hard",
  },
  {
    id: "cs-5",
    genre: "customer-support",
    text: "A customer contacts you with a bug report that is hard to reproduce. Walk me through your approach.",
    difficulty: "medium",
  },
  {
    id: "cs-6",
    genre: "customer-support",
    text: "What does excellent customer service mean to you?",
    difficulty: "easy",
  },
  {
    id: "cs-7",
    genre: "customer-support",
    text: "How would you respond to a customer who was overcharged and demands an immediate refund?",
    difficulty: "easy",
  },

  // ─── SALES / COMMUNICATION ───────────────────────────────────────────────
  {
    id: "sales-1",
    genre: "sales",
    text: "Sell me this pen. (Classic pitch challenge — tell me why I need it.)",
    difficulty: "medium",
    tip: "Start by understanding the buyer's need, then pitch the benefit — not the features.",
  },
  {
    id: "sales-2",
    genre: "sales",
    text: "How do you handle objections from a prospect who says 'the price is too high'?",
    difficulty: "medium",
  },
  {
    id: "sales-3",
    genre: "sales",
    text: "Describe your process for building rapport with a new client.",
    difficulty: "easy",
  },
  {
    id: "sales-4",
    genre: "sales",
    text: "Tell me about a time you successfully closed a deal that seemed lost.",
    difficulty: "hard",
  },
  {
    id: "sales-5",
    genre: "sales",
    text: "How do you identify and qualify a strong sales prospect?",
    difficulty: "medium",
  },
  {
    id: "sales-6",
    genre: "sales",
    text: "How do you maintain energy and confidence after a series of rejections?",
    difficulty: "easy",
  },
  {
    id: "sales-7",
    genre: "sales",
    text: "What is your approach to following up without being pushy?",
    difficulty: "medium",
  },

  // ─── INTERNSHIP / ENTRY-LEVEL ─────────────────────────────────────────────
  {
    id: "intern-1",
    genre: "internship",
    text: "Why are you interested in this internship or entry-level position?",
    difficulty: "easy",
    tip: "Connect your answer to your academic work and long-term career goals.",
  },
  {
    id: "intern-2",
    genre: "internship",
    text: "Tell me about a class project or personal project you are proud of.",
    difficulty: "easy",
  },
  {
    id: "intern-3",
    genre: "internship",
    text: "How do you approach learning something completely new?",
    difficulty: "easy",
    tip: "Show your learning process — be specific and genuine.",
  },
  {
    id: "intern-4",
    genre: "internship",
    text: "Describe a time you asked for help when you were stuck. What did you do?",
    difficulty: "medium",
  },
  {
    id: "intern-5",
    genre: "internship",
    text: "Where do you hope to be professionally in 2–3 years?",
    difficulty: "easy",
  },
  {
    id: "intern-6",
    genre: "internship",
    text: "How do you manage your time between competing priorities like classes, projects, and work?",
    difficulty: "medium",
  },
  {
    id: "intern-7",
    genre: "internship",
    text: "What skills or knowledge gaps do you want to fill in this role?",
    difficulty: "medium",
  },

  // ─── STRESS / PRESSURE HANDLING ──────────────────────────────────────────
  {
    id: "stress-1",
    genre: "stress",
    text: "You have 3 critical tasks due today and only time for 1. What do you do?",
    difficulty: "hard",
    tip: "Show calm prioritization — not panic. Communicate early with stakeholders.",
  },
  {
    id: "stress-2",
    genre: "stress",
    text: "Your manager gives you critical feedback 30 minutes before an important presentation. How do you react?",
    difficulty: "hard",
  },
  {
    id: "stress-3",
    genre: "stress",
    text: "A key teammate calls in sick on launch day. What do you do?",
    difficulty: "hard",
  },
  {
    id: "stress-4",
    genre: "stress",
    text: "How do you maintain quality when working under extreme time pressure?",
    difficulty: "medium",
  },
  {
    id: "stress-5",
    genre: "stress",
    text: "Describe a situation where everything that could go wrong did go wrong. How did you respond?",
    difficulty: "hard",
  },
  {
    id: "stress-6",
    genre: "stress",
    text: "How do you prevent burnout when dealing with a sustained high-pressure period?",
    difficulty: "medium",
  },
  {
    id: "stress-7",
    genre: "stress",
    text: "How do you know when to escalate a problem versus handle it yourself?",
    difficulty: "medium",
  },

  // ─── TEAMWORK / COLLABORATION ─────────────────────────────────────────────
  {
    id: "team-1",
    genre: "teamwork",
    text: "Tell me about a time you worked on a highly effective team. What made it work?",
    difficulty: "easy",
  },
  {
    id: "team-2",
    genre: "teamwork",
    text: "Describe a conflict you had with a teammate. How did you resolve it?",
    difficulty: "medium",
    tip: "Focus on how you handled the conflict, not on who was right.",
  },
  {
    id: "team-3",
    genre: "teamwork",
    text: "How do you contribute to team culture and morale?",
    difficulty: "easy",
  },
  {
    id: "team-4",
    genre: "teamwork",
    text: "Tell me about a time you had to rely on someone else to get work done. How did you handle it if they were slow?",
    difficulty: "medium",
  },
  {
    id: "team-5",
    genre: "teamwork",
    text: "How do you handle a situation where a teammate is not pulling their weight on a shared project?",
    difficulty: "hard",
  },
  {
    id: "team-6",
    genre: "teamwork",
    text: "Describe how you communicate progress and blockers when working remotely or asynchronously.",
    difficulty: "medium",
  },
  {
    id: "team-7",
    genre: "teamwork",
    text: "Tell me about a time you adapted your communication style to work better with someone very different from you.",
    difficulty: "hard",
  },
];

// Helper: get all questions for a specific genre
export function getQuestionsByGenre(genre: string): Question[] {
  return questions.filter((q) => q.genre === genre);
}
