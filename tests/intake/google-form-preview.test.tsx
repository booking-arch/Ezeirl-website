import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import IntakePage, { metadata } from "@/app/(universe)/intake/page";
import { INTAKE_CONSENT_LABEL, INTAKE_DISCLAIMER, INTAKE_INTRO, INTAKE_SECTIONS, type IntakeQuestion } from "@/config/intake";
import { intakeGoogleFormEmbedUrl } from "@/config/intake-form";
import nextConfig from "@/next.config";
import sitemap from "@/app/sitemap";

const FORM = "https://docs.google.com/forms/d/e/1FAIpQLSexampleFormId_1/viewform?embedded=true";

describe("intake Google Form URL", () => {
  it("stays empty until a Google Forms embed URL is pasted in", () => {
    expect(intakeGoogleFormEmbedUrl()).toBeNull();
  });

  it("accepts a docs.google.com form embed and rejects anything else", () => {
    expect(intakeGoogleFormEmbedUrl(FORM)).toBe(FORM);
    expect(intakeGoogleFormEmbedUrl(`  ${FORM}  `)).toBe(FORM);
    expect(intakeGoogleFormEmbedUrl("")).toBeNull();
    expect(intakeGoogleFormEmbedUrl("https://forms.gle/example")).toBeNull();
    expect(intakeGoogleFormEmbedUrl("https://example.com/forms/d/e/abc/viewform")).toBeNull();
    expect(intakeGoogleFormEmbedUrl("http://docs.google.com/forms/d/e/abc/viewform")).toBeNull();
  });
});

describe("public /intake preview", () => {
  it("is noindex and is not in the sitemap", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(sitemap().some((entry) => entry.url.includes("/intake"))).toBe(false);
  });

  it("shows the placeholder and does not post answers to this site", () => {
    const html = renderToStaticMarkup(<IntakePage />);
    expect(html).toContain("GOOGLE FORM");
    expect(html).toContain("INTAKE_GOOGLE_FORM_EMBED_URL");
    expect(html).toContain(INTAKE_INTRO);
    expect(html).toContain(INTAKE_DISCLAIMER);
    expect(html).toContain("has not had attorney review yet");
    expect(html).toContain("mailto:booking@ezeirl.com");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("/api/intake");
    expect(html).not.toContain("docs.google.com");
  });

  it("allows the Google Form frame in the site content security policy", async () => {
    const groups = await nextConfig.headers!();
    const csp = groups.flatMap((group) => group.headers).find((header) => header.key === "Content-Security-Policy")?.value ?? "";
    expect(csp).toContain("frame-src https://open.spotify.com https://docs.google.com");
  });
});

describe("question list for the Google Form", () => {
  const doc = readFileSync("docs/intake-google-form-questions.md", "utf8");

  it("includes every existing question, option, hint, intro, disclaimer, and consent line", () => {
    expect(doc).toContain(INTAKE_INTRO);
    expect(doc).toContain(INTAKE_DISCLAIMER);
    expect(doc).toContain(INTAKE_CONSENT_LABEL);
    for (const section of INTAKE_SECTIONS) {
      expect(doc).toContain(section.title);
      if (section.intro) expect(doc).toContain(section.intro);
      for (const question of section.questions) {
        expect(doc).toContain(question.label);
        expect(doc).toContain(question.id);
        if ("options" in question) {
          for (const option of question.options) expect(doc).toContain(option.label);
        }
        if ("hint" in question && question.hint) expect(doc).toContain(question.hint);
        if (question.type === "scale") {
          expect(doc).toContain(question.lowLabel);
          expect(doc).toContain(question.highLabel);
        }
      }
    }
  });

  it("maps each question onto a Google Form type", () => {
    const googleType = (question: IntakeQuestion) => {
      if (question.type === "textarea") return "paragraph";
      if (question.type === "multi") return "checkboxes";
      if (question.type === "text" || question.type === "email" || question.type === "tel") return "short answer";
      return "multiple choice";
    };
    const questions = INTAKE_SECTIONS.flatMap((section) => section.questions);
    expect(doc.match(/^- Type: short answer$/gm)?.length).toBe(questions.filter((q) => googleType(q) === "short answer").length);
    expect(doc.match(/^- Type: paragraph$/gm)?.length).toBe(questions.filter((q) => googleType(q) === "paragraph").length);
    expect(doc.match(/^- Type: multiple choice$/gm)?.length).toBe(questions.filter((q) => googleType(q) === "multiple choice").length);
    // The consent checkbox is the one extra checkboxes question.
    expect(doc.match(/^- Type: checkboxes$/gm)?.length).toBe(questions.filter((q) => googleType(q) === "checkboxes").length + 1);
  });
});
