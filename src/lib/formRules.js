// Prayer request rules live here. Change the numbers to change them everywhere.
export const PRAYER_MIN_WORDS = 1;
export const PRAYER_MAX_CHARS = 300;

export const SEX_OPTIONS = ["Male", "Female"];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Counts words and ignores extra spaces and line breaks.
export function countWords(text) {
  const trimmed = String(text ?? "").trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}