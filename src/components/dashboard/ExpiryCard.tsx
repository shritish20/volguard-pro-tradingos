import { cn } from "@/lib/utils";
import { ScoreGauge } from "./ScoreGauge";
import { Calendar, TrendingUp, Percent, Target } from "lucide-react";
import type { ScoreBreakdown, Mandate } from "@/lib/mockData";
import { formatIndianCurrency } from "@/lib/mockData";

interface ExpiryCardProps {
  type: "weekly" | "monthly" | "next_weekly";
  expiry: string;
  dte: number;
  score: ScoreBreakdown;
  mandate: Mandate;
  isRecommended?: boolean;
  onClick?: () => void;
}

const typeLabels = {
  weekly: "Weekly",
  monthly: "Monthly",
  next_weekly: "Next Weekly",
};

export function ExpiryCard({
  type,
  expiry,
  dte,
  score,
  mandate,
  isRecommended = false,
  onClick,
}: ExpiryCardProps) {
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
        "regime-card group cursor-pointer hover:scale-[1.02] hover:border-primary/50",
        isRecommended && "ring-2 ring-primary/50 glow-cyan"
      )}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          RECOMMENDED
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{typeLabels[type]}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{expiry}</span>
            <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium">
              {dte} DTE
            </span>
          </div>
        </div>
        <span className="text-2xl">{getStatusIcon()}</span>
      </div>

      {/* Score */}
      <div className="mt-4 flex justify-center">
        <ScoreGauge score={score.composite} size="md" confidence={score.confidence} />
      </div>

      {/* Score Breakdown */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center rounded-lg bg-secondary/50 p-2">
          <span className="text-xs text-muted-foreground">Vol</span>
          <span className="font-mono text-sm font-medium">{score.vol_score.toFixed(1)}</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-secondary/50 p-2">
          <span className="text-xs text-muted-foreground">Struct</span>
          <span className="font-mono text-sm font-medium">{score.struct_score.toFixed(1)}</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-secondary/50 p-2">
          <span className="text-xs text-muted-foreground">Edge</span>
          <span className="font-mono text-sm font-medium">{score.edge_score.toFixed(1)}</span>
        </div>
      </div>

      {/* Mandate Summary */}
      <div className="mt-4 space-y-2 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Strategy</span>
          </div>
          <span className="font-mono text-sm font-medium text-foreground">
            {mandate.suggested_structure.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Allocation</span>
          </div>
          <span className="font-mono text-sm font-medium text-foreground">
            {mandate.allocation_pct}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Deploy</span>
          </div>
          <span className="font-mono text-sm font-medium text-primary">
            {formatIndianCurrency(mandate.deployment_amount)}
          </span>
        </div>
      </div>
    </div>
  );
}
