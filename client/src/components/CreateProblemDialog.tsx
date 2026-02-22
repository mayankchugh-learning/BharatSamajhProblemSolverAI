import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertProblemSchema,
  type InsertProblem,
  type SupportedLanguage,
  type ProblemCategory,
  PROBLEM_CATEGORIES,
} from "@shared/schema";
import { useCreateProblem } from "@/hooks/use-problems";
import { useLocale } from "@/contexts/locale-context";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Sparkles,
  Plus,
  Globe,
  ShieldCheck,
  GraduationCap,
  Scale,
  HeartPulse,
  Banknote,
  Briefcase,
  Users,
  Cpu,
  Building2,
  Home,
  Brain,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const CATEGORY_ICONS: Record<ProblemCategory, React.ReactNode> = {
  education: <GraduationCap className="w-5 h-5" />,
  law: <Scale className="w-5 h-5" />,
  health: <HeartPulse className="w-5 h-5" />,
  finance: <Banknote className="w-5 h-5" />,
  career: <Briefcase className="w-5 h-5" />,
  family: <Users className="w-5 h-5" />,
  technology: <Cpu className="w-5 h-5" />,
  government: <Building2 className="w-5 h-5" />,
  housing: <Home className="w-5 h-5" />,
  mental_wellness: <Brain className="w-5 h-5" />,
  other: <HelpCircle className="w-5 h-5" />,
};

export function CreateProblemDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"category" | "details">("category");
  const { mutate, isPending } = useCreateProblem();
  const { config } = useLocale();

  const form = useForm<InsertProblem>({
    resolver: zodResolver(insertProblemSchema),
    defaultValues: {
      title: "",
      description: "",
      language: config.defaultLanguage as SupportedLanguage,
      category: undefined,
    },
  });

  const selectedCategory = form.watch("category");

  function onSubmit(data: InsertProblem) {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        setStep("category");
        form.reset();
      },
    });
  }

  function handleCategorySelect(category: ProblemCategory) {
    form.setValue("category", category);
    setStep("details");
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setStep("category");
      form.reset();
    }
  }

  const localeLanguages = Object.entries(config.languages);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            {step === "category" ? "What type of problem?" : config.problemDialogTitle}
          </DialogTitle>
          <DialogDescription>
            {step === "category"
              ? "Select a category so we can connect you with the right expertise."
              : config.problemDialogDescription}
          </DialogDescription>
        </DialogHeader>

        {step === "category" ? (
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-[400px] overflow-y-auto pr-1">
            {(Object.entries(PROBLEM_CATEGORIES) as [ProblemCategory, typeof PROBLEM_CATEGORIES[ProblemCategory]][]).map(
              ([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategorySelect(key)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-primary/10 hover:border-primary/40 transition-all text-left group"
                >
                  <span className="text-primary/70 group-hover:text-primary transition-colors shrink-0">
                    {CATEGORY_ICONS[key]}
                  </span>
                  <span className="text-sm font-medium leading-tight">{cat.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                </button>
              )
            )}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("category")}
                  className="gap-1 text-xs text-muted-foreground h-7 px-2"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back
                </Button>
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {CATEGORY_ICONS[selectedCategory as ProblemCategory]}
                    {PROBLEM_CATEGORIES[selectedCategory as ProblemCategory].label}
                  </span>
                )}
              </div>

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-primary" />
                      Response Language
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Choose language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[280px]">
                        {localeLanguages.map(([key, lang]) => (
                          <SelectItem key={key} value={key}>
                            <span className="flex items-center gap-2">
                              <span className="font-medium">{lang.nativeLabel}</span>
                              {lang.nativeLabel !== lang.label && (
                                <span className="text-muted-foreground text-xs">({lang.label})</span>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's on your mind?</FormLabel>
                    <FormControl>
                      <Input placeholder={config.titlePlaceholder} {...field} className="bg-background/50" />
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
                    <FormLabel>Explain in your own words</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={config.descriptionPlaceholder}
                        className="min-h-[120px] bg-background/50 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                <p className="text-xs text-muted-foreground leading-snug">
                  Your data is private and encrypted. We <strong className="text-foreground">never share</strong> your personal information with any third party.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => handleOpenChange(false)}>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
