import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Shield, Ban, ArrowRight } from "lucide-react";
import type { Mandate } from "@/lib/mockData";

interface RegimeIndicatorProps {
  regime: Mandate["regime_name"];
  strategy: string;
  allocation: number;
  isAllowed: boolean;
  size?: "sm" | "lg";
}

const regimeConfig = {
  AGGRESSIVE_SHORT: {
    label: "Aggressive Short",
    description: "Maximum premium capture opportunity",
    icon: TrendingUp,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/30",
    glowClass: "glow-cyan",
  },
  MODERATE_SHORT: {
    label: "Moderate Short",
    description: "Balanced risk-reward setup",
    icon: TrendingUp,
    colorClass: "text-success",
    bgClass: "bg-success/10",
    borderClass: "border-success/30",
    glowClass: "",
  },
  DEFENSIVE: {
    label: "Defensive",
    description: "Capital preservation priority",
    icon: Shield,
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    borderClass: "border-warning/30",
    glowClass: "",
  },
  CASH: {
    label: "Cash",
    description: "No trade - preserve capital",
    icon: Ban,
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
    borderClass: "border-destructive/30",
    glowClass: "glow-red",
  },
};

export function RegimeIndicator({
  regime,
  strategy,
  allocation,
  isAllowed,
  size = "lg",
}: RegimeIndicatorProps) {
  const config = regimeConfig[regime];
  const Icon = config.icon;

  if (size === "sm") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2",
          config.bgClass,
          config.borderClass
        )}
      >
        <Icon className={cn("h-4 w-4", config.colorClass)} />
        <span className={cn("text-sm font-medium", config.colorClass)}>
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6",
        config.bgClass,
        config.borderClass,
        config.glowClass,
        "transition-all duration-500"
      )}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-current to-transparent animate-shimmer" />
      </div>

      <div className="relative flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                config.bgClass,
                "ring-2",
                config.borderClass
              )}
            >
              <Icon className={cn("h-6 w-6", config.colorClass)} />
            </div>
            <div>
              <h2 className={cn("text-2xl font-bold", config.colorClass)}>
                {config.label}
              </h2>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>
          {!isAllowed && (
            <div className="flex items-center gap-2 rounded-full bg-destructive/20 px-3 py-1 pulse-alert">
              <Ban className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium text-destructive">VETO ACTIVE</span>
            </div>
          )}
        </div>

        {/* Strategy Info */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col">
            <span className="metric-label">Strategy</span>
            <span className="font-mono text-lg font-semibold text-foreground">
              {strategy.replace(/_/g, " ")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="metric-label">Allocation</span>
            <span className="font-mono text-lg font-semibold text-foreground">
              {allocation}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="metric-label">Status</span>
            <span
              className={cn(
                "flex items-center gap-1 font-medium",
                isAllowed ? "text-success" : "text-destructive"
              )}
            >
              {isAllowed ? "✅ Trade Allowed" : "🚫 No Trade"}
            </span>
          </div>
        </div>

        {/* CTA */}
        {isAllowed && (
          <button
            className={cn(
              "group flex items-center gap-2 self-start rounded-lg px-4 py-2 font-medium transition-all",
              config.bgClass,
              config.colorClass,
              "hover:gap-3"
            )}
          >
            View Strategy Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </div>
  );
}
