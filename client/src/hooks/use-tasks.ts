import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@shared/schema";

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/v1/tasks", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

async function createTask(data: { title: string; description?: string; status?: string; priority?: string }) {
  const res = await fetch("/api/v1/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create task");
  }
  return res.json();
}

async function updateTask(id: number, data: Partial<{ title: string; description: string; status: string; priority: string }>) {
  const res = await fetch(`/api/v1/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update task");
  }
  return res.json();
}

async function deleteTask(id: number) {
  const res = await fetch(`/api/v1/tasks/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete task");
}

export function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["/api/v1/tasks"],
    queryFn: fetchTasks,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/v1/tasks"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateTask>[1] }) =>
      updateTask(id, data!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/v1/tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/v1/tasks"] }),
  });

  return {
    tasks: tasks ?? [],
    isLoading,
    createTask: createMutation.mutateAsync,
    updateTask: (id: number, data: Parameters<typeof updateTask>[1]) =>
      updateMutation.mutateAsync({ id, data }),
    deleteTask: deleteMutation.mutateAsync,
  };
}
