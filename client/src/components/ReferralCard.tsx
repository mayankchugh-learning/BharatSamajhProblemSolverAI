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
    <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-orange-100 dark:border-orange-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="text-orange-500 w-5 h-5" />
          Refer & Earn
        </CardTitle>
        <CardDescription>
          Invite your friends to the BharatSolve family! You have 
          <span className="font-bold text-orange-600 dark:text-orange-400 mx-1">
            {profile.freeMonthsEarned} free months
          </span>
          earned.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Your Referral Code</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-background border rounded-md px-3 py-2 font-mono text-center tracking-widest font-bold border-orange-200">
              {profile.referralCode}
            </div>
            <Button variant="outline" size="icon" onClick={copyCode} className="border-orange-200 text-orange-600">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-orange-100 dark:border-orange-900/50">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Redeem Friend's Code</label>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter code" 
              value={referralInput}
              onChange={(e) => setReferralInput(e.target.value)}
              className="bg-background border-orange-200"
            />
            <Button 
              size="icon" 
              onClick={handleRedeem} 
              disabled={isPending || !referralInput}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
