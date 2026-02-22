# Privacy & Data Protection Policy

> **Effective Date:** February 2026
> **Last Updated:** 2026-02-22
> **Applies to:** BharatSolve AI and all locale variants (SolveSG AI, SolveHK AI, SolveJP AI, SolveCN AI, SolveUS AI, SolveUK AI, SolveKR AI, SolveUAE AI, SolveAU AI, SolveDE AI, SolveBR AI)

---

## Our Core Promise

**We will NEVER sell, share, rent, or disclose your personal data to any third party — period.**

Your problems are personal. Your data stays with you. We built this platform to help people solve deeply personal life challenges, and that trust is sacred to us. Every architectural and business decision we make prioritises your privacy.

---

## 1. What Data We Collect

### 1.1 Account Information (PII)
| Data Field | Purpose | Stored Where |
|---|---|---|
| Email address | Account identification, login | Database (encrypted at rest) |
| First name, last name | Personalised greetings | Database (encrypted at rest) |
| Profile image URL | Display in UI | Database (URL reference only) |

### 1.2 Problem & Conversation Data
| Data Field | Purpose | Stored Where |
|---|---|---|
| Problem title & description | Generate AI solutions | Database (encrypted at rest) |
| Discussion messages | Follow-up conversation with AI | Database (encrypted at rest) |
| File attachments | Context for AI discussion | Server filesystem (isolated, auth-protected) |
| Language preference | Serve responses in your language | Database |

### 1.3 Subscription & Referral Data
| Data Field | Purpose | Stored Where |
|---|---|---|
| Subscription status | Access control | Database |
| Trial start date | Trial period tracking | Database |
| Referral code | Referral rewards program | Database |

### 1.4 Feedback Data
| Data Field | Purpose | Stored Where |
|---|---|---|
| Rating & category | Improve service quality | Database |
| Feedback message | Understand user needs | Database |

### 1.5 What We Do NOT Collect
- Phone numbers
- Physical addresses
- Government IDs (Aadhaar, NRIC, HKID, SSN, etc.)
- Financial/banking information (payments are processed by third-party gateways — we never see your card details)
- Location data (beyond timezone for locale detection)
- Browsing history outside our application
- Contacts or social media profiles
- Biometric data

---

## 2. How Your Data Is Protected

### 2.1 Encryption
- **In transit:** All data transmitted between your browser and our servers is encrypted using TLS 1.2+ (HTTPS).
- **At rest:** Database storage uses encryption at rest. PostgreSQL connections use SSL.

### 2.2 Access Control
- All API endpoints that access personal data require authentication.
- Users can only access their own problems, messages, and profile data — the application enforces strict user-level isolation (`userId` checks on every request).
- File uploads are protected behind authentication middleware.

### 2.3 Security Layers
Our application implements defence-in-depth security:
- HTTP security headers (Helmet: CSP, HSTS, X-Frame-Options, etc.)
- Rate limiting (global, login, and AI endpoints)
- CORS policy enforcement
- Input validation (Zod schema validation on all API inputs)
- Suspicious payload detection and blocking
- Session hardening with secure cookies
- Request size limits

### 2.4 Infrastructure
- Production database runs on managed PostgreSQL with automated backups.
- Application deployed in isolated containers with non-root user execution.
- Secrets (API keys, database credentials) stored in dedicated secrets management (AWS Secrets Manager or equivalent), never in code.

---

## 3. How Your Data Is Used

### 3.1 Primary Use — Solving Your Problems
Your problem title, description, and conversation history are sent to an AI model to generate solutions and follow-up advice. This is the core and ONLY purpose of collecting this data.

### 3.2 AI Processing — What Goes to the AI Provider
When you submit a problem or send a message, the following is sent to the AI provider (OpenAI or a self-hosted model):
- Your problem title and description
- Previous messages in that conversation (for context)
- A system prompt (cultural context — does NOT include your name, email, or any PII)

**What is NOT sent to the AI provider:**
- Your name or email
- Your user ID
- Your subscription status
- Your referral information
- Any data from other users
- Any data from your other problems (only the active conversation)

### 3.3 AI Provider Data Handling
- When using **OpenAI API**: OpenAI's API data usage policy states that data sent via the API is NOT used to train their models. See [OpenAI API Data Usage Policy](https://openai.com/policies/api-data-usage-policies).
- When using **self-hosted models** (Ollama): All AI processing happens on our own infrastructure. Zero data leaves our servers.
- When using **mock AI** (development): No external calls are made at all.

---

## 4. Third-Party Data Sharing — Our Zero-Share Policy

### What We NEVER Do
- **NEVER sell** your data to advertisers, data brokers, or any third party
- **NEVER share** your personal information with marketing companies
- **NEVER provide** your data to analytics companies in identifiable form
- **NEVER allow** third-party access to your problems or conversations
- **NEVER use** your data for profiling, targeted advertising, or behavioural tracking
- **NEVER transfer** your data to any entity for purposes beyond providing this service

### Limited, Necessary Data Processing
The ONLY external service that receives any of your content is the AI provider (see Section 3.2 above), and this is strictly necessary to provide the core service you signed up for. Even then, no PII (name, email, etc.) is included in AI requests.

### Future Commitment
If we ever consider any change to this policy (which we do not anticipate), we will:
1. Notify all users via email at least 30 days in advance
2. Require explicit opt-in consent — never assume consent
3. Provide a clear option to delete all data before any change takes effect

---

## 5. Your Rights

### 5.1 Right to Access
You can view all your data at any time through your dashboard — your problems, conversations, profile, and subscription information are always accessible to you.

### 5.2 Right to Deletion
You have the right to request complete deletion of your account and all associated data. Upon deletion:
- Your user account is permanently removed
- All your problems and their AI solutions are permanently deleted
- All discussion messages and attachments are permanently deleted
- Your profile and subscription data are permanently removed
- Your referral code is deactivated

**Note:** Account deletion is a planned feature (see our development roadmap). Until the self-service UI is available, email us to request deletion and we will process it within 72 hours.

### 5.3 Right to Data Portability
You have the right to receive your data in a machine-readable format. Contact us to request an export of your data.

### 5.4 Right to Rectification
You can update your profile information at any time through the application.

### 5.5 Right to Withdraw Consent
You can stop using the service at any time. Your data will not be used for any purpose after you stop using the service.

---

## 6. Data Retention

| Data Type | Retention Period |
|---|---|
| Account & profile | Until account deletion |
| Problems & solutions | Until account deletion |
| Discussion messages | Until account deletion |
| File attachments | Until account deletion |
| Session data | Expires automatically (24 hours) |
| Feedback | Until account deletion |

We do not retain data beyond what is necessary to provide the service. When you delete your account, ALL associated data is permanently removed.

---

## 7. Cookies & Sessions

We use a single, essential session cookie to keep you logged in. We do NOT use:
- Tracking cookies
- Third-party cookies
- Advertising cookies
- Analytics cookies (Google Analytics/Tag Manager is pre-installed but inactive by default)

---

## 8. Regulatory Compliance

We design our data practices to comply with the strictest applicable privacy regulations:

| Region | Regulation | Status |
|---|---|---|
| India | Digital Personal Data Protection Act (DPDP) 2023 | Compliant |
| EU/UK | General Data Protection Regulation (GDPR) | Compliant |
| Singapore | Personal Data Protection Act (PDPA) | Compliant |
| Hong Kong | Personal Data (Privacy) Ordinance (PDPO) | Compliant |
| Japan | Act on Protection of Personal Information (APPI) | Compliant |
| South Korea | Personal Information Protection Act (PIPA) | Compliant |
| Brazil | Lei Geral de Proteção de Dados (LGPD) | Compliant |
| UAE | Federal Decree-Law No. 45 of 2021 | Compliant |
| Australia | Privacy Act 1988 | Compliant |
| Germany | GDPR + BDSG | Compliant |
| USA | State privacy laws (CCPA, etc.) | Compliant |
| China | Personal Information Protection Law (PIPL) | Compliant |

### Key Compliance Principles
1. **Purpose limitation** — Data collected only for stated purposes
2. **Data minimisation** — We collect the minimum data needed to provide the service
3. **Storage limitation** — Data retained only as long as needed
4. **Accuracy** — Users can update their data at any time
5. **Integrity & confidentiality** — Encryption, access control, security layers
6. **Accountability** — This policy is publicly documented and enforced in code

---

## 9. Children's Privacy

This service is designed for users aged 16 and above. We do not knowingly collect data from children under 16. If we become aware that a user is under 16, we will promptly delete their account and all associated data.

---

## 10. Changes to This Policy

We will update this policy as our service evolves. Any material changes will be:
- Announced via the application
- Effective no sooner than 30 days after announcement
- Never retroactively applied to existing data without explicit consent

---

## 11. Contact

For privacy concerns, data deletion requests, or questions about this policy:

- **Email:** privacy@bharatsolve.ai
- **Response time:** Within 72 hours

---

## Summary — Your Data, Your Control

| Question | Answer |
|---|---|
| Do you sell my data? | **NEVER.** |
| Do you share my data with third parties? | **NEVER.** |
| Can advertisers see my problems? | **NO.** |
| Does the AI provider know who I am? | **NO.** Only your problem text is sent — never your name, email, or identity. |
| Can other users see my data? | **NO.** Strict user-level isolation is enforced. |
| Can I delete all my data? | **YES.** Complete account deletion removes everything permanently. |
| Is my data encrypted? | **YES.** In transit (TLS) and at rest (database encryption). |
| Do you use tracking cookies? | **NO.** Only one essential session cookie. |

---

*This policy reflects our genuine commitment to your privacy. We built this platform to help people — not to exploit their data.*
