import { useState, useEffect } from "react";
import { volGuardAPI } from "@/services/api";
import { DashboardData } from "@/types/volguard";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, TrendingUp, Activity, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const AnalyticsStudio = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState("volatility");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await volGuardAPI.getDashboard();
        setData(dashboardData);
      } catch (err: any) {
        console.error("Failed to fetch analytics data:", err);
        setError(err.message || "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading Analytics Studio...</p>
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

  if (!data) {
    return (
      <MainLayout>
        <div className="p-10 text-center">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </MainLayout>
    );
  }

  // Prepare chart data
  const volChartData = [
    {
      name: 'RV 7D',
      value: data.vol_metrics.rv7,
      type: 'Realized'
    },
    {
      name: 'RV 28D',
      value: data.vol_metrics.rv28,
      type: 'Realized'
    },
    {
      name: 'GARCH 7D',
      value: data.vol_metrics.garch7,
      type: 'Forecast'
    },
    {
      name: 'GARCH 28D',
      value: data.vol_metrics.garch28,
      type: 'Forecast'
    },
    {
      name: 'VIX',
      value: data.vol_metrics.vix,
      type: 'Implied'
    }
  ];

  const ivTermStructure = [
    {
      expiry: 'Weekly',
      iv: data.edge_metrics.iv_weekly,
      dte: data.time_context.dte_weekly
    },
    {
      expiry: 'Monthly',
      iv: data.edge_metrics.iv_monthly,
      dte: data.time_context.dte_monthly
    }
  ];

  const skewData = [
    {
      expiry: 'Weekly',
      skew: data.struct_weekly.skew_25d,
      pcr: data.struct_weekly.pcr
    },
    {
      expiry: 'Monthly',
      skew: data.struct_monthly.skew_25d,
      pcr: data.struct_monthly.pcr
    },
    {
      expiry: 'Next Weekly',
      skew: data.struct_next_weekly.skew_25d,
      pcr: data.struct_next_weekly.pcr
    }
  ];

  const scoreRadarData = [
    {
      metric: 'Vol Score',
      Weekly: data.weekly_score.vol_score,
      Monthly: data.monthly_score.vol_score,
      fullMark: 100
    },
    {
      metric: 'Struct Score',
      Weekly: data.weekly_score.struct_score,
      Monthly: data.monthly_score.struct_score,
      fullMark: 100
    },
    {
      metric: 'Edge Score',
      Weekly: data.weekly_score.edge_score,
      Monthly: data.monthly_score.edge_score,
      fullMark: 100
    }
  ];

  const gexData = [
    {
      expiry: 'Weekly',
      netGex: data.struct_weekly.net_gex / 1e7,
      gexRatio: data.struct_weekly.gex_ratio
    },
    {
      expiry: 'Monthly',
      netGex: data.struct_monthly.net_gex / 1e7,
      gexRatio: data.struct_monthly.gex_ratio
    },
    {
      expiry: 'Next Weekly',
      netGex: data.struct_next_weekly.net_gex / 1e7,
      gexRatio: data.struct_next_weekly.gex_ratio
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Studio</h1>
            <p className="text-muted-foreground">Deep dive into market metrics and regime analysis</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Activity className="h-4 w-4 mr-2" />
            {data.vol_metrics.vol_regime}
          </Badge>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Composite Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.weekly_score.composite.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-1">{data.weekly_score.confidence}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">VoV Z-Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.vol_metrics.vov_zscore.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">{data.vol_metrics.vix_momentum}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Term Spread</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.edge_metrics.term_spread.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground mt-1">{data.edge_metrics.term_regime}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Primary Edge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.edge_metrics.primary_edge}</div>
              <p className="text-xs text-muted-foreground mt-1">Current Opportunity</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs value={selectedView} onValueChange={setSelectedView}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="volatility">Volatility</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="edge">Edge & VRP</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
          </TabsList>

          {/* Volatility View */}
          <TabsContent value="volatility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Volatility Landscape</CardTitle>
                <CardDescription>Realized vs Implied vs Forecast volatility metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={volChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Volatility %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Volatility Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">VIX</span>
                    <span className="font-bold">{data.vol_metrics.vix.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">RV 7D</span>
                    <span className="font-bold">{data.vol_metrics.rv7.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">RV 28D</span>
                    <span className="font-bold">{data.vol_metrics.rv28.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">IVP (1Y)</span>
                    <span className="font-bold">{data.vol_metrics.ivp_1yr.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Trend Strength</span>
                    <span className="font-bold">{data.vol_metrics.trend_strength.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regime Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Vol Regime</span>
                    <Badge className="ml-2">{data.vol_metrics.vol_regime}</Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">VIX Momentum</span>
                    <Badge className="ml-2" variant="outline">{data.vol_metrics.vix_momentum}</Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">VoV Z-Score</span>
                    <span className="ml-2 font-bold">{data.vol_metrics.vov_zscore.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">VIX Change (5D)</span>
                    <span className={`ml-2 font-bold ${data.vol_metrics.vix_change_5d > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {data.vol_metrics.vix_change_5d > 0 ? '+' : ''}{data.vol_metrics.vix_change_5d.toFixed(2)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Structure View */}
          <TabsContent value="structure" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gamma Exposure (GEX) Analysis</CardTitle>
                <CardDescription>Net GEX and ratios across expiries</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gexData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="expiry" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="netGex" fill="#8884d8" name="Net GEX (Cr)" />
                    <Bar yAxisId="right" dataKey="gexRatio" fill="#82ca9d" name="GEX Ratio" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skew & PCR Analysis</CardTitle>
                <CardDescription>Put-Call dynamics across expiries</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={skewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="expiry" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="skew" stroke="#8884d8" name="Skew 25Δ (%)" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="pcr" stroke="#82ca9d" name="PCR" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Weekly Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Max Pain</span>
                    <span className="font-bold">{data.struct_weekly.max_pain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">PCR</span>
                    <span className="font-bold">{data.struct_weekly.pcr.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">OI Regime</span>
                    <Badge variant="outline" className="text-xs">{data.struct_weekly.oi_regime}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">GEX Regime</span>
                    <Badge variant="outline" className="text-xs">{data.struct_weekly.gex_regime}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Monthly Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Max Pain</span>
                    <span className="font-bold">{data.struct_monthly.max_pain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">PCR</span>
                    <span className="font-bold">{data.struct_monthly.pcr.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">OI Regime</span>
                    <Badge variant="outline" className="text-xs">{data.struct_monthly.oi_regime}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">GEX Regime</span>
                    <Badge variant="outline" className="text-xs">{data.struct_monthly.gex_regime}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Next Weekly Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Max Pain</span>
                    <span className="font-bold">{data.struct_next_weekly.max_pain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">PCR</span>
                    <span className="font-bold">{data.struct_next_weekly.pcr.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">OI Regime</span>
                    <Badge variant="outline" className="text-xs">{data.struct_next_weekly.oi_regime}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">GEX Regime</span>
                    <Badge variant="outline" className="text-xs">{data.struct_next_weekly.gex_regime}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Edge & VRP View */}
          <TabsContent value="edge" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>IV Term Structure</CardTitle>
                <CardDescription>Implied volatility across expiries</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ivTermStructure}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="expiry" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="iv" stroke="#8884d8" strokeWidth={3} name="IV %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Edge Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Primary Edge</span>
                    <Badge className="text-sm">{data.edge_metrics.primary_edge}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Term Regime</span>
                    <Badge variant="outline">{data.edge_metrics.term_regime}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Term Spread</span>
                    <span className="font-bold">{data.edge_metrics.term_spread.toFixed(2)}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Volatility Risk Premium</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Weekly VRP</span>
                    <span className="font-bold">{data.edge_metrics.weighted_vrp_weekly.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly VRP</span>
                    <span className="font-bold">{data.edge_metrics.weighted_vrp_monthly.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">IV Weekly</span>
                    <span className="font-bold">{data.edge_metrics.iv_weekly.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">IV Monthly</span>
                    <span className="font-bold">{data.edge_metrics.iv_monthly.toFixed(2)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Scoring View */}
          <TabsContent value="scoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Regime Score Comparison</CardTitle>
                <CardDescription>Multi-dimensional scoring across expiries</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={scoreRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Weekly" dataKey="Weekly" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Monthly" dataKey="Monthly" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Weekly Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold">{data.weekly_score.composite.toFixed(1)}</p>
                    <Badge className="mt-1">{data.weekly_score.confidence}</Badge>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vol Score</span>
                      <span className="font-medium">{data.weekly_score.vol_score.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Struct Score</span>
                      <span className="font-medium">{data.weekly_score.struct_score.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Edge Score</span>
                      <span className="font-medium">{data.weekly_score.edge_score.toFixed(1)}</span>
                    </div>
                  </div>
                  {data.weekly_score.score_drivers.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium mb-1">Key Drivers:</p>
                      <div className="space-y-1">
                        {data.weekly_score.score_drivers.map((driver, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">• {driver}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Monthly Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold">{data.monthly_score.composite.toFixed(1)}</p>
                    <Badge className="mt-1">{data.monthly_score.confidence}</Badge>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vol Score</span>
                      <span className="font-medium">{data.monthly_score.vol_score.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Struct Score</span>
                      <span className="font-medium">{data.monthly_score.struct_score.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Edge Score</span>
                      <span className="font-medium">{data.monthly_score.edge_score.toFixed(1)}</span>
                    </div>
                  </div>
                  {data.monthly_score.score_drivers.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium mb-1">Key Drivers:</p>
                      <div className="space-y-1">
                        {data.monthly_score.score_drivers.map((driver, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">• {driver}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Next Weekly Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold">{data.next_weekly_score.composite.toFixed(1)}</p>
                    <Badge className="mt-1">{data.next_weekly_score.confidence}</Badge>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vol Score</span>
                      <span className="font-medium">{data.next_weekly_score.vol_score.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Struct Score</span>
                      <span className="font-medium">{data.next_weekly_score.struct_score.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Edge Score</span>
                      <span className="font-medium">{data.next_weekly_score.edge_score.toFixed(1)}</span>
                    </div>
                  </div>
                  {data.next_weekly_score.score_drivers.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium mb-1">Key Drivers:</p>
                      <div className="space-y-1">
                        {data.next_weekly_score.score_drivers.map((driver, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">• {driver}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AnalyticsStudio;
