import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useDocumentHead } from "@/hooks/use-document-head";
import { useLocale } from "@/contexts/locale-context";

export default function Contact() {
  const { config } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useDocumentHead({
    title: "Contact Us",
    description: `Get in touch with ${config.appName} - we're here to help`,
    canonicalPath: "/contact",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-full bg-background">
        <div className="container mx-auto px-4 py-16 max-w-lg">
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Message sent!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for reaching out. We&apos;ll get back to you as soon as possible.
              </p>
              <Link href="/">
                <Button>Back to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Mail className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Contact Us</h1>
            <p className="text-muted-foreground text-sm">
              Have a question or feedback? We&apos;d love to hear from you.
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <p className="text-sm text-muted-foreground">
                Fill out the form below and we&apos;ll respond as soon as we can.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="contact-name">Name</Label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    maxLength={200}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What is this about?"
                    required
                    maxLength={200}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message (at least 10 characters)"
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={5}
                    className="resize-none"
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button type="submit" disabled={isSubmitting}>
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Sending..." : "Send message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Link href="/help">
              <Button variant="ghost" size="sm">
                ← Back to Help
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
