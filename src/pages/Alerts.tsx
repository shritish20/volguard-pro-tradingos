import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Zap, TrendingUp, Shield, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const Alerts = () => {
  const [alerts] = useState([
    {
      id: 1,
      type: "regime",
      title: "Regime Changed to AGGRESSIVE_SHORT",
      description: "Weekly expiry now shows optimal conditions for premium selling",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "veto",
      title: "Veto Event Approaching",
      description: "RBI MPC meeting in 2 days - auto square-off scheduled",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "score",
      title: "Score Threshold Breached",
      description: "Monthly composite score dropped below 6.0 - reduced allocation",
      time: "3 hours ago",
      read: true,
    },
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "regime":
        return <Zap className="h-5 w-5 text-primary" />;
      case "veto":
        return <Shield className="h-5 w-5 text-destructive" />;
      case "score":
        return <TrendingUp className="h-5 w-5 text-warning" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
            <p className="text-sm text-muted-foreground">
              Real-time notifications and alert configuration
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Mark All Read
          </Button>
        </div>

        {/* Recent Alerts */}
        <Card className="border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                  alert.read
                    ? "border-border bg-secondary/20"
                    : "border-primary/30 bg-primary/5"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{alert.title}</h4>
                    {!alert.read && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {alert.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alert Configuration */}
        <Card className="border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Alert Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
              <div>
                <p className="font-medium text-foreground">Regime Change Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Notify when trading regime changes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
              <div>
                <p className="font-medium text-foreground">Veto Event Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Warn about upcoming high-impact events
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
              <div>
                <p className="font-medium text-foreground">Score Threshold Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Alert when scores cross defined thresholds
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
              <div>
                <p className="font-medium text-foreground">VIX Spike Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Notify on significant VIX movements
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Threshold Settings */}
        <Card className="border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Threshold Settings</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Score Alert Threshold
              </label>
              <Input
                type="number"
                defaultValue="6.0"
                className="mt-2 bg-secondary/50"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Alert when score drops below this value
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                VIX Alert Threshold
              </label>
              <Input
                type="number"
                defaultValue="18"
                className="mt-2 bg-secondary/50"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Alert when VIX exceeds this value
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Alerts;
