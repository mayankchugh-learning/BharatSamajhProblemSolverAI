import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SocialShare } from "@/components/SocialShare";
import { BrandLogo } from "@/components/BrandLogo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocale } from "@/contexts/locale-context";
import { useDocumentHead } from "@/hooks/use-document-head";
import {
  ArrowRight,
  Brain,
  CheckCircle,
  Users,
  Zap,
  Star,
  Globe,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Heart,
  Sparkles,
  Languages,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-6 h-6 text-orange-500" />,
  Languages: <Languages className="w-6 h-6 text-purple-600" />,
  Sparkles: <Sparkles className="w-6 h-6 text-blue-600" />,
  Users: <Users className="w-6 h-6 text-green-600" />,
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold pr-4">{question}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  const { config } = useLocale();

  useDocumentHead({
    title: undefined,
    description: `${config.appName} helps you solve real-life challenges — family, career, relationships — using culturally aware AI in ${Object.keys(config.languages).length} languages. Free 1-month trial.`,
    canonicalPath: "/",
  });

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const languageCount = Object.keys(config.languages).length;
  const languageNames = Object.values(config.languages)
    .filter((l) => l.key !== "english")
    .slice(0, 5)
    .map((l) => l.nativeLabel);
  const footerLanguages = Object.values(config.languages).filter((l) => l.key !== "english");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm font-medium hover:text-primary hidden md:block">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary hidden md:block">Pricing</a>
            <a href="#faq" className="text-sm font-medium hover:text-primary hidden md:block">FAQ</a>
            <a href="#privacy" className="text-sm font-medium hover:text-primary hidden md:block">Privacy</a>
            <ThemeToggle />
            <LocaleSwitcher />
            <SocialShare
              title={config.shareTitle}
              description={config.shareDescription}
              variant="ghost"
              size="sm"
            />
            <Button onClick={handleLogin} variant="outline" className="hidden sm:flex">Log In</Button>
            <Button onClick={handleLogin}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary font-medium text-sm">
              {config.heroTrustBadge}
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              {config.heroTitle} <br />
              <span className="premium-text-gradient">{config.heroHighlight}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {config.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-12 px-8 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                onClick={handleLogin}
              >
                Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg" onClick={handleLogin}>
                View Demo
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>1-month free access</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-500" />
                <span>{languageCount} languages</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Your data never shared</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y bg-muted/30" aria-label="Trusted regions">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
            {config.socialProofText}
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {config.cities.map((city) => (
              <span key={city} className="text-xl font-display font-bold">{city}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24" aria-label="Features">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why {config.appName}?</h2>
            <p className="text-muted-foreground text-lg">
              We understand the heartbeat of {config.countryName}. Our AI is trained on local context and emotional intelligence — not just generic advice repackaged.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {config.features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="p-6 rounded-2xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-lg bg-background border shadow-sm flex items-center justify-center mb-4">
                    {ICON_MAP[feature.iconName] || <Sparkles className="w-6 h-6 text-primary" />}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/20" aria-label="How it works">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How {config.appName} Works</h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to get culturally aware, actionable solutions for any life challenge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Describe Your Challenge",
                desc: `Share your problem in any of ${languageCount} languages. Be as detailed as you want — the AI understands context and emotion.`,
              },
              {
                step: "2",
                icon: <Brain className="w-8 h-8" />,
                title: "AI Analyzes & Responds",
                desc: `Our culturally-tuned AI processes your situation, considers ${config.countryName} social norms, and crafts an empathetic, actionable solution.`,
              },
              {
                step: "3",
                icon: <Zap className="w-8 h-8" />,
                title: "Discuss & Take Action",
                desc: "Continue the conversation to refine advice. Ask follow-ups, explore alternatives, and build a concrete action plan.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-primary mb-2">Step {item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24" aria-label="What you can solve">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Use Cases</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Can You Solve?</h2>
            <p className="text-muted-foreground text-lg">
              From everyday dilemmas to life-changing decisions — {config.appName} has your back.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {config.useCases.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/20" aria-label="What users say">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Users Everywhere</h2>
            <p className="text-muted-foreground text-lg">
              Real stories from real users who found clarity and solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {config.testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed flex-1 mb-4">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.city}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24" aria-label="Pricing">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Simple Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Free, Upgrade When Ready</h2>
            <p className="text-muted-foreground text-lg">
              No hidden fees. No credit card required. Just culturally-aware AI at your service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="relative overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-2">Free Trial</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-display font-bold">{config.currency}0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">Full access for 30 days</p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited AI problem solving",
                    `${languageCount} language support`,
                    "Follow-up discussions",
                    "No credit card needed",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" onClick={handleLogin}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-primary/50 shadow-xl shadow-primary/10">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-display font-bold">{config.formattedPrice}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">Everything, unlimited</p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Everything in Free Trial",
                    "Priority AI responses",
                    "Referral rewards program",
                    "Earn free months by inviting friends",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" variant="default" onClick={handleLogin}>
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-muted/20" aria-label="Frequently asked questions">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about {config.appName}.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {config.faq.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Trust Section */}
      <section id="privacy" className="py-24" aria-label="Privacy and data protection">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Your Privacy Matters</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Data, Your Control</h2>
            <p className="text-muted-foreground text-lg">
              We handle deeply personal challenges. That's why we built privacy into every layer of our platform — not as an afterthought, but as a core value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Zero Third-Party Sharing",
                desc: "Your personal data and conversations are NEVER sold, shared, rented, or disclosed to any external party. Period.",
              },
              {
                title: "Anonymous AI Processing",
                desc: "When our AI generates solutions, only your problem text is sent — never your name, email, or any identifying information.",
              },
              {
                title: "Encrypted & Isolated",
                desc: "All data is encrypted in transit and at rest. Other users can never see your data. You can delete everything at any time.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="p-6 rounded-2xl border bg-card h-full text-center">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            We comply with GDPR, India's DPDP Act, Singapore's PDPA, and privacy regulations across all regions we serve.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5" aria-label="Get started">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                {config.ctaTitle}
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                {config.ctaDescription}
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-lg font-bold text-primary"
                onClick={handleLogin}
              >
                Get Started for Free
              </Button>
              <p className="mt-4 text-sm opacity-70">{config.ctaFooter}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t" aria-label="Footer">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="mb-4">
                <BrandLogo size="sm" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {config.footerTagline}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {config.useCases.slice(0, 5).map((uc) => (
                  <li key={uc.label}>{uc.label}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Languages</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {footerLanguages.slice(0, 5).map((lang) => (
                  <li key={lang.key}>{lang.label} / {lang.nativeLabel}</li>
                ))}
                {footerLanguages.length > 5 && (
                  <li>+ {footerLanguages.length - 5} more languages</li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="/privacy" className="hover:text-foreground transition-colors flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />Privacy Policy</a></li>
              </ul>
              <div className="mt-6">
                <SocialShare
                  title={config.shareTitle}
                  description={config.shareDescription}
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              &copy; {new Date().getFullYear()} {config.appName}. All rights reserved. {config.footerCopyright}
            </p>
            <div className="flex items-center gap-3">
              <LocaleSwitcher showLabel />
              <p className="text-xs text-muted-foreground">
                AI-powered problem solver for {config.countryName}.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
