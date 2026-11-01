import { fill } from "./tokens.js";

const PATTERN = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\)|\n/g;

export function parse(text = "") {
  const segments = [];
  let last = 0;
  for (const match of text.matchAll(PATTERN)) {
    if (match.index > last) segments.push({ kind: "text", text: text.slice(last, match.index) });
    const [, strong, em, code, label, href] = match;
    if (strong !== undefined) segments.push({ kind: "strong", text: strong });
    else if (em !== undefined) segments.push({ kind: "em", text: em });
    else if (code !== undefined) segments.push({ kind: "code", text: code });
    else if (label !== undefined) segments.push({ kind: "link", text: label, href });
    else segments.push({ kind: "br", text: " " });
    last = match.index + match[0].length;
  }
  if (last < text.length) segments.push({ kind: "text", text: text.slice(last) });
  return segments;
}

export const plain = (text, values) =>
  parse(fill(text, values))
    .map((segment) => segment.text)
    .join("")
    .replace(/\s+/g, " ")
    .trim();

export const lines = (text, values) => fill(text, values).split("\n");
