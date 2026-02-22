# BharatSolve AI — Architecture Documentation

---

## Table of Contents

1. [Application Architecture](#1-application-architecture)
2. [Infrastructure Architecture](#2-infrastructure-architecture)
3. [Combined Complete Architecture](#3-combined-complete-architecture)
4. [Data Flow Diagrams](#4-data-flow-diagrams)
5. [Database Schema](#5-database-schema)
6. [Security Architecture](#6-security-architecture)

---

## 1. Application Architecture

### 1.1 High-Level Application Architecture

```mermaid
graph TB
    subgraph Client["Frontend — React SPA"]
        direction TB
        UI["Pages & Components<br/>(React 18 + TypeScript)"]
        Router["Router<br/>(wouter)"]
        State["Server State<br/>(TanStack Query)"]
        Theme["Theme & Locale<br/>(next-themes + Context)"]
        Forms["Forms & Validation<br/>(React Hook Form + Zod)"]
        UI --> Router
        UI --> State
        UI --> Theme
        UI --> Forms
    end

    subgraph Shared["Shared Layer"]
        direction LR
        Schemas["Drizzle Schemas<br/>+ Zod Validators"]
        Routes["Typed API Contract<br/>(routes.ts)"]
        Locales["12 Locale Configs<br/>(locales.ts)"]
    end

    subgraph Server["Backend — Express 5 + Node.js 20"]
        direction TB
        API["REST API Routes"]
        Middleware["Security Middleware<br/>(helmet, rate-limit, CORS)"]
        Auth["Auth Module<br/>(Passport + OIDC)"]
        AI["AI Service<br/>(OpenAI / Ollama / Mock)"]
        Storage["Storage Layer<br/>(IStorage Interface)"]
        Utils["Utilities<br/>(PII Guard, File Scanner,<br/>Web Search)"]
        Middleware --> API
        API --> Auth
        API --> AI
        API --> Storage
        API --> Utils
    end

    subgraph Integrations["Integration Modules"]
        direction LR
        Chat["Chat<br/>(SSE Streaming)"]
        Audio["Audio<br/>(STT / TTS)"]
        Image["Image<br/>(AI Generation)"]
        Batch["Batch<br/>(p-limit)"]
    end

    subgraph DB["Data Layer"]
        direction LR
        Memory["In-Memory Store<br/>(Development)"]
        Postgres["PostgreSQL 16<br/>(Production)"]
    end

    Client -->|"HTTP / SSE"| Server
    Client -.->|"Shared Types"| Shared
    Server -.->|"Shared Types"| Shared
    Server --> Integrations
    Storage --> Memory
    Storage --> Postgres

    style Client fill:#e8f4fd,stroke:#2196f3,stroke-width:2px
    style Server fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style Shared fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    style Integrations fill:#e8f5e9,stroke:#4caf50,stroke-width:2px
    style DB fill:#fce4ec,stroke:#f44336,stroke-width:2px
```

### 1.2 Frontend Component Architecture

```mermaid
graph TB
    subgraph App["App.tsx — Root"]
        direction TB
        QP["QueryClientProvider"]
        TP["ThemeProvider"]
        LP["LocaleProvider"]
        ErrorB["ErrorBoundary"]
    end

    subgraph Pages["Pages"]
        Landing["Landing Page<br/>(Marketing + SEO)"]
        Dashboard["Dashboard<br/>(Problem List + Actions)"]
        ProblemDetail["Problem Detail<br/>(Chat-style Discussion)"]
        Privacy["Privacy Policy"]
        NotFound["404 Page"]
    end

    subgraph Components["Core Components"]
        CreateDialog["CreateProblemDialog"]
        ProblemCard["ProblemCard"]
        SubCard["SubscriptionCard"]
        RefCard["ReferralCard"]
        FeedbackDlg["FeedbackDialog"]
        SocialShare["SocialShare"]
        CookieConsent["CookieConsent"]
        AccActions["AccountActions"]
        LocaleSw["LocaleSwitcher"]
        ThemeToggle["ThemeToggle"]
        BrandLogo["BrandLogo"]
        Advert["Advertisement"]
    end

    subgraph Hooks["Custom Hooks"]
        useAuth["useAuth"]
        useProblems["useProblems"]
        useProfile["useProfile"]
        useDiscussion["useDiscussion"]
        useFeedback["useFeedback"]
        useDocHead["useDocumentHead"]
    end

    subgraph UILib["UI Library — shadcn/ui"]
        direction LR
        Buttons["Button, Card, Dialog"]
        Inputs["Input, Textarea, Select"]
        Layout["Sheet, Tabs, Separator"]
        Feedback["Toast, Alert, Badge"]
    end

    App --> Pages
    Pages --> Components
    Components --> Hooks
    Components --> UILib
    Hooks -->|"TanStack Query"| API["REST API"]

    style App fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style Pages fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style Components fill:#fff8e1,stroke:#f9a825,stroke-width:2px
    style Hooks fill:#fce4ec,stroke:#c62828,stroke-width:2px
    style UILib fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

### 1.3 Backend Module Architecture

```mermaid
graph TB
    subgraph Entry["Server Entry — index.ts"]
        Express["Express 5 App"]
        HTTP["HTTP Server"]
        WS["WebSocket Server"]
    end

    subgraph MW["Middleware Stack"]
        direction LR
        Helmet["Helmet<br/>(CSP, HSTS, XSS)"]
        RateLimit["Rate Limiter<br/>(Global / Login / AI)"]
        CORS["CORS Policy"]
        HPP["HPP Protection"]
        Session["Session<br/>(Memory / PG)"]
        Passport["Passport.js"]
        Payload["Payload Scanner<br/>(XSS / SQLi / Path Traversal)"]
    end

    subgraph Routes["API Routes — routes.ts"]
        direction TB
        ProblemRoutes["Problems API<br/>GET/POST /api/problems<br/>GET /api/problems/:id<br/>POST /api/problems/:id/messages"]
        ProfileRoutes["Profile API<br/>GET /api/profile<br/>POST /api/profile/referral<br/>POST /api/profile/subscribe<br/>DELETE /api/profile"]
        FeedbackRoutes["Feedback API<br/>POST /api/feedback"]
        SEORoutes["SEO<br/>GET /sitemap.xml<br/>GET /api/health"]
    end

    subgraph IntMod["Integration Modules"]
        AuthMod["Auth Module<br/>/api/login, /api/logout<br/>/api/auth/user"]
        ChatMod["Chat Module<br/>/api/conversations<br/>SSE Streaming"]
        AudioMod["Audio Module<br/>STT / TTS"]
        ImageMod["Image Module<br/>AI Generation"]
        BatchMod["Batch Module<br/>Parallel Processing"]
    end

    subgraph Services["Service Layer"]
        AIService["AI Service<br/>(OpenAI SDK)"]
        WebSearch["Web Search<br/>(Brave / Serper)"]
        PIIGuard["PII Guard<br/>(Email, Phone, Aadhaar,<br/>SSN, CC Redaction)"]
        FileScanner["File Scanner<br/>(Malware Detection)"]
    end

    subgraph StorageLayer["Storage Layer — IStorage Interface"]
        MemStore["MemoryStorage<br/>(Maps + Arrays)"]
        DBStore["DatabaseStorage<br/>(Drizzle ORM)"]
    end

    Entry --> MW
    MW --> Routes
    MW --> IntMod
    Routes --> Services
    Routes --> StorageLayer
    IntMod --> Services
    IntMod --> StorageLayer

    style Entry fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style MW fill:#ffebee,stroke:#c62828,stroke-width:2px
    style Routes fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style IntMod fill:#fff8e1,stroke:#f9a825,stroke-width:2px
    style Services fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style StorageLayer fill:#fce4ec,stroke:#f44336,stroke-width:2px
```

### 1.4 AI Processing Pipeline

```mermaid
flowchart LR
    A["User Input<br/>(Problem/Message)"] --> B["Input Validation<br/>(Zod)"]
    B --> C["PII Guard<br/>(Redact Sensitive Data)"]
    C --> D{"Web Search<br/>Enabled?"}
    D -->|Yes| E["Brave / Serper<br/>Search API"]
    D -->|No| F["Build Prompt"]
    E --> F
    F --> G["Category-Specific<br/>System Prompt<br/>(11 Expert Categories)"]
    G --> H{"AI Backend"}
    H -->|API Key Set| I["OpenAI API<br/>(GPT-4o-mini)"]
    H -->|Ollama URL| J["Ollama<br/>(Local LLM)"]
    H -->|No Config| K["Mock AI<br/>(Dev Response)"]
    I --> L["Response"]
    J --> L
    K --> L
    L --> M["Store in DB"]
    M --> N["Return to Client"]

    style A fill:#e3f2fd,stroke:#1565c0
    style C fill:#ffebee,stroke:#c62828
    style G fill:#f3e5f5,stroke:#7b1fa2
    style H fill:#fff8e1,stroke:#f9a825
    style L fill:#e8f5e9,stroke:#2e7d32
```

---

## 2. Infrastructure Architecture

### 2.1 AWS Production Infrastructure

```mermaid
graph TB
    subgraph Internet["Internet"]
        Users["Users / Browsers"]
        DNS["DNS<br/>(bharatsolve.ai)"]
        Crawlers["Search Engine<br/>Crawlers"]
    end

    subgraph AWS["AWS Cloud — ap-south-1 (Mumbai)"]
        subgraph VPC["VPC (10.0.0.0/16)"]

            subgraph PublicSubnets["Public Subnets"]
                subgraph PubAZ1["AZ-1 (10.0.1.0/24)"]
                    ALB1["ALB Node"]
                    NAT["NAT Gateway"]
                end
                subgraph PubAZ2["AZ-2 (10.0.2.0/24)"]
                    ALB2["ALB Node"]
                end
            end

            subgraph PrivateSubnets["Private Subnets"]
                subgraph PrivAZ1["AZ-1 (10.0.11.0/24)"]
                    ECS1["ECS Fargate<br/>Task 1"]
                    RDS1["RDS PostgreSQL 16<br/>(Primary)"]
                end
                subgraph PrivAZ2["AZ-2 (10.0.12.0/24)"]
                    ECS2["ECS Fargate<br/>Task 2"]
                end
            end

            IGW["Internet Gateway"]
        end

        subgraph AWSServices["AWS Managed Services"]
            ECR["ECR<br/>(Container Registry)"]
            SM["Secrets Manager<br/>(DB URL, Session Secret,<br/>OpenAI Key)"]
            CW["CloudWatch<br/>(Logs, 30-day retention)"]
            ACM["ACM<br/>(TLS Certificate)"]
            ASG["Auto Scaling<br/>(min:2, max:10)<br/>CPU 70% / Memory 80%"]
        end
    end

    subgraph External["External Services"]
        OpenAI["OpenAI API<br/>(GPT-4o-mini)"]
        BraveAPI["Brave Search API"]
    end

    Users --> DNS
    DNS --> IGW
    Crawlers --> IGW
    IGW --> ALB1 & ALB2
    ALB1 & ALB2 -->|"Port 3000"| ECS1 & ECS2
    ECS1 & ECS2 -->|"Port 5432"| RDS1
    ECS1 & ECS2 --> NAT
    NAT --> IGW
    ECS1 & ECS2 -.-> SM
    ECS1 & ECS2 -.-> CW
    ECR -.->|"Pull Image"| ECS1 & ECS2
    ACM -.->|"TLS Cert"| ALB1 & ALB2
    ASG -.->|"Scale"| ECS1 & ECS2

    ECS1 & ECS2 -->|"via NAT"| OpenAI
    ECS1 & ECS2 -->|"via NAT"| BraveAPI

    style Internet fill:#e0e0e0,stroke:#616161,stroke-width:2px
    style VPC fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style PublicSubnets fill:#c8e6c9,stroke:#2e7d32,stroke-width:1px
    style PrivateSubnets fill:#ffecb3,stroke:#ff8f00,stroke-width:1px
    style AWSServices fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style External fill:#fff3e0,stroke:#e65100,stroke-width:2px
```

### 2.2 Network & Security Groups

```mermaid
graph LR
    subgraph SG_ALB["Security Group: ALB"]
        direction TB
        ALB_IN["Inbound:<br/>80/tcp (HTTP) — 0.0.0.0/0<br/>443/tcp (HTTPS) — 0.0.0.0/0"]
        ALB_OUT["Outbound:<br/>All traffic — 0.0.0.0/0"]
    end

    subgraph SG_ECS["Security Group: ECS"]
        direction TB
        ECS_IN["Inbound:<br/>3000/tcp — ALB SG only"]
        ECS_OUT["Outbound:<br/>All traffic — 0.0.0.0/0"]
    end

    subgraph SG_RDS["Security Group: RDS"]
        direction TB
        RDS_IN["Inbound:<br/>5432/tcp — ECS SG only"]
        RDS_OUT["Outbound:<br/>All traffic — 0.0.0.0/0"]
    end

    SG_ALB -->|"Port 3000"| SG_ECS
    SG_ECS -->|"Port 5432"| SG_RDS

    style SG_ALB fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style SG_ECS fill:#bbdefb,stroke:#1565c0,stroke-width:2px
    style SG_RDS fill:#ffcdd2,stroke:#c62828,stroke-width:2px
```

### 2.3 Docker Build Pipeline (Multi-Stage)

```mermaid
flowchart LR
    subgraph Stage1["Stage 1: deps"]
        S1["Node 20 Alpine"]
        S1A["Copy package*.json"]
        S1B["npm ci"]
        S1 --> S1A --> S1B
    end

    subgraph Stage2["Stage 2: builder"]
        S2["Copy source + deps"]
        S2A["Vite build<br/>(Frontend → dist/public)"]
        S2B["esbuild bundle<br/>(Server → dist/index.js)"]
        S2 --> S2A --> S2B
    end

    subgraph Stage3["Stage 3: runner"]
        S3["Minimal Alpine Image"]
        S3A["Copy dist/ only"]
        S3B["Non-root user: appuser"]
        S3C["Healthcheck:<br/>GET /api/health"]
        S3D["EXPOSE 3000"]
        S3 --> S3A --> S3B --> S3C --> S3D
    end

    Stage1 --> Stage2 --> Stage3

    style Stage1 fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style Stage2 fill:#fff8e1,stroke:#f9a825,stroke-width:2px
    style Stage3 fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
```

### 2.4 Local Development Stack (docker-compose)

```mermaid
graph TB
    subgraph DockerCompose["docker-compose.yml"]
        subgraph DBService["Service: db"]
            PG["PostgreSQL 16 Alpine"]
            PGVol["Volume: pgdata"]
            PGHealth["Healthcheck: pg_isready"]
            PG --- PGVol
            PG --- PGHealth
        end

        subgraph AppService["Service: app"]
            AppC["BharatSolve App<br/>(Node.js 20)"]
            UploadsVol["Volume: uploads"]
            AppC --- UploadsVol
        end

        subgraph MigrateService["Service: migrate<br/>(Profile: migrate)"]
            Migrate["drizzle-kit push<br/>(One-shot Schema Push)"]
        end
    end

    AppService -->|"depends_on: healthy"| DBService
    MigrateService -->|"depends_on: healthy"| DBService

    Dev["Developer<br/>localhost:3000"] --> AppService
    DevDB["DB Client<br/>localhost:5432"] --> DBService

    style DockerCompose fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style DBService fill:#ffcdd2,stroke:#c62828,stroke-width:1px
    style AppService fill:#c8e6c9,stroke:#2e7d32,stroke-width:1px
    style MigrateService fill:#fff8e1,stroke:#f9a825,stroke-width:1px
```

---

## 3. Combined Complete Architecture

### 3.1 End-to-End System Architecture

```mermaid
graph TB
    subgraph Users["Users & Clients"]
        Browser["Web Browser<br/>(12 Locales)"]
        Mobile["Mobile Browser<br/>(PWA)"]
        SEOBot["Search Engine<br/>Crawlers"]
    end

    subgraph CDN["Edge / DNS"]
        DNS["DNS: bharatsolve.ai"]
    end

    subgraph AWS["AWS Cloud — ap-south-1"]
        ACM["ACM Certificate<br/>(TLS 1.3)"]

        subgraph VPC["VPC"]
            subgraph PublicTier["Public Tier"]
                ALB["Application Load Balancer<br/>HTTP→HTTPS Redirect<br/>Health Check: /api/auth/user"]
            end

            subgraph ComputeTier["Compute Tier — ECS Fargate"]
                subgraph Container["Container: BharatSolve App"]
                    subgraph FE["Frontend (Static)"]
                        ReactApp["React 18 SPA<br/>+ Tailwind + shadcn/ui"]
                        SEOMeta["Server-Side Meta<br/>Injection (Crawlers)"]
                    end

                    subgraph BE["Backend (Express 5)"]
                        SecurityMW["Security Layer<br/>Helmet | Rate Limit | CORS<br/>HPP | Payload Scan"]

                        subgraph APILayer["API Layer"]
                            ProbAPI["Problems API"]
                            ProfileAPI["Profile API"]
                            FeedbackAPI["Feedback API"]
                            AuthAPI["Auth API<br/>(OIDC / Passport)"]
                            ChatAPI["Chat API<br/>(SSE Stream)"]
                            SEOAPI["SEO API<br/>(Sitemap, Robots)"]
                        end

                        subgraph ServiceLayer["Services"]
                            AIEngine["AI Engine<br/>(OpenAI SDK)"]
                            PIIGuard["PII Guard"]
                            FileScanner["File Scanner"]
                            SearchSvc["Web Search"]
                        end

                        subgraph DataAccess["Data Access"]
                            DrizzleORM["Drizzle ORM"]
                            SessionStore["Session Store<br/>(connect-pg-simple)"]
                        end
                    end
                end
            end

            subgraph DataTier["Data Tier"]
                RDS["RDS PostgreSQL 16<br/>Encrypted | Auto-Backup<br/>7-day retention"]
            end
        end

        subgraph MgmtServices["Management Services"]
            ECR["ECR<br/>Container Registry"]
            Secrets["Secrets Manager<br/>DB_URL | SESSION_SECRET<br/>OPENAI_API_KEY"]
            CloudWatch["CloudWatch Logs"]
            AutoScale["Auto Scaling<br/>2-10 tasks<br/>CPU 70% | Mem 80%"]
        end
    end

    subgraph ExternalAPIs["External APIs"]
        OpenAI["OpenAI API<br/>(GPT-4o-mini)"]
        BraveSearch["Brave Search API"]
        SerperAPI["Serper.dev API"]
    end

    Browser & Mobile --> DNS
    SEOBot --> DNS
    DNS --> ALB
    ACM -.-> ALB
    ALB --> Container

    ReactApp -->|"API Calls"| SecurityMW
    SEOMeta -->|"Crawler Requests"| SecurityMW
    SecurityMW --> APILayer
    APILayer --> ServiceLayer
    APILayer --> DataAccess
    ServiceLayer --> DataAccess
    DataAccess --> RDS

    AIEngine -->|"via NAT GW"| OpenAI
    SearchSvc -->|"via NAT GW"| BraveSearch
    SearchSvc -->|"via NAT GW"| SerperAPI

    Container -.-> Secrets
    Container -.-> CloudWatch
    ECR -.->|"Image Pull"| Container
    AutoScale -.->|"Scale Tasks"| ComputeTier

    style Users fill:#e0e0e0,stroke:#616161,stroke-width:2px
    style AWS fill:#e3f2fd,stroke:#0d47a1,stroke-width:3px
    style VPC fill:#e8eaf6,stroke:#283593,stroke-width:2px
    style PublicTier fill:#c8e6c9,stroke:#2e7d32,stroke-width:1px
    style ComputeTier fill:#fff8e1,stroke:#f9a825,stroke-width:1px
    style DataTier fill:#ffcdd2,stroke:#c62828,stroke-width:1px
    style MgmtServices fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style ExternalAPIs fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style FE fill:#e8f5e9,stroke:#388e3c
    style BE fill:#fff3e0,stroke:#ef6c00
```

### 3.2 Request Lifecycle (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User Browser
    participant ALB as AWS ALB
    participant ECS as ECS Fargate<br/>(Express Server)
    participant MW as Security Middleware
    participant API as API Routes
    participant AI as AI Service
    participant PII as PII Guard
    participant DB as PostgreSQL (RDS)
    participant OAI as OpenAI API

    U->>ALB: HTTPS Request
    ALB->>ECS: Forward (Port 3000)
    ECS->>MW: Process Request

    Note over MW: Helmet → Rate Limit → CORS<br/>→ Session → Passport → Payload Scan

    MW->>API: Validated Request

    alt Create Problem
        API->>DB: Validate User Session
        DB-->>API: Session Valid
        API->>PII: Redact Sensitive Data
        PII-->>API: Sanitized Input
        API->>AI: Generate Solution
        AI->>OAI: Chat Completion Request
        OAI-->>AI: AI Response
        AI-->>API: Solution Text
        API->>DB: Store Problem + Solution
        DB-->>API: Saved
        API-->>ECS: JSON Response
    else SSE Chat Stream
        API->>DB: Load Conversation
        DB-->>API: History
        API->>PII: Redact PII
        PII-->>API: Clean Input
        API->>AI: Stream Request
        AI->>OAI: Stream Chat
        loop Token by Token
            OAI-->>AI: Token
            AI-->>ECS: SSE Event
            ECS-->>ALB: SSE Event
            ALB-->>U: SSE Event
        end
    end

    ECS-->>ALB: Response
    ALB-->>U: HTTPS Response
```

### 3.3 Multi-Locale Architecture

```mermaid
graph TB
    subgraph Detection["Locale Detection"]
        TZ["Browser Timezone"]
        Lang["Browser Language"]
        Manual["Manual Selection"]
    end

    subgraph LocaleEngine["Locale Engine — 12 Countries"]
        IN["🇮🇳 India<br/>BharatSolve<br/>Hindi/English<br/>₹499/mo"]
        SG["🇸🇬 Singapore<br/>SolveSG<br/>English/Mandarin<br/>S$12/mo"]
        HK["🇭🇰 Hong Kong<br/>SolveHK<br/>Cantonese/English<br/>HK$78/mo"]
        JP["🇯🇵 Japan<br/>SolveJP<br/>Japanese<br/>¥1,480/mo"]
        CN["🇨🇳 China<br/>SolveCN<br/>Mandarin<br/>¥35/mo"]
        US["🇺🇸 USA<br/>SolveUS<br/>English<br/>$9.99/mo"]
        GB["🇬🇧 UK<br/>SolveUK<br/>English<br/>£7.99/mo"]
        KR["🇰🇷 Korea<br/>SolveKR<br/>Korean<br/>₩12,900/mo"]
        AE["🇦🇪 UAE<br/>SolveAE<br/>Arabic/English<br/>AED 36/mo"]
        AU["🇦🇺 Australia<br/>SolveAU<br/>English<br/>A$14.99/mo"]
        DE["🇩🇪 Germany<br/>SolveDE<br/>German<br/>€8.99/mo"]
        BR["🇧🇷 Brazil<br/>SolveBR<br/>Portuguese<br/>R$49/mo"]
    end

    subgraph Customization["Per-Locale Customization"]
        Branding["App Name + Theme Colors"]
        Prompts["Culturally-Tuned<br/>AI System Prompts"]
        Content["Testimonials, FAQ,<br/>Use Cases, Features"]
        Pricing["Currency + Pricing"]
    end

    Detection --> LocaleEngine
    LocaleEngine --> Customization

    style Detection fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style LocaleEngine fill:#fff8e1,stroke:#f9a825,stroke-width:2px
    style Customization fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
```

---

## 4. Data Flow Diagrams

### 4.1 Authentication Flow

```mermaid
flowchart TB
    Start["User Clicks Login"] --> Check{"REPL_ID<br/>Set?"}

    Check -->|"No (Dev)"| DevAuth["Auto-Login<br/>as Dev User"]
    DevAuth --> Session["Create Session<br/>(memorystore)"]

    Check -->|"Yes (Prod)"| OIDC["Redirect to<br/>OpenID Connect Provider"]
    OIDC --> Callback["OAuth Callback<br/>/api/callback"]
    Callback --> Upsert["Upsert User<br/>in PostgreSQL"]
    Upsert --> PGSession["Create Session<br/>(connect-pg-simple)"]

    Session --> Profile["Auto-Create<br/>User Profile<br/>(30-day trial)"]
    PGSession --> Profile
    Profile --> Dashboard["Redirect to<br/>Dashboard"]

    style Start fill:#e3f2fd,stroke:#1565c0
    style DevAuth fill:#fff8e1,stroke:#f9a825
    style OIDC fill:#f3e5f5,stroke:#7b1fa2
    style Dashboard fill:#e8f5e9,stroke:#2e7d32
```

### 4.2 Problem Solving Flow

```mermaid
flowchart TB
    A["User Submits Problem"] --> B["Validate Input<br/>(Zod Schema)"]
    B --> C["Check Subscription<br/>Status"]
    C -->|"Expired"| D["Return 403"]
    C -->|"Active/Trial"| E["PII Guard<br/>Redact Sensitive Data"]
    E --> F["Select Category Prompt<br/>(11 Expert Domains)"]
    F --> G{"Web Search<br/>Augmentation?"}
    G -->|"Yes"| H["Query Brave/Serper"]
    G -->|"No"| I["Build AI Prompt"]
    H --> I
    I --> J["Call AI Backend<br/>(OpenAI/Ollama/Mock)"]
    J --> K["Store Problem<br/>+ AI Solution"]
    K --> L["Return Response<br/>to Client"]

    subgraph Categories["11 Expert Categories"]
        direction LR
        Cat1["Education"]
        Cat2["Legal"]
        Cat3["Health"]
        Cat4["Finance"]
        Cat5["Career"]
        Cat6["Family"]
        Cat7["Technology"]
        Cat8["Government"]
        Cat9["Housing"]
        Cat10["Mental Wellness"]
        Cat11["Other"]
    end

    F -.-> Categories

    style A fill:#e3f2fd,stroke:#1565c0
    style E fill:#ffebee,stroke:#c62828
    style J fill:#f3e5f5,stroke:#7b1fa2
    style L fill:#e8f5e9,stroke:#2e7d32
```

### 4.3 Subscription & Referral Flow

```mermaid
stateDiagram-v2
    [*] --> Trial: New User Registration
    Trial --> Active: Subscribe (Payment)
    Trial --> Expired: 30 Days Elapsed
    Active --> Active: Renewal
    Active --> Expired: Subscription Lapses
    Expired --> Active: Re-Subscribe

    state Trial {
        [*] --> TrialActive
        TrialActive --> ReferralApplied: Apply Referral Code
        ReferralApplied --> ExtendedTrial: +1 Month Free
        note right of TrialActive: 30-day free trial<br/>Full feature access
    }

    state "Referral System" as Ref {
        [*] --> CodeGenerated: Auto-generated<br/>unique code
        CodeGenerated --> CodeShared: User shares code
        CodeShared --> CodeRedeemed: New user applies
        CodeRedeemed --> BothRewarded: Referrer + Referee<br/>get +1 free month
    }
```

---

## 5. Database Schema

### 5.1 Entity Relationship Diagram

```mermaid
erDiagram
    USERS {
        varchar id PK "Unique user ID"
        varchar email "User email"
        varchar firstName "First name"
        varchar lastName "Last name"
        varchar profileImageUrl "Avatar URL"
        timestamp createdAt "Registration date"
        timestamp updatedAt "Last update"
    }

    SESSIONS {
        varchar sid PK "Session ID"
        json sess "Session data"
        timestamp expire "Expiry time"
    }

    USER_PROFILES {
        serial id PK "Auto-increment ID"
        varchar userId FK "→ users.id"
        varchar subscriptionStatus "trial/active/expired"
        timestamp trialStartDate "Trial start"
        timestamp trialEndDate "Trial end"
        varchar referralCode UK "Unique referral code"
        integer freeMonthsEarned "Referral rewards"
        timestamp createdAt "Creation date"
    }

    PROBLEMS {
        serial id PK "Auto-increment ID"
        varchar userId FK "→ users.id"
        varchar title "Problem title"
        text description "Problem description"
        text solution "AI-generated solution"
        varchar status "pending/solved"
        varchar language "User language"
        varchar category "Problem category"
        timestamp createdAt "Creation date"
    }

    DISCUSSION_MESSAGES {
        serial id PK "Auto-increment ID"
        integer problemId FK "→ problems.id"
        varchar role "user/assistant"
        text content "Message content"
        json attachments "File attachments"
        timestamp createdAt "Sent date"
    }

    FEEDBACK {
        serial id PK "Auto-increment ID"
        varchar userId FK "→ users.id"
        integer rating "1-5 stars"
        varchar category "Feedback category"
        text message "Feedback text"
        timestamp createdAt "Submitted date"
    }

    CONVERSATIONS {
        serial id PK "Auto-increment ID"
        varchar userId FK "→ users.id"
        varchar title "Conversation title"
        timestamp createdAt "Creation date"
        timestamp updatedAt "Last update"
    }

    MESSAGES {
        serial id PK "Auto-increment ID"
        integer conversationId FK "→ conversations.id"
        varchar role "user/assistant/system"
        text content "Message text"
        timestamp createdAt "Sent date"
    }

    USERS ||--o{ USER_PROFILES : "has"
    USERS ||--o{ PROBLEMS : "creates"
    USERS ||--o{ FEEDBACK : "submits"
    USERS ||--o{ CONVERSATIONS : "owns"
    PROBLEMS ||--o{ DISCUSSION_MESSAGES : "contains"
    CONVERSATIONS ||--o{ MESSAGES : "contains"
```

---

## 6. Security Architecture

### 6.1 Defense-in-Depth Layers

```mermaid
graph TB
    subgraph L1["Layer 1: Network"]
        VPCSec["VPC Isolation<br/>Public/Private Subnets"]
        SGRules["Security Groups<br/>Least-Privilege Rules"]
        TLS["TLS 1.3<br/>(ACM Certificate)"]
    end

    subgraph L2["Layer 2: Edge"]
        ALBSec["ALB<br/>HTTP→HTTPS Redirect"]
        WAF["Rate Limiting<br/>(200 req/15min global)"]
    end

    subgraph L3["Layer 3: Application"]
        HelmetSec["Helmet<br/>CSP, HSTS, X-Frame-Options"]
        CORSSec["CORS Policy"]
        HPPSec["HPP Protection"]
        PayloadSec["Payload Scanning<br/>XSS / SQLi / Path Traversal"]
        InputVal["Input Validation<br/>(Zod Schemas)"]
    end

    subgraph L4["Layer 4: Data"]
        PIISec["PII Redaction<br/>(Before AI Calls)"]
        SessionSec["Secure Sessions<br/>(httpOnly, sameSite)"]
        FileSecure["File Upload Scanning<br/>(Malware Detection)"]
        DBEncrypt["DB Encryption<br/>(At Rest)"]
        SecretsMgr["AWS Secrets Manager"]
    end

    subgraph L5["Layer 5: Runtime"]
        NonRoot["Non-root Container"]
        SizeLimit["Request Size Limits"]
        ErrMask["Production Error Masking"]
        LogAudit["CloudWatch Logging"]
    end

    L1 --> L2 --> L3 --> L4 --> L5

    style L1 fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style L2 fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style L3 fill:#fff8e1,stroke:#f9a825,stroke-width:2px
    style L4 fill:#fce4ec,stroke:#c62828,stroke-width:2px
    style L5 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

### 6.2 Rate Limiting Strategy

| Endpoint Category | Limit | Window | Purpose |
|---|---|---|---|
| Global | 200 requests | 15 minutes | Prevent abuse |
| Login (`/api/login`) | 10 requests | 15 minutes | Brute-force protection |
| AI Endpoints (`/api/problems`, `/api/*/messages`) | 10 requests | 1 minute | Cost control + abuse prevention |

---

## Technology Stack Summary

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | React + TypeScript + Vite + Tailwind + shadcn/ui | 18 / 5.6 / 7 / 3 |
| **Backend** | Node.js + Express + TypeScript | 20 / 5 / 5.6 |
| **Database** | PostgreSQL + Drizzle ORM | 16 |
| **AI** | OpenAI SDK (GPT-4o-mini) / Ollama | v6 |
| **Auth** | Passport.js + OpenID Connect | |
| **Container** | Docker (multi-stage, Alpine) | |
| **Orchestration** | AWS ECS Fargate | |
| **IaC** | Terraform | >= 1.5 |
| **Load Balancer** | AWS ALB (TLS 1.3) | |
| **Database Hosting** | AWS RDS PostgreSQL | 16.4 |
| **Secrets** | AWS Secrets Manager | |
| **Registry** | AWS ECR | |
| **Monitoring** | AWS CloudWatch | |
| **Region** | ap-south-1 (Mumbai) | |
