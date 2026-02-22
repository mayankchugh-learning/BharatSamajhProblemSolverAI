import { useAuth } from "@/hooks/use-auth";
import { useProblems } from "@/hooks/use-problems";
import { ProblemCard } from "@/components/ProblemCard";
import { CreateProblemDialog } from "@/components/CreateProblemDialog";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { ReferralCard } from "@/components/ReferralCard";
import { Advertisement } from "@/components/Advertisement";
import { AccountActions } from "@/components/AccountActions";
import { BrandLogo } from "@/components/BrandLogo";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useDocumentHead } from "@/hooks/use-document-head";
import { useLocale } from "@/contexts/locale-context";

export default function Dashboard() {
  const { config } = useLocale();

  useDocumentHead({
    title: "Dashboard",
    description: `Your ${config.appName} dashboard — manage problems, get AI solutions, and track your subscription.`,
    canonicalPath: "/",
    noIndex: true,
  });
  const { user, logout } = useAuth();
  const { data: problems, isLoading } = useProblems();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <BrandLogo />
          
          <div className="flex items-center gap-4">
            <FeedbackDialog />
            <ThemeToggle />
            <div className="flex items-center gap-3 mr-4">
              <Avatar className="w-8 h-8 border border-border">
                <AvatarImage src={user?.profileImageUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-sm">
                <p className="font-medium leading-none">{user?.firstName || 'User'}</p>
                <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => logout()} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content - Problems */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {config.dashboardGreeting(user?.firstName || 'Friend')}
                </h1>
                <p className="text-muted-foreground mt-1">{config.dashboardSubtitle}</p>
              </div>
              <CreateProblemDialog />
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-40 rounded-xl bg-muted/30 animate-pulse" />
                ))}
              </div>
            ) : problems && problems.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {problems.map((problem) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProblemCard problem={problem} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-muted">
                <div className="mb-4 flex justify-center">
                  <BrandLogo size="sm" className="text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold">No problems yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  Get started by submitting your first problem. Our AI is ready to help!
                </p>
                <CreateProblemDialog />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <SubscriptionCard />
            <ReferralCard />
            <Advertisement />
            <AccountActions />
          </div>
        </div>
      </main>
    </div>
  );
}
