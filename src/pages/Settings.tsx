import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { authService } from "@/services/api";

export default function Settings() {
  const [token, setToken] = useState("");
  const { toast } = useToast();

  const handleTokenSubmit = async () => {
    if (!token) return;
    try {
      await authService.setToken(token);
      toast({ title: "Connected", description: "API Token updated successfully." });
      setToken("");
    } catch (e) {
      toast({ variant: "destructive", title: "Connection Failed", description: "Backend refused the token." });
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">System Settings</h1>
        <div className="p-4 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-2">Upstox API Configuration</h2>
          <div className="flex gap-2">
            <Input 
              type="password" 
              placeholder="Paste new Access Token..." 
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
            />
            <Button onClick={handleTokenSubmit}>Update</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
