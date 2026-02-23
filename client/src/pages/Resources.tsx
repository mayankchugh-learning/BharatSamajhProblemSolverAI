import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ArrowLeft,
  ExternalLink,
  CreditCard,
  Gift,
  Zap,
  FileText,
} from "lucide-react";
import { Link } from "wouter";
import { useDocumentHead } from "@/hooks/use-document-head";
import { useLocale } from "@/contexts/locale-context";

const MONETIZATION_LINKS: { title: string; description: string; href: string; external?: boolean }[] = [
  {
    title: "Free Trial & Subscription",
    description: "30-day free trial, then affordable monthly subscription. No credit card needed to start.",
    href: "/#pricing",
  },
  {
    title: "Referral Program",
    description: "Earn free months when you refer friends. Both you and your friend get 1 free month.",
    href: "/#features",
  },
  {
    title: "Lemon Squeezy (Payment Gateway)",
    description: "We use Lemon Squeezy for payments — no business entity needed, handles global taxes.",
    href: "https://www.lemonsqueezy.com",
    external: true,
  },
  {
    title: "Pricing by Locale",
    description: "Locale-specific pricing (India ₹499, Singapore S$15, Hong Kong HK$99, USA $10, etc.).",
    href: "/#pricing",
  },
];

const RESOURCE_LINKS: { title: string; description: string; href: string; external?: boolean }[] = [
  {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your data.",
    href: "/privacy",
  },
  {
    title: "Help & FAQ",
    description: "Answers to common questions.",
    href: "/help",
  },
  {
    title: "Free Hosting Guide",
    description: "Deploy on Render, Railway, Fly.io and more — free tiers available.",
    href: "https://github.com",
    external: true,
  },
];

export default function Resources() {
  const { config } = useLocale();

  useDocumentHead({
    title: "Monetization & Resources",
    description: `Pricing, subscription info, and helpful resources for ${config.appName}`,
    canonicalPath: "/resources",
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <DollarSign className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Monetization & Resources</h1>
            <p className="text-muted-foreground text-sm">
              Pricing, subscription info, and helpful links
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <CardTitle>Subscription & Monetization</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                How {config.appName} monetizes and pricing details
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {MONETIZATION_LINKS.map((item) =>
                item.external ? (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground" />
                    </div>
                  </a>
                ) : (
                  <Link key={item.title} href={item.href}>
                    <div className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <CardTitle>Helpful Resources</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Documentation and support links
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {RESOURCE_LINKS.map((item) =>
                item.external ? (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground" />
                    </div>
                  </a>
                ) : (
                  <Link key={item.title} href={item.href}>
                    <div className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <Gift className="w-10 h-10 text-primary" />
                <div>
                  <h3 className="font-semibold">Referral rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Refer friends and earn free months — both of you benefit
                  </p>
                </div>
              </div>
              <Link href="/">
                <Button className="shrink-0">
                  <Zap className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
