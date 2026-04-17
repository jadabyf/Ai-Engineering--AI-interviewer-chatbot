"use client";

import { DeepFeedbackPayload } from "@/types/coaching";

interface DeepFeedbackPanelProps {
  payload: DeepFeedbackPayload;
  onUseSuggestedResponse: (response: string) => void;
}

export default function DeepFeedbackPanel({
  payload,
  onUseSuggestedResponse,
}: DeepFeedbackPanelProps) {
  const isLowScore = payload.analysis.score <= 4;

  return (
    <section className="mt-3 rounded-xl border border-(--border-soft) bg-white p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-(--text-primary)">Deep Feedback</h3>
        <span className="text-xs text-(--text-secondary)">Mode: {payload.feedbackMode.mode}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        <p className="rounded-md bg-(--bg-main) px-2 py-1">Relevance: {payload.dimensions.relevance}/10</p>
        <p className="rounded-md bg-(--bg-main) px-2 py-1">Structure: {payload.dimensions.structure}/10</p>
        <p className="rounded-md bg-(--bg-main) px-2 py-1">Specificity: {payload.dimensions.specificity}/10</p>
        <p className="rounded-md bg-(--bg-main) px-2 py-1">Professionalism: {payload.dimensions.professionalism}/10</p>
        <p className="rounded-md bg-(--bg-main) px-2 py-1">Ownership: {payload.dimensions.ownership}/10</p>
        <p className="rounded-md bg-(--bg-main) px-2 py-1">Technical Depth: {payload.dimensions.technicalDepth}/10</p>
      </div>

      {isLowScore && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-semibold">Low-Score Repair Plan</p>
          <ul className="mt-2 space-y-1 list-disc pl-5">
            {payload.coaching.nextAttemptAdvice.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <details className="rounded-lg border border-(--border-soft) p-3">
        <summary className="cursor-pointer text-sm font-medium text-(--text-primary)">Analysis Summary</summary>
        <div className="mt-2 text-sm text-(--text-secondary) space-y-2">
          <p>{payload.analysis.summary}</p>
          <p>Top issues: {payload.analysis.detectedIssues.join(", ") || "none"}</p>
          <p>Top strengths: {payload.analysis.detectedStrengths.join(", ") || "none"}</p>
        </div>
      </details>

      <details className="rounded-lg border border-(--border-soft) p-3">
        <summary className="cursor-pointer text-sm font-medium text-(--text-primary)">Dissected Answer</summary>
        <div className="mt-3 space-y-3">
          {payload.dissection.sections.map((section, idx) => (
            <article key={idx} className="rounded-lg bg-(--bg-main) p-3 text-sm text-(--text-secondary)">
              <p className="font-semibold text-(--text-primary)">{section.label}</p>
              <p className="mt-1">{section.analysis}</p>
              {section.whatIsMissing.length > 0 && (
                <p className="mt-1">Missing: {section.whatIsMissing.join(", ")}</p>
              )}
              <p className="mt-1">Fix: {section.howToImprove}</p>
            </article>
          ))}
        </div>
      </details>

      <details className="rounded-lg border border-(--border-soft) p-3">
        <summary className="cursor-pointer text-sm font-medium text-(--text-primary)">Targeted Coaching</summary>
        <div className="mt-3 space-y-3 text-sm text-(--text-secondary)">
          {payload.coaching.coachingPlan.map((step, idx) => (
            <div key={idx} className="rounded-lg bg-(--bg-main) p-3">
              <p className="font-semibold text-(--text-primary)">{step.problem}</p>
              <p className="mt-1">Why: {step.whyItMatters}</p>
              <p className="mt-1">Fix: {step.exactFix}</p>
              <p className="mt-1">Example: {step.example}</p>
            </div>
          ))}
          <div className="rounded-lg border border-(--accent-violet)/35 bg-(--accent-violet)/10 p-3">
            <p className="font-semibold text-(--text-primary)">Sample Stronger Answer</p>
            <p className="mt-2 whitespace-pre-wrap">{payload.coaching.sampleStrongerAnswer}</p>
          </div>
          <div className="rounded-lg border border-(--border-soft) bg-(--bg-main) p-3">
            <p className="font-semibold text-(--text-primary)">Suggested Responses You Can Use</p>
            <ul className="mt-2 space-y-2">
              {payload.coaching.suggestedResponses.map((response, idx) => (
                <li key={idx} className="rounded-md border border-(--border-soft) bg-white p-2">
                  <p className="text-(--text-secondary)">{response}</p>
                  <button
                    type="button"
                    onClick={() => onUseSuggestedResponse(response)}
                    className="mt-2 rounded-md border border-(--border-soft) px-2.5 py-1 text-xs font-semibold text-(--text-primary) hover:border-(--accent-violet) hover:text-(--brand-primary)"
                  >
                    Use This Response
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>

      {payload.professionalism.flagged && (
        <details open className="rounded-lg border border-red-200 bg-red-50 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-red-700">Professionalism Warning</summary>
          <div className="mt-2 text-sm text-red-800 space-y-1">
            <p>{payload.professionalism.interviewRisk}</p>
            <p>Reasons: {payload.professionalism.reasons.join(" | ")}</p>
            <p>Safer tone: {payload.professionalism.saferAlternativeTone}</p>
            <p>Rewrite: {payload.professionalism.exampleRewrite}</p>
          </div>
        </details>
      )}

      <div className="rounded-lg border border-(--border-soft) p-3 text-sm text-(--text-secondary)">
        <p className="font-semibold text-(--text-primary)">Recommended Next Question</p>
        <p className="mt-1">{payload.followupQuestion.recommendedQuestion}</p>
        <p className="mt-1">Target skill: {payload.followupQuestion.targetSkill}</p>
      </div>
    </section>
  );
}
