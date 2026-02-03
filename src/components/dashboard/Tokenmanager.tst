import { useState, useEffect } from "react";
import { authService } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ShieldCheck } from "lucide-react";

export default function TokenManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authService.hasToken()) {
      setIsOpen(true);
    } else {
      // Silent sync on startup
      const token = authService.getToken();
      if (token) authService.setToken(token).catch(() => setIsOpen(true));
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await authService.setToken(tokenInput);
      setIsOpen(false);
      window.location.reload(); 
    } catch (e) {
      alert("Failed to connect. Is the Python backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !authService.hasToken() && setIsOpen(true)}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            VolGuard Security
          </DialogTitle>
          <DialogDescription>Input Upstox API Token to initialize.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Input 
            placeholder="Paste Token..." 
            value={tokenInput} 
            onChange={(e) => setTokenInput(e.target.value)}
            type="password"
          />
          <Button onClick={handleSave} disabled={loading || !tokenInput}>
            {loading ? "Authenticating..." : "Connect Broker"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

