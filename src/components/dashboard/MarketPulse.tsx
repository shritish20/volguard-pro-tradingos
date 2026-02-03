import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Activity, Gauge, BarChart2 } from "lucide-react";
import type { VolMetrics, EdgeMetrics } from "@/lib/mockData";

interface MarketPulseProps {
  volMetrics: VolMetrics;
  edgeMetrics: EdgeMetrics;
}

interface MetricItemProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  highlight?: boolean;
}

function MetricItem({ label, value, subValue, icon: Icon, trend, highlight }: MetricItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3 backdrop-blur-sm",
        highlight && "border-primary/30 bg-primary/5"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          highlight ? "bg-primary/10" : "bg-secondary"
        )}
      >
        <Icon className={cn("h-5 w-5", highlight ? "text-primary" : "text-muted-foreground")} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-semibold text-foreground">{value}</span>
          {trend && (
            <span
              className={cn(
                "flex items-center text-xs",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "neutral" && "text-muted-foreground"
              )}
            >
              {trend === "up" && <TrendingUp className="h-3 w-3" />}
              {trend === "down" && <TrendingDown className="h-3 w-3" />}
              {subValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function MarketPulse({ volMetrics, edgeMetrics }: MarketPulseProps) {
  const getVolRegimeColor = (regime: VolMetrics["vol_regime"]) => {
    switch (regime) {
      case "CHEAP":
        return "text-destructive";
      case "FAIR":
        return "text-muted-foreground";
      case "RICH":
        return "text-success";
      case "EXTREME":
        return "text-primary";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Market Pulse</h3>
        <div
          className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
            volMetrics.vol_regime === "RICH" && "bg-success/20 text-success",
            volMetrics.vol_regime === "CHEAP" && "bg-destructive/20 text-destructive",
            volMetrics.vol_regime === "FAIR" && "bg-muted text-muted-foreground",
            volMetrics.vol_regime === "EXTREME" && "bg-primary/20 text-primary"
          )}
        >
          <Activity className="h-3 w-3" />
          Vol Regime: {volMetrics.vol_regime}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricItem
          label="NIFTY SPOT"
          value={volMetrics.spot.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          icon={BarChart2}
          trend="up"
          subValue="+0.45%"
        />
        <MetricItem
          label="INDIA VIX"
          value={volMetrics.vix.toFixed(2)}
          icon={Activity}
          trend={volMetrics.vix > 15 ? "up" : "down"}
          subValue={volMetrics.vix > 15 ? "+2.3%" : "-1.8%"}
          highlight={volMetrics.vix > 18}
        />
        <MetricItem
          label="IVP (1Y)"
          value={`${volMetrics.ivp_1yr}th`}
          icon={Gauge}
          highlight={volMetrics.ivp_1yr > 70}
        />
        <MetricItem
          label="VRP"
          value={`${edgeMetrics.vrp_parkinson.toFixed(1)}%`}
          icon={TrendingUp}
          highlight={edgeMetrics.vrp_parkinson > 4}
        />
      </div>

      {/* Detailed Metrics Row */}
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
        <div className="data-card">
          <span className="metric-label">RV 7D</span>
          <span className="font-mono text-sm font-medium">{volMetrics.rv_7d.toFixed(1)}%</span>
        </div>
        <div className="data-card">
          <span className="metric-label">RV 28D</span>
          <span className="font-mono text-sm font-medium">{volMetrics.rv_28d.toFixed(1)}%</span>
        </div>
        <div className="data-card">
          <span className="metric-label">GARCH</span>
          <span className="font-mono text-sm font-medium">{volMetrics.garch_vol.toFixed(1)}%</span>
        </div>
        <div className="data-card">
          <span className="metric-label">IV ATM</span>
          <span className="font-mono text-sm font-medium">{edgeMetrics.iv_atm.toFixed(1)}%</span>
        </div>
        <div className="data-card">
          <span className="metric-label">VOV</span>
          <span className="font-mono text-sm font-medium">{volMetrics.vov.toFixed(1)}%</span>
        </div>
        <div className="data-card">
          <span className="metric-label">Term</span>
          <span className={cn(
            "font-mono text-sm font-medium",
            edgeMetrics.term_structure === "CONTANGO" && "text-success",
            edgeMetrics.term_structure === "BACKWARDATION" && "text-destructive"
          )}>
            {edgeMetrics.term_structure}
          </span>
        </div>
      </div>
    </div>
  );
}
