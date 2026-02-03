import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDashboardData } from "@/lib/mockData";
import { TrendingUp, Activity, BarChart2, GitBranch } from "lucide-react";

const AnalyticsStudio = () => {
  const data = mockDashboardData;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Studio</h1>
          <p className="text-sm text-muted-foreground">
            Professional volatility and structure analysis
          </p>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="volatility" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="volatility" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="h-4 w-4" />
              Volatility Cone
            </TabsTrigger>
            <TabsTrigger value="gex" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart2 className="h-4 w-4" />
              GEX Map
            </TabsTrigger>
            <TabsTrigger value="term" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <GitBranch className="h-4 w-4" />
              Term Structure
            </TabsTrigger>
            <TabsTrigger value="skew" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
              Skew Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="volatility">
            <Card className="border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Volatility Cone</h3>
              <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20">
                <div className="text-center text-muted-foreground">
                  <Activity className="mx-auto mb-3 h-12 w-12" />
                  <p className="text-lg font-medium">Historical vs Implied Volatility</p>
                  <p className="text-sm">Recharts visualization coming soon</p>
                  <div className="mt-4 flex justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <span className="text-xs">Current IV: {data.edge_metrics.iv_atm}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-success" />
                      <span className="text-xs">RV 28D: {data.vol_metrics.rv_28d}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vol Metrics Grid */}
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="data-card">
                  <span className="metric-label">RV 7D</span>
                  <span className="font-mono text-xl font-bold">{data.vol_metrics.rv_7d}%</span>
                </div>
                <div className="data-card">
                  <span className="metric-label">RV 28D</span>
                  <span className="font-mono text-xl font-bold">{data.vol_metrics.rv_28d}%</span>
                </div>
                <div className="data-card">
                  <span className="metric-label">RV 90D</span>
                  <span className="font-mono text-xl font-bold">{data.vol_metrics.rv_90d}%</span>
                </div>
                <div className="data-card">
                  <span className="metric-label">GARCH Vol</span>
                  <span className="font-mono text-xl font-bold">{data.vol_metrics.garch_vol}%</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="gex">
            <Card className="border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Gamma Exposure Map</h3>
              <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20">
                <div className="text-center text-muted-foreground">
                  <BarChart2 className="mx-auto mb-3 h-12 w-12" />
                  <p className="text-lg font-medium">GEX by Strike Heatmap</p>
                  <p className="text-sm">D3.js heatmap visualization coming soon</p>
                </div>
              </div>

              {/* Structure Summary */}
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="data-card">
                  <span className="metric-label">Total GEX</span>
                  <span className="font-mono text-xl font-bold text-success">+₹250Cr</span>
                </div>
                <div className="data-card">
                  <span className="metric-label">PCR</span>
                  <span className="font-mono text-xl font-bold">{data.struct_weekly.pcr}</span>
                </div>
                <div className="data-card">
                  <span className="metric-label">Max Pain</span>
                  <span className="font-mono text-xl font-bold">{data.struct_weekly.max_pain}</span>
                </div>
                <div className="data-card">
                  <span className="metric-label">25D Skew</span>
                  <span className="font-mono text-xl font-bold">{data.struct_weekly.skew_25d}</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="term">
            <Card className="border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Term Structure</h3>
              <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20">
                <div className="text-center text-muted-foreground">
                  <GitBranch className="mx-auto mb-3 h-12 w-12" />
                  <p className="text-lg font-medium">IV Across Expiries</p>
                  <p className="text-sm">Line chart showing contango/backwardation</p>
                  <div className="mt-4">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                      data.edge_metrics.term_structure === 'CONTANGO' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      Current: {data.edge_metrics.term_structure}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edge Metrics */}
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="data-card">
                  <span className="metric-label">IV Spread (W-M)</span>
                  <span className="font-mono text-xl font-bold">{data.edge_metrics.iv_spread_weekly_monthly}%</span>
                </div>
                <div className="data-card">
                  <span className="metric-label">VRP (RV)</span>
                  <span className="font-mono text-xl font-bold text-success">{data.edge_metrics.vrp_rv}%</span>
                </div>
                <div className="data-card">
                  <span className="metric-label">VRP (GARCH)</span>
                  <span className="font-mono text-xl font-bold text-success">{data.edge_metrics.vrp_garch}%</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="skew">
            <Card className="border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Skew Analysis</h3>
              <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="mx-auto mb-3 h-12 w-12" />
                  <p className="text-lg font-medium">25-Delta Risk Reversal</p>
                  <p className="text-sm">Time series of put/call skew</p>
                </div>
              </div>

              {/* Skew Data */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="data-card">
                  <span className="metric-label">Weekly Skew</span>
                  <span className="font-mono text-xl font-bold">{data.struct_weekly.skew_25d}</span>
                </div>
                <div className="data-card">
                  <span className="metric-label">Next Week Skew</span>
                  <span className="font-mono text-xl font-bold">{data.struct_next_weekly.skew_25d}</span>
                </div>
                <div className="data-card">
                  <span className="metric-label">Monthly Skew</span>
                  <span className="font-mono text-xl font-bold">{data.struct_monthly.skew_25d}</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AnalyticsStudio;
