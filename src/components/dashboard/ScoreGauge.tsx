import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  confidence?: "HIGH" | "MEDIUM" | "LOW";
  animated?: boolean;
}

export function ScoreGauge({
  score,
  size = "md",
  label,
  confidence,
  animated = true,
}: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (!animated) return;
    
    const duration = 1000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  const sizeClasses = {
    sm: { container: "h-20 w-20", text: "text-xl", ring: 4, radius: 32 },
    md: { container: "h-32 w-32", text: "text-3xl", ring: 6, radius: 52 },
    lg: { container: "h-44 w-44", text: "text-5xl", ring: 8, radius: 72 },
  };

  const config = sizeClasses[size];
  const circumference = 2 * Math.PI * config.radius;
  const progress = (displayScore / 10) * circumference;
  const offset = circumference - progress;

  const getScoreColor = (s: number) => {
    if (s >= 7) return "stroke-primary";
    if (s >= 5) return "stroke-success";
    if (s >= 3) return "stroke-warning";
    return "stroke-destructive";
  };

  const getScoreGlow = (s: number) => {
    if (s >= 7) return "drop-shadow-[0_0_12px_hsl(187_94%_43%/0.6)]";
    if (s >= 5) return "drop-shadow-[0_0_12px_hsl(160_84%_39%/0.6)]";
    if (s >= 3) return "drop-shadow-[0_0_12px_hsl(38_92%_50%/0.6)]";
    return "drop-shadow-[0_0_12px_hsl(0_84%_60%/0.6)]";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative flex items-center justify-center", config.container)}>
        <svg className="absolute -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={config.radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={config.ring}
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={config.radius}
            fill="none"
            className={cn(getScoreColor(displayScore), getScoreGlow(displayScore), "transition-all duration-500")}
            strokeWidth={config.ring}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="flex flex-col items-center">
          <span className={cn("font-mono font-bold", config.text)}>
            {displayScore.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">/10</span>
        </div>
      </div>
      {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
      {confidence && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            confidence === "HIGH" && "bg-primary/20 text-primary",
            confidence === "MEDIUM" && "bg-warning/20 text-warning",
            confidence === "LOW" && "bg-destructive/20 text-destructive"
          )}
        >
          {confidence} confidence
        </span>
      )}
    </div>
  );
}
