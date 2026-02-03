import { useEffect, useState } from "react";
import { volGuardAPI } from "@/services/api";
import { DashboardData } from "@/types/volguard";
import MarketPulse from "@/components/dashboard/MarketPulse";
import ExpiryCard from "@/components/dashboard/ExpiryCard";
import MainLayout from "@/components/layout/MainLayout"; 
import { Loader2, AlertTriangle, TrendingUp, BarChart3, Activity, Zap } from "lucide-react";

// --- REUSABLE METRIC COMPONENT ---
const MetricBox = ({ label, value, subtext, color }: any) => (
  <div className="p-3 bg-card border rounded-lg shadow-sm">
    <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    <div className={`text-xl font-bold ${color || "text-foreground"}`}>{value}</div>
    {subtext && <div className="text-[10px] text-muted-foreground mt-1">{subtext}</div>}
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    volGuardAPI.getDashboard().then(setData).catch((err) => setError(err.message));
  }, []);

  if (!data && !error) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  
  // --- SAFETY NET ---
  // Fix NaNs and Missing Data on the fly
  const safe = (val: number, decimals = 2, suffix = "") => 
    val !== undefined && val !== null && !isNaN(val) ? `${val.toFixed(decimals)}${suffix}` : "N/A";

  const sData = data || {} as DashboardData;
  const vol = sData.vol_metrics || {};
  const ext = sData.external_metrics || {};
  const edge = sData.edge_metrics || {};
  const struct = sData.struct_weekly || {};

  return (
    <MainLayout>
      <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* 1. HEADER & PULSE */}
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">VolGuard Pro</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${vol.vol_regime === "EXPLODING" ? "bg-red-500 text-white" : "bg-green-100 text-green-800"}`}>
                            {vol.vol_regime || "LOADING"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            Trend: {(vol.trend_strength * 100).toFixed(0)}% Strength
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono">{safe(vol.spot)}</div>
                    <div className="text-xs text-muted-foreground">{sData.time_context?.current_time_ist}</div>
                </div>
            </div>
            
            <MarketPulse 
                spot={vol.spot || 0} 
                vix={vol.vix || 0} 
                vov={vol.vov_zscore || 0} 
                regime={vol.vol_regime || "INIT"} 
            />
        </div>

        {/* 2. INSTITUTIONAL FLOW (FII/DII) */}
        <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" /> Institutional Flow
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricBox 
                    label="FII Conviction" 
                    value={ext.fii_conviction} 
                    color={ext.fii_direction === "BEARISH" ? "text-red-500" : "text-green-500"} 
                />
                <MetricBox label="FII Net Fut" value={safe(ext.fii?.fut_net, 0)} subtext="Contracts" />
                <MetricBox label="Option Bias" value={safe(ext.option_bias, 0)} subtext="Call - Put" />
                <MetricBox label="Flow Regime" value={ext.flow_regime?.replace("_", " ")} />
            </div>
        </div>

        {/* 3. VOLATILITY SURFACE */}
        <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" /> Volatility Surface
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <MetricBox label="RV (7 Day)" value={safe(vol.rv7, 2, "%")} />
                <MetricBox label="GARCH (Forecast)" value={safe(vol.garch7, 2, "%")} />
                <MetricBox label="VRP (Weekly)" value={safe(edge.weighted_vrp_weekly, 2, "%")} 
                           color={edge.weighted_vrp_weekly > 0 ? "text-green-600" : "text-red-600"} />
                <MetricBox label="Term Spread" value={safe(edge.term_spread, 2, "%")} />
                <MetricBox label="IV Percentile" value={safe(vol.ivp_1yr, 0, "%")} />
            </div>
        </div>

        {/* 4. MARKET STRUCTURE (Greeks) */}
        <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" /> Structure & Greeks
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricBox label="Net GEX" value={`₹${(struct.net_gex / 10000000).toFixed(1)} Cr`} />
                <MetricBox label="PCR (Total)" value={safe(struct.pcr)} />
                <MetricBox label="Skew (25D)" value={safe(struct.skew_25d, 2, "%")} 
                           color={struct.skew_regime === "CRASH_FEAR" ? "text-red-500" : "text-blue-500"} />
                <MetricBox label="Max Pain" value={safe(struct.max_pain, 0)} />
            </div>
        </div>

        {/* 5. STRATEGY MANDATES */}
        <div>
            <h3 className="text-lg font-semibold mb-3">Generated Mandates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ExpiryCard type="WEEKLY" data={sData.weekly_mandate} score={sData.weekly_score} />
                <ExpiryCard type="NEXT WEEKLY" data={sData.next_weekly_mandate} score={sData.next_weekly_score} />
                <ExpiryCard type="MONTHLY" data={sData.monthly_mandate} score={sData.monthly_score} />
            </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default Dashboard;
