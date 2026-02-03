import { useState, useEffect } from "react";
import { volGuardAPI } from "@/services/api";
import { DashboardData } from "@/types/volguard";
import MainLayout from "@/components/layout/MainLayout";
import MarketPulse from "@/components/dashboard/MarketPulse";
import ExpiryCard from "@/components/dashboard/ExpiryCard";
import VetoAlert from "@/components/dashboard/VetoAlert";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";

const CommandCenter = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await volGuardAPI.getDashboard();
        setData(dashboardData);
      } catch (err: any) {
        console.error("Failed to fetch dashboard:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading VolGuard Engine...</p>
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
          <p className="text-muted-foreground">No data available</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Veto Alert */}
        {data.external_metrics.veto_square_off_needed && (
          <VetoAlert 
            events={data.external_metrics.veto_events}
            squareOffTime={data.external_metrics.veto_square_off_time}
          />
        )}

        {/* Market Pulse */}
        <MarketPulse 
          spot={data.vol_metrics.spot}
          vix={data.vol_metrics.vix}
          vov={data.vol_metrics.vov_zscore}
          regime={data.vol_metrics.vol_regime}
          vixMomentum={data.vol_metrics.vix_momentum}
          rv7={data.vol_metrics.rv7}
          rv28={data.vol_metrics.rv28}
          garch7={data.vol_metrics.garch7}
          garch28={data.vol_metrics.garch28}
          ivp={data.vol_metrics.ivp_1yr}
          trendStrength={data.vol_metrics.trend_strength}
          isFallback={data.vol_metrics.is_fallback}
        />
        
        {/* Expiry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ExpiryCard 
            type="WEEKLY" 
            mandate={data.weekly_mandate} 
            score={data.weekly_score}
            structMetrics={data.struct_weekly}
            timeContext={{
              expiry: data.time_context.weekly_exp,
              dte: data.time_context.dte_weekly,
              isExpiryDay: data.time_context.is_expiry_day_weekly
            }}
          />
          
          <ExpiryCard 
            type="MONTHLY" 
            mandate={data.monthly_mandate} 
            score={data.monthly_score}
            structMetrics={data.struct_monthly}
            timeContext={{
              expiry: data.time_context.monthly_exp,
              dte: data.time_context.dte_monthly,
              isExpiryDay: false
            }}
          />

          <ExpiryCard 
            type="NEXT WEEKLY" 
            mandate={data.next_weekly_mandate} 
            score={data.next_weekly_score}
            structMetrics={data.struct_next_weekly}
            timeContext={{
              expiry: data.time_context.next_weekly_exp,
              dte: data.time_context.dte_next_weekly,
              isExpiryDay: false
            }}
          />
        </div>

        {/* Edge Metrics Summary */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Edge Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">IV Weekly</p>
              <p className="text-2xl font-bold">{data.edge_metrics.iv_weekly.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">IV Monthly</p>
              <p className="text-2xl font-bold">{data.edge_metrics.iv_monthly.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Term Spread</p>
              <p className="text-2xl font-bold">{data.edge_metrics.term_spread.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Primary Edge</p>
              <p className="text-2xl font-bold">{data.edge_metrics.primary_edge}</p>
            </div>
          </div>
        </div>

        {/* Economic Events */}
        {data.economic_events.length > 0 && (
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Economic Events</h3>
            <div className="space-y-2">
              {data.economic_events.slice(0, 5).map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.country} - {event.event_date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      event.impact_level === 'HIGH' ? 'bg-red-500/20 text-red-500' :
                      event.impact_level === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {event.impact_level}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.days_until} days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CommandCenter;
