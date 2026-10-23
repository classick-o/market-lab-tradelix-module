/**
 * A one-price auction over a small book of one-unit orders (lesson 0.1.1 and the auction-book widget).
 * Prices are compared in cents, so 99.95 and 100.00 never suffer floating-point drift.
 */

export interface Book {
  /** Limit prices: each buyer pays at most theirs, each seller accepts at least theirs. */
  buyers: number[];
  sellers: number[];
}

const c = (p: number) => Math.round(p * 100);

/** Who would trade at one price for everyone: units traded is the smaller side. */
export function auctionAt(book: Book, price: number): { buyers: number; sellers: number; units: number } {
  const buyers = book.buyers.filter((b) => c(b) >= c(price)).length;
  const sellers = book.sellers.filter((s) => c(s) <= c(price)).length;
  return { buyers, sellers, units: Math.min(buyers, sellers) };
}

/** Every price on the ladder from the lowest order to the highest, `step` apart. */
export function ladder(book: Book, step: number): number[] {
  const all = [...book.buyers, ...book.sellers].map(c);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const s = c(step);
  const out: number[] = [];
  for (let p = lo; p <= hi; p += s) out.push(p / 100);
  return out;
}

/** The price where the most units trade (the lowest such price when several tie). */
export function auctionBest(book: Book, step: number): { price: number; units: number } {
  let best = { price: 0, units: -1 };
  for (const p of ladder(book, step)) {
    const u = auctionAt(book, p).units;
    if (u > best.units) best = { price: p, units: u };
  }
  return best;
}

/** The book after an auction at `price`: the keenest buyers and the cheapest sellers that traded are gone. */
export function bookAfter(book: Book, price: number): Book {
  const { units } = auctionAt(book, price);
  const buyers = [...book.buyers].sort((a, b) => b - a).slice(units);
  const sellers = [...book.sellers].sort((a, b) => a - b).slice(units);
  return { buyers, sellers };
}

export const bestBid = (book: Book) => (book.buyers.length ? Math.max(...book.buyers) : 0);
export const bestAsk = (book: Book) => (book.sellers.length ? Math.min(...book.sellers) : 0);

/**
 * A buy order for `units` at up to `limit` arriving in the book: it takes the cheapest sellers at
 * their own prices while they are within the limit; what's left waits in the book as a bid at `limit`.
 */
export function fillBuy(book: Book, units: number, limit: number): { fills: number[]; rest: number; book: Book } {
  const sellers = [...book.sellers].sort((a, b) => a - b);
  const fills: number[] = [];
  while (fills.length < units && sellers.length && c(sellers[0]) <= c(limit)) fills.push(sellers.shift()!);
  const rest = units - fills.length;
  return { fills, rest, book: { buyers: [...book.buyers, ...Array<number>(rest).fill(limit)], sellers } };
}
