"use client";

import { ConstructiveCriticismResult } from "@/types/constructiveCriticism";
import { useState } from "react";

interface DetailedCritiqueCardProps {
  critique: ConstructiveCriticismResult;
}

export default function DetailedCritiqueCard({ critique }: DetailedCritiqueCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-(--border-soft) bg-white p-4 mt-3 space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide uppercase text-(--brand-primary)">
          Detailed Constructive Critique
        </p>
        <h3 className="text-lg font-semibold text-(--text-primary) mt-1">Overall Assessment</h3>
        <p className="text-sm text-(--text-secondary) mt-2 leading-relaxed">
          {critique.overallAssessment}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-(--text-primary)">
              Score: {critique.score}/10
          </p>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs font-semibold text-(--brand-primary) hover:underline"
          >
            {expanded ? "Hide Details" : "View Detailed Feedback"}
          </button>
        </div>
      </div>

      <div
        className={[
          "overflow-hidden transition-all duration-200",
          expanded ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{ maxHeight: expanded ? "2400px" : "0px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="rounded-lg border border-green-200 bg-green-50 p-3">
            <h4 className="text-sm font-semibold text-green-700">What You Did Well</h4>
            <ul className="mt-2 space-y-1 text-sm text-(--text-secondary)">
              {critique.strengths.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <h4 className="text-sm font-semibold text-amber-700">What Needs Improvement</h4>
            <ul className="mt-2 space-y-1 text-sm text-(--text-secondary)">
              {critique.weaknesses.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-sky-200 bg-sky-50 p-3">
            <h4 className="text-sm font-semibold text-sky-700">What Is Missing</h4>
            <ul className="mt-2 space-y-1 text-sm text-(--text-secondary)">
              {critique.missingElements.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section>
          <h4 className="text-sm font-semibold text-(--text-primary)">How To Make This Stronger</h4>
          <div className="mt-3 space-y-3">
            {critique.lineByLineBreakdown.map((item, idx) => (
              <article key={idx} className="rounded-lg border border-(--border-soft) bg-(--bg-main) p-3">
                <p className="text-sm font-semibold text-(--text-primary)">{item.section}</p>
                <p className="text-sm text-(--text-secondary) mt-1"><span className="font-medium">Issue:</span> {item.issue}</p>
                <p className="text-sm text-(--text-secondary) mt-1"><span className="font-medium">Why it matters:</span> {item.whyItMatters}</p>
                <p className="text-sm text-(--text-secondary) mt-1"><span className="font-medium">How to improve:</span> {item.howToImprove}</p>
                <p className="text-sm text-(--text-primary) mt-2"><span className="font-medium">Suggested rewrite:</span> {item.suggestedRewrite}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-(--border-soft) p-3 bg-white">
          <h4 className="text-sm font-semibold text-(--text-primary)">Suggested Answer Framework</h4>
          <ol className="mt-2 space-y-1 text-sm text-(--text-secondary) list-decimal pl-5">
            {critique.suggestedAnswerFramework.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="rounded-lg border border-(--accent-violet)/35 bg-(--accent-violet)/10 p-3">
          <h4 className="text-sm font-semibold text-(--brand-primary)">Suggested Better Answer</h4>
          <p className="text-sm text-(--text-primary) mt-2 whitespace-pre-wrap leading-relaxed">
            {critique.betterSampleAnswer}
          </p>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-(--text-primary)">Follow-Up Advice</h4>
          <ul className="mt-2 space-y-1 text-sm text-(--text-secondary)">
            {critique.followUpAdvice.map((tip, idx) => (
              <li key={idx}>• {tip}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
