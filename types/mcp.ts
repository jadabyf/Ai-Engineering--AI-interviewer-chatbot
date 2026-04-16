import { EvaluationResult, GenerateQuestionResult, InterviewGenre, SuggestionChip } from "@/types";
import { ConstructiveCriticismResult } from "@/types/constructiveCriticism";
import { AnalyzeAnswerResult, ScoreAnswerDimensionsResult } from "@/types/analysis";
import {
  ChooseBestFeedbackModeResult,
  DetectAnswerPatternsResult,
  DetectInappropriateAnswerResult,
  GenerateTargetedCoachingResult,
  RecommendFollowupQuestionResult,
  RunFeedbackPipelineResult,
  SummarizeFeedbackResult,
} from "@/types/coaching";
import { DissectAnswerResult } from "@/types/dissection";

export type McpToolName =
  | "generate_question"
  | "evaluate_answer"
  | "improve_answer"
  | "get_suggestion_chips"
  | "switch_topic"
  | "constructive_criticism"
  | "set_custom_question"
  | "analyze_answer"
  | "dissect_answer"
  | "generate_targeted_coaching"
  | "detect_answer_patterns"
  | "detect_inappropriate_or_unprofessional_answer"
  | "recommend_followup_question"
  | "score_answer_dimensions"
  | "summarize_feedback"
  | "choose_best_feedback_mode"
  | "run_feedback_pipeline";

export interface GenerateQuestionInput {
  topic: InterviewGenre;
  difficulty?: "easy" | "medium" | "hard";
  usedIds?: string[];
}

export interface EvaluateAnswerInput {
  topic: InterviewGenre;
  question: string;
  answer: string;
}

export interface ImproveAnswerInput {
  topic: InterviewGenre;
  question: string;
  answer: string;
}

export interface ConstructiveCriticismInput {
  topic: InterviewGenre;
  question: string;
  answer: string;
  genre?: InterviewGenre;
  difficulty?: "easy" | "medium" | "hard";
}

export interface GetSuggestionChipsInput {
  topic: InterviewGenre | null;
  currentState: "welcome" | "question" | "feedback" | "summary";
}

export interface SwitchTopicInput {
  nextTopic: InterviewGenre;
}

export interface SetCustomQuestionInput {
  topic: InterviewGenre;
  customQuestion: string;
}

export interface AnalyzeAnswerInput {
  topic: InterviewGenre;
  question: string;
  answer: string;
  genre?: InterviewGenre;
  difficulty?: "easy" | "medium" | "hard";
}

export interface DissectAnswerInput {
  topic: InterviewGenre;
  question: string;
  answer: string;
  genre: InterviewGenre;
}

export interface GenerateTargetedCoachingInput {
  topic: InterviewGenre;
  question: string;
  answer: string;
  analysisResult: AnalyzeAnswerResult;
  dissectionResult: DissectAnswerResult;
}

export interface DetectAnswerPatternsInput {
  currentAnswer: string;
  previousAnswerHistory: string[];
  topic: InterviewGenre;
  previousAnalysisResults: AnalyzeAnswerResult[];
}

export interface DetectInappropriateAnswerInput {
  answer: string;
  topic: InterviewGenre;
  question: string;
}

export interface RecommendFollowupQuestionInput {
  topic: InterviewGenre;
  currentQuestion: string;
  answer: string;
  analysisResult: AnalyzeAnswerResult;
  patternResult: DetectAnswerPatternsResult;
}

export interface ScoreAnswerDimensionsInput {
  topic: InterviewGenre;
  question: string;
  answer: string;
}

export interface SummarizeFeedbackInput {
  analysisResult: AnalyzeAnswerResult;
  coachingResult: GenerateTargetedCoachingResult;
}

export interface ChooseBestFeedbackModeInput {
  analysisResult: AnalyzeAnswerResult;
  professionalismResult: DetectInappropriateAnswerResult;
}

export interface RunFeedbackPipelineInput {
  topic: InterviewGenre;
  question: string;
  answer: string;
  genre?: InterviewGenre;
  difficulty?: "easy" | "medium" | "hard";
  previousAnswerHistory?: string[];
  previousAnalysisResults?: AnalyzeAnswerResult[];
}

export interface SwitchTopicResult {
  confirmation: string;
  starterMessage: string;
  triggerFirstQuestion: boolean;
}

export interface McpToolInputMap {
  generate_question: GenerateQuestionInput;
  evaluate_answer: EvaluateAnswerInput;
  improve_answer: ImproveAnswerInput;
  get_suggestion_chips: GetSuggestionChipsInput;
  switch_topic: SwitchTopicInput;
  constructive_criticism: ConstructiveCriticismInput;
  set_custom_question: SetCustomQuestionInput;
  analyze_answer: AnalyzeAnswerInput;
  dissect_answer: DissectAnswerInput;
  generate_targeted_coaching: GenerateTargetedCoachingInput;
  detect_answer_patterns: DetectAnswerPatternsInput;
  detect_inappropriate_or_unprofessional_answer: DetectInappropriateAnswerInput;
  recommend_followup_question: RecommendFollowupQuestionInput;
  score_answer_dimensions: ScoreAnswerDimensionsInput;
  summarize_feedback: SummarizeFeedbackInput;
  choose_best_feedback_mode: ChooseBestFeedbackModeInput;
  run_feedback_pipeline: RunFeedbackPipelineInput;
}

export interface McpToolResultMap {
  generate_question: GenerateQuestionResult;
  evaluate_answer: EvaluationResult;
  improve_answer: { improvedAnswer: string };
  get_suggestion_chips: { chips: SuggestionChip[] };
  switch_topic: SwitchTopicResult;
  constructive_criticism: ConstructiveCriticismResult;
  set_custom_question: { confirmedQuestion: string; starterMessage: string };
  analyze_answer: AnalyzeAnswerResult;
  dissect_answer: DissectAnswerResult;
  generate_targeted_coaching: GenerateTargetedCoachingResult;
  detect_answer_patterns: DetectAnswerPatternsResult;
  detect_inappropriate_or_unprofessional_answer: DetectInappropriateAnswerResult;
  recommend_followup_question: RecommendFollowupQuestionResult;
  score_answer_dimensions: ScoreAnswerDimensionsResult;
  summarize_feedback: SummarizeFeedbackResult;
  choose_best_feedback_mode: ChooseBestFeedbackModeResult;
  run_feedback_pipeline: RunFeedbackPipelineResult;
}

export type McpRequest<T extends McpToolName = McpToolName> = {
  tool: T;
  input: McpToolInputMap[T];
};

export type McpResponse<T extends McpToolName = McpToolName> = {
  ok: true;
  tool: T;
  data: McpToolResultMap[T];
} | {
  ok: false;
  tool: T;
  error: string;
};
