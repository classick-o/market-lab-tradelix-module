/** Conversions and formatting for integer-cent values. Display only — never feed formatted values back into the engine. */

export function toCents(value: number): number {
  return Math.round(value * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

const priceFormat = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** 123456 → "1,234.56" */
export function formatPrice(cents: number): string {
  return priceFormat.format(cents / 100);
}

/** 123456 → "+1,234.56", -500 → "−5.00" (uses a true minus sign). */
export function formatSigned(cents: number): string {
  if (cents === 0) return formatPrice(0);
  const s = formatPrice(Math.abs(cents));
  return cents > 0 ? `+${s}` : `−${s}`;
}

export function formatPct(value: number, digits = 2, signed = false): string {
  const s = Math.abs(value).toFixed(digits);
  if (!signed || value === 0) return `${value < 0 ? "−" : ""}${s}%`;
  return `${value > 0 ? "+" : "−"}${s}%`;
}

/** Parses user input such as "98.5", "1,234.50" or " 100 " into cents. Returns null for invalid input. */
export function parsePrice(text: string): number | null {
  const cleaned = text.replace(/[,\s]/g, "");
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null;
  const cents = Math.round(Number(cleaned) * 100);
  return Number.isFinite(cents) && cents > 0 ? cents : null;
}

export function parseQuantity(text: string): number | null {
  const cleaned = text.replace(/[,\s]/g, "");
  if (!/^\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

/** Commission rounded up to the cent, computed with integer arithmetic. */
export function commission(notional: number, bps: number): number {
  if (notional <= 0 || bps <= 0) return 0;
  return Math.floor((notional * bps + 9999) / 10000);
}
