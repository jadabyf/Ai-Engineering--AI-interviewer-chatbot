import { InterviewGenre } from "@/types";
import { AnalyzeAnswerResult, ScoreAnswerDimensionsResult } from "@/types/analysis";
import { DissectAnswerResult } from "@/types/dissection";

export interface CoachingPlanStep {
  problem: string;
  whyItMatters: string;
  exactFix: string;
  example: string;
}

export interface GenerateTargetedCoachingResult {
  topProblemsToFix: string[];
  coachingPlan: CoachingPlanStep[];
  sampleStrongerAnswer: string;
  suggestedResponses: string[];
  nextAttemptAdvice: string[];
}

export interface DetectAnswerPatternsResult {
  recurringPatterns: string[];
  improvementTrend: string;
  repeatedWeaknesses: string[];
  repeatedStrengths: string[];
  coachingAdjustment: string[];
}

export interface DetectInappropriateAnswerResult {
  flagged: boolean;
  severity: "low" | "medium" | "high";
  reasons: string[];
  interviewRisk: string;
  saferAlternativeTone: string;
  exampleRewrite: string;
}

export interface RecommendFollowupQuestionResult {
  recommendedQuestion: string;
  reason: string;
  targetSkill: string;
}

export interface SummarizeFeedbackResult {
  summary: string;
  topImprovements: string[];
}

export interface ChooseBestFeedbackModeResult {
  mode: "quick-summary" | "deep-critique" | "professionalism-warning" | "structured-rewrite";
  reason: string;
}

export interface QuickFeedbackPayload {
  score: number;
  summary: string;
  topImprovements: string[];
  strengths: string[];
}

export interface DeepFeedbackPayload {
  analysis: AnalyzeAnswerResult;
  dissection: DissectAnswerResult;
  coaching: GenerateTargetedCoachingResult;
  pattern: DetectAnswerPatternsResult;
  professionalism: DetectInappropriateAnswerResult;
  followupQuestion: RecommendFollowupQuestionResult;
  dimensions: ScoreAnswerDimensionsResult;
  feedbackMode: ChooseBestFeedbackModeResult;
}

export interface RunFeedbackPipelineResult {
  quickFeedback: QuickFeedbackPayload;
  deepFeedback: DeepFeedbackPayload;
  topic: InterviewGenre;
}
