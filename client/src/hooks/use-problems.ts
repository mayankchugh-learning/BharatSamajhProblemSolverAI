import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertProblem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useProblems() {
  return useQuery({
    queryKey: [api.problems.list.path],
    queryFn: async () => {
      const res = await fetch(api.problems.list.path, { credentials: "include" });
      if (res.status === 401) return null; // Handle unauthorized gracefully
      if (!res.ok) throw new Error("Failed to fetch problems");
      return api.problems.list.responses[200].parse(await res.json());
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
      // Simulate slight delay for AI "thinking" effect if backend is too fast
      // const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
      // await delay(1500); 
      
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
      queryClient.invalidateQueries({ queryKey: [api.problems.list.path] });
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
