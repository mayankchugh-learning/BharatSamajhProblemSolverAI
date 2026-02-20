import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gift, Copy, ArrowRight } from "lucide-react";
import { useProfile, useSubmitReferral } from "@/hooks/use-profile";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ReferralCard() {
  const { data: profile } = useProfile();
  const { mutate: submitReferral, isPending } = useSubmitReferral();
  const { toast } = useToast();
  const [referralInput, setReferralInput] = useState("");

  if (!profile) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(profile.referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  const handleRedeem = () => {
    if (!referralInput.trim()) return;
    submitReferral(referralInput);
    setReferralInput("");
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background border-indigo-100 dark:border-indigo-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="text-indigo-500 w-5 h-5" />
          Referral Program
        </CardTitle>
        <CardDescription>
          Earn free months by inviting friends! You have 
          <span className="font-bold text-indigo-600 dark:text-indigo-400 mx-1">
            {profile.freeMonthsEarned} free months
          </span>
          earned.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Your Code</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-background border rounded-md px-3 py-2 font-mono text-center tracking-widest font-bold">
              {profile.referralCode}
            </div>
            <Button variant="outline" size="icon" onClick={copyCode}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-indigo-100 dark:border-indigo-900/50">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Redeem a Code</label>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter friend's code" 
              value={referralInput}
              onChange={(e) => setReferralInput(e.target.value)}
              className="bg-background"
            />
            <Button 
              size="icon" 
              onClick={handleRedeem} 
              disabled={isPending || !referralInput}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
