import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/contexts/locale-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CookieConsent } from "@/components/CookieConsent";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import ProblemDetail from "@/pages/ProblemDetail";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Admin from "@/pages/Admin";
import TasksList from "@/pages/TasksList";
import Help from "@/pages/Help";
import Resources from "@/pages/Resources";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/contexts/locale-context";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, isLoading } = useAuth();
  const { config } = useLocale();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm font-medium animate-pulse">Loading {config.appName}...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/admin" component={Admin} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/help" component={Help} />
        <Route path="/resources" component={Resources} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/help" component={Help} />
        <Route path="/resources" component={Resources} />
        <Route path="/admin" component={Admin} />
        <Route path="/tasks" component={TasksList} />
        <Route path="/problems/:id">
          {(params) => <ProblemDetail id={params.id} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocaleProvider>
            <TooltipProvider>
              <Router />
              <Toaster />
              <CookieConsent />
            </TooltipProvider>
          </LocaleProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
