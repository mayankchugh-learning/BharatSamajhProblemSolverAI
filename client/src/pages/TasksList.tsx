import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ListTodo, Trash2, Check } from "lucide-react";
import { useDocumentHead } from "@/hooks/use-document-head";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export default function TasksList() {
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useDocumentHead({
    title: "Tasks",
    description: "Manage your tasks and to-do list",
    canonicalPath: "/tasks",
    noIndex: true,
  });

  const filteredTasks = statusFilter === "all"
    ? tasks
    : tasks.filter((t) => t.status === statusFilter);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await createTask({
      title: newTitle.trim(),
      description: newDescription.trim(),
    });
    setNewTitle("");
    setNewDescription("");
    setDialogOpen(false);
  };

  return (
    <div className="min-h-full bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ListTodo className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
              <p className="text-muted-foreground text-sm">Your personal task list</p>
            </div>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/4 rounded bg-muted mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`transition-colors ${
                      task.status === "done" ? "opacity-75 border-dashed" : ""
                    }`}
                  >
                    <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                      <CardTitle className="text-base leading-tight">{task.title}</CardTitle>
                      <div className="flex gap-1 shrink-0">
                        <Select
                          value={task.status}
                          onValueChange={(v) =>
                            updateTask(task.id, { status: v as "todo" | "in_progress" | "done" })
                          }
                        >
                          <SelectTrigger className="h-8 w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {task.description ? (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {task.description}
                        </p>
                      ) : null}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {PRIORITY_OPTIONS.find((p) => p.value === task.priority)?.label ?? task.priority}
                        </Badge>
                        {task.status === "done" ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ListTodo className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground text-center max-w-sm mb-4">
                Add your first task to get started. Track to-dos, in-progress items, and completed work.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Task title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description (optional)</label>
              <Input
                placeholder="Add details..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim()}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
