import { RunFeedbackPipelineResult } from "@/types/coaching";
import { RunFeedbackPipelineInput } from "@/types/mcp";

import { analyzeAnswerHandler } from "@/server/tools/analyzeAnswer";
import { detectInappropriateAnswerHandler } from "@/server/tools/detectInappropriateAnswer";
import { dissectAnswerHandler } from "@/server/tools/dissectAnswer";
import { generateTargetedCoachingHandler } from "@/server/tools/generateTargetedCoaching";
import { detectAnswerPatternsHandler } from "@/server/tools/detectAnswerPatterns";
import { recommendFollowupQuestionHandler } from "@/server/tools/recommendFollowupQuestion";
import { scoreAnswerDimensionsHandler } from "@/server/tools/scoreAnswerDimensions";
import { summarizeFeedbackHandler } from "@/server/tools/summarizeFeedback";
import { chooseBestFeedbackModeHandler } from "@/server/tools/chooseBestFeedbackMode";

export function runFeedbackPipelineHandler(
  input: RunFeedbackPipelineInput
): RunFeedbackPipelineResult {
  const analysis = analyzeAnswerHandler({
    topic: input.topic,
    question: input.question,
    answer: input.answer,
    genre: input.genre,
    difficulty: input.difficulty,
  });

  const professionalism = detectInappropriateAnswerHandler({
    answer: input.answer,
    topic: input.topic,
    question: input.question,
  });

  const dissection = dissectAnswerHandler({
    topic: input.topic,
    question: input.question,
    answer: input.answer,
    genre: input.genre ?? input.topic,
  });

  const coaching = generateTargetedCoachingHandler({
    topic: input.topic,
    question: input.question,
    answer: input.answer,
    analysisResult: analysis,
    dissectionResult: dissection,
  });

  const pattern = detectAnswerPatternsHandler({
    currentAnswer: input.answer,
    previousAnswerHistory: input.previousAnswerHistory ?? [],
    topic: input.topic,
    previousAnalysisResults: input.previousAnalysisResults ?? [],
  });

  const followupQuestion = recommendFollowupQuestionHandler({
    topic: input.topic,
    currentQuestion: input.question,
    answer: input.answer,
    analysisResult: analysis,
    patternResult: pattern,
  });

  const dimensions = scoreAnswerDimensionsHandler({
    topic: input.topic,
    question: input.question,
    answer: input.answer,
  });

  const summary = summarizeFeedbackHandler({
    analysisResult: analysis,
    coachingResult: coaching,
  });

  const feedbackMode = chooseBestFeedbackModeHandler({
    analysisResult: analysis,
    professionalismResult: professionalism,
  });

  return {
    quickFeedback: {
      score: analysis.score,
      summary: summary.summary,
      topImprovements: summary.topImprovements,
      strengths: analysis.detectedStrengths.slice(0, 2),
    },
    deepFeedback: {
      analysis,
      dissection,
      coaching,
      pattern,
      professionalism,
      followupQuestion,
      dimensions,
      feedbackMode,
    },
    topic: input.topic,
  };
}
