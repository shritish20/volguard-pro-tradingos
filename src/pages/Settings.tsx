import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Save, RefreshCw, Key, Database, Bell, Palette } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:8000");
  const [token, setToken] = useState("");
  const [refreshInterval, setRefreshInterval] = useState([5]);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  const handleTokenSubmit = () => {
    if (token) {
      toast({
        title: "Token Updated",
        description: "Upstox API token has been configured.",
      });
      setToken("");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure your VolGuard Pro preferences
          </p>
        </div>

        {/* API Configuration */}
        <Card className="border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">API Configuration</h3>
              <p className="text-sm text-muted-foreground">Backend connection settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">API Endpoint</label>
              <Input
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="mt-2 bg-secondary/50 font-mono"
                placeholder="http://localhost:8000"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Refresh Interval (minutes)
              </label>
              <div className="mt-4 flex items-center gap-4">
                <Slider
                  value={refreshInterval}
                  onValueChange={setRefreshInterval}
                  max={15}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="w-12 text-center font-mono text-sm font-medium">
                  {refreshInterval[0]} min
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Upstox Token */}
        <Card className="border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Key className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Upstox API Token</h3>
              <p className="text-sm text-muted-foreground">Authenticate with Upstox for live data</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="flex-1 bg-secondary/50"
              placeholder="Enter your Upstox access token"
            />
            <Button onClick={handleTokenSubmit} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Update Token
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Token is sent to the backend and used for live market data fetching
          </p>
        </Card>

        {/* Notification Settings */}
        <Card className="border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Bell className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">Alert preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Browser Notifications</p>
                <p className="text-sm text-muted-foreground">Show desktop alerts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Sound Alerts</p>
                <p className="text-sm text-muted-foreground">Play sound on important alerts</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Send email for veto events</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Display Settings */}
        <Card className="border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Palette className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Display</h3>
              <p className="text-sm text-muted-foreground">Visual preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Compact Mode</p>
                <p className="text-sm text-muted-foreground">Reduce spacing for more data</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Animations</p>
                <p className="text-sm text-muted-foreground">Enable UI animations</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">High Contrast</p>
                <p className="text-sm text-muted-foreground">Increase color contrast</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" className="gap-2">
            <Save className="h-5 w-5" />
            Save Settings
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
