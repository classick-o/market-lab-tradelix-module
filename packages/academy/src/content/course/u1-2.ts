import type { CandleData, ChartLayer, ChartSpec, Concept, GlossaryTerm, Lesson, Question, UnitContent, UnitIntro } from "../../types";

/** One candle, in price units with 2 decimals; `v` is the volume in units. */
const k = (o: number, h: number, l: number, c: number, v?: number): CandleData => (v === undefined ? { o, h, l, c } : { o, h, l, c, v });

/** A line chart: the kit draws a line through the closes and fits the scale to them alone. */
function lineChart(cs: CandleData[], extra: ChartLayer[], describe: string): ChartSpec {
  return { candles: cs, style: "line", layers: extra, describe };
}

/** Volume bars drawn as candles from 0 to the volume, coloured like the hour's price candle (the kit has no volume pane). */
const volumeBars = (vols: number[], up: boolean[]): CandleData[] => vols.map((v, i) => (up[i] ? k(0, v, 0, v) : k(v, v, 0, 0)));

// ─── 1.2.2 · Line, bar and candle charts ────────────────────────────────────

/** 24 hours of LABX. Hour 9 (index 8) is the only high above 102.00 (102.30, close 101.25); highest close 101.80 in the first 12, 101.90 in all 24. */
const L122: CandleData[] = [
  k(100.0, 100.35, 99.85, 100.2),
  k(100.2, 100.6, 100.1, 100.5),
  k(100.5, 100.7, 100.15, 100.3),
  k(100.3, 100.9, 100.25, 100.8),
  k(100.8, 101.2, 100.7, 101.1),
  k(101.1, 101.45, 100.95, 101.3),
  k(101.3, 101.7, 101.2, 101.6),
  k(101.6, 101.95, 101.4, 101.8),
  k(101.8, 102.3, 101.1, 101.25),
  k(101.25, 101.5, 100.9, 101.0),
  k(101.0, 101.4, 100.85, 101.3),
  k(101.3, 101.65, 101.15, 101.5),
  k(101.5, 101.75, 101.2, 101.35),
  k(101.35, 101.55, 100.95, 101.05),
  k(101.05, 101.3, 100.7, 100.85),
  k(100.85, 101.15, 100.6, 101.0),
  k(101.0, 101.4, 100.9, 101.25),
  k(101.25, 101.6, 101.1, 101.45),
  k(101.45, 101.85, 101.35, 101.7),
  k(101.7, 101.95, 101.4, 101.55),
  k(101.55, 101.8, 101.2, 101.35),
  k(101.35, 101.6, 101.05, 101.5),
  k(101.5, 101.9, 101.4, 101.75),
  k(101.75, 101.98, 101.55, 101.9),
];
const L122_12 = L122.slice(0, 12);
const LEVEL_102: ChartLayer = { kind: "level", price: 102.0, role: "neutral" };

// ─── 1.2.3 · Timeframes and aggregation ─────────────────────────────────────

/**
 * 48 hours of LABX. Hours 1–4 aggregate to 100.00 / 101.10 / 99.60 / 100.30 (hook, B2); hours 5–8 to
 * 100.30 / 101.60 / 100.10 / 101.50 (Try). 15 of the 48 hours are bearish; 11 of the 12 four-hour candles are bullish.
 * Hours 13–16 (B5): hour 15 falls 0.98 (103.16 → 102.18) inside a 4H candle from 101.90 to 102.60.
 */
const L123: CandleData[] = [
  k(100.0, 100.6, 99.8, 100.4),
  k(100.4, 101.1, 100.2, 100.9),
  k(100.9, 101.0, 99.9, 100.1),
  k(100.1, 100.5, 99.6, 100.3),
  k(100.3, 100.8, 100.1, 100.7),
  k(100.7, 101.4, 100.6, 101.2),
  k(101.2, 101.3, 100.7, 100.8),
  k(100.8, 101.6, 100.75, 101.5),
  k(101.5, 101.59, 100.99, 101.2),
  k(101.2, 102.02, 101.07, 101.85),
  k(101.85, 101.9, 101.55, 101.6),
  k(101.6, 102.03, 101.43, 101.9),
  k(101.9, 102.74, 101.81, 102.53),
  k(102.53, 103.25, 102.32, 103.16),
  k(103.16, 103.33, 102.05, 102.18),
  k(102.18, 102.65, 102.13, 102.6),
  k(102.6, 102.93, 102.43, 102.8),
  k(102.8, 103.01, 102.26, 102.35),
  k(102.35, 102.44, 101.84, 102.05),
  k(102.05, 102.47, 101.92, 102.3),
  k(102.3, 102.65, 102.25, 102.6),
  k(102.6, 102.73, 102.23, 102.4),
  k(102.4, 103.06, 102.31, 102.85),
  k(102.85, 103.09, 102.64, 103.0),
  k(103.0, 103.57, 102.87, 103.4),
  k(103.4, 103.8, 103.35, 103.75),
  k(103.75, 103.88, 103.18, 103.35),
  k(103.35, 103.81, 103.26, 103.6),
  k(103.6, 103.69, 103.14, 103.35),
  k(103.35, 103.87, 103.22, 103.7),
  k(103.7, 104.1, 103.65, 104.05),
  k(104.05, 104.18, 103.73, 103.9),
  k(103.9, 104.46, 103.81, 104.25),
  k(104.25, 104.34, 103.84, 104.05),
  k(104.05, 104.52, 103.92, 104.35),
  k(104.35, 104.55, 104.3, 104.5),
  k(104.5, 104.93, 104.33, 104.8),
  k(104.8, 105.36, 104.71, 105.15),
  k(105.15, 105.24, 104.69, 104.9),
  k(104.9, 105.27, 104.77, 105.1),
  k(105.1, 105.15, 104.7, 104.75),
  k(104.75, 105.13, 104.58, 105.0),
  k(105.0, 105.56, 104.91, 105.35),
  k(105.35, 105.49, 105.14, 105.4),
  k(105.4, 105.87, 105.27, 105.7),
  k(105.7, 105.75, 105.45, 105.5),
  k(105.5, 105.98, 105.33, 105.85),
  k(105.85, 106.21, 105.76, 106.0),
];

/** The same 48 hours as 12 four-hour candles: first open, highest high, lowest low, last close of each block of four. */
const L123_4H: CandleData[] = [
  k(100.0, 101.1, 99.6, 100.3),
  k(100.3, 101.6, 100.1, 101.5),
  k(101.5, 102.03, 100.99, 101.9),
  k(101.9, 103.33, 101.81, 102.6),
  k(102.6, 103.01, 101.84, 102.3),
  k(102.3, 103.09, 102.23, 103.0),
  k(103.0, 103.88, 102.87, 103.6),
  k(103.6, 104.18, 103.14, 103.9),
  k(103.9, 104.55, 103.81, 104.5),
  k(104.5, 105.36, 104.33, 105.1),
  k(105.1, 105.56, 104.58, 105.4),
  k(105.4, 106.21, 105.27, 106.0),
];

/** Every fourth hourly close: the 4H closes, drawn over the 1H chart. */
const L123_4H_PATH: ChartLayer = {
  kind: "path",
  role: "concept",
  label: "4H CLOSES",
  points: L123_4H.map((c, i) => ({ index: i * 4 + 3, price: c.c })),
};

// ─── 1.2.4 · Volume ─────────────────────────────────────────────────────────

/**
 * 24 hours with volume. Hours 1–14 range between 99.60 and 100.50; hour 15 breaks out (close 101.10, 2,500 units,
 * 2.48 × its 20-hour average of 1,009); hour 21 is news (2,700 units, the tallest bar, 2.09 × an average of 1,294,
 * close 0.02 above the open). Hour 19: 1,800 against 1,166 (1.54 ×).
 */
const L124: CandleData[] = [
  k(100.0, 100.25, 99.8, 100.1, 920),
  k(100.1, 100.35, 99.95, 100.25, 950),
  k(100.25, 100.45, 100.05, 100.15, 880),
  k(100.15, 100.3, 99.85, 99.95, 940),
  k(99.95, 100.1, 99.65, 99.8, 1010),
  k(99.8, 100.05, 99.6, 99.95, 900),
  k(99.95, 100.25, 99.85, 100.15, 930),
  k(100.15, 100.48, 100.05, 100.35, 960),
  k(100.35, 100.5, 100.1, 100.2, 890),
  k(100.2, 100.3, 99.9, 100.0, 920),
  k(100.0, 100.15, 99.75, 99.9, 940),
  k(99.9, 100.2, 99.8, 100.1, 910),
  k(100.1, 100.4, 100.0, 100.3, 970),
  k(100.3, 100.49, 100.2, 100.4, 930),
  k(100.4, 101.25, 100.35, 101.1, 2500),
  k(101.1, 101.4, 100.95, 101.3, 1750),
  k(101.3, 101.5, 101.05, 101.15, 1620),
  k(101.15, 101.45, 101.0, 101.35, 1680),
  k(101.35, 101.6, 101.2, 101.5, 1800),
  k(101.5, 101.65, 101.25, 101.4, 1700),
  k(101.4, 102.3, 100.5, 101.42, 2700),
  k(101.42, 101.7, 101.15, 101.55, 1650),
  k(101.55, 101.8, 101.35, 101.45, 1580),
  k(101.45, 101.75, 101.3, 101.65, 1600),
];
/** 20-hour average volume (this hour and the 19 before, with 20 earlier hours as warm-up), rounded to whole units. */
const L124_AVG = [923, 926, 922, 924, 931, 926, 926, 929, 927, 926, 928, 925, 928, 928, 1009, 1049, 1084, 1123, 1166, 1205, 1294, 1329, 1364, 1397];
const L124_VOLUME: ChartSpec = {
  candles: volumeBars(
    L124.map((c) => c.v ?? 0),
    L124.map((c) => c.c >= c.o),
  ),
  range: [0, 3000],
  describe: "Hourly volume bars for 24 hours, about 900 to 1,000 units for hours 1 to 14, 2,500 in hour 15, 1,580 to 1,800 afterwards and 2,700 in hour 21. A line shows the 20-hour average, rising from about 920 to about 1,400.",
};
const L124_AVG_LINE: ChartLayer = { kind: "line", values: L124_AVG, role: "concept", label: "20-HOUR AVERAGE" };

/** Try: 30 hours of volume. Hours 6, 17 and 26 reach at least 2 × their average (2.62, 2.35, 2.27); hours 11 and 22 stop at 1.71 and 1.66. */
const L124_TRY_VOL = [990, 1020, 960, 1040, 1000, 2850, 1010, 970, 1050, 990, 1950, 1000, 1030, 960, 1010, 990, 2900, 1020, 980, 1040, 1000, 2150, 990, 1010, 1030, 2950, 970, 1000, 1020, 990];
const L124_TRY_AVG = [997, 999, 995, 999, 999, 1090, 1092, 1091, 1092, 1094, 1142, 1140, 1142, 1140, 1142, 1140, 1236, 1237, 1237, 1238, 1239, 1295, 1297, 1295, 1297, 1302, 1300, 1301, 1300, 1300];
/** Direction of each hour's price candle, for the bar colours only. */
const L124_TRY_UP = [1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, -1, -1, 1, 1].map((d) => d > 0);

// ─── 1.2.5 · Normal candle size and gaps ────────────────────────────────────

/**
 * Ten candles with ranges 0.42, 0.38, 0.55, 0.31, 0.47, 0.36, 0.44, 0.39, 0.52, 0.36 (total 4.20, average 0.42);
 * candle 10 closes at 100.00, candle 11 opens at 98.80 (a 1.20 gap). Candles 11–12 stay below 99.50 (high 99.20).
 */
const L125: CandleData[] = [
  k(100.2, 100.49, 100.07, 100.3),
  k(100.3, 100.39, 100.01, 100.15),
  k(100.15, 100.58, 100.03, 100.4),
  k(100.4, 100.46, 100.15, 100.25),
  k(100.25, 100.41, 99.94, 100.05),
  k(100.05, 100.28, 99.92, 100.2),
  k(100.2, 100.4, 99.96, 100.1),
  k(100.1, 100.2, 99.81, 99.95),
  k(99.95, 100.34, 99.82, 100.15),
  k(100.15, 100.23, 99.87, 100.0),
  k(98.8, 99.05, 98.55, 98.95),
  k(98.95, 99.2, 98.8, 99.1),
];
const L125_RANGES = L125.slice(0, 10).map((c) => Math.round((c.h - c.l) * 100) / 100);

/** B4: 20 candles. Candle 12 closes at 100.40, candle 13 opens at 101.30 (gap 0.90); candle 6 is a big bearish candle (range 1.10); candle 17 has a 0.65 upper wick to 102.05. */
const L125_HOT: CandleData[] = [
  k(100.0, 100.25, 99.85, 100.15),
  k(100.15, 100.35, 100.0, 100.2),
  k(100.2, 100.4, 100.05, 100.3),
  k(100.3, 100.45, 100.1, 100.2),
  k(100.2, 100.38, 100.02, 100.25),
  k(100.25, 100.3, 99.2, 99.35),
  k(99.35, 99.6, 99.25, 99.5),
  k(99.5, 99.8, 99.4, 99.7),
  k(99.7, 99.95, 99.6, 99.85),
  k(99.85, 100.15, 99.75, 100.05),
  k(100.05, 100.3, 99.95, 100.2),
  k(100.2, 100.5, 100.1, 100.4),
  k(101.3, 101.55, 101.15, 101.45),
  k(101.45, 101.6, 101.25, 101.35),
  k(101.35, 101.5, 101.1, 101.2),
  k(101.2, 101.4, 101.05, 101.3),
  k(101.3, 102.05, 101.2, 101.4),
  k(101.4, 101.55, 101.2, 101.3),
  k(101.3, 101.45, 101.1, 101.25),
  k(101.25, 101.5, 101.15, 101.4),
];

// ─── 1.2.6 · Linear and log scale ───────────────────────────────────────────

/** Forty quarters of a synthetic price from 20.00 to 160.00: three doublings (40 is crossed in quarter 13, 80 in quarter 27). */
const L126: CandleData[] = [
  k(20.0, 21.32, 19.6, 21.07),
  k(21.07, 23.45, 20.76, 23.04),
  k(23.04, 23.99, 22.62, 23.52),
  k(23.52, 24.7, 23.08, 24.3),
  k(24.3, 26.95, 23.96, 26.58),
  k(26.58, 28.56, 26.05, 28.03),
  k(28.03, 28.58, 27.56, 27.98),
  k(27.98, 29.8, 27.48, 29.36),
  k(29.36, 32.78, 28.8, 32.28),
  k(32.28, 34.31, 31.85, 33.65),
  k(33.65, 34.9, 32.98, 34.26),
  k(34.26, 37.83, 33.72, 37.33),
  k(37.33, 41.66, 36.68, 40.96),
  k(40.96, 42.74, 40.17, 41.9),
  k(41.9, 43.67, 41.36, 42.91),
  k(42.91, 47.31, 42.06, 46.73),
  k(46.73, 50.45, 45.97, 49.55),
  k(49.55, 50.54, 48.7, 49.55),
  k(49.55, 52.58, 48.58, 51.74),
  k(51.74, 57.91, 51.11, 57.1),
  k(57.1, 61.2, 55.98, 60.05),
  k(60.05, 62.27, 59.05, 61.09),
  k(61.09, 67.09, 60.08, 66.12),
  k(66.12, 73.84, 64.82, 72.69),
  k(72.69, 75.99, 71.79, 74.51),
  k(74.51, 77.12, 73.06, 75.72),
  k(75.72, 83.12, 74.42, 82.06),
  k(82.06, 89.07, 80.74, 87.55),
  k(87.55, 89.63, 85.81, 87.87),
  k(87.87, 92.95, 86.73, 91.37),
  k(91.37, 102.41, 89.62, 101.1),
  k(101.1, 109.22, 99.32, 107.23),
  k(107.23, 111.13, 105.56, 108.97),
  k(108.97, 118.88, 106.8, 117.03),
  k(117.03, 130.63, 115.44, 128.74),
  k(128.74, 134.9, 126.3, 132.33),
  k(132.33, 136.14, 129.94, 133.58),
  k(133.58, 146.09, 131.57, 144.05),
  k(144.05, 157.23, 141.17, 154.71),
  k(154.71, 163.18, 152.52, 160.0),
];

/** Try: three legs over 30 candles, 20.00 → 40.00 (index 9), 40.00 → 60.00 (index 19), 60.00 → 150.00 (index 29). */
const L126_TRY: CandleData[] = [
  k(20.0, 22.13, 19.8, 22.0),
  k(22.0, 24.48, 21.82, 24.25),
  k(24.25, 25.98, 24.06, 25.73),
  k(25.73, 28.19, 25.47, 28.01),
  k(28.01, 30.58, 27.77, 30.31),
  k(30.31, 31.97, 30.09, 31.66),
  k(31.66, 34.25, 31.35, 34.01),
  k(34.01, 36.68, 33.7, 36.37),
  k(36.37, 37.97, 36.13, 37.6),
  k(37.6, 40.31, 37.24, 40.0),
  k(40.0, 42.67, 39.6, 42.42),
  k(42.42, 43.94, 42.07, 43.53),
  k(43.53, 46.48, 43.2, 46.04),
  k(46.04, 48.8, 45.58, 48.48),
  k(48.48, 49.91, 48.06, 49.46),
  k(49.46, 52.56, 49.11, 52.05),
  k(52.05, 54.92, 51.54, 54.53),
  k(54.53, 55.87, 54.04, 55.39),
  k(55.39, 58.65, 55.03, 58.07),
  k(58.07, 60.46, 57.51, 60.0),
  k(60.0, 68.65, 59.4, 68.24),
  k(68.24, 78.84, 67.68, 78.11),
  k(78.11, 88.68, 77.51, 87.83),
  k(87.83, 95.56, 86.96, 94.94),
  k(94.94, 106.12, 94.12, 105.17),
  k(105.17, 116.21, 104.42, 115.08),
  k(115.08, 122.5, 113.95, 121.63),
  k(121.63, 133.38, 120.53, 132.24),
  k(132.24, 143.74, 131.37, 142.32),
  k(142.32, 151.15, 140.95, 150.0),
];

// ─── 1.2.7 · What a chart can't tell you ────────────────────────────────────

/** The textbook chart: support near 98.00 touched at candles 5, 12 and 19 (lows 98.02, 97.98, 98.04), then a climb to 101.50. */
const L127_BOOK: CandleData[] = [
  k(99.4, 99.5, 99.1, 99.2),
  k(99.2, 99.39, 98.77, 98.9),
  k(98.9, 99.06, 98.44, 98.6),
  k(98.6, 98.73, 98.16, 98.35),
  k(98.35, 98.45, 98.02, 98.3),
  k(98.3, 98.89, 98.17, 98.7),
  k(98.7, 99.21, 98.54, 99.05),
  k(99.05, 99.43, 98.86, 99.3),
  k(99.3, 99.4, 99.0, 99.1),
  k(99.1, 99.29, 98.67, 98.8),
  k(98.8, 98.96, 98.29, 98.45),
  k(98.45, 98.58, 97.98, 98.35),
  k(98.35, 98.85, 98.25, 98.75),
  k(98.75, 99.29, 98.62, 99.1),
  k(99.1, 99.51, 98.94, 99.35),
  k(99.35, 99.48, 98.86, 99.05),
  k(99.05, 99.15, 98.6, 98.7),
  k(98.7, 98.89, 98.27, 98.4),
  k(98.4, 98.61, 98.04, 98.45),
  k(98.45, 99.13, 98.26, 99.0),
  k(99.0, 99.7, 98.9, 99.6),
  k(99.6, 100.49, 99.47, 100.3),
  k(100.3, 101.06, 100.14, 100.9),
  k(100.9, 101.63, 100.71, 101.5),
];

/** Same first 18 candles; the third touch (candle 19, low 97.95) gives way and price falls to 96.80 (candle 23). */
const L127_FAIL: CandleData[] = [
  ...L127_BOOK.slice(0, 18),
  k(98.4, 98.56, 97.95, 98.1),
  k(98.1, 98.23, 97.41, 97.6),
  k(97.6, 97.7, 97.15, 97.25),
  k(97.25, 97.44, 96.87, 97.0),
  k(97.0, 97.16, 96.8, 96.95),
  k(96.95, 97.23, 96.85, 97.1),
];
const L127_SUPPORT: ChartLayer = { kind: "zone", from: 97.9, to: 98.1, role: "support", label: "SUPPORT" };
const L127_TOUCHES: ChartLayer[] = [4, 11, 18].map((index, i) => ({ kind: "marker", index, at: "low", label: `TOUCH ${i + 1}` }));

/** The right edge: a fall from 102.00 to a close of 98.10 at candle 30 (low 97.85, the lowest), then a climb to 101.00 at candle 40. */
const L127_EDGE: CandleData[] = [
  k(102.0, 102.1, 101.77, 101.87),
  k(101.87, 102.1, 101.74, 101.91),
  k(101.91, 102.07, 101.54, 101.7),
  k(101.7, 101.83, 101.17, 101.36),
  k(101.36, 101.46, 101.09, 101.19),
  k(101.19, 101.45, 101.06, 101.26),
  k(101.26, 101.43, 101.1, 101.27),
  k(101.27, 101.4, 100.83, 101.02),
  k(101.02, 101.12, 100.58, 100.68),
  k(100.68, 100.87, 100.43, 100.56),
  k(100.56, 100.81, 100.4, 100.65),
  k(100.65, 100.78, 100.43, 100.62),
  k(100.62, 100.72, 100.23, 100.33),
  k(100.33, 100.52, 99.88, 100.01),
  k(100.01, 100.17, 99.78, 99.94),
  k(99.94, 100.16, 99.75, 100.03),
  k(100.03, 100.13, 99.86, 99.96),
  k(99.96, 100.15, 99.51, 99.64),
  k(99.64, 99.8, 99.19, 99.35),
  k(99.35, 99.48, 99.13, 99.32),
  k(99.32, 99.51, 99.22, 99.41),
  k(99.41, 99.6, 99.16, 99.29),
  k(99.29, 99.45, 98.79, 98.95),
  k(98.95, 99.08, 98.51, 98.7),
  k(98.7, 98.81, 98.6, 98.71),
  k(98.71, 98.97, 98.58, 98.78),
  k(98.78, 98.94, 98.45, 98.61),
  k(98.61, 98.74, 98.08, 98.27),
  k(98.27, 98.37, 97.96, 98.06),
  k(98.06, 98.29, 97.85, 98.1),
  k(98.1, 98.55, 97.94, 98.39),
  k(98.39, 98.93, 98.2, 98.8),
  k(98.8, 99.04, 98.7, 98.94),
  k(98.94, 99.34, 98.81, 99.15),
  k(99.15, 99.77, 98.99, 99.61),
  k(99.61, 100.07, 99.42, 99.94),
  k(99.94, 100.15, 99.84, 100.05),
  k(100.05, 100.54, 99.92, 100.35),
  k(100.35, 100.97, 100.19, 100.81),
  k(100.81, 101.13, 100.62, 101.0),
];

/** Blind call 1: a climb from 99.00 to 101.00 over 22 candles; the next 8 stay between 100.61 and 101.26 and close at 101.00. */
const L127_CALL1: CandleData[] = [
  k(99.0, 99.17, 98.92, 99.09),
  k(99.09, 99.49, 98.98, 99.32),
  k(99.32, 99.46, 99.04, 99.18),
  k(99.18, 99.39, 99.01, 99.28),
  k(99.28, 99.68, 99.2, 99.6),
  k(99.6, 99.77, 99.42, 99.53),
  k(99.53, 99.67, 99.36, 99.5),
  k(99.5, 99.94, 99.33, 99.83),
  k(99.83, 99.97, 99.75, 99.89),
  k(99.89, 100.06, 99.65, 99.76),
  k(99.76, 100.16, 99.62, 100.02),
  k(100.02, 100.33, 99.85, 100.22),
  k(100.22, 100.3, 99.99, 100.07),
  k(100.07, 100.38, 99.96, 100.21),
  k(100.21, 100.65, 100.07, 100.51),
  k(100.51, 100.62, 100.25, 100.42),
  k(100.42, 100.5, 100.34, 100.42),
  k(100.42, 100.92, 100.31, 100.75),
  k(100.75, 100.92, 100.61, 100.78),
  k(100.78, 100.89, 100.5, 100.67),
  k(100.67, 101.03, 100.59, 100.95),
  k(100.95, 101.17, 100.84, 101.0),
  k(101.0, 101.14, 100.71, 100.85),
  k(100.85, 101.21, 100.68, 101.1),
  k(101.1, 101.18, 100.82, 100.9),
  k(100.9, 101.07, 100.64, 100.75),
  k(100.75, 101.19, 100.61, 101.05),
  k(101.05, 101.26, 100.88, 101.15),
  k(101.15, 101.23, 100.82, 100.9),
  k(100.9, 101.17, 100.79, 101.0),
];

/** Blind call 2: 20 sideways candles closing at 100.10; ten candles later price closes at 99.40. */
const L127_CALL2: CandleData[] = [
  k(100.0, 100.3, 99.9, 100.2),
  k(100.2, 100.64, 100.07, 100.45),
  k(100.45, 100.61, 99.94, 100.1),
  k(100.1, 100.23, 99.66, 99.85),
  k(99.85, 100.25, 99.75, 100.15),
  k(100.15, 100.59, 100.02, 100.4),
  k(100.4, 100.76, 100.24, 100.6),
  k(100.6, 100.73, 100.11, 100.3),
  k(100.3, 100.4, 99.95, 100.05),
  k(100.05, 100.44, 99.92, 100.25),
  k(100.25, 100.66, 100.09, 100.5),
  k(100.5, 100.63, 100.16, 100.35),
  k(100.35, 100.45, 99.9, 100.0),
  k(100.0, 100.19, 99.77, 99.9),
  k(99.9, 100.36, 99.74, 100.2),
  k(100.2, 100.58, 100.01, 100.45),
  k(100.45, 100.55, 100.2, 100.3),
  k(100.3, 100.49, 99.92, 100.05),
  k(100.05, 100.36, 99.89, 100.2),
  k(100.2, 100.33, 99.91, 100.1),
  k(100.1, 100.4, 100.0, 100.3),
  k(100.3, 100.49, 99.92, 100.05),
  k(100.05, 100.21, 99.64, 99.8),
  k(99.8, 100.08, 99.61, 99.95),
  k(99.95, 100.05, 99.6, 99.7),
  k(99.7, 99.89, 99.32, 99.45),
  k(99.45, 99.76, 99.29, 99.6),
  k(99.6, 99.73, 99.11, 99.3),
  k(99.3, 99.6, 99.2, 99.5),
  k(99.5, 99.69, 99.27, 99.4),
];

// ─── Lessons ────────────────────────────────────────────────────────────────

const lessons: Lesson[] = [
  // 1.2.2 · Line, bar and candle charts
  {
    id: "1.2.2",
    title: "Line, bar and candle charts",
    topic: "market_fundamentals",
    level: "beginner",
    tier: "free",
    minutes: 5,
    summary: "The same prices drawn as a line, as OHLC bars and as candles, and what each drawing keeps or drops.",
    objectives: [
      "Draw the same OHLC data as a line, a bar and a candle.",
      "Identify what each chart type keeps and what it drops.",
      "Choose a chart type for a task: a long-term overview or reading single periods.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "bullish", label: "Arena: bullish" },
      { kind: "mission", ref: "M01", label: "Read the Candle" },
    ],
    script: {
      unit: "1.2",
      courseId: "1.2.2",
      bridge: "In 1.2.1 you read one candle's four prices: open, high, low and close. Here you draw the same hours three ways, as a line, as bars and as candles, and see which prices each drawing keeps.",
      hook: {
        prompt: "This [[line-chart|line chart]] shows 12 hours of LABX. Did LABX trade above 102.00 during these 12 hours?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes", feedback: "It did, but nothing on this chart shows it. The line peaks at 101.80." },
            { id: "no", label: "No", feedback: "The line stays below 102.00, but it only joins the closes. Prices traded between closes aren't on it." },
            { id: "cant", label: "Can't tell from this chart", feedback: "Right. A line joins the closes, so the highs aren't on it." },
          ],
          answer: "cant",
        },
        figure: {
          kind: "chart",
          chart: lineChart(L122_12, [], "A line joining 12 hourly closes, rising from 100.20 to 101.80 in hour 8, dipping to 101.00 and ending at 101.50."),
          steps: [{ text: "Twelve hourly closes joined by a line. The highest close is 101.80.", layers: [LEVEL_102] }],
        },
        compare: "You picked {yours}. The line only joins closes, and the highest was 101.80. As candles, hour 9 shows a high of 102.30.",
        concept: "chart-types",
      },
      learn: [
        {
          kind: "explain",
          title: "Three ways to draw the same hour",
          text: "A [[line-chart|line chart]] joins each period's [[close]] and drops everything else. An [[ohlc-bar|OHLC bar]] keeps all four prices: a vertical line from the [[low]] to the [[high]], a tick on the left for the [[open]] and a tick on the right for the close. A [[candle]] shows the same four prices, with a body between open and close.",
        },
        {
          kind: "figure",
          title: "What the line left out",
          figure: {
            kind: "chart",
            chart: { candles: L122_12 },
            steps: [
              {
                text: "The same 12 hours as candles. The line still runs through every close.",
                layers: [{ kind: "line", values: L122_12.map((c) => c.c), role: "accent", label: "LINE" }],
              },
              {
                text: "Hour 9 traded up to 102.30, then closed at 101.25.",
                layers: [LEVEL_102, { kind: "marker", index: 8, at: "high", label: "HIGH 102.30" }],
              },
              {
                text: "A line keeps one price per hour, the close, so that high never appears.",
                layers: [{ kind: "marker", index: 8, at: "close", label: "CLOSE 101.25", role: "concept" }],
              },
            ],
          },
          concept: "chart-types",
        },
        {
          kind: "match",
          title: "What each one keeps",
          prompt: "Match each chart type to what it keeps.",
          pairs: [
            { left: "Line chart", right: "Closes only", wrong: "A line has one point per period, and only one price fits there: the close." },
            { left: "OHLC bar", right: "Four prices, ticks for open and close", wrong: "A bar keeps all four prices. Its open and close are small side ticks, not a body." },
            { left: "Candle", right: "Four prices, a body between open and close", wrong: "A candle keeps all four prices. What sets it apart is the filled body between open and close." },
          ],
          correct: "Same data, three drawings. Only the line throws prices away.",
          concept: "chart-types",
        },
        {
          kind: "predict",
          title: "Read the bar",
          prompt: "An [[ohlc-bar|OHLC bar]] has its left tick at 100.90 and its right tick at 100.40. Its line runs from 100.20 to 101.10. How does that hour look as a candle?",
          control: {
            kind: "choice",
            choices: [
              { id: "bull", label: "Bullish: a body from 100.40 up to 100.90", feedback: "That reads the ticks the wrong way round. The left tick is the open, 100.90; the right tick is the close, 100.40." },
              { id: "bear", label: "Bearish: a body from 100.90 down to 100.40", feedback: "Left tick open, right tick close. The close is lower, so the candle is bearish." },
              { id: "line", label: "A body from 100.20 to 101.10", feedback: "Those are the low and the high. They become the wicks; the body runs between the two ticks." },
            ],
            answer: "bear",
          },
          figure: {
            kind: "chart",
            chart: {
              candles: [k(100.9, 101.1, 100.2, 100.4)],
              style: "bar",
              describe: "One OHLC bar: a line from 100.20 to 101.10, a left tick at 100.90 and a right tick at 100.40; after the answer, the same hour as a bearish candle.",
            },
            steps: [
              {
                style: "candle",
                text: "Open 100.90 at the top, close 100.40 below it: a bearish body. High and low become wicks.",
                layers: [
                  { kind: "marker", index: 0, at: "high", label: "HIGH 101.10" },
                  { kind: "marker", index: 0, at: "open", label: "OPEN 100.90" },
                  { kind: "marker", index: 0, at: "close", label: "CLOSE 100.40" },
                  { kind: "marker", index: 0, at: "low", label: "LOW 100.20" },
                ],
              },
            ],
          },
          reveal: "Bars and candles carry the same four prices. Only the drawing differs: side ticks on a bar, a filled body on a candle.",
          concept: "chart-types",
        },
        {
          kind: "explain",
          title: "Pick the chart for the job",
          text: "A line chart suits years of data and comparisons between markets: one clean price per period. Bars and candles suit reading single periods: how far price reached and where it finished. None of the three shows the order of trades inside a period, as you saw in lesson 1.2.1.",
        },
        {
          kind: "hotspot",
          title: "Find the high",
          prompt: "Here are 24 hours of LABX as candles. Tap the hour whose high went above 102.00.",
          chart: {
            candles: L122,
            layers: [LEVEL_102],
            describe: "24 hourly candles trading between 99.85 and 101.98, with a line at 102.00. Only hour 9 has a wick above it, up to 102.30.",
          },
          zones: [
            { id: "h8", label: "Hour 8", index: 7, feedback: "Hour 8 has the highest close of the first 12 hours, 101.80, but its high is 101.95. Look for a wick that crosses 102.00." },
            { id: "h9", label: "Hour 9", index: 8 },
            { id: "h20", label: "Hour 20", index: 19, feedback: "Hour 20 reached 101.95, just under 102.00. Look for a wick that crosses the line." },
            { id: "h24", label: "Hour 24", index: 23, feedback: "Hour 24 has the day's highest close, 101.90, and a high of 101.98: close, but still under 102.00." },
          ],
          answer: "h9",
          correct: "Right. Hour 9's upper wick reaches 102.30. It's the only hour that traded above 102.00.",
          concept: "chart-types",
        },
        {
          kind: "predict",
          title: "Now as a line",
          prompt: "The same 24 hours as a line chart. Hour 9's high of 102.30 has gone. Why?",
          control: {
            kind: "choice",
            choices: [
              { id: "filter", label: "The line chart filters out spikes", feedback: "Nothing is filtered. A line simply has no place for highs and lows: it plots one price per hour." },
              { id: "closes", label: "The line only joins the closes", feedback: "Hour 9 closed at 101.25, so that's where the line passes." },
              { id: "brief", label: "The high lasted too briefly to count", feedback: "How long it lasted doesn't matter. Even a high held for most of the hour vanishes if the close is lower." },
            ],
            answer: "closes",
          },
          figure: {
            kind: "chart",
            chart: lineChart(L122, [LEVEL_102], "A line joining 24 hourly closes between 100.20 and 101.90, with a level at 102.00 that the line never reaches."),
            steps: [
              {
                text: "Hour 9 closed at 101.25. The line's highest point is hour 24's close, 101.90.",
                layers: [{ kind: "marker", index: 8, at: "close", label: "HOUR 9 · 101.25", role: "concept" }],
              },
            ],
          },
          reveal: "To check how high or low price went, you need bars or candles. A line answers one question only: where each period closed.",
          concept: "chart-types",
        },
      ],
      check: ["q-1.2.2-1", "q-1.2.2-2", "q-1.2.2-3"],
      recap: {
        next: "Next, 1.2.3: combine short candles into longer ones, and watch one market change its look across timeframes.",
        takeaways: [
          "A line chart keeps only closes. Bars and candles keep open, high, low and close.",
          "On an OHLC bar, the left tick is the open and the right tick the close.",
          "Use a line for long overviews; use bars or candles to read single periods.",
        ],
      },
    },
  },

  // 1.2.3 · Timeframes and aggregation
  {
    id: "1.2.3",
    title: "Timeframes and aggregation",
    topic: "market_fundamentals",
    level: "beginner",
    tier: "free",
    minutes: 6,
    summary: "How short candles combine into longer ones, why one market looks different on each timeframe, and how to choose one.",
    objectives: [
      "Build a 4-hour candle from four 1-hour candles.",
      "Explain how the same market can look trending on one timeframe and choppy on another.",
      "Choose a timeframe that matches how long you plan to hold a trade.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "bullish", label: "Arena: bullish" },
      { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    ],
    script: {
      unit: "1.2",
      courseId: "1.2.3",
      bridge: "In 1.2.1 you read one 1-hour candle, and in 1.2.2 you saw a line keep only the closes. Here you combine four 1-hour candles into one 4-hour candle, and see what the longer candle hides.",
      hook: {
        prompt: "These are four 1-hour [[candle|candles]] of LABX. Combine them into one 4-hour candle. What is its close?",
        control: {
          kind: "choice",
          choices: [
            { id: "c10030", label: "100.30", feedback: "Right. A 4-hour candle closes where its last hour closed." },
            { id: "c10040", label: "100.40", feedback: "That's hour 1's close. A 4-hour candle closes where its last hour closed." },
            { id: "c10110", label: "101.10", feedback: "That's the highest high. It becomes the 4-hour high, not the close." },
            { id: "c10043", label: "100.43", feedback: "That's roughly the average of the four closes. Candles don't average: the close is the last price." },
          ],
          answer: "c10030",
        },
        figure: {
          kind: "chart",
          chart: { candles: L123.slice(0, 4) },
          steps: [{ text: "O/H/L/C: H1 100.00/100.60/99.80/100.40 · H2 100.40/101.10/100.20/100.90 · H3 100.90/101.00/99.90/100.10 · H4 100.10/100.50/99.60/100.30" }],
        },
        compare: "You picked {yours}. A 4-hour candle closes where its last hour closed: 100.30. The first open, highest high and lowest low complete it.",
        concept: "candle-aggregation",
      },
      learn: [
        {
          kind: "explain",
          text: "The [[timeframe]] is the period one candle covers. MARKET//LAB charts use one-hour (1H) and four-hour (4H) candles. Twenty-four 1H candles make a day; six 4H candles make the same day. Longer candles are built from shorter ones, so you can always rebuild them yourself.",
        },
        {
          kind: "worked",
          title: "The 4-hour candle",
          lines: ["Open: the first open, 100.00.", "High: the highest high, 101.10.", "Close: the last close, 100.30.", "Low: the lowest low = ?"],
          ask: {
            answer: 99.6,
            tolerance: 0,
            feedback: [
              { value: 99.8, text: "That's hour 1's low. Check all four hours: one of them went lower." },
              { value: 99.9, text: "That's hour 3's low. Another hour went lower still." },
              { value: 100.1, text: "That's the lowest close. The low comes from the wicks, not the bodies: check each hour's low." },
            ],
            correct: "Right: 99.60, from hour 4. The 4-hour candle is 100.00 / 101.10 / 99.60 / 100.30.",
          },
          after: "One small bullish 4H candle. Hour 3's drop of 0.80 is still in there, hidden inside the candle's range.",
          concept: "candle-aggregation",
        },
        {
          kind: "figure",
          title: "48 hours on 1H",
          figure: {
            kind: "chart",
            chart: { candles: L123 },
            steps: [
              { text: "Forty-eight 1H candles: 15 are bearish, and the climb keeps pausing." },
              { text: "Join every fourth close, the 4H closes, and the path rises in 10 of 11 steps.", layers: [L123_4H_PATH] },
            ],
          },
          concept: "timeframe",
        },
        {
          kind: "explain",
          title: "The same 48 hours on 4H",
          text: "The same 48 hours as 12 four-hour candles: 11 bullish, one bearish. Each keeps the first open, highest high, lowest low and last close of its four hours. The hourly pullbacks are still there, folded inside bigger candles, so the climb looks cleaner.",
          figure: {
            kind: "chart",
            chart: { candles: L123_4H },
            steps: [{ text: "Twelve 4H candles, from 100.00 to 106.00." }],
          },
        },
        {
          kind: "predict",
          title: "A contradiction?",
          prompt: "A strong bearish 1-hour candle sits inside a bullish 4-hour candle. Is that a contradiction?",
          control: {
            kind: "choice",
            choices: [
              { id: "yes", label: "Yes: one of them must be wrong", feedback: "Both are right. They describe different stretches of time, and the 4H candle keeps only its first open and last close." },
              { id: "no", label: "No: the 4-hour candle summarises all four hours", feedback: "The bearish hour happened, and the four hours together still finished higher." },
            ],
            answer: "no",
          },
          figure: {
            kind: "chart",
            chart: {
              candles: [...L123.slice(12, 16), L123_4H[3]],
              describe: "Hours 13 to 16 of LABX, then the 4-hour candle they form. Hour 15 is a large bearish candle; the 4-hour candle is bullish, from 101.90 to 102.60.",
            },
            steps: [
              {
                text: "Hour 15 falls 0.98, from 103.16 to 102.18.",
                layers: [{ kind: "bracket", from: 102.18, to: 103.16, index: 2, label: "−0.98", role: "down" }],
              },
              {
                text: "The 4H candle for hours 13 to 16 opens at 101.90 and closes at 102.60.",
                layers: [
                  { kind: "marker", index: 4, at: "open", label: "4H OPEN 101.90" },
                  { kind: "marker", index: 4, at: "close", label: "4H CLOSE 102.60" },
                ],
              },
            ],
          },
          reveal: "No contradiction. Hour 15 fell 0.98, but the four hours together rose 0.70. Aggregation hides the path; it doesn't change what happened.",
          concept: "candle-aggregation",
        },
        {
          kind: "explain",
          title: "Match the timeframe to the trade",
          text: "Choose the timeframe from how long you plan to hold. A swing trade held for days is usually read on 1H, 4H or daily candles. A day trade that lasts minutes needs minute candles. A three-day trade spans 4,320 one-minute candles: far too many to manage it on.",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "Pick the timeframe before you look for a signal. Switching timeframes until a chart agrees with you is a bias, not analysis. You'll combine two timeframes properly in lesson 1.5.8.",
        },
      ],
      task: {
        widget: "candle-builder",
        goal: "Build the 4-hour candle for hours 5–8. O/H/L/C: H5 100.30/100.80/100.10/100.70 · H6 100.70/101.40/100.60/101.20 · H7 101.20/101.30/100.70/100.80 · H8 100.80/101.60/100.75/101.50.",
        // Starts on the 4H candle for hours 1–4, built in the worked example.
        start: { open: 100.0, high: 101.1, low: 99.6, close: 100.3 },
        success: {
          all: [
            { field: "open", eq: 100.3, tol: 0.001 },
            { field: "high", eq: 101.6, tol: 0.001 },
            { field: "low", eq: 100.1, tol: 0.001 },
            { field: "close", eq: 101.5, tol: 0.001 },
          ],
        },
        feedback: [
          { when: { not: { field: "open", eq: 100.3, tol: 0.001 } }, text: "A 4-hour candle opens where its first hour opened. Use hour 5's open." },
          { when: { not: { field: "close", eq: 101.5, tol: 0.001 } }, text: "A 4-hour candle closes where its last hour closed. Use hour 8's close." },
          { when: { not: { field: "high", eq: 101.6, tol: 0.001 } }, text: "The high is {high:2}. Use the highest of the four hourly highs, whichever hour it came in." },
          { when: { not: { field: "low", eq: 100.1, tol: 0.001 } }, text: "The low is {low:2}. Use the lowest of the four hourly lows." },
        ],
        correct: "Right: {open:2} / {high:2} / {low:2} / {close:2}. Hour 7 fell 0.40, but the 4-hour candle shows only a bullish body of {body:2}.",
        hints: ["Open = the first open; close = the last close.", "High = the highest of the four highs.", "Low = the lowest of the four lows."],
        showMe: { open: 100.3, high: 101.6, low: 100.1, close: 101.5 },
        concept: "candle-aggregation",
      },
      check: ["q-1.2.3-1", "q-1.2.3-2", "q-1.2.3-3"],
      recap: {
        next: "Next, 1.2.4: the volume bars under the candles, and what they can and can't tell you.",
        takeaways: [
          "A longer candle takes the first open, highest high, lowest low and last close.",
          "The same market can look choppy on 1H and steady on 4H: aggregation hides the path.",
          "Choose the timeframe from your holding period before looking for a signal, then stick with it.",
        ],
      },
    },
  },

  // 1.2.4 · Volume
  {
    id: "1.2.4",
    title: "Volume",
    topic: "market_fundamentals",
    level: "beginner",
    tier: "free",
    minutes: 5,
    summary: "What volume bars measure, how to compare each one with its average, and why volume never shows direction.",
    objectives: [
      "Read volume bars under a price chart and compare them with their average.",
      "Explain that volume measures activity, not direction.",
      "Recognise that spot FX and CFD charts usually show tick volume from one broker.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "breakout", label: "Arena: breakout" },
      { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
    ],
    script: {
      unit: "1.2",
      courseId: "1.2.4",
      bridge: "In 1.2.1 and 1.2.3 each candle gave you four prices, on 1H or 4H. Here you add the panel under the candles: volume, how many units changed hands in each period, and how to tell when it's unusual.",
      hook: {
        prompt: "[[volume|Volume]] jumps to three times its average on a candle that closes flat. Were there more buyers or more sellers?",
        control: {
          kind: "choice",
          choices: [
            { id: "buyers", label: "More buyers", feedback: "Every unit bought was sold by someone, so volume can't lean towards buyers." },
            { id: "sellers", label: "More sellers", feedback: "Every unit sold was bought by someone, so volume can't lean towards sellers." },
            { id: "neither", label: "Neither: every unit bought was also sold", feedback: "Right. Each trade has a buyer and a seller. Volume counts the units, not a side." },
          ],
          answer: "neither",
        },
        compare: "You picked {yours}. Every trade has a buyer and a seller, so volume counts units traded, not which side won.",
        concept: "volume",
      },
      learn: [
        {
          kind: "figure",
          title: "A day with a breakout",
          text: "[[volume|Volume]] is the number of units traded in a period. Every unit bought was sold by someone, so volume measures activity: how much changed hands, not which way price went.",
          figure: {
            kind: "chart",
            chart: { candles: L124 },
            steps: [
              { text: "A quiet range between 99.60 and 100.50 for 14 hours.", layers: [{ kind: "zone", from: 99.6, to: 100.5, role: "neutral", label: "HOURS 1–14" }] },
              { text: "Hour 15 breaks out and closes at 101.10.", layers: [{ kind: "marker", index: 14, at: "close", label: "BREAKOUT" }] },
              { text: "Hour 21: news. Wicks both ways, and a close just 0.02 above the open.", layers: [{ kind: "marker", index: 20, at: "high", label: "NEWS" }] },
            ],
          },
          concept: "volume",
        },
        {
          kind: "figure",
          title: "The same day's volume",
          figure: {
            kind: "chart",
            chart: L124_VOLUME,
            steps: [
              { text: "Volume for the same 24 hours, one bar per hour. The line is the 20-hour average.", layers: [L124_AVG_LINE] },
              { text: "Hour 15, the breakout: 2,500 units.", layers: [{ kind: "marker", index: 14, at: "high", label: "2,500" }] },
              { text: "Hour 21, the news: 2,700 units, the tallest bar. The average has risen since the breakout.", layers: [{ kind: "marker", index: 20, at: "high", label: "2,700" }] },
            ],
          },
          concept: "volume",
        },
        {
          kind: "hotspot",
          title: "Busy compared with what?",
          prompt: "Tap the hour with the most volume compared with its average.",
          chart: { ...L124_VOLUME, layers: [L124_AVG_LINE] },
          zones: [
            { id: "h15", label: "Hour 15", index: 14 },
            { id: "h19", label: "Hour 19", index: 18, feedback: "Hour 19 traded 1,800 units against an average of about 1,170: about 1.5 times. Look for a bar further above its line." },
            { id: "h21", label: "Hour 21", index: 20, feedback: "It's the tallest bar, 2,700, but the average had risen to about 1,290: about 2.1 times. Another hour stands further above its line." },
          ],
          answer: "h15",
          correct: "Right. Hour 15 traded 2,500 units against an average of about 1,010: about 2.5 times. The tallest bar isn't always the most unusual one.",
          concept: "volume",
        },
        {
          kind: "explain",
          title: "What volume tells you",
          text: "High volume means many units changed hands: more interest and attention. It often rises around breakouts, news and market opens. It doesn't tell you direction. Hour 21 had the most volume of the day and closed just 0.02 above its open.",
        },
        {
          kind: "explain",
          title: "Tick volume",
          text: "Spot forex has no central exchange, so no one sees its total volume. The volume on most retail FX and CFD charts is [[tick-volume|tick volume]]: how many times one broker's price changed in the period. Futures and stocks show exchange volume. LABX volume is synthetic, made by the simulator.",
        },
        {
          kind: "match",
          title: "What volume can show",
          prompt: "Sort each question: can a volume bar answer it?",
          pairs: [
            { left: "How busy was the hour?", right: "Volume shows it", wrong: "That's exactly what volume counts: the units that changed hands." },
            { left: "Did buyers or sellers win?", right: "Volume can't show it", wrong: "Every unit has a buyer and a seller, so volume can't lean to one side." },
            { left: "Did the breakout draw unusual interest?", right: "Volume shows it", wrong: "A bar far above its average shows unusual activity, like hour 15's 2,500 units." },
            { left: "Where does price go next?", right: "Volume can't show it", wrong: "Volume describes the period that just ended. It doesn't forecast the next one." },
            { left: "How much EUR/USD traded worldwide, on a retail FX chart?", right: "Volume can't show it", wrong: "Retail FX charts show tick volume from one broker. Total spot FX volume isn't visible to anyone." },
          ],
          correct: "Volume measures activity. Direction and the future are somewhere else.",
          concept: "volume",
        },
        {
          kind: "callout",
          tone: "info",
          text: "Volume is context. Tools built on it, such as OBV, VWAP and volume profile, come in unit 2.5, together with the evidence for them.",
        },
        {
          kind: "predict",
          title: "Twice the average",
          prompt: "Here are 30 hours of volume, with the 20-hour average and a dashed line at twice that average. How many hours reached at least twice their average?",
          control: {
            kind: "choice",
            choices: [
              { id: "two", label: "Two", feedback: "Count again: three bars reach the dashed line." },
              { id: "three", label: "Three", feedback: "Hours 6, 17 and 26 reach the dashed line. Hours 11 and 22 stop short, at about 1.7 times." },
              { id: "four", label: "Four", feedback: "Two of the tall bars, hours 11 and 22, stop below the dashed line: about 1.7 times their average." },
              { id: "five", label: "Five", feedback: "Hours 11 and 22 look tall but stop below the dashed line: about 1.7 times their average." },
            ],
            answer: "three",
          },
          figure: {
            kind: "chart",
            chart: {
              candles: volumeBars(L124_TRY_VOL, L124_TRY_UP),
              layers: [
                { kind: "line", values: L124_TRY_AVG, role: "concept", label: "AVERAGE" },
                { kind: "line", values: L124_TRY_AVG.map((a) => 2 * a), role: "neutral", dashed: true, label: "2 × AVERAGE" },
              ],
              range: [0, 3200],
              describe: "30 hourly volume bars near 1,000 units, with tall bars in hours 6, 11, 17, 22 and 26, a line for the 20-hour average and a dashed line at twice it. Hours 6, 17 and 26 reach the dashed line.",
            },
            steps: [
              {
                text: "Hours 6, 17 and 26 reach at least twice their average. Hours 11 and 22 don't.",
                layers: [
                  { kind: "marker", index: 5, at: "high", label: "2.6×" },
                  { kind: "marker", index: 16, at: "high", label: "2.3×" },
                  { kind: "marker", index: 25, at: "high", label: "2.3×" },
                ],
              },
            ],
          },
          reveal: "A ratio, not a height, makes a bar unusual: hour 26 is the tallest bar, yet hour 6 stands highest above its average.",
          concept: "volume",
        },
      ],
      check: ["q-1.2.4-1", "q-1.2.4-2", "q-1.2.4-3"],
      recap: {
        next: "Next, 1.2.5: measure how tall a normal candle is, and what happens when price jumps a gap.",
        takeaways: [
          "Volume counts units traded in a period. Compare each bar with its average, not with the tallest bar.",
          "Every trade has a buyer and a seller, so volume shows activity, never direction.",
          "Retail FX and CFD charts usually show tick volume: one broker's price changes, not total trading.",
        ],
      },
    },
  },

  // 1.2.5 · Normal candle size and gaps
  {
    id: "1.2.5",
    title: "Normal candle size and gaps",
    topic: "market_fundamentals",
    level: "beginner",
    tier: "free",
    minutes: 6,
    summary: "How tall a normal candle is, what a gap is, and why no order can fill at the prices a gap jumps over.",
    objectives: [
      "Measure a candle's range and the average range of recent candles.",
      "Spot a gap between one candle's close and the next candle's open.",
      "Explain why no order can fill at the prices a gap jumps over.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
      { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
    ],
    script: {
      unit: "1.2",
      courseId: "1.2.5",
      bridge: "In 1.2.1 you measured a candle from its low to its high, and in 1.2.4 you compared each volume bar with its average. Here you do the same with candle heights, then meet the gap: prices nobody traded at.",
      hook: {
        prompt: "These ten LABX candles have ranges between 0.30 and 0.55. The next candle opens 1.20 below the last close. What happened in between?",
        control: {
          kind: "choice",
          choices: [
            { id: "fast", label: "Price traded down very fast", feedback: "Fast trading would still leave prices on the chart. Here nothing traded between 100.00 and 98.80." },
            { id: "none", label: "No trades happened at the prices in between", feedback: "Right. That empty space is a gap." },
            { id: "error", label: "A display error", feedback: "The chart is right. Price closed at 100.00 and the next trade was at 98.80: a gap." },
          ],
          answer: "none",
        },
        figure: {
          kind: "chart",
          chart: { candles: L125.slice(0, 11) },
          steps: [{ text: "Ten candles with ranges from 0.31 to 0.55. Candle 11 opens 1.20 below candle 10's close." }],
        },
        compare: "You picked {yours}. It was a gap: candle 10 closed at 100.00, candle 11 opened at 98.80, and nothing traded in between.",
        concept: "price-gaps",
      },
      learn: [
        {
          kind: "explain",
          text: "A candle's [[candle-range|range]] is its high minus its low, the full height you measured in lesson 1.2.1. It isn't the same as a [[range]] market, the sideways phase you'll meet in unit 1.5. Measuring a few recent candles tells you how far price normally travels in one period.",
        },
        {
          kind: "worked",
          title: "A normal candle",
          lines: ["Ranges of the last five candles: 0.40, 0.35, 0.50, 0.45, 0.30.", "Total: 2.00.", "Average = 2.00 ÷ 5 = ?"],
          ask: {
            answer: 0.4,
            tolerance: 0,
            feedback: [
              { value: 2, text: "That's the total. Divide it by the five candles." },
              { value: 0.5, text: "That's the largest range. The average is the total divided by five." },
            ],
            correct: "Right: 0.40.",
          },
          after: "A normal candle here is about 0.40 tall. Lesson 1.4.3 uses this number to judge whether a stop sits inside the noise.",
          concept: "candle-range",
        },
        {
          kind: "figure",
          title: "A gap",
          text: "Where such a stop does fill is the subject of lesson 1.3.2. For now: empty space on a chart is not a price any order can use.",
          figure: {
            kind: "chart",
            chart: { candles: L125 },
            steps: [
              {
                text: "Candle 10 closes at 100.00. Candle 11 opens at 98.80.",
                layers: [
                  { kind: "marker", index: 9, at: "close", label: "CLOSE 100.00" },
                  { kind: "marker", index: 10, at: "open", label: "OPEN 98.80" },
                ],
              },
              { text: "Between them is a 1.20 gap: no trade happened at any of those prices.", layers: [{ kind: "zone", from: 98.8, to: 100.0, role: "concept", label: "GAP 1.20" }] },
              { text: "A stop at 99.50 sits inside the gap. There was no trade at 99.50 to fill it.", layers: [{ kind: "level", price: 99.5, role: "stop", label: "STOP 99.50" }] },
            ],
          },
          concept: "price-gaps",
        },
        {
          kind: "hotspot",
          title: "Tap the gap",
          prompt: "One of these three marks is a gap. Tap it.",
          chart: {
            candles: L125_HOT,
            describe: "20 candles near 100.00. Candle 6 is a large bearish candle; candle 12 closes at 100.40 and candle 13 opens at 101.30, leaving empty space; candle 17 has a long upper wick to 102.05.",
          },
          zones: [
            { id: "big", label: "Candle 6", index: 5, price: 99.8, feedback: "That's a big candle, 1.10 from high to low, but every price in it traded. A gap is empty space between one close and the next open." },
            { id: "gap", label: "Between candles 12 and 13", index: 11.5, price: 100.85 },
            { id: "wick", label: "Candle 17's upper wick", index: 16, price: 101.75, feedback: "That's a long wick: price traded up to 102.05 and came back. A gap is where nothing traded at all." },
          ],
          answer: "gap",
          correct: "Right. Candle 12 closes at 100.40 and candle 13 opens at 101.30: a 0.90 gap with no trading in between.",
          concept: "price-gaps",
        },
        {
          kind: "explain",
          title: "Where gaps come from",
          text: "Gaps appear where trading pauses or jumps: overnight and weekend closes, or sudden news. In MARKET//LAB you'll meet them in Arena: event shock. A market that trades around the clock gaps less often, but sharp jumps still happen.",
        },
        {
          kind: "predict",
          title: "Gaps always fill?",
          prompt: "A popular saying: 'gaps always fill'. Is it true?",
          control: {
            kind: "choice",
            choices: [
              { id: "always", label: "Always", feedback: "Some gaps are never revisited, and one such chart is enough to break 'always'." },
              { id: "often", label: "Often, but mostly by chance", feedback: "Price comes back to many gaps, but it comes back to most nearby prices sooner or later." },
              { id: "never", label: "Never", feedback: "Price does return to many gaps, just not because they are gaps." },
            ],
            answer: "often",
          },
          reveal: "Price often returns to a gap's prices, as it returns to most nearby prices. The evidence that gaps pull price back is weak: revisits look close to what chance alone would produce.",
          concept: "price-gaps",
        },
        {
          kind: "callout",
          tone: "key",
          text: "A normal candle tells you what noise looks like. A stop closer than one normal candle sits inside the noise. You'll use this in lesson 1.4.3.",
        },
        {
          kind: "predict",
          title: "Measure the normal candle",
          prompt: "These are the ranges of the ten candles before the gap. What is their average range?",
          control: {
            kind: "numeric",
            answer: 0.42,
            tolerance: 0.01,
            feedback: [
              { value: 4.2, text: "That's the total. Divide it by the ten candles." },
              { value: 0.55, text: "That's the largest range. Add all ten, then divide by ten." },
              { value: 0.31, text: "That's the smallest range. Add all ten, then divide by ten." },
            ],
          },
          figure: { kind: "bars", bars: L125_RANGES.map((value, i) => ({ label: `Candle ${i + 1}`, value })) },
          reveal: "Total 4.20 ÷ 10 = 0.42. A normal candle here is about 0.42, so the 1.20 gap was almost three normal candles.",
          concept: "candle-range",
        },
      ],
      check: ["q-1.2.5-1", "q-1.2.5-2", "q-1.2.5-3"],
      recap: {
        next: "Next, 1.2.6: why a move in percent says more than a move in price, and how a log scale draws it.",
        takeaways: [
          "A candle's range is high minus low; the average of recent ranges is a normal candle.",
          "A gap is a jump from one close to the next open, with no trading in between.",
          "No order can fill inside a gap: nothing traded there. Gaps fill often, but mostly by chance.",
        ],
      },
    },
  },

  // 1.2.6 · Linear and log scale
  {
    id: "1.2.6",
    title: "Linear and log scale",
    topic: "market_fundamentals",
    level: "beginner",
    tier: "free",
    minutes: 5,
    summary: "Why a move in percent says more than a move in price, and how a log scale draws equal percentages as equal heights.",
    objectives: [
      "Compare two price moves in percentage terms rather than in price units.",
      "Explain how a log scale draws equal percentage moves as equal distances.",
      "Choose a log scale for long histories with large price changes.",
    ],
    blocks: [],
    practice: [{ kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" }],
    script: {
      unit: "1.2",
      courseId: "1.2.6",
      bridge: "In 1.2.2 the same prices looked different as a line, bars or candles. Here the drawing changes on the price axis instead: a log scale gives equal percentage moves equal heights, which matters over long histories.",
      hook: {
        prompt: "LABX goes from 50.00 to 100.00, then from 100.00 to 150.00. Which move was bigger?",
        control: {
          kind: "choice",
          choices: [
            { id: "first", label: "The first", feedback: "In percentage terms, yes: +100% against +50%. In price, both were +50.00." },
            { id: "second", label: "The second", feedback: "The second ended higher, but both moves were +50.00 in price, and the first was the bigger percentage." },
            { id: "same", label: "The same", feedback: "In price, yes: +50.00 each. In percentage, the first doubled the price and the second added half." },
          ],
          answer: "first",
        },
        compare: "You picked {yours}. In price both moves were +50.00. In percentage the first was +100% and the second +50%.",
        concept: "log-scale",
      },
      learn: [
        {
          kind: "explain",
          text: "On a [[linear-scale|linear scale]], equal price steps take equal heights: a move from 50.00 to 100.00 looks exactly as tall as one from 100.00 to 150.00. That's fine for a few days of prices. Over long histories it misleads, because the same 50.00 means much more at a low price than at a high one.",
        },
        {
          kind: "worked",
          title: "Percentage change",
          lines: ["% change = (new − old) ÷ old.", "50.00 → 100.00: (100.00 − 50.00) ÷ 50.00 = +100%.", "100.00 → 150.00: (150.00 − 100.00) ÷ 100.00 = ?"],
          ask: {
            answer: 50,
            tolerance: 0.01,
            unit: "%",
            feedback: [
              { value: 33.33, text: "That divides by the new price, 150.00. Divide by where the move started: 100.00." },
              { value: 150, text: "That's the new price as a share of the old. Subtract the starting 100%." },
            ],
            correct: "Right: +50%. The same price move, half the percentage.",
          },
          after: "Equal moves in price, +50.00 each, but +100% and then +50%. The higher the price, the less a fixed move means.",
          concept: "log-scale",
        },
        {
          kind: "figure",
          title: "Ten years, two scales",
          text: "Early growth looks flat on a linear scale, even though price doubled there just as it did at the end.",
          figure: {
            kind: "chart",
            chart: {
              candles: L126,
              describe: "Forty quarterly candles of a synthetic price rising from 20.00 to 160.00. On this linear scale the early quarters look almost flat and the last ones very steep.",
            },
            steps: [
              { text: "A synthetic price over ten years, one candle per quarter, from 20.00 to 160.00." },
              {
                text: "Three doublings: 20 to 40, 40 to 80, 80 to 160.",
                layers: [
                  { kind: "bracket", from: 20, to: 40, index: 1, label: "×2", role: "concept" },
                  { kind: "bracket", from: 40, to: 80, index: 1, label: "×2", role: "concept" },
                  { kind: "bracket", from: 80, to: 160, index: 1, label: "×2", role: "concept" },
                ],
              },
              { text: "On this linear scale, each doubling is twice as tall as the one before." },
              { text: "On a log scale, each doubling is the same height.", scale: "log" },
            ],
          },
          concept: "log-scale",
        },
        {
          kind: "predict",
          title: "On a log scale",
          prompt: "On a [[log-scale|log scale]] chart, how do a move from 50 to 100 and a move from 100 to 200 look?",
          control: {
            kind: "choice",
            choices: [
              { id: "twice", label: "The second is twice as tall", feedback: "That's the linear picture: +50 against +100 in price. On a log scale both are +100%." },
              { id: "same", label: "The same height", feedback: "Both are +100%, a doubling, and a log scale gives equal percentage moves equal heights." },
            ],
            answer: "same",
          },
          reveal: "A log scale spaces prices by ratio: 50 to 100 and 100 to 200 are both ×2, so they take the same height. On a linear scale the second would be twice as tall.",
          concept: "log-scale",
        },
        {
          kind: "explain",
          title: "When to switch",
          text: "A log scale helps with long histories and with comparing markets at different prices. Over a few days of LABX the two scales look almost the same: between 98.00 and 102.00, a 1.00 step is 1.02% at the bottom and 0.98% at the top.",
        },
        {
          kind: "callout",
          tone: "key",
          text: "Thinking in percentages is how you'll think about risk: as a share of your account, not a fixed sum of money (unit 1.4).",
        },
        {
          kind: "predict",
          title: "Three legs",
          prompt: "This synthetic price rises in three legs: 20.00 to 40.00, 40.00 to 60.00, then 60.00 to 150.00. On this linear chart legs 1 and 2 are equally tall. Which is the bigger percentage move?",
          control: {
            kind: "choice",
            choices: [
              { id: "leg1", label: "Leg 1", feedback: "Leg 1 doubled from 20.00: +100%. Leg 2 added 20.00 to 40.00: +50%." },
              { id: "leg2", label: "Leg 2", feedback: "Leg 2 ended higher, but 20.00 on top of 40.00 is +50%. Leg 1 doubled: +100%." },
              { id: "same", label: "The same", feedback: "The same in price, +20.00 each. In percentage, leg 1 doubled (+100%) and leg 2 rose by half (+50%)." },
            ],
            answer: "leg1",
          },
          figure: {
            kind: "chart",
            chart: {
              candles: L126_TRY,
              layers: [20, 40, 60, 150].map((price): ChartLayer => ({ kind: "level", price, role: "neutral" })),
              describe: "Thirty candles of a synthetic price: from 20.00 to 40.00, then to 60.00, then a steep leg to 150.00, with levels at 20, 40, 60 and 150.",
            },
            steps: [
              {
                text: "Leg 1 is +100%, leg 2 is +50%. A log scale would draw leg 1 taller than leg 2.",
                layers: [
                  { kind: "bracket", from: 20, to: 40, index: 9, label: "LEG 1 +100%", role: "concept" },
                  { kind: "bracket", from: 40, to: 60, index: 19, label: "LEG 2 +50%", role: "concept" },
                ],
              },
            ],
          },
          reveal: "Equal heights on a linear chart can hide very different percentage moves. Now measure leg 3.",
          concept: "log-scale",
        },
        {
          kind: "worked",
          title: "The biggest leg",
          lines: ["% change = (end − start) ÷ start.", "Leg 1: (40.00 − 20.00) ÷ 20.00 = +100%.", "Leg 2: (60.00 − 40.00) ÷ 40.00 = +50%.", "Leg 3: (150.00 − 60.00) ÷ 60.00 = ?"],
          ask: {
            answer: 150,
            tolerance: 0.01,
            unit: "%",
            feedback: [
              { value: 90, text: "That's the move in price, 90.00. Divide it by the start, 60.00." },
              { value: 60, text: "That divides by the end price, 150.00. Divide by the start, 60.00." },
              { value: 250, text: "That's the end as a share of the start. Subtract the starting 100%." },
            ],
            correct: "Right: +150%, the largest of the three legs.",
          },
          after: "Leg 3 is the largest move on either scale. But on a linear chart it looks 4.5 times as tall as leg 1, while in percentage it's only 1.5 times as big.",
          concept: "log-scale",
        },
      ],
      check: ["q-1.2.6-1", "q-1.2.6-2", "q-1.2.6-3"],
      recap: {
        next: "Next, 1.2.7: what no chart, on any scale or timeframe, can tell you.",
        takeaways: [
          "Compare moves in percent: (new − old) ÷ old. The same price move means less at higher prices.",
          "A log scale gives equal percentage moves equal heights; a linear scale gives equal price moves equal heights.",
          "Use a log scale for long histories and big price changes; over a few days both look alike.",
        ],
      },
    },
  },

  // 1.2.7 · What a chart can't tell you
  {
    id: "1.2.7",
    title: "What a chart can't tell you",
    topic: "market_fundamentals",
    level: "beginner",
    tier: "free",
    minutes: 6,
    summary: "What a price chart records, what it leaves out, and how hindsight and hand-picked examples make patterns look surer than they are.",
    objectives: [
      "List what a price chart records and what it leaves out: who traded, why, the order inside a candle, the future.",
      "Recognise hindsight in chart examples that already show the outcome.",
      "Ask the base-rate question before trusting a pattern seen on a chart.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "reversal", label: "Arena: reversal" },
      { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    ],
    script: {
      unit: "1.2",
      courseId: "1.2.7",
      bridge: "From 1.2.1 to 1.2.6 you read what a chart records: prices, volume, candle size, gaps and scale. In 0.2.5 random coin flips drew convincing trends. Here you list what no chart records, and why examples picked after the outcome mislead.",
      hook: {
        prompt: "A textbook chart: support near 98.00 held three times, then price jumped. Would you have bought at the third touch?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes", feedback: "Buying worked on this chart. But it was chosen because it worked; you haven't seen the ones that failed." },
            { id: "no", label: "No", feedback: "Maybe, but on what evidence? One chart can't tell you how often a third touch holds." },
            { id: "cant", label: "Can't tell without other examples", feedback: "Right. One example, picked after the outcome, says nothing about how often a third touch holds." },
          ],
          answer: "cant",
        },
        figure: {
          kind: "chart",
          chart: { candles: L127_BOOK, layers: [L127_SUPPORT] },
          steps: [{ text: "Support near 98.00 holds at candles 5, 12 and 19. Then price climbs to 101.50.", layers: L127_TOUCHES }],
        },
        compare: "You picked {yours}. The textbook showed a chart where the third touch held. Charts where it broke look the same at the touch.",
        concept: "chart-limits",
      },
      learn: [
        {
          kind: "figure",
          title: "Same shape, other ending",
          text: "At the third touch, both charts looked the same. The textbook printed the one that worked. One example can't tell you how often a pattern holds.",
          figure: {
            kind: "chart",
            chart: { candles: L127_FAIL, layers: [L127_SUPPORT], visible: 19 },
            steps: [
              { text: "Another chart with the same three touches of 98.00.", layers: L127_TOUCHES },
              { text: "Here the third touch gave way. Price fell to 96.80.", visible: 24, layers: [{ kind: "marker", index: 22, at: "low", label: "96.80", role: "down" }] },
            ],
          },
          concept: "chart-limits",
        },
        {
          kind: "explain",
          title: "What a chart records",
          text: "A price chart records where price traded and, with volume, how much traded, period by period. It doesn't record who traded or why, the order of prices inside a [[candle]], or the next candle. Every reading you take from a chart sits inside those limits.",
        },
        {
          kind: "figure",
          title: "The right edge",
          figure: {
            kind: "chart",
            chart: { candles: L127_EDGE, visible: 30 },
            steps: [
              { text: "Candle 30: price has fallen from 102.00 to 98.10. What comes next isn't on the chart." },
              { text: "The whole chart: candle 30 now looks like an obvious turn, up to 101.00.", visible: 40, layers: [{ kind: "marker", index: 29, at: "low", label: "LOW 97.85" }] },
              { text: "That feeling is [[hindsight-bias|hindsight bias]]: knowing the outcome makes it look predictable." },
            ],
          },
          concept: "hindsight-bias",
        },
        {
          kind: "reveal",
          title: "Blind call",
          prompt: "Price has climbed from 99.00 to 101.00 over 22 candles. What do the next 8 candles do?",
          chart: { candles: L127_CALL1, visible: 22 },
          choices: [
            { id: "up", label: "Keep rising", feedback: "It went sideways. If your reason was 'it has been rising', that clue needs testing on many charts, not one." },
            { id: "down", label: "Fall back", feedback: "It went sideways. If you expected a drop after a long rise, ask how often that happens across many charts." },
            { id: "side", label: "Move sideways", feedback: "It matched. One right call still proves little: what did your reasoning use, and would it work on many charts?" },
          ],
          answer: "side",
          after: "The next 8 candles stayed between 100.61 and 101.26 and closed at 101.00, where they started. Whatever you picked, judge the reasoning: what did it use, and how often does that clue work?",
          concept: "chart-limits",
        },
        {
          kind: "match",
          title: "Can the chart tell?",
          prompt: "Sort each question: can a price chart answer it?",
          pairs: [
            { left: "Where did price trade each hour?", right: "The chart shows it", wrong: "Every candle records its open, high, low and close. That's exactly what a chart keeps." },
            { left: "How many units traded, with volume shown?", right: "The chart shows it", wrong: "Volume bars record the units traded in each period." },
            { left: "Who bought, and why?", right: "The chart can't tell", wrong: "A chart has no names and no reasons, only prices and volume." },
            { left: "Did the high come before the low?", right: "The chart can't tell", wrong: "A candle keeps four prices, not their order. Either path draws the same candle (lesson 1.2.1)." },
            { left: "What will the next candle do?", right: "The chart can't tell", wrong: "The chart ends at the right edge. The next candle isn't on it." },
          ],
          correct: "A chart is a record of prices and volume. Everything else is your interpretation.",
          concept: "chart-limits",
        },
        {
          kind: "explain",
          title: "Picked after the fact",
          text: "Chart examples in books and posts are usually chosen after the outcome was known. That's [[cherry-picking]]: the charts where the pattern failed don't get printed. Random price series draw convincing shapes too, as you saw in lesson 0.2.5. A good example shows a pattern can happen, not how often it works.",
        },
        {
          kind: "callout",
          tone: "key",
          text: "The evidence question for anything you see on a chart: how often does it work, on how many charts, after costs, and compared with random?",
        },
        {
          kind: "predict",
          title: "Blind call with confidence",
          prompt: "Price is at 100.10. How likely is it to close higher than that 10 candles from now? Set your confidence.",
          control: {
            kind: "slider",
            min: 10,
            max: 90,
            step: 5,
            unit: "%",
            start: 50,
            feedback: [
              { from: 10, to: 35, text: "A strong call for a fall, from one picture. What base rate would support it?" },
              { from: 40, to: 60, text: "Close to a coin flip. With no tested edge, that's an honest answer." },
              { from: 65, to: 90, text: "A strong call for a rise, from one picture. What base rate would support it?" },
            ],
          },
          figure: {
            kind: "chart",
            chart: { candles: L127_CALL2, visible: 20, layers: [{ kind: "level", price: 100.1, role: "neutral", label: "NOW 100.10" }] },
            steps: [{ text: "Ten candles later, price closed at 99.40, below 100.10.", visible: 30 }],
          },
          reveal: "Price fell this time, but one call can't show skill either way. Over many calls, a 70% confidence should be right about 7 times in 10. Without a tested edge, staying near 50% is the calibrated answer.",
          concept: "chart-limits",
        },
      ],
      check: ["q-1.2.7-1", "q-1.2.7-2", "q-1.2.7-3"],
      recap: {
        next: "Next: the 1.2 checkpoint, then unit 1.3, Orders and execution, which starts with 1.3.1: market and limit orders.",
        takeaways: [
          "A chart records price and volume. It can't show who traded, why, the path inside a candle, or what's next.",
          "Examples picked after the outcome look obvious. That's hindsight and cherry-picking, not evidence.",
          "Before trusting a pattern, ask: how often, on how many charts, after costs, compared with random?",
        ],
      },
    },
  },
];

// ─── Check questions ────────────────────────────────────────────────────────

const questions: Question[] = [
  // 1.2.2
  {
    id: "q-1.2.2-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "What does a line chart of hourly LABX prices show for each hour?",
    options: [
      { id: "a", label: "The open and the close", rationale: "A line has one point per period. There's no room for a second price, so only the close is kept." },
      { id: "b", label: "The high and the low", rationale: "Highs and lows need a vertical line or a wick. A line chart drops them, which is why spikes vanish from it." },
      { id: "c", label: "Only the closing price" },
      { id: "d", label: "All four prices, drawn more thinly", rationale: "That describes an OHLC bar. A line chart keeps a single price per period: the close." },
    ],
    correct: "c",
    explanation: "A line chart joins each period's close and drops the open, high and low. It's clean for overviews, but a spike that closed lower never appears on it.",
    lesson: "1.2.2",
    concepts: ["chart-types"],
  },
  {
    id: "q-1.2.2-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "An OHLC bar's line runs from 99.40 to 100.60. Its left tick is at 100.30 and its right tick at 99.70. What happened in that hour?",
    options: [
      { id: "a", label: "It opened at 99.70 and closed at 100.30, a bullish hour", rationale: "That swaps the ticks. The left tick is the open and the right tick is the close, so price fell from 100.30 to 99.70." },
      { id: "b", label: "It opened at 100.30, traded between 99.40 and 100.60, and closed at 99.70" },
      { id: "c", label: "It closed at 100.60, the top of the line", rationale: "The top of the line is the high. The close is the tick on the right, 99.70." },
      { id: "d", label: "It opened at 99.40 and closed at 100.60", rationale: "Those are the ends of the line: the low and the high. Open and close are the side ticks." },
    ],
    correct: "b",
    explanation: "On an OHLC bar the left tick is the open (100.30), the right tick is the close (99.70) and the line spans the low (99.40) to the high (100.60). The close is below the open, so the hour was bearish.",
    lesson: "1.2.2",
    concepts: ["chart-types"],
    hints: ["An OHLC bar puts the open on one side and the close on the other.", "Left tick = open, right tick = close. The ends of the line are the high and the low."],
  },
  {
    id: "q-1.2.2-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "You want one picture of how a stock index has moved over the last ten years, to compare it with another index.",
    prompt: "Which chart fits the task best?",
    options: [
      { id: "a", label: "1-hour candles, so no detail is lost", rationale: "Ten years of hourly candles is thousands of candles. At that zoom each one is a sliver, so the detail is there but unreadable." },
      { id: "b", label: "OHLC bars, so each period's open is visible", rationale: "Single-period opens don't matter for a ten-year view. The extra marks add clutter without answering the question." },
      { id: "c", label: "Any type: they all show the same information", rationale: "They draw the same data but keep different amounts of it. For a long overview, fewer marks per period make the path easier to read." },
      { id: "d", label: "A line chart of the closes" },
    ],
    correct: "d",
    explanation: "For a long overview and a comparison, a line of closes shows the path clearly with one price per period. Bars and candles are for reading single periods, which a ten-year view doesn't need.",
    lesson: "1.2.2",
    concepts: ["chart-types"],
    hints: ["Ask what the task needs: single periods, or the overall path?", "A ten-year comparison needs the path, not each period's high and low."],
  },

  // 1.2.3
  {
    id: "q-1.2.3-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 1,
    prompt: "Four 1-hour candles have highs of 100.80, 101.25, 101.10 and 100.95. What is the high of the 4-hour candle they form, in vUSD?",
    numeric: { answer: 101.25, tolerance: 0.001, unit: "vUSD" },
    explanation: "A 4-hour candle's high is the highest of its hourly highs: 101.25. Taking the last high or an average would miss the moment price traded highest.",
    lesson: "1.2.3",
    concepts: ["candle-aggregation"],
    hints: ["The 4-hour high is one of the four hourly highs.", "Take the highest of the four, not the last one or the average."],
    vary: {
      fields: { h1: [100, 102, 0.05], h2: [100, 102, 0.05], h3: [100, 102, 0.05], h4: [100, 102, 0.05] },
      constraints: ["h1 != h2", "h1 != h3", "h1 != h4", "h2 != h3", "h2 != h4", "h3 != h4"],
      answer: "max(h1, h2, h3, h4)",
      prompt: "Four 1-hour candles have highs of {h1:2}, {h2:2}, {h3:2} and {h4:2}. What is the high of the 4-hour candle they form, in vUSD?",
      explanation: "A 4-hour candle's high is the highest of its hourly highs: {answer:2}. Taking the last high or an average would miss the moment price traded highest.",
      hint: "Compare {h1:2}, {h2:2}, {h3:2} and {h4:2}, and take the highest.",
    },
  },
  {
    id: "q-1.2.3-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "Over four hours LABX rises, drops 0.80 in the third hour, then recovers. The 4-hour candle is bullish. Where is the 0.80 drop on the 4-hour chart?",
    options: [
      { id: "a", label: "In the lower wick, which always shows each pullback", rationale: "The lower wick only shows how far the lowest low sits below the body. A drop in the middle of the period has no mark of its own." },
      { id: "b", label: "Nowhere: the 4-hour chart removes bearish hours as noise", rationale: "Nothing is removed. Every hour's prices are inside the 4-hour candle; the summary just can't show their order." },
      { id: "c", label: "Inside the candle: it keeps only the first open, highest high, lowest low and last close" },
      { id: "d", label: "It would have turned the 4-hour candle bearish", rationale: "Direction compares the last close with the first open. A drop in the middle doesn't change that if price recovers." },
    ],
    correct: "c",
    explanation: "Aggregation keeps four prices from the four hours. The drop happened, but it sits inside the 4-hour candle's range with no mark of its own, which is why longer timeframes look smoother.",
    lesson: "1.2.3",
    concepts: ["candle-aggregation", "timeframe"],
    hints: ["List the four prices a 4-hour candle keeps from its hours.", "None of those four records what happened in the middle of the period."],
  },
  {
    id: "q-1.2.3-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "You plan trades that you'll usually hold for three to five days.",
    prompt: "Which timeframe fits best as your main chart?",
    options: [
      { id: "a", label: "4-hour or daily candles" },
      { id: "b", label: "1-minute candles, to time every move precisely", rationale: "A three-day hold spans thousands of one-minute candles. Most of what they show is noise for a trade of that length." },
      { id: "c", label: "Whichever timeframe shows the clearest signal right now", rationale: "Switching until a chart agrees with you is a bias. Fix the timeframe from your holding period first." },
      { id: "d", label: "Weekly candles, because longer is always more reliable", rationale: "A five-day hold fits inside one weekly candle, so you'd see one or two candles per trade: too coarse to manage it." },
    ],
    correct: "a",
    explanation: "The timeframe should match the holding period. For trades of several days, 4-hour or daily candles give enough candles per trade without drowning it in minute-by-minute noise.",
    lesson: "1.2.3",
    concepts: ["timeframe"],
    hints: ["Start from how long the trade lasts.", "You want several candles per trade, but not thousands."],
  },

  // 1.2.4
  {
    id: "q-1.2.4-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "What does the volume bar under a 1-hour candle measure?",
    options: [
      { id: "a", label: "How many buyers there were compared with sellers", rationale: "Every unit traded has a buyer and a seller, so volume can't lean to one side. It counts units traded." },
      { id: "b", label: "How many units traded during that hour" },
      { id: "c", label: "How far price moved during the hour", rationale: "That's the candle's range, high minus low. Volume counts units traded, which can be large on a tiny move." },
      { id: "d", label: "How many orders were waiting in the order book", rationale: "Resting orders that haven't traded aren't volume. Only units that actually changed hands count." },
    ],
    correct: "b",
    explanation: "Volume is the number of units traded in the period. Each unit has a buyer and a seller, so it measures activity, not which side was stronger.",
    lesson: "1.2.4",
    concepts: ["volume"],
  },
  {
    id: "q-1.2.4-2",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "A 1-hour LABX candle closes 0.03 above its open. Its volume is three times the 20-hour average.",
    prompt: "What can you conclude from these two facts alone?",
    options: [
      { id: "a", label: "Buyers were in control, because it closed higher on high volume", rationale: "A 0.03 rise is close to flat, and volume counts both sides equally. High volume doesn't say who won." },
      { id: "b", label: "A big move is bound to follow within a few hours", rationale: "High volume shows attention now. On its own it doesn't predict the size or timing of the next move." },
      { id: "c", label: "The volume figure must be wrong, since price barely moved", rationale: "Heavy trading with little net movement is common, for example around news. Volume and direction are separate." },
      { id: "d", label: "Unusually many units changed hands, with no clear direction" },
    ],
    correct: "d",
    explanation: "Three times the average means unusual activity. The candle barely moved, and volume has no direction of its own, so the honest reading is 'busy, but undecided'.",
    lesson: "1.2.4",
    concepts: ["volume"],
    hints: ["Separate the two facts: one is about activity, the other about direction.", "Volume counts both sides of every trade. Does a 0.03 move show a winner?"],
  },
  {
    id: "q-1.2.4-3",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "The volume bars on a retail EUR/USD chart show tick volume. What is that?",
    options: [
      { id: "a", label: "The number of price changes at that broker during each period" },
      { id: "b", label: "The total units of EUR/USD traded worldwide in each period", rationale: "Spot forex has no central exchange, so no one sees that total. Tick volume counts one broker's price updates." },
      { id: "c", label: "How many 0.0001 steps price moved in each period", rationale: "That measures distance. Tick volume counts how often the price updated, whatever the size of each change." },
      { id: "d", label: "The volume reported by a futures exchange for the euro", rationale: "Exchange volume is real volume from futures, a different series. Tick volume comes from one broker's quotes." },
    ],
    correct: "a",
    explanation: "Without a central exchange, retail FX and CFD charts count how many times one broker's price changed in each period. It often tracks activity, but it isn't the number of units traded.",
    lesson: "1.2.4",
    concepts: ["volume"],
    hints: ["Ask who could know the total volume of spot forex. Is there a central exchange?", "Tick volume comes from a single broker's price feed."],
  },

  // 1.2.5
  {
    id: "q-1.2.5-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 1,
    prompt: "The last five LABX candles have ranges of 0.60, 0.45, 0.70, 0.55 and 0.50. What is their average range, in vUSD?",
    numeric: { answer: 0.56, tolerance: 0.005, unit: "vUSD" },
    explanation: "Add the five ranges: 2.80. Divide by 5: 0.56. That's what a normal candle looks like right now; a single big candle would not be.",
    lesson: "1.2.5",
    concepts: ["candle-range"],
    hints: ["Add all five ranges first.", "Then divide the total by the number of candles, 5."],
    vary: {
      fields: { r1: [0.2, 1, 0.05], r2: [0.2, 1, 0.05], r3: [0.2, 1, 0.05], r4: [0.2, 1, 0.05], r5: [0.2, 1, 0.05] },
      answer: "round((r1 + r2 + r3 + r4 + r5) / 5, 2)",
      prompt: "The last five LABX candles have ranges of {r1:2}, {r2:2}, {r3:2}, {r4:2} and {r5:2}. What is their average range, in vUSD?",
      explanation: "Add the five ranges: {r1 + r2 + r3 + r4 + r5:2}. Divide by 5: {answer:2}. That's what a normal candle looks like right now; a single big candle would not be.",
      hint: "The total is {r1 + r2 + r3 + r4 + r5:2}. Divide it by 5.",
    },
  },
  {
    id: "q-1.2.5-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "LABX closes an hour at 100.00 and opens the next at 101.20. What does the space between 100.00 and 101.20 mean?",
    options: [
      { id: "a", label: "Price traded through those prices very quickly", rationale: "Fast trading still leaves prices inside a candle. Empty space between a close and the next open means no trades at all." },
      { id: "b", label: "No trades happened at those prices between the two candles" },
      { id: "c", label: "The data is missing, so the chart should be ignored", rationale: "Nothing is missing. The last trade was at 100.00 and the next at 101.20: that jump is the gap." },
      { id: "d", label: "A buy stop at 100.50 would fill at exactly 100.50", rationale: "Nothing traded at 100.50, so nothing can fill there. A stop at 100.50 triggers at the next open, around 101.20." },
    ],
    correct: "b",
    explanation: "A gap is a jump from one close to the next open with no trading in between. Any order resting inside the gap can only fill at the next available price, near the open.",
    lesson: "1.2.5",
    concepts: ["price-gaps"],
    hints: ["Ask whether any trade happened at 100.50.", "A gap is empty space: the next trade after 100.00 was at 101.20."],
  },
  {
    id: "q-1.2.5-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "A video says 'gaps always fill', so you should trade towards every gap you see.",
    prompt: "What's the most accurate view?",
    options: [
      { id: "a", label: "It's true: a gap is a magnet that price must revisit", rationale: "Some gaps are never revisited. Nothing forces price back, and one counter-example breaks 'always'." },
      { id: "b", label: "It's false: price never returns to a gap", rationale: "Price does return to many gaps, just not because they are gaps. 'Never' is as wrong as 'always'." },
      { id: "c", label: "Price often returns, but mostly by chance, and some gaps never fill" },
      { id: "d", label: "It's true for small gaps, so trade towards those", rationale: "No size rule makes a revisit certain. That's another untested claim built on the same myth." },
    ],
    correct: "c",
    explanation: "Price returns to most nearby prices sooner or later, gaps included. The evidence that gaps pull price back is weak: revisits look close to what chance alone would produce.",
    lesson: "1.2.5",
    concepts: ["price-gaps", "base-rates"],
    hints: ["Ask how often price would revisit any nearby price by chance.", "'Always' falls to one counter-example. Look for the answer that compares with chance."],
  },

  // 1.2.6
  {
    id: "q-1.2.6-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 1,
    prompt: "LABX rises from 80.00 to 100.00. By what percentage did it rise?",
    numeric: { answer: 25, tolerance: 0.01, unit: "%" },
    explanation: "% change = (new − old) ÷ old = (100.00 − 80.00) ÷ 80.00 = 25%. Dividing by the new price instead (20%) understates the move.",
    lesson: "1.2.6",
    concepts: ["log-scale"],
    hints: ["Find the move in price first: new − old.", "Divide the move by the old price, then multiply by 100."],
    vary: {
      fields: { start: [40, 200, 10], pct: [10, 150, 10] },
      answer: "pct",
      prompt: "LABX rises from {start:2} to {start * (1 + pct / 100):2}. By what percentage did it rise?",
      explanation: "% change = (new − old) ÷ old = ({start * (1 + pct / 100):2} − {start:2}) ÷ {start:2} = {answer}%. Dividing by the new price instead understates the move.",
      hint: "The move is {start * pct / 100:2}. Divide it by the old price, {start:2}.",
    },
  },
  {
    id: "q-1.2.6-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "What does a log price scale do?",
    options: [
      { id: "a", label: "It draws equal price moves as equal heights", rationale: "That's a linear scale. A log scale spaces prices by ratio, so equal percentage moves look equal." },
      { id: "b", label: "It shows only the closes, joined by a line", rationale: "That's a line chart, a chart type. Scale is separate: a line or a candle chart can use either scale." },
      { id: "c", label: "It smooths prices to remove noise", rationale: "A log scale changes the spacing of the axis, not the data. Every price is plotted as it is." },
      { id: "d", label: "It draws equal percentage moves as equal heights" },
    ],
    correct: "d",
    explanation: "On a log scale, 50 → 100 and 100 → 200 take the same height because both are +100%. On a linear scale the second would look twice as tall.",
    lesson: "1.2.6",
    concepts: ["log-scale"],
    hints: ["Think of 50 → 100 and 100 → 200. Which scale draws them the same?", "Linear spaces prices by difference; log spaces them by ratio."],
  },
  {
    id: "q-1.2.6-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "You compare two indices over 20 years. One went from 1,000 to 4,000; the other from 100 to 500.",
    prompt: "Which scale gives a fair picture of their growth?",
    options: [
      { id: "a", label: "A log scale, where equal percentage moves look equal" },
      { id: "b", label: "A linear scale, because it shows the real price changes", rationale: "On linear, the first index's +3,000 dwarfs the second's +400, though the second grew more: +400% against +300%." },
      { id: "c", label: "Either: the scale doesn't change what you see", rationale: "Scale changes the heights. Over 20 years with big moves, linear and log tell very different visual stories." },
      { id: "d", label: "A line chart instead of candles", rationale: "That changes the chart type, not the scale. The question is how heights map to moves." },
    ],
    correct: "a",
    explanation: "Growth is a percentage story: the first index rose 300%, the second 400%. A log scale draws those percentages as heights, while a linear scale makes the bigger index look far stronger.",
    lesson: "1.2.6",
    concepts: ["log-scale"],
    hints: ["Work out each index's percentage change.", "Pick the scale on which the bigger percentage looks bigger."],
  },

  // 1.2.7
  {
    id: "q-1.2.7-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which of these can a candle chart not tell you?",
    options: [
      { id: "a", label: "The highest price traded in each hour", rationale: "That's each candle's high, which every candle records." },
      { id: "b", label: "Where each hour opened and closed", rationale: "Open and close are two of the four prices every candle keeps." },
      { id: "c", label: "Why the buyers in the last candle bought" },
      { id: "d", label: "How many units traded, when volume is shown", rationale: "Volume bars record exactly that: the units traded in each period." },
    ],
    correct: "c",
    explanation: "A chart records prices and, with volume, how much traded. It has no record of who traded or why, so any story about their motives is interpretation.",
    lesson: "1.2.7",
    concepts: ["chart-limits"],
  },
  {
    id: "q-1.2.7-2",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "A post shows four charts where a 'triple bottom' was followed by a strong rise, and says the pattern works every time.",
    prompt: "What's the main problem with this evidence?",
    options: [
      { id: "a", label: "Four charts are enough, but they should share a timeframe", rationale: "The timeframe isn't the issue. Four hand-picked winners say nothing about how often the pattern fails." },
      { id: "b", label: "The charts were picked after the outcome, and the failures aren't shown" },
      { id: "c", label: "Triple bottoms only work on daily charts", rationale: "That's another untested claim. The problem is the sample: only winners were shown." },
      { id: "d", label: "The post should also show the volume", rationale: "More detail on the same four winners doesn't fix the sample. What's missing are the cases where it failed." },
    ],
    correct: "b",
    explanation: "This is cherry-picking: the examples were chosen because they worked. Without the charts where a triple bottom failed, you can't tell how often it works, or whether it beats chance.",
    lesson: "1.2.7",
    concepts: ["chart-limits", "hindsight-bias"],
    hints: ["Ask how the four charts were chosen.", "Which charts would you need to see to know how often it fails?"],
  },
  {
    id: "q-1.2.7-3",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "Before trusting a pattern you've seen on charts, which question matters most?",
    options: [
      { id: "a", label: "How clean does the best example look?", rationale: "The cleanest example was usually picked after the fact. Its looks say nothing about how often the pattern works." },
      { id: "b", label: "Did it work the last time I saw it?", rationale: "One recent case is a sample of one, and recency makes it feel bigger than it is." },
      { id: "c", label: "How often does it work, on how many charts, after costs, compared with random?" },
      { id: "d", label: "Do experienced traders talk about it?", rationale: "Popularity isn't a base rate. A pattern can be widely quoted and still work no better than chance." },
    ],
    correct: "c",
    explanation: "The evidence question asks for a base rate: how often, over a large sample, after costs, and against what random charts would produce. Without it, a pattern is a story.",
    lesson: "1.2.7",
    concepts: ["chart-limits", "base-rates"],
    hints: ["Look for the option that counts, rather than describes.", "A base rate needs many cases and a comparison with chance."],
  },
];

// ─── Glossary terms introduced in 1.2 ───────────────────────────────────────

const terms: GlossaryTerm[] = [
  {
    id: "line-chart",
    term: "Line chart",
    definition: "A chart that joins each period's closing price with a line, leaving out the opens, highs and lows.",
    plain: "One point per period, at the close, joined up. Clean, but it hides how far price reached.",
    related: ["close", "candle", "ohlc-bar"],
    lesson: "1.2.2",
  },
  {
    id: "ohlc-bar",
    term: "OHLC bar",
    definition: "A chart bar showing open, high, low and close: a vertical line from low to high, a tick on the left for the open and one on the right for the close.",
    plain: "The same four prices as a candle, drawn as a line with two small side ticks instead of a body.",
    related: ["candle", "open", "close", "line-chart"],
    lesson: "1.2.2",
    aka: ["Bar chart"],
  },
  {
    id: "tick-volume",
    term: "Tick volume",
    definition: "The number of price changes in a period at one broker, used in spot forex and CFDs where total traded volume isn't available.",
    plain: "How often one broker's price moved, used as a stand-in for real volume.",
    related: ["volume", "tick"],
    lesson: "1.2.4",
  },
  {
    id: "candle-range",
    term: "Candle range",
    definition: "A candle's height, high minus low. Not the same as a range, the sideways market.",
    plain: "How far price travelled from bottom to top within one candle.",
    related: ["candle", "high", "low", "range", "atr"],
    lesson: "1.2.5",
  },
  {
    id: "log-scale",
    term: "Log scale",
    definition: "A chart scale on which equal percentage moves take up equal heights, useful for long histories with large price changes.",
    plain: "A doubling looks the same size wherever it happens on the chart.",
    related: ["linear-scale"],
    lesson: "1.2.6",
    aka: ["Logarithmic scale"],
  },
  {
    id: "linear-scale",
    term: "Linear scale",
    definition: "A chart scale on which equal price moves take up equal heights.",
    plain: "Every 1.00 of price takes the same space, whether price is at 20 or at 200.",
    related: ["log-scale"],
    lesson: "1.2.6",
    aka: ["Arithmetic scale"],
  },
  {
    id: "cherry-picking",
    term: "Cherry-picking",
    definition: "Showing only the examples that support a claim and leaving out the ones that don't.",
    plain: "Showing the charts where it worked and hiding the ones where it didn't.",
    related: ["hindsight-bias", "confirmation-bias", "backtest"],
    lesson: "1.2.7",
  },
];

// ─── Concepts introduced in 1.2 ─────────────────────────────────────────────

const concepts: Concept[] = [
  {
    id: "chart-types",
    name: "Chart types",
    category: "market_fundamentals",
    summary: "Line, OHLC bar and candle charts draw the same data with different amounts of detail.",
    body: [
      "A line chart joins one price per period, usually the close, so it shows the path of closes and drops the open, high and low. An OHLC bar draws a vertical line from the low to the high, with a tick on the left for the open and on the right for the close. A candle shows the same four prices with a filled body between open and close.",
      "Pick the type for the task. A line suits long histories and comparisons; bars and candles suit reading single periods. None of them shows the order of trades inside a period.",
    ],
    example: "Twelve hourly LABX closes peak at 101.80, so a line chart of them never reaches 102.00. Drawn as candles, the same hours show hour 9 trading up to 102.30 before closing at 101.25.",
    related: ["candlestick", "timeframe"],
    missions: ["M01"],
    lessons: ["1.2.2"],
  },
  {
    id: "candle-aggregation",
    name: "Candle aggregation",
    category: "market_fundamentals",
    summary: "Longer candles are built from shorter ones: first open, highest high, lowest low, last close.",
    body: [
      "A 4-hour candle summarises four 1-hour candles with four prices: the open of the first hour, the highest high, the lowest low and the close of the last hour. The order of events inside the four hours is lost, so pullbacks fold into the bigger candle.",
      "That's why one market can look choppy on a short timeframe and steady on a longer one. Neither view is wrong; they summarise different stretches of time. Choose the timeframe from how long you plan to hold, before looking for a signal.",
    ],
    example: "Four LABX hours: 100.00/100.60/99.80/100.40, 100.40/101.10/100.20/100.90, 100.90/101.00/99.90/100.10 and 100.10/100.50/99.60/100.30. The 4-hour candle is 100.00/101.10/99.60/100.30: a small bullish candle that hides hour 3's drop of 0.80.",
    related: ["timeframe", "candlestick"],
    missions: ["M02"],
    lessons: ["1.2.3"],
  },
  {
    id: "volume",
    name: "Volume",
    category: "market_fundamentals",
    summary: "The number of units traded in a period; it measures activity, not direction.",
    body: [
      "Every unit bought is sold by someone, so volume can't lean towards buyers or sellers. It shows how busy a period was. Read each bar against its recent average: a bar's ratio to the average says more than its height.",
      "Spot forex has no central exchange, so retail FX and CFD charts usually show tick volume: how many times one broker's price changed. Futures and stocks report exchange volume. LABX volume is synthetic.",
    ],
    example: "LABX breaks out of a quiet range on 2,500 units against a 20-hour average of about 1,010: about 2.5 times. Later a news hour trades 2,700 units, the tallest bar, but the average has risen to about 1,290, so it's only about 2.1 times. It closes 0.02 above its open: lots of activity, no direction.",
    related: ["breakout", "candlestick"],
    missions: [],
    lessons: ["1.2.4"],
  },
  {
    id: "candle-range",
    name: "Candle range",
    category: "market_fundamentals",
    summary: "A candle's high minus its low; the average of recent ranges shows what normal noise looks like.",
    body: [
      "Measure the range of each recent candle and average them to get the size of a normal candle. Price moves of about that size happen all the time and mean little on their own.",
      "A stop placed closer than one normal candle sits inside that noise and is easily hit. The standard version of this average, ATR, comes later in the course. A candle's range is not the same thing as a range market, the sideways phase.",
    ],
    example: "Ten LABX candles have ranges 0.42, 0.38, 0.55, 0.31, 0.47, 0.36, 0.44, 0.39, 0.52 and 0.36. Their total is 4.20, so a normal candle is 4.20 ÷ 10 = 0.42. A stop 0.20 from entry would sit inside one normal candle.",
    related: ["volatility", "candlestick", "invalidation-level"],
    missions: ["M04"],
    lessons: ["1.2.5"],
  },
  {
    id: "price-gaps",
    name: "Price gaps",
    category: "market_fundamentals",
    summary: "A jump between one candle's close and the next one's open, with no trading at the prices in between.",
    body: [
      "Gaps happen where trading pauses or jumps: overnight and weekend closes, or sudden news. No order can fill at a price inside a gap, because nothing traded there; orders resting in the gap fill at the next available price instead.",
      "The saying 'gaps always fill' is weak: price returns to many gaps, but it returns to most nearby prices sooner or later, and some gaps are never revisited.",
    ],
    example: "Candle 10 closes at 100.00 and candle 11 opens at 98.80: a 1.20 gap. A long's stop at 99.50 sits inside it; there is no trade at 99.50 to fill it, so it can only fill near the open.",
    related: ["gap-risk", "slippage", "stop-loss-order"],
    missions: [],
    lessons: ["1.2.5"],
  },
  {
    id: "log-scale",
    name: "Log scale",
    category: "market_fundamentals",
    summary: "A chart scale on which equal percentage moves take up equal heights.",
    body: [
      "On a linear scale, equal price moves take equal heights, so a move from 20 to 40 looks small next to one from 80 to 160, though both are doublings. A log scale spaces prices by ratio, so the two doublings look the same.",
      "Use a log scale for long histories with large price changes and for comparing markets at different prices. Over a few days of LABX the two scales look almost identical.",
    ],
    example: "LABX goes from 50.00 to 100.00 (+100%), then from 100.00 to 150.00 (+50%). In price both moves are +50.00 and look equal on a linear scale; on a log scale the first is clearly taller.",
    related: ["chart-types"],
    missions: [],
    lessons: ["1.2.6"],
  },
  {
    id: "chart-limits",
    name: "Chart limits",
    category: "market_fundamentals",
    summary: "A chart records prices and volume, not who traded, why, the path inside a candle or what comes next.",
    body: [
      "Everything read from a chart is built on prices and, where shown, volume. Motives, the order of trades inside a candle and the next candle are not on it, so any claim about them is interpretation.",
      "Chart examples are often chosen after the outcome was known, and random series draw convincing shapes too. Before trusting a pattern, ask how often it works, on how many charts, after costs, and compared with random.",
    ],
    example: "A textbook chart shows support at 98.00 holding three times before a rise to 101.50. Another chart with the same three touches breaks at the third and falls to 96.80. At the third touch the two looked the same.",
    related: ["candlestick", "base-rates", "hindsight-bias"],
    missions: ["M02"],
    lessons: ["1.2.7"],
  },
  {
    id: "hindsight-bias",
    name: "Hindsight bias",
    category: "psychology",
    summary: "Judging past events as more predictable than they were, once the outcome is known.",
    body: [
      "Once you see what happened, the path to it looks obvious, and it's easy to believe you would have seen it coming. On a chart, the turning point that looks clear with the whole history visible was one of several possibilities at the right edge.",
      "To counter it, judge decisions only with the candles that were visible at the time, and test ideas on blind charts before believing them.",
    ],
    example: "LABX falls from 102.00 to 98.10 by candle 30, then climbs to 101.00 by candle 40. With the whole chart visible, candle 30 looks like an obvious bottom. At candle 30 itself, the next ten candles could have gone either way.",
    related: ["chart-limits", "base-rates", "decision-quality", "counterfactual-thinking"],
    missions: [],
    lessons: ["1.2.7"],
  },
];

/** How the unit introduces itself on the course map. */
const INTRO: UnitIntro = {
  summary: "How to read a price chart: one candle, line, bar and candle charts, timeframes, volume, normal candle size and gaps, and the log scale. It comes now because orders, stops and market structure all use the chart's language, and it ends with what no chart can tell you.",
  outcomes: [
    "Read open, high, low and close on any candle, and the same prices as a bar or a line.",
    "Build a 4-hour candle from 1-hour candles, and choose a timeframe that matches your holding period.",
    "Compare volume and candle size with their recent average, and spot a gap.",
    "Compare moves in percent, and use a log scale for long histories.",
    "Say what a chart can't show, and ask for a base rate before trusting a pattern.",
  ],
  buildsOn: "Unit 1.1: LABX candles are drawn from the mid, halfway between the bid and the ask (1.1.1, 1.1.3). Lesson 1.2.7 returns to 0.2.5, where random prices drew convincing patterns.",
};

/** Unit 1.2 · Charts and candles (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_1_2: UnitContent = { intro: INTRO, lessons, questions, terms, concepts };
