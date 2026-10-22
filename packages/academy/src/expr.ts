/**
 * A small, safe expression language for content: numbers, field names, + − × ÷, parentheses,
 * comparisons (< <= > >= == !=), && and ||, and the functions floor, ceil, round(x, digits),
 * min, max, abs, pct(x) (= x / 100) and commission(notional) (0.05% rounded up to the cent).
 * Used by question generators (`vary`), never `eval`.
 */
export type Env = Record<string, number>;

type Tok = { t: "num"; v: number } | { t: "id"; v: string } | { t: "op"; v: string };

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    const num = /^\d+(\.\d+)?/.exec(src.slice(i));
    if (num) {
      out.push({ t: "num", v: Number(num[0]) });
      i += num[0].length;
      continue;
    }
    const id = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i));
    if (id) {
      out.push({ t: "id", v: id[0] });
      i += id[0].length;
      continue;
    }
    const op = /^(<=|>=|==|!=|&&|\|\||[+\-*/(),<>×÷−])/.exec(src.slice(i));
    if (op) {
      const v = op[0] === "×" ? "*" : op[0] === "÷" ? "/" : op[0] === "−" ? "-" : op[0];
      out.push({ t: "op", v });
      i += op[0].length;
      continue;
    }
    throw new Error(`Unexpected "${ch}" in expression: ${src}`);
  }
  return out;
}

const FUNCS: Record<string, (...a: number[]) => number> = {
  floor: Math.floor,
  ceil: Math.ceil,
  abs: Math.abs,
  min: Math.min,
  max: Math.max,
  round: (x, d = 0) => Math.round(x * 10 ** d) / 10 ** d,
  pct: (x) => x / 100,
  /** 0.05% of a notional in vUSD, rounded up to the cent, as the simulator charges. */
  commission: (notional) => Math.ceil(Math.round(notional * 100) * 5 / 10000 - 1e-9) / 100,
};

export function evaluate(src: string, env: Env): number {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const eat = (v?: string) => {
    const t = toks[p++];
    if (!t || (v !== undefined && !(t.t === "op" && t.v === v))) throw new Error(`Expected ${v ?? "a value"} in: ${src}`);
    return t;
  };
  const isOp = (v: string) => peek()?.t === "op" && peek()!.v === v;

  function primary(): number {
    const t = eat();
    if (t.t === "num") return t.v;
    if (t.t === "op" && t.v === "(") {
      const v = or();
      eat(")");
      return v;
    }
    if (t.t === "op" && t.v === "-") return -primary();
    if (t.t === "id") {
      if (isOp("(")) {
        eat("(");
        const args: number[] = [];
        if (!isOp(")")) {
          args.push(or());
          while (isOp(",")) {
            eat(",");
            args.push(or());
          }
        }
        eat(")");
        const f = FUNCS[t.v];
        if (!f) throw new Error(`Unknown function ${t.v}`);
        return f(...args);
      }
      if (!(t.v in env)) throw new Error(`Unknown field ${t.v} in: ${src}`);
      return env[t.v];
    }
    throw new Error(`Unexpected token in: ${src}`);
  }
  function mul(): number {
    let v = primary();
    while (isOp("*") || isOp("/")) {
      const o = eat().v;
      const r = primary();
      v = o === "*" ? v * r : v / r;
    }
    return v;
  }
  function add(): number {
    let v = mul();
    while (isOp("+") || isOp("-")) {
      const o = eat().v;
      const r = mul();
      v = o === "+" ? v + r : v - r;
    }
    return v;
  }
  function cmp(): number {
    let v = add();
    while (isOp("<") || isOp("<=") || isOp(">") || isOp(">=") || isOp("==") || isOp("!=")) {
      const o = eat().v as string;
      const r = add();
      const e = 1e-9;
      v = Number(o === "<" ? v < r - e : o === "<=" ? v <= r + e : o === ">" ? v > r + e : o === ">=" ? v >= r - e : o === "==" ? Math.abs(v - r) <= e : Math.abs(v - r) > e);
    }
    return v;
  }
  function and(): number {
    let v = cmp();
    while (isOp("&&")) {
      eat();
      const r = cmp();
      v = Number(!!v && !!r);
    }
    return v;
  }
  function or(): number {
    let v = and();
    while (isOp("||")) {
      eat();
      const r = and();
      v = Number(!!v || !!r);
    }
    return v;
  }
  const v = or();
  if (p !== toks.length) throw new Error(`Unexpected trailing input in: ${src}`);
  return v;
}

/** Fills `{expr}` or `{expr:2}` placeholders with evaluated expressions (thousands separated). */
export function renderTemplate(text: string, env: Env): string {
  return text.replace(/\{([^{}:]+)(?::(\d))?\}/g, (_, expr: string, digits?: string) => {
    const v = evaluate(expr, env);
    const d = digits !== undefined ? Number(digits) : Number.isInteger(v) ? 0 : 2;
    return v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  });
}
