import { cn } from "@/lib/utils";
import { ScoreGauge } from "./ScoreGauge";
import { Calendar } from "lucide-react";
// FIX: Import from real types, NOT mockData
import { RegimeScore, TradingMandate } from "@/types/volguard";

interface ExpiryCardProps {
  type: "WEEKLY" | "MONTHLY" | "NEXT WEEKLY"; // Updated to match API
  date: string;
  score: RegimeScore;
  mandate: TradingMandate;
  onClick?: () => void;
}

export default function ExpiryCard({ type, date, score, mandate, onClick }: ExpiryCardProps) {
  const getStatusIcon = () => {
    if (!mandate.is_trade_allowed) return "🚫";
    if (score.composite >= 7) return "✅";
    if (score.composite >= 5) return "⚠️";
    return "🔻";
  };

  return (
    <div 
      onClick={onClick} 
      className={cn(
        "regime-card group cursor-pointer hover:scale-[1.02] transition-all border rounded-lg p-4 bg-card",
        !mandate.is_trade_allowed ? "border-red-500/50 bg-red-500/5" : "border-border",
        score.composite >= 7 && "ring-1 ring-primary/50"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{type}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
        </div>
        <span className="text-2xl">{getStatusIcon()}</span>
      </div>

      {/* Score Gauge */}
      <div className="flex justify-center my-4">
        <ScoreGauge score={score.composite} size="md" confidence={score.confidence} />
      </div>

      {/* Strategy Details */}
      <div className="space-y-3 bg-secondary/30 p-3 rounded-md">
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Strategy</span>
            <span className="font-mono font-medium">{mandate.suggested_structure}</span>
        </div>
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Allocation</span>
            <span className="font-bold text-primary">{mandate.allocation_pct}%</span>
        </div>
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Regime</span>
            <span className="font-medium text-xs">{mandate.regime_name.replace(/_/g, " ")}</span>
        </div>
      </div>

      {/* Veto Warning */}
      {mandate.veto_reasons.length > 0 && (
        <div className="mt-3 text-xs text-red-500 font-medium bg-red-500/10 p-2 rounded border border-red-500/20">
            🚫 {mandate.veto_reasons[0]}
        </div>
      )}
    </div>
  );
}
