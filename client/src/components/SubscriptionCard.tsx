import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Clock } from "lucide-react";
import { useProfile, useSubscribe } from "@/hooks/use-profile";
import { useLocale } from "@/contexts/locale-context";

export function SubscriptionCard() {
  const { data: profile } = useProfile();
  const { mutate: subscribe, isPending } = useSubscribe();
  const { config } = useLocale();

  if (!profile) return null;

  const isActive = profile.subscriptionStatus === 'active';
  const isTrial = profile.subscriptionStatus === 'trial';
  
  const trialStart = profile.trialStartDate ? new Date(profile.trialStartDate) : new Date();
  const trialEnd = new Date(trialStart);
  trialEnd.setMonth(trialEnd.getMonth() + 1);
  const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

  if (isActive) {
    return (
      <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Crown className="w-32 h-32" />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                Premium Active
                <Badge variant="default" className="bg-primary text-primary-foreground">PRO</Badge>
              </CardTitle>
              <CardDescription className="mt-2">
                You have full access to all AI features.
              </CardDescription>
            </div>
            <Crown className="text-primary w-8 h-8" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Thanks for supporting us! Enjoy unlimited problem solving.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-2 border-primary/10 shadow-xl shadow-primary/5 hover:border-primary/30 transition-all">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Zap className="text-yellow-500 fill-yellow-500 w-6 h-6" />
            Upgrade to Pro
          </CardTitle>
          {isTrial && daysLeft > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
              <Clock className="w-3 h-3 mr-1" />
              {daysLeft} days left in trial
            </Badge>
          )}
        </div>
        <CardDescription>
          Get unlimited AI solutions and faster processing times.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-2">
          {["Unlimited AI Solutions", "Culturally Nuanced Advice", "Family & Career Wisdom", "Priority Support"].map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <div className="bg-primary/10 rounded-full p-1">
                <Check className="w-3 h-3 text-primary" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={() => subscribe()} 
          disabled={isPending}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
        >
          {isPending ? "Processing..." : `Subscribe for ${config.formattedPrice}/mo`}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Cancel anytime. Secure payment processing.
        </p>
      </CardContent>
    </Card>
  );
}
