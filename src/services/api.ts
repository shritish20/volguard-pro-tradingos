// === TIME & CONTEXT ===
export interface TimeContext {
  current_date: string;
  current_time_ist: string;
  weekly_exp: string;
  monthly_exp: string;
  next_weekly_exp: string;
  dte_weekly: number;
  dte_monthly: number;
  dte_next_weekly: number;
  is_expiry_day_weekly: boolean;
  is_past_square_off_time: boolean;
}

// === VOLATILITY ===
export interface VolMetrics {
  spot: number;
  vix: number;
  rv7: number;
  rv28: number;
  garch7: number;
  garch28: number;
  vov_zscore: number;
  ivp_1yr: number;
  vol_regime: string;
  vix_momentum: string;
  vix_change_5d: number;
  trend_strength: number;
  is_fallback: boolean;
}

// === STRUCTURE & GREEKS ===
export interface StructMetrics {
  net_gex: number;
  gex_ratio: number;
  pcr: number;
  max_pain: number;
  skew_25d: number;
  oi_regime: string;
  gex_regime: string;
}

// === EDGE & VRP ===
export interface EdgeMetrics {
  iv_weekly: number;
  iv_monthly: number;
  term_spread: number;
  term_regime: string;
  weighted_vrp_weekly: number;
  weighted_vrp_monthly: number;
  primary_edge: string;
}

// === SCORING ===
export interface RegimeScore {
  composite: number;
  confidence: string;
  vol_score: number;
  struct_score: number;
  edge_score: number;
  score_drivers: string[];
}

// === TRADING MANDATE ===
export interface TradingMandate {
  expiry_type: string;
  regime_name: string;
  strategy_type: string;
  allocation_pct: number;
  deployment_amount: number;
  rationale: string[];
  veto_reasons: string[];
  suggested_structure: string;
  is_trade_allowed: boolean;
  square_off_instruction: string | null;
}

// === EVENTS & EXTERNAL ===
export interface EconomicEvent {
  title: string;
  event_date: string;
  impact_level: string;
  days_until: number;
  country: string;
}

// === OPTION CHAIN ===
export interface OptionChainStrike {
  strike: number;
  ce_iv: number;
  pe_iv: number;
  ce_oi: number;
  pe_oi: number;
  ce_ltp: number;
  pe_ltp: number;
}

// === MAIN DASHBOARD RESPONSE ===
export interface DashboardData {
  time_context: TimeContext;
  vol_metrics: VolMetrics;
  struct_weekly: StructMetrics;
  struct_monthly: StructMetrics;
  struct_next_weekly: StructMetrics;
  edge_metrics: EdgeMetrics;
  external_metrics: {
    fii_net_change: number;
    fii_direction: string;
    veto_events: EconomicEvent[];
    veto_square_off_needed: boolean;
    veto_square_off_time: string | null;
  };
  weekly_score: RegimeScore;
  monthly_score: RegimeScore;
  next_weekly_score: RegimeScore;
  weekly_mandate: TradingMandate;
  monthly_mandate: TradingMandate;
  next_weekly_mandate: TradingMandate;
  economic_events: EconomicEvent[];
}

