import { useState, useEffect } from "react";
import { volGuardAPI } from "@/services/api";
import { OptionChainStrike, DashboardData } from "@/types/volguard";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

type ExpiryType = "WEEKLY" | "MONTHLY";

const StrategyBuilder = () => {
  const [chainData, setChainData] = useState<OptionChainStrike[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedExpiry, setSelectedExpiry] = useState<ExpiryType>("WEEKLY");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both option chain and dashboard data
        const [chain, dashboard] = await Promise.all([
          volGuardAPI.getOptionChain(selectedExpiry),
          volGuardAPI.getDashboard()
        ]);
        
        setChainData(chain);
        setDashboardData(dashboard);
      } catch (err: any) {
        console.error("Failed to fetch strategy data:", err);
        setError(err.message || "Failed to load strategy data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedExpiry]);

  const handleExpiryChange = (expiry: string) => {
    setSelectedExpiry(expiry as ExpiryType);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading Strategy Builder...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert variant="destructive" className="m-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please ensure the backend is running on http://localhost:8000
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  const spot = dashboardData?.vol_metrics.spot || 0;
  const atmStrike = Math.round(spot / 100) * 100;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Strategy Builder</h1>
            <p className="text-muted-foreground">Build and analyze option strategies</p>
          </div>
          <Tabs value={selectedExpiry} onValueChange={handleExpiryChange}>
            <TabsList>
              <TabsTrigger value="WEEKLY">Weekly</TabsTrigger>
              <TabsTrigger value="MONTHLY">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Market Context */}
        {dashboardData && (
          <Card>
            <CardHeader>
              <CardTitle>Market Context</CardTitle>
              <CardDescription>Current market conditions for {selectedExpiry.toLowerCase()} expiry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Spot Price</p>
                  <p className="text-2xl font-bold">₹{spot.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ATM Strike</p>
                  <p className="text-2xl font-bold">{atmStrike}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">VIX</p>
                  <p className="text-2xl font-bold">{dashboardData.vol_metrics.vix.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vol Regime</p>
                  <Badge className="text-base">{dashboardData.vol_metrics.vol_regime}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommended Strategy */}
        {dashboardData && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recommended Strategy: {selectedExpiry}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const mandate = selectedExpiry === "WEEKLY" 
                  ? dashboardData.weekly_mandate 
                  : dashboardData.monthly_mandate;
                
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Strategy Type</p>
                        <p className="text-lg font-semibold">{mandate.strategy_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Suggested Structure</p>
                        <p className="text-lg font-semibold">{mandate.suggested_structure}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Allocation</p>
                        <p className="text-lg font-semibold">{mandate.allocation_pct}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Trade Allowed</p>
                        <Badge variant={mandate.is_trade_allowed ? "default" : "destructive"}>
                          {mandate.is_trade_allowed ? "YES" : "NO"}
                        </Badge>
                      </div>
                    </div>
                    
                    {mandate.rationale.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Rationale:</p>
                        <ul className="space-y-1">
                          {mandate.rationale.map((reason, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start">
                              <span className="mr-2">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {mandate.veto_reasons.length > 0 && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <p className="font-medium mb-1">Veto Reasons:</p>
                          <ul className="space-y-1">
                            {mandate.veto_reasons.map((reason, idx) => (
                              <li key={idx} className="text-sm">{reason}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Option Chain */}
        <Card>
          <CardHeader>
            <CardTitle>Option Chain - {selectedExpiry}</CardTitle>
            <CardDescription>Live option chain data from Upstox</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">CE IV</th>
                    <th className="text-right p-2 text-sm font-medium text-muted-foreground">CE OI</th>
                    <th className="text-right p-2 text-sm font-medium text-muted-foreground">CE LTP</th>
                    <th className="text-center p-2 text-sm font-medium">Strike</th>
                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">PE LTP</th>
                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">PE OI</th>
                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">PE IV</th>
                  </tr>
                </thead>
                <tbody>
                  {chainData
                    .filter(strike => Math.abs(strike.strike - atmStrike) <= 500)
                    .map((strike) => {
                      const isATM = strike.strike === atmStrike;
                      const isITM_CE = spot > strike.strike;
                      const isITM_PE = spot < strike.strike;
                      
                      return (
                        <tr 
                          key={strike.strike} 
                          className={`border-b hover:bg-muted/50 ${isATM ? 'bg-primary/10' : ''}`}
                        >
                          <td className={`p-2 text-sm ${isITM_CE ? 'text-green-600 font-medium' : ''}`}>
                            {strike.ce_iv.toFixed(2)}%
                          </td>
                          <td className={`text-right p-2 text-sm ${isITM_CE ? 'text-green-600' : ''}`}>
                            {strike.ce_oi.toLocaleString()}
                          </td>
                          <td className={`text-right p-2 text-sm ${isITM_CE ? 'text-green-600 font-medium' : ''}`}>
                            ₹{strike.ce_ltp.toFixed(2)}
                          </td>
                          <td className={`text-center p-2 font-bold ${isATM ? 'text-primary' : ''}`}>
                            {strike.strike}
                          </td>
                          <td className={`text-left p-2 text-sm ${isITM_PE ? 'text-red-600 font-medium' : ''}`}>
                            ₹{strike.pe_ltp.toFixed(2)}
                          </td>
                          <td className={`text-left p-2 text-sm ${isITM_PE ? 'text-red-600' : ''}`}>
                            {strike.pe_oi.toLocaleString()}
                          </td>
                          <td className={`p-2 text-sm ${isITM_PE ? 'text-red-600 font-medium' : ''}`}>
                            {strike.pe_iv.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Greeks Summary */}
        {dashboardData && (
          <Card>
            <CardHeader>
              <CardTitle>Structure Metrics - {selectedExpiry}</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const struct = selectedExpiry === "WEEKLY" 
                  ? dashboardData.struct_weekly 
                  : dashboardData.struct_monthly;
                
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Net GEX</p>
                      <p className="text-xl font-bold">₹{(struct.net_gex / 1e7).toFixed(2)}Cr</p>
                      <Badge className="mt-1">{struct.gex_regime}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">GEX Ratio</p>
                      <p className="text-xl font-bold">{struct.gex_ratio.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">PCR</p>
                      <p className="text-xl font-bold">{struct.pcr.toFixed(2)}</p>
                      <Badge className="mt-1">{struct.oi_regime}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Max Pain</p>
                      <p className="text-xl font-bold">{struct.max_pain}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Skew 25Δ</p>
                      <p className="text-xl font-bold">{struct.skew_25d.toFixed(2)}%</p>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default StrategyBuilder;
