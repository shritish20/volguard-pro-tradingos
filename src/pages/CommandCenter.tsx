import { useEffect, useState } from "react";
import { volGuardAPI } from "@/services/api";
import { DashboardData } from "@/types/volguard";
import MarketPulse from "@/components/dashboard/MarketPulse";
import ExpiryCard from "@/components/dashboard/ExpiryCard";
import MainLayout from "@/components/layout/MainLayout"; 
import { Loader2, TrendingUp, Zap, BarChart3, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- REUSABLE COMPONENT: METRIC TILE ---
const MetricTile = ({ label, value, sub, color }: any) => (
  <div className="p-4 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all">
    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
    <div className={`text-2xl font-bold tracking-tight ${color || "text-foreground"}`}>
      {value}
    </div>
    {sub && <div className="text-[10px] text-muted-foreground mt-1 font-medium">{sub}</div>}
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await volGuardAPI.getDashboard();
      console.log("Dashboard Payload:", res); // Debug log
      setData(res);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError("Backend connection failed. Is the Python server running on Port 8000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Connecting to Neural Engine...</p>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !data) {
    return (
      <MainLayout>
        <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-bold">System Offline</h2>
          <p className="text-muted-foreground">{error || "No data received."}</p>
          <Button onClick={fetchDashboard} variant="outline">Retry Connection</Button>
        </div>
      </MainLayout>
    );
  }

  // --- DATA EXTRACTION (With Safety Defaults) ---
  const vol = data.vol_metrics || {};
  const ext = data.external_metrics || {};
  const struct = data.struct_weekly || {};
  const edge = data.edge_metrics || {};
  const time = data.time_context?.current_time_ist || "LIVE";

  // Format Helpers
  const formatCrore = (val: number) => val ? `₹${(val / 10000000).toFixed(1)} Cr` : "N/A";
  const formatPct = (val: number) => val !== undefined ? `${val.toFixed(1)}%` : "N/A";
  const formatNum = (val: number) => val ? val.toLocaleString() : "0";

  return (
    <MainLayout>
      <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* SECTION 1: HEADER & MARKET PULSE */}
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">VolGuard Command Center</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-muted-foreground font-mono">
                            SYSTEM ONLINE • {time.split('T')[0]} • {time.split('T')[1]?.split('.')[0]} IST
                        </span>
                    </div>
                </div>
                <Button onClick={fetchDashboard} size="sm" variant="ghost" className="text-muted-foreground">
                    <RefreshCw className="mr-2 h-3 w-3" /> Refresh
                </Button>
            </div>

            {/* The Big 4 Metrics */}
            <MarketPulse 
                spot={vol.spot || 0} 
                vix={vol.vix || 0} 
                vov={vol.vov_zscore || 0} 
                regime={vol.vol_regime || "LOADING"} 
            />
        </div>

        {/* SECTION 2: INSTITUTIONAL FLOW (FII/DII) */}
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-500/10 rounded-md">
                    <BarChart3 className="h-4 w-4 text-blue-500"/>
                </div>
                <h3 className="text-sm font-semibold text-foreground">Institutional Flow</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricTile 
                    label="FII Sentiment" 
                    value={ext.fii_direction || "NEUTRAL"} 
                    color={ext.fii_direction === "BEARISH" ? "text-red-500" : ext.fii_direction === "BULLISH" ? "text-green-500" : "text-yellow-500"} 
                    sub={ext.fii_conviction ? `${ext.fii_conviction} CONVICTION` : "NO SIGNAL"}
                />
                <MetricTile 
                    label="FII Net Futures" 
                    value={formatNum(ext.fii?.fut_net)} 
                    sub="Contracts (Open Interest)"
                    color={ext.fii?.fut_net > 0 ? "text-green-600" : "text-red-600"}
                />
                <MetricTile 
                    label="Option Smart Bias" 
                    value={formatNum(ext.option_bias)} 
                    sub="Net Call - Put (Qty)" 
                    color={ext.option_bias > 0 ? "text-green-600" : "text-red-600"}
                />
                <MetricTile 
                    label="Flow Regime" 
                    value={(ext.flow_regime || "WAIT").replace("_", " ")} 
                    sub="Aggregate Flow Score"
                />
            </div>
        </div>

        {/* SECTION 3: VOLATILITY SURFACE (The Edge) */}
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-orange-500/10 rounded-md">
                    <TrendingUp className="h-4 w-4 text-orange-500"/>
                </div>
                <h3 className="text-sm font-semibold text-foreground">Volatility Surface & Edge</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricTile 
                    label="Weekly VRP (Edge)" 
                    value={formatPct(edge.weighted_vrp_weekly)} 
                    sub="Variance Risk Premium"
                    color={edge.weighted_vrp_weekly > 5 ? "text-green-600" : "text-red-600"}
                />
                <MetricTile 
                    label="Realized Vol (7D)" 
                    value={formatPct(vol.rv7)} 
                    sub="Actual Movement"
                />
                <MetricTile 
                    label="Forecast Vol (GARCH)" 
                    value={formatPct(vol.garch7)} 
                    sub="Expected Movement"
                />
                <MetricTile 
                    label="Term Spread" 
                    value={formatPct(edge.term_spread)} 
                    sub={edge.term_regime || "FLAT"}
                    color={edge.term_spread > 0 ? "text-green-600" : "text-red-600"}
                />
            </div>
        </div>

        {/* SECTION 4: MARKET STRUCTURE (Greeks) */}
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-yellow-500/10 rounded-md">
                    <Zap className="h-4 w-4 text-yellow-500"/>
                </div>
                <h3 className="text-sm font-semibold text-foreground">Market Structure (Greeks)</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricTile 
                    label="Net GEX (Gamma)" 
                    value={formatCrore(struct.net_gex)} 
                    sub={struct.gex_regime || "NEUTRAL"}
                    color={struct.net_gex > 0 ? "text-green-600" : "text-red-600"}
                />
                <MetricTile 
                    label="Total PCR" 
                    value={struct.pcr?.toFixed(2) || "0.00"} 
                    sub="Put Call Ratio"
                />
                <MetricTile 
                    label="Skew (25D)" 
                    value={formatPct(struct.skew_25d)} 
                    sub={struct.skew_regime || "NORMAL"}
                    color={struct.skew_regime === "CRASH_FEAR" ? "text-red-600" : "text-blue-500"}
                />
                <MetricTile 
                    label="Max Pain" 
                    value={formatNum(struct.max_pain)} 
                    sub="Expiry Anchor Level"
                />
            </div>
        </div>

        {/* SECTION 5: LIVE TRADING MANDATES */}
        <div>
            <h3 className="text-lg font-bold mb-4 border-l-4 border-primary pl-3">Live Strategy Mandates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ExpiryCard type="WEEKLY" data={data.weekly_mandate} score={data.weekly_score} />
                <ExpiryCard type="NEXT WEEKLY" data={data.next_weekly_mandate} score={data.next_weekly_score} />
                <ExpiryCard type="MONTHLY" data={data.monthly_mandate} score={data.monthly_score} />
            </div>
        </div>

      </div>
    </MainLayout>
  );
}