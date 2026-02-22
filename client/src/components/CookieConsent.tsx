import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "cookie-consent-accepted";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(CONSENT_KEY, new Date().toISOString());
    } catch {
      // localStorage unavailable
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4"
        >
          <div className="container mx-auto max-w-3xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border bg-card shadow-lg">
              <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5 sm:mt-0" />
              <div className="flex-1 text-sm text-muted-foreground">
                We use a single essential cookie to keep you logged in. We do{" "}
                <strong className="text-foreground">not</strong> use tracking, advertising, or third-party cookies.
                Your data is never shared.{" "}
                <a href="/privacy" className="underline hover:text-foreground">
                  Privacy Policy
                </a>
              </div>
              <Button size="sm" onClick={accept} className="shrink-0">
                Got it
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
