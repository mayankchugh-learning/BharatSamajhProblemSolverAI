import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gift, Copy, ArrowRight } from "lucide-react";
import { useProfile, useSubmitReferral } from "@/hooks/use-profile";
import { useLocale } from "@/contexts/locale-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ReferralCard() {
  const { data: profile } = useProfile();
  const { mutate: submitReferral, isPending } = useSubmitReferral();
  const { toast } = useToast();
  const [referralInput, setReferralInput] = useState("");

  const { config } = useLocale();

  if (!profile) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(profile.referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard.",
      });
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = profile.referralCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast({ title: "Copied!", description: "Referral code copied to clipboard." });
    }
  };

  const handleRedeem = () => {
    if (!referralInput.trim()) return;
    const code = referralInput;
    submitReferral(code, {
      onSuccess: () => setReferralInput(""),
    });
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-white dark:from-primary/10 dark:to-background border-primary/10 dark:border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="text-primary w-5 h-5" />
          Refer & Earn
        </CardTitle>
        <CardDescription>
          Invite your friends to the {config.referralFamilyName}! You have 
          <span className="font-bold text-primary mx-1">
            {profile.freeMonthsEarned} free months
          </span>
          earned.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Your Referral Code</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-background border rounded-md px-3 py-2 font-mono text-center tracking-widest font-bold border-primary/20">
              {profile.referralCode}
            </div>
            <Button variant="outline" size="icon" onClick={copyCode} className="border-primary/20 text-primary">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-primary/10 dark:border-primary/20">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Redeem Friend's Code</label>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter code" 
              value={referralInput}
              onChange={(e) => setReferralInput(e.target.value)}
              className="bg-background border-primary/20"
            />
            <Button 
              size="icon" 
              onClick={handleRedeem} 
              disabled={isPending || !referralInput}
              className="bg-primary hover:bg-primary/90"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
