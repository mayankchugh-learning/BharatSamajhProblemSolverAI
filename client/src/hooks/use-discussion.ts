import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { DiscussionMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useDiscussionMessages(problemId: number) {
  const url = buildUrl(api.problems.listMessages.path, { id: problemId });
  return useQuery<DiscussionMessage[]>({
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!problemId,
  });
}

export interface SendMessagePayload {
  content: string;
  files?: File[];
}

export function useSendMessage(problemId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const messagesUrl = buildUrl(api.problems.listMessages.path, { id: problemId });

  return useMutation({
    mutationFn: async ({ content, files }: SendMessagePayload) => {
      const url = buildUrl(api.problems.sendMessage.path, { id: problemId });

      const formData = new FormData();
      formData.append("content", content);
      if (files) {
        for (const file of files) {
          formData.append("files", file);
        }
      }

      const res = await fetch(url, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to send message");
      }

      return res.json() as Promise<{
        userMessage: DiscussionMessage;
        aiMessage: DiscussionMessage;
      }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [messagesUrl] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
