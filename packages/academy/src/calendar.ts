/**
 * Day and week keys used for streaks, daily challenges and weekly goals.
 * Keys are computed in the user's time zone ("auto" = the device's).
 */

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(tz?: string): Intl.DateTimeFormat {
  const key = tz && tz !== "auto" ? tz : "";
  let f = formatters.get(key);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat("en-CA", { timeZone: key || undefined, year: "numeric", month: "2-digit", day: "2-digit" });
    } catch {
      f = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" });
    }
    formatters.set(key, f);
  }
  return f;
}

/** "2026-10-20" for the calendar day of `t` in the given time zone. */
export function dayKey(t: number, tz?: string): string {
  const parts = formatter(tz).formatToParts(new Date(t));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Day number since the epoch for a day key; differences between keys are whole days. */
export function dayIndex(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
}

export function keyFromIndex(index: number): string {
  return new Date(index * 86_400_000).toISOString().slice(0, 10);
}

export function addDays(key: string, n: number): string {
  return keyFromIndex(dayIndex(key) + n);
}

/** ISO-8601 week key, e.g. "2026-W43". Weeks start on Monday. */
export function weekKey(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dow = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dow);
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((date.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** Monday..Sunday day keys of the week containing `day`. */
export function weekDays(day: string): string[] {
  const [y, m, d] = day.split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay() || 7;
  const monday = addDays(day, 1 - dow);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** Small, stable string hash (FNV-1a) for seeding day- and week-based picks. */
export function seedOf(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
