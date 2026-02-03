import { AlertTriangle, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface VetoEvent {
  event: string;
  date: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
}

interface VetoAlertProps {
  events: VetoEvent[];
  onDismiss?: () => void;
}

function VetoAlert({ events, onDismiss }: VetoAlertProps) {
  const [countdown, setCountdown] = useState("");

  const highImpactEvent = events.find((e) => e.impact === "HIGH");

  useEffect(() => {
    if (!highImpactEvent) return;

    const updateCountdown = () => {
      const eventDate = new Date(highImpactEvent.date);
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("Event in progress");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setCountdown(`${days}d ${hours}h ${minutes}m`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, [highImpactEvent]);

  if (events.length === 0) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-destructive/30 bg-destructive/5 p-4",
        "animate-pulse-glow"
      )}
      style={{
        boxShadow: "0 0 30px hsl(0 84% 60% / 0.15)",
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-transparent to-destructive/5" />

      <div className="relative flex items-start justify-between">
        <div className="flex gap-4">
          {/* Alert Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/20">
            <AlertTriangle className="h-6 w-6 text-destructive pulse-alert" />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-destructive">Veto Event Detected</span>
              <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-xs font-medium text-destructive">
                HIGH IMPACT
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {events.map((event, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-1.5",
                    event.impact === "HIGH" && "border-destructive/30 bg-destructive/10",
                    event.impact === "MEDIUM" && "border-warning/30 bg-warning/10",
                    event.impact === "LOW" && "border-muted bg-muted/50"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      event.impact === "HIGH" && "text-destructive",
                      event.impact === "MEDIUM" && "text-warning",
                      event.impact === "LOW" && "text-muted-foreground"
                    )}
                  >
                    {event.event}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              ))}
            </div>

            {/* Countdown */}
            {highImpactEvent && countdown && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Auto square-off in:</span>
                <span className="font-mono font-medium text-destructive">{countdown}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dismiss */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}


export default VetoAlert;
