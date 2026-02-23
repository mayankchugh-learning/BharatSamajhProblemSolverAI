import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, Trash2, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";

export function AccountActions() {
  const { toast } = useToast();

  const exportMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/profile/export", { credentials: "include" });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({ title: "Data exported", description: "Your data has been downloaded as a JSON file." });
    },
    onError: () => {
      toast({ title: "Export failed", description: "Please try again later.", variant: "destructive" });
    },
  });

  return (
    <div className="p-4 rounded-xl border bg-card space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
        <h3 className="font-semibold text-sm">Privacy & Data</h3>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
        onClick={() => exportMutation.mutate()}
        disabled={exportMutation.isPending}
      >
        {exportMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Export My Data
      </Button>

      <a href="/privacy" className="block">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
          <ShieldCheck className="w-4 h-4" />
          Privacy Policy
        </Button>
      </a>

      <DeleteAccountDialog />
    </div>
  );
}

function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/profile", {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Deletion failed");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Account deleted", description: "All your data has been permanently removed." });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    },
    onError: () => {
      toast({ title: "Deletion failed", description: "Please try again later.", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); setConfirmText(""); }}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
          Delete My Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Account Permanently
          </DialogTitle>
          <DialogDescription>
            This action is <strong>irreversible</strong>. All your data will be permanently deleted:
          </DialogDescription>
        </DialogHeader>

        <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
          <li>Your account and profile</li>
          <li>All problems and AI solutions</li>
          <li>All discussion messages and attachments</li>
          <li>Your subscription and referral data</li>
          <li>All feedback you've submitted</li>
        </ul>

        <div className="space-y-2 mt-2">
          <p className="text-sm font-medium">
            Type <span className="font-mono text-destructive">DELETE</span> to confirm:
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="font-mono"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={confirmText !== "DELETE" || deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete Everything
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
