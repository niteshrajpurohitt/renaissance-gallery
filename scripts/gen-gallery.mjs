// Scans public/gallery and writes src/components/Gallery/images.json with each
// photo's real dimensions (needed for the masonry "salon wall" layout).
// Existing metadata (title, place, date, settings, alt) is preserved.
//
// Usage: npm run gallery
import { readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const GALLERY_DIR = path.join(ROOT, "public", "gallery");
const OUT = path.join(ROOT, "src", "components", "Gallery", "images.json");

function webpSize(buf) {
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
  }
  if (chunk === "VP8 ") {
    return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const b = buf.readUInt32LE(21);
    return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
  }
  return null;
}

function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

function pngSize(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const existing = existsSync(OUT) ? JSON.parse(await readFile(OUT, "utf8")) : [];
const byFile = new Map(
  existing.map((e) => (typeof e === "string" ? [e, { file: e }] : [e.file, e])),
);

const files = (await readdir(GALLERY_DIR)).filter((f) => /\.(webp|jpe?g|png)$/i.test(f));
// Keep the existing order, append new files at the end.
const ordered = [
  ...existing.map((e) => (typeof e === "string" ? e : e.file)).filter((f) => files.includes(f)),
  ...files.filter((f) => !byFile.has(f)).sort(),
];

const out = [];
for (const file of ordered) {
  const buf = await readFile(path.join(GALLERY_DIR, file));
  const size = webpSize(buf) ?? jpegSize(buf) ?? pngSize(buf);
  if (!size) {
    console.warn(`! could not read size of ${file}, skipping`);
    continue;
  }
  out.push({ ...byFile.get(file), file, w: size.w, h: size.h });
}

await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${out.length} images to ${path.relative(ROOT, OUT)}`);
