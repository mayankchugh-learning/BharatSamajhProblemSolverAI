import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SocialShare } from "@/components/SocialShare";
import { BrandLogo } from "@/components/BrandLogo";
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
  IndianRupee,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "What is BharatSolve AI?",
    a: "BharatSolve AI is an AI-powered platform that helps Indians solve real-life challenges including family dynamics, career growth, relationships, and social situations. It provides culturally aware, empathetic solutions that understand Indian values and traditions.",
  },
  {
    q: "Which languages does BharatSolve AI support?",
    a: "BharatSolve AI supports 12 Indian languages: Hindi, Hinglish, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Odia. You can converse naturally in your preferred language.",
  },
  {
    q: "How much does BharatSolve AI cost?",
    a: "Start with a free 1-month trial with full access — no credit card required. After the trial, the subscription is just ₹499/month. You can also earn free months through our referral program by inviting friends.",
  },
  {
    q: "Is my data private and secure?",
    a: "Absolutely. Your conversations and personal data are encrypted and never shared with third parties. BharatSolve AI is committed to protecting your privacy and confidentiality.",
  },
  {
    q: "Can BharatSolve AI help with family problems?",
    a: "Yes! BharatSolve AI is specially designed to understand Indian family dynamics — joint families, in-law relationships, marriage concerns, parenting challenges, and elder care. It provides solutions that respect Indian cultural values while being practical and modern.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "Unlike generic AI, BharatSolve AI is deeply tuned for Indian cultural context. It understands joint family dynamics, Indian workplace culture, regional social norms, and provides advice that resonates with Indian values — not just Western perspectives.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya S.",
    city: "Mumbai",
    text: "BharatSolve helped me navigate a difficult conversation with my in-laws about career choices. The advice was culturally sensitive and practical.",
    rating: 5,
  },
  {
    name: "Rahul K.",
    city: "Delhi",
    text: "Finally an AI that understands the nuances of Indian family life. The Hinglish support makes it feel like talking to a wise friend.",
    rating: 5,
  },
  {
    name: "Lakshmi R.",
    city: "Chennai",
    text: "Tamil support is excellent! I can express my feelings naturally. The AI gave me a step-by-step plan for my career transition.",
    rating: 5,
  },
];

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
  useDocumentHead({
    title: undefined,
    description:
      "BharatSolve AI helps Indians solve real-life challenges — family, career, relationships — using culturally aware AI in 12 Indian languages. Free 1-month trial.",
    canonicalPath: "/",
  });

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

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
            <SocialShare
              title="BharatSolve AI — Solve Life's Challenges With Indian Wisdom & AI"
              description="Get empathetic, culturally-aware AI solutions in 12 Indian languages. Free trial!"
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
              Trusted by 10,000+ Indians across 50+ cities
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              Solve Life's Challenges <br />
              <span className="premium-text-gradient">With Indian Wisdom & AI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              From family dynamics to career growth in the modern Indian landscape.
              Get solutions that understand your emotions and culture — in Hindi, Hinglish, Tamil, Telugu, Bengali, and more.
              Start your free 1-month trial today.
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
                <span>12 Indian languages</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y bg-muted/30" aria-label="Trusted across India">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
            Trusted by users from 50+ Indian cities
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur"].map((city) => (
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why BharatSolve AI?</h2>
            <p className="text-muted-foreground text-lg">
              We understand the heartbeat of India. Our AI is trained on local context and emotional intelligence — not just Western advice repackaged.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart className="w-6 h-6 text-orange-500" />,
                title: "Culturally Aware AI",
                desc: "Solutions that respect Indian traditions, family values, joint family dynamics, and modern social challenges.",
              },
              {
                icon: <Languages className="w-6 h-6 text-purple-600" />,
                title: "12 Indian Languages",
                desc: "Converse in Hindi, Hinglish, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, or English.",
              },
              {
                icon: <Sparkles className="w-6 h-6 text-blue-600" />,
                title: "Deeply Empathetic",
                desc: "We don't just give answers; we understand the emotional weight of your struggles and provide compassionate guidance.",
              },
              {
                icon: <Users className="w-6 h-6 text-green-600" />,
                title: "Community Spirit",
                desc: "Join a growing family of Indians solving problems together. Refer friends and earn free months of premium access.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="p-6 rounded-2xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-lg bg-background border shadow-sm flex items-center justify-center mb-4">
                    {feature.icon}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How BharatSolve AI Works</h2>
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
                desc: "Share your problem in any of 12 Indian languages. Be as detailed as you want — the AI understands context and emotion.",
              },
              {
                step: "2",
                icon: <Brain className="w-8 h-8" />,
                title: "AI Analyzes & Responds",
                desc: "Our culturally-tuned AI processes your situation, considers Indian social norms, and crafts an empathetic, actionable solution.",
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
              From everyday dilemmas to life-changing decisions — BharatSolve AI has your back.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { label: "Joint Family Conflicts", emoji: "👨‍👩‍👧‍👦" },
              { label: "Career & Job Changes", emoji: "💼" },
              { label: "Marriage & Relationships", emoji: "💑" },
              { label: "Parenting Challenges", emoji: "👶" },
              { label: "In-Law Dynamics", emoji: "🏠" },
              { label: "Financial Planning", emoji: "💰" },
              { label: "Education & Studies", emoji: "📚" },
              { label: "Mental Wellness", emoji: "🧘" },
              { label: "Social Situations", emoji: "🤝" },
            ].map((item, i) => (
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Indians Everywhere</h2>
            <p className="text-muted-foreground text-lg">
              Real stories from real users who found clarity and solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
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
                  <span className="text-4xl font-display font-bold">₹0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">Full access for 30 days</p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited AI problem solving",
                    "12 Indian language support",
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
                  <span className="text-4xl font-display font-bold">₹499</span>
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
                  <IndianRupee className="w-4 h-4 mr-1" />
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
              Everything you need to know about BharatSolve AI.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
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
                Ready to solve the impossible?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Join 10,000+ users who are solving problems smarter, faster, and better — with AI that understands India.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-lg font-bold text-primary"
                onClick={handleLogin}
              >
                Get Started for Free
              </Button>
              <p className="mt-4 text-sm opacity-70">1-month free trial included. No commitment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO-rich Footer */}
      <footer className="py-16 border-t" aria-label="Footer">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <BrandLogo size="sm" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered problem solving for Indians. Culturally aware, empathetic, and available in 12 languages.
              </p>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Family Problem Solving</li>
                <li>Career Guidance</li>
                <li>Relationship Advice</li>
                <li>Financial Planning Help</li>
                <li>Education Counselling</li>
              </ul>
            </div>

            {/* Languages */}
            <div>
              <h4 className="font-semibold mb-4">Languages</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Hindi / हिन्दी</li>
                <li>Tamil / தமிழ்</li>
                <li>Telugu / తెలుగు</li>
                <li>Bengali / বাংলা</li>
                <li>Marathi / मराठी</li>
                <li>+ 7 more languages</li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
              <div className="mt-6">
                <SocialShare
                  title="BharatSolve AI — Indian Wisdom & AI"
                  description="Solve life's challenges with culturally-aware AI. Try free!"
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              &copy; {new Date().getFullYear()} BharatSolve AI. All rights reserved. Made with ❤️ in India 🇮🇳
            </p>
            <p className="text-xs text-muted-foreground">
              AI-powered problem solver for family, career, and social challenges across India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
