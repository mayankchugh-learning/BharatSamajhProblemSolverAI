import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchAdminMe(): Promise<{ authenticated: boolean }> {
  const res = await fetch("/api/v1/admin/me", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to check admin status");
  return res.json();
}

async function adminLogin(username: string, password: string) {
  const res = await fetch("/api/v1/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Login failed");
  }
  return res.json();
}

async function adminLogout() {
  const res = await fetch("/api/v1/admin/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}

export function useAdminAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["/api/v1/admin/me"],
    queryFn: fetchAdminMe,
  });

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      adminLogin(username, password),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/me"] }),
  });

  const logoutMutation = useMutation({
    mutationFn: adminLogout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/me"] }),
  });

  return {
    isAdmin: data?.authenticated ?? false,
    isLoading,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
}
