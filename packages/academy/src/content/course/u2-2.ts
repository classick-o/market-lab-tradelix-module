import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, MarkRole, Question, TaskData, UnitContent } from "../../types";

type Cards = NonNullable<TaskData["cards"]>;

/*
 * Unit 2.2 · Chart patterns (docs/learn/course/level-2-practitioner-a.md). Lessons 2.2.1–2.2.10, their check
 * questions, and the terms and concepts the unit introduces.
 *
 * Conventions in this file:
 * - Candle indices in layers and tap zones are 0-based; copy uses 1-based candle numbers ("candle 27" is index 26).
 * - Swing points follow widget-math `swingPoints` (k = 2): a high above the two candles on each side, a low below them.
 * - Most series come from `walk`, a deterministic builder: each turning point of its path is exactly that candle's
 *   high or low, and the turning points are the series' swing points. Every number the copy quotes was checked
 *   against the built candles with a script.
 * - Pattern statistics are Bulkowski's (US stocks, daily charts, bull-market tables); the copy says so where it uses them.
 */

// ─── Builders ──────────────────────────────────────────────────────────────

type Pt = [index: number, price: number];

/** A fixed pseudo-random sequence in [0, 1): the same seed always draws the same candles. */
function lcg(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
}
const r2 = (v: number) => Math.round(v * 100) / 100;

/**
 * Candles along a path of points [index, price] (indices increasing). An inner point above both neighbours
 * is a peak and becomes that candle's high exactly; one below both is a trough and becomes its low. Other
 * candles stay strictly between the turning points on either side, and their wicks never step against the path,
 * so the turning points are the chart's swing points. `closes` pins chosen closes; `vols` adds volume.
 */
function walk(pts: Pt[], opt: { wick?: number; seed?: number; closes?: Record<number, number>; vols?: number[] } = {}): CandleData[] {
  const wick = opt.wick ?? 0.12;
  const rnd = lcg(opt.seed ?? 7);
  const n = pts[pts.length - 1][0] + 1;
  const turn = pts.map((p, j) => (j === 0 || j === pts.length - 1 ? 0 : p[1] > pts[j - 1][1] && p[1] > pts[j + 1][1] ? 1 : p[1] < pts[j - 1][1] && p[1] < pts[j + 1][1] ? -1 : 0));
  const turns = pts.map((p, j) => ({ i: p[0], p: p[1], t: turn[j] })).filter((x) => x.t !== 0);
  const at = (i: number) => {
    let j = 0;
    while (pts[j + 1][0] < i) j++;
    const [i0, p0] = pts[j];
    const [i1, p1] = pts[j + 1];
    return p0 + ((p1 - p0) * (i - i0)) / (i1 - i0);
  };
  const out: CandleData[] = [];
  let o = r2(at(0) - (at(1) - at(0)) * 0.6);
  for (let i = 0; i < n; i++) {
    const here = turns.find((x) => x.i === i);
    const prev = [...turns].reverse().find((x) => x.i < i);
    const next = turns.find((x) => x.i > i);
    const up = next ? next.t === 1 : prev ? prev.t === -1 : at(n - 1) > at(0);
    const hi = Math.min(prev?.t === 1 ? prev.p : Infinity, next?.t === 1 ? next.p : Infinity);
    const lo = Math.max(prev?.t === -1 ? prev.p : -Infinity, next?.t === -1 ? next.p : -Infinity);
    const last = out[i - 1];
    let c: number;
    let h: number;
    let l: number;
    if (here) {
      const d = wick * (0.5 + rnd());
      if (here.t === 1) {
        h = here.p;
        c = r2(opt.closes?.[i] ?? here.p - d);
        l = Math.min(o, c) - wick * rnd();
        l = Math.max(l, Math.max(prev?.t === -1 ? prev.p : -Infinity, next?.t === -1 ? next.p : -Infinity) + 0.02);
      } else {
        l = here.p;
        c = r2(opt.closes?.[i] ?? here.p + d);
        h = Math.max(o, c) + wick * rnd();
        h = Math.min(h, Math.min(prev?.t === 1 ? prev.p : Infinity, next?.t === 1 ? next.p : Infinity) - 0.02);
      }
    } else {
      c = opt.closes?.[i] ?? Math.min(hi - 0.05, Math.max(lo + 0.05, at(i) + (rnd() - 0.5) * wick * 0.8));
      c = r2(c);
      h = Math.max(o, c) + wick * rnd();
      l = Math.min(o, c) - wick * rnd();
      if (last) {
        if (up) l = Math.max(l, last.l + 0.01);
        else h = Math.min(h, last.h - 0.01);
      }
      h = Math.min(h, hi - 0.02);
      l = Math.max(l, lo + 0.02);
    }
    h = r2(Math.max(h, o, c));
    l = r2(Math.min(l, o, c));
    out.push({ o, h, l, c, ...(opt.vols ? { v: opt.vols[i] } : {}) });
    o = c;
  }
  return out;
}

/** Candles from fixed closes whose ranges cycle through `ranges` (open = previous close), so ATR(14) is known exactly. */
function fixedRange(closes: number[], open: number, ranges: number[], upShare: number[]): CandleData[] {
  const out: CandleData[] = [];
  let o = open;
  closes.forEach((c, i) => {
    const r = ranges[i % ranges.length];
    const h = r2(Math.max(o, c) + r2((r - Math.abs(c - o)) * upShare[i % upShare.length]));
    out.push({ o, h, l: r2(h - r), c });
    o = c;
  });
  return out;
}

/** Rows of [open, high, low, close] → candles. */
const rows = (r: [number, number, number, number][]): CandleData[] => r.map(([o, h, l, c]) => ({ o, h, l, c }));
/** Flat placeholder candles for diagrams drawn only with layers (`hideCandles`). */
const blank = (n: number): CandleData[] => Array.from({ length: n }, () => ({ o: 102, h: 102, l: 102, c: 102 }));
/** A straight line through (i1, p1) and (i2, p2), drawn from index `from` to `to`. */
const line = (i1: number, p1: number, i2: number, p2: number, from: number, to: number, role: MarkRole = "concept", label?: string): ChartLayer => ({
  kind: "path",
  points: [from, to].map((index) => ({ index, price: r2(p1 + ((p2 - p1) * (index - i1)) / (i2 - i1)) })),
  role,
  label,
  dashed: true,
});
/** A zigzag of [index, price] points, for diagrams. */
const zig = (pts: Pt[], role: MarkRole = "accent"): ChartLayer => ({ kind: "path", points: pts.map(([index, price]) => ({ index, price })), role });
const mark = (index: number, at: "high" | "low" | "close", label: string, role: MarkRole = "concept"): ChartLayer => ({ kind: "marker", index, at, label, role });
const lvl = (price: number, role: "entry" | "stop" | "target" | "support" | "resistance" | "neutral" | "concept", label: string): ChartLayer => ({ kind: "level", price, role, label, chip: true });

// ─── Chart data ────────────────────────────────────────────────────────────

/**
 * 2.2.1: an uptrend line through swing lows 100.00 (c4) and 101.00 (c12), rising 0.125 a candle; the third low,
 * 102.00 (c20), sits on it. Highs 101.50 (c8, 1.00 above the line), 102.45 (c16), 103.40 (c24). c27 is the first
 * close under the line (102.77); c28 closes 102.57. Afterwards lows 102.40 (c29) and 102.55 (c35), highs 103.00
 * (c32) and 103.10 (c38): no close under 102.00. Regression of closes: 103.26 at c30 fitted on 30 candles, 102.75 on 40.
 */
const TL1 = walk([[0, 100.7], [3, 100.0], [7, 101.5], [11, 101.0], [15, 102.45], [19, 102.0], [23, 103.4], [28, 102.4], [31, 103.0], [34, 102.55], [37, 103.1], [39, 102.9]], { wick: 0.12, seed: 11 });
/**
 * 2.2.1 "many analysts": swing lows 100.00 (c4), 100.90 (c10), 101.50 (c16), 102.30 (c22), 102.60 (c28).
 * Line A (c4–c10) has its first close under it on c16 (101.62); line B (c4–c16) on c27 (102.80); line C (c16–c28) none.
 */
const MANY = walk([[0, 100.6], [3, 100.0], [6, 101.4], [9, 100.9], [12, 102.0], [15, 101.5], [18, 102.7], [21, 102.3], [24, 103.3], [27, 102.6], [29, 103.1]], { wick: 0.12, seed: 5 });
/**
 * 2.2.1 scales: swing lows 60.00 (c5), 90.00 (c17), 135.00 (c29), each 50% above the last; highs 96.00, 144.00,
 * 216.00. The log line through the lows is first closed under on c38 (179.86 against 182.98); the linear line
 * through 60.00 and 90.00 is never reached (150.00 at c41, the lowest later low 168.00).
 */
const LOG1 = walk([[0, 66], [4, 60], [10, 96], [16, 90], [22, 144], [28, 135], [34, 216], [38, 168], [40, 180]], { wick: 0.9, seed: 3 });
const LOG1_LINEAR: (number | null)[] = LOG1.map((_, i) => (i < 4 ? null : r2(60 + (i - 4) * 2.5)));
const LOG1_LOG: (number | null)[] = LOG1.map((_, i) => (i < 4 ? null : r2(60 * Math.pow(1.5, (i - 4) / 12))));
/** Least-squares line through the first `n` closes, drawn over those candles. */
function regression(c: CandleData[], n: number): (number | null)[] {
  const mx = (n - 1) / 2;
  const my = c.slice(0, n).reduce((s, x) => s + x.c, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (i - mx) * (c[i].c - my);
    sxx += (i - mx) ** 2;
  }
  const b = sxy / sxx;
  return c.map((_, i) => (i < n ? r2(my + b * (i - mx)) : null));
}

/**
 * 2.2.2 and the anatomy: a rise from 97.00 (c3) into a box. Tops 102.00 (c13), 101.95 (c21), 102.00 (c29);
 * bottoms 100.00 (c17), 100.05 (c25); last swing low inside 101.00 (c32). c34 closes 102.45 (volume 1,720 after
 * 1,150 on c13 fading to 600 on c33). Throwback low 102.05 (c39), then a high of 103.75 (c44).
 */
const A1_VOL = [
  1250, 1180, 1220, 1300, 1340, 1280, 1200, 1260, 1330, 1380, 1410, 1360, 1150, 1080, 1020, 990, 960, 930, 880, 860, 840, 800, 790, 760, 740, 720, 700, 690, 680, 660, 640, 620, 600, 1720,
  1350, 1100, 900, 820, 780, 950, 1020, 1060, 1100, 1080, 980, 940,
];
const A1 = walk([[0, 97.4], [2, 97.0], [6, 99.2], [8, 98.6], [12, 102.0], [16, 100.0], [20, 101.95], [24, 100.05], [28, 102.0], [31, 101.0], [35, 102.95], [38, 102.05], [43, 103.75], [45, 103.4]], {
  wick: 0.12,
  seed: 21,
  closes: { 33: 102.45 },
  vols: A1_VOL,
});
/**
 * 2.2.2 filters: ranges alternate 0.30 and 0.50 with no gaps, so ATR(14) is 0.40 on every candle. Resistance near
 * 104.00 (highs 103.99 c4, 103.95 c10). Closes above 104.00: 104.05 (c15) and 104.12 (c25), each back inside on the
 * next candle (103.70, 103.85), then 104.15 (c34), 104.32 (c35), 104.55 (c36), 104.85 (c37). Highest high 105.23.
 */
const F1 = fixedRange(
  [
    103.2, 103.45, 103.7, 103.85, 103.6, 103.35, 103.15, 103.3, 103.55, 103.8, 103.75, 103.5, 103.65, 103.9, 104.05, 103.7, 103.45, 103.2, 103.1, 103.35, 103.6, 103.75, 103.65, 103.85, 104.12,
    103.85, 103.6, 103.4, 103.3, 103.5, 103.7, 103.8, 103.9, 104.15, 104.32, 104.55, 104.85, 105.05, 104.95,
  ],
  103.0,
  [0.3, 0.5],
  [0.5, 0.3, 0.6, 0.4, 0.2, 0.7, 0.45],
);

/** 2.2.3 double top: peaks 105.00 (c9) and 104.90 (c21), valley 102.00 (c15). c27 closes 101.83; pullback high 101.95 (c31); low 99.90 (c36). */
const DT1 = walk([[0, 100.4], [2, 100.0], [8, 105.0], [14, 102.0], [20, 104.9], [27, 101.3], [30, 101.95], [35, 99.9], [37, 100.4]], { wick: 0.12, seed: 31 });
/** 2.2.3 twin peaks that keep rising: 104.00 (c9) and 103.95 (c19), valley 102.50 (c14); c25 closes 104.32; high 105.50 (c28). */
const DT2 = walk([[0, 100.8], [2, 100.5], [8, 104.0], [13, 102.5], [18, 103.95], [21, 103.2], [27, 105.5], [29, 105.1]], { wick: 0.12, seed: 32 });
/** 2.2.3 double bottom: lows 96.00 (c9) and 96.20 (c21), peak 99.00 (c15); c26 closes 99.20, the first close above 99.00. */
const DB1 = walk([[0, 99.6], [2, 100.2], [8, 96.0], [14, 99.0], [20, 96.2], [25, 99.2]], { wick: 0.12, seed: 33, closes: { 25: 99.2 } });

/**
 * 2.2.4 head and shoulders: left shoulder 104.80 (c8), lows 103.00 (c12) and 103.00 (c22), head 106.00 (c17), right
 * shoulder 104.70 (c26). c29 closes 103.42, c30 103.06, c31 102.57 (first close under 103.00). Throwback high
 * 102.95 (c35), low 101.30 (c41).
 */
const HS1 = walk([[0, 101.2], [2, 100.9], [7, 104.8], [11, 103.0], [16, 106.0], [21, 103.0], [25, 104.7], [31, 102.2], [34, 102.95], [40, 101.3], [42, 101.6]], { wick: 0.12, seed: 41 });
/**
 * 2.2.4 down-sloping neckline: lows 103.40 (c12) and 102.80 (c22), −0.06 a candle; shoulders 105.20 (c8), 104.60
 * (c26); head 106.40 (c17). c30 closes 102.36, the first close under 102.80 (the line is at 102.32 there); c31
 * closes 101.76, the first close under the line (102.26).
 */
const HS2 = walk([[0, 102.4], [2, 102.1], [7, 105.2], [11, 103.4], [16, 106.4], [21, 102.8], [25, 104.6], [31, 101.2], [33, 101.6]], { wick: 0.12, seed: 42 });
/** 2.2.4 Try: shoulders 103.80 (c8) and 103.70 (c26), head 105.10 (c17), lows between them 102.10 (c12) and 102.15 (c22). */
const HS3 = walk([[0, 100.4], [2, 100.1], [7, 103.8], [11, 102.1], [16, 105.1], [21, 102.15], [25, 103.7], [27, 103.1]], { wick: 0.12, seed: 43 });
/**
 * 2.2.4 and 2.2.10: a Gaussian random walk (seed 556, σ 0.30 per candle, |N(0, 0.12)| wicks), picked from many for
 * its shapes. Double top 101.67 (c16) and 101.79 (c24), valley 100.50 (c19), first close under it c28 (100.46), then
 * up to 103.77. Head and shoulders 103.13 (c37), 103.77 (c43), 103.13 (c52) over lows 102.29 (c38) and 102.30 (c49);
 * first close under 102.29 on c55 (102.25), then down to 100.86 (c60).
 */
const RWALK = rows([
  [100.0, 100.0, 99.89, 99.91], [99.91, 101.27, 99.63, 101.1], [101.1, 101.31, 101.09, 101.29], [101.29, 101.38, 100.93, 101.15], [101.15, 101.72, 101.09, 101.55],
  [101.55, 101.58, 101.44, 101.46], [101.46, 101.65, 101.43, 101.51], [101.51, 101.54, 101.41, 101.48], [101.48, 101.53, 101.34, 101.38], [101.38, 101.62, 101.36, 101.43],
  [101.43, 101.45, 101.29, 101.29], [101.29, 101.45, 101.14, 101.14], [101.14, 101.27, 101.11, 101.24], [101.24, 101.35, 101.04, 101.16], [101.16, 101.51, 101.03, 101.38],
  [101.38, 101.67, 100.98, 100.99], [100.99, 101.11, 100.84, 100.88], [100.88, 100.95, 100.88, 100.91], [100.91, 100.98, 100.5, 100.65], [100.65, 100.88, 100.59, 100.88],
  [100.88, 101.56, 100.78, 101.5], [101.5, 101.72, 101.43, 101.69], [101.69, 101.74, 101.4, 101.62], [101.62, 101.79, 101.57, 101.64], [101.64, 101.7, 101.1, 101.26],
  [101.26, 101.46, 101.05, 101.14], [101.14, 101.2, 100.84, 100.94], [100.94, 101.11, 100.38, 100.46], [100.46, 100.67, 100.22, 100.62], [100.62, 100.89, 100.6, 100.79],
  [100.79, 101.79, 100.75, 101.62], [101.62, 101.76, 101.54, 101.65], [101.65, 102.37, 101.49, 102.19], [102.19, 102.23, 101.9, 102.03], [102.03, 102.51, 101.92, 102.41],
  [102.41, 102.74, 102.38, 102.7], [102.7, 103.13, 102.65, 103.0], [103.0, 103.11, 102.29, 102.35], [102.35, 103.08, 102.34, 103.06], [103.06, 103.35, 102.9, 103.35],
  [103.35, 103.41, 103.33, 103.34], [103.34, 103.7, 103.24, 103.67], [103.67, 103.77, 103.45, 103.58], [103.58, 103.61, 103.2, 103.46], [103.46, 103.61, 103.07, 103.16],
  [103.16, 103.24, 102.65, 102.66], [102.66, 102.78, 102.51, 102.71], [102.71, 102.83, 102.35, 102.37], [102.37, 102.63, 102.3, 102.6], [102.6, 102.83, 102.57, 102.73],
  [102.73, 103.02, 102.71, 103.0], [103.0, 103.13, 102.52, 102.6], [102.6, 102.76, 102.47, 102.56], [102.56, 102.72, 102.25, 102.43], [102.43, 102.58, 102.2, 102.25],
  [102.25, 102.29, 102.07, 102.14], [102.14, 102.15, 101.62, 101.77], [101.77, 101.84, 101.47, 101.49], [101.49, 101.73, 101.05, 101.23], [101.23, 101.23, 100.78, 100.86],
]);

/**
 * 2.2.5: tops 102.00 (c9), 101.95 (c17), 102.00 (c25); bottoms 100.05 (c13), 100.00 (c21), 100.10 (c29). Partial
 * rise to 101.20 (c32); c35 closes 100.02, c36 99.64 (first close under 100.00); pullback high 99.95 (c40); low 98.80 (c45).
 */
const TT1 = walk([[0, 98.4], [2, 98.0], [8, 102.0], [12, 100.05], [16, 101.95], [20, 100.0], [24, 102.0], [28, 100.1], [31, 101.2], [36, 99.3], [39, 99.95], [44, 98.8], [46, 99.1]], { wick: 0.12, seed: 51 });

/** 2.2.6 ascending triangle: tops 104.00 (c7), 103.97 (c15); lows 100.00 (c3), 101.00 (c11), 102.00 (c19), 0.125 a candle, reaching 104.00 at c35 (the apex). c23 closes 104.25; high 105.60 (c33). */
const TRI1 = walk([[0, 100.5], [2, 100.0], [6, 104.0], [10, 101.0], [14, 103.97], [18, 102.0], [24, 105.0], [27, 104.4], [32, 105.6], [34, 105.3]], { wick: 0.12, seed: 61, closes: { 22: 104.25 } });
/**
 * 2.2.6 symmetrical triangle: tops 104.00 (c3), 103.20 (c11), 102.40 (c19), −0.10 a candle; lows 100.40 (c7), 101.20 (c15),
 * 101.80 (c21), +0.10; the lines meet at 102.00 on c23. c22 closes 102.18 over the upper line (102.10; lower 101.90; ATR(14)
 * 0.50); c23 closes 101.90 under the lower line (102.00).
 */
const TRI2 = walk([[0, 103.5], [2, 104.0], [6, 100.4], [10, 103.2], [14, 101.2], [18, 102.4], [20, 101.8], [21, 102.25], [23, 101.55], [26, 101.95], [28, 101.7]], { wick: 0.1, seed: 62, closes: { 21: 102.18 } });

/** 2.2.7 flag: pole 100.00 (c3) → 104.00 (c9); flag highs 103.80 (c13), 103.55 (c17), lows 103.50 (c11), 103.25 (c15), 103.00 (c19); c21 closes 103.60 over the upper line (103.30); high 105.70 (c25). */
const FL1 = walk([[0, 100.3], [2, 100.0], [8, 104.0], [10, 103.5], [12, 103.8], [14, 103.25], [16, 103.55], [18, 103.0], [24, 105.7], [27, 104.9], [29, 105.3]], { wick: 0.1, seed: 71, closes: { 19: 103.28, 20: 103.6 } });
/** 2.2.7 measured move: A 100.00 (c3), B 104.00 (c11), C 102.00 (c16); c23 reaches 104.65; high 104.90 (c24). */
const MM1 = walk([[0, 100.4], [2, 100.0], [10, 104.0], [15, 102.0], [23, 104.9], [26, 104.3], [28, 104.6]], { wick: 0.12, seed: 72 });

/** 2.2.8 rising wedge: lows 100.00 (c3), 101.60 (c11), 103.20 (c19), +0.20 a candle; highs 102.60 (c7), 103.80 (c15), 105.00 (c23), +0.15. c25 closes 104.27 under the lower line (104.40); low 103.60 (c27); high 105.60 (c32). */
const RW1 = walk([[0, 100.5], [2, 100.0], [6, 102.6], [10, 101.6], [14, 103.8], [18, 103.2], [22, 105.0], [26, 103.6], [31, 105.6], [33, 105.3]], { wick: 0.1, seed: 81 });

/** 2.2.9 rounding bottom: left rim 102.20 (c3), bottom 98.00 (c20); c39 closes 102.34, the first close above the rim. */
const RB1 = walk([[0, 101.7], [2, 102.2], [6, 100.7], [10, 99.4], [14, 98.5], [19, 98.0], [24, 98.4], [28, 99.2], [32, 100.4], [36, 101.8], [40, 102.9]], { wick: 0.1, seed: 91 });
/** 2.2.9 failed V: 104.30 (c3) to 100.50 (c9); green c10–c12 to a high of 101.90 (c12); then down to 98.40 (c18). */
const VB1 = walk([[0, 103.8], [2, 104.3], [8, 100.5], [11, 101.9], [17, 98.4], [19, 98.9]], { wick: 0.12, seed: 92 });
/** 2.2.9 cup with handle: left rim 102.00 (c4), bottom 97.00 (c16), right rim 101.95 (c28), handle low 101.00 (c32); c35 closes 102.20. */
const CUP1 = walk([[0, 100.9], [3, 102.0], [7, 99.6], [11, 97.4], [15, 97.0], [19, 97.4], [23, 99.6], [27, 101.95], [31, 101.0], [34, 102.3]], { wick: 0.1, seed: 93, closes: { 34: 102.2 } });

/**
 * 2.2.10 ascending triangle: tops 104.00 (c6), 103.97 (c13), 104.00 (c20); lows 102.40 (c3), 102.75 (c10), 103.10
 * (c17), 103.40 (c23), +0.05 a candle. c25 closes 103.85; c26 closes 104.30 (ATR(14) 0.40, so past the 0.5 × ATR
 * filter at 104.20).
 */
const TRIB = walk([[0, 102.8], [2, 102.4], [5, 104.0], [9, 102.75], [12, 103.97], [16, 103.1], [19, 104.0], [22, 103.4], [25, 104.3]], { wick: 0.25, seed: 106, closes: { 24: 103.85, 25: 104.3 } });
/** c27–c38 if it busts: back inside at 103.85 (high 104.38), under the lower line on c28 (103.40), down to 101.75. */
const TRIB_FAIL = rows([
  [104.3, 104.38, 103.78, 103.85], [103.85, 103.92, 103.35, 103.4], [103.4, 103.48, 102.98, 103.05], [103.05, 103.12, 102.66, 102.72], [102.72, 102.85, 102.4, 102.48], [102.48, 102.7, 102.36, 102.62],
  [102.62, 102.66, 102.22, 102.3], [102.3, 102.41, 102.05, 102.12], [102.12, 102.33, 102.02, 102.27], [102.27, 102.31, 101.88, 101.95], [101.95, 102.14, 101.9, 102.08], [102.08, 102.12, 101.75, 101.82],
]);
/** c27–c38 if it holds: a dip to 104.02 that closes at 104.12, then up to 105.66. */
const TRIB_HOLD = rows([
  [104.3, 104.52, 104.08, 104.44], [104.44, 104.5, 104.02, 104.12], [104.12, 104.46, 104.06, 104.4], [104.4, 104.78, 104.33, 104.71], [104.71, 104.92, 104.58, 104.66], [104.66, 105.02, 104.6, 104.95],
  [104.95, 105.21, 104.81, 104.9], [104.9, 105.12, 104.74, 105.06], [105.06, 105.38, 104.98, 105.31], [105.31, 105.47, 105.1, 105.18], [105.18, 105.55, 105.12, 105.49], [105.49, 105.66, 105.36, 105.58],
]);

// ─── Shared layers ─────────────────────────────────────────────────────────

const TL1_LINE = line(3, 100, 11, 101, 3, 39, "concept", "Trendline");
const A1_BOX: ChartLayer[] = [
  { kind: "zone", from: 101.95, to: 102.0, role: "resistance", label: "Top" },
  { kind: "zone", from: 100.0, to: 100.05, role: "support", label: "Bottom" },
];
const FL1_FLAG: ChartLayer[] = [line(12, 103.8, 16, 103.55, 8, 20), line(10, 103.5, 18, 103.0, 9, 20)];
const TRIB_LINES: ChartLayer[] = [lvl(104, "resistance", "Flat top 104.00"), line(2, 102.4, 22, 103.4, 2, 27, "concept", "Lower line")];

// ─── 2.2.1 · Trendlines and channels ───────────────────────────────────────

const L_2_2_1: Lesson = {
  id: "2.2.1",
  title: "Drawing lines that mean something: trendlines and channels",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Draw trendlines and channels by fixed rules, and treat a break as a warning to confirm, not a signal.",
  objectives: [
    "Draw a valid trendline through two swing lows and confirm it with a third touch.",
    "Draw a parallel channel, and explain why a fitted regression channel cannot be used in a backtest.",
    "Treat a trendline break as a warning to confirm, not as a signal on its own.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "arena", ref: "bearish", label: "Arena: bearish" },
  ],
  script: {
    unit: "2.2",
    courseId: "2.2.1",
    bridge: "Unit 2.1 judged candle patterns by context, confirmation and base rate. Now the lines that patterns are built from. In 1.5.1 you marked swings with one fixed rule; here two swing lows draw a trendline, and fixed rules stop you drawing it to fit.",
    hook: {
      prompt: "Ten analysts draw support and resistance on the same chart. How often do their levels match?",
      control: {
        kind: "choice",
        choices: [
          { id: "most", label: "Most of the time" },
          { id: "half", label: "About half the time" },
          { id: "rarely", label: "Rarely" },
        ],
        answer: "rarely",
      },
      compare: "You picked {yours}. When Carol Osler compared the levels that currency firms published, they agreed only about 30% of the time.",
      concept: "trendlines-and-channels",
    },
    learn: [
      {
        kind: "explain",
        title: "Two points draw it, a third confirms",
        text: "A [[trendline]] joins swing lows in an uptrend, or swing highs in a downtrend. Two lows draw it, and the second must be higher than the first. A third low that touches it confirms it. Space the points reasonably, don't force the line through candles, and distrust steep lines: the steeper the line, the sooner any pause breaks it.",
        figure: {
          kind: "chart",
          chart: { candles: TL1.slice(0, 24) },
          steps: [
            {
              text: "Two swing lows draw the line: 100.00 on candle 4 and 101.00 on candle 12.",
              layers: [line(3, 100, 11, 101, 3, 23), mark(3, "low", "100.00"), mark(11, "low", "101.00")],
            },
            { text: "Candle 20's low, 102.00, lands on the line. That third touch confirms it.", layers: [mark(19, "low", "102.00", "accent")] },
          ],
        },
      },
      {
        kind: "hotspot",
        title: "Wicks draw, closes break",
        prompt: "The same line, a few candles later. Tap the first candle that closed under it.",
        chart: { candles: TL1.slice(0, 28), layers: [line(3, 100, 11, 101, 3, 27)] },
        zones: [
          { id: "c27", label: "Candle 27", index: 26 },
          { id: "c20", label: "Candle 20", index: 19, feedback: "Candle 20's low reached the line, but it closed above it. That's a touch, not a break." },
          { id: "c24", label: "Candle 24", index: 23, feedback: "Candle 24 is a swing high, the top of a rise. An uptrend line runs under the lows." },
          { id: "c28", label: "Candle 28", index: 27, feedback: "Candle 28 closed under the line too, but candle 27 got there first." },
        ],
        answer: "c27",
        correct: "Candle 27 closed at 102.77, under the line. Draw lines on wicks; judge breaks on closes.",
        concept: "trendlines-and-channels",
      },
      {
        kind: "worked",
        title: "A channel, by numbers",
        lines: [
          "The line through 100.00 (candle 4) and 101.00 (candle 12) rises 1.00 ÷ 8 = 0.125 per candle.",
          "At candle 20 it's at 100.00 + 16 × 0.125 = 102.00: the third touch.",
          "A [[channel]] adds a parallel line through the highest swing high between the anchors: 101.50 on candle 8, 1.00 above the line.",
          "Upper channel line at candle 24 = ?",
        ],
        ask: {
          answer: 103.5,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 102.5, text: "That's the trendline itself at candle 24. Add the 1.00 gap to the parallel line." },
            { value: 103.4, text: "That's candle 24's high. The line sits at 102.50 + 1.00." },
          ],
          correct: "Right: 102.50 + 1.00 = 103.50. Candle 24's high, 103.40, stayed just inside.",
        },
        after: "Once drawn, a parallel channel stays fixed. If you find yourself redrawing it after every break, the line is describing your hopes, not the chart.",
        concept: "trendlines-and-channels",
      },
      {
        kind: "figure",
        title: "Many analysts, one chart",
        figure: {
          kind: "chart",
          chart: { candles: MANY },
          steps: [
            { text: "Line A through the lows of candles 4 and 10. Candle 16 closes under it.", layers: [line(3, 100, 9, 100.9, 3, 29, "down", "A")] },
            { text: "Line B through candles 4 and 16. It holds until candle 27 closes under it.", layers: [line(3, 100, 15, 101.5, 3, 29, "accent", "B")] },
            { text: "Line C through candles 16 and 28. No close under it at all.", layers: [line(15, 101.5, 27, 102.6, 15, 29, "up", "C")] },
            { text: "Three valid lines, three different calls. The rules narrow the choice; they don't make it objective." },
          ],
        },
        text: "Every line here follows the rules: swing lows, the second higher, no close under it between its anchors. Yet each tells a different story about the same candles.",
      },
      {
        kind: "figure",
        title: "Linear or log",
        figure: {
          kind: "chart",
          chart: { candles: LOG1 },
          steps: [
            { text: "A rise that compounds: each swing low is 50% above the last, 60.00, 90.00, 135.00.", layers: [mark(4, "low", "60.00"), mark(16, "low", "90.00"), mark(28, "low", "135.00")] },
            { text: "Linear scale: the line through 60.00 and 90.00. Later lows sit far above it.", layers: [{ kind: "line", values: LOG1_LINEAR, role: "neutral", label: "Linear line", dashed: true }] },
            { text: "Log scale: the same three lows sit on one straight line.", scale: "log", layers: [{ kind: "line", values: LOG1_LOG, role: "concept", label: "Log line", dashed: true }] },
            { text: "Candle 38 closes at 179.86, under the log line. The linear line shows no break at all.", layers: [mark(37, "close", "179.86", "down")] },
          ],
        },
        text: "The scale you draw on decides where a line breaks. Long rises that compound often fit better on a [[log-scale|log scale]], where equal percentage moves have equal heights.",
      },
      {
        kind: "reveal",
        title: "Freeze and play forward",
        prompt: "Your line stays fixed. Candle 28 has closed at 102.57, well under it. The last swing low is 102.00. What comes next?",
        chart: { candles: TL1, visible: 28, layers: [TL1_LINE, lvl(102, "concept", "Last swing low")] },
        choices: [
          { id: "down", label: "A downtrend: lower lows follow" },
          { id: "warning", label: "Can't tell yet: the break is a warning" },
          { id: "up", label: "The rise resumes along the line" },
        ],
        answer: "warning",
        after: "Price went sideways: lows of 102.40 and 102.55, never a close under 102.00. The line broke because the rise slowed. A close under the last swing low would have confirmed a change; it never came.",
        concept: "trendlines-and-channels",
      },
      {
        kind: "explain",
        title: "Regression channels redraw themselves",
        text: "A regression channel is a best-fit line through every close on screen, plus or minus a few standard deviations. Each new candle changes the fit, and with it the line's past values. A backtest that uses it reads candles that didn't exist yet, which is called look-ahead. Use it to describe a chart, never as a rule.",
        figure: {
          kind: "chart",
          chart: { candles: TL1 },
          steps: [
            { text: "Fitted to the first 30 closes, the line reads 103.26 at candle 30.", visible: 30, layers: [{ kind: "line", values: regression(TL1, 30), role: "neutral", label: "Fit on 30" }] },
            { text: "Refit with 40 closes, the same candle now reads 102.75. The past moved.", visible: 40, layers: [{ kind: "line", values: regression(TL1, 40), role: "concept", label: "Fit on 40" }] },
          ],
        },
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Evidence D, unproven: no robust study shows that trendline breaks predict reversals, and the drawing is subjective. Draw on wicks, judge breaks on closes, and confirm a break with a horizontal level or a close under the last swing low before you act on it.",
      },
    ],
    check: ["q-2.2.1-1", "q-2.2.1-2", "q-2.2.1-3"],
    recap: {
      takeaways: [
        "Two swing lows draw a trendline, the second higher; a third touch confirms it.",
        "A parallel channel stays fixed once drawn; a regression channel refits and reads future candles.",
        "A trendline break is a warning. Confirm it with a close under the last swing low.",
      ],
      next: "Next, 2.2.2: the anatomy every chart pattern shares, from prior trend to breakout filter and scaled target.",
    },
  },
};

// ─── 2.2.2 · Anatomy of a chart pattern ────────────────────────────────────

const L_2_2_2: Lesson = {
  id: "2.2.2",
  title: "Anatomy of a chart pattern",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Every chart pattern has the same eight parts; confirm its breakout with a filter and scale its target by how often it was reached.",
  objectives: [
    "Name the eight parts of any chart pattern, from the prior trend to what happens after the breakout.",
    "Confirm a breakout with a close beyond the boundary, and compare a 3% filter with an ATR filter on LABX.",
    "Calculate a pattern target from its height, scaled by the share of past patterns that reached the full target.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
    { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
  ],
  script: {
    unit: "2.2",
    courseId: "2.2.2",
    bridge: "In 2.2.1 lines drew the trend, and a break was a warning to confirm. Patterns are built from such lines. Here each gets the same eight parts, a filter for the breakouts of 1.5.4, and a target weighed against risk as in 1.4.5.",
    hook: {
      prompt: "Textbooks project a head-and-shoulders top's full height below the neckline. How often did price actually get there?",
      control: { kind: "slider", min: 0, max: 100, step: 1, unit: "%", start: 80, answer: 51, tolerance: 8 },
      compare: "You guessed {yours}%. In Bulkowski's data, 51% of head-and-shoulders tops reached the full target. So scale the target.",
      concept: "pattern-target",
    },
    learn: [
      {
        kind: "figure",
        title: "Eight parts, one box",
        figure: {
          kind: "chart",
          chart: { candles: A1.slice(0, 34), volume: true },
          steps: [
            { text: "1 · Prior trend: LABX rises from 97.00 to 102.00. A pattern needs something to continue or reverse.", layers: [mark(2, "low", "97.00"), mark(12, "high", "102.00")] },
            { text: "2 · Boundaries: tops 102.00, 101.95, 102.00; bottoms 100.00 and 100.05. Three touches and two.", layers: A1_BOX },
            { text: "3 · Volume fades inside the box: 1,150 on the first top, 600 just before the breakout." },
            { text: "4 · Breakout: candle 34 closes at 102.45, above the top, on volume of 1,720.", layers: [mark(33, "close", "102.45", "accent")] },
          ],
        },
        text: "Bulkowski's anatomy fits every pattern in this unit. Here it is on a [[rectangle]], a box between two flat boundaries.",
        concept: "chart-pattern-anatomy",
      },
      {
        kind: "worked",
        title: "Scale the target",
        lines: [
          "A pattern 3.00 tall breaks down at 103.00.",
          "Full target: 103.00 − 3.00 = 100.00.",
          "Only 51% of such patterns reached it: the head-and-shoulders tops from the start.",
          "Scaled target: 103.00 − 3.00 × 0.51 = ?",
        ],
        ask: {
          answer: 101.47,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 100, text: "That's the full height. Scale it first: 3.00 × 0.51 = 1.53." },
            { value: 1.53, text: "That's the distance. Take it off the breakout level, 103.00." },
            { value: 104.53, text: "This breakout is downward: subtract the distance." },
          ],
          correct: "Right: 103.00 − 1.53 = 101.47.",
        },
        after: "Scaling turns the hit rate into a discount on the [[pattern-height|height]]. It isn't a promise: the rates come from US stocks on daily charts.",
        concept: "pattern-target",
      },
      {
        kind: "figure",
        title: "After the breakout",
        figure: {
          kind: "chart",
          chart: { candles: A1, volume: true, layers: A1_BOX },
          steps: [
            { text: "5 · Measure: the height, 2.00, projected from the breakout and scaled by the share that got there.", layers: [lvl(104, "neutral", "Full height")] },
            { text: "6 · Invalidation: a close back inside. The stop goes under the last swing low inside, 101.00.", layers: [mark(31, "low", "101.00", "down")] },
            { text: "7 · Throwback: price comes back to 102.05, just above the broken top, then rises to 103.75.", layers: [mark(38, "low", "102.05"), mark(43, "high", "103.75")] },
            { text: "8 · Context: trend length, location, height and volume shift the odds. Every published rate has a scope." },
          ],
        },
        text: "A [[throwback]] to the broken edge is common: Bulkowski counted one after 54–74% of breakouts, depending on the pattern, and it lowered their average results. Here price rose to 103.75, short of the full 104.00.",
        concept: "chart-pattern-anatomy",
      },
      {
        kind: "order",
        title: "In what order?",
        prompt: "Put the life of a pattern in order, from first to last.",
        items: [
          "A trend runs into the area",
          "Price bounces between two boundaries",
          "Volume fades inside the pattern",
          "A close breaks beyond a boundary, past the filter",
          "Price throws back to the broken edge",
          "The scaled target is reached, or a close back inside invalidates it",
        ],
        wrong: "Think in time: what has to exist before a breakout can happen, and what can only come after it?",
        explain: "Trend, boundaries, fading volume, a confirmed breakout, a throwback, then the outcome. Context sits over all of it.",
        concept: "chart-pattern-anatomy",
      },
      {
        kind: "figure",
        title: "Three closes above 104.00",
        figure: {
          kind: "chart",
          chart: { candles: F1 },
          steps: [
            { text: "Resistance near 104.00. Three closes above it: 104.05, 104.12 and 104.15.", layers: [lvl(104, "resistance", "104.00"), mark(14, "close", "104.05"), mark(24, "close", "104.12"), mark(33, "close", "104.15")] },
            { text: "The first two fell back inside on the very next candle. The third kept going." },
            { text: "ATR(14) is 0.40 on this chart. Filter levels: 104.10 at 0.25 × ATR, 104.20 at 0.5 × ATR.", layers: [lvl(104.1, "neutral", "0.25 ATR"), lvl(104.2, "concept", "0.5 ATR")] },
          ],
        },
        text: "A [[breakout-filter]] asks for more than a close beyond the level: a margin, a second close, or a gap through it. [[atr|ATR(14)]], the average range of the last 14 candles, sizes the margin to the market.",
        concept: "breakout-confirmation-filters",
      },
      {
        kind: "predict",
        title: "Pick the filter",
        prompt: "On this chart, which filter skipped both false breakouts and still entered the real one soonest?",
        control: {
          kind: "choice",
          choices: [
            { id: "close", label: "Any close beyond 104.00", feedback: "It took all three: two false breakouts, then the real one at 104.15." },
            { id: "quarter", label: "0.25 × ATR: a close above 104.10", feedback: "104.12 cleared 104.10, so the second false breakout got in." },
            { id: "half", label: "0.5 × ATR: a close above 104.20" },
            { id: "one", label: "1 × ATR: a close above 104.40", feedback: "It skipped both, but waited for 104.55, two candles after the real break." },
          ],
          answer: "half",
        },
        figure: {
          kind: "chart",
          chart: { candles: F1, layers: [lvl(104, "resistance", "104.00"), lvl(104.2, "concept", "0.5 ATR")] },
          steps: [{ text: "First close above 104.20: candle 35, at 104.32.", layers: [mark(34, "close", "104.32", "accent")] }],
        },
        reveal: "0.5 × ATR waited one candle and entered on the 104.32 close: 0.17 later than the first close beyond, with no false entries. On another chart another filter wins, and on a random walk no filter creates an edge. A filter only trades entry price for fewer signals.",
        concept: "breakout-confirmation-filters",
      },
      {
        kind: "worked",
        title: "3% or ATR?",
        lines: [
          "Breakout level 104.00. ATR(14) 0.40.",
          "3% filter: 104.00 × 1.03 = 107.12. That's 3.12 away, about 8 ATR.",
          "0.5 × ATR filter: 104.00 + 0.5 × 0.40 = ?",
        ],
        ask: {
          answer: 104.2,
          tolerance: 0.001,
          unit: "vUSD",
          feedback: [
            { value: 104.4, text: "That's a full ATR. Half of 0.40 is 0.20." },
            { value: 0.2, text: "That's the margin. Add it to the level: 104.00 + 0.20." },
          ],
          correct: "Right: 104.20, a margin sized to this market's candles.",
        },
        after: "The 3% rule was built for stocks on daily charts. On this 1-hour chart price never reached 107.12, so it confirmed nothing at all. An ATR margin scales with the candles.",
        concept: "breakout-confirmation-filters",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Evidence C, mixed. Lo, Mamaysky and Wang (2000) found that patterns carry some information, and warned that what detects an anomaly need not make profits. Bulkowski's rates measure perfect trades on US stocks, and his failure rates doubled in the 2000s. Read every rate as a base rate with a scope.",
      },
    ],
    task: {
      widget: "bracket-builder",
      goal: "The box broke out and you bought at 102.50. Put the stop under the last swing low inside the box, and the target at the height scaled by 78%.",
      data: { chart: { candles: A1.slice(0, 34), layers: A1_BOX }, entry: 102.5, units: 50 },
      start: { stop: 101.8, target: 104.0, units: 50 },
      locked: ["units"],
      success: {
        all: [
          { field: "stop", gte: 100.6 },
          { field: "stop", lte: 100.95 },
          { field: "target", gte: 103.51 },
          { field: "target", lte: 103.61 },
        ],
      },
      feedback: [
        { when: { field: "target", gte: 103.95 }, text: "{target:2} uses the full height. Upward breakouts from rectangles reached it 78% of the time: scale it, 2.00 × 0.78 = 1.56." },
        { when: { field: "target", gt: 103.61 }, text: "Above the scaled target. Measure 1.56 from the top of the box, 102.00, not from your entry." },
        { when: { field: "target", lt: 103.51 }, text: "Short of the scaled target. Measure 1.56 from the top of the box, 102.00." },
        { when: { field: "stop", gt: 100.95 }, text: "At {stop:2} the stop sits inside the box's normal swings. The last swing low inside is 101.00: go just under it." },
        { when: { field: "stop", lt: 100.6 }, text: "At {stop:2} you risk {stopDistance:2} per unit. Once price is under 101.00, the breakout idea is already wrong." },
      ],
      correct: "Stop {stop:2}, target {target:2}: {rr:2}R. Here the scaled target pays less than the risk. Check that before taking any pattern.",
      hints: [
        "The box runs from 100.00 to 102.00. Where did the last dip inside it turn up?",
        "The last swing low inside is 101.00. The height is 2.00, and 78% of it is 1.56.",
        "Stop at 100.90, just under 101.00. Target 102.00 + 1.56 = 103.56.",
      ],
      showMe: { stop: 100.9, target: 103.56 },
      concept: "pattern-target",
    },
    check: ["q-2.2.2-1", "q-2.2.2-2", "q-2.2.2-3"],
    recap: {
      takeaways: [
        "Every pattern: prior trend, boundaries, volume, breakout, target, invalidation, throwback, context.",
        "Confirm with a close past a filter. On LABX 1H an ATR margin fits; 3% doesn't.",
        "Scale the target: height × the share that reached it. Then check the R:R.",
      ],
      next: "Next, 2.2.3: double tops and bottoms, the first full pattern taken through all eight parts.",
    },
  },
};

// ─── 2.2.3 · Double tops and bottoms ───────────────────────────────────────

const L_2_2_3: Lesson = {
  id: "2.2.3",
  title: "Double tops and bottoms",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A double top or bottom exists only once price closes beyond the level between its two extremes; early and confirmed entries compare by expectancy.",
  objectives: [
    "Identify a double top or bottom and its confirmation level: the valley or the peak between the two extremes.",
    "Compare entering at the second peak with entering on confirmation, in hit rate and in R.",
    "Calculate the scaled target of a confirmed double bottom.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "reversal", label: "Arena: reversal" },
    { kind: "mission", ref: "M04", label: "Define Your Risk" },
  ],
  script: {
    unit: "2.2",
    courseId: "2.2.3",
    bridge: "In 2.2.2 every pattern got eight parts, a filter and a scaled target. Now the first full one: a double top exists only after a close under the valley, like 2.1.3's confirming close. Early and confirmed entries are compared by 1.4.5's expectancy.",
    hook: {
      prompt: "Two peaks at almost the same price. No close below the valley yet. How often does price keep rising instead?",
      control: { kind: "slider", min: 0, max: 100, step: 1, unit: "%", start: 20, answer: 60, tolerance: 8 },
      compare: "You guessed {yours}%. In Bulkowski's data about 60% of twin peaks without a confirming close kept rising. Until the valley breaks, it isn't a double top.",
      concept: "double-tops-and-bottoms",
    },
    learn: [
      {
        kind: "explain",
        title: "Confirmed by the level between",
        text: "A [[double-top]] is two peaks near the same price with a valley between them. The valley is the confirmation level: the pattern exists only after a close below it. A [[double-bottom]] is the mirror: two lows near the same price, confirmed by a close above the peak between them.",
        figure: {
          kind: "chart",
          chart: { candles: DT1 },
          steps: [
            { text: "Two peaks: 105.00 on candle 9 and 104.90 on candle 21.", visible: 22, layers: [mark(8, "high", "105.00"), mark(20, "high", "104.90")] },
            { text: "The valley between them, 102.00, is the confirmation level.", layers: [lvl(102, "concept", "Confirmation 102.00")] },
            { text: "Candle 27 closes at 101.83, under 102.00. Only now is it a double top.", visible: 27, layers: [mark(26, "close", "101.83", "down")] },
            { text: "A pullback to 101.95 stays under the level, then price falls to 99.90.", visible: 38, layers: [mark(30, "high", "101.95"), mark(35, "low", "99.90")] },
          ],
        },
      },
      {
        kind: "reveal",
        title: "Twin peaks, no confirmation",
        prompt: "Two peaks: 104.00 and 103.95. The valley between them is 102.50, and no candle has closed under it. What happens next?",
        chart: { candles: DT2, visible: 21, layers: [lvl(102.5, "concept", "Valley 102.50")] },
        choices: [
          { id: "down", label: "It breaks the valley: a double top" },
          { id: "wait", label: "No way to say until a close under 102.50" },
        ],
        answer: "wait",
        after: "No close under 102.50 ever came. Candle 25 closed at 104.32, above both peaks, and the high reached 105.50. Twin peaks without a confirming close are just a range.",
        concept: "double-tops-and-bottoms",
      },
      {
        kind: "predict",
        title: "Find the confirmation level",
        prompt: "A double bottom in the making: lows of 96.00 and 96.20. Tap the price level that would confirm it.",
        control: {
          kind: "tap",
          chart: { candles: DB1.slice(0, 25) },
          zones: [
            { id: "peak", label: "98.90 to 99.10", from: 98.9, to: 99.1, feedback: "Right: the peak between the lows, 99.00. A close above it confirms the pattern." },
            { id: "lows", label: "Below 96.40", from: 90, to: 96.39, feedback: "That's where the lows are. Confirmation comes from the other side: a close above the peak between them, 99.00." },
            { id: "inside", label: "96.40 to 98.89", from: 96.4, to: 98.89, feedback: "A close there is still inside the pattern. The level to beat is the peak between the lows, 99.00." },
            { id: "above", label: "Above 99.10", from: 99.11, to: 110, feedback: "That's past the level. The confirmation level itself is the peak between the lows, 99.00." },
          ],
          answer: "peak",
        },
        figure: {
          kind: "chart",
          chart: { candles: DB1, layers: [lvl(99, "concept", "Confirmation 99.00")] },
          steps: [{ text: "Candle 26 closes at 99.20, above 99.00: the double bottom is confirmed.", layers: [mark(25, "close", "99.20", "accent")] }],
        },
        reveal: "A double bottom's confirmation level is the peak between its lows, 99.00 here. Candle 26 closed at 99.20, above it.",
        concept: "double-tops-and-bottoms",
      },
      {
        kind: "match",
        title: "Adam or Eve?",
        prompt: "Bulkowski names each peak or bottom by its shape. Sort them: Adam or Eve?",
        pairs: [
          { left: "Narrow and pointed, built in one or two candles", right: "Adam" },
          { left: "A single long wick at the extreme", right: "Adam" },
          { left: "Wide and rounded, built over several candles", right: "Eve" },
          { left: "Several candles with similar highs, like a dome", right: "Eve" },
        ],
        correct: "Adam is narrow and spiky, Eve wide and rounded. His tables split the patterns by shape: Eve & Eve bottoms ranked 5th of 39, with 12% failures.",
        concept: "double-tops-and-bottoms",
      },
      {
        kind: "worked",
        title: "The double top's target",
        lines: [
          "Peaks 105.00 and 104.90, valley 102.00. Height: 105.00 − 102.00 = 3.00.",
          "Full target: 102.00 − 3.00 = 99.00.",
          "Adam & Adam double tops reached the full target 64% of the time.",
          "Scaled target: 102.00 − 3.00 × 0.64 = ?",
        ],
        ask: {
          answer: 100.08,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 99, text: "That's the full height. Scale it: 3.00 × 0.64 = 1.92." },
            { value: 1.92, text: "That's the distance. Subtract it from the valley, 102.00." },
            { value: 103.92, text: "A top breaks down: subtract the distance from 102.00." },
          ],
          correct: "Right: 102.00 − 1.92 = 100.08. On the chart, price fell to 99.90.",
        },
        after: "The height runs from the higher peak to the valley, and the target is measured from the valley, where the pattern confirmed.",
        concept: "pattern-target",
      },
      {
        kind: "worked",
        title: "Early or confirmed?",
        lines: [
          "Early: sell at 104.33 as candle 22 turns down from the second peak. Stop 105.10: risk 0.77. A win at 100.08 pays 4.25, about 5.5R before costs.",
          "Confirmed: sell at 101.78 after candle 27 closes under 102.00. Same stop: risk 3.32. The same target pays 1.70, about 0.5R before costs.",
          "The early entry pays far more per win but loses more often: without confirmation, most twin peaks kept rising.",
          "Say a test gave: confirmed wins 70% at +0.5R, early wins 25% at +4R, every loss −1R. Early entry's expectancy = ?",
        ],
        ask: {
          answer: 0.25,
          tolerance: 0.01,
          unit: "R",
          feedback: [
            { value: 1, text: "That's the wins only. Take off the losses: 75% at −1R." },
            { value: 0.05, text: "That's the confirmed entry: 0.70 × 0.5 − 0.30. Now the early one: 0.25 × 4 − 0.75." },
          ],
          correct: "Right: 0.25 × 4 − 0.75 = +0.25R, against +0.05R for the confirmed entry. These test numbers are made up.",
        },
        after: "A higher win rate isn't the better entry by default. Compare entries by expectancy after costs, on a test of your own rules.",
        concept: "anticipation-vs-confirmation",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Evidence C, mixed. Bulkowski: Adam & Adam double tops failed 25% of the time, reached the full target 64% and ranked 19th of 36. Eve & Eve bottoms: 12%, 65%, 5th of 39. On a random walk twin peaks are common, and after confirmation what follows is the base rate.",
      },
    ],
    task: {
      widget: "bracket-builder",
      goal: "Candle 26 confirmed the double bottom and you bought at 99.25. Put the stop just under the lower low, and the target at the height scaled by 65%.",
      data: { chart: { candles: DB1, layers: [lvl(99, "resistance", "Peak 99.00")] }, entry: 99.25, units: 30 },
      start: { stop: 98.5, target: 102.0, units: 30 },
      locked: ["units"],
      success: {
        all: [
          { field: "stop", gte: 95.5 },
          { field: "stop", lte: 95.95 },
          { field: "target", gte: 100.9 },
          { field: "target", lte: 101.0 },
        ],
      },
      feedback: [
        { when: { field: "target", gte: 101.95 }, text: "{target:2} is the full height, 99.00 + 3.00. Eve & Eve bottoms reached it 65% of the time: scale it." },
        { when: { field: "target", gt: 101.0 }, text: "Above the scaled target. Measure from the peak, 99.00: 3.00 × 0.65 = 1.95." },
        { when: { field: "target", lt: 100.9 }, text: "Short of the scaled target: 99.00 + 3.00 × 0.65." },
        { when: { field: "stop", gt: 95.95 }, text: "At {stop:2} the stop sits above the lower low, 96.00. The pattern isn't wrong until price goes under it." },
        { when: { field: "stop", lt: 95.5 }, text: "At {stop:2} you risk {stopDistance:2} per unit, more than the pattern needs. Just under 96.00 is enough." },
      ],
      correct: "Stop {stop:2}, target {target:2}: {rr:2}R. A stop beyond the whole pattern makes the R:R small. Some traders skip such trades; that's a valid plan too.",
      hints: [
        "Height: the peak between the lows minus the lower low.",
        "Height 99.00 − 96.00 = 3.00; scaled by 65%, 1.95.",
        "Stop 95.90, just under 96.00. Target 99.00 + 1.95 = 100.95.",
      ],
      showMe: { stop: 95.9, target: 100.95 },
      concept: "double-tops-and-bottoms",
    },
    check: ["q-2.2.3-1", "q-2.2.3-2", "q-2.2.3-3"],
    recap: {
      takeaways: [
        "A double top exists only after a close under the valley; a double bottom, above the peak.",
        "Early entries pay more per win but win less often. Compare them by expectancy, not win rate.",
        "Scaled target: height × hit rate from the confirmation level, here 99.00 + 1.95 = 100.95.",
      ],
      next: "Next, 2.2.4: head and shoulders, three peaks and a neckline that may slope.",
    },
  },
};

// ─── 2.2.4 · Head and shoulders ────────────────────────────────────────────

const L_2_2_4: Lesson = {
  id: "2.2.4",
  title: "Head and shoulders",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Label the shoulders and the head, draw the neckline through the lows between them, then confirm and measure by the rules.",
  objectives: [
    "Label the left shoulder, head and right shoulder, and draw the neckline through the two lows between them.",
    "Apply the confirmation rule for an up-sloping and for a down-sloping neckline.",
    "Calculate the full and the scaled target for a top and for an inverse pattern.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "reversal", label: "Arena: reversal" },
    { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
  ],
  script: {
    unit: "2.2",
    courseId: "2.2.4",
    bridge: "In 2.2.3 two peaks became a double top only after a close under the valley. Head and shoulders has three peaks, the middle one highest, and a neckline through the lows between them, drawn by 2.2.1's rules. When it slopes, the confirmation moves.",
    hook: {
      prompt: "Three peaks, the middle one highest, and price is still above the lows between them. Is this a head-and-shoulders top?",
      figure: { kind: "chart", chart: { candles: HS1.slice(0, 29) }, steps: [{ text: "Peaks 104.80, 106.00 and 104.70. The lows between them: 103.00 and 103.00." }] },
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Yes" },
          { id: "notyet", label: "Not yet" },
          { id: "no", label: "No" },
        ],
        answer: "notyet",
      },
      compare: "You picked {yours}. Without a close under the neckline it's three peaks, not a pattern. Candle 31 later closed at 102.57, under it.",
      concept: "head-and-shoulders",
    },
    learn: [
      {
        kind: "hotspot",
        title: "Name the parts",
        prompt: "Three peaks: two shoulders and a head. Tap the right shoulder.",
        chart: { candles: HS1.slice(0, 29) },
        zones: [
          { id: "rs", label: "Candle 26", index: 25 },
          { id: "ls", label: "Candle 8", index: 7, feedback: "That's the left shoulder, the first peak, at 104.80." },
          { id: "head", label: "Candle 17", index: 16, feedback: "That's the head, the highest peak, at 106.00." },
          { id: "low", label: "Candle 22", index: 21, feedback: "That's a low between the head and the right shoulder: one end of the neckline." },
        ],
        answer: "rs",
        correct: "Right: candle 26, at 104.70. The shoulders, 104.80 and 104.70, peak at almost the same price on either side of the 106.00 head.",
        concept: "head-and-shoulders",
      },
      {
        kind: "explain",
        title: "The neckline",
        text: "A [[head-and-shoulders]] top has three peaks after a rise, the middle one highest. The [[neckline]] runs through the two lows between the peaks, and a close under it confirms the top. Bulkowski adds proportion: shoulders at similar heights and distances from the head, and volume usually falling from left to right.",
        figure: {
          kind: "chart",
          chart: { candles: HS1.slice(0, 29) },
          steps: [{ text: "Neckline through the two lows: 103.00 on candle 12 and 103.00 on candle 22.", layers: [lvl(103, "concept", "Neckline 103.00"), mark(11, "low", "103.00"), mark(21, "low", "103.00")] }],
        },
      },
      {
        kind: "reveal",
        title: "Does the neckline give?",
        prompt: "Candle 29 closed at 103.42, just above the neckline at 103.00. What happens next?",
        chart: { candles: HS1, visible: 29, layers: [lvl(103, "concept", "Neckline 103.00")] },
        choices: [
          { id: "break", label: "A close under 103.00" },
          { id: "hold", label: "The neckline holds" },
        ],
        after: "Candle 31 closed at 102.57, under the neckline: confirmed. A throwback to 102.95 stalled under it, then the fall reached 101.30. This one worked; in Bulkowski's data 19% of confirmed tops failed.",
        concept: "head-and-shoulders",
      },
      {
        kind: "predict",
        title: "When the neckline slopes",
        prompt: "This neckline slopes down, through lows of 103.40 and then 102.80. Which close confirms the top?",
        control: {
          kind: "choice",
          choices: [
            { id: "line", label: "A close under the sloping line, wherever it has got to" },
            { id: "low", label: "A close under 102.80, the low before the right shoulder" },
            { id: "first", label: "A close under 103.40, the low before the head" },
          ],
          answer: "low",
        },
        figure: {
          kind: "chart",
          chart: { candles: HS2 },
          steps: [
            { text: "Neckline through 103.40 and 102.80, sloping down.", layers: [line(11, 103.4, 21, 102.8, 11, 33, "concept", "Neckline")] },
            { text: "Candle 30 closes at 102.36, under 102.80: confirmed by Bulkowski's rule.", layers: [lvl(102.8, "neutral", "Right low 102.80"), mark(29, "close", "102.36", "accent")] },
            { text: "Candle 31 is the first close under the sloping line itself, at 101.76.", layers: [mark(30, "close", "101.76", "down")] },
          ],
        },
        reveal: "With a down-sloping neckline, Bulkowski confirms on a close under the right-hand low. Here that came on candle 30, at 102.36; the sloping line came a candle later, 0.60 lower. With an up-sloping neckline the line itself is crossed first, so it confirms.",
        concept: "head-and-shoulders",
      },
      {
        kind: "worked",
        title: "Full and scaled targets",
        lines: [
          "Top: head 106.00, neckline 103.00. Height 3.00.",
          "Full target 103.00 − 3.00 = 100.00. Scaled by 51%: 103.00 − 1.53 = 101.47. The fall above reached 101.30.",
          "Inverse: head 94.00, neckline 97.00. Height 3.00. Inverse patterns reached the full target 71% of the time.",
          "Scaled target of the inverse: 97.00 + 3.00 × 0.71 = ?",
        ],
        ask: {
          answer: 99.13,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 100, text: "That's the full height. Scale it: 3.00 × 0.71 = 2.13." },
            { value: 2.13, text: "That's the distance. Add it to the neckline, 97.00." },
            { value: 98.53, text: "That uses the top's 51%. Inverse patterns reached the target 71% of the time." },
          ],
          correct: "Right: 97.00 + 2.13 = 99.13.",
        },
        after: "Measure from the head to the neckline under it, and project from the breakout. With a sloping neckline, use the line's value under the head.",
        concept: "pattern-target",
      },
      {
        kind: "figure",
        title: "Head and shoulders in noise",
        figure: {
          kind: "chart",
          chart: { candles: RWALK },
          steps: [
            { text: "A random walk: each close is the last one plus a random step. Nothing here predicts anything." },
            {
              text: "Yet a scanner finds a head and shoulders: 103.13, 103.77, 103.13 over lows of 102.29 and 102.30.",
              layers: [mark(36, "high", "LS"), mark(42, "high", "H"), mark(51, "high", "RS"), line(37, 102.29, 48, 102.3, 37, 59, "concept", "Neckline")],
            },
            { text: "Candle 55 closes under the neckline, and price falls. In a random walk, a rise was just as likely.", layers: [mark(54, "close", "102.25", "down")] },
          ],
        },
        text: "Lo, Mamaysky and Wang turned the shape into a rule a computer can check: five turning points, the middle peak highest, the shoulders and the lows level within a tolerance. Random data passes that rule too, so the shape alone is not evidence.",
        concept: "head-and-shoulders",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Evidence C, mixed. In Bulkowski's data, tops failed 19% of the time and reached the full target 51%, rank 9 of 36; inverse patterns 11% and 71%. Lo, Mamaysky and Wang found the shape added information in US stocks, 1962–1996. Chang and Osler found it profitable in 2 of 6 currency pairs.",
      },
    ],
    task: {
      widget: "level-drawer",
      goal: "Draw the neckline of this head-and-shoulders top: a thin band through both lows between the peaks.",
      data: { chart: { candles: HS3 } },
      start: { role: "resistance", bandLow: 103.6, bandHigh: 103.85 },
      success: {
        all: [
          { field: "role", eq: "support" },
          { field: "touches", gte: 2 },
          { field: "bandLow", gte: 101.95 },
          { field: "bandHigh", lte: 102.3 },
          { field: "height", lte: 0.3 },
        ],
      },
      feedback: [
        { when: { field: "role", eq: "resistance" }, text: "That band sits on the peaks. The shoulders line up too, but the neckline runs through the lows between the peaks." },
        { when: { field: "touches", lt: 2 }, text: "Only {touches} of the two lows sits in your band. They're at 102.10 and 102.15." },
        { when: { field: "height", gt: 0.3 }, text: "A neckline is a line: keep the band under 0.30 tall. Yours is {height:2}." },
        { when: { field: "bandLow", lt: 101.95 }, text: "Your band reaches below the neckline lows. Tighten it around 102.10 and 102.15." },
      ],
      correct: "Neckline at {bandLow:2}–{bandHigh:2}, through 102.10 and 102.15. A close under it would confirm the top; none has come yet.",
      hints: [
        "Switch the band to support: a neckline joins lows, not peaks.",
        "Find the two lows between the three peaks.",
        "The lows are 102.10 (candle 12) and 102.15 (candle 22). A band from 102.05 to 102.20 covers both.",
      ],
      showMe: { role: "support", bandLow: 102.05, bandHigh: 102.2 },
      concept: "head-and-shoulders",
    },
    check: ["q-2.2.4-1", "q-2.2.4-2", "q-2.2.4-3"],
    recap: {
      takeaways: [
        "Left shoulder, head, right shoulder; the neckline joins the two lows between the peaks.",
        "Confirm on a close under the neckline; if it slopes down, under the right-hand low.",
        "Target: head to neckline, × 51% for tops and × 71% for inverse patterns.",
      ],
      next: "Next, 2.2.5: triple tops, triple bottoms and rectangles, ranges that stay ranges until a close beyond them.",
    },
  },
};

// ─── 2.2.5 · Triple tops, triple bottoms and rectangles ───────────────────

const L_2_2_5: Lesson = {
  id: "2.2.5",
  title: "Triple tops, triple bottoms and rectangles",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A triple top is a range until a close under its lowest valley; a rectangle is measured both ways, and a partial move only tilts the odds.",
  objectives: [
    "Explain why a triple top is only a range until price closes below its lowest valley.",
    "Draw a rectangle with at least three touches on one boundary and two on the other.",
    "Use a partial rise or partial decline inside a rectangle as a tilt in the odds, not a certainty.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
  ],
  script: {
    unit: "2.2",
    courseId: "2.2.5",
    bridge: "In 2.2.4 the middle of three peaks stood highest. Put all three at one price and it's a triple top: like 2.2.3's double top, only a range until a close under the lowest valley. A rectangle is that box between 1.5.4's support and resistance.",
    hook: {
      prompt: "Price has touched the same ceiling three times. Which way will it break out?",
      figure: { kind: "chart", chart: { candles: TT1.slice(0, 27) }, steps: [{ text: "Highs: 102.00, 101.95 and 102.00. Lows: 100.05 and 100.00." }] },
      control: {
        kind: "choice",
        choices: [
          { id: "up", label: "Up" },
          { id: "down", label: "Down" },
          { id: "cant", label: "Can't know yet" },
        ],
        answer: "cant",
      },
      compare: "You picked {yours}. In Bulkowski's data, rectangles that formed after a rise broke out upward 63% of the time. This one broke down. Three touches don't pick a side.",
      concept: "rectangles-and-triples",
    },
    learn: [
      {
        kind: "explain",
        title: "A range until it breaks",
        text: "A [[triple-top]] is three peaks near one price. Until a close under the lowest valley between them, it's only a range, and many such ranges break out upward. A [[rectangle]] names the same box neutrally: flat [[support]] and [[resistance]], with at least three touches on one side and two on the other.",
        figure: {
          kind: "chart",
          chart: { candles: TT1.slice(0, 30) },
          steps: [
            { text: "Three tops: 102.00, 101.95 and 102.00.", layers: [mark(8, "high", "102.00"), mark(16, "high", "101.95"), mark(24, "high", "102.00")] },
            { text: "Until a close under the lowest valley, this is a rectangle: a range with two edges." },
          ],
        },
      },
      {
        kind: "predict",
        title: "Find the trigger",
        prompt: "Tap the price level whose break would confirm a triple top.",
        control: {
          kind: "tap",
          chart: { candles: TT1.slice(0, 30) },
          zones: [
            { id: "floor", label: "99.90 to 100.15", from: 99.9, to: 100.15, feedback: "Right: the lowest valley, 100.00. A close under it turns the range into a triple top." },
            { id: "under", label: "Below 99.90", from: 90, to: 99.89, feedback: "Lower than needed. The trigger is the lowest valley itself, 100.00." },
            { id: "middle", label: "100.16 to 101.80", from: 100.16, to: 101.8, feedback: "Price swung through here again and again. The trigger is the lowest valley, 100.00." },
            { id: "ceiling", label: "Above 101.80", from: 101.81, to: 110, feedback: "That's the ceiling. A triple top confirms on the other side: a close under the lowest valley." },
          ],
          answer: "floor",
        },
        figure: {
          kind: "chart",
          chart: { candles: TT1.slice(0, 30) },
          steps: [
            {
              text: "Floor: 100.05, 100.00 and 100.10. The lowest valley, 100.00, is the trigger.",
              layers: [{ kind: "zone", from: 100.0, to: 100.1, role: "support", label: "Floor" }, mark(12, "low", "100.05"), mark(20, "low", "100.00"), mark(28, "low", "100.10")],
            },
          ],
        },
        reveal: "The lowest valley is 100.00, on candle 21. With 100.05 and 100.10 it makes a floor: three touches on each side of the box.",
        concept: "rectangles-and-triples",
      },
      {
        kind: "reveal",
        title: "A partial rise",
        prompt: "From the floor, price rose to 101.20 and turned down, well short of the ceiling. Which way does the box break?",
        chart: {
          candles: TT1,
          visible: 34,
          layers: [{ kind: "zone", from: 101.95, to: 102.0, role: "resistance", label: "Ceiling" }, { kind: "zone", from: 100.0, to: 100.1, role: "support", label: "Floor" }, mark(31, "high", "101.20")],
        },
        choices: [
          { id: "up", label: "Up" },
          { id: "down", label: "Down" },
          { id: "lean", label: "Down is likelier, not certain" },
        ],
        answer: "lean",
        after: "It broke down: candle 36 closed at 99.64, under 100.00, confirming the triple top. In Bulkowski's data, after a [[partial-rise]] the breakout went down 75% of the time; after a partial decline, up 79%. One case in four or five went the other way.",
        concept: "rectangles-and-triples",
      },
      {
        kind: "worked",
        title: "Measure both ways",
        lines: [
          "Box: 100.00 to 102.00. Height 2.00.",
          "Upward breakouts reached the full target 78% of the time: 102.00 + 1.56 = 103.56.",
          "Downward breakouts only 54% of the time: 2.00 × 0.54 = 1.08.",
          "Downward scaled target: 100.00 − 1.08 = ?",
        ],
        ask: {
          answer: 98.92,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 98, text: "That's the full height. Downward breakouts reached it only 54% of the time." },
            { value: 1.08, text: "That's the distance. Subtract it from the floor, 100.00." },
            { value: 98.44, text: "That uses the upward 78%. Downward breakouts reached the target 54% of the time." },
          ],
          correct: "Right: 98.92. The fall reached 98.80, just past it.",
        },
        after: "Same box, two targets: the data scales each side differently. Measured as a triple top, the same shape has its own rate, 49%.",
        concept: "pattern-target",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Evidence C, mixed. Triple tops failed 25% of the time and reached the target 49%, rank 24 of 36; triple bottoms 13% and 74%. Rectangles failed 15% upward and 34% downward. The partial-rise signal is one of the few quantified tilts, but it comes from the same data set. Lean on it; don't rely on it.",
      },
    ],
    task: {
      widget: "level-drawer",
      goal: "Draw the ceiling of this box: a resistance band that holds at least three swing highs, 0.10 to 0.40 tall.",
      data: { chart: { candles: TT1.slice(0, 30) } },
      start: { role: "resistance", bandLow: 100.6, bandHigh: 100.9 },
      success: {
        all: [
          { field: "role", eq: "resistance" },
          { field: "touches", gte: 3 },
          { field: "height", gte: 0.1 },
          { field: "height", lte: 0.4 },
        ],
      },
      feedback: [
        { when: { field: "role", eq: "support" }, text: "That's the floor. For this task, mark the ceiling, where three rises stalled." },
        { when: { field: "height", lt: 0.1 }, text: "A band thinner than 0.10 is a line. Widen it to hold the touches." },
        { when: { field: "height", gt: 0.4 }, text: "That band is {height:2} tall and catches too much. Tighten it around the three tops." },
        { when: { field: "touches", lt: 3 }, text: "{touches} of the three tops sit in your band. They're between 101.95 and 102.00." },
      ],
      correct: "{touches} touches between {bandLow:2} and {bandHigh:2}, and three on the floor near 100.00: a rectangle, still neutral.",
      hints: ["Find where the three rises stalled.", "The tops are 102.00, 101.95 and 102.00.", "A band from 101.90 to 102.05 holds all three."],
      showMe: { role: "resistance", bandLow: 101.9, bandHigh: 102.05 },
      concept: "rectangles-and-triples",
    },
    check: ["q-2.2.5-1", "q-2.2.5-2", "q-2.2.5-3"],
    recap: {
      takeaways: [
        "A triple top is a range until a close under its lowest valley.",
        "A rectangle needs three touches on one side and two on the other; measure it both ways.",
        "Partial rises and declines tilt the odds; about a fifth to a quarter break the other way.",
      ],
      next: "Next, 2.2.6: triangles, where the boundaries converge and the breakout bias comes from data.",
    },
  },
};

// ─── 2.2.6 · Triangles ─────────────────────────────────────────────────────

const TRI_CARDS: Cards = [
  {
    id: "c1",
    text: "Swing highs 104.00, 104.02, 103.98. Swing lows 100.00, 101.10, 102.20.",
    answer: "asc",
    correct: "Flat top, rising lows: ascending. In Bulkowski's data, 63% broke out upward.",
    rationales: {
      desc: "Descending needs a flat bottom. Here the lows rise: 100.00, 101.10, 102.20.",
      sym: "Symmetrical needs falling highs. These highs are flat, within 0.04 of each other.",
      none: "The lines converge, flat top over a rising bottom. That's a triangle.",
    },
  },
  {
    id: "c2",
    text: "Swing highs 105.00, 104.10, 103.20. Swing lows 101.00, 101.03, 100.98.",
    answer: "desc",
    correct: "Flat bottom, falling highs: descending. Despite its bearish reputation, 53% broke out upward.",
    rationales: {
      asc: "Ascending needs a flat top. Here the highs fall: 105.00, 104.10, 103.20.",
      sym: "Symmetrical needs rising lows. These lows are flat, within 0.05.",
      none: "The lines converge, falling highs over a flat bottom. That's a triangle.",
    },
  },
  {
    id: "c3",
    text: "Swing highs 105.00, 104.20, 103.40. Swing lows 100.00, 100.80, 101.60.",
    answer: "sym",
    correct: "Highs fall and lows rise toward each other: symmetrical. 60% broke out upward, and it ranked among the weakest patterns.",
    rationales: {
      asc: "Ascending has a flat top. These highs fall 0.80 a swing.",
      desc: "Descending has a flat bottom. These lows rise 0.80 a swing.",
      none: "Falling highs and rising lows converge: that's a triangle.",
    },
  },
  {
    id: "c4",
    text: "Swing highs 103.00, 103.80, 104.60. Swing lows 101.00, 100.20, 99.40.",
    answer: "none",
    correct: "Highs rise and lows fall: the lines diverge. That's a broadening formation, not a triangle.",
    rationales: {
      asc: "Neither line is flat, and they move apart: rising highs, falling lows.",
      desc: "Neither line is flat, and they move apart: rising highs, falling lows.",
      sym: "The slopes are opposite, but they spread apart instead of meeting.",
    },
  },
  {
    id: "c5",
    text: "Swing highs 102.00, 103.00, 104.00. Swing lows 100.00, 101.00, 102.00.",
    answer: "none",
    correct: "Both lines rise 1.00 a swing: parallel, a channel. Parallel lines never reach an apex.",
    rationales: {
      asc: "Ascending has a flat top. Here the highs rise as fast as the lows.",
      desc: "Descending has a flat bottom and falling highs. Both lines here rise.",
      sym: "Symmetrical lines slope toward each other. These rise together, parallel.",
    },
  },
];
const TRI_OPTIONS = [
  { id: "asc", label: "Ascending" },
  { id: "desc", label: "Descending" },
  { id: "sym", label: "Symmetrical" },
  { id: "none", label: "Not a triangle" },
];

const L_2_2_6: Lesson = {
  id: "2.2.6",
  title: "Triangles",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Name triangles by their slopes, take each one's breakout bias from the data, and distrust breakouts near the apex.",
  objectives: [
    "Classify ascending, descending and symmetrical triangles by the slopes of their two boundaries.",
    "State each triangle's breakout bias from the data, including where the descending triangle contradicts the textbook.",
    "Explain why breakouts close to the apex deserve less trust.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
    { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
  ],
  script: {
    unit: "2.2",
    courseId: "2.2.6",
    bridge: "In 2.2.5 the boundaries were flat, and a rectangle could break either way. Tilt one or both lines, drawn by 2.2.1's rules, and they converge into a triangle. The anatomy of 2.2.2 still applies, but the breakout bias comes from data, not the shape.",
    hook: {
      prompt: "Descending triangles are taught as bearish. Guess the share that break out upward.",
      control: { kind: "slider", min: 0, max: 100, step: 1, unit: "%", start: 25, answer: 53, tolerance: 8 },
      compare: "You guessed {yours}%. Bulkowski counted 53% upward, and 63% when price had risen into the pattern. The name says bearish; the count says coin flip.",
      concept: "triangles",
    },
    learn: [
      {
        kind: "figure",
        title: "Three triangles",
        figure: {
          kind: "chart",
          chart: { candles: blank(60), hideCandles: true, range: [99, 105] },
          steps: [
            {
              text: "Left: a flat top over rising lows. An ascending triangle.",
              layers: [zig([[1, 100], [4, 104], [7, 101.31], [10, 104], [13, 102.61], [16, 104]]), line(1, 104, 18, 104, 1, 18, "down"), line(1, 100, 18, 103.7, 1, 18, "up")],
            },
            {
              text: "Middle: a flat bottom under falling highs. A descending triangle.",
              layers: [zig([[21, 104], [24, 100], [27, 102.69], [30, 100], [33, 101.39], [36, 100]]), line(21, 104, 38, 100.3, 21, 38, "down"), line(21, 100, 38, 100, 21, 38, "up")],
            },
            {
              text: "Right: falling highs and rising lows. A symmetrical triangle.",
              layers: [zig([[41, 100], [44, 103.66], [47, 100.67], [50, 102.99], [53, 101.34], [56, 102.32]]), line(41, 104, 58, 102.1, 41, 58, "down"), line(41, 100, 58, 101.9, 41, 58, "up")],
            },
            { text: "The slopes give the name. They don't give the direction of the breakout." },
          ],
        },
        text: "A triangle's two boundaries converge toward the [[apex]], with at least three touches on one line and two on the other. Volume usually fades as the range narrows.",
        concept: "triangles",
      },
      {
        kind: "match",
        title: "Name it by the slopes",
        prompt: "Match each pair of boundaries to its name.",
        pairs: [
          { left: "Top flat, bottom rising", right: "Ascending triangle" },
          { left: "Bottom flat, top falling", right: "Descending triangle" },
          { left: "Top falling, bottom rising", right: "Symmetrical triangle" },
          { left: "Top rising, bottom falling", right: "Not a triangle: the lines diverge", wrong: "Lines that move apart never meet. That's a broadening formation, in 2.2.8." },
        ],
        correct: "One flat line makes an [[ascending-triangle]] or a [[descending-triangle]]; two converging slopes make a [[symmetrical-triangle]].",
        concept: "triangles",
      },
      {
        kind: "predict",
        title: "Which way?",
        prompt: "Which triangle's breakout direction was closest to a coin flip in Bulkowski's data?",
        control: {
          kind: "choice",
          choices: [
            { id: "asc", label: "Ascending" },
            { id: "desc", label: "Descending" },
            { id: "sym", label: "Symmetrical" },
          ],
          answer: "desc",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "Ascending", value: 63 },
            { label: "Descending", value: 53, role: "accent" },
            { label: "Symmetrical", value: 60 },
            { label: "Coin flip", value: 50, role: "neutral" },
          ],
          unit: "% up",
          steps: ["Share of breakouts that went up."],
        },
        reveal: "Descending: 53% up and 47% down, against the textbook. Ascending triangles broke up 63% of the time, symmetrical ones 60%. A bias, not a certainty: in each case a large minority went the other way.",
        concept: "triangles",
      },
      {
        kind: "figure",
        title: "How far to the apex",
        figure: {
          kind: "chart",
          chart: { candles: TRI1 },
          steps: [
            {
              text: "A flat top at 104.00 over rising lows: 100.00, 101.00, 102.00.",
              visible: 22,
              layers: [line(6, 104, 34, 104, 6, 34, "down"), line(2, 100, 18, 102, 2, 34, "up"), mark(2, "low", "100.00"), mark(10, "low", "101.00"), mark(18, "low", "102.00")],
            },
            { text: "Extended, the two lines meet at the apex, on candle 35.", layers: [{ kind: "marker", index: 34, price: 104, label: "Apex", role: "concept" }] },
            { text: "Candle 23 closes at 104.25: a breakout 62.5% of the way from the first low to the apex.", visible: 35, layers: [mark(22, "close", "104.25", "accent")] },
          ],
        },
        text: "Bulkowski found ascending triangles broke out about 64% of the way to the apex, and symmetrical ones about 74%. Breakouts usually come well before the lines meet.",
        concept: "triangles",
      },
      {
        kind: "reveal",
        title: "Breakout or fizzle?",
        prompt: "Candle 22 just closed at 102.18, above the upper line, almost at the apex. Breakout or fizzle?",
        chart: { candles: TRI2, visible: 22, layers: [line(2, 104, 10, 103.2, 2, 22, "down"), line(6, 100.4, 14, 101.2, 6, 22, "up")] },
        choices: [
          { id: "buy", label: "A breakout: buy it" },
          { id: "fizzle", label: "Too near the apex to trust" },
        ],
        answer: "fizzle",
        after: "Candle 23 closed at 101.90, under the lower line: one candle each way. At candle 22 the lines were 0.20 apart while ATR(14) was 0.50, so an ordinary candle crosses both. Near the apex a crossing carries little information.",
        concept: "triangles",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Evidence C, mixed. Ascending: 63% up; failures 17% up, 38% down. Descending: 53% up, so the bearish label doesn't hold. Symmetrical: 60% up, rank 36 of 39 and 34 of 36, among the weakest. On random data, converging lines fit almost any pause; the 3 + 2 touch rule cuts the count, not the outcome.",
      },
    ],
    task: {
      widget: "bias-spotter",
      goal: "Five sets of swing points. Name the shape each pair of boundaries makes.",
      data: { cards: TRI_CARDS, options: TRI_OPTIONS },
      success: { field: "solved", eq: 5 },
      correct: "All five named. The slopes give the name; the breakout's direction still comes from the data and the close.",
      hints: [
        "Look at each line on its own: are the highs flat, rising or falling? And the lows?",
        "Flat plus rising: ascending. Flat plus falling: descending. Opposite slopes that meet: symmetrical.",
        "Lines that never meet, parallel or spreading apart, aren't triangles.",
      ],
      showMe: { solved: 5 },
      concept: "triangles",
    },
    check: ["q-2.2.6-1", "q-2.2.6-2", "q-2.2.6-3"],
    recap: {
      takeaways: [
        "Ascending: flat top, rising lows. Descending: flat bottom, falling highs. Symmetrical: both converge.",
        "Bias from the data: ascending 63% up, symmetrical 60%, descending 53%, a coin flip.",
        "Near the apex the lines sit closer than a candle's range, so crossings there mean little.",
      ],
      next: "Next, 2.2.7: flags and pennants, short pauses after a steep move, and measured moves.",
    },
  },
};

// ─── 2.2.7 · Flags, pennants and measured moves ────────────────────────────

const L_2_2_7: Lesson = {
  id: "2.2.7",
  title: "Flags, pennants and measured moves",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Spot flags and pennants by pole, shape and length; scale the half-mast target, and project measured moves at 60% and 100%.",
  objectives: [
    "Identify a flag and a pennant from the flagpole, the shape and the duration.",
    'Compare the "half-mast" target with how often it was reached, and scale it.',
    "Project a measured move from three swing points at 60% and 100% of the first leg.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
  ],
  script: {
    unit: "2.2",
    courseId: "2.2.7",
    bridge: "In 2.2.6 two converging lines made a triangle. After a steep pole, a brief pause shaped like a small triangle is a pennant; a parallel one is a flag. Their half-mast targets get scaled as in 2.2.2, by how often they were reached.",
    hook: {
      prompt: "The flagpole was 4.00 tall. The 'half-mast' rule says price travels another 4.00 after the flag. How often does it get there?",
      control: { kind: "slider", min: 0, max: 100, step: 1, unit: "%", start: 75, answer: 46, tolerance: 8 },
      compare: "You guessed {yours}%. In Bulkowski's data 46% of flags got there, and 35% of pennants. So scale the target.",
      concept: "flags-and-pennants",
    },
    learn: [
      {
        kind: "explain",
        title: "Pole and flag",
        text: "A [[flag]] is a short pause after a steep move, the [[flagpole]]. Its two lines are parallel and slope against the pole. A [[pennant]] is the same pause with converging lines, like a small triangle. Both are brief: on LABX 1H the app counts 5 to 20 candles. Longer, and it's a rectangle or a channel.",
        figure: {
          kind: "chart",
          chart: { candles: FL1.slice(0, 21) },
          steps: [
            { text: "Flagpole: 100.00 to 104.00 in 6 candles.", layers: [mark(2, "low", "100.00"), mark(8, "high", "104.00")] },
            { text: "Flag: a small channel sloping down to 103.00, over 11 candles.", layers: FL1_FLAG },
            { text: "Candle 21 closes at 103.60, above the upper line: the breakout.", layers: [mark(20, "close", "103.60", "accent")] },
          ],
        },
      },
      {
        kind: "match",
        title: "Flag, pennant or something else?",
        prompt: "Sort each pause by its shape and its length.",
        pairs: [
          { left: "Parallel lines sloping against a steep pole, 12 candles", right: "Flag" },
          { left: "Converging lines after a steep pole, 9 candles", right: "Pennant" },
          { left: "Flat parallel lines, 35 candles, no steep pole before it", right: "Rectangle" },
          { left: "Parallel lines sloping down for 45 candles after a rise", right: "Channel" },
        ],
        correct: "Pole first, then shape, then length. Brief parallel lines make a flag, brief converging ones a pennant; long pauses are rectangles or channels.",
        concept: "flags-and-pennants",
      },
      {
        kind: "worked",
        title: "Half-mast, then scaled",
        lines: [
          "Pole: 104.00 − 100.00 = 4.00. Breakout at 103.60.",
          "Half-mast: 103.60 + 4.00 = 107.60. Flags reached it 46% of the time.",
          "Pennants did worse: 35%. Scale the pole by the pattern's rate before you project it.",
        ],
        after: "Half-mast assumes the move after the flag repeats the move before it. More often than not, it didn't.",
        concept: "pattern-target",
      },
      {
        kind: "reveal",
        title: "Does it reach half-mast?",
        prompt: "The flag broke out at 103.60. Does price reach the half-mast target, 107.60?",
        chart: { candles: FL1, visible: 21, layers: [...FL1_FLAG, lvl(107.6, "neutral", "Half-mast 107.60")] },
        choices: [
          { id: "yes", label: "Yes, it gets there" },
          { id: "no", label: "No, it stops short" },
        ],
        after: "It peaked at 105.70 on candle 25, then eased: far short of 107.60. A target reached less than half the time is a stretch, not a plan.",
        concept: "flags-and-pennants",
      },
      {
        kind: "worked",
        title: "Project D",
        lines: [
          "A [[measured-move]]: A 100.00, B 104.00, C 102.00. First leg AB = 4.00.",
          "D100 = C + AB = 102.00 + 4.00 = 106.00.",
          "Second legs ran shorter on average, and D at 60% of AB was reached 60% of the time.",
          "D60 = 102.00 + 4.00 × 0.60 = ?",
        ],
        ask: {
          answer: 104.4,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 106, text: "That's D100. Take 60% of AB: 4.00 × 0.60 = 2.40." },
            { value: 2.4, text: "That's the projected distance. Add it to C, 102.00." },
            { value: 102.4, text: "Measure from C, not from A: 102.00 + 2.40." },
          ],
          correct: "Right: 102.00 + 2.40 = 104.40.",
        },
        after: "In Bulkowski's stock data the second leg averaged +31%, against +36% for the first. Plan for the shorter leg.",
        concept: "measured-move",
      },
      {
        kind: "figure",
        title: "What happened",
        figure: {
          kind: "chart",
          chart: { candles: MM1 },
          steps: [
            {
              text: "D60 at 104.40 and D100 at 106.00, projected from C at 102.00.",
              visible: 17,
              layers: [mark(2, "low", "A"), mark(10, "high", "B"), mark(15, "low", "C"), lvl(104.4, "target", "D60"), lvl(106, "neutral", "D100")],
            },
            { text: "Candle 23 reaches 104.65, past D60. The high is 104.90; D100 never comes.", visible: 29, layers: [mark(23, "high", "104.90", "accent")] },
          ],
        },
      },
      {
        kind: "callout",
        tone: "info",
        text: "The [[high-tight-flag]] is a stock pattern: price nearly doubles in about two months, then pauses. Bulkowski counted 15% failures and a target of half the height met 82% of the time. Nothing on LABX 1H doubles in two months, so it stays in the Library.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Evidence D for the half-mast rule. Flags failed 44–45% of the time; pennants 54%, worse than a coin flip, and the trend after a pennant matched the one before only about 30% of the time. Measured moves scaled to 60% have mixed support, C.",
      },
    ],
    task: {
      widget: "bracket-builder",
      goal: "The flag broke out at 103.60 and you bought at 103.65. Put the stop under the flag's low, and the target at the pole scaled by 46%.",
      data: { chart: { candles: FL1.slice(0, 21), layers: FL1_FLAG }, entry: 103.65, units: 40 },
      start: { stop: 103.4, target: 105.0, units: 40 },
      locked: ["units"],
      success: {
        all: [
          { field: "stop", gte: 102.6 },
          { field: "stop", lte: 102.95 },
          { field: "target", gte: 105.39 },
          { field: "target", lte: 105.49 },
        ],
      },
      feedback: [
        { when: { field: "target", gte: 107.5 }, text: "That's half-mast, 103.60 + 4.00. Flags got there 46% of the time: scale the pole first." },
        { when: { field: "target", gt: 105.49 }, text: "Above the scaled target. 4.00 × 0.46 = 1.84, measured from the 103.60 breakout." },
        { when: { field: "target", lt: 105.39 }, text: "Short of the scaled target: 103.60 + 4.00 × 0.46." },
        { when: { field: "stop", gt: 102.95 }, text: "At {stop:2} the stop sits inside the flag, where the pause was still swinging. Go under its low, 103.00." },
        { when: { field: "stop", lt: 102.6 }, text: "At {stop:2} you risk {stopDistance:2} per unit. Back under the flag's low, the idea is already wrong." },
      ],
      correct: "Stop {stop:2}, target {target:2}: {rr:2}R. The flag's tight low keeps the stop short; the scaled target still has to be earned.",
      hints: [
        "The pole ran from 100.00 to 104.00. The flag's lowest point is 103.00.",
        "Scaled target: 103.60 + 4.00 × 0.46.",
        "Stop 102.90; target 103.60 + 1.84 = 105.44.",
      ],
      showMe: { stop: 102.9, target: 105.44 },
      concept: "flags-and-pennants",
    },
    check: ["q-2.2.7-1", "q-2.2.7-2", "q-2.2.7-3"],
    recap: {
      takeaways: [
        "Flag: a steep pole, then a brief parallel pause sloping back. Pennant: the same, converging.",
        "Half-mast targets were met by 46% of flags and 35% of pennants. Scale the pole.",
        "Measured move: D = C + AB. Plan for 60% of AB; 100% is the stretch.",
      ],
      next: "Next, 2.2.8: wedges, which converge as both lines slope one way, and broadening formations that widen.",
    },
  },
};

// ─── 2.2.8 · Wedges and broadening formations ──────────────────────────────

const WEDGE_CARDS: Cards = [
  {
    id: "w1",
    text: "Swing highs 102.00, 103.00, 104.00. Swing lows 100.50, 101.50, 102.50.",
    answer: "ch",
    correct: "Both lines rise 1.00 a swing: parallel, a channel.",
    rationales: {
      rw: "A rising wedge needs the lows to rise faster than the highs. Here both rise 1.00 a swing.",
      fw: "Both lines rise here; a falling wedge has both falling.",
      br: "Broadening lines move apart. These stay 1.50 apart.",
    },
  },
  {
    id: "w2",
    text: "Swing highs 102.00, 102.60, 103.20. Swing lows 100.00, 101.00, 102.00.",
    answer: "rw",
    correct: "Both rise, the lows faster: 1.00 a swing against 0.60. A rising wedge.",
    rationales: {
      ch: "The gap shrinks from 2.00 to 1.20: the lines converge, so it isn't a channel.",
      fw: "Both lines rise here; a falling wedge has both falling.",
      br: "Broadening lines move apart. These close in.",
    },
  },
  {
    id: "w3",
    text: "Swing highs 105.00, 103.80, 102.60. Swing lows 103.00, 102.40, 101.80.",
    answer: "fw",
    correct: "Both fall, the highs faster: 1.20 a swing against 0.60. A falling wedge; 68% broke out upward in the data.",
    rationales: {
      ch: "The gap shrinks from 2.00 to 0.80: the lines converge, so it isn't a channel.",
      rw: "Both lines fall here; a rising wedge has both rising.",
      br: "Broadening lines move apart. These close in.",
    },
  },
  {
    id: "w4",
    text: "Swing highs 103.00, 103.80, 104.60. Swing lows 101.00, 100.20, 99.40.",
    answer: "br",
    correct: "Higher highs and lower lows: the lines diverge. A broadening formation.",
    rationales: {
      ch: "A channel's lines run parallel. These spread apart, 0.80 more each swing on each side.",
      rw: "A wedge's lines slope the same way. Here the highs rise and the lows fall.",
      fw: "A wedge's lines slope the same way. Here the highs rise and the lows fall.",
    },
  },
  {
    id: "w5",
    text: "Swing highs 104.00, 103.50, 103.00. Swing lows 102.00, 101.50, 101.00.",
    answer: "ch",
    correct: "Both fall 0.50 a swing: a falling channel, not a wedge.",
    rationales: {
      rw: "Both lines fall here, and at the same pace.",
      fw: "A falling wedge needs the highs to fall faster than the lows. Here both fall 0.50 a swing.",
      br: "Broadening lines move apart. These stay 2.00 apart.",
    },
  },
];
const WEDGE_OPTIONS = [
  { id: "ch", label: "Channel" },
  { id: "rw", label: "Rising wedge" },
  { id: "fw", label: "Falling wedge" },
  { id: "br", label: "Broadening" },
];

const L_2_2_8: Lesson = {
  id: "2.2.8",
  title: "Wedges and broadening formations",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Tell wedges from channels by their slopes, know how weak rising-wedge breakdowns were, and why megaphones and diamonds are hard to trade.",
  objectives: [
    "Tell a rising wedge from a falling wedge and from a channel by the slopes of the two lines.",
    "State what the data says about rising wedges that break down.",
    "Identify a broadening formation and a diamond, and explain why they are hard to trade.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "reversal", label: "Arena: reversal" },
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
  ],
  script: {
    unit: "2.2",
    courseId: "2.2.8",
    bridge: "In 2.2.7 flags sloped back against the pole between parallel lines. A wedge also slopes, but its lines converge like 2.2.6's triangles, both pointing the same way. Parallel lines would make a 2.2.1 channel. Then shapes that widen: megaphones and diamonds.",
    hook: {
      prompt: "Rising wedges are taught as bearish. Of those that do break down, how many fail to fall even 5%?",
      control: { kind: "slider", min: 0, max: 100, step: 1, unit: "%", start: 15, answer: 51, tolerance: 8 },
      compare: "You guessed {yours}%. 51% failed: the weakest downward breakout in Bulkowski's list, rank 36 of 36.",
      concept: "wedges-and-broadening",
    },
    learn: [
      {
        kind: "figure",
        title: "Same direction, closing in",
        figure: {
          kind: "chart",
          chart: { candles: blank(60), hideCandles: true, range: [99, 106] },
          steps: [
            {
              text: "Left: both lines rise at the same slope. A channel.",
              layers: [zig([[1, 100], [4, 101.95], [7, 100.9], [10, 102.85], [13, 101.8], [16, 103.75]]), line(1, 101.5, 18, 104.05, 1, 18, "down"), line(1, 100, 18, 102.55, 1, 18, "up")],
            },
            {
              text: "Middle: both rise, the lower line steeper, so they converge. A rising wedge.",
              layers: [zig([[21, 100], [24, 102.45], [27, 101.5], [30, 103.35], [33, 103], [36, 104.25]]), line(21, 102, 38, 104.55, 21, 38, "down"), line(21, 100, 38, 104.25, 21, 38, "up")],
            },
            {
              text: "Right: both fall, the upper line steeper. A falling wedge.",
              layers: [zig([[41, 105], [44, 102.55], [47, 103.5], [50, 101.65], [53, 102], [56, 100.75]]), line(41, 105, 58, 100.75, 41, 58, "down"), line(41, 103, 58, 100.45, 41, 58, "up")],
            },
            { text: "Same direction and parallel: a channel. Same direction and converging: a wedge." },
          ],
        },
        text: "A [[wedge]] has two lines sloping the same way and converging. Parallel lines make a [[channel]] instead. Bulkowski asks for at least five touches, three on one line and two on the other; on LABX 1H the app also wants 15 candles, since shorter is a pennant.",
        concept: "wedges-and-broadening",
      },
      {
        kind: "figure",
        title: "A rising wedge on LABX",
        figure: {
          kind: "chart",
          chart: { candles: RW1 },
          steps: [
            {
              text: "Lows 100.00, 101.60, 103.20 rise 0.20 a candle; highs 102.60, 103.80, 105.00 only 0.15.",
              visible: 24,
              layers: [line(2, 100, 10, 101.6, 2, 26, "up"), line(6, 102.6, 14, 103.8, 6, 26, "down")],
            },
            { text: "Candle 25 closes at 104.27, under the lower line: the textbook short.", visible: 25, layers: [mark(24, "close", "104.27", "down")] },
            { text: "The fall stops at 103.60. Price then climbs to 105.60, past the wedge's highest peak.", visible: 34, layers: [mark(26, "low", "103.60"), mark(31, "high", "105.60", "accent")] },
          ],
        },
        text: "This breakdown failed. In Bulkowski's data most rising wedges did break down, 60%, but half of those breakdowns didn't fall even 5% before turning.",
        concept: "wedges-and-broadening",
      },
      {
        kind: "worked",
        title: "What the target leaves you",
        lines: [
          "A rising wedge 3.00 tall breaks down at 102.00.",
          "Downward breakouts reached the full target only 32% of the time: 3.00 × 0.32 = 0.96.",
          "Short at 101.95, stop above the upper line at 103.00: risk 1.05 per unit.",
          "Scaled target 102.00 − 0.96 = 101.04, a reward of 0.91. Reward-to-risk = ?",
        ],
        ask: {
          answer: 0.87,
          tolerance: 0.01,
          unit: "R",
          feedback: [
            { value: 0.96, text: "That's the target's distance from the breakout. The reward runs from your entry, 101.95, to 101.04: 0.91." },
            { value: 1.15, text: "That's risk over reward. Put the reward on top: 0.91 ÷ 1.05." },
          ],
          correct: "Right: 0.91 ÷ 1.05 = 0.87. Less than you risk, on a breakdown that failed half the time.",
        },
        after: "A weak target plus a stop beyond the pattern makes the [[reward-to-risk]] less than 1. That alone can rule the trade out.",
        concept: "wedges-and-broadening",
      },
      {
        kind: "figure",
        title: "Megaphones and diamonds",
        figure: {
          kind: "chart",
          chart: { candles: blank(40), hideCandles: true, range: [99, 106] },
          steps: [
            {
              text: "Left: higher highs and lower lows. The lines diverge like a megaphone.",
              layers: [zig([[1, 102], [4, 103.45], [7, 101.1], [10, 104.35], [13, 100.2], [16, 105.25]]), line(1, 103, 18, 105.55, 1, 18, "down"), line(1, 102, 18, 99.45, 1, 18, "up")],
            },
            {
              text: "Right: a diamond widens like a megaphone, then narrows like a symmetrical triangle.",
              layers: [
                zig([[21, 102.5], [23, 103.2], [25, 101.2], [28, 104.7], [30, 100.3], [33, 103.8], [35, 101.8], [37, 102.5]]),
                { kind: "path", points: [{ index: 21, price: 102.6 }, { index: 29, price: 105 }, { index: 37, price: 102.6 }], role: "down", dashed: true },
                { kind: "path", points: [{ index: 21, price: 102.4 }, { index: 29, price: 100 }, { index: 37, price: 102.4 }], role: "up", dashed: true },
              ],
            },
          ],
        },
        text: "A [[broadening-formation]], or megaphone, has diverging lines. A [[diamond-pattern]] widens, then narrows. Both are rare, both are hard to draw the same way twice, and their stops sit far away because the swings keep growing.",
        concept: "wedges-and-broadening",
      },
      {
        kind: "match",
        title: "Name it by the slopes",
        prompt: "Match each pair of lines to its name.",
        pairs: [
          { left: "Both rise at the same slope", right: "Channel" },
          { left: "Both rise, the lower line steeper", right: "Rising wedge" },
          { left: "Both fall, the upper line steeper", right: "Falling wedge" },
          { left: "The upper line rises, the lower falls", right: "Broadening formation" },
        ],
        correct: "Direction first, then convergence: same way and parallel is a channel, same way and converging a wedge, opposite and apart a megaphone.",
        concept: "wedges-and-broadening",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Al Brooks uses 'wedge' differently: three pushes in one direction, whether or not two lines converge. Same word, another pattern; it returns in 2.6.5.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Evidence D for 'rising wedge means bearish': 60% broke down, but 51% of those failed, rank 36 of 36. Falling wedges, C: 68% broke up, rank 31 of 39. Broadening, D: Bulkowski calls it a poor performer. Diamonds rank last of 39 upward and 3rd of 36 downward, but they're rare and drawn subjectively.",
      },
    ],
    task: {
      widget: "bias-spotter",
      goal: "Five sets of swing points. Compare how fast the highs and the lows move, then name the shape.",
      data: { cards: WEDGE_CARDS, options: WEDGE_OPTIONS },
      success: { field: "solved", eq: 5 },
      correct: "All five named. Same direction and converging is a wedge; the steeper line tells you which one.",
      hints: [
        "Work out how much the highs move per swing, then the lows.",
        "Equal steps: a channel. Same direction, unequal: a wedge. Opposite directions, apart: broadening.",
        "Rising wedge: the lows rise faster. Falling wedge: the highs fall faster.",
      ],
      showMe: { solved: 5 },
      concept: "wedges-and-broadening",
    },
    check: ["q-2.2.8-1", "q-2.2.8-2", "q-2.2.8-3"],
    recap: {
      takeaways: [
        "Wedge: both lines slope the same way and converge. Parallel lines make a channel.",
        "Rising wedges broke down 60% of the time, and half of those breakdowns failed.",
        "Megaphones and diamonds are rare, subjective and wide: hard to stop, harder to trust.",
      ],
      next: "Next, 2.2.9: turns drawn as curves, slow rounding bottoms and cups, and sharp V's.",
    },
  },
};

// ─── 2.2.9 · Rounding, cup with handle, V ──────────────────────────────────

const L_2_2_9: Lesson = {
  id: "2.2.9",
  title: "Slow turns and sharp turns: rounding, cup with handle, V",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Rounding bottoms and cups become visible late, V turns can't be seen in real time, and a rare pattern's numbers need their sample size checked.",
  objectives: [
    "Identify a rounding bottom and a cup with handle, and explain why both become visible only late.",
    "Explain why a V-bottom can't be recognised in real time, using the V's that failed.",
    "Use the pattern zoo card to compare any rare pattern by failure rate, rank and sample size.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "reversal", label: "Arena: reversal" },
    { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
  ],
  script: {
    unit: "2.2",
    courseId: "2.2.9",
    bridge: "In 2.2.8 megaphones and diamonds were rare and hard to trust. Here the turns are curves: slow bowls and cups, sharp V's. Like 2.2.3's double bottom, a bowl counts only after a close above its rim, which comes late. Rare ones need their sample checked.",
    hook: {
      prompt: "You see the left half of a slow bowl. Is it a rounding bottom?",
      figure: { kind: "chart", chart: { candles: RB1.slice(0, 20) }, steps: [{ text: "A slow slide from 102.20 to 98.00 over 17 candles." }] },
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Yes" },
          { id: "cant", label: "Can't tell yet" },
          { id: "no", label: "No" },
        ],
        answer: "cant",
      },
      compare: "You picked {yours}. A bowl is only a bowl once its right side is built: this one confirmed on candle 39.",
      concept: "rounding-and-v-patterns",
    },
    learn: [
      {
        kind: "reveal",
        title: "Watch it form",
        prompt: "Price has flattened near 98.00 for several candles. Is the rounding bottom confirmed?",
        chart: { candles: RB1, visible: 23, layers: [lvl(102.2, "concept", "Left rim 102.20")] },
        choices: [
          { id: "yes", label: "Yes: the bowl is clear" },
          { id: "no", label: "No: it needs a close above the rim, 102.20" },
        ],
        answer: "no",
        after: "Confirmation came on candle 39, a close at 102.34 above the 102.20 rim. By then price had already climbed 4.34 from the low. A [[rounding-bottom]] is easy to see once it's done.",
        concept: "rounding-and-v-patterns",
      },
      {
        kind: "explain",
        title: "Cup with handle",
        text: "A [[cup-with-handle]] is a U-shaped base with rims at similar prices, then a short pullback, the handle, in the upper half of the cup. It confirms on a close above the rim. Like the bowl, you can only name it near the end: most of the rise from the bottom is done before it confirms.",
        figure: {
          kind: "chart",
          chart: { candles: CUP1 },
          steps: [
            { text: "Left rim 102.00, bottom 97.00, right rim 101.95: a U, not a V.", visible: 29, layers: [mark(3, "high", "102.00"), mark(15, "low", "97.00"), mark(27, "high", "101.95")] },
            { text: "Handle: a pullback to 101.00, in the upper half of the cup.", visible: 33, layers: [mark(31, "low", "101.00")] },
            { text: "Candle 35 closes at 102.20, above the rim: confirmed, 5.20 above the bottom.", visible: 35, layers: [lvl(102, "concept", "Rim 102.00"), mark(34, "close", "102.20", "accent")] },
          ],
        },
      },
      {
        kind: "reveal",
        title: "A V in real time",
        prompt: "LABX fell from 104.30 to 100.50 in six candles, then three green candles climbed to 101.90. Is this the bottom of a V?",
        chart: { candles: VB1, visible: 12 },
        choices: [
          { id: "v", label: "Yes, a V-bottom: buy it" },
          { id: "cant", label: "Can't tell from here" },
        ],
        answer: "cant",
        after: "It wasn't. Price turned at 101.90 and fell to 98.40. In real time the low of a [[v-reversal]] and a pause in a fall look the same; only the later candles tell them apart.",
        concept: "rounding-and-v-patterns",
      },
      {
        kind: "worked",
        title: "The cup's target",
        lines: [
          "Rim 104.00, bottom 98.00: depth 6.00.",
          "Cups with handle reached the full target 61% of the time.",
          "Scaled target: 104.00 + 6.00 × 0.61 = ?",
        ],
        ask: {
          answer: 107.66,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 110, text: "That's the full depth. Scale it: 6.00 × 0.61 = 3.66." },
            { value: 3.66, text: "That's the distance. Add it to the rim, 104.00." },
          ],
          correct: "Right: 104.00 + 3.66 = 107.66.",
        },
        after: "The depth runs from the rim to the cup's bottom and is projected from the rim. The handle's low sets the stop.",
        concept: "pattern-target",
      },
      {
        kind: "predict",
        title: "Rare and highly ranked",
        prompt: "Pattern X ranks 1st of 39, from 40 cases. Pattern Y ranks 9th, from 900 cases. Whose ranking would you trust more?",
        control: {
          kind: "choice",
          choices: [
            { id: "x", label: "X: it ranks first" },
            { id: "y", label: "Y: far more cases stand behind it" },
            { id: "same", label: "Both equally: a rank is a rank" },
          ],
          answer: "y",
        },
        reveal: "With 40 cases, a few lucky trades can lift a pattern to the top; with 900, luck averages out. Read a rare pattern's card for its failure rate, rank and [[sample-size|sample size]], and for how subjectively it's drawn.",
        concept: "sample-size",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Pattern zoo, in the Library: bump-and-run reversal bottoms ranked 1st of 39, but their angles are drawn by eye. Wolfe waves ranked 34th of 39 and 35th of 36. Rounding tops ranked 2nd and 3rd. Rare names, strong claims: check the sample and the drawing rule before the rank.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Evidence C, mixed. Rounding bottoms failed 4% of the time, the lowest, and reached the target 65%, rank 7 of 39; cups with handle 5% and 61%, rank 3 of 39. Evidence D for spotting V's in real time. These come from months-long patterns on daily and weekly stock charts, not from LABX 1H.",
      },
    ],
    task: {
      widget: "bracket-builder",
      goal: "Candle 35 closed above the rim and you bought at 102.25. Put the stop under the handle's low, and the target at the cup's depth scaled by 61%.",
      data: { chart: { candles: CUP1, layers: [lvl(102, "resistance", "Rim 102.00")] }, entry: 102.25, units: 40 },
      start: { stop: 101.6, target: 104.0, units: 40 },
      locked: ["units"],
      success: {
        all: [
          { field: "stop", gte: 100.6 },
          { field: "stop", lte: 100.95 },
          { field: "target", gte: 105.0 },
          { field: "target", lte: 105.1 },
        ],
      },
      feedback: [
        { when: { field: "target", gte: 106.95 }, text: "That's the full depth, 102.00 + 5.00. Cups reached it 61% of the time: scale it." },
        { when: { field: "target", gt: 105.1 }, text: "Above the scaled target. Depth 5.00 × 0.61 = 3.05, measured from the rim, 102.00." },
        { when: { field: "target", lt: 105.0 }, text: "Short of the scaled target: 102.00 + 5.00 × 0.61." },
        { when: { field: "stop", gt: 100.95 }, text: "At {stop:2} the stop sits inside the handle's swing. Its low is 101.00: go just under it." },
        { when: { field: "stop", lt: 100.6 }, text: "At {stop:2} you risk {stopDistance:2} per unit. Under the handle's low the idea has already failed." },
      ],
      correct: "Stop {stop:2}, target {target:2}: {rr:2}R. The handle gives a tight stop; the cup gives the target.",
      hints: [
        "Depth: the rim, 102.00, minus the cup's bottom, 97.00.",
        "Depth 5.00 × 0.61 = 3.05, added to the rim.",
        "Stop 100.90; target 102.00 + 3.05 = 105.05.",
      ],
      showMe: { stop: 100.9, target: 105.05 },
      concept: "rounding-and-v-patterns",
    },
    check: ["q-2.2.9-1", "q-2.2.9-2", "q-2.2.9-3"],
    recap: {
      takeaways: [
        "Bowls and cups confirm on a close above the rim, after most of the move is done.",
        "A V's low looks like any pause in a fall until later candles show which it was.",
        "For a rare pattern, check failure rate, rank and sample size, and how it's drawn.",
      ],
      next: "Next, 2.2.10: patterns that fail or bust, how often shapes appear in random data, and the plan to write first.",
    },
  },
};

// ─── 2.2.10 · Failed, busted and random patterns ───────────────────────────

const PLAN_CARDS: Cards = [
  {
    id: "works",
    text: "Candle 26 closed at 104.30. The next one dips to 104.08, then closes at 104.44, above the top.",
    answer: "hold",
    correct: "A dip that closes above the level is a throwback, not a failure. The plan says hold, with the stop where it is.",
    rationales: {
      exit: "Nothing has failed: the close is still above 104.00. Exiting on a dip that held breaks your own plan.",
      add: "Adding wasn't in the plan. A throwback is normal; it doesn't call for more size.",
      aside: "You're in a trade that's working. Standing aside comes after a bust, not now.",
    },
  },
  {
    id: "fails",
    text: "Candle 27 closes at 103.85, back inside the triangle. Your stop at 103.30 hasn't been hit.",
    answer: "exit",
    correct: "The breakout idea is wrong once price closes back inside. The plan exits now; the stop was only the worst case.",
    rationales: {
      hold: "Holding because the stop wasn't hit turns a planned exit into hope. The close back inside is the failure.",
      add: "Adding to a failed breakout raises the stake on an idea already proven wrong.",
      aside: "Standing aside comes once you're out. First, exit the position.",
    },
  },
  {
    id: "busts",
    text: "You're out. Candle 28 closes at 103.40, under the triangle's lower line: the pattern is busted.",
    answer: "aside",
    correct: "A bust is a new situation. Stand aside, or trade it with a fresh plan: its own entry, stop and size.",
    rationales: {
      hold: "You're already out, so there's nothing to hold. The question is whether to start something new.",
      exit: "You exited at the failure. The bust needs a new decision, not the old one.",
      add: "Piling into a move you just lost on, without a plan, is how a small loss grows.",
    },
  },
  {
    id: "urge",
    text: "After the bust you feel the loss and want to sell twice your usual size to win it back.",
    answer: "aside",
    correct: "That's the urge the plan was written for. Stand aside, or trade the bust at normal size with its own stop.",
    rationales: {
      hold: "There's no position to hold; the urge is to open a bigger one.",
      exit: "You're already flat. The decision is about a new trade.",
      add: "Doubling size to win back a loss is revenge trading. The plan's size rule still applies.",
    },
  },
];
const PLAN_OPTIONS = [
  { id: "hold", label: "Hold, with the stop" },
  { id: "exit", label: "Exit now" },
  { id: "add", label: "Add to the position" },
  { id: "aside", label: "Stand aside, or a new plan with its own stop and size" },
];

const L_2_2_10: Lesson = {
  id: "2.2.10",
  title: "Failed, busted and random patterns",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Write the plan for works, fails and busts before the breakout; patterns appear in random walks, and published failure rates change with the era.",
  objectives: [
    "Pre-commit your actions for the three outcomes of a breakout: it works, it fails, it busts.",
    "Show with the lab that pattern shapes appear in a random walk and that what follows them matches the base rate.",
    "Explain why Bulkowski's failure rates doubled after the 1990s and what that means for any published statistic.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
  ],
  script: {
    unit: "2.2",
    courseId: "2.2.10",
    bridge: "In 2.2.9 a V couldn't be told from a pause until later. Every pattern carries that doubt. In 1.5.6 you planned two endings for a breakout; here you write three, works, fails and busts, into the plan of 1.6.2, and scan 0.2.5's random walks.",
    hook: {
      prompt: "We generate 10,000 purely random price paths. How many head-and-shoulders patterns will a scanner find in them?",
      control: {
        kind: "choice",
        choices: [
          { id: "none", label: "None" },
          { id: "few", label: "A few" },
          { id: "many", label: "Many" },
        ],
        answer: "many",
      },
      compare: "You picked {yours}. Random paths are full of patterns: a shape needs no cause. What matters is what follows it.",
      concept: "base-rates",
    },
    learn: [
      {
        kind: "figure",
        title: "Patterns in noise",
        figure: {
          kind: "chart",
          chart: { candles: RWALK },
          steps: [
            { text: "A random walk: 60 candles, no memory, no edge." },
            {
              text: "A double top: 101.67 and 101.79, valley 100.50, confirmed on candle 28. Then price rose.",
              layers: [mark(15, "high", "101.67"), mark(23, "high", "101.79"), line(18, 100.5, 19, 100.5, 15, 27, "concept", "Valley"), mark(27, "close", "100.46", "down")],
            },
            {
              text: "A head and shoulders: 103.13, 103.77, 103.13, confirmed on candle 55. Then price fell.",
              layers: [mark(36, "high", "LS"), mark(42, "high", "H"), mark(51, "high", "RS"), line(37, 102.29, 48, 102.3, 37, 56, "concept", "Neckline"), mark(54, "close", "102.25", "down")],
            },
            { text: "On a random walk, what follows any shape is a coin flip, by construction." },
          ],
        },
        text: "Each close here is the previous close plus a random draw, so nothing in the past predicts the next candle. A [[random-walk]] still contains every shape in this unit.",
        concept: "base-rates",
      },
      {
        kind: "explain",
        title: "What the lab shows",
        text: "Scan thousands of random walks and a detector finds head and shoulders, double tops and triangles at a steady rate. What follows them matches what follows any candle, by construction. A pattern earns your attention only if, on real data and after costs, what follows it beats that base rate.",
      },
      {
        kind: "figure",
        title: "Works, fails, busts",
        figure: {
          kind: "chart",
          chart: { candles: [...TRIB, ...TRIB_FAIL], layers: TRIB_LINES },
          steps: [
            { text: "Ascending triangle: flat top 104.00, last low inside 103.40. Candle 26 closes at 104.30.", visible: 26, layers: [mark(22, "low", "103.40"), mark(25, "close", "104.30", "accent")] },
            { text: "Candle 27 closes at 103.85, back inside, after a high of only 104.38. The breakout failed.", visible: 27, layers: [mark(26, "close", "103.85", "down")] },
            { text: "Candle 28 closes at 103.40, under the lower line: the pattern is busted.", visible: 28, layers: [mark(27, "close", "103.40", "down")] },
            { text: "The bust carries price down to 101.75. Without a plan, each step is a decision under pressure.", visible: 38 },
          ],
        },
        text: "A [[busted-pattern]] breaks out, fails to travel, then breaks through the opposite side. The app's rule: less than 1 ATR beyond the breakout, then a close beyond the other boundary. Here ATR(14) was 0.40, and the high after the break only 104.38.",
        concept: "busted-patterns",
      },
      {
        kind: "task",
        title: "Write the plan first",
        task: {
          widget: "bias-spotter",
          goal: "Your plan for this triangle's breakout. For each outcome, pick what the plan says to do, before it happens.",
          data: { cards: PLAN_CARDS, options: PLAN_OPTIONS },
          success: { field: "solved", eq: 4 },
          correct: "Plan written: hold while it works, exit on a close back inside, and after a bust stand aside or start a new plan. Never add.",
          hints: [
            "The plan exists so that no decision is made under pressure.",
            "A failed breakout ends the trade. A bust is a new situation, not a reason to add.",
            "Hold, exit, stand aside or a new plan. Adding is never the answer to a failure.",
          ],
          showMe: { solved: 4 },
          concept: "busted-patterns",
        },
      },
      {
        kind: "figure",
        title: "Era decay",
        figure: {
          kind: "bars",
          bars: [
            { label: "Up, 1990s", value: 14, role: "up" },
            { label: "Up, 2003–07", value: 28, role: "up" },
            { label: "Down, 1990s", value: 26, role: "down" },
            { label: "Down, 2003–07", value: 49, role: "down" },
          ],
          unit: "%",
          steps: ["Breakouts that failed to gain 10%, by era."],
        },
        text: "Bulkowski measured the share of breakouts that failed to gain 10%. From the 1990s bull market to 2003–2007 it doubled: 14% to 28% upward, 26% to 49% downward. Every published rate describes its period, and edges shrink once known: McLean and Pontiff found 97 published return predictors earned 58% less after publication.",
        concept: "base-rates",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Mechanic: on a random walk, what follows a pattern equals the base rate, by construction. Evidence C for strong moves after busts: Bulkowski describes them for triangles, but his numbers for them are in his books, not in this course. Treat every rate as its period's average, not a law.",
      },
    ],
    task: {
      widget: "level-drawer",
      goal: "Draw a band over the triangle's flat top. Then place the stop for a breakout buy under the last swing low inside, and play both endings.",
      data: {
        chart: { candles: TRIB, visible: 25 },
        breakout: {
          endings: { fail: TRIB_FAIL, hold: TRIB_HOLD },
          order: ["fail", "hold"],
          breakIndex: 25,
          entry: 104.35,
          stopRule: { minBelowBand: 0.6, maxBelowBand: 1.2 },
          showMeEnding: "fail",
          messages: {
            bandCorrect: "{touches} touches between {bandLow:2} and {bandHigh:2}: the triangle's flat top.",
            stopCorrect: "Stop at {stop:2}, under the last swing low inside, 103.40. Risk {risk:2} per unit, about {total:2} with commission.",
            stopTooClose: "At {stop:2} the stop sits inside the triangle's swings. Put it under the last swing low inside, 103.40, with a small buffer.",
            stopTooFar: "At {stop:2} the risk is {risk:2} per unit. Once price is back under 103.40, the breakout is already wrong.",
            playFail: "Candle {k} closed at {close:2}, back inside: the plan exits there. Without that rule, your stop at {stop:2} would have filled as the pattern busted.",
            playHold: "The breakout held: a dip to 104.02 closed above the top, then price climbed to 105.66. The plan said hold.",
            playBoth: "Same triangle, same entry, two endings. The plan covered both before either happened.",
          },
        },
      },
      start: { role: "resistance", bandLow: 102.9, bandHigh: 103.2, stop: 103.3 },
      success: {
        all: [
          { field: "role", eq: "resistance" },
          { field: "touches", gte: 3 },
          { field: "height", gte: 0.1 },
          { field: "height", lte: 0.5 },
          { field: "phase", gte: 3 },
        ],
      },
      feedback: [
        { when: { field: "height", lt: 0.1 }, text: "A band thinner than 0.10 is a line. Widen it to cover the touches." },
        { when: { field: "height", gt: 0.5 }, text: "That band is {height:2} tall. Tighten it around the three tops." },
        { when: { field: "touches", lt: 3 }, text: "Only {touches} tops sit inside your band. The flat top is near 104.00." },
      ],
      correct: "Plan set: stop {stop:2}, exit on a close back inside, no adding. Play both endings to see it work.",
      hints: [
        "Three rises stalled at the same ceiling. Cover them with one band.",
        "The tops are 104.00, 103.97 and 104.00. The stop goes under the last swing low inside, 103.40.",
        "Band 103.90–104.05, stop 103.30.",
      ],
      showMe: { role: "resistance", bandLow: 103.9, bandHigh: 104.05, stop: 103.3 },
      concept: "busted-patterns",
    },
    check: ["q-2.2.10-1", "q-2.2.10-2", "q-2.2.10-3"],
    recap: {
      takeaways: [
        "Write works, fails and busts before entry: hold, exit on a close back inside, never add.",
        "Random walks are full of patterns, and what follows them there is the base rate.",
        "Failure rates doubled from the 1990s to the 2000s. Every published rate has an era.",
      ],
      next: "Next, the Unit 2.2 checkpoint. Then Unit 2.3, Trend tools, starting with Dow Theory and what a trend is.",
    },
  },
};

const lessons: Lesson[] = [L_2_2_1, L_2_2_2, L_2_2_3, L_2_2_4, L_2_2_5, L_2_2_6, L_2_2_7, L_2_2_8, L_2_2_9, L_2_2_10];

// ─── Check questions ────────────────────────────────────────────────────────

const questions: Question[] = [
  // 2.2.1
  {
    id: "q-2.2.1-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which of these is a valid uptrend line?",
    options: [
      { id: "a", label: "A line through the two lowest closes on the chart", rationale: "Closes aren't swing lows, and the two lowest can sit anywhere. Lines are drawn on the lows' wicks; closes judge the breaks." },
      { id: "b", label: "A steep line through two lows, redrawn after each break so it keeps fitting", rationale: "Redrawing after every break makes the line follow your hopes. A valid line stays fixed, and steep lines break on any pause." },
      { id: "c", label: "A line through two swing lows, the second higher, confirmed by a third low that touches it" },
      { id: "d", label: "A line through two rising swing highs", rationale: "An uptrend line runs under the lows. A line through rising highs can be a channel's upper edge, not the trendline." },
    ],
    correct: "c",
    explanation: "Two swing lows draw the line, the second higher than the first; a third low that touches it confirms it. The points should be reasonably spaced, the line not forced through candles, and the steeper it is, the less it means.",
    lesson: "2.2.1",
    concepts: ["trendlines-and-channels"],
  },
  {
    id: "q-2.2.1-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "LABX has risen for two days. Your uptrend line runs through three swing lows. A candle has just closed 0.30 under it. The last swing low is 102.00 and price is at 102.60.",
    prompt: "What would confirm that the uptrend has ended?",
    options: [
      { id: "a", label: "Nothing more: the close under the line already confirms it", rationale: "A trendline break is a warning. Rises often slow and go sideways, breaking a rising line without turning down." },
      { id: "b", label: "A close under the last swing low, 102.00, or a lower high followed by a lower low" },
      { id: "c", label: "A second close under the same line", rationale: "More closes under a sloped line still only say the rise slowed. A change of trend shows in the swing structure." },
      { id: "d", label: "A break of a new line, redrawn through the latest low", rationale: "Redrawing moves the goalposts. Keep the line fixed and confirm with horizontal structure instead." },
    ],
    correct: "b",
    explanation: "Breaking a rising line shows the rise slowed. A change of trend needs structure: a close under the last swing low, or the peak-trough sequence turning to lower highs and lower lows. Until then, it can be a pause.",
    lesson: "2.2.1",
    concepts: ["trendlines-and-channels", "trend"],
    hints: ["Ask what the line break proves and what it doesn't.", "Trends are defined by swing highs and lows, not by the lines drawn on them."],
  },
  {
    id: "q-2.2.1-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why can't a regression channel fitted to the whole chart be used as a rule in a backtest?",
    options: [
      { id: "a", label: "It is too wide to give clear signals", rationale: "Width is a setting, plus or minus k standard deviations. The flaw is when the line is computed, not how wide it is." },
      { id: "b", label: "It has too few touches to count as a valid line", rationale: "A regression line isn't drawn through touches. It's fitted to every close on screen, including later ones." },
      { id: "c", label: "Regression lines only work on a log scale", rationale: "The scale changes the fit, not the problem. Any fit over the whole chart includes candles that came later." },
      { id: "d", label: "Its values at old candles change as new candles are added, so each signal uses later data" },
    ],
    correct: "d",
    explanation: "A best-fit line through every close moves when a candle is added, so its value at an old candle depends on candles after it. A backtest that uses it reads the future: look-ahead. A parallel channel drawn from past swings stays fixed.",
    lesson: "2.2.1",
    concepts: ["trendlines-and-channels"],
    hints: ["Think about which candles the fit uses to place the line at an old candle.", "In the lesson, refitting with 40 closes moved candle 30's value from 103.26 to 102.75."],
  },

  // 2.2.2
  {
    id: "q-2.2.2-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "In the life of a chart pattern, which of these can only come after the breakout?",
    options: [
      { id: "a", label: "Volume fading inside the pattern", rationale: "Fading volume belongs to the pattern's build-up, while price still swings between the boundaries." },
      { id: "b", label: "A throwback to the broken boundary" },
      { id: "c", label: "A third touch of one boundary", rationale: "Touches build the boundaries. They come before any breakout." },
      { id: "d", label: "The prior trend into the area", rationale: "The prior trend comes first: a pattern needs something to continue or reverse." },
    ],
    correct: "b",
    explanation: "The order: prior trend, boundaries and touches, fading volume, the breakout and its confirmation; then the measured target, the invalidation level and a possible throwback, all read in context. A throwback needs a broken edge to return to.",
    lesson: "2.2.2",
    concepts: ["chart-pattern-anatomy"],
  },
  {
    id: "q-2.2.2-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "Resistance sits at 104.00 and ATR(14) is 0.40. How much higher is the 3% confirmation level than the 0.5 × ATR level?",
    numeric: { answer: 2.92, tolerance: 0.01, unit: "vUSD" },
    explanation: "3%: 104.00 × 1.03 = 107.12. 0.5 × ATR: 104.00 + 0.20 = 104.20. They're 2.92 apart, more than 7 ATR. The 3% rule was built for daily stock charts; on LABX 1H it would confirm almost nothing.",
    lesson: "2.2.2",
    concepts: ["breakout-confirmation-filters"],
    hints: ["Work out each confirmation level, then subtract.", "3%: 104.00 × 1.03. ATR filter: 104.00 + 0.5 × 0.40.", "107.12 − 104.20."],
    vary: {
      fields: { lvl: [96, 110, 1], atr: [0.3, 0.6, 0.02] },
      answer: "round(lvl * 0.03 - 0.5 * atr, 2)",
      prompt: "Resistance sits at {lvl:2} and ATR(14) is {atr:2}. How much higher is the 3% confirmation level than the 0.5 × ATR level?",
      explanation: "3%: {lvl:2} × 1.03 = {lvl * 1.03:2}. 0.5 × ATR: {lvl:2} + {0.5 * atr:2} = {lvl + 0.5 * atr:2}. They're {answer:2} apart. On LABX 1H the 3% level is many ATRs away and would confirm almost nothing.",
      hint: "{lvl * 1.03:2} − {lvl + 0.5 * atr:2}.",
    },
  },
  {
    id: "q-2.2.2-3",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A pattern 2.50 tall breaks out upward at 101.00. Past patterns of this kind reached the full target 60% of the time. Where is the scaled target?",
    numeric: { answer: 102.5, tolerance: 0.01, unit: "vUSD" },
    explanation: "Scaled distance = 2.50 × 0.60 = 1.50; target = 101.00 + 1.50 = 102.50. The full-height target, 103.50, was reached only 60% of the time, so the scaled target is the more honest plan.",
    lesson: "2.2.2",
    concepts: ["pattern-target"],
    hints: ["Scale the height first, then project it from the breakout.", "2.50 × 0.60 = 1.50.", "101.00 + 1.50."],
    vary: {
      fields: { h: [1.5, 4, 0.1], b: [98, 106, 0.5], p: [45, 80, 1] },
      answer: "round(b + h * p / 100, 2)",
      prompt: "A pattern {h:2} tall breaks out upward at {b:2}. Past patterns of this kind reached the full target {p}% of the time. Where is the scaled target?",
      explanation: "Scaled distance = {h:2} × {p / 100:2} = {h * p / 100:2}; target = {b:2} + {h * p / 100:2} = {answer:2}. The full-height target, {b + h:2}, was reached only {p}% of the time.",
      hint: "{b:2} + {h:2} × {p / 100:2}.",
    },
  },

  // 2.2.3
  {
    id: "q-2.2.3-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "When does a double top exist?",
    options: [
      { id: "a", label: "As soon as a second peak forms near the first", rationale: "Two peaks are only a range so far. In Bulkowski's data about 60% of unconfirmed twin peaks kept rising." },
      { id: "b", label: "When the second peak's candle has a long upper wick", rationale: "A wick shows one candle's rejection. The pattern needs the valley broken on a close." },
      { id: "c", label: "When price touches the valley between the peaks", rationale: "A touch is a test, not a break. Confirmation is a close beyond the level." },
      { id: "d", label: "Once a candle closes under the valley between the two peaks" },
    ],
    correct: "d",
    explanation: "The valley between the peaks is the confirmation level. Before a close under it, twin peaks are a range that often keeps rising; after it, the double top exists and its target and stop can be measured.",
    lesson: "2.2.3",
    concepts: ["double-tops-and-bottoms"],
  },
  {
    id: "q-2.2.3-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A double bottom has lows of 95.50 and 95.70, with a peak of 98.50 between them. It just closed above 98.50. Eve & Eve bottoms reached the full target 65% of the time. Where is the scaled target?",
    numeric: { answer: 100.45, tolerance: 0.01, unit: "vUSD" },
    explanation: "Height = 98.50 − 95.50 = 3.00, from the lower low to the peak. Scaled: 3.00 × 0.65 = 1.95, projected from the confirmation level: 98.50 + 1.95 = 100.45.",
    lesson: "2.2.3",
    concepts: ["double-tops-and-bottoms", "pattern-target"],
    hints: ["The height runs from the lower low up to the peak between the lows.", "Height 3.00 × 0.65 = 1.95.", "98.50 + 1.95."],
    vary: {
      fields: { low: [94, 100, 0.1], h: [1.5, 4.5, 0.1], d: [0.05, 0.3, 0.05] },
      answer: "round(low + h + h * 0.65, 2)",
      prompt: "A double bottom has lows of {low:2} and {low + d:2}, with a peak of {low + h:2} between them. It just closed above {low + h:2}. Eve & Eve bottoms reached the full target 65% of the time. Where is the scaled target?",
      explanation: "Height = {low + h:2} − {low:2} = {h:2}. Scaled: {h:2} × 0.65 = {h * 0.65:2}, projected from the peak: {low + h:2} + {h * 0.65:2} = {answer:2}.",
      hint: "{low + h:2} + {h:2} × 0.65.",
    },
  },
  {
    id: "q-2.2.3-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 3,
    scenario: "Two ways to trade the same double tops, tested after costs. A sells at the second peak: it wins 30% of the time, +3.0R on average, and loses 1R. B sells on the confirming close: it wins 65% of the time, +0.4R on average, and loses 1R.",
    prompt: "Which method has the better expectancy?",
    options: [
      { id: "a", label: "A: +0.20R a trade, against −0.09R for B" },
      { id: "b", label: "B, because it wins more than twice as often", rationale: "Win rate ignores size. B's wins are small: 0.65 × 0.4 − 0.35 × 1 = −0.09R a trade." },
      { id: "c", label: "They're the same once costs are counted", rationale: "These results are already after costs, and they differ: +0.20R against −0.09R." },
      { id: "d", label: "They can't be compared without the targets", rationale: "Average wins and losses in R already reflect where targets and stops sat. Expectancy compares them directly." },
    ],
    correct: "a",
    explanation: "Expectancy = win rate × average win − loss rate × average loss. A: 0.30 × 3.0 − 0.70 × 1 = +0.20R. B: 0.65 × 0.4 − 0.35 × 1 = −0.09R. The higher win rate belongs to the worse method. The numbers are made up for the exercise.",
    lesson: "2.2.3",
    concepts: ["anticipation-vs-confirmation", "expectancy"],
    hints: ["Work out each method's expectancy in R.", "A: 0.30 × 3.0 − 0.70 × 1.", "B: 0.65 × 0.4 − 0.35 × 1."],
  },

  // 2.2.4
  {
    id: "q-2.2.4-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Peaks at 104.80 (candle 8), 106.00 (candle 17) and 104.70 (candle 26) follow a rise, with lows of 103.00 on candles 12 and 22. Which is the right shoulder?",
    options: [
      { id: "a", label: "106.00, on candle 17", rationale: "That's the head: the highest peak, in the middle." },
      { id: "b", label: "104.80, on candle 8", rationale: "That's the left shoulder, the first of the three peaks." },
      { id: "c", label: "104.70, on candle 26" },
      { id: "d", label: "103.00, on candle 22", rationale: "That's a low between the head and the right shoulder: one end of the neckline." },
    ],
    correct: "c",
    explanation: "The right shoulder is the third peak, after the head: 104.70 on candle 26. The shoulders, 104.80 and 104.70, sit at almost the same height either side of the 106.00 head, and the neckline joins the lows between them.",
    lesson: "2.2.4",
    concepts: ["head-and-shoulders"],
  },
  {
    id: "q-2.2.4-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A head-and-shoulders top has its head at 106.50 and a flat neckline at 104.50. Tops reached the full target 51% of the time. Where is the scaled target after a close under the neckline?",
    numeric: { answer: 103.48, tolerance: 0.01, unit: "vUSD" },
    explanation: "Height = 106.50 − 104.50 = 2.00. Scaled: 2.00 × 0.51 = 1.02. A top breaks down, so subtract from the neckline: 104.50 − 1.02 = 103.48. The full target, 102.50, was reached only half the time.",
    lesson: "2.2.4",
    concepts: ["head-and-shoulders", "pattern-target"],
    hints: ["Height: head minus neckline. Scale it, then subtract it from the neckline.", "2.00 × 0.51 = 1.02.", "104.50 − 1.02."],
    vary: {
      fields: { n: [98, 106, 0.1], h: [1.5, 4, 0.1] },
      answer: "round(n - h * 0.51, 2)",
      prompt: "A head-and-shoulders top has its head at {n + h:2} and a flat neckline at {n:2}. Tops reached the full target 51% of the time. Where is the scaled target after a close under the neckline?",
      explanation: "Height = {n + h:2} − {n:2} = {h:2}. Scaled: {h:2} × 0.51 = {h * 0.51:2}. Subtract from the neckline: {n:2} − {h * 0.51:2} = {answer:2}.",
      hint: "{n:2} − {h:2} × 0.51.",
    },
  },
  {
    id: "q-2.2.4-3",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "An inverse head and shoulders has its head at 93.50 and a flat neckline at 96.50. Inverse patterns reached the full target 71% of the time. Where is the scaled target after a close above the neckline?",
    numeric: { answer: 98.63, tolerance: 0.01, unit: "vUSD" },
    explanation: "Height = 96.50 − 93.50 = 3.00. Scaled: 3.00 × 0.71 = 2.13. An inverse pattern breaks up, so add to the neckline: 96.50 + 2.13 = 98.63.",
    lesson: "2.2.4",
    concepts: ["head-and-shoulders", "pattern-target"],
    hints: ["Height: neckline minus head. Scale it, then add it to the neckline.", "3.00 × 0.71 = 2.13.", "96.50 + 2.13."],
    vary: {
      fields: { n: [94, 102, 0.1], h: [1.5, 4, 0.1] },
      answer: "round(n + h * 0.71, 2)",
      prompt: "An inverse head and shoulders has its head at {n - h:2} and a flat neckline at {n:2}. Inverse patterns reached the full target 71% of the time. Where is the scaled target after a close above the neckline?",
      explanation: "Height = {n:2} − {n - h:2} = {h:2}. Scaled: {h:2} × 0.71 = {h * 0.71:2}. Add to the neckline: {n:2} + {h * 0.71:2} = {answer:2}.",
      hint: "{n:2} + {h:2} × 0.71.",
    },
  },

  // 2.2.5
  {
    id: "q-2.2.5-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "After a rise, LABX made peaks at 102.00, 101.95 and 102.00, with valleys at 100.05 and 100.00. Price is now 101.10. What is this so far?",
    options: [
      { id: "a", label: "A range: it becomes a triple top only after a close under 100.00" },
      { id: "b", label: "A triple top: three peaks at one price", rationale: "Three peaks describe the shape so far. Without a close under the lowest valley it's a range, and many ranges break upward." },
      { id: "c", label: "A sell signal, since the ceiling held three times", rationale: "Holding three times says the ceiling exists, not which way the range will break. Rectangles after a rise broke up 63% of the time." },
      { id: "d", label: "An ascending triangle", rationale: "An ascending triangle needs rising lows. These valleys are flat, 100.05 and 100.00." },
    ],
    correct: "a",
    explanation: "Until a close under the lowest valley, 100.00, three peaks are a rectangle: flat support and resistance. Many such ranges break upward. The triple top exists only once the floor breaks on a close.",
    lesson: "2.2.5",
    concepts: ["rectangles-and-triples", "range"],
  },
  {
    id: "q-2.2.5-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A rectangle runs from 98.50 to 100.00. Upward breakouts from rectangles reached the full target 78% of the time. Where is the scaled target of an upward breakout?",
    numeric: { answer: 101.17, tolerance: 0.01, unit: "vUSD" },
    explanation: "Height = 100.00 − 98.50 = 1.50. Scaled: 1.50 × 0.78 = 1.17, added to the top: 100.00 + 1.17 = 101.17. A downward breakout would use its own rate, 54%.",
    lesson: "2.2.5",
    concepts: ["rectangles-and-triples", "pattern-target"],
    hints: ["Height: top minus bottom. Scale it, then add it to the top.", "1.50 × 0.78 = 1.17.", "100.00 + 1.17."],
    vary: {
      fields: { lo: [96, 104, 0.1], h: [1, 3, 0.1] },
      answer: "round(lo + h + h * 0.78, 2)",
      prompt: "A rectangle runs from {lo:2} to {lo + h:2}. Upward breakouts from rectangles reached the full target 78% of the time. Where is the scaled target of an upward breakout?",
      explanation: "Height = {h:2}. Scaled: {h:2} × 0.78 = {h * 0.78:2}, added to the top: {lo + h:2} + {h * 0.78:2} = {answer:2}.",
      hint: "{lo + h:2} + {h:2} × 0.78.",
    },
  },
  {
    id: "q-2.2.5-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "Inside a rectangle from 100.00 to 102.00, price rises from the floor to 101.20 and turns down without reaching the ceiling.",
    prompt: "How should you read this partial rise?",
    options: [
      { id: "a", label: "As a confirmed short: the breakout will be down", rationale: "In Bulkowski's data about one in four still broke up. A tilt doesn't replace the close beyond the floor." },
      { id: "b", label: "As noise: moves inside a range mean nothing", rationale: "It's one of the few quantified signs: after partial rises, 75% of breakouts went down in his data. Weak, but not nothing." },
      { id: "c", label: "As a sign the ceiling will break next", rationale: "That's the tilt of a partial decline. A rise that stalls short of the top tilts the odds down." },
      { id: "d", label: "As a tilt toward a downward breakout, still waiting for a close under 100.00" },
    ],
    correct: "d",
    explanation: "After a partial rise, Bulkowski's rectangles broke down 75% of the time; after a partial decline, up 79%. That's a lean from one data set of US stocks, so you still wait for a close beyond the boundary and plan for being wrong.",
    lesson: "2.2.5",
    concepts: ["rectangles-and-triples"],
    hints: ["Recall which way partial rises tilted the breakout in the data.", "A tilt changes the odds, not the need for a confirming close."],
  },

  // 2.2.6
  {
    id: "q-2.2.6-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "A pattern's swing highs are 104.00, 104.03 and 103.98. Its swing lows are 100.50, 101.40 and 102.30. What is it?",
    options: [
      { id: "a", label: "A descending triangle", rationale: "A descending triangle has a flat bottom under falling highs. Here the top is flat and the lows rise." },
      { id: "b", label: "An ascending triangle" },
      { id: "c", label: "A symmetrical triangle", rationale: "A symmetrical triangle needs falling highs. These highs are flat, within 0.05 of each other." },
      { id: "d", label: "A rising wedge", rationale: "In a rising wedge both lines rise. Here the upper line is flat." },
    ],
    correct: "b",
    explanation: "A flat top near 104.00 over lows that rise 0.90 a swing: an ascending triangle. The slopes give the name; the breakout's direction still comes from the data and the close.",
    lesson: "2.2.6",
    concepts: ["triangles"],
  },
  {
    id: "q-2.2.6-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Descending triangles are taught as bearish. What did Bulkowski's data show about the direction of their breakouts?",
    options: [
      { id: "a", label: "Most broke down, about three in four", rationale: "That's the textbook story. The count was 53% up and 47% down." },
      { id: "b", label: "Almost all broke down once volume faded", rationale: "Volume fades in most triangles. It didn't make the descending ones break down." },
      { id: "c", label: "About half broke upward: 53%, and 63% when price had risen into the pattern" },
      { id: "d", label: "They never broke upward", rationale: "More than half did. The shape's reputation and its count disagree." },
    ],
    correct: "c",
    explanation: "53% of descending triangles broke out upward, 63% when price had risen into the pattern. The name suggests sellers; the count is close to a coin flip. Wait for the close beyond a boundary.",
    lesson: "2.2.6",
    concepts: ["triangles"],
    hints: ["Separate the textbook label from the count.", "The count was close to a coin flip, slightly upward."],
  },
  {
    id: "q-2.2.6-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 3,
    scenario: "An ascending triangle with a flat top at 104.00 breaks downward: a candle closes under its rising lower line at 102.80. You're considering a short.",
    prompt: "What should your plan take into account?",
    options: [
      { id: "a", label: "The bias is 63% upward, so the breakdown will fail: buy instead", rationale: "37% did break down. Buying against the close you just saw, on the bias alone, ignores the confirmation." },
      { id: "b", label: "Breaking against the bias makes the move extra strong: size up", rationale: "Nothing in the data says so. Downward breakouts from ascending triangles ranked 30th of 36." },
      { id: "c", label: "Nothing more: the confirming close settles the direction", rationale: "Confirmation filters some false moves, not all. 38% of these downward breakouts still failed." },
      { id: "d", label: "Downward breakouts here were weak: plan for a close back inside and for a bust up through 104.00" },
    ],
    correct: "d",
    explanation: "Ascending triangles broke up 63% of the time. Those that broke down failed 38% of the time and reached the target only 44%, rank 30 of 36. A short is allowed, but the plan must cover a close back inside and a bust through the top.",
    lesson: "2.2.6",
    concepts: ["triangles", "busted-patterns"],
    hints: ["Look at how downward breakouts from this triangle performed.", "They failed 38% of the time and met the target 44%. What must the plan cover?"],
  },

  // 2.2.7
  {
    id: "q-2.2.7-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "After a steep rise, LABX pauses for 30 candles between two flat, parallel lines. What is the pause?",
    options: [
      { id: "a", label: "A flag", rationale: "A flag is brief, 5–20 candles on LABX 1H, and slopes against the pole. Thirty flat candles is too long." },
      { id: "b", label: "A pennant", rationale: "A pennant's lines converge, like a small triangle. These are parallel." },
      { id: "c", label: "A measured move", rationale: "A measured move is a projection from three swing points, not the shape of a pause." },
      { id: "d", label: "A rectangle: too long to be a flag" },
    ],
    correct: "d",
    explanation: "Pole first, then shape, then length. Flags and pennants are brief pauses after a steep pole; a flat, parallel pause that runs for 30 candles is a rectangle, with its own statistics.",
    lesson: "2.2.7",
    concepts: ["flags-and-pennants"],
  },
  {
    id: "q-2.2.7-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A flagpole ran from 98.00 to 101.00. The flag breaks out upward at 100.60. Flags reached the half-mast target 46% of the time. Where is the scaled target?",
    numeric: { answer: 101.98, tolerance: 0.01, unit: "vUSD" },
    explanation: "Pole = 101.00 − 98.00 = 3.00. Scaled: 3.00 × 0.46 = 1.38, from the breakout: 100.60 + 1.38 = 101.98. Half-mast, 103.60, was reached less than half the time.",
    lesson: "2.2.7",
    concepts: ["flags-and-pennants", "pattern-target"],
    hints: ["Measure the pole, scale it, then add it to the breakout price.", "3.00 × 0.46 = 1.38.", "100.60 + 1.38."],
    vary: {
      fields: { b: [98, 106, 0.1], pole: [2, 5, 0.1] },
      answer: "round(b + pole * 0.46, 2)",
      prompt: "A flagpole rose {pole:2}. The flag breaks out upward at {b:2}. Flags reached the half-mast target 46% of the time. Where is the scaled target?",
      explanation: "Scaled: {pole:2} × 0.46 = {pole * 0.46:2}, from the breakout: {b:2} + {pole * 0.46:2} = {answer:2}. Half-mast, {b + pole:2}, was reached less than half the time.",
      hint: "{b:2} + {pole:2} × 0.46.",
    },
  },
  {
    id: "q-2.2.7-3",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A measured move: A 96.00, B 99.50, C 98.00. Project D at 60% of leg AB, measured from C.",
    numeric: { answer: 100.1, tolerance: 0.01, unit: "vUSD" },
    explanation: "AB = 99.50 − 96.00 = 3.50. 60% of it is 2.10, added to C: 98.00 + 2.10 = 100.10. D100 would be 101.50; second legs usually ran shorter than the first.",
    lesson: "2.2.7",
    concepts: ["measured-move"],
    hints: ["Measure leg AB, take 60% of it, and add it to C.", "AB = 3.50; 3.50 × 0.60 = 2.10.", "98.00 + 2.10."],
    vary: {
      fields: { a: [94, 102, 0.1], ab: [2, 5, 0.1], bc: [0.8, 2.5, 0.1] },
      constraints: ["bc < ab * 0.8"],
      answer: "round(a + ab - bc + ab * 0.6, 2)",
      prompt: "A measured move: A {a:2}, B {a + ab:2}, C {a + ab - bc:2}. Project D at 60% of leg AB, measured from C.",
      explanation: "AB = {ab:2}. 60% of it is {ab * 0.6:2}, added to C: {a + ab - bc:2} + {ab * 0.6:2} = {answer:2}. Second legs usually ran shorter than the first.",
      hint: "{a + ab - bc:2} + {ab:2} × 0.60.",
    },
  },

  // 2.2.8
  {
    id: "q-2.2.8-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Swing highs: 105.00, 104.00, 103.00. Swing lows: 103.50, 103.00, 102.50. What shape do the two lines make?",
    options: [
      { id: "a", label: "A falling wedge" },
      { id: "b", label: "A rising wedge", rationale: "In a rising wedge both lines rise. Here both fall." },
      { id: "c", label: "A falling channel", rationale: "Channel lines are parallel. Here the highs fall 1.00 a swing and the lows 0.50, so the gap shrinks from 1.50 to 0.50." },
      { id: "d", label: "A descending triangle", rationale: "A descending triangle has a flat bottom. These lows fall." },
    ],
    correct: "a",
    explanation: "Both lines fall, the upper one faster: 1.00 a swing against 0.50. Same direction and converging is a wedge; falling, it's a falling wedge, which broke out upward 68% of the time in Bulkowski's data.",
    lesson: "2.2.8",
    concepts: ["wedges-and-broadening"],
  },
  {
    id: "q-2.2.8-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Rising wedges are taught as bearish. What did Bulkowski's data show for those that broke down?",
    options: [
      { id: "a", label: "They were among the most reliable downward patterns", rationale: "The reverse: rank 36 of 36, last among downward breakouts." },
      { id: "b", label: "Most of them reached the full target", rationale: "Downward breakouts reached the full target only 32% of the time." },
      { id: "c", label: "60% broke down, but 51% of those failed to fall even 5%" },
      { id: "d", label: "Hardly any broke down; they broke up", rationale: "60% did break down. The weakness was in what followed: half of those breakdowns failed." },
    ],
    correct: "c",
    explanation: "Most rising wedges broke down, 60%, but 51% of those breakdowns failed to fall 5% before turning, the weakest result of 36 downward patterns. With a stop beyond the upper line, the scaled target often pays less than the risk.",
    lesson: "2.2.8",
    concepts: ["wedges-and-broadening"],
    hints: ["Separate how often they broke down from what happened next.", "Failure here means falling less than 5% before turning back."],
  },
  {
    id: "q-2.2.8-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why are broadening formations and diamonds hard to trade?",
    options: [
      { id: "a", label: "They form only in quiet markets", rationale: "The reverse: their swings grow with volatility. That's what pushes stops away." },
      { id: "b", label: "They're rare, drawn subjectively, and their widening swings push stops far away" },
      { id: "c", label: "Their breakouts always fail", rationale: "Diamonds ranked 3rd of 36 downward. The trouble is few, subjective cases, not certain failure." },
      { id: "d", label: "Their targets can't be measured", rationale: "Bulkowski gives targets for both. Spotting them consistently is the problem, not measuring them." },
    ],
    correct: "b",
    explanation: "Megaphones and diamonds are rare, so their statistics rest on few cases; two people rarely draw them the same way; and growing swings put a sensible stop far from the entry. Bulkowski calls broadening formations poor performers.",
    lesson: "2.2.8",
    concepts: ["wedges-and-broadening"],
    hints: ["Think about how many cases, how they're drawn, and where the stop goes.", "Widening swings mean the opposite boundary keeps moving away."],
  },

  // 2.2.9
  {
    id: "q-2.2.9-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Why does a rounding bottom become clear only late?",
    options: [
      { id: "a", label: "Its volume can only be read once it's complete", rationale: "Volume can be read candle by candle. The delay comes from the confirmation level, the left rim." },
      { id: "b", label: "It forms only on weekly charts", rationale: "Bowls appear on any timeframe. The issue is where it confirms, not which chart shows it." },
      { id: "c", label: "It's confirmed only by a close above the left rim, after most of the rise from the low" },
      { id: "d", label: "Its lowest candle must be a hammer", rationale: "No single candle defines the bowl. It's the slow turn, then the close above the rim." },
    ],
    correct: "c",
    explanation: "A slow bowl looks like any decline until its right side is built. It confirms on a close above the left rim, and by then much of the rise from the bottom is done: in the lesson, 4.34 of it.",
    lesson: "2.2.9",
    concepts: ["rounding-and-v-patterns"],
  },
  {
    id: "q-2.2.9-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A cup with handle has its rim at 103.00 and its bottom at 98.00. Cups reached the full target 61% of the time. Where is the scaled target after a close above the rim?",
    numeric: { answer: 106.05, tolerance: 0.01, unit: "vUSD" },
    explanation: "Depth = 103.00 − 98.00 = 5.00. Scaled: 5.00 × 0.61 = 3.05, added to the rim: 103.00 + 3.05 = 106.05.",
    lesson: "2.2.9",
    concepts: ["rounding-and-v-patterns", "pattern-target"],
    hints: ["Depth: rim minus bottom. Scale it, then add it to the rim.", "5.00 × 0.61 = 3.05.", "103.00 + 3.05."],
    vary: {
      fields: { rim: [100, 108, 0.1], d: [3, 8, 0.1] },
      answer: "round(rim + d * 0.61, 2)",
      prompt: "A cup with handle has its rim at {rim:2} and its bottom at {rim - d:2}. Cups reached the full target 61% of the time. Where is the scaled target after a close above the rim?",
      explanation: "Depth = {d:2}. Scaled: {d:2} × 0.61 = {d * 0.61:2}, added to the rim: {rim:2} + {d * 0.61:2} = {answer:2}.",
      hint: "{rim:2} + {d:2} × 0.61.",
    },
  },
  {
    id: "q-2.2.9-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 3,
    scenario: "Two Library cards. Pattern X: rank 1 of 39, 3% failures, from 38 cases, its angles drawn by eye. Pattern Y: rank 7 of 39, 4% failures, from 900 cases, with a fixed drawing rule.",
    prompt: "How should you weigh the two cards?",
    options: [
      { id: "a", label: "Trust X more: it ranks first", rationale: "With 38 cases, a few lucky trades can lift a pattern to the top. A small sample makes the rank unstable." },
      { id: "b", label: "Treat them as equal: both rank in the top ten", rationale: "Ranks hide how much evidence stands behind them. 900 cases with a fixed rule beat 38 drawn by eye." },
      { id: "c", label: "Trust Y more: many more cases and a rule anyone can repeat" },
      { id: "d", label: "Ignore both: rare patterns are random", rationale: "Rare isn't random. Read the sample size and the drawing rule, and weigh the evidence accordingly." },
    ],
    correct: "c",
    explanation: "A rank from 38 cases moves a lot with a few trades, and a pattern drawn by eye may not be the same pattern from one analyst to the next. Y's 900 cases and fixed rule make its numbers far more stable. Both still come from daily stock charts.",
    lesson: "2.2.9",
    concepts: ["sample-size"],
    hints: ["How much could a few lucky trades move a rank built on 38 cases?", "Also ask whether two analysts would find the same cases."],
  },

  // 2.2.10
  {
    id: "q-2.2.10-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "A scanner finds head-and-shoulders tops in 10,000 random walks. What does the lab show about the moves that follow them?",
    options: [
      { id: "a", label: "Prices fall, as the textbook says", rationale: "In a random walk each step ignores the past, so no shape can tilt the next move." },
      { id: "b", label: "No patterns are found in random data", rationale: "Random walks contain every shape. The scanner finds many." },
      { id: "c", label: "Prices rise, because most patterns fail", rationale: "Failure isn't built in either. Up and down stay equally likely after any shape." },
      { id: "d", label: "They match what follows any candle: the base rate" },
    ],
    correct: "d",
    explanation: "Random walks are full of patterns, but nothing in them predicts the next step, so what follows a pattern matches the unconditional distribution. A pattern earns attention only if, on real data and after costs, what follows it beats that base rate.",
    lesson: "2.2.10",
    concepts: ["base-rates", "random-walk"],
    hints: ["What does each step of a random walk depend on?", "Compare the moves after a pattern with the moves after any candle."],
  },
  {
    id: "q-2.2.10-2",
    topic: "scenario_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "You bought an ascending triangle's breakout at 104.35 with a stop at 103.30. The next candle closed back inside at 103.85 and you exited, as planned. Two candles later price closes under the triangle's lower line: the pattern is busted.",
    prompt: "What does a good plan say now?",
    options: [
      { id: "a", label: "Buy again: it's cheaper than your entry", rationale: "That's buying into an idea the market has now rejected twice, with no plan behind it." },
      { id: "b", label: "Short twice your usual size to win back the loss", rationale: "Sizing up to recover a loss is revenge trading. A new trade gets normal size and its own stop." },
      { id: "c", label: "Stand aside, or trade the bust only with a new plan: its own entry, stop and size" },
      { id: "d", label: "Re-enter the long with the old stop at 103.30", rationale: "The old stop belonged to a breakout that failed. Reusing it means holding an idea that's already wrong." },
    ],
    correct: "c",
    explanation: "A bust is a new situation, not a continuation of the old trade. Written in advance, the plan says: exit on a close back inside, then stand aside or trade the bust as a fresh setup with normal size and its own stop. Never add to recover.",
    lesson: "2.2.10",
    concepts: ["busted-patterns", "scenario-planning"],
    hints: ["The old trade ended at the failure. Treat what comes next as a new decision.", "Any new trade needs its own entry, stop and size."],
  },
  {
    id: "q-2.2.10-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Bulkowski's share of breakouts that failed to gain 10% roughly doubled from the 1990s to 2003–2007. What does that mean for a pattern statistic published today?",
    options: [
      { id: "a", label: "It describes its sample's period; expect it to differ, often for the worse, in another era" },
      { id: "b", label: "It's wrong and should be ignored", rationale: "It was right for its sample. The lesson is scope: read it as that period's average, not as a law." },
      { id: "c", label: "It holds in any market, since patterns reflect human nature", rationale: "The doubling itself shows the rates move with the era and the market." },
      { id: "d", label: "It's more reliable now that more traders use patterns", rationale: "Wider use tends to shrink edges: 97 published return predictors earned 58% less after publication." },
    ],
    correct: "a",
    explanation: "Failure rates rose from 14% to 28% upward and from 26% to 49% downward between the two periods. Any published rate is that sample's average: market, years, timeframe. Edges also shrink once known, so expect less in your own tests.",
    lesson: "2.2.10",
    concepts: ["base-rates"],
    hints: ["Ask what period and market the statistic came from.", "If the rate doubled once, could it change again?"],
  },
];

// ─── Glossary terms ─────────────────────────────────────────────────────────

const terms: GlossaryTerm[] = [
  {
    id: "trendline",
    term: "Trendline",
    definition: "A straight line through rising swing lows (an uptrend line) or through falling swing highs (a downtrend line). Two points draw it; a third touch confirms it.",
    plain: "A sloping line under the lows of a rise, or over the highs of a fall.",
    related: ["swing-low", "swing-high", "channel", "trend"],
    lesson: "2.2.1",
    aka: ["Trend line"],
  },
  {
    id: "channel",
    term: "Channel",
    definition: "A trendline plus a parallel line through the most extreme swing on the opposite side, with price moving between the two.",
    plain: "Two parallel sloping lines that contain price, like the banks of a river.",
    related: ["trendline", "trend"],
    lesson: "2.2.1",
  },
  {
    id: "throwback",
    term: "Throwback",
    definition: "A return to a broken boundary soon after an upward breakout. Bulkowski calls the same return after a downward breakout a pullback, which is a different sense from a pullback within a trend.",
    plain: "Price comes back to test the level it just broke through.",
    related: ["breakout", "pullback"],
    lesson: "2.2.2",
    aka: ["Retest"],
  },
  {
    id: "breakout-filter",
    term: "Breakout filter",
    definition: "A rule a breakout must pass before it counts, such as a close beyond the level by part of the ATR, by a percentage, two closes in a row, or a gap through it.",
    plain: "An extra test that weeds out some false breakouts, at the price of a later entry.",
    related: ["breakout", "false-breakout", "atr"],
    lesson: "2.2.2",
    aka: ["Confirmation filter"],
  },
  {
    id: "pattern-height",
    term: "Pattern height",
    definition: "The distance from a pattern's extreme to its breakout line, such as from a head to the neckline. Projected from the breakout, it gives the pattern's target.",
    plain: "How tall the pattern is; it's used to estimate how far price might travel after the breakout.",
    related: ["breakout", "neckline"],
    lesson: "2.2.2",
  },
  {
    id: "double-top",
    term: "Double top",
    definition: "Two peaks near the same price with a valley between them. It is confirmed only when price closes below that valley.",
    plain: "Two failed pushes at the same high, which count as a pattern only once the low between them breaks.",
    related: ["double-bottom", "swing-high", "resistance"],
    lesson: "2.2.3",
  },
  {
    id: "double-bottom",
    term: "Double bottom",
    definition: "Two lows near the same price with a peak between them. It is confirmed only when price closes above that peak.",
    plain: "Two bounces from the same low, which count as a pattern only once the high between them breaks.",
    related: ["double-top", "swing-low", "support"],
    lesson: "2.2.3",
  },
  {
    id: "head-and-shoulders",
    term: "Head and shoulders",
    definition: "Three peaks after a rise, the middle one (the head) highest, with a neckline through the lows between them. It is confirmed by a close beyond the neckline; the inverse pattern forms at bottoms.",
    plain: "Three peaks where the middle one stands tallest, like a head between two shoulders.",
    related: ["neckline", "double-top", "pattern-height"],
    lesson: "2.2.4",
    aka: ["H&S"],
  },
  {
    id: "neckline",
    term: "Neckline",
    definition: "The line through the two lows between a head-and-shoulders top's peaks, or through the two highs in the inverse pattern. A close beyond it confirms the pattern.",
    plain: "The line under the shoulders and the head that price has to break for the pattern to count.",
    related: ["head-and-shoulders", "pattern-height"],
    lesson: "2.2.4",
  },
  {
    id: "triple-top",
    term: "Triple top",
    definition: "Three peaks near one price, confirmed only by a close below the lowest valley between them. The triple bottom is its mirror.",
    plain: "Three failed pushes at the same high. Until the floor breaks, it's just a range.",
    related: ["double-top", "rectangle", "resistance"],
    lesson: "2.2.5",
    aka: ["Triple bottom"],
  },
  {
    id: "rectangle",
    term: "Rectangle",
    definition: "A sideways range between nearly flat support and resistance, with at least three touches on one boundary and two on the other.",
    plain: "A box that price bounces around in until it breaks out of one side.",
    related: ["range", "support", "resistance", "triple-top"],
    lesson: "2.2.5",
  },
  {
    id: "partial-rise",
    term: "Partial rise",
    definition: "A swing inside a range that turns back before reaching the top. A partial decline is the mirror: it turns back before reaching the bottom.",
    plain: "A move across the box that gives up halfway, a hint about which side may break.",
    related: ["rectangle", "range"],
    lesson: "2.2.5",
    aka: ["Partial decline"],
  },
  {
    id: "ascending-triangle",
    term: "Ascending triangle",
    definition: "A triangle with a flat top and rising lows, with at least three touches on one line and two on the other.",
    plain: "Buyers keep stepping in higher under a ceiling that stays put.",
    related: ["descending-triangle", "symmetrical-triangle", "apex"],
    lesson: "2.2.6",
  },
  {
    id: "descending-triangle",
    term: "Descending triangle",
    definition: "A triangle with a flat bottom and falling highs. Despite its bearish reputation, about half broke out upward in Bulkowski's data.",
    plain: "Lower highs pressing down on a floor that stays put.",
    related: ["ascending-triangle", "symmetrical-triangle", "apex"],
    lesson: "2.2.6",
  },
  {
    id: "symmetrical-triangle",
    term: "Symmetrical triangle",
    definition: "A triangle whose upper line falls and lower line rises, converging toward the apex.",
    plain: "The swings get smaller from both sides until price has to pick a direction.",
    related: ["ascending-triangle", "descending-triangle", "apex", "pennant"],
    lesson: "2.2.6",
  },
  {
    id: "apex",
    term: "Apex",
    definition: "The point where a triangle's two boundary lines meet when extended.",
    plain: "The tip of the triangle, where the two lines cross.",
    related: ["symmetrical-triangle", "ascending-triangle", "descending-triangle"],
    lesson: "2.2.6",
  },
  {
    id: "flag",
    term: "Flag",
    definition: "A brief pause with parallel lines that slopes against a steep prior move, the flagpole. On LABX 1H the app counts 5 to 20 candles.",
    plain: "A short, small channel after a sharp move, tilted against it.",
    related: ["flagpole", "pennant", "channel"],
    lesson: "2.2.7",
  },
  {
    id: "pennant",
    term: "Pennant",
    definition: "A brief pause with converging lines after a steep move, like a small symmetrical triangle.",
    plain: "A short pause that narrows to a point after a sharp move.",
    related: ["flag", "flagpole", "symmetrical-triangle"],
    lesson: "2.2.7",
  },
  {
    id: "flagpole",
    term: "Flagpole",
    definition: "The steep move that comes before a flag or a pennant. The half-mast rule projects its length from the breakout.",
    plain: "The sharp run that the flag hangs from.",
    related: ["flag", "pennant"],
    lesson: "2.2.7",
    aka: ["Pole", "Mast"],
  },
  {
    id: "measured-move",
    term: "Measured move",
    definition: "A projection that a second leg, starting after a correction, will roughly equal the first leg. In Bulkowski's data the second leg was usually shorter.",
    plain: "The idea that the next push will be about as long as the last one; usually it's a bit shorter.",
    related: ["swing-high", "swing-low", "flagpole"],
    lesson: "2.2.7",
    aka: ["ABCD"],
  },
  {
    id: "high-tight-flag",
    term: "High tight flag",
    definition: "A flag after price nearly doubled within about two months. A stock-chart pattern with no equivalent on LABX 1H.",
    plain: "A rare stock pattern: a huge run, then a short pause.",
    related: ["flag", "flagpole"],
    lesson: "2.2.7",
  },
  {
    id: "wedge",
    term: "Wedge",
    definition: "A pattern with two lines sloping the same way and converging: rising, with the lower line steeper, or falling, with the upper line steeper.",
    plain: "A channel that narrows as it climbs or falls.",
    related: ["channel", "trendline", "broadening-formation"],
    lesson: "2.2.8",
    aka: ["Rising wedge", "Falling wedge"],
  },
  {
    id: "broadening-formation",
    term: "Broadening formation",
    definition: "A pattern with diverging lines: higher highs and lower lows, so the swings keep growing.",
    plain: "Swings that get wider each time, like the mouth of a megaphone.",
    related: ["wedge", "diamond-pattern", "volatility"],
    lesson: "2.2.8",
    aka: ["Megaphone"],
  },
  {
    id: "diamond-pattern",
    term: "Diamond",
    definition: "A pattern that first widens like a broadening formation, then narrows like a symmetrical triangle.",
    plain: "Swings that grow and then shrink, drawing a diamond shape.",
    related: ["broadening-formation", "symmetrical-triangle"],
    lesson: "2.2.8",
  },
  {
    id: "rounding-bottom",
    term: "Rounding bottom",
    definition: "A slow, bowl-shaped turn from falling to rising prices, confirmed by a close above the left rim. The rounding top is its mirror.",
    plain: "A gentle U-turn at the bottom that you can only name once it's nearly done.",
    related: ["cup-with-handle", "v-reversal"],
    lesson: "2.2.9",
    aka: ["Saucer"],
  },
  {
    id: "cup-with-handle",
    term: "Cup with handle",
    definition: "A U-shaped base with rims at similar prices, a short pullback (the handle) in its upper half, then a breakout above the rim.",
    plain: "A bowl, a small dip near the top edge, then a push through the edge.",
    related: ["rounding-bottom", "breakout"],
    lesson: "2.2.9",
  },
  {
    id: "v-reversal",
    term: "V reversal",
    definition: "A sharp turn with no pause: a steep fall followed at once by a steep rise, or the reverse. Its turning point can't be told from a pause in real time.",
    plain: "A sudden about-turn that is obvious afterwards and invisible while it happens.",
    related: ["rounding-bottom", "hindsight-bias"],
    lesson: "2.2.9",
    aka: ["V-bottom", "V-top"],
  },
  {
    id: "busted-pattern",
    term: "Busted pattern",
    definition: "A pattern that breaks out, fails to travel (less than 1 × ATR on LABX 1H), then closes beyond its opposite boundary.",
    plain: "A breakout that turns around and breaks out the other side instead.",
    related: ["false-breakout", "breakout"],
    lesson: "2.2.10",
    aka: ["Bust"],
  },
];

// ─── Concepts ───────────────────────────────────────────────────────────────

const concepts: Concept[] = [
  {
    id: "trendlines-and-channels",
    name: "Trendlines and channels",
    category: "technical_analysis",
    summary: "Lines through swing points that describe a trend; a break is a warning to confirm, not a signal.",
    body: [
      "A trendline joins swing lows in a rise or swing highs in a fall. Two points draw it, the second higher (or lower) than the first, and a third touch confirms it. Draw on wicks, judge breaks on closes. A parallel line through the opposite extreme makes a channel. The scale matters: a rise that compounds fits a straight line on a log scale, not on a linear one.",
      "Drawing is subjective: when Osler compared the levels currency firms published, they agreed only about 30% of the time. No robust study shows that a trendline break predicts a reversal (evidence D). Treat a break as a warning and confirm it with horizontal structure, such as a close under the last swing low. Regression channels refit with each new candle, so in a backtest they read the future.",
    ],
    example: "Swing lows at 100.00 (candle 4) and 101.00 (candle 12) give a line rising 0.125 a candle; candle 20's low, 102.00, touches it. Candle 27 closes at 102.77, under the line, but price then goes sideways and never closes under 102.00.",
    related: ["trend", "support-and-resistance", "swing-points", "log-scale"],
    missions: ["M02"],
    lessons: ["2.2.1"],
  },
  {
    id: "chart-pattern-anatomy",
    name: "Chart pattern anatomy",
    category: "technical_analysis",
    summary: "The parts every chart pattern shares: prior trend, boundaries, volume, breakout, target, invalidation and aftermath.",
    body: [
      "Bulkowski's anatomy fits every chart pattern: a prior trend to continue or reverse; boundaries with enough touches, at least three on one line and two on the other; volume that usually fades inside; a breakout confirmed by a close beyond a boundary; a target measured from the pattern's height; an invalidation level for the stop; a frequent throwback to the broken edge; and context that shifts the odds.",
      "The statistics attached to each part are base rates with a scope: US stocks, daily charts, measured to the ideal exit. Lo, Mamaysky and Wang (2000) found that patterns carry some information, and warned that what detects an anomaly need not make profits (evidence C).",
    ],
    example: "A rise from 97.00 meets a box: tops 102.00, 101.95 and 102.00, bottoms 100.00 and 100.05. Volume fades from 1,150 to 600, then candle 34 closes at 102.45 on 1,720. The stop goes under the last swing low inside, 101.00; a throwback reaches 102.05 before a high of 103.75.",
    related: ["breakout", "false-breakout", "invalidation-level", "base-rates"],
    missions: ["M04"],
    lessons: ["2.2.2"],
  },
  {
    id: "breakout-confirmation-filters",
    name: "Breakout filters",
    category: "technical_analysis",
    summary: "Rules that confirm a breakout, such as a close beyond the level by part of the ATR, trading entry price for fewer false signals.",
    body: [
      "A close beyond the boundary is the minimum. Filters ask for more: a margin in percent (1% or 3%), a margin in ATR (0.25 to 2 × ATR(14)), two closes in a row, or a gap through the level. Each one skips some false breakouts, and enters the real ones later and at a worse price.",
      "Percentage filters were built for stocks on daily charts. On LABX 1H, 3% of 104.00 is 3.12, about 8 ATR, so it would confirm almost nothing; the app's default is 0.5 × ATR. On a random walk no filter creates an edge: it changes how many trades you take, not their expectancy.",
    ],
    example: "Resistance 104.00, ATR(14) 0.40. Closes at 104.05 and 104.12 fall back inside on the next candle. A 0.5 × ATR filter (104.20) skips both and enters on the 104.32 close, 0.17 later than the first close beyond.",
    related: ["breakout", "false-breakout", "volatility"],
    missions: [],
    lessons: ["2.2.2"],
  },
  {
    id: "pattern-target",
    name: "Scaled pattern target",
    category: "technical_analysis",
    summary: "A target projected from a pattern's height and scaled by how often the full height was reached in past data.",
    body: [
      "The classic measure rule projects the pattern's height from the breakout: for a head-and-shoulders top, the distance from the head to the neckline, taken off the neckline. Bulkowski's data shows how often that full target was reached, and he recommends scaling it: target = breakout ± height × the share that reached it.",
      "The share differs by pattern and direction: 51% for head-and-shoulders tops, 71% for inverse ones, 78% for rectangles breaking up and 54% breaking down, 46% for flags. These come from US stocks on daily charts. Before any trade, compare the scaled target with the distance to the stop: many patterns offer less reward than risk.",
    ],
    example: "A head-and-shoulders top with its head at 106.00 and its neckline at 103.00 is 3.00 tall. The full target is 100.00; scaled by 51%, it is 103.00 − 1.53 = 101.47.",
    related: ["reward-to-risk", "base-rates", "chart-pattern-anatomy"],
    missions: ["M04"],
    lessons: ["2.2.2"],
  },
  {
    id: "double-tops-and-bottoms",
    name: "Double tops and bottoms",
    category: "technical_analysis",
    summary: "Two similar extremes with a valley or peak between them, confirmed only by a close beyond that level.",
    body: [
      "A double top is two peaks near the same price; the valley between them is the confirmation level, and the pattern exists only after a close below it. A double bottom is the mirror. On LABX 1H the app asks for peaks within 0.5 × ATR(14) of each other, at least 10 candles apart, with a valley at least 3 × ATR deep (an app convention).",
      "Without confirmation, about 60% of twin peaks kept rising in Bulkowski's data. Confirmed Adam & Adam tops failed 25% of the time and reached the full target 64%; Eve & Eve bottoms failed 12% and reached it 65% (evidence C). On a random walk twin peaks are common, and what follows them is the base rate.",
    ],
    example: "Peaks at 105.00 and 104.90 with a valley at 102.00: height 3.00. After a close under 102.00, the scaled target is 102.00 − 3.00 × 0.64 = 100.08; the full height would give 99.00.",
    related: ["support-and-resistance", "breakout", "base-rates"],
    missions: [],
    lessons: ["2.2.3"],
  },
  {
    id: "anticipation-vs-confirmation",
    name: "Anticipation versus confirmation",
    category: "technical_analysis",
    summary: "Entering before a signal completes for a better price, or after it for a higher hit rate, compared by expectancy.",
    body: [
      "An anticipation entry, such as selling at the second peak of a possible double top, gets a better price and a tighter stop and pays more per win, but many such setups never complete. A confirmation entry waits for the close beyond the level: it wins more often, but enters later, with a wider stop and less of the move left.",
      "Neither is better by default. Compare them by expectancy after costs on the same set of setups, never by win rate alone: a method that wins 65% of the time can still lose money if its wins are small.",
    ],
    example: "Selling at 104.33 near the second peak, with a stop at 105.10, risks 0.77 to make 4.25: about 5.5R before costs. Selling at 101.78 after the confirming close risks 3.32 to make 1.70: about 0.5R.",
    related: ["expectancy", "double-tops-and-bottoms", "false-breakout"],
    missions: [],
    lessons: ["2.2.3"],
  },
  {
    id: "head-and-shoulders",
    name: "Head and shoulders",
    category: "technical_analysis",
    summary: "Three peaks with the middle one highest and a neckline through the lows between them, or the inverse at bottoms.",
    body: [
      "After a rise, the left shoulder, the head and the right shoulder form three peaks: the head highest, the shoulders at similar heights and distances from it. The neckline joins the two lows between the peaks. A close under a flat or up-sloping neckline confirms the top; with a down-sloping neckline, Bulkowski confirms on a close under the right-hand low. The inverse pattern forms at bottoms.",
      "In Bulkowski's data, tops failed 19% of the time and reached the full target 51%; inverse patterns 11% and 71% (evidence C). Lo, Mamaysky and Wang found the shape added information in US stocks from 1962 to 1996, and Chang and Osler found it profitable in 2 of 6 currency pairs. Random walks produce the shape too.",
    ],
    example: "Shoulders at 104.80 and 104.70, the head at 106.00, lows of 103.00 and 103.00. Candle 31 closes at 102.57, under the neckline. Scaled target: 103.00 − 3.00 × 0.51 = 101.47; the fall reached 101.30.",
    related: ["chart-pattern-anatomy", "pattern-target", "random-walk"],
    missions: [],
    lessons: ["2.2.4"],
  },
  {
    id: "rectangles-and-triples",
    name: "Rectangles and triple tops/bottoms",
    category: "technical_analysis",
    summary: "Horizontal ranges with repeated tests of both edges, which remain ranges until a confirmed breakout.",
    body: [
      "A rectangle is a range between nearly flat support and resistance, with at least three touches on one side and two on the other. A triple top or bottom is the same box named after three tests of one edge: until a close beyond the lowest valley (or the highest peak), it's still a range, and many such ranges break the other way.",
      "In Bulkowski's data, rectangles that formed after a rise broke out upward 63% of the time; upward breakouts reached the full target 78% of the time, downward ones 54%. After a partial rise the breakout went down 75% of the time, and after a partial decline up 79%: a tilt from one data set, not a certainty.",
    ],
    example: "A box from 100.00 to 102.00 is 2.00 tall. Scaled targets: 102.00 + 2.00 × 0.78 = 103.56 upward, and 100.00 − 2.00 × 0.54 = 98.92 downward.",
    related: ["range", "support-and-resistance", "breakout"],
    missions: [],
    lessons: ["2.2.5"],
  },
  {
    id: "triangles",
    name: "Triangles",
    category: "technical_analysis",
    summary: "Converging boundaries (ascending, descending, symmetrical) whose breakout bias comes from data, not from the shape.",
    body: [
      "An ascending triangle has a flat top over rising lows; a descending one a flat bottom under falling highs; a symmetrical one falling highs over rising lows. Each needs at least three touches on one line and two on the other, and volume usually fades. Extended, the lines meet at the apex.",
      "Bulkowski counted upward breakouts in 63% of ascending, 60% of symmetrical and 53% of descending triangles, so the descending triangle's bearish label doesn't hold. Breakouts usually came about 64–74% of the way to the apex. Near the apex the lines sit closer than a normal candle's range, so a crossing there says little.",
    ],
    example: "A flat top at 104.00 over lows of 100.00, 101.00 and 102.00: the lines meet on candle 35. Candle 23 closes at 104.25, 62.5% of the way from the first low to the apex. Height 4.00 × 70% gives a target of 106.80.",
    related: ["breakout", "false-breakout", "chart-pattern-anatomy"],
    missions: [],
    lessons: ["2.2.6"],
  },
  {
    id: "flags-and-pennants",
    name: "Flags and pennants",
    category: "technical_analysis",
    summary: "Short pauses after a steep move whose classic \"half-mast\" target is reached less than half the time.",
    body: [
      "A flag is a brief pause with parallel lines sloping against a steep move, the flagpole; a pennant is the same pause with converging lines. On LABX 1H the app asks for a pole of at least 3 × ATR in 8 candles or fewer, and a pause of 5 to 20 candles; longer pauses are rectangles or channels.",
      "The half-mast rule projects the whole pole from the breakout. Bulkowski found flags reached it 46% of the time and pennants 35%; flags failed 44–45% of the time and pennants 54% (evidence D for the rule). Scale the pole before you project it.",
    ],
    example: "Pole from 100.00 to 104.00, breakout at 103.60. Half-mast is 107.60; scaled, 103.60 + 4.00 × 0.46 = 105.44. Price peaked at 105.70.",
    related: ["trend", "breakout", "pattern-target"],
    missions: [],
    lessons: ["2.2.7"],
  },
  {
    id: "measured-move",
    name: "Measured move",
    category: "technical_analysis",
    summary: "A projection that a second leg will roughly repeat the first; in the data it is usually shorter.",
    body: [
      "Three swing points define a measured move: the first leg from A to B, then a correction to C. The projection puts D at C plus the length of AB (D100), or at a share of it. In Bulkowski's stock data the second leg averaged +31% against +36% for the first, and a target at 60% of AB was reached 60% of the time (evidence C).",
      "Plan with D60 and treat D100 as the stretch, and check the reward against a stop below C.",
    ],
    example: "A 100.00, B 104.00, C 102.00: AB = 4.00. D60 = 102.00 + 2.40 = 104.40 and D100 = 106.00. Price reached 104.90.",
    related: ["swing-points", "trend", "pattern-target"],
    missions: [],
    lessons: ["2.2.7"],
  },
  {
    id: "wedges-and-broadening",
    name: "Wedges and broadening formations",
    category: "technical_analysis",
    summary: "Converging sloped lines (wedges) or diverging lines (megaphones, diamonds), with weak and mixed statistics.",
    body: [
      "A wedge has two lines sloping the same way and converging: in a rising wedge the lower line is steeper, in a falling wedge the upper one. Parallel lines make a channel instead. A broadening formation, or megaphone, has diverging lines; a diamond widens, then narrows.",
      "Rising wedges broke down 60% of the time in Bulkowski's data, but 51% of those breakdowns failed to fall 5%, rank 36 of 36 (evidence D for 'bearish'). Falling wedges broke up 68% of the time. Broadening formations and diamonds are rare and drawn subjectively, and their widening swings put stops far away.",
    ],
    example: "A rising wedge 3.00 tall breaks down at 102.00. Scaled by 32%, the target is 101.04. Short at 101.95 with a stop at 103.00, the reward-to-risk is 0.91 ÷ 1.05 = 0.87.",
    related: ["trendlines-and-channels", "triangles", "reward-to-risk"],
    missions: [],
    lessons: ["2.2.8"],
  },
  {
    id: "rounding-and-v-patterns",
    name: "Rounding and V patterns",
    category: "technical_analysis",
    summary: "Slow bowl-shaped turns and cups that become visible only late, and sharp V turns that can't be seen in real time.",
    body: [
      "A rounding bottom turns from falling to rising in a slow bowl; a cup with handle adds a short pullback, the handle, in the upper half near the rim. Both confirm on a close above the rim, after much of the rise is done. In Bulkowski's data rounding bottoms failed 4% of the time and cups with handle 5% (evidence C), from months-long patterns on daily and weekly charts.",
      "A V reversal turns sharply with no pause. In real time its low looks like any pause in a fall; only later candles show which it was. Its statistics are measured in hindsight, so using V's as they form has no support (evidence D).",
    ],
    example: "A cup with its rim at 102.00 and its bottom at 97.00 is 5.00 deep. After a close at 102.20 above the rim, the scaled target is 102.00 + 5.00 × 0.61 = 105.05, with the stop under the handle's low, 101.00.",
    related: ["hindsight-bias", "sample-size", "pattern-target"],
    missions: [],
    lessons: ["2.2.9"],
  },
  {
    id: "busted-patterns",
    name: "Busted patterns",
    category: "technical_analysis",
    summary: "Patterns that break out, fail, and then break through the opposite boundary.",
    body: [
      "A pattern busts when its breakout travels less than 1 × ATR(14) (the app's convention; Bulkowski uses about 10% on daily charts) and price then closes beyond the opposite boundary. A failed breakout, a close back inside, ends the original trade; the bust is a new situation.",
      "Write the plan before the breakout: what you do if it works, if it fails and if it busts. Typically: hold with the stop, exit on a close back inside, then stand aside or trade the bust with its own entry, stop and size. Bulkowski describes strong moves after busts, but his numbers for them aren't reproduced here (evidence C).",
    ],
    example: "An ascending triangle with a flat top at 104.00 breaks out with a close at 104.30 (ATR 0.40). The high reaches only 104.38, candle 27 closes back inside at 103.85, and candle 28 closes at 103.40, under the lower line: a bust.",
    related: ["false-breakout", "scenario-planning", "base-rates"],
    missions: ["M10"],
    lessons: ["2.2.10"],
  },
];

/** Unit 2.2 · Chart patterns (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_2_2: UnitContent = {
  intro: {
    summary: "This unit scales up from candles to shapes drawn with lines: trendlines and channels, then double tops, head and shoulders, triangles, flags and wedges. Each is confirmed with a filter, measured with a scaled target and planned for failure. It comes before indicators because it needs only 1.5's swings and zones, plus 2.1's habit: context, confirmation, base rate.",
    outcomes: [
      "Draw trendlines and channels by fixed rules, and treat a break as a warning to confirm.",
      "Break any chart pattern into its eight parts and find the close that confirms it.",
      "Confirm a breakout with a close past a margin sized to the market's normal candle range.",
      "Scale a pattern's target by how often it was reached, then check the reward-to-risk.",
      "Write what you'll do if a pattern works, fails or busts, before the breakout comes.",
    ],
    buildsOn: "Swings, zones, breakouts and retests (1.5.1, 1.5.4, 1.5.6); stops at invalidation and reward-to-risk (1.4.3, 1.4.5); the log scale (1.2.6); 2.1.3's context and confirmation; and random walks (0.2.5).",
  },
  lessons,
  questions,
  terms,
  concepts,
};
