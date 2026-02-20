import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProblemSchema, type InsertProblem } from "@shared/schema";
import { useCreateProblem } from "@/hooks/use-problems";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Plus } from "lucide-react";
import { useState } from "react";

export function CreateProblemDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateProblem();

  const form = useForm<InsertProblem>({
    resolver: zodResolver(insertProblemSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(data: InsertProblem) {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
          <Plus className="w-5 h-5" />
          New Problem
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            Ask the AI
          </DialogTitle>
          <DialogDescription>
            Describe your problem in detail. Our AI will analyze it and provide a comprehensive solution.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fix React hydration error" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste code snippets, context, or detailed questions here..." 
                      className="min-h-[150px] bg-background/50 resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[140px]">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Solving...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Solution
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
