import { InterviewGenre } from "@/types";

export type AnalysisConfidence = "low" | "medium" | "high";

export interface AnalyzeAnswerResult {
  summary: string;
  score: number;
  answerType: "direct" | "story" | "technical-walkthrough" | "mixed" | "unclear";
  confidenceLevel: AnalysisConfidence;
  detectedIssues: string[];
  detectedStrengths: string[];
  relevanceToQuestion: number;
  completeness: number;
  specificity: number;
  structureQuality: number;
  professionalism: number;
  toneFlags: string[];
  coachingPriority: string[];
  topic: InterviewGenre;
}

export interface ScoreAnswerDimensionsResult {
  relevance: number;
  structure: number;
  specificity: number;
  professionalism: number;
  ownership: number;
  technicalDepth: number;
}
