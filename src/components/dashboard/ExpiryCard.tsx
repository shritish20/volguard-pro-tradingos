import { cn } from "@/lib/utils";
import { ScoreGauge } from "./ScoreGauge";
import { RegimeScore, TradingMandate } from "@/types/volguard";
import { AlertTriangle, Ban, CheckCircle2 } from "lucide-react";

interface ExpiryCardProps {
  type: string;
  data: TradingMandate;
  score: RegimeScore;
  onClick?: () => void;
}

export default function ExpiryCard({ type, data, score, onClick }: ExpiryCardProps) {
  // --------------------------------------------------------------------------
  // SAFETY LAYER: Default Values to prevent "Missing Data" Crashes
  // --------------------------------------------------------------------------
  
  // 1. Safe Mandate Data (If backend sends null due to "No Trade")
  const safeData = data || {
    regime_name: "WAITING...",
    suggested_structure: "NONE",
    allocation_pct: 0,
    deployment_amount: 0,
    is_trade_allowed: false,
    veto_reasons: [],
    rationale: ["Data is loading or trade restricted."]
  };

  // 2. Safe Score Data (If backend sends null due to NaN/Explosion)
  const safeScore = score || {
    composite: 0,
    confidence: "LOW",
    vol_score: 0,
    struct_score: 0,
    edge_score: 0
  };

  // --------------------------------------------------------------------------
  // HELPER: Determine Status Icon
  // --------------------------------------------------------------------------
  const getStatusIcon = () => {
    if (!safeData.is_trade_allowed) return <Ban className="h-6 w-6 text-red-500" />;
    if (safeScore.composite >= 7) return <CheckCircle2 className="h-6 w-6 text-green-500" />;
    return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
  };

  // --------------------------------------------------------------------------
  // RENDER COMPONENT
  // --------------------------------------------------------------------------
  return (
    <div 
      onClick={onClick} 
      className={cn(
        "regime-card group cursor-pointer hover:scale-[1.02] transition-all border rounded-lg p-4 bg-card shadow-sm relative overflow-hidden",
        // Dynamic Border Color
        !safeData.is_trade_allowed 
          ? "border-red-500/40 bg-red-50/5" 
          : safeScore.composite >= 7 
            ? "border-green-500/40" 
            : "border-border"
      )}
    >
      {/* Background Glow Effect for High Scores */}
      {safeScore.composite >= 7 && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 blur-2xl -mr-10 -mt-10 pointer-events-none" />
      )}

      {/* HEADER SECTION */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">{type}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
            <span className="text-[10px] font-mono uppercase bg-secondary px-1.5 py-0.5 rounded text-primary/80">
                {safeScore.confidence || "LOW"} CONFIDENCE
            </span>
          </div>
        </div>
        <div>{getStatusIcon()}</div>
      </div>

      {/* GAUGE SECTION */}
      <div className="flex justify-center my-4 relative z-10">
        <ScoreGauge 
            score={safeScore.composite} 
            size="md" 
            confidence={safeScore.confidence} 
        />
      </div>

      {/* DETAILS GRID */}
      <div className="space-y-3 bg-secondary/30 p-3 rounded-md border border-border/50 relative z-10">
        
        {/* Row 1: Strategy */}
        <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground text-xs font-medium uppercase">Strategy</span>
            <span className={`font-mono font-bold ${safeData.suggested_structure === "NONE" ? "text-muted-foreground" : "text-primary"}`}>
                {safeData.suggested_structure}
            </span>
        </div>

        {/* Row 2: Allocation */}
        <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground text-xs font-medium uppercase">Allocation</span>
            <span className="font-bold text-foreground">{safeData.allocation_pct}%</span>
        </div>

        {/* Row 3: Regime Name */}
        <div className="flex justify-between text-sm items-center pt-1 border-t border-border/50">
            <span className="text-muted-foreground text-xs font-medium uppercase">Detected Regime</span>
            <span className="font-medium text-[10px] bg-background px-2 py-0.5 rounded border shadow-sm">
                {(safeData.regime_name || "UNKNOWN").replace(/_/g, " ")}
            </span>
        </div>
      </div>

      {/* VETO WARNING (Only shows if there is a veto) */}
      {safeData.veto_reasons && safeData.veto_reasons.length > 0 && (
        <div className="mt-3 flex items-start gap-2 text-[11px] text-red-600 font-medium bg-red-100/50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-900/50">
            <Ban className="h-3 w-3 mt-0.5 shrink-0" />
            <span>{safeData.veto_reasons[0]}</span>
        </div>
      )}
    </div>
  );
}