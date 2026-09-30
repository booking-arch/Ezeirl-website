import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ContentPage from "@/app/content/page";
import { ezeIrlPhotos } from "@/config/assets";
import { contentEntries, contentProblems } from "@/config/content";

describe("content catalog", () => {
  it("publishes only approved on-site photographs", () => {
    expect(contentProblems()).toEqual([]);
    expect(contentEntries.length).toBe(Object.values(ezeIrlPhotos).length);
    const used = new Set(contentEntries.map((entry) => entry.image.src));
    for (const photo of Object.values(ezeIrlPhotos)) expect(used.has(photo.src)).toBe(true);
    expect(contentEntries.some((entry) => entry.kind === "video")).toBe(false);
  });

  it("rejects a video that is not a confirmed social URL", () => {
    const fake = {
      ...contentEntries[0],
      id: "fake-video",
      kind: "video" as const,
      platform: "youtube" as const,
      href: "https://youtube.com/@not-confirmed",
    };
    expect(contentProblems([fake]).length).toBeGreaterThan(0);
  });
});

describe("/content", () => {
  const out = renderToStaticMarkup(<ContentPage />);

  it("lists every photograph and links back to the homepage", () => {
    expect((out.match(/<h1/g) ?? []).length).toBe(1);
    for (const entry of contentEntries) {
      expect(out).toContain(entry.title);
      expect(out).toContain(`id="${entry.id}"`);
      expect(out).toContain(`href="${entry.href}"`);
    }
    expect(out).not.toContain("youtube.com");
    expect(out).not.toContain("tiktok.com");
    expect(out).toContain("CollectionPage");
  });
});
