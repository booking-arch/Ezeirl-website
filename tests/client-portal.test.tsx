import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ClientPortalPage, { metadata } from "@/app/client-portal/page";
import IntakeForm from "@/components/intake/IntakeForm";

describe("client portal", () => {
  it("offers exactly two coaching choices without marketing navigation", () => {
    const out = renderToStaticMarkup(<ClientPortalPage />);
    expect((out.match(/<a\s/g) ?? []).length).toBe(2);
    expect(out).toContain('href="/client-portal/personal-training"');
    expect(out).toContain('href="/client-portal/nutrition-coaching"');
    expect((out.match(/<h1/g) ?? []).length).toBe(1);
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
  it("keeps both questionnaires behind the existing privacy gate", () => {
    for (const service of ["personal-training", "nutrition-coaching"] as const) {
      const out = renderToStaticMarkup(<IntakeForm enabled={false} guided service={service} />);
      expect(out).toContain("OPENING SOON");
      expect(out).not.toContain("<input");
    }
  });
  it("guides clients through one section at a time", () => {
    const out = renderToStaticMarkup(<IntakeForm enabled guided service="personal-training" />);
    expect(out).toContain("Basic Information");
    expect(out).toContain("Step 1 of 6");
    expect(out).not.toContain("Has a doctor ever said");
    expect(out).not.toContain("SUBMIT QUESTIONNAIRE");
  });
});
