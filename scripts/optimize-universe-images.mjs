// Converts the captured live-site PNGs (2-3 MB each) into web-sized WebP under public/universe/.
// Usage: node scripts/optimize-universe-images.mjs <captured-live-dir>
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const src = process.argv[2];
const out = "public/universe";
// Max widths: photos/cards are shown at most ~1280 CSS px wide; 1600 covers 1.25x density without shipping 3 MB files.
const jobs = [
  ["photos", 1600], ["form", 1400], ["carousel", 1200],
];
let before = 0, after = 0;
for (const [dir, width] of jobs) {
  fs.mkdirSync(path.join(out, dir), { recursive: true });
  for (const f of fs.readdirSync(path.join(src, dir)).filter((n) => n.endsWith(".png"))) {
    const input = path.join(src, dir, f);
    const dest = path.join(out, dir, f.replace(/\.png$/, ".webp"));
    const info = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(dest);
    before += fs.statSync(input).size; after += info.size;
  }
}
fs.mkdirSync(path.join(out, "brand"), { recursive: true });
for (const f of ["circle", "white"]) {
  const input = path.join(src, "brand", `${f}.png`);
  const info = await sharp(input).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 100, effort: 5 }).toFile(path.join(out, "brand", `${f}.webp`));
  before += fs.statSync(input).size; after += info.size;
}
console.log(`images: ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(1)} MB`);
