import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockDashboardData, formatIndianCurrency } from "@/lib/mockData";
import { 
  Target, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight,
  Play,
  BookmarkPlus,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const StrategyBuilder = () => {
  const data = mockDashboardData;
  const [selectedTab, setSelectedTab] = useState("weekly");

  const getMandateForTab = () => {
    switch (selectedTab) {
      case "weekly":
        return data.weekly_mandate;
      case "next_weekly":
        return data.next_weekly_mandate;
      case "monthly":
        return data.monthly_mandate;
      default:
        return data.weekly_mandate;
    }
  };

  const getStructForTab = () => {
    switch (selectedTab) {
      case "weekly":
        return data.struct_weekly;
      case "next_weekly":
        return data.struct_next_weekly;
      case "monthly":
        return data.struct_monthly;
      default:
        return data.struct_weekly;
    }
  };

  const mandate = getMandateForTab();
  const struct = getStructForTab();

  // Mock strikes for visualization
  const strikes = [
    { strike: 22200, callOI: 8500000, putOI: 2100000, callIV: 15.2, putIV: 16.8, gex: -150 },
    { strike: 22300, callOI: 12000000, putOI: 3500000, callIV: 14.8, putIV: 16.2, gex: -80 },
    { strike: 22400, callOI: 15000000, putOI: 6200000, callIV: 14.5, putIV: 15.8, gex: 50 },
    { strike: 22450, callOI: 18000000, putOI: 9800000, callIV: 14.2, putIV: 15.5, gex: 180, isATM: true },
    { strike: 22500, callOI: 22000000, putOI: 14500000, callIV: 14.0, putIV: 15.2, gex: 250, isMaxPain: true },
    { strike: 22600, callOI: 16000000, putOI: 10200000, callIV: 14.4, putIV: 15.0, gex: 120 },
    { strike: 22700, callOI: 9500000, putOI: 5800000, callIV: 14.8, putIV: 14.6, gex: -40 },
    { strike: 22800, callOI: 5200000, putOI: 2100000, callIV: 15.4, putIV: 14.2, gex: -120 },
  ];

  const strategyStrikes = {
    IRON_FLY: { sellCall: 22450, sellPut: 22450, buyCall: 22600, buyPut: 22300 },
    IRON_CONDOR: { sellCall: 22600, sellPut: 22300, buyCall: 22700, buyPut: 22200 },
    STRANGLE: { sellCall: 22600, sellPut: 22300, buyCall: null, buyPut: null },
  };

  const currentStrategy = strategyStrikes[mandate.suggested_structure as keyof typeof strategyStrikes] || strategyStrikes.IRON_FLY;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Strategy Builder</h1>
            <p className="text-sm text-muted-foreground">
              Construct and visualize options strategies
            </p>
          </div>
        </div>

        {/* Step 1: Select Expiry */}
        <Card className="border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              1
            </div>
            <h3 className="text-lg font-semibold">Select Expiry</h3>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3 bg-secondary">
              <TabsTrigger value="weekly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Weekly ({data.time_context.dte_weekly} DTE)
              </TabsTrigger>
              <TabsTrigger value="next_weekly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Next Weekly ({data.time_context.dte_next_weekly} DTE)
              </TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Monthly ({data.time_context.dte_monthly} DTE)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        {/* Step 2: Recommended Strategy */}
        <Card className="border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              2
            </div>
            <h3 className="text-lg font-semibold">Regime-Based Recommendation</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Strategy</span>
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-foreground">
                {mandate.suggested_structure.replace(/_/g, " ")}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">Allocation</span>
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-foreground">
                {mandate.allocation_pct}% ({formatIndianCurrency(mandate.deployment_amount)})
              </p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <span className="text-sm text-muted-foreground">Directional Bias</span>
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-foreground">
                {mandate.directional_bias}
              </p>
            </div>
          </div>
        </Card>

        {/* Step 3: Strike Selector */}
        <Card className="border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                3
              </div>
              <h3 className="text-lg font-semibold">Strike Selection</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>Recommended strikes highlighted</span>
            </div>
          </div>

          {/* Option Chain Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="px-3 py-2 text-right">Call OI</th>
                  <th className="px-3 py-2 text-right">Call IV</th>
                  <th className="px-3 py-2 text-center font-bold text-foreground">Strike</th>
                  <th className="px-3 py-2 text-left">Put IV</th>
                  <th className="px-3 py-2 text-left">Put OI</th>
                  <th className="px-3 py-2 text-center">GEX</th>
                </tr>
              </thead>
              <tbody>
                {strikes.map((row) => {
                  const isCallSell = row.strike === currentStrategy.sellCall;
                  const isPutSell = row.strike === currentStrategy.sellPut;
                  const isCallBuy = row.strike === currentStrategy.buyCall;
                  const isPutBuy = row.strike === currentStrategy.buyPut;

                  return (
                    <tr
                      key={row.strike}
                      className={cn(
                        "border-b border-border/50 transition-colors hover:bg-secondary/30",
                        row.isATM && "bg-primary/5",
                        row.isMaxPain && "bg-warning/5"
                      )}
                    >
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div
                            className="h-2 rounded-full bg-success/30"
                            style={{ width: `${(row.callOI / 22000000) * 60}px` }}
                          />
                          <span
                            className={cn(
                              "font-mono text-sm",
                              isCallSell && "font-bold text-destructive",
                              isCallBuy && "font-bold text-success"
                            )}
                          >
                            {(row.callOI / 1000000).toFixed(1)}M
                          </span>
                          {isCallSell && <span className="text-xs text-destructive">SELL</span>}
                          {isCallBuy && <span className="text-xs text-success">BUY</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-sm text-muted-foreground">
                        {row.callIV.toFixed(1)}%
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded px-2 py-1 font-mono font-semibold",
                            row.isATM && "bg-primary/20 text-primary",
                            row.isMaxPain && "bg-warning/20 text-warning",
                            !row.isATM && !row.isMaxPain && "text-foreground"
                          )}
                        >
                          {row.strike}
                          {row.isATM && <span className="text-xs">ATM</span>}
                          {row.isMaxPain && <span className="text-xs">MP</span>}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-left font-mono text-sm text-muted-foreground">
                        {row.putIV.toFixed(1)}%
                      </td>
                      <td className="px-3 py-3 text-left">
                        <div className="flex items-center gap-2">
                          {isPutSell && <span className="text-xs text-destructive">SELL</span>}
                          {isPutBuy && <span className="text-xs text-success">BUY</span>}
                          <span
                            className={cn(
                              "font-mono text-sm",
                              isPutSell && "font-bold text-destructive",
                              isPutBuy && "font-bold text-success"
                            )}
                          >
                            {(row.putOI / 1000000).toFixed(1)}M
                          </span>
                          <div
                            className="h-2 rounded-full bg-destructive/30"
                            style={{ width: `${(row.putOI / 14500000) * 60}px` }}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={cn(
                            "font-mono text-sm",
                            row.gex > 0 ? "text-success" : "text-destructive"
                          )}
                        >
                          {row.gex > 0 ? "+" : ""}
                          {row.gex}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Step 4: Payoff & Risk */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Payoff Placeholder */}
          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                4
              </div>
              <h3 className="text-lg font-semibold">Payoff Diagram</h3>
            </div>
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="mx-auto mb-2 h-10 w-10" />
                <p className="text-sm">Interactive payoff chart</p>
                <p className="text-xs">Coming soon with D3.js</p>
              </div>
            </div>
          </Card>

          {/* Risk Metrics */}
          <Card className="border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Risk Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="data-card">
                <span className="metric-label">Max Profit</span>
                <span className="font-mono text-lg font-bold text-success">₹45,200</span>
              </div>
              <div className="data-card">
                <span className="metric-label">Max Loss</span>
                <span className="font-mono text-lg font-bold text-destructive">₹54,800</span>
              </div>
              <div className="data-card">
                <span className="metric-label">Breakeven Upper</span>
                <span className="font-mono text-lg font-bold">22,652</span>
              </div>
              <div className="data-card">
                <span className="metric-label">Breakeven Lower</span>
                <span className="font-mono text-lg font-bold">22,248</span>
              </div>
              <div className="data-card col-span-2">
                <span className="metric-label">Probability of Profit</span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[68%] rounded-full bg-success" />
                  </div>
                  <span className="font-mono text-lg font-bold text-success">68%</span>
                </div>
              </div>
            </div>

            {/* Greeks */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="rounded-lg bg-secondary/50 p-2 text-center">
                <span className="text-xs text-muted-foreground">Delta</span>
                <p className="font-mono text-sm font-medium">-0.02</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2 text-center">
                <span className="text-xs text-muted-foreground">Gamma</span>
                <p className="font-mono text-sm font-medium">-0.08</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2 text-center">
                <span className="text-xs text-muted-foreground">Theta</span>
                <p className="font-mono text-sm font-medium text-success">+₹850</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2 text-center">
                <span className="text-xs text-muted-foreground">Vega</span>
                <p className="font-mono text-sm font-medium">-₹420</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Play className="h-5 w-5" />
            Paper Trade
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <ArrowRight className="h-5 w-5" />
            Live Trade
          </Button>
          <Button size="lg" variant="secondary" className="gap-2">
            <BookmarkPlus className="h-5 w-5" />
            Save Strategy
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default StrategyBuilder;
