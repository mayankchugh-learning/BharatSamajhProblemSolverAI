import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { InsertFeedback } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useSubmitFeedback() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertFeedback) => {
      const res = await fetch(api.feedback.submit.path, {
        method: api.feedback.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to submit feedback");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
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
