import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ScoreBreakdown as ScoreBreakdownType } from "@/lib/mockData";

interface ScoreBreakdownProps {
  score: ScoreBreakdownType;
  title?: string;
}

export function ScoreBreakdown({ score, title }: ScoreBreakdownProps) {
  const categories = [
    { name: "Volatility", score: score.vol_score, weight: score.vol_weight, color: "bg-primary" },
    { name: "Structure", score: score.struct_score, weight: score.struct_weight, color: "bg-success" },
    { name: "Edge", score: score.edge_score, weight: score.edge_weight, color: "bg-warning" },
  ];

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      {title && (
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      )}

      {/* Score Bars */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{cat.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium">{cat.score.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">
                  ({(cat.weight * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all duration-500", cat.color)}
                style={{ width: `${(cat.score / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Drivers */}
      <div className="space-y-2 border-t border-border pt-4">
        <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Score Drivers
        </h5>
        <div className="space-y-2">
          {score.drivers.map((driver, index) => (
            <div
              key={index}
              className="flex items-start justify-between rounded-lg bg-secondary/30 p-3"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{driver.metric}</span>
                  <span className="font-mono text-sm text-primary">{driver.value}</span>
                </div>
                <span className="text-xs text-muted-foreground">{driver.description}</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  driver.impact > 0 && "bg-success/20 text-success",
                  driver.impact < 0 && "bg-destructive/20 text-destructive",
                  driver.impact === 0 && "bg-muted text-muted-foreground"
                )}
              >
                {driver.impact > 0 && <TrendingUp className="h-3 w-3" />}
                {driver.impact < 0 && <TrendingDown className="h-3 w-3" />}
                {driver.impact === 0 && <Minus className="h-3 w-3" />}
                {driver.impact > 0 && "+"}
                {driver.impact.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
