import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useProfile() {
  return useQuery({
    queryKey: [api.userProfiles.get.path],
    queryFn: async () => {
      const res = await fetch(api.userProfiles.get.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.userProfiles.get.responses[200].parse(await res.json());
    },
  });
}

export function useSubmitReferral() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (referralCode: string) => {
      const res = await fetch(api.userProfiles.submitReferral.path, {
        method: api.userProfiles.submitReferral.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Invalid referral code");
      }

      return api.userProfiles.submitReferral.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.userProfiles.get.path] });
      toast({
        title: "Referral Applied",
        description: "You've successfully applied a referral code!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Referral Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useSubscribe() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.userProfiles.subscribe.path, {
        method: api.userProfiles.subscribe.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Subscription failed");
      return api.userProfiles.subscribe.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.userProfiles.get.path] });
      toast({
        title: "Subscription Active",
        description: "Thank you for upgrading to Premium!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
