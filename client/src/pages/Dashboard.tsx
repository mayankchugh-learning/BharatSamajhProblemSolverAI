import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useProblems, type ProblemsFilters } from "@/hooks/use-problems";
import { ProblemCard } from "@/components/ProblemCard";
import { ProblemCardSkeleton } from "@/components/ProblemCardSkeleton";
import { CreateProblemDialog } from "@/components/CreateProblemDialog";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { ReferralCard } from "@/components/ReferralCard";
import { Advertisement } from "@/components/Advertisement";
import { AccountActions } from "@/components/AccountActions";
import { BrandLogo } from "@/components/BrandLogo";
import { DashboardCharts } from "@/components/DashboardCharts";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, X } from "lucide-react";
import { PROBLEM_CATEGORIES, type ProblemCategory } from "@shared/schema";
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
  const { user } = useAuth();
  const [filters, setFilters] = useState<ProblemsFilters>({ page: 1, limit: 12 });
  const { data, isLoading } = useProblems(filters);
  const problems = data?.problems ?? null;
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / (filters.limit ?? 12));

  return (
    <div className="min-h-full bg-background">
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

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search problems..."
                  value={filters.search ?? ""}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined, page: 1 }))}
                  className="pl-9"
                />
                {(filters.search || filters.category || filters.status) && (
                  <button
                    type="button"
                    onClick={() => setFilters({ page: 1, limit: 12 })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear filters"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Select
                value={filters.category ?? "all"}
                onValueChange={(v) => setFilters((f) => ({ ...f, category: v === "all" ? undefined : v, page: 1 }))}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {(Object.entries(PROBLEM_CATEGORIES) as [ProblemCategory, { label: string }][]).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.status ?? "all"}
                onValueChange={(v) => setFilters((f) => ({ ...f, status: v === "all" ? undefined : v, page: 1 }))}
              >
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!isLoading && problems && problems.length > 0 && (
              <DashboardCharts problems={problems} />
            )}

            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <ProblemCardSkeleton key={i} />
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

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <Pagination>
                <PaginationContent className="flex-wrap gap-1 sm:gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if ((filters.page ?? 1) > 1) {
                          setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }));
                        }
                      }}
                      aria-disabled={(filters.page ?? 1) <= 1}
                      className={(filters.page ?? 1) <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {(() => {
                    const current = filters.page ?? 1;
                    const start = Math.max(1, current - 2);
                    const end = Math.min(totalPages, current + 2);
                    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setFilters((f) => ({ ...f, page }));
                          }}
                          isActive={current === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ));
                  })()}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if ((filters.page ?? 1) < totalPages) {
                          setFilters((f) => ({ ...f, page: (filters.page ?? 1) + 1 }));
                        }
                      }}
                      aria-disabled={(filters.page ?? 1) >= totalPages}
                      className={(filters.page ?? 1) >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
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
