import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertProblem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export interface ProblemsFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useProblems(filters?: ProblemsFilters) {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));
  const queryString = params.toString();
  const url = queryString ? `${api.problems.list.path}?${queryString}` : api.problems.list.path;

  return useQuery({
    queryKey: [api.problems.list.path, filters],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch problems");
      const data = api.problems.list.responses[200].parse(await res.json());
      return data;
    },
  });
}

export function useProblem(id: number) {
  return useQuery({
    queryKey: [api.problems.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.problems.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch problem");
      return api.problems.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateProblem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertProblem) => {
      const res = await fetch(api.problems.create.path, {
        method: api.problems.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Subscription required. Your free trial may have expired.");
        }
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create problem");
      }

      return api.problems.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.problems.list.path] } as { queryKey: readonly unknown[] });
      toast({
        title: "Problem Solved!",
        description: "The AI has analyzed your request.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
