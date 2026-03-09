import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Shield,
  CreditCard,
  Share2,
  Mail,
} from "lucide-react";
import { Link } from "wouter";
import { useDocumentHead } from "@/hooks/use-document-head";
import { useLocale } from "@/contexts/locale-context";

const FAQ_ITEMS = [
  {
    q: "How does the free trial work?",
    a: "You get 30 days of full access to all features. No credit card required. After the trial, you can subscribe to continue using the service.",
  },
  {
    q: "How do I submit a problem?",
    a: "Click 'New Problem' on your dashboard, choose a category, describe your situation, and select your preferred language. Our AI will generate a personalized solution.",
  },
  {
    q: "Can I discuss my problem further?",
    a: "Yes! Open any problem to see the solution and use the chat to ask follow-up questions. The AI remembers the context of your conversation.",
  },
  {
    q: "How does the referral program work?",
    a: "Share your unique referral code with friends. When they sign up and use your code, both of you earn 1 free month of subscription.",
  },
  {
    q: "Is my data private?",
    a: "Yes. We don't share your personal information. See our Privacy Policy for details. Your problems and conversations are stored securely.",
  },
];

export default function Help() {
  const { config } = useLocale();

  useDocumentHead({
    title: "Help",
    description: `Help and FAQ for ${config.appName}`,
    canonicalPath: "/help",
  });

  return (
    <div className="min-h-full bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Help & FAQ</h1>
            <p className="text-muted-foreground text-sm">
              Answers to common questions about {config.appName}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Quick answers to the most common questions
                </p>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {FAQ_ITEMS.map((item, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger>{item.q}</AccordionTrigger>
                      <AccordionContent>{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/resources">
                  <Button variant="ghost" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Monetization & Resources
                  </Button>
                </Link>
                <Link href="/privacy">
                  <Button variant="ghost" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy & Security
                  </Button>
                </Link>
                <Link href="/help#referrals">
                  <Button variant="ghost" className="w-full justify-start">
                    <Share2 className="w-4 h-4 mr-2" />
                    Referral Program
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start mt-4">
                    Back to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
