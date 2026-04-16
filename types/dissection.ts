export interface DissectedSection {
  label: string;
  userText: string;
  analysis: string;
  issueType: string[];
  whatIsMissing: string[];
  whyItIsWeak: string;
  howToImprove: string;
  suggestedRewrite: string;
}

export interface DissectAnswerResult {
  sections: DissectedSection[];
  missingCoreElements: string[];
  strongestFragment: string;
  weakestFragment: string;
  recommendedAnswerFlow: string[];
}
