import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useDocumentHead } from "@/hooks/use-document-head";
import { useLocale } from "@/contexts/locale-context";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

const PRIVACY_SECTIONS = [
  {
    title: "Our Core Promise",
    content:
      "We will NEVER sell, share, rent, or disclose your personal data to any third party — period. Your problems are personal. Your data stays with you.",
  },
  {
    title: "1. What We Collect",
    content: `Account Information: Email address, first/last name, and profile image URL — used solely for login and personalised greetings.\n\nProblem & Conversation Data: Problem titles, descriptions, discussion messages, and file attachments — used exclusively to generate AI solutions.\n\nSubscription Data: Subscription status, trial dates, referral codes — used for access control.\n\nWhat We Do NOT Collect: Phone numbers, physical addresses, government IDs (Aadhaar, NRIC, HKID, SSN, etc.), financial/banking details, location data, browsing history, contacts, or biometric data.`,
  },
  {
    title: "2. How Your Data Is Protected",
    content:
      "In Transit: All data is encrypted using TLS 1.2+ (HTTPS).\n\nAt Rest: Database storage uses encryption at rest with SSL connections.\n\nAccess Control: All endpoints require authentication. Users can only access their own data — strict user-level isolation is enforced on every request.\n\nSecurity Layers: HTTP security headers (CSP, HSTS), rate limiting, CORS enforcement, input validation (Zod schemas), suspicious payload detection, session hardening, and request size limits.",
  },
  {
    title: "3. AI Processing — What Goes to the AI",
    content:
      "When you submit a problem, ONLY the problem title and description are sent to the AI provider. Your name, email, user ID, subscription status, and any other personal information are NEVER included in AI requests.\n\nOpenAI API: Data sent via the API is NOT used to train their models (per OpenAI's API data usage policy).\n\nSelf-hosted models (Ollama): All processing happens on our infrastructure. Zero data leaves our servers.\n\nMock AI (development): No external calls are made at all.",
  },
  {
    title: "4. Zero Third-Party Sharing",
    content:
      "We NEVER sell your data to advertisers or data brokers.\nWe NEVER share your information with marketing companies.\nWe NEVER provide your data to analytics companies in identifiable form.\nWe NEVER allow third-party access to your problems or conversations.\nWe NEVER use your data for profiling, targeted advertising, or behavioural tracking.\n\nThe ONLY external service that receives any content is the AI provider, and even then, no personally identifiable information is included.",
  },
  {
    title: "5. Your Rights",
    content:
      "Right to Access: View all your data anytime through your dashboard.\n\nRight to Deletion: Request complete, permanent deletion of your account and all associated data via your dashboard settings.\n\nRight to Data Portability: Export all your data (problems, messages, profile) in JSON format via your dashboard.\n\nRight to Rectification: Update your profile information at any time.\n\nRight to Withdraw Consent: Stop using the service at any time.",
  },
  {
    title: "6. Data Retention",
    content:
      "All user data (account, problems, messages, attachments, feedback) is retained until account deletion. Session data expires automatically within 24 hours. When you delete your account, ALL associated data is permanently and irrecoverably removed.",
  },
  {
    title: "7. Cookies",
    content:
      "We use a single essential session cookie to keep you logged in. We do NOT use tracking cookies, third-party cookies, advertising cookies, or analytics cookies.",
  },
  {
    title: "8. Regulatory Compliance",
    content:
      "Our data practices are designed to comply with: India's DPDP Act 2023, EU/UK GDPR, Singapore's PDPA, Hong Kong's PDPO, Japan's APPI, South Korea's PIPA, Brazil's LGPD, China's PIPL, UAE Federal Decree-Law No. 45, Australia's Privacy Act 1988, Germany's BDSG, and US state privacy laws (CCPA, etc.).",
  },
  {
    title: "9. Changes to This Policy",
    content:
      "Any material changes will be announced via the application and effective no sooner than 30 days after announcement. Changes are never retroactively applied to existing data without explicit consent.",
  },
];

export default function PrivacyPolicy() {
  const { config } = useLocale();
  const [, navigate] = useLocation();

  useDocumentHead({
    title: "Privacy Policy",
    description: `${config.appName} Privacy & Data Protection Policy. Your data is never shared with third parties.`,
    canonicalPath: "/privacy",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <BrandLogo />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          <h1 className="text-3xl md:text-4xl font-bold">Privacy & Data Protection</h1>
        </div>
        <p className="text-muted-foreground mb-2">
          {config.appName} — Effective February 2026
        </p>
        <p className="text-sm text-muted-foreground mb-10">
          For the full detailed policy, see our{" "}
          <a
            href="https://github.com/mayankchugh-learning/BharatSamajhProblemSolverAI/blob/main/docs/privacy-policy.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            complete privacy policy document
          </a>.
        </p>

        <div className="space-y-8">
          {PRIVACY_SECTIONS.map((section, i) => (
            <section key={i} className="space-y-3">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                {section.content}
              </div>
              {i < PRIVACY_SECTIONS.length - 1 && <hr className="border-border" />}
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl border bg-green-500/5 border-green-500/20">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            Quick Summary
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              ["Do you sell my data?", "NEVER."],
              ["Do you share with third parties?", "NEVER."],
              ["Does the AI know who I am?", "NO. Only problem text is sent."],
              ["Can other users see my data?", "NO. Strict isolation."],
              ["Can I delete all my data?", "YES. Permanent deletion."],
              ["Is my data encrypted?", "YES. In transit and at rest."],
              ["Do you use tracking cookies?", "NO. One session cookie only."],
              ["Can I export my data?", "YES. Full JSON export."],
            ].map(([q, a], idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-muted-foreground">{q}</span>
                <span className="font-semibold text-foreground">{a}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Contact: privacy@bharatsolve.ai — Response within 72 hours
        </p>
      </main>
    </div>
  );
}
