import { describe, expect, it } from "vitest";

import { analyzeAnswerHandler } from "@/server/tools/analyzeAnswer";
import { detectAnswerPatternsHandler } from "@/server/tools/detectAnswerPatterns";
import { detectInappropriateAnswerHandler } from "@/server/tools/detectInappropriateAnswer";
import { runFeedbackPipelineHandler } from "@/server/tools/runFeedbackPipeline";

describe("analyzeAnswerHandler", () => {
  it("flags short and vague answers", () => {
    const result = analyzeAnswerHandler({
      topic: "behavioral",
      genre: "behavioral",
      question: "Tell me about a time you resolved conflict in your team.",
      answer: "I handled it and it was fine.",
    });

    expect(result.detectedIssues).toContain("too-short");
    expect(result.detectedIssues).toContain("missing-results");
    expect(result.score).toBeLessThanOrEqual(5);
  });

  it("recognizes stronger structured responses", () => {
    const result = analyzeAnswerHandler({
      topic: "behavioral",
      genre: "behavioral",
      question: "Tell me about a time you improved team performance.",
      answer:
        "In Q2, our sprint velocity was dropping because blockers were unclear. I led a weekly blocker review, introduced ownership tags, and aligned priorities with product. I chose this approach because it reduced context switching across engineers. As a result, velocity increased by 22% in six weeks and missed tickets dropped significantly.",
    });

    expect(result.detectedStrengths.length).toBeGreaterThan(1);
    expect(result.score).toBeGreaterThanOrEqual(6);
    expect(result.detectedIssues).not.toContain("too-short");
  });

  it("flags collaboration risk when answer rejects teamwork", () => {
    const result = analyzeAnswerHandler({
      topic: "teamwork",
      genre: "teamwork",
      question: "How do you work with team members during conflict?",
      answer: "I don't like working on a team. I prefer to work alone.",
    });

    expect(result.detectedIssues).toContain("collaboration-risk");
  });
});

describe("detectInappropriateAnswerHandler", () => {
  it("flags unprofessional language with severity", () => {
    const result = detectInappropriateAnswerHandler({
      topic: "hr",
      question: "How do you handle difficult stakeholders?",
      answer: "I told that idiot to deal with it because their request was stupid.",
    });

    expect(result.flagged).toBe(true);
    expect(["medium", "high"]).toContain(result.severity);
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});

describe("detectAnswerPatternsHandler", () => {
  it("detects recurring short-answer behavior", () => {
    const analysisA = analyzeAnswerHandler({
      topic: "technical",
      genre: "technical",
      question: "How did you debug a production issue?",
      answer: "I fixed it quickly.",
    });

    const analysisB = analyzeAnswerHandler({
      topic: "technical",
      genre: "technical",
      question: "Describe a design tradeoff you made.",
      answer: "I chose the easy way.",
    });

    const pattern = detectAnswerPatternsHandler({
      topic: "technical",
      currentAnswer: "I just solved it.",
      previousAnswerHistory: ["I fixed it.", "It worked."],
      previousAnalysisResults: [analysisA, analysisB],
    });

    expect(pattern.recurringPatterns).toContain("answers-too-short");
    expect(pattern.coachingAdjustment.join(" ")).toMatch(/minimum 4-sentence answers/i);
  });
});

describe("runFeedbackPipelineHandler", () => {
  it("returns quick and deep payloads together", () => {
    const result = runFeedbackPipelineHandler({
      topic: "technical",
      genre: "technical",
      question: "Explain a technical tradeoff you made recently.",
      answer:
        "I decided between caching at the API layer and query optimization. I chose query optimization first because stale cache risk was high for this endpoint. I implemented indexed lookup and reduced p95 latency by 31% over one week.",
      previousAnswerHistory: ["Earlier I fixed slow requests by profiling endpoints."],
      previousAnalysisResults: [],
    });

    expect(result.quickFeedback.score).toBeGreaterThan(0);
    expect(result.quickFeedback.summary.length).toBeGreaterThan(0);
    expect(result.deepFeedback.analysis.detectedStrengths.length).toBeGreaterThan(0);
    expect(result.deepFeedback.followupQuestion.recommendedQuestion.length).toBeGreaterThan(0);
    expect(result.deepFeedback.dimensions.relevance).toBeGreaterThan(0);
    expect(result.quickFeedback.topImprovements[0]).not.toBe("low-relevance");
    expect(result.deepFeedback.coaching.suggestedResponses.length).toBeGreaterThan(0);
  });
});
