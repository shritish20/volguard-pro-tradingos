import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { RegimeIndicator } from "@/components/dashboard/RegimeIndicator";
import { ExpiryCard } from "@/components/dashboard/ExpiryCard";
import { MarketPulse } from "@/components/dashboard/MarketPulse";
import { VetoAlert } from "@/components/dashboard/VetoAlert";
import { ScoreBreakdown } from "@/components/dashboard/ScoreBreakdown";
import { mockDashboardData } from "@/lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ExpiryType = "weekly" | "monthly" | "next_weekly";

const CommandCenter = () => {
  const data = mockDashboardData;
  const [selectedExpiry, setSelectedExpiry] = useState<ExpiryType | null>(null);
  const [showVetoAlert, setShowVetoAlert] = useState(true);

  const getScoreForExpiry = (type: ExpiryType) => {
    switch (type) {
      case "weekly":
        return data.weekly_score;
      case "monthly":
        return data.monthly_score;
      case "next_weekly":
        return data.next_weekly_score;
    }
  };

  const getMandateForExpiry = (type: ExpiryType) => {
    switch (type) {
      case "weekly":
        return data.weekly_mandate;
      case "monthly":
        return data.monthly_mandate;
      case "next_weekly":
        return data.next_weekly_mandate;
    }
  };

  // Get primary recommendation mandate for hero section
  const primaryMandate = getMandateForExpiry(data.primary_recommendation);
  const primaryScore = getScoreForExpiry(data.primary_recommendation);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
            <p className="text-sm text-muted-foreground">
              Trade the Regime. Not the Noise.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Primary Recommendation</p>
            <p className="font-mono text-lg font-semibold text-primary uppercase">
              {data.primary_recommendation.replace("_", " ")} Expiry
            </p>
          </div>
        </div>

        {/* Veto Alert */}
        {showVetoAlert && data.external_metrics.veto_events.length > 0 && (
          <VetoAlert
            events={data.external_metrics.veto_events}
            onDismiss={() => setShowVetoAlert(false)}
          />
        )}

        {/* Hero Regime Indicator */}
        <RegimeIndicator
          regime={primaryMandate.regime_name}
          strategy={primaryMandate.suggested_structure}
          allocation={primaryMandate.allocation_pct}
          isAllowed={primaryMandate.is_trade_allowed}
        />

        {/* Market Pulse */}
        <MarketPulse volMetrics={data.vol_metrics} edgeMetrics={data.edge_metrics} />

        {/* Expiry Cards Grid */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Expiry Analysis</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ExpiryCard
              type="weekly"
              expiry={data.time_context.weekly_exp}
              dte={data.time_context.dte_weekly}
              score={data.weekly_score}
              mandate={data.weekly_mandate}
              isRecommended={data.primary_recommendation === "weekly"}
              onClick={() => setSelectedExpiry("weekly")}
            />
            <ExpiryCard
              type="next_weekly"
              expiry={data.time_context.next_weekly_exp}
              dte={data.time_context.dte_next_weekly}
              score={data.next_weekly_score}
              mandate={data.next_weekly_mandate}
              isRecommended={data.primary_recommendation === "next_weekly"}
              onClick={() => setSelectedExpiry("next_weekly")}
            />
            <ExpiryCard
              type="monthly"
              expiry={data.time_context.monthly_exp}
              dte={data.time_context.dte_monthly}
              score={data.monthly_score}
              mandate={data.monthly_mandate}
              isRecommended={data.primary_recommendation === "monthly"}
              onClick={() => setSelectedExpiry("monthly")}
            />
          </div>
        </div>

        {/* FII/DII Flow */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="data-card">
            <div className="flex items-center justify-between">
              <span className="metric-label">FII Net Flow</span>
              <span
                className={`font-mono text-xl font-semibold ${
                  data.external_metrics.fii_net >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {data.external_metrics.fii_net >= 0 ? "+" : ""}
                ₹{Math.abs(data.external_metrics.fii_net).toFixed(1)}Cr
              </span>
            </div>
          </div>
          <div className="data-card">
            <div className="flex items-center justify-between">
              <span className="metric-label">DII Net Flow</span>
              <span
                className={`font-mono text-xl font-semibold ${
                  data.external_metrics.dii_net >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {data.external_metrics.dii_net >= 0 ? "+" : ""}
                ₹{Math.abs(data.external_metrics.dii_net).toFixed(1)}Cr
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Details Modal */}
      <Dialog open={selectedExpiry !== null} onOpenChange={() => setSelectedExpiry(null)}>
        <DialogContent className="max-w-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedExpiry?.replace("_", " ").toUpperCase()} Score Breakdown
            </DialogTitle>
          </DialogHeader>
          {selectedExpiry && (
            <ScoreBreakdown score={getScoreForExpiry(selectedExpiry)} />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CommandCenter;
