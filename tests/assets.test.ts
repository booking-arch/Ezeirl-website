import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { ezeFitAssets, ezeFormAssets, ezeIrlPhotos, type ImageAsset } from "@/config/assets";

const media = readFileSync("docs/assets/eze-fit-media.md", "utf8");
const registered = (Object.entries(ezeFitAssets.screens).filter(([, v]) => v) as [string, ImageAsset][]);

describe("EZE-FIT real-media registry", () => {
  it("registers only files that exist under public/", () => {
    for (const [id, a] of registered) expect(existsSync(`public${a.src}`), `${id}: ${a.src}`).toBe(true);
  });

  it("documents every registered screen (provenance, classification, usage)", () => {
    for (const [id, a] of registered) expect(media, `${id} not in docs/assets/eze-fit-media.md`).toContain(a.src.replace("/eze-fit/screens/", "eze-fit/screens/"));
  });

  it("requires meaningful alt text and web-sized images", () => {
    for (const [id, a] of registered) {
      expect(a.alt.length, id).toBeGreaterThan(40);
      expect(statSync(`public${a.src}`).size, `${id} too heavy`).toBeLessThan(200 * 1024);
      expect(a.src.endsWith(".webp")).toBe(true);
    }
  });

  it("has no unregistered image sitting in a public EZE-FIT folder", () => {
    const listed = new Set(registered.map(([, a]) => a.src));
    for (const dir of ["screens", "promo", "brand"]) {
      for (const f of readdirSync(`public/eze-fit/${dir}`).filter((f) => f !== ".gitkeep")) expect(listed.has(`/eze-fit/${dir}/${f}`) || dir === "brand", `unregistered public file: ${dir}/${f}`).toBe(true);
    }
  });

  it("keeps internal documentation out of every public directory", () => {
    for (const root of ["public/eze-fit", "public/eze-form", "public/eze-irl"]) {
      const walk = (d: string): string[] => readdirSync(d).flatMap((n) => (statSync(`${d}/${n}`).isDirectory() ? walk(`${d}/${n}`) : [`${d}/${n}`]));
      for (const f of walk(root)) expect(/\.(md|txt|json|env|sql|csv|pdf)$/i.test(f), `internal file in public: ${f}`).toBe(false);
    }
  });

  it("holds the Research screen back until the owner approves it", () => {
    expect(ezeFitAssets.screens.understand).toBeNull();
    expect(media).toContain("research-explorer.png");
    expect(media).toContain("HOLD");
  });
});

describe("EZE // FORM registry", () => {
  it("only registers products whose images exist and carry alt text", () => {
    for (const p of ezeFormAssets.products) for (const a of [p.views.front, p.views.back, p.views.side, ...(p.views.detail ?? []), ...(p.views.alt ?? [])].filter(Boolean) as ImageAsset[]) {
      expect(existsSync(`public${a.src}`), a.src).toBe(true);
      expect(a.alt.length).toBeGreaterThan(20);
    }
  });
});

describe("EZE IRL photography registry", () => {
  const photos = Object.entries(ezeIrlPhotos);
  it("registers only files that exist, as web WebP under 300 KB, with real alt text", () => {
    for (const [k, a] of photos) {
      expect(existsSync(`public${a.src}`), k).toBe(true);
      expect(statSync(`public${a.src}`).size, `${k} too heavy`).toBeLessThan(300 * 1024);
      expect(a.alt.length, k).toBeGreaterThan(40);
      expect(a.focal, `${k} needs a focal point`).toMatch(/^\d+% \d+%$/);
    }
  });
  it("documents every photo, and keeps excluded originals out of public/", () => {
    const doc = readFileSync("docs/assets/eze-irl-photos.md", "utf8");
    for (const [k, a] of photos) expect(doc, k).toContain(a.src.split("/").pop());
    expect(readdirSync("public/eze-irl/photos").length).toBe(photos.length);
  });
});
