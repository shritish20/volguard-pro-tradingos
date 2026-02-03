import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TokenManager from "@/components/dashboard/TokenManager";
import CommandCenter from "@/pages/CommandCenter";
import StrategyBuilder from "@/pages/StrategyBuilder";
import AnalyticsStudio from "@/pages/AnalyticsStudio";
import EventIntelligence from "@/pages/EventIntelligence";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* TokenManager must be inside BrowserRouter but outside Routes */}
        <TokenManager />
        
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<CommandCenter />} />
          <Route path="/strategy" element={<StrategyBuilder />} />
          <Route path="/analytics" element={<AnalyticsStudio />} />
          <Route path="/events" element={<EventIntelligence />} />
          
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
