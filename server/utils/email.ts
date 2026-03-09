import { Resend } from "resend";
import { logger } from "./logger";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.EMAIL_FROM ?? "BharatSolve AI <noreply@bharatsolve.ai>";

const resend = apiKey ? new Resend(apiKey) : null;

if (!apiKey && process.env.NODE_ENV === "production") {
  logger.warn("RESEND_API_KEY not set — email sending disabled in production");
} else if (!apiKey) {
  logger.debug("RESEND_API_KEY not set — email will be mocked in development");
}

const BASE_URL = process.env.BASE_URL ?? "https://bharatsolve.ai";

function baseTemplate(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  ${preheader ? `<meta name="x-apple-disable-message-reformatting"><title>${preheader}</title>` : ""}
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 0 auto; padding: 24px; }
    .header { background: linear-gradient(135deg, #FF9933 0%, #138808 100%); padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 1.5rem; }
    .body { background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; }
    .footer { padding: 16px; text-align: center; font-size: 12px; color: #6b7280; }
    .footer a { color: #138808; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🇮🇳 BharatSolve AI</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <a href="${BASE_URL}/privacy">Privacy Policy</a> · <a href="${BASE_URL}">BharatSolve AI</a>
    </div>
  </div>
</body>
</html>`;
}

async function send(to: string, subject: string, html: string): Promise<{ success: boolean; id?: string }> {
  if (!resend) {
    logger.debug({ subject }, "Email skipped (no API key)");
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject,
      html,
    });

    if (error) {
      logger.error({ err: error }, "Email send failed");
      return { success: false };
    }

    logger.info({ id: data?.id, subject }, "Email sent");
    return { success: true, id: data?.id };
  } catch (err) {
    logger.error({ err }, "Email send error");
    return { success: false };
  }
}

export async function sendWelcomeEmail(to: string, name?: string): Promise<{ success: boolean; id?: string }> {
  const displayName = name || "there";
  const content = `
    <p>Namaste ${displayName}!</p>
    <p>Welcome to BharatSolve AI — your trusted companion for navigating life's challenges with culturally-aware guidance.</p>
    <p>You now have <strong>30 days free</strong> to explore our AI solutions across education, law, health, finance, career, and more.</p>
    <p><a href="${BASE_URL}/dashboard" style="display:inline-block;background:#138808;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">Go to Dashboard</a></p>
    <p>Questions? Reply to this email — we're here to help.</p>
  `;
  return send(to, "Welcome to BharatSolve AI 🇮🇳", baseTemplate(content, "Welcome to BharatSolve AI"));
}

export async function sendPasswordResetEmail(
  to: string,
  name: string | undefined,
  resetUrl: string
): Promise<{ success: boolean; id?: string }> {
  const displayName = name || "there";
  const content = `
    <p>Namaste ${displayName},</p>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <p><a href="${resetUrl}" style="display:inline-block;background:#138808;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">Reset Password</a></p>
    <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
  `;
  return send(to, "Reset your BharatSolve AI password", baseTemplate(content, "Reset your password"));
}

export async function sendEmailVerification(to: string, name: string | undefined, verifyUrl: string): Promise<{ success: boolean; id?: string }> {
  const displayName = name || "there";
  const content = `
    <p>Namaste ${displayName},</p>
    <p>Please verify your email address to activate your BharatSolve AI account:</p>
    <p><a href="${verifyUrl}" style="display:inline-block;background:#138808;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">Verify Email</a></p>
  `;
  return send(to, "Verify your BharatSolve AI email", baseTemplate(content, "Verify your email"));
}

export async function sendSubscriptionConfirmation(
  to: string,
  name: string | undefined,
  plan: string,
  nextBillingDate: string
): Promise<{ success: boolean; id?: string }> {
  const displayName = name || "there";
  const content = `
    <p>Namaste ${displayName},</p>
    <p>Thank you for subscribing to BharatSolve AI!</p>
    <p>Your plan: <strong>${plan}</strong></p>
    <p>Next billing date: ${nextBillingDate}</p>
    <p>You can manage your subscription anytime from your <a href="${BASE_URL}/dashboard">dashboard</a>.</p>
  `;
  return send(to, "Your BharatSolve AI subscription confirmation", baseTemplate(content, "Subscription confirmed"));
}

export async function sendSubscriptionCancelled(to: string, name: string | undefined, endDate: string): Promise<{ success: boolean; id?: string }> {
  const displayName = name || "there";
  const content = `
    <p>Namaste ${displayName},</p>
    <p>Your BharatSolve AI subscription has been cancelled.</p>
    <p>You will continue to have access until <strong>${endDate}</strong>.</p>
    <p>We're sorry to see you go. You can resubscribe anytime from your <a href="${BASE_URL}/dashboard">dashboard</a>.</p>
  `;
  return send(to, "Your BharatSolve AI subscription has been cancelled", baseTemplate(content, "Subscription cancelled"));
}

export async function sendContactResponseEmail(
  to: string,
  name: string,
  subject: string,
  adminResponse: string
): Promise<{ success: boolean; id?: string }> {
  const content = `
    <p>Namaste ${name},</p>
    <p>Thank you for reaching out. Here is our response to your inquiry regarding "<strong>${subject}</strong>":</p>
    <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin:16px 0;white-space:pre-wrap;">${adminResponse.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    <p>If you have further questions, feel free to <a href="${BASE_URL}/contact">contact us</a> again.</p>
  `;
  return send(to, `Re: ${subject} - BharatSolve AI`, baseTemplate(content, "Response to your inquiry"));
}
