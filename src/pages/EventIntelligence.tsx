import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { mockDashboardData } from "@/lib/mockData";
import { Calendar, AlertTriangle, TrendingUp, Clock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const EventIntelligence = () => {
  const data = mockDashboardData;

  // Extended mock events for the calendar view
  const allEvents = [
    { event: "RBI MPC Meeting", date: "2024-02-08", impact: "HIGH" as const, type: "monetary" },
    { event: "US CPI Release", date: "2024-02-13", impact: "MEDIUM" as const, type: "economic" },
    { event: "India Budget Session", date: "2024-02-15", impact: "HIGH" as const, type: "fiscal" },
    { event: "Fed Minutes", date: "2024-02-21", impact: "MEDIUM" as const, type: "monetary" },
    { event: "India GDP Q3", date: "2024-02-28", impact: "MEDIUM" as const, type: "economic" },
    { event: "Bank Holiday - Mahashivratri", date: "2024-03-08", impact: "LOW" as const, type: "holiday" },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "HIGH":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "MEDIUM":
        return "bg-warning/20 text-warning border-warning/30";
      case "LOW":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "monetary":
        return <TrendingUp className="h-4 w-4" />;
      case "economic":
        return <Globe className="h-4 w-4" />;
      case "fiscal":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };

  const getDaysUntil = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const diff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Intelligence</h1>
          <p className="text-sm text-muted-foreground">
            Economic calendar and veto event tracking
          </p>
        </div>

        {/* Veto Events Section */}
        {data.external_metrics.veto_events.some((e) => e.impact === "HIGH") && (
          <Card className="border-destructive/30 bg-destructive/5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/20">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-destructive">Active Veto Events</h3>
                <p className="text-sm text-muted-foreground">
                  High-impact events requiring position management
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {data.external_metrics.veto_events
                .filter((e) => e.impact === "HIGH")
                .map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-destructive/30 bg-card/50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-mono text-2xl font-bold text-destructive">
                          {getDaysUntil(event.date)}
                        </p>
                        <p className="text-xs text-muted-foreground">days</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{event.event}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Auto square-off</p>
                      <p className="font-mono text-sm font-medium text-destructive">T-1 @ 15:00 IST</p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* Economic Calendar */}
        <Card className="border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Economic Calendar</h3>

          <div className="space-y-3">
            {allEvents.map((event, index) => {
              const daysUntil = getDaysUntil(event.date);
              const isPast = daysUntil < 0;

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-4 transition-colors",
                    isPast ? "border-muted/50 bg-muted/20 opacity-50" : "border-border bg-secondary/20 hover:bg-secondary/40"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Date Badge */}
                    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-secondary">
                      <span className="text-xs uppercase text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="font-mono text-xl font-bold text-foreground">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>

                    {/* Event Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "flex h-6 w-6 items-center justify-center rounded",
                          getImpactColor(event.impact)
                        )}>
                          {getTypeIcon(event.type)}
                        </span>
                        <p className="font-semibold text-foreground">{event.event}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(event.date)} • {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </p>
                    </div>
                  </div>

                  {/* Impact & Days */}
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium",
                        getImpactColor(event.impact)
                      )}
                    >
                      {event.impact} IMPACT
                    </span>
                    {!isPast && (
                      <div className="text-right">
                        <p className="font-mono text-lg font-bold text-foreground">{daysUntil}</p>
                        <p className="text-xs text-muted-foreground">days</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Impact Simulator Placeholder */}
        <Card className="border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Impact Simulator</h3>
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="mx-auto mb-3 h-10 w-10" />
              <p className="font-medium">Scenario Analysis</p>
              <p className="text-sm">"What if RBI hikes 25bps?" simulations</p>
              <p className="mt-2 text-xs">Coming soon</p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EventIntelligence;
