import raw from "./images.json";

// images.json entries: { file, w, h, title?, place?, date?, settings?, alt? }
// (plain filename strings are still accepted)
export const photos = raw.map((entry) => (typeof entry === "string" ? { file: entry } : entry));

const NUMERALS = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

export function toRoman(n) {
  let out = "";
  for (const [value, numeral] of NUMERALS) {
    while (n >= value) {
      out += numeral;
      n -= value;
    }
  }
  return out;
}

export const photoSrc = (photo) => `/gallery/${encodeURIComponent(photo.file)}`;

export const photoAlt = (photo, index) =>
  photo.alt ?? photo.title ?? `Photograph ${toRoman(index + 1)}`;
