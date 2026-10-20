/**
 * Units: every price and every amount of money is an integer number of cents.
 * Instruments are linear spot instruments quoted in vUSD with a 0.01 tick, so a
 * one-tick move on one unit is worth exactly one cent of P&L.
 */

export const ENGINE_VERSION = "1.0.0";

export type Side = "buy" | "sell";
export type PositionSide = "long" | "short";
export type OrderType = "market" | "limit";

/** Order in which the high and low of a candle were reached after the open. */
export type IntrabarPath = "OHLC" | "OLHC";

/** Mid prices. Buyers pay mid + halfSpread, sellers receive mid − halfSpread. */
export interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  path?: IntrabarPath;
}

export interface CostModel {
  /** Half of the bid/ask spread, in cents. */
  halfSpread: number;
  /** Commission per fill, in basis points of the fill notional. Rounded up to the cent. */
  commissionBps: number;
}

export interface RiskRules {
  allowShort: boolean;
  orderTypes: OrderType[];
  /** Max position notional as a multiple of equity. 1 = no leverage. */
  maxLeverage: number;
  /** Reject orders without a stop-loss. */
  requireStop: boolean;
  /** Risk limit in % of equity. Evaluated by missions; enforced only when enforceMaxRisk is true. */
  maxRiskPct?: number;
  enforceMaxRisk?: boolean;
}

export interface EngineConfig {
  symbol: string;
  initialEquity: number;
  costs: CostModel;
  rules: RiskRules;
}

export interface SimContext {
  readonly cfg: EngineConfig;
  readonly candles: readonly Candle[];
}

export interface Position {
  side: PositionSide;
  qty: number;
  /** Sum of qty × price over the open quantity, in cents. avg entry = costBasis / qty. */
  costBasis: number;
  stopLoss: number | null;
  takeProfit: number | null;
  openedStep: number;
  tradeId: string;
}

export interface PendingOrder {
  id: string;
  side: Side;
  qty: number;
  limitPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  submittedStep: number;
}

export type ExitReason = "stop" | "target" | "manual" | "session_end";

export interface Trade {
  id: string;
  side: PositionSide;
  entryStep: number;
  exitStep: number | null;
  /** Largest quantity held during the trade. */
  maxQty: number;
  entryQty: number;
  entryNotional: number;
  exitQty: number;
  exitNotional: number;
  initialStop: number | null;
  /** Money at risk when the trade was opened (price distance to stop + estimated costs), if a stop existed. */
  initialRisk: number | null;
  realized: number;
  fees: number;
  /** Worst unrealized loss seen while open (positive cents). */
  mae: number;
  /** Best unrealized gain seen while open (positive cents). */
  mfe: number;
  exitReason: ExitReason | null;
}

export interface SimState {
  /** Index of the last closed candle visible to the user. */
  step: number;
  realized: number;
  fees: number;
  position: Position | null;
  orders: PendingOrder[];
  trades: Trade[];
  equityPeak: number;
  maxDrawdown: number;
  maxDrawdownBps: number;
  maxExposureBps: number;
  idSeq: number;
  ended: boolean;
}

export type Action =
  | {
      type: "submit_order";
      side: Side;
      orderType: OrderType;
      qty: number;
      limitPrice?: number;
      stopLoss?: number | null;
      takeProfit?: number | null;
    }
  | { type: "modify_brackets"; stopLoss?: number | null; takeProfit?: number | null }
  | { type: "cancel_order"; orderId: string }
  | { type: "close_position"; qty?: number };

export type RejectCode =
  | "SESSION_NOT_ACTIVE"
  | "ORDER_TYPE_NOT_ALLOWED"
  | "INVALID_QUANTITY"
  | "INVALID_PRICE"
  | "SHORT_NOT_ALLOWED"
  | "CONFLICTING_DIRECTION"
  | "STOP_WRONG_SIDE"
  | "TARGET_WRONG_SIDE"
  | "STOP_REQUIRED"
  | "INSUFFICIENT_BUYING_POWER"
  | "RISK_LIMIT_EXCEEDED"
  | "TOO_MANY_ORDERS"
  | "NO_POSITION"
  | "ORDER_NOT_FOUND";

export interface Rejection {
  code: RejectCode;
  message: string;
}

export type FillReason = "market" | "limit" | "stop" | "target" | "manual" | "session_end";

export type EngineEvent =
  | {
      type: "order_submitted";
      step: number;
      orderId: string;
      side: Side;
      orderType: OrderType;
      qty: number;
      limitPrice: number | null;
      stopLoss: number | null;
      takeProfit: number | null;
    }
  | { type: "order_rejected"; step: number; code: RejectCode; message: string }
  | {
      type: "order_filled";
      step: number;
      orderId: string;
      side: Side;
      qty: number;
      price: number;
      fee: number;
      reason: FillReason;
    }
  | { type: "order_cancelled"; step: number; orderId: string }
  | {
      type: "brackets_modified";
      step: number;
      stopLoss: number | null;
      takeProfit: number | null;
      prevStopLoss: number | null;
      prevTakeProfit: number | null;
    }
  | { type: "position_closed"; step: number; tradeId: string; reason: ExitReason; realized: number }
  | { type: "step_advanced"; step: number }
  | { type: "session_ended"; step: number };

export interface StepResult {
  state: SimState;
  events: EngineEvent[];
  rejected?: Rejection;
}

export interface OrderPreview {
  ok: boolean;
  rejection?: Rejection;
  /** Estimated execution price (ask for buys, bid for sells, or the limit price). */
  entryPrice: number;
  notional: number;
  entryFee: number;
  /** Estimated fee when exiting at the stop, if any. */
  exitFeeAtStop: number;
  /** Money lost if the stop is hit, including both fees. Null without a stop. */
  risk: number | null;
  /** Risk as % of current equity. */
  riskPct: number | null;
  /** Money gained if the target is hit, net of both fees. Null without a target. */
  reward: number | null;
  rewardRisk: number | null;
  equity: number;
  buyingPower: number;
}
