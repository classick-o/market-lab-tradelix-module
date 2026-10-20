import type { CSSProperties } from "react";

/**
 * Accent colours. The accent marks primary actions, selection, progress, the "Now" cursor and
 * decision markers. Gains and losses use their own green and red, whatever the accent.
 */
export interface Accent {
  id: string;
  name: string;
  hex: string;
  note: string;
  caution?: string;
}

export const ACCENTS: Accent[] = [
  { id: "lime", name: "Signal Lime", hex: "#C8F25A", note: "The MARKET//LAB default: energetic, and clearly distinct from the green used for gains." },
  { id: "mono", name: "Mono", hex: "#F5F5F5", note: "Pure black and white. The most restrained option." },
  { id: "tradelix", name: "Tradelix Blue", hex: "#1F6FEB", note: "Matches the Tradelix brand, so the module feels native inside it." },
  { id: "champagne", name: "Champagne", hex: "#D9C4A0", note: "Warm and desaturated. The quiet-luxury option." },
  { id: "lavender", name: "Lavender", hex: "#A99BFF", note: "Soft and thoughtful. Echoes the 'insight' colour from the concept." },
  { id: "ice", name: "Ice", hex: "#8FD8FF", note: "Cool and technical. Reads as precision." },
  { id: "amber", name: "Amber", hex: "#FFB547", note: "Warm and very visible.", caution: "Overlaps with warning semantics." },
  { id: "coral", name: "Coral", hex: "#FF7A59", note: "Bold and distinctive.", caution: "Close to loss and danger red." },
];

export const DEFAULT_ACCENT = "lime";

/** Background themes. Both are dark; "navy" is the default. */
export const THEMES: Record<"navy" | "charcoal", { name: string; bg: string; note: string }> = {
  navy: { name: "Deep navy", bg: "#0A0E16", note: "Cool, deep blue-black. The default." },
  charcoal: { name: "Charcoal", bg: "#0B0B0C", note: "Neutral near-black, the original Market Lab look." },
};

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const n = parseInt(hex.replace("#", ""), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

/** WCAG contrast ratio between two colours. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Text colour for labels placed on the accent: whichever of near-white and near-black reads better. */
export function inkFor(hex: string): string {
  return contrast(hex, "#FFFFFF") >= contrast(hex, "#0A0A0A") ? "#FFFFFF" : "#0A0A0A";
}

function mix(hex: string, toward: number, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(c + (toward - c) * amount));
  return `#${ch.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function rgba(hex: string, a: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export function accentById(id: string | undefined): Accent {
  return ACCENTS.find((a) => a.id === id) ?? ACCENTS[0];
}

/** The accent, lightened just enough to reach 4.5:1 on the background, for small text and hairlines. */
export function foregroundFor(hex: string, background = "#080808"): string {
  let fg = hex;
  for (let amount = 0.05; contrast(fg, background) < 4.5 && amount <= 1; amount += 0.05) fg = mix(hex, 255, amount);
  return fg;
}

/** CSS custom properties for an accent, applied on .ml-root (or on a preview container). */
export function accentVars(hex: string, background = "#0A0E16"): CSSProperties {
  const light = luminance(hex) > 0.5;
  return {
    "--ml-accent": hex,
    "--ml-accent-hover": light ? mix(hex, 255, 0.35) : mix(hex, 255, 0.12),
    "--ml-accent-ink": inkFor(hex),
    "--ml-accent-fg": foregroundFor(hex, background),
    "--ml-accent-soft": rgba(hex, 0.12),
    "--ml-accent-line": rgba(hex, 0.45),
  } as CSSProperties;
}
