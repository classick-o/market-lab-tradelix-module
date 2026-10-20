/** Prints candles of a dataset: npx tsx packages/missions/scripts/peek.ts M06-a 68 82 */
import { getScenario } from "../src/data";

const [key, from, to] = [process.argv[2], Number(process.argv[3]), Number(process.argv[4])];
const { candles } = getScenario(key);
candles.slice(from, to + 1).forEach((c, i) => console.log(from + i, c.o / 100, c.h / 100, c.l / 100, c.c / 100, c.v, c.path));
