import { RefreshCw, Search, Command, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function TopBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search strategies, metrics..."
          className="pl-10 pr-12 bg-secondary/50 border-border focus:bg-secondary"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5">
          <Command className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">K</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        {/* Time Display */}
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
          <Clock className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span className="font-mono text-sm font-medium text-foreground">
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(currentTime)} IST
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
