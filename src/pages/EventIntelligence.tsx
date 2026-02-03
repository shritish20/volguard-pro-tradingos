import { useState, useEffect } from "react";
import { volGuardAPI } from "@/services/api";
import { DashboardData, EconomicEvent } from "@/types/volguard";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Calendar, TrendingUp, Globe, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EventIntelligence = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterImpact, setFilterImpact] = useState<string>("ALL");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await volGuardAPI.getDashboard();
        setData(dashboardData);
      } catch (err: any) {
        console.error("Failed to fetch event data:", err);
        setError(err.message || "Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading Event Intelligence...</p>
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
          <p className="text-muted-foreground">No event data available</p>
        </div>
      </MainLayout>
    );
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'LOW':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getUrgencyLevel = (daysUntil: number) => {
    if (daysUntil <= 1) return { level: 'IMMEDIATE', color: 'text-red-500' };
    if (daysUntil <= 3) return { level: 'URGENT', color: 'text-orange-500' };
    if (daysUntil <= 7) return { level: 'SOON', color: 'text-yellow-500' };
    return { level: 'SCHEDULED', color: 'text-blue-500' };
  };

  const filteredEvents = filterImpact === "ALL" 
    ? data.economic_events 
    : data.economic_events.filter(e => e.impact_level === filterImpact);

  const sortedEvents = [...filteredEvents].sort((a, b) => a.days_until - b.days_until);

  const highImpactCount = data.economic_events.filter(e => e.impact_level === 'HIGH').length;
  const mediumImpactCount = data.economic_events.filter(e => e.impact_level === 'MEDIUM').length;
  const vetoCount = data.external_metrics.veto_events.length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Event Intelligence</h1>
            <p className="text-muted-foreground">Economic events and market-moving catalysts</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            {data.economic_events.length} Events
          </Badge>
        </div>

        {/* Veto Alert */}
        {data.external_metrics.veto_square_off_needed && (
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-5 w-5" />
            <div className="ml-2">
              <h3 className="font-bold text-lg">VETO ALERT: Square-Off Required</h3>
              <AlertDescription className="mt-2">
                <p className="font-medium">
                  {vetoCount} critical event(s) detected. Square off time: {data.external_metrics.veto_square_off_time || 'Immediate'}
                </p>
                <div className="mt-3 space-y-1">
                  {data.external_metrics.veto_events.map((event, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Badge variant="destructive">{event.impact_level}</Badge>
                      <span className="text-sm">{event.title} - {event.event_date}</span>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.economic_events.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Tracked catalysts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{highImpactCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Critical events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Medium Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{mediumImpactCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Important events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Veto Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{vetoCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires action</p>
            </CardContent>
          </Card>
        </div>

        {/* External Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              External Flow Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">FII Net Change</p>
                <p className={`text-2xl font-bold ${data.external_metrics.fii_net_change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {data.external_metrics.fii_net_change > 0 ? '+' : ''}₹{(data.external_metrics.fii_net_change / 100).toFixed(2)}Cr
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">FII Direction</p>
                <Badge className="mt-1 text-lg" variant={data.external_metrics.fii_direction === 'BUYING' ? 'default' : 'destructive'}>
                  {data.external_metrics.fii_direction}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Veto Status</p>
                <Badge 
                  className="mt-1 text-lg" 
                  variant={data.external_metrics.veto_square_off_needed ? 'destructive' : 'default'}
                >
                  {data.external_metrics.veto_square_off_needed ? 'ACTIVE' : 'CLEAR'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Filter Tabs */}
        <Tabs value={filterImpact} onValueChange={setFilterImpact}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ALL">All Events ({data.economic_events.length})</TabsTrigger>
            <TabsTrigger value="HIGH">High ({highImpactCount})</TabsTrigger>
            <TabsTrigger value="MEDIUM">Medium ({mediumImpactCount})</TabsTrigger>
            <TabsTrigger value="LOW">Low ({data.economic_events.length - highImpactCount - mediumImpactCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={filterImpact} className="mt-6">
            {sortedEvents.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No events in this category</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sortedEvents.map((event, idx) => {
                  const urgency = getUrgencyLevel(event.days_until);
                  
                  return (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={`${getImpactColor(event.impact_level)} border px-3 py-1`}>
                                {event.impact_level}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {event.country}
                              </Badge>
                              <Badge variant="outline" className={`flex items-center gap-1 ${urgency.color}`}>
                                <Clock className="h-3 w-3" />
                                {urgency.level}
                              </Badge>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                            
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{event.event_date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">
                                  {event.days_until === 0 ? 'Today' : 
                                   event.days_until === 1 ? 'Tomorrow' : 
                                   `${event.days_until} days away`}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`text-4xl font-bold ${urgency.color}`}>
                              {event.days_until}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              days
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Timeline View */}
        <Card>
          <CardHeader>
            <CardTitle>Event Timeline (Next 7 Days)</CardTitle>
            <CardDescription>Chronological view of upcoming events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 8 }, (_, i) => i).map(day => {
                const dayEvents = sortedEvents.filter(e => e.days_until === day);
                const dateLabel = day === 0 ? 'Today' : day === 1 ? 'Tomorrow' : `Day +${day}`;
                
                return (
                  <div key={day} className="flex gap-4">
                    <div className="w-24 flex-shrink-0">
                      <Badge variant="outline" className="w-full justify-center">
                        {dateLabel}
                      </Badge>
                    </div>
                    <div className="flex-1 space-y-2">
                      {dayEvents.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No events</p>
                      ) : (
                        dayEvents.map((event, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <Badge className={`${getImpactColor(event.impact_level)} text-xs`}>
                              {event.impact_level}
                            </Badge>
                            <span className="text-sm font-medium">{event.title}</span>
                            <Badge variant="outline" className="text-xs ml-auto">
                              {event.country}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EventIntelligence;
