import { Activity, TrendingUp, AlertTriangle } from "lucide-react";

// Define exactly what data this component accepts
interface MarketPulseProps {
  spot: number;
  vix: number;
  vov: number;
  regime: string;
}

export default function MarketPulse({ spot, vix, vov, regime }: MarketPulseProps) {
  // Safety Check: If data is missing for some reason, don't crash.
  if (spot === undefined || vix === undefined) {
    return <div className="p-4 border border-yellow-500 rounded bg-yellow-50">Waiting for Market Data...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* 1. NIFTY SPOT */}
      <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
            <span className="text-muted-foreground text-sm font-medium">NIFTY Spot</span>
            <Activity className="h-4 w-4 text-blue-500" />
        </div>
        <div className="text-2xl font-bold tracking-tight">{spot.toFixed(2)}</div>
      </div>

      {/* 2. INDIA VIX */}
      <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-between">
         <div className="flex justify-between items-start mb-2">
            <span className="text-muted-foreground text-sm font-medium">INDIA VIX</span>
            <TrendingUp className="h-4 w-4 text-orange-500" />
        </div>
        <div className="text-2xl font-bold tracking-tight">{vix.toFixed(2)}</div>
      </div>

      {/* 3. VOV Z-SCORE */}
      <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-between">
         <div className="flex justify-between items-start mb-2">
            <span className="text-muted-foreground text-sm font-medium">Vol of Vol (Z)</span>
            {vov > 2 && <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />}
        </div>
        <div className={`text-2xl font-bold tracking-tight ${vov > 2 ? "text-red-600" : "text-green-600"}`}>
            {vov.toFixed(2)}σ
        </div>
        <div className="text-xs text-muted-foreground mt-1">
            {vov > 2 ? "High Instability" : "Stable Regime"}
        </div>
      </div>

      {/* 4. REGIME */}
      <div className="bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-between">
         <div className="flex justify-between items-start mb-2">
            <span className="text-muted-foreground text-sm font-medium">Current Regime</span>
        </div>
        <div className="text-lg font-bold text-primary break-words leading-tight">
            {(regime || "UNKNOWN").replace(/_/g, " ")}
        </div>
      </div>
    </div>
  );
}
