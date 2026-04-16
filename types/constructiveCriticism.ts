export interface CritiqueBreakdownItem {
  section: string;
  issue: string;
  whyItMatters: string;
  howToImprove: string;
  suggestedRewrite: string;
}

export interface ConstructiveCriticismResult {
  overallAssessment: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingElements: string[];
  lineByLineBreakdown: CritiqueBreakdownItem[];
  suggestedAnswerFramework: string[];
  betterSampleAnswer: string;
  followUpAdvice: string[];
}
