import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, CheckCircle, Shield, Users, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-2xl text-primary">
            <Brain className="w-8 h-8" />
            <span>BharatSolve AI</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm font-medium hover:text-primary hidden md:block">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary hidden md:block">Pricing</a>
            <Button onClick={handleLogin} variant="outline" className="hidden sm:flex">Log In</Button>
            <Button onClick={handleLogin}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
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
              New: GPT-4o Integration Available
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              Solve Life's Challenges <br/>
              <span className="premium-text-gradient">With Indian Wisdom & AI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              From family dynamics to career growth in the modern Indian landscape. 
              Get solutions that understand your emotions and culture.
              Start your free 1-month trial today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" onClick={handleLogin}>
                Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg" onClick={handleLogin}>
                View Demo
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>1-month free access</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">Trusted by users from</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'].map((brand) => (
              <span key={brand} className="text-xl font-display font-bold">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why BharatSolve?</h2>
            <p className="text-muted-foreground text-lg">We understand the heartbeat of India. Our AI is trained on local context and emotional intelligence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6 text-orange-500" />,
                title: "Culturally Aware",
                desc: "Solutions that respect Indian traditions, family values, and modern social dynamics."
              },
              {
                icon: <Shield className="w-6 h-6 text-blue-600" />,
                title: "Deeply Empathetic",
                desc: "We don't just give answers; we understand the emotional weight of your struggles."
              },
              {
                icon: <Users className="w-6 h-6 text-green-600" />,
                title: "Community Spirit",
                desc: "Join a growing family of Indians solving problems together with AI assistance."
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-background border shadow-sm flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to solve the impossible?</h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Join 10,000+ users who are solving problems smarter, faster, and better.
              </p>
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold text-primary" onClick={handleLogin}>
                Get Started for Free
              </Button>
              <p className="mt-4 text-sm opacity-70">1-month free trial included. No commitment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-display font-bold text-xl text-primary">
              <Brain className="w-6 h-6" />
              <span>SolveAI</span>
            </div>
            <div className="text-sm text-muted-foreground text-center md:text-right">
              &copy; {new Date().getFullYear()} SolveAI Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
