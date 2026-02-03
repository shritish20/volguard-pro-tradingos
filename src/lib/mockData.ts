// VolGuard Pro Mock Data - Simulates API Response
export interface TimeContext {
  current_time_ist: string;
  weekly_exp: string;
  monthly_exp: string;
  next_weekly_exp: string;
  dte_weekly: number;
  dte_monthly: number;
  dte_next_weekly: number;
}

export interface VolMetrics {
  spot: number;
  vix: number;
  rv_7d: number;
  rv_28d: number;
  rv_90d: number;
  garch_vol: number;
  parkinson_vol: number;
  ivp_30d: number;
  ivp_90d: number;
  ivp_1yr: number;
  vov: number;
  vol_regime: 'CHEAP' | 'FAIR' | 'RICH' | 'EXTREME';
}

export interface StructureMetrics {
  gex: number;
  pcr: number;
  max_pain: number;
  skew_25d: number;
  total_oi_calls: number;
  total_oi_puts: number;
}

export interface EdgeMetrics {
  iv_atm: number;
  iv_spread_weekly_monthly: number;
  vrp_rv: number;
  vrp_garch: number;
  vrp_parkinson: number;
  term_structure: 'CONTANGO' | 'BACKWARDATION' | 'FLAT';
}

export interface ScoreBreakdown {
  composite: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  vol_score: number;
  vol_weight: number;
  struct_score: number;
  struct_weight: number;
  edge_score: number;
  edge_weight: number;
  drivers: Array<{
    metric: string;
    value: string;
    impact: number;
    description: string;
  }>;
}

export interface Mandate {
  regime_name: 'AGGRESSIVE_SHORT' | 'MODERATE_SHORT' | 'DEFENSIVE' | 'CASH';
  strategy_type: string;
  suggested_structure: string;
  allocation_pct: number;
  deployment_amount: number;
  is_trade_allowed: boolean;
  veto_reason?: string;
  veto_square_off_time?: string;
  directional_bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export interface ExternalMetrics {
  fii_net: number;
  dii_net: number;
  veto_events: Array<{
    event: string;
    date: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
}

export interface DashboardData {
  time_context: TimeContext;
  vol_metrics: VolMetrics;
  struct_weekly: StructureMetrics;
  struct_monthly: StructureMetrics;
  struct_next_weekly: StructureMetrics;
  edge_metrics: EdgeMetrics;
  weekly_score: ScoreBreakdown;
  monthly_score: ScoreBreakdown;
  next_weekly_score: ScoreBreakdown;
  weekly_mandate: Mandate;
  monthly_mandate: Mandate;
  next_weekly_mandate: Mandate;
  external_metrics: ExternalMetrics;
  primary_recommendation: 'weekly' | 'monthly' | 'next_weekly';
}

export const mockDashboardData: DashboardData = {
  time_context: {
    current_time_ist: new Date().toISOString(),
    weekly_exp: "2024-02-06",
    monthly_exp: "2024-02-29",
    next_weekly_exp: "2024-02-13",
    dte_weekly: 3,
    dte_monthly: 26,
    dte_next_weekly: 10,
  },
  vol_metrics: {
    spot: 22450.30,
    vix: 14.2,
    rv_7d: 11.8,
    rv_28d: 12.4,
    rv_90d: 13.1,
    garch_vol: 12.9,
    parkinson_vol: 11.5,
    ivp_30d: 68,
    ivp_90d: 72,
    ivp_1yr: 75,
    vov: 18.5,
    vol_regime: 'RICH',
  },
  struct_weekly: {
    gex: 2500000000,
    pcr: 0.85,
    max_pain: 22500,
    skew_25d: -2.3,
    total_oi_calls: 15000000,
    total_oi_puts: 12750000,
  },
  struct_monthly: {
    gex: 4200000000,
    pcr: 0.92,
    max_pain: 22400,
    skew_25d: -1.8,
    total_oi_calls: 28000000,
    total_oi_puts: 25760000,
  },
  struct_next_weekly: {
    gex: 1800000000,
    pcr: 0.78,
    max_pain: 22550,
    skew_25d: -2.8,
    total_oi_calls: 9000000,
    total_oi_puts: 7020000,
  },
  edge_metrics: {
    iv_atm: 14.5,
    iv_spread_weekly_monthly: 1.2,
    vrp_rv: 4.2,
    vrp_garch: 3.8,
    vrp_parkinson: 4.8,
    term_structure: 'CONTANGO',
  },
  weekly_score: {
    composite: 8.2,
    confidence: 'HIGH',
    vol_score: 7.5,
    vol_weight: 0.35,
    struct_score: 6.8,
    struct_weight: 0.30,
    edge_score: 9.2,
    edge_weight: 0.35,
    drivers: [
      { metric: 'VRP (Parkinson)', value: '4.8%', impact: 3.0, description: 'Excellent premium capture opportunity' },
      { metric: 'IVP 1yr', value: '75th', impact: 2.5, description: 'IV in upper quartile historically' },
      { metric: 'GEX', value: '+₹250Cr', impact: 1.5, description: 'Supportive gamma environment' },
      { metric: 'PCR', value: '0.85', impact: 1.2, description: 'Slightly bullish positioning' },
    ],
  },
  monthly_score: {
    composite: 6.4,
    confidence: 'MEDIUM',
    vol_score: 6.2,
    vol_weight: 0.35,
    struct_score: 5.8,
    struct_weight: 0.30,
    edge_score: 7.1,
    edge_weight: 0.35,
    drivers: [
      { metric: 'VRP (GARCH)', value: '3.8%', impact: 2.0, description: 'Moderate premium available' },
      { metric: 'IVP 90d', value: '72nd', impact: 1.8, description: 'Above average IV levels' },
      { metric: 'Term Structure', value: 'Contango', impact: 1.0, description: 'Normal term structure' },
      { metric: 'DTE', value: '26 days', impact: -0.8, description: 'Longer duration risk' },
    ],
  },
  next_weekly_score: {
    composite: 7.1,
    confidence: 'HIGH',
    vol_score: 7.0,
    vol_weight: 0.35,
    struct_score: 6.2,
    struct_weight: 0.30,
    edge_score: 8.0,
    edge_weight: 0.35,
    drivers: [
      { metric: 'VRP (RV)', value: '4.2%', impact: 2.5, description: 'Good risk premium' },
      { metric: 'Skew', value: '-2.8', impact: 1.5, description: 'Put skew elevated' },
      { metric: 'GEX', value: '+₹180Cr', impact: 1.2, description: 'Positive gamma' },
      { metric: 'DTE', value: '10 days', impact: 0.5, description: 'Optimal time decay window' },
    ],
  },
  weekly_mandate: {
    regime_name: 'AGGRESSIVE_SHORT',
    strategy_type: 'AGGRESSIVE_SHORT',
    suggested_structure: 'IRON_FLY',
    allocation_pct: 50,
    deployment_amount: 500000,
    is_trade_allowed: true,
    directional_bias: 'NEUTRAL',
  },
  monthly_mandate: {
    regime_name: 'MODERATE_SHORT',
    strategy_type: 'MODERATE_SHORT',
    suggested_structure: 'IRON_CONDOR',
    allocation_pct: 30,
    deployment_amount: 300000,
    is_trade_allowed: true,
    directional_bias: 'NEUTRAL',
  },
  next_weekly_mandate: {
    regime_name: 'MODERATE_SHORT',
    strategy_type: 'MODERATE_SHORT',
    suggested_structure: 'STRANGLE',
    allocation_pct: 35,
    deployment_amount: 350000,
    is_trade_allowed: true,
    directional_bias: 'NEUTRAL',
  },
  external_metrics: {
    fii_net: -1250.5,
    dii_net: 980.3,
    veto_events: [
      { event: 'RBI MPC Meeting', date: '2024-02-08', impact: 'HIGH' },
      { event: 'US CPI Release', date: '2024-02-13', impact: 'MEDIUM' },
    ],
  },
  primary_recommendation: 'weekly',
};

// Helper function to format Indian currency
export const formatIndianCurrency = (value: number): string => {
  const absValue = Math.abs(value);
  if (absValue >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  } else if (absValue >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  } else {
    return `₹${value.toLocaleString('en-IN')}`;
  }
};

// Format percentage
export const formatPercent = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Format score
export const formatScore = (value: number): string => {
  return `${value.toFixed(1)}/10`;
};

// Get regime color class
export const getRegimeColor = (regime: Mandate['regime_name']): string => {
  switch (regime) {
    case 'AGGRESSIVE_SHORT':
      return 'text-primary';
    case 'MODERATE_SHORT':
      return 'text-success';
    case 'DEFENSIVE':
      return 'text-warning';
    case 'CASH':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
};

// Get regime background class
export const getRegimeBgClass = (regime: Mandate['regime_name']): string => {
  switch (regime) {
    case 'AGGRESSIVE_SHORT':
      return 'regime-card-aggressive';
    case 'MODERATE_SHORT':
      return 'regime-card-moderate';
    case 'DEFENSIVE':
      return 'regime-card-defensive';
    case 'CASH':
      return 'regime-card-cash';
    default:
      return '';
  }
};
