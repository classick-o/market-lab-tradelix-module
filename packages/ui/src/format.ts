import { formatPct, formatPrice, formatSigned } from "@market-lab/engine";
import { BAND_LABEL, bandOf } from "@market-lab/evaluation";

export { formatPct, formatPrice, formatSigned };

export function money(cents: number): string {
  return `${formatPrice(cents)} vUSD`;
}

export function signedMoney(cents: number): string {
  return `${formatSigned(cents)} vUSD`;
}

export function bandLabel(dqs: number | null): string {
  return dqs === null ? "Not scored" : BAND_LABEL[bandOf(dqs)];
}

export function relativeTime(t: number, now = Date.now()): string {
  const s = Math.round((now - t) / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

export function formatFact(value: number | string | boolean | undefined, format: "price" | "pct" | "int" | "text"): string {
  if (value === undefined) return "—";
  if (format === "price") return formatPrice(Number(value));
  if (format === "pct") return `${Number(value).toFixed(1)}%`;
  if (format === "int") return new Intl.NumberFormat("en-US").format(Number(value));
  return String(value);
}

export const DIFFICULTY_LABEL = ["", "Intro", "Easy", "Medium", "Hard", "Expert"];

const tzOpt = (tz?: string) => (tz && tz !== "auto" ? { timeZone: tz } : {});

export function formatDate(t: number, tz?: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }): string {
  try {
    return new Date(t).toLocaleDateString("en-GB", { ...opts, ...tzOpt(tz) });
  } catch {
    return new Date(t).toLocaleDateString("en-GB", opts);
  }
}

export function formatTime(t: number, tz?: string): string {
  try {
    return new Date(t).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", ...tzOpt(tz) });
  } catch {
    return new Date(t).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
}

/** "4 min", "1 h 12 min". */
export function formatDuration(ms: number): string {
  const m = Math.max(1, Math.round(ms / 60000));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h} h ${m % 60} min` : `${h} h`;
}

/** Day key ("2026-10-20") → "Tue 20 Oct". */
export function formatDayKey(key: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** Monday..Sunday day keys → "19–25 Oct" (or "28 Sep – 4 Oct"). */
export function formatWeekRange(days: string[]): string {
  const first = days[0];
  const last = days[days.length - 1];
  const sameMonth = first.slice(0, 7) === last.slice(0, 7);
  return sameMonth
    ? `${Number(first.slice(8))}–${formatDayKey(last, { day: "numeric", month: "short" })}`
    : `${formatDayKey(first, { day: "numeric", month: "short" })} – ${formatDayKey(last, { day: "numeric", month: "short" })}`;
}
