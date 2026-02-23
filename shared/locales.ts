export type LocaleCode = "IN" | "SG" | "HK" | "JP" | "CN" | "US" | "GB" | "KR" | "AE" | "AU" | "DE" | "BR";

export interface LocaleLanguage {
  key: string;
  label: string;
  nativeLabel: string;
  greeting: string;
}

export interface LocaleTestimonial {
  name: string;
  city: string;
  text: string;
  rating: number;
}

export interface LocaleFAQ {
  q: string;
  a: string;
}

export interface LocaleUseCase {
  label: string;
  emoji: string;
}

export interface LocaleFeature {
  iconName: string;
  title: string;
  desc: string;
}

export interface LocaleTheme {
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryDark: string;
  accent: string;
  accentDark: string;
  ring: string;
  ringDark: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  gradientFromDark: string;
  gradientViaDark: string;
  gradientToDark: string;
  themeColor: string;
}

export interface LocalePromotion {
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
}

export interface LocaleConfig {
  code: LocaleCode;
  countryName: string;
  appName: string;
  flagEmoji: string;
  domain: string;
  htmlLang: string;
  ogLocale: string;
  currency: string;
  currencyCode: string;
  monthlyPrice: number;
  formattedPrice: string;
  defaultLanguage: string;
  languages: Record<string, LocaleLanguage>;
  theme: LocaleTheme;
  cities: string[];
  promotion: LocalePromotion;
  referralFamilyName: string;
  tagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroTrustBadge: string;
  socialProofText: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaFooter: string;
  footerTagline: string;
  footerCopyright: string;
  dashboardGreeting: (name: string) => string;
  dashboardSubtitle: string;
  problemDialogTitle: string;
  problemDialogDescription: string;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  shareTitle: string;
  shareDescription: string;
  features: LocaleFeature[];
  useCases: LocaleUseCase[];
  testimonials: LocaleTestimonial[];
  faq: LocaleFAQ[];
  culturalAIContext: string;
}

// ---------------------------------------------------------------------------
// INDIA
// ---------------------------------------------------------------------------
const INDIA_CONFIG: LocaleConfig = {
  code: "IN",
  countryName: "India",
  appName: "Your Best Friend AI 🇮🇳",
  flagEmoji: "🇮🇳",
  domain: "bharatsolve.ai",
  htmlLang: "en",
  ogLocale: "en_IN",
  currency: "₹",
  currencyCode: "INR",
  monthlyPrice: 499,
  formattedPrice: "₹499",
  defaultLanguage: "english",
  languages: {
    english: { key: "english", label: "English", nativeLabel: "English", greeting: "Hello" },
    hindi: { key: "hindi", label: "Hindi", nativeLabel: "हिन्दी", greeting: "नमस्ते" },
    hinglish: { key: "hinglish", label: "Hinglish", nativeLabel: "Hinglish", greeting: "Namaste" },
    tamil: { key: "tamil", label: "Tamil", nativeLabel: "தமிழ்", greeting: "வணக்கம்" },
    telugu: { key: "telugu", label: "Telugu", nativeLabel: "తెలుగు", greeting: "నమస్కారం" },
    bengali: { key: "bengali", label: "Bengali", nativeLabel: "বাংলা", greeting: "নমস্কার" },
    marathi: { key: "marathi", label: "Marathi", nativeLabel: "मराठी", greeting: "नमस्कार" },
    gujarati: { key: "gujarati", label: "Gujarati", nativeLabel: "ગુજરાતી", greeting: "નમસ્તે" },
    kannada: { key: "kannada", label: "Kannada", nativeLabel: "ಕನ್ನಡ", greeting: "ನಮಸ್ಕಾರ" },
    malayalam: { key: "malayalam", label: "Malayalam", nativeLabel: "മലയാളം", greeting: "നമസ്കാരം" },
    punjabi: { key: "punjabi", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ" },
    odia: { key: "odia", label: "Odia", nativeLabel: "ଓଡ଼ିଆ", greeting: "ନମସ୍କାର" },
  },
  theme: {
    primary: "28 91% 54%", primaryDark: "28 91% 45%",
    secondary: "145 45% 45%", secondaryDark: "145 45% 35%",
    accent: "215 90% 40%", accentDark: "215 90% 30%",
    ring: "28 91% 54%", ringDark: "28 91% 45%",
    gradientFrom: "from-orange-500", gradientVia: "via-white", gradientTo: "to-green-600",
    gradientFromDark: "dark:from-orange-400", gradientViaDark: "dark:via-blue-400", gradientToDark: "dark:to-green-400",
    themeColor: "#E8751A",
  },
  cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur"],
  promotion: { title: "Crack UPSC with AI", description: "Personalized study plans and mock interviews tailored for the Indian civil services.", gradientFrom: "from-orange-600", gradientTo: "to-red-600", accentColor: "bg-yellow-500/30" },
  referralFamilyName: "BharatSolve family",
  tagline: "Solve Life's Challenges With Indian Wisdom & AI",
  heroTitle: "Solve Life's Challenges",
  heroHighlight: "With Indian Wisdom & AI",
  heroDescription: "From family dynamics to career growth in the modern Indian landscape. Get solutions that understand your emotions and culture — in Hindi, Hinglish, Tamil, Telugu, Bengali, and more. Start your free 1-month trial today.",
  heroTrustBadge: "Trusted by 10,000+ Indians across 50+ cities",
  socialProofText: "Trusted by users from 50+ Indian cities",
  ctaTitle: "Ready to solve the impossible?",
  ctaDescription: "Join 10,000+ users who are solving problems smarter, faster, and better — with AI that understands India.",
  ctaFooter: "1-month free trial included. No commitment.",
  footerTagline: "AI-powered problem solving for Indians. Culturally aware, empathetic, and available in 12 languages.",
  footerCopyright: "Made with ❤️ in India 🇮🇳",
  dashboardGreeting: (name) => `Namaste, ${name}`,
  dashboardSubtitle: "Share your heart's concerns or technical hurdles. We're here for you.",
  problemDialogTitle: "Ask Your Best Friend AI 🇮🇳",
  problemDialogDescription: "Share your concerns—whether it's family, career, or technical hurdles. Our AI understands the Indian heart and mind.",
  titlePlaceholder: "e.g., How to balance joint family expectations with career?",
  descriptionPlaceholder: "Tell us the full story. We're listening with an open heart...",
  shareTitle: "Your Best Friend AI 🇮🇳 — Solve Life's Challenges With Indian Wisdom & AI",
  shareDescription: "Get empathetic, culturally-aware AI solutions in 12 Indian languages. Free trial!",
  features: [
    { iconName: "Heart", title: "Culturally Aware AI", desc: "Solutions that respect Indian traditions, family values, joint family dynamics, and modern social challenges." },
    { iconName: "Languages", title: "12 Indian Languages", desc: "Converse in Hindi, Hinglish, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, or English." },
    { iconName: "Sparkles", title: "Deeply Empathetic", desc: "We don't just give answers; we understand the emotional weight of your struggles and provide compassionate guidance." },
    { iconName: "Users", title: "Community Spirit", desc: "Join a growing family of Indians solving problems together. Refer friends and earn free months of premium access." },
  ],
  useCases: [
    { label: "Joint Family Conflicts", emoji: "👨‍👩‍👧‍👦" }, { label: "Career & Job Changes", emoji: "💼" },
    { label: "Marriage & Relationships", emoji: "💑" }, { label: "Parenting Challenges", emoji: "👶" },
    { label: "In-Law Dynamics", emoji: "🏠" }, { label: "Financial Planning", emoji: "💰" },
    { label: "Education & Studies", emoji: "📚" }, { label: "Mental Wellness", emoji: "🧘" },
    { label: "Social Situations", emoji: "🤝" },
  ],
  testimonials: [
    { name: "Priya S.", city: "Mumbai", text: "BharatSolve helped me navigate a difficult conversation with my in-laws about career choices. The advice was culturally sensitive and practical.", rating: 5 },
    { name: "Rahul K.", city: "Delhi", text: "Finally an AI that understands the nuances of Indian family life. The Hinglish support makes it feel like talking to a wise friend.", rating: 5 },
    { name: "Lakshmi R.", city: "Chennai", text: "Tamil support is excellent! I can express my feelings naturally. The AI gave me a step-by-step plan for my career transition.", rating: 5 },
  ],
  faq: [
    { q: "What is Your Best Friend AI 🇮🇳?", a: "Your Best Friend AI 🇮🇳 is an AI-powered platform that helps Indians solve real-life challenges including family dynamics, career growth, relationships, and social situations. It provides culturally aware, empathetic solutions that understand Indian values and traditions." },
    { q: "Which languages does Your Best Friend AI 🇮🇳 support?", a: "Your Best Friend AI 🇮🇳 supports 12 Indian languages: Hindi, Hinglish, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Odia." },
    { q: "How much does Your Best Friend AI 🇮🇳 cost?", a: "Start with a free 1-month trial — no credit card required. After the trial, the subscription is just ₹499/month. Earn free months through our referral program." },
    { q: "Is my data private and secure?", a: "Absolutely. We have a strict zero-share policy — your personal data and conversations are NEVER sold, shared, or disclosed to any third party. All data is encrypted in transit and at rest. When AI generates solutions, only your problem text is sent — never your name, email, or identity. Other users cannot see your data. You can request complete deletion of your account and all data at any time. We comply with India's DPDP Act 2023 and international privacy regulations." },
    { q: "Can Your Best Friend AI 🇮🇳 help with family problems?", a: "Yes! It's specially designed for Indian family dynamics — joint families, in-law relationships, marriage concerns, parenting challenges, and elder care." },
    { q: "How is this different from ChatGPT?", a: "Unlike generic AI, Your Best Friend AI 🇮🇳 is deeply tuned for Indian cultural context — joint family dynamics, workplace culture, regional social norms." },
  ],
  culturalAIContext: "You are an empathetic Indian expert problem solver. Understand the cultural nuances, family dynamics, and social context of India. Provide clear, actionable, and emotionally resonant solutions that respect Indian values while being modern and practical.",
};

// ---------------------------------------------------------------------------
// SINGAPORE
// ---------------------------------------------------------------------------
const SINGAPORE_CONFIG: LocaleConfig = {
  code: "SG",
  countryName: "Singapore",
  appName: "Your Best Friend AI 🇸🇬",
  flagEmoji: "🇸🇬",
  domain: "solvesg.ai",
  htmlLang: "en",
  ogLocale: "en_SG",
  currency: "S$",
  currencyCode: "SGD",
  monthlyPrice: 15,
  formattedPrice: "S$15",
  defaultLanguage: "english",
  languages: {
    english: { key: "english", label: "English", nativeLabel: "English", greeting: "Hello" },
    mandarin: { key: "mandarin", label: "Mandarin", nativeLabel: "中文", greeting: "你好" },
    malay: { key: "malay", label: "Malay", nativeLabel: "Bahasa Melayu", greeting: "Selamat" },
    tamil: { key: "tamil", label: "Tamil", nativeLabel: "தமிழ்", greeting: "வணக்கம்" },
    singlish: { key: "singlish", label: "Singlish", nativeLabel: "Singlish", greeting: "Eh hello lah" },
  },
  theme: {
    primary: "0 100% 42%", primaryDark: "0 100% 35%",
    secondary: "180 40% 40%", secondaryDark: "180 40% 30%",
    accent: "220 70% 50%", accentDark: "220 70% 40%",
    ring: "0 100% 42%", ringDark: "0 100% 35%",
    gradientFrom: "from-red-600", gradientVia: "via-white", gradientTo: "to-red-600",
    gradientFromDark: "dark:from-red-400", gradientViaDark: "dark:via-white", gradientToDark: "dark:to-red-400",
    themeColor: "#EE2536",
  },
  cities: ["Orchard", "Marina Bay", "Jurong", "Tampines", "Ang Mo Kio", "Woodlands", "Sentosa", "Bugis"],
  promotion: { title: "Ace PSLE & O-Levels with AI", description: "Personalized study plans, exam strategies, and tuition support for Singapore national exams.", gradientFrom: "from-red-600", gradientTo: "to-rose-700", accentColor: "bg-white/30" },
  referralFamilyName: "SolveSG community",
  tagline: "Solve Life's Challenges With Singapore Smarts & AI",
  heroTitle: "Solve Life's Challenges",
  heroHighlight: "With Singapore Smarts & AI",
  heroDescription: "From HDB living to career progression in Singapore's fast-paced landscape. Get solutions that understand your multicultural context — in English, Mandarin, Malay, Tamil, and Singlish. Start your free 1-month trial today.",
  heroTrustBadge: "Trusted by 5,000+ Singaporeans across the island",
  socialProofText: "Trusted by users across Singapore",
  ctaTitle: "Ready to solve the impossible?",
  ctaDescription: "Join 5,000+ Singaporeans who are solving problems smarter, faster, and better — with AI that understands Singapore.",
  ctaFooter: "1-month free trial included. No commitment.",
  footerTagline: "AI-powered problem solving for Singaporeans. Culturally aware, empathetic, and multilingual.",
  footerCopyright: "Made with ❤️ in Singapore 🇸🇬",
  dashboardGreeting: (name) => `Hello, ${name}`,
  dashboardSubtitle: "Share your concerns or challenges. We understand your Singapore context.",
  problemDialogTitle: "Ask Your Best Friend AI 🇸🇬",
  problemDialogDescription: "Share your concerns—whether it's work-life balance, housing, family, or career. Our AI understands Singapore's multicultural society.",
  titlePlaceholder: "e.g., How to manage work-life balance with long commute?",
  descriptionPlaceholder: "Share the full picture. We're listening...",
  shareTitle: "Your Best Friend AI 🇸🇬 — Solve Life's Challenges With Singapore Smarts & AI",
  shareDescription: "Get AI solutions that understand Singapore's multicultural context. Free trial!",
  features: [
    { iconName: "Heart", title: "Culturally Aware AI", desc: "Solutions that understand Singapore's multicultural society — Chinese, Malay, Indian, and Eurasian perspectives." },
    { iconName: "Languages", title: "5 Languages + Singlish", desc: "Converse in English, Mandarin, Malay, Tamil, or even Singlish. Express yourself naturally." },
    { iconName: "Sparkles", title: "Deeply Empathetic", desc: "We understand the pressures of Singapore life — from kiasu culture to housing worries. Get compassionate, practical guidance." },
    { iconName: "Users", title: "Community Spirit", desc: "Join a growing community of Singaporeans solving problems together. Refer friends and earn free months." },
  ],
  useCases: [
    { label: "Work-Life Balance", emoji: "⚖️" }, { label: "Career & Job Market", emoji: "💼" },
    { label: "Housing & HDB Issues", emoji: "🏠" }, { label: "Family Relationships", emoji: "👨‍👩‍👧‍👦" },
    { label: "Education & Tuition", emoji: "📚" }, { label: "Financial Planning", emoji: "💰" },
    { label: "Marriage & Dating", emoji: "💑" }, { label: "Mental Wellness", emoji: "🧘" },
    { label: "Eldercare & Aging Parents", emoji: "👴" },
  ],
  testimonials: [
    { name: "Wei Lin T.", city: "Jurong", text: "SolveSG helped me negotiate a better work arrangement with my boss. The advice understood Singapore's work culture perfectly.", rating: 5 },
    { name: "Aisha B.", city: "Tampines", text: "Finally an AI that gets the multicultural dynamics of Singapore families. The Malay support is a nice touch!", rating: 5 },
    { name: "Raj M.", city: "Ang Mo Kio", text: "Got practical advice on BTO application strategy and managing expectations with in-laws. Very Singapore-specific!", rating: 5 },
  ],
  faq: [
    { q: "What is Your Best Friend AI 🇸🇬?", a: "Your Best Friend AI 🇸🇬 is an AI-powered platform that helps Singaporeans solve real-life challenges including work-life balance, housing, career growth, and multicultural family dynamics." },
    { q: "Which languages does Your Best Friend AI 🇸🇬 support?", a: "English, Mandarin, Malay, Tamil, and Singlish. Converse naturally in your preferred language." },
    { q: "How much does Your Best Friend AI 🇸🇬 cost?", a: "Free 1-month trial, then S$15/month. Earn free months through referrals." },
    { q: "Is my data private and secure?", a: "Absolutely. We have a strict zero-share policy — your personal data and conversations are NEVER sold, shared, or disclosed to any third party. All data is encrypted in transit and at rest. When AI generates solutions, only your problem text is sent — never your name, email, or identity. We comply with Singapore's PDPA and international privacy regulations. You can request complete deletion at any time." },
    { q: "Can Your Best Friend AI 🇸🇬 help with HDB and housing issues?", a: "Yes! It understands BTO applications, resale flat decisions, renovation planning, and neighbour relations." },
    { q: "How is this different from ChatGPT?", a: "Your Best Friend AI 🇸🇬 is tuned for Singapore's context — multicultural dynamics, local work culture, HDB living, and Singaporean values." },
  ],
  culturalAIContext: "You are an empathetic Singaporean expert problem solver. Understand the multicultural nuances, work-life balance pressures, HDB living dynamics, and social context of Singapore. Provide clear, actionable solutions that respect Singapore's diverse cultural values (Chinese, Malay, Indian, Eurasian) while being modern and practical. Understand kiasu culture, COE concerns, BTO processes, and the unique challenges of living in a small but dynamic city-state.",
};

// ---------------------------------------------------------------------------
// HONG KONG
// ---------------------------------------------------------------------------
const HONG_KONG_CONFIG: LocaleConfig = {
  code: "HK",
  countryName: "Hong Kong",
  appName: "Your Best Friend AI 🇭🇰",
  flagEmoji: "🇭🇰",
  domain: "solvehk.ai",
  htmlLang: "en",
  ogLocale: "en_HK",
  currency: "HK$",
  currencyCode: "HKD",
  monthlyPrice: 99,
  formattedPrice: "HK$99",
  defaultLanguage: "english",
  languages: {
    english: { key: "english", label: "English", nativeLabel: "English", greeting: "Hello" },
    cantonese: { key: "cantonese", label: "Cantonese", nativeLabel: "廣東話", greeting: "你好" },
    mandarin: { key: "mandarin", label: "Mandarin", nativeLabel: "普通話", greeting: "你好" },
  },
  theme: {
    primary: "0 80% 50%", primaryDark: "0 80% 42%",
    secondary: "45 90% 50%", secondaryDark: "45 90% 40%",
    accent: "210 80% 45%", accentDark: "210 80% 35%",
    ring: "0 80% 50%", ringDark: "0 80% 42%",
    gradientFrom: "from-red-500", gradientVia: "via-yellow-400", gradientTo: "to-red-600",
    gradientFromDark: "dark:from-red-400", gradientViaDark: "dark:via-yellow-300", gradientToDark: "dark:to-red-500",
    themeColor: "#DE2910",
  },
  cities: ["Central", "Tsim Sha Tsui", "Wan Chai", "Mong Kok", "Causeway Bay", "Sha Tin", "Tuen Mun", "Tai Po"],
  promotion: { title: "Ace HKDSE with AI", description: "Personalized study plans and exam strategies for the Hong Kong Diploma of Secondary Education.", gradientFrom: "from-red-700", gradientTo: "to-amber-600", accentColor: "bg-yellow-500/30" },
  referralFamilyName: "SolveHK community",
  tagline: "Solve Life's Challenges With Hong Kong Grit & AI",
  heroTitle: "Solve Life's Challenges",
  heroHighlight: "With Hong Kong Grit & AI",
  heroDescription: "From housing pressures to career growth in Hong Kong's dynamic landscape. Get solutions that understand your bilingual context — in English, Cantonese, and Mandarin. Start your free 1-month trial today.",
  heroTrustBadge: "Trusted by 3,000+ Hong Kongers across the city",
  socialProofText: "Trusted by users across Hong Kong",
  ctaTitle: "Ready to solve the impossible?",
  ctaDescription: "Join 3,000+ Hong Kongers who are solving problems smarter, faster, and better — with AI that understands Hong Kong.",
  ctaFooter: "1-month free trial included. No commitment.",
  footerTagline: "AI-powered problem solving for Hong Kongers. Culturally aware, empathetic, and bilingual.",
  footerCopyright: "Made with ❤️ in Hong Kong 🇭🇰",
  dashboardGreeting: (name) => `Hello, ${name}`,
  dashboardSubtitle: "Share your concerns or challenges. We understand the Hong Kong hustle.",
  problemDialogTitle: "Ask Your Best Friend AI 🇭🇰",
  problemDialogDescription: "Share your concerns—whether it's housing, career, family, or daily life. Our AI understands Hong Kong's unique challenges.",
  titlePlaceholder: "e.g., How to manage tiny flat living with extended family?",
  descriptionPlaceholder: "Share the full picture. We're listening...",
  shareTitle: "Your Best Friend AI 🇭🇰 — Solve Life's Challenges With Hong Kong Grit & AI",
  shareDescription: "Get AI solutions that understand Hong Kong's unique challenges. Free trial!",
  features: [
    { iconName: "Heart", title: "Culturally Aware AI", desc: "Solutions that understand Hong Kong's bilingual society, family expectations, and fast-paced lifestyle." },
    { iconName: "Languages", title: "English, Cantonese & Mandarin", desc: "Converse in English, Cantonese, or Mandarin. Express yourself naturally." },
    { iconName: "Sparkles", title: "Deeply Empathetic", desc: "We understand the pressures of Hong Kong life — from sky-high rents to work stress. Get compassionate, practical guidance." },
    { iconName: "Users", title: "Community Spirit", desc: "Join a growing community of Hong Kongers solving problems together. Refer friends and earn free months." },
  ],
  useCases: [
    { label: "Housing & Tiny Flat Living", emoji: "🏠" }, { label: "Career & Job Market", emoji: "💼" },
    { label: "Work-Life Balance", emoji: "⚖️" }, { label: "Family Expectations", emoji: "👨‍👩‍👧‍👦" },
    { label: "Financial Planning", emoji: "💰" }, { label: "Relationships & Dating", emoji: "💑" },
    { label: "Education Pressure", emoji: "📚" }, { label: "Mental Wellness", emoji: "🧘" },
    { label: "Domestic Helper Relations", emoji: "🤝" },
  ],
  testimonials: [
    { name: "Jason L.", city: "Central", text: "SolveHK helped me figure out how to have the tough conversation with my parents about moving out. Very practical advice!", rating: 5 },
    { name: "Mei Ling C.", city: "Sha Tin", text: "The Cantonese support is amazing! I can express my feelings naturally. Got great advice on balancing work and elder care.", rating: 5 },
    { name: "David W.", city: "Wan Chai", text: "Finally an AI that understands the unique pressures of living in Hong Kong — housing, work hours, family expectations.", rating: 5 },
  ],
  faq: [
    { q: "What is Your Best Friend AI 🇭🇰?", a: "An AI platform that helps Hong Kongers solve real-life challenges including housing pressures, career growth, relationships, and family dynamics." },
    { q: "Which languages does Your Best Friend AI 🇭🇰 support?", a: "English, Cantonese, and Mandarin." },
    { q: "How much does Your Best Friend AI 🇭🇰 cost?", a: "Free 1-month trial, then HK$99/month. Earn free months through referrals." },
    { q: "Is my data private and secure?", a: "Absolutely. We have a strict zero-share policy — your personal data and conversations are NEVER sold, shared, or disclosed to any third party. All data is encrypted in transit and at rest. When AI generates solutions, only your problem text is sent — never your name, email, or identity. We comply with Hong Kong's PDPO and international privacy regulations. You can request complete deletion at any time." },
    { q: "Can Your Best Friend AI 🇭🇰 help with housing issues?", a: "Yes! Tiny flat living, subdivided units, landlord issues, and rent-vs-buy decisions." },
    { q: "How is this different from ChatGPT?", a: "Your Best Friend AI 🇭🇰 is tuned for Hong Kong — bilingual dynamics, local work culture, housing pressures, and HK values." },
  ],
  culturalAIContext: "You are an empathetic Hong Kong expert problem solver. Understand the cultural nuances, bilingual (Cantonese/English) dynamics, housing pressures, and social context of Hong Kong. Provide clear, actionable solutions that respect Hong Kong's values — family piety, hard work, pragmatism — while being modern and practical. Understand high-density living, long work hours, domestic helper dynamics, and the fast-paced Hong Kong lifestyle.",
};

// ---------------------------------------------------------------------------
// JAPAN
// ---------------------------------------------------------------------------
const JAPAN_CONFIG: LocaleConfig = {
  code: "JP",
  countryName: "Japan",
  appName: "Your Best Friend AI 🇯🇵",
  flagEmoji: "🇯🇵",
  domain: "solvejp.ai",
  htmlLang: "ja",
  ogLocale: "ja_JP",
  currency: "¥",
  currencyCode: "JPY",
  monthlyPrice: 1500,
  formattedPrice: "¥1,500",
  defaultLanguage: "japanese",
  languages: {
    japanese: { key: "japanese", label: "Japanese", nativeLabel: "日本語", greeting: "こんにちは" },
    english: { key: "english", label: "English", nativeLabel: "English", greeting: "Hello" },
  },
  theme: {
    primary: "0 70% 50%", primaryDark: "0 70% 40%",
    secondary: "220 50% 50%", secondaryDark: "220 50% 40%",
    accent: "340 60% 55%", accentDark: "340 60% 45%",
    ring: "0 70% 50%", ringDark: "0 70% 40%",
    gradientFrom: "from-red-500", gradientVia: "via-white", gradientTo: "to-rose-500",
    gradientFromDark: "dark:from-red-400", gradientViaDark: "dark:via-white", gradientToDark: "dark:to-rose-400",
    themeColor: "#BC002D",
  },
  cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya", "Fukuoka", "Sapporo", "Kobe"],
  promotion: { title: "Ace University Entrance Exams with AI", description: "Personalized study strategies for Common Test, private university exams, and career preparation.", gradientFrom: "from-red-600", gradientTo: "to-rose-700", accentColor: "bg-pink-300/30" },
  referralFamilyName: "SolveJP community",
  tagline: "Solve Life's Challenges With Japanese Wisdom & AI",
  heroTitle: "Solve Life's Challenges",
  heroHighlight: "With Japanese Wisdom & AI",
  heroDescription: "From workplace dynamics to family expectations in modern Japan. Get solutions that understand gaman, tatemae, and the art of harmony — in Japanese and English. Start your free 1-month trial today.",
  heroTrustBadge: "Trusted by 5,000+ users across Japan",
  socialProofText: "Trusted by users across Japan",
  ctaTitle: "Ready to solve the impossible?",
  ctaDescription: "Join 5,000+ users solving problems smarter with AI that truly understands Japan.",
  ctaFooter: "1-month free trial. No commitment.",
  footerTagline: "AI-powered problem solving for Japan. Culturally aware, empathetic, and bilingual.",
  footerCopyright: "Made with ❤️ in Japan 🇯🇵",
  dashboardGreeting: (name) => `こんにちは、${name}さん`,
  dashboardSubtitle: "Your concerns matter. Share what's on your mind — we understand Japanese context.",
  problemDialogTitle: "Ask Your Best Friend AI 🇯🇵",
  problemDialogDescription: "Share your concerns — workplace pressures, family matters, or personal growth. Our AI understands Japanese culture and social norms.",
  titlePlaceholder: "e.g., How to handle overtime pressure without damaging relationships?",
  descriptionPlaceholder: "Share your situation in detail. We listen without judgment...",
  shareTitle: "Your Best Friend AI 🇯🇵 — Solve Life's Challenges With Japanese Wisdom & AI",
  shareDescription: "AI solutions that understand Japanese culture and social norms. Free trial!",
  features: [
    { iconName: "Heart", title: "Culturally Aware AI", desc: "Understands Japanese social norms — tatemae/honne balance, workplace hierarchy, and family expectations." },
    { iconName: "Languages", title: "Japanese & English", desc: "Express yourself naturally in Japanese or English. Full native script support." },
    { iconName: "Sparkles", title: "Deeply Empathetic", desc: "We understand the pressures of Japanese society — work culture, social obligations, and maintaining wa (harmony)." },
    { iconName: "Users", title: "Community Spirit", desc: "Join a growing community solving problems together. Refer friends and earn free months." },
  ],
  useCases: [
    { label: "Workplace Pressure & Overtime", emoji: "💼" }, { label: "Career Changes & Job Hunting", emoji: "📋" },
    { label: "Family & Marriage", emoji: "👨‍👩‍👧‍👦" }, { label: "Parenting & Education", emoji: "👶" },
    { label: "Social Obligations", emoji: "🤝" }, { label: "Financial Planning", emoji: "💰" },
    { label: "Mental Wellness", emoji: "🧘" }, { label: "Dating & Relationships", emoji: "💑" },
    { label: "Aging Parents & Eldercare", emoji: "👴" },
  ],
  testimonials: [
    { name: "Yuki T.", city: "Tokyo", text: "SolveJP understood the complexity of telling my boss I need to change departments. The advice respected Japanese workplace etiquette.", rating: 5 },
    { name: "Kenji M.", city: "Osaka", text: "Got practical advice on navigating my parents' expectations about marriage. Very culturally aware.", rating: 5 },
    { name: "Sakura H.", city: "Kyoto", text: "Finally an AI that understands Japanese subtlety. The Japanese language support is natural and respectful.", rating: 5 },
  ],
  faq: [
    { q: "What is Your Best Friend AI 🇯🇵?", a: "An AI platform helping people in Japan solve life challenges — workplace dynamics, family expectations, relationships — with culturally aware solutions." },
    { q: "Which languages are supported?", a: "Japanese (日本語) and English." },
    { q: "How much does it cost?", a: "Free 1-month trial, then ¥1,500/month. Earn free months through referrals." },
    { q: "Is my data private?", a: "Yes. We have a strict zero-share policy — your data is NEVER sold, shared, or disclosed to any third party. All data is encrypted. When AI generates solutions, only your problem text is sent — never your name, email, or identity. We comply with Japan's APPI and international privacy regulations. You can request complete deletion at any time." },
    { q: "Can it help with workplace issues?", a: "Absolutely. It understands Japanese work culture, hierarchy, overtime pressure, and the art of communicating within those norms." },
    { q: "How is this different from ChatGPT?", a: "Your Best Friend AI 🇯🇵 is tuned for Japanese cultural context — understanding honne/tatemae, workplace hierarchy, and social harmony." },
  ],
  culturalAIContext: "You are an empathetic Japanese expert problem solver. Understand the cultural nuances of Japan: tatemae vs honne, workplace hierarchy (senpai/kohai), social harmony (wa), family obligations, and the pressures of modern Japanese society. Provide clear, actionable, and respectful solutions that balance traditional values with modern practicality. Understand overwork culture, social pressure around marriage and career, aging society challenges, and the importance of maintaining face.",
};

// ---------------------------------------------------------------------------
// CHINA
// ---------------------------------------------------------------------------
const CHINA_CONFIG: LocaleConfig = {
  code: "CN",
  countryName: "China",
  appName: "Your Best Friend AI 🇨🇳",
  flagEmoji: "🇨🇳",
  domain: "solvecn.ai",
  htmlLang: "zh",
  ogLocale: "zh_CN",
  currency: "¥",
  currencyCode: "CNY",
  monthlyPrice: 49,
  formattedPrice: "¥49",
  defaultLanguage: "mandarin_simplified",
  languages: {
    mandarin_simplified: { key: "mandarin_simplified", label: "Mandarin (Simplified)", nativeLabel: "简体中文", greeting: "你好" },
    english: { key: "english", label: "English", nativeLabel: "English", greeting: "Hello" },
  },
  theme: {
    primary: "0 85% 50%", primaryDark: "0 85% 40%",
    secondary: "45 85% 50%", secondaryDark: "45 85% 40%",
    accent: "210 70% 50%", accentDark: "210 70% 40%",
    ring: "0 85% 50%", ringDark: "0 85% 40%",
    gradientFrom: "from-red-600", gradientVia: "via-yellow-500", gradientTo: "to-red-700",
    gradientFromDark: "dark:from-red-500", gradientViaDark: "dark:via-yellow-400", gradientToDark: "dark:to-red-600",
    themeColor: "#DE2910",
  },
  cities: ["Beijing", "Shanghai", "Shenzhen", "Guangzhou", "Chengdu", "Hangzhou", "Wuhan", "Nanjing"],
  promotion: { title: "Ace Gaokao with AI", description: "Personalized study plans and strategies for China's National College Entrance Examination.", gradientFrom: "from-red-700", gradientTo: "to-yellow-600", accentColor: "bg-yellow-400/30" },
  referralFamilyName: "SolveCN community",
  tagline: "Solve Life's Challenges With Chinese Wisdom & AI",
  heroTitle: "Solve Life's Challenges",
  heroHighlight: "With Chinese Wisdom & AI",
  heroDescription: "From career competition to family expectations in modern China. Get solutions that understand guanxi, filial piety, and balancing tradition with progress — in Simplified Chinese and English. Free 1-month trial.",
  heroTrustBadge: "Trusted by 10,000+ users across China",
  socialProofText: "Trusted by users across major Chinese cities",
  ctaTitle: "Ready to solve the impossible?",
  ctaDescription: "Join 10,000+ users solving problems smarter with AI that understands China.",
  ctaFooter: "1-month free trial. No commitment.",
  footerTagline: "AI-powered problem solving for China. Culturally aware, empathetic, and bilingual.",
  footerCopyright: "Made with ❤️ in China 🇨🇳",
  dashboardGreeting: (name) => `你好，${name}`,
  dashboardSubtitle: "Share what's on your mind. We understand the Chinese context.",
  problemDialogTitle: "Ask Your Best Friend AI 🇨🇳",
  problemDialogDescription: "Share your concerns — career, family, education, or personal growth. Our AI understands Chinese culture.",
  titlePlaceholder: "e.g., How to balance parents' expectations with my career choices?",
  descriptionPlaceholder: "Share your situation in detail...",
  shareTitle: "Your Best Friend AI 🇨🇳 — Solve Life's Challenges With Chinese Wisdom & AI",
  shareDescription: "AI solutions that understand Chinese culture. Free trial!",
  features: [
    { iconName: "Heart", title: "Culturally Aware AI", desc: "Understands guanxi, face culture, filial piety, and the pressures of modern Chinese society." },
    { iconName: "Languages", title: "Simplified Chinese & English", desc: "Express yourself in 简体中文 or English. Full native support." },
    { iconName: "Sparkles", title: "Deeply Empathetic", desc: "We understand 996 culture, housing pressures, marriage expectations, and educational competition." },
    { iconName: "Users", title: "Community Spirit", desc: "Join a growing community solving problems together. Refer friends and earn free months." },
  ],
  useCases: [
    { label: "Career & 996 Pressure", emoji: "💼" }, { label: "Housing & Property", emoji: "🏠" },
    { label: "Family Expectations", emoji: "👨‍👩‍👧‍👦" }, { label: "Marriage Pressure", emoji: "💑" },
    { label: "Education & Gaokao", emoji: "📚" }, { label: "Financial Planning", emoji: "💰" },
    { label: "Parenting", emoji: "👶" }, { label: "Mental Wellness", emoji: "🧘" },
    { label: "Eldercare & Filial Piety", emoji: "👴" },
  ],
  testimonials: [
    { name: "Wei L.", city: "Beijing", text: "SolveCN helped me navigate the conversation with my parents about not wanting to follow their career path. Very culturally sensitive.", rating: 5 },
    { name: "Xiao M.", city: "Shanghai", text: "Got practical advice on work-life balance in a 996 environment. The AI truly understands Chinese work culture.", rating: 5 },
    { name: "Jing W.", city: "Shenzhen", text: "The Simplified Chinese support is perfect. Helped me plan my approach to a difficult family discussion about marriage.", rating: 5 },
  ],
  faq: [
    { q: "What is Your Best Friend AI 🇨🇳?", a: "An AI platform that helps people in China solve life's challenges — career pressure, family expectations, relationships — with culturally aware solutions." },
    { q: "Which languages are supported?", a: "Simplified Chinese (简体中文) and English." },
    { q: "How much does it cost?", a: "Free 1-month trial, then ¥49/month." },
    { q: "Is my data private?", a: "Yes. We have a strict zero-share policy — your data is NEVER sold, shared, or disclosed to any third party. All data is encrypted. When AI generates solutions, only your problem text is sent — never your name, email, or identity. We comply with China's PIPL and international privacy regulations. You can request complete deletion at any time." },
    { q: "Can it help with career pressure?", a: "Absolutely — including 996 culture, job competition, and career transitions." },
    { q: "How is this different from ChatGPT?", a: "Your Best Friend AI 🇨🇳 is tuned for Chinese cultural context — guanxi, face culture, family obligations, and work pressures." },
  ],
  culturalAIContext: "You are an empathetic Chinese expert problem solver. Understand the cultural nuances of China: guanxi (relationships), mianzi (face), filial piety, 996 work culture, housing pressures, educational competition (gaokao), and marriage expectations. Provide clear, actionable solutions that balance traditional Chinese values with modern aspirations. Understand the pressures of rapid social change, generational differences, and urban vs rural dynamics.",
};

// ---------------------------------------------------------------------------
// UNITED STATES
// ---------------------------------------------------------------------------
const US_CONFIG: LocaleConfig = {
  code: "US",
  countryName: "United States",
  appName: "Your Best Friend AI 🇺🇸",
  flagEmoji: "🇺🇸",
  domain: "solveus.ai",
  htmlLang: "en",
  ogLocale: "en_US",
  currency: "$",
  currencyCode: "USD",
  monthlyPrice: 10,
  formattedPrice: "$10",
  defaultLanguage: "english",
  languages: {
    english: { key: "english", label: "English", nativeLabel: "English", greeting: "Hello" },
    spanish: { key: "spanish", label: "Spanish", nativeLabel: "Español", greeting: "Hola" },
  },
  theme: {
    primary: "220 80% 45%", primaryDark: "220 80% 35%",
    secondary: "0 75% 50%", secondaryDark: "0 75% 40%",
    accent: "210 60% 50%", accentDark: "210 60% 40%",
    ring: "220 80% 45%", ringDark: "220 80% 35%",
    gradientFrom: "from-blue-600", gradientVia: "via-white", gradientTo: "to-red-500",
    gradientFromDark: "dark:from-blue-400", gradientViaDark: "dark:via-white", gradientToDark: "dark:to-red-400",
    themeColor: "#3B5998",
  },
  cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "San Francisco", "Seattle", "Miami"],
  promotion: { title: "Ace SAT & College Apps with AI", description: "Personalized test prep, essay reviews, and college application strategies.", gradientFrom: "from-blue-700", gradientTo: "to-indigo-600", accentColor: "bg-red-400/30" },
  referralFamilyName: "SolveUS community",
  tagline: "Solve Life's Challenges With Smart AI",
  heroTitle: "Solve Life's Challenges",
  heroHighlight: "With Smart, Empathetic AI",
  heroDescription: "From career pivots to family dynamics in the American landscape. Get solutions that understand diverse cultural backgrounds, work-life balance, and the pursuit of happiness. In English and Spanish. Start your free 1-month trial.",
  heroTrustBadge: "Trusted by 15,000+ Americans across all 50 states",
  socialProofText: "Trusted by users across the United States",
  ctaTitle: "Ready to solve the impossible?",
  ctaDescription: "Join 15,000+ Americans solving problems smarter with culturally-aware AI.",
  ctaFooter: "1-month free trial. No credit card required.",
  footerTagline: "AI-powered problem solving for Americans. Culturally diverse, empathetic, and bilingual.",
  footerCopyright: "Made with ❤️ in the USA 🇺🇸",
  dashboardGreeting: (name) => `Hey ${name}!`,
  dashboardSubtitle: "What's on your mind? Let's work through it together.",
  problemDialogTitle: "Ask Your Best Friend AI 🇺🇸",
  problemDialogDescription: "Share your concerns — career, family, finances, or personal growth. Our AI understands the American experience.",
  titlePlaceholder: "e.g., How to negotiate a raise in a tough economy?",
  descriptionPlaceholder: "Share the full story. We're here to help...",
  shareTitle: "Your Best Friend AI 🇺🇸 — Solve Life's Challenges With Smart AI",
  shareDescription: "Get AI solutions that understand the American experience. Free trial!",
  features: [
    { iconName: "Heart", title: "Culturally Diverse AI", desc: "Understands America's diverse cultural landscape — immigrant families, blended households, and regional differences." },
    { iconName: "Languages", title: "English & Spanish", desc: "Communicate in English or Spanish. Get solutions that speak your language." },
    { iconName: "Sparkles", title: "Deeply Empathetic", desc: "We understand American challenges — student debt, healthcare decisions, career pivots, and the pursuit of balance." },
    { iconName: "Users", title: "Community Spirit", desc: "Join a growing community solving problems together. Refer friends and earn free months." },
  ],
  useCases: [
    { label: "Career & Job Market", emoji: "💼" }, { label: "Student Debt & Finances", emoji: "💰" },
    { label: "Family Dynamics", emoji: "👨‍👩‍👧‍👦" }, { label: "Healthcare Decisions", emoji: "🏥" },
    { label: "Work-Life Balance", emoji: "⚖️" }, { label: "Relationships & Dating", emoji: "💑" },
    { label: "Education & College", emoji: "📚" }, { label: "Mental Wellness", emoji: "🧘" },
    { label: "Immigration & Identity", emoji: "🌍" },
  ],
  testimonials: [
    { name: "Sarah M.", city: "New York", text: "SolveUS helped me plan my career pivot from corporate to freelancing. The financial planning advice was spot-on.", rating: 5 },
    { name: "Carlos R.", city: "Miami", text: "The Spanish support is excellent! Finally an AI that understands the nuances of being bicultural in America.", rating: 5 },
    { name: "Jennifer L.", city: "San Francisco", text: "Got great advice on navigating co-parenting dynamics. The AI was empathetic and non-judgmental.", rating: 5 },
  ],
  faq: [
    { q: "What is Your Best Friend AI 🇺🇸?", a: "An AI platform that helps Americans solve real-life challenges — career, family, finances, relationships — with culturally aware solutions." },
    { q: "Which languages are supported?", a: "English and Spanish." },
    { q: "How much does it cost?", a: "Free 1-month trial, then $10/month." },
    { q: "Is my data private?", a: "Yes. We have a strict zero-share policy — your data is NEVER sold, shared, or disclosed to any third party. All data is encrypted. When AI generates solutions, only your problem text is sent — never your name, email, or identity. We comply with US state privacy laws (CCPA, etc.) and international privacy regulations. You can request complete deletion at any time." },
    { q: "Can it help with financial planning?", a: "Yes — student debt strategies, budgeting, retirement planning, and healthcare decisions." },
    { q: "How is this different from ChatGPT?", a: "Your Best Friend AI 🇺🇸 provides culturally-aware advice tuned for the American experience — diverse backgrounds, regional differences, and local norms." },
  ],
  culturalAIContext: "You are an empathetic American expert problem solver. Understand the cultural diversity, work ethic, and social dynamics of the United States. Provide clear, actionable solutions that respect diverse backgrounds — immigrant families, blended households, regional cultures. Understand student debt, healthcare system complexity, career mobility, the gig economy, and the pursuit of work-life balance in a fast-paced society.",
};

// ---------------------------------------------------------------------------
// UNITED KINGDOM
// ---------------------------------------------------------------------------
const UK_CONFIG: LocaleConfig = {
  code: "GB",
  countryName: "United Kingdom",
  appName: "Your Best Friend AI 🇬🇧",
  flagEmoji: "🇬🇧",
  domain: "solveuk.ai",
  htmlLang: "en",
  ogLocale: "en_GB",
  currency: "£",
  currencyCode: "GBP",
  monthlyPrice: 8,
  formattedPrice: "£8",
  defaultLanguage: "english",
  languages: {
    english: { key: "english", label: "English", nativeLabel: "English", greeting: "Hello" },
  },
  theme: {
    primary: "220 75% 45%", primaryDark: "220 75% 35%",
    secondary: "0 80% 45%", secondaryDark: "0 80% 35%",
    accent: "45 80% 50%", accentDark: "45 80% 40%",
    ring: "220 75% 45%", ringDark: "220 75% 35%",
    gradientFrom: "from-blue-700", gradientVia: "via-white", gradientTo: "to-red-600",
    gradientFromDark: "dark:from-blue-500", gradientViaDark: "dark:via-white", gradientToDark: "dark:to-red-400",
    themeColor: "#003078",
  },
  cities: ["London", "Manchester", "Birmingham", "Edinburgh", "Glasgow", "Bristol", "Leeds", "Liverpool"],
  promotion: { title: "Ace GCSEs & A-Levels with AI", description: "Personalized revision plans and exam strategies for UK qualifications.", gradientFrom: "from-blue-800", gradientTo: "to-red-600", accentColor: "bg-white/30" },
  referralFamilyName: "SolveUK community",
  tagline: "Solve Life's Challenges With British Wit & AI",
  heroTitle: "Solve Life's Challenges",
  heroHighlight: "With British Insight & AI",
  heroDescription: "From the cost of living to career growth across the UK. Get solutions that understand British social norms, workplace culture, and family dynamics. Start your free 1-month trial today.",
  heroTrustBadge: "Trusted by 8,000+ users across the UK",
  socialProofText: "Trusted by users across the United Kingdom",
  ctaTitle: "Ready to solve the impossible?",
  ctaDescription: "Join 8,000+ users solving problems with AI that gets British culture.",
  ctaFooter: "1-month free trial. No commitment.",
  footerTagline: "AI-powered problem solving for the UK. Culturally aware, empathetic, and practical.",
  footerCopyright: "Made with ❤️ in the UK 🇬🇧",
  dashboardGreeting: (name) => `Hello, ${name}`,
  dashboardSubtitle: "What's troubling you? Let's sort it out together.",
  problemDialogTitle: "Ask Your Best Friend AI 🇬🇧",
  problemDialogDescription: "Share your concerns — career, family, housing, or personal matters. Our AI understands British culture.",
  titlePlaceholder: "e.g., How to handle a difficult colleague at work?",
  descriptionPlaceholder: "Share the full picture. We're here to help...",
  shareTitle: "Your Best Friend AI 🇬🇧 — Solve Life's Challenges With British Insight & AI",
  shareDescription: "AI solutions that understand British culture and social norms. Free trial!",
  features: [
    { iconName: "Heart", title: "Culturally Aware AI", desc: "Understands British social norms, class dynamics, NHS complexities, and multicultural UK life." },
    { iconName: "Languages", title: "British English", desc: "Proper British English — no awkward Americanisms. Understands regional nuances." },
    { iconName: "Sparkles", title: "Deeply Empathetic", desc: "We understand UK challenges — cost of living, housing crisis, career pressures, and the stiff upper lip." },
    { iconName: "Users", title: "Community Spirit", desc: "Join a growing community solving problems together. Refer friends and earn free months." },
  ],
  useCases: [
    { label: "Cost of Living & Housing", emoji: "🏠" }, { label: "Career & Workplace", emoji: "💼" },
    { label: "NHS & Healthcare", emoji: "🏥" }, { label: "Family Dynamics", emoji: "👨‍👩‍👧‍👦" },
    { label: "Education & University", emoji: "📚" }, { label: "Financial Planning", emoji: "💰" },
    { label: "Relationships & Dating", emoji: "💑" }, { label: "Mental Wellness", emoji: "🧘" },
    { label: "Immigration & Visa", emoji: "🌍" },
  ],
  testimonials: [
    { name: "James P.", city: "London", text: "SolveUK helped me navigate a tricky redundancy situation. The advice on UK employment rights was spot-on.", rating: 5 },
    { name: "Fatima K.", city: "Birmingham", text: "Brilliant advice on balancing cultural expectations with modern British life. Very understanding.", rating: 5 },
    { name: "Ewan M.", city: "Edinburgh", text: "Got practical advice on the property ladder and budgeting. The AI actually understands UK finances.", rating: 5 },
  ],
  faq: [
    { q: "What is Your Best Friend AI 🇬🇧?", a: "An AI platform helping UK residents solve life challenges — work, housing, family, finances — with culturally aware solutions." },
    { q: "How much does it cost?", a: "Free 1-month trial, then £8/month." },
    { q: "Is my data private?", a: "Yes. We have a strict zero-share policy — your data is NEVER sold, shared, or disclosed to any third party. All data is encrypted in transit and at rest. When AI generates solutions, only your problem text is sent — never your name, email, or identity. Fully GDPR compliant with data minimisation, purpose limitation, and your right to deletion and portability." },
    { q: "Can it help with housing issues?", a: "Yes — renting, buying, council housing, and navigating the UK property market." },
    { q: "Does it understand NHS?", a: "Yes. It can help with navigating NHS services, private healthcare decisions, and mental health support." },
    { q: "How is this different from ChatGPT?", a: "Your Best Friend AI 🇬🇧 is tuned for British culture — workplace etiquette, housing market, NHS, and social norms." },
  ],
  culturalAIContext: "You are an empathetic British expert problem solver. Understand UK cultural nuances: class awareness, workplace etiquette, the NHS, housing crisis, multicultural Britain, and regional differences (England, Scotland, Wales, Northern Ireland). Provide clear, actionable solutions with British sensibility — practical, understated, but warm. Understand cost of living pressures, employment rights, and the balance between tradition and modern life.",
};

// ---------------------------------------------------------------------------
// SOUTH KOREA
// ---------------------------------------------------------------------------
const KOREA_CONFIG: LocaleConfig = {
  code: "KR",
  countryName: "South Korea",
  appName: "Your Best Friend AI 🇰🇷",
  flagEmoji: "🇰🇷",
  domain: "solvekr.ai",
  htmlLang: "ko",
  ogLocale: "ko_KR",
  currency: "₩",
  currencyCode: "KRW",
  monthlyPrice: 13000,
  formattedPrice: "₩13,000",
  defaultLanguage: "korean",
  languages: {
    korean: { key: "korean", label: "Korean", nativeLabel: "한국어", greeting: "안녕하세요" },
    english: { key: "english", label: "English", nativeLabel: "English", greeting: "Hello" },
  },
  theme: {
    primary: "210 80% 45%", primaryDark: "210 80% 35%",
    secondary: "0 75% 50%", secondaryDark: "0 75% 40%",
    accent: "350 60% 50%", accentDark: "350 60% 40%",
    ring: "210 80% 45%", ringDark: "210 80% 35%",
    gradientFrom: "from-blue-600", gradientVia: "via-white", gradientTo: "to-red-500",
    gradientFromDark: "dark:from-blue-400", gradientViaDark: "dark:via-white", gradientToDark: "dark:to-red-400",
    themeColor: "#003478",
  },
  cities: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Jeju", "Suwon"],
  promotion: { title: "Ace CSAT (수능) with AI", description: "Personalized study strategies for Korea's College Scholastic Ability Test.", gradientFrom: "from-blue-700", gradientTo: "to-red-600", accentColor: "bg-white/30" },
  referralFamilyName: "SolveKR community",
  tagline: "Solve Life's Challenges With Korean Wisdom & AI",
  heroTitle: "Solve Life's Challenges",
  heroHighlight: "With Korean Wisdom & AI",
  heroDescription: "From 직장 (workplace) stress to family expectations in modern Korea. Get solutions that understand nunchi, jeong, and the pressures of Korean society — in Korean and English. Free 1-month trial.",
  heroTrustBadge: "Trusted by 5,000+ users across South Korea",
  socialProofText: "Trusted by users across South Korea",
  ctaTitle: "Ready to solve the impossible?",
  ctaDescription: "Join 5,000+ users solving problems with AI that understands Korea.",
  ctaFooter: "1-month free trial. No commitment.",
  footerTagline: "AI-powered problem solving for South Korea. Culturally aware, empathetic, and bilingual.",
  footerCopyright: "Made with ❤️ in South Korea 🇰🇷",
  dashboardGreeting: (name) => `안녕하세요, ${name}님`,
  dashboardSubtitle: "What's on your mind? We understand Korean context and culture.",
  problemDialogTitle: "Ask Your Best Friend AI 🇰🇷",
  problemDialogDescription: "Share your concerns — workplace stress, family pressure, relationships, or personal growth. Our AI understands Korean culture.",
  titlePlaceholder: "e.g., How to handle 직장 workplace hierarchy pressure?",
  descriptionPlaceholder: "Share your situation in detail...",
  shareTitle: "Your Best Friend AI 🇰🇷 — Solve Life's Challenges With Korean Wisdom & AI",
  shareDescription: "AI solutions that understand Korean culture and social norms. Free trial!",
  features: [
    { iconName: "Heart", title: "Culturally Aware AI", desc: "Understands nunchi, jeong, age hierarchy, and the pressures of modern Korean society." },
    { iconName: "Languages", title: "Korean & English", desc: "Express yourself in 한국어 or English. Full native support with proper honorifics." },
    { iconName: "Sparkles", title: "Deeply Empathetic", desc: "We understand Korean pressures — work culture, educational competition, beauty standards, and family expectations." },
    { iconName: "Users", title: "Community Spirit", desc: "Join a growing community solving problems together. Refer friends and earn free months." },
  ],
  useCases: [
    { label: "Workplace & Hierarchy", emoji: "💼" }, { label: "Education & Exam Pressure", emoji: "📚" },
    { label: "Family Expectations", emoji: "👨‍👩‍👧‍👦" }, { label: "Dating & Marriage Pressure", emoji: "💑" },
    { label: "Housing & Jeonse", emoji: "🏠" }, { label: "Financial Planning", emoji: "💰" },
    { label: "Mental Wellness", emoji: "🧘" }, { label: "Military Service Concerns", emoji: "🎖️" },
    { label: "Social Pressure & Image", emoji: "🤝" },
  ],
  testimonials: [
    { name: "Min-jun K.", city: "Seoul", text: "SolveKR understood the nuances of navigating my company's hierarchy. The advice respected Korean workplace culture perfectly.", rating: 5 },
    { name: "Soo-yeon P.", city: "Busan", text: "Got advice on handling family pressure about marriage. The AI understands Korean family dynamics deeply.", rating: 5 },
    { name: "Jae-won L.", city: "Incheon", text: "The Korean language support feels natural. Great advice on jeonse vs monthly rent decisions.", rating: 5 },
  ],
  faq: [
    { q: "What is Your Best Friend AI 🇰🇷?", a: "An AI platform helping Koreans solve life challenges — workplace stress, family expectations, relationships — with culturally aware solutions." },
    { q: "Which languages are supported?", a: "Korean (한국어) and English." },
    { q: "How much does it cost?", a: "Free 1-month trial, then ₩13,000/month." },
    { q: "Is my data private?", a: "Yes. We have a strict zero-share policy — your data is NEVER sold, shared, or disclosed to any third party. All data is encrypted. When AI generates solutions, only your problem text is sent — never your name, email, or identity. We comply with Korea's PIPA and international privacy regulations. You can request complete deletion at any time." },
    { q: "Can it help with workplace issues?", a: "Absolutely — age hierarchy, overtime culture, career changes, and office dynamics." },
    { q: "How is this different from ChatGPT?", a: "Your Best Friend AI 🇰🇷 is tuned for Korean cultural context — nunchi, jeong, hierarchy, and societal pressure." },
  ],
  culturalAIContext: "You are an empathetic Korean expert problem solver. Understand Korean cultural nuances: nunchi (social awareness), jeong (deep affection), age-based hierarchy, workplace culture (회식, 직장), educational pressure (수능), family expectations, and the pressures of modern Korean society. Provide clear, actionable solutions using appropriate honorifics and respect for social hierarchy while being modern and practical.",
};

// ---------------------------------------------------------------------------
// UAE
// ---------------------------------------------------------------------------
const UAE_CONFIG: LocaleConfig = {
  code: "AE",
  countryName: "UAE",
  appName: "Your Best Friend AI 🇦🇪",
  flagEmoji: "🇦🇪",
  domain: "solveuae.ai",
  htmlLang: "en",
  ogLocale: "en_AE",
  currency: "AED",
  currencyCode: "AED",
  monthlyPrice: 39,
  formattedPrice: "AED 39",
  defaultLanguage: "english",
  languages: {
    english: { key: "english", label: "English", nativeLabel: "English", greeting: "Hello" },
    arabic: { key: "arabic", label: "Arabic", nativeLabel: "العربية", greeting: "مرحبا" },
  },
  theme: {
    primary: "145 70% 35%", primaryDark: "145 70% 25%",
    secondary: "0 75% 50%", secondaryDark: "0 75% 40%",
    accent: "210 60% 45%", accentDark: "210 60% 35%",
    ring: "145 70% 35%", ringDark: "145 70% 25%",
    gradientFrom: "from-green-600", gradientVia: "via-white", gradientTo: "to-red-500",
    gradientFromDark: "dark:from-green-500", gradientViaDark: "dark:via-white", gradientToDark: "dark:to-red-400",
    themeColor: "#00732F",
  },
  cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Al Ain", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"],
  promotion: { title: "Advance Your UAE Career with AI", description: "Career strategies, business setup guidance, and professional development for the UAE market.", gradientFrom: "from-green-700", gradientTo: "to-emerald-600", accentColor: "bg-yellow-400/30" },
  referralFamilyName: "SolveUAE community",
  tagline: "Solve Life's Challenges With UAE Wisdom & AI",
  heroTitle: "Solve Life's Challenges",
  heroHighlight: "With UAE-Smart AI",
  heroDescription: "From expat life to career growth in the UAE's dynamic landscape. Get solutions that understand the multicultural expat experience, local customs, and business culture — in English and Arabic. Free 1-month trial.",
  heroTrustBadge: "Trusted by 5,000+ residents across the UAE",
  socialProofText: "Trusted by users across the UAE",
  ctaTitle: "Ready to solve the impossible?",
  ctaDescription: "Join 5,000+ UAE residents solving problems with culturally-aware AI.",
  ctaFooter: "1-month free trial. No commitment.",
  footerTagline: "AI-powered problem solving for UAE residents. Multicultural, empathetic, and bilingual.",
  footerCopyright: "Made with ❤️ in the UAE 🇦🇪",
  dashboardGreeting: (name) => `Welcome, ${name}`,
  dashboardSubtitle: "Share your concerns. We understand the UAE context — expat and local alike.",
  problemDialogTitle: "Ask Your Best Friend AI 🇦🇪",
  problemDialogDescription: "Share your concerns — career, family, finances, or daily life. Our AI understands the UAE's unique multicultural environment.",
  titlePlaceholder: "e.g., How to navigate visa sponsorship while changing jobs?",
  descriptionPlaceholder: "Share the full picture. We're here to help...",
  shareTitle: "Your Best Friend AI 🇦🇪 — Solve Life's Challenges With UAE-Smart AI",
  shareDescription: "AI solutions for the UAE's multicultural lifestyle. Free trial!",
  features: [
    { iconName: "Heart", title: "Culturally Aware AI", desc: "Understands UAE's multicultural society — Emirati traditions, expat challenges, and the blend of modern and traditional." },
    { iconName: "Languages", title: "English & Arabic", desc: "Communicate in English or Arabic. Get solutions that respect local customs." },
    { iconName: "Sparkles", title: "Deeply Empathetic", desc: "We understand UAE life — visa concerns, cultural adaptation, business etiquette, and family dynamics." },
    { iconName: "Users", title: "Community Spirit", desc: "Join a growing community solving problems together. Refer friends and earn free months." },
  ],
  useCases: [
    { label: "Expat Life & Adaptation", emoji: "🌍" }, { label: "Career & Business Setup", emoji: "💼" },
    { label: "Visa & Legal Concerns", emoji: "📋" }, { label: "Family & Relationships", emoji: "👨‍👩‍👧‍👦" },
    { label: "Financial Planning", emoji: "💰" }, { label: "Housing & Rent", emoji: "🏠" },
    { label: "Education & Schools", emoji: "📚" }, { label: "Cultural Adaptation", emoji: "🤝" },
    { label: "Mental Wellness", emoji: "🧘" },
  ],
  testimonials: [
    { name: "Ahmed K.", city: "Dubai", text: "SolveUAE helped me navigate changing jobs without losing my visa status. Very practical UAE-specific advice!", rating: 5 },
    { name: "Priya N.", city: "Abu Dhabi", text: "As an expat, navigating local customs was challenging. The AI gave culturally sensitive and respectful guidance.", rating: 5 },
    { name: "Mark S.", city: "Sharjah", text: "Got great advice on business setup in the free zone. The AI understands UAE's business landscape perfectly.", rating: 5 },
  ],
  faq: [
    { q: "What is Your Best Friend AI 🇦🇪?", a: "An AI platform that helps UAE residents — both locals and expats — solve life challenges with culturally aware solutions." },
    { q: "Which languages are supported?", a: "English and Arabic." },
    { q: "How much does it cost?", a: "Free 1-month trial, then AED 39/month." },
    { q: "Is my data private?", a: "Yes. We have a strict zero-share policy — your data is NEVER sold, shared, or disclosed to any third party. All data is encrypted. When AI generates solutions, only your problem text is sent — never your name, email, or identity. We comply with UAE Federal Decree-Law No. 45 and international privacy regulations. You can request complete deletion at any time." },
    { q: "Can it help with visa issues?", a: "Yes — job changes, sponsorship, family visa, and residency questions." },
    { q: "How is this different from ChatGPT?", a: "Your Best Friend AI 🇦🇪 is tuned for UAE context — expat life, Emirati customs, business culture, and visa complexities." },
  ],
  culturalAIContext: "You are an empathetic UAE expert problem solver. Understand the multicultural dynamics of the UAE — Emirati traditions, expat challenges, Islamic customs, business culture, and the unique blend of over 200 nationalities. Provide solutions that respect local customs and Emirati values while being practical for the diverse expat community. Understand visa/sponsorship systems, free zone business, housing market dynamics, and cultural adaptation challenges.",
};

// ---------------------------------------------------------------------------
// AUSTRALIA
// ---------------------------------------------------------------------------
const AUSTRALIA_CONFIG: LocaleConfig = {
  code: "AU",
  countryName: "Australia",
  appName: "Your Best Friend AI 🇦🇺",
  flagEmoji: "🇦🇺",
  domain: "solveau.ai",
  htmlLang: "en",
  ogLocale: "en_AU",
  currency: "A$",
  currencyCode: "AUD",
  monthlyPrice: 15,
  formattedPrice: "A$15",
  defaultLanguage: "english",
  languages: {
    english: { key: "english", label: "English", nativeLabel: "English", greeting: "G'day" },
  },
  theme: {
    primary: "220 70% 45%", primaryDark: "220 70% 35%",
    secondary: "145 60% 40%", secondaryDark: "145 60% 30%",
    accent: "45 80% 50%", accentDark: "45 80% 40%",
    ring: "220 70% 45%", ringDark: "220 70% 35%",
    gradientFrom: "from-blue-600", gradientVia: "via-white", gradientTo: "to-green-500",
    gradientFromDark: "dark:from-blue-500", gradientViaDark: "dark:via-white", gradientToDark: "dark:to-green-400",
    themeColor: "#00008B",
  },
  cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Hobart"],
  promotion: { title: "Ace ATAR with AI", description: "Personalized study plans and exam strategies for the Australian Tertiary Admission Rank.", gradientFrom: "from-blue-700", gradientTo: "to-green-600", accentColor: "bg-yellow-400/30" },
  referralFamilyName: "SolveAU community",
  tagline: "Solve Life's Challenges With Aussie Smarts & AI",
  heroTitle: "Solve Life's Challenges",
  heroHighlight: "With Aussie Smarts & AI",
  heroDescription: "From property prices to work-life balance in the Australian way. Get solutions that understand the laid-back yet ambitious Aussie spirit. Start your free 1-month trial today.",
  heroTrustBadge: "Trusted by 5,000+ Aussies across every state",
  socialProofText: "Trusted by users across Australia",
  ctaTitle: "Ready to solve the impossible?",
  ctaDescription: "Join 5,000+ Australians solving problems with AI that gets the Aussie way.",
  ctaFooter: "1-month free trial. No worries, mate.",
  footerTagline: "AI-powered problem solving for Australians. Fair dinkum advice, empathetic and practical.",
  footerCopyright: "Made with ❤️ in Australia 🇦🇺",
  dashboardGreeting: (name) => `G'day, ${name}!`,
  dashboardSubtitle: "What's going on? Let's work through it together, no worries.",
  problemDialogTitle: "Ask Your Best Friend AI 🇦🇺",
  problemDialogDescription: "Share your concerns — career, housing, family, or personal. Our AI understands the Australian context.",
  titlePlaceholder: "e.g., How to get on the property ladder in Sydney?",
  descriptionPlaceholder: "Share the full story. We're listening...",
  shareTitle: "Your Best Friend AI 🇦🇺 — Solve Life's Challenges With Aussie Smarts & AI",
  shareDescription: "AI solutions that understand the Australian lifestyle. Free trial!",
  features: [
    { iconName: "Heart", title: "Culturally Aware AI", desc: "Understands the Aussie way — multicultural society, tall poppy syndrome, and the balance of work and leisure." },
    { iconName: "Languages", title: "Australian English", desc: "No awkward translations — proper Aussie English with local slang understood." },
    { iconName: "Sparkles", title: "Deeply Empathetic", desc: "We understand Aussie challenges — property prices, bushfire recovery, immigration, and the tyranny of distance." },
    { iconName: "Users", title: "Community Spirit", desc: "Join a growing community of Aussies solving problems together. Refer mates and earn free months." },
  ],
  useCases: [
    { label: "Property & Housing", emoji: "🏠" }, { label: "Career & Job Market", emoji: "💼" },
    { label: "Work-Life Balance", emoji: "⚖️" }, { label: "Family Dynamics", emoji: "👨‍👩‍👧‍👦" },
    { label: "Immigration & Visa", emoji: "🌍" }, { label: "Financial Planning", emoji: "💰" },
    { label: "Education & University", emoji: "📚" }, { label: "Mental Wellness", emoji: "🧘" },
    { label: "Relationships & Dating", emoji: "💑" },
  ],
  testimonials: [
    { name: "Sarah T.", city: "Sydney", text: "SolveAU helped me figure out the property market without the usual agent spin. Straight-up, practical advice.", rating: 5 },
    { name: "Liam O.", city: "Melbourne", text: "Got great career advice that actually understood the Aussie job market. No generic American stuff.", rating: 5 },
    { name: "Priya D.", city: "Brisbane", text: "As a new migrant, the AI helped me understand Australian workplace culture. Really helpful!", rating: 5 },
  ],
  faq: [
    { q: "What is Your Best Friend AI 🇦🇺?", a: "An AI platform helping Australians solve life challenges — housing, career, family, finances — with culturally aware solutions." },
    { q: "How much does it cost?", a: "Free 1-month trial, then A$15/month." },
    { q: "Is my data private?", a: "Yes. We have a strict zero-share policy — your data is NEVER sold, shared, or disclosed to any third party. All data is encrypted. When AI generates solutions, only your problem text is sent — never your name, email, or identity. We comply with Australia's Privacy Act 1988 and international privacy regulations. You can request complete deletion at any time." },
    { q: "Can it help with housing?", a: "Yes — property market navigation, renting, buying, and regional differences." },
    { q: "Does it understand migration issues?", a: "Absolutely — visa pathways, settlement challenges, and cultural adaptation." },
    { q: "How is this different from ChatGPT?", a: "Your Best Friend AI 🇦🇺 is tuned for Australian context — housing market, workplace culture, healthcare system, and local norms." },
  ],
  culturalAIContext: "You are an empathetic Australian expert problem solver. Understand Australian cultural nuances: mateship, fair go, tall poppy syndrome, multicultural society, and the laid-back-yet-ambitious Aussie spirit. Provide clear, practical solutions in a straightforward manner. Understand property market challenges, Medicare system, work-life balance culture, immigration pathways, and the unique challenges of Australia's geography and climate.",
};

// ---------------------------------------------------------------------------
// GERMANY
// ---------------------------------------------------------------------------
const GERMANY_CONFIG: LocaleConfig = {
  code: "DE",
  countryName: "Germany",
  appName: "Your Best Friend AI 🇩🇪",
  flagEmoji: "🇩🇪",
  domain: "solvede.ai",
  htmlLang: "de",
  ogLocale: "de_DE",
  currency: "€",
  currencyCode: "EUR",
  monthlyPrice: 9,
  formattedPrice: "€9",
  defaultLanguage: "german",
  languages: {
    german: { key: "german", label: "German", nativeLabel: "Deutsch", greeting: "Hallo" },
    english: { key: "english", label: "English", nativeLabel: "English", greeting: "Hello" },
  },
  theme: {
    primary: "45 90% 48%", primaryDark: "45 90% 38%",
    secondary: "0 80% 45%", secondaryDark: "0 80% 35%",
    accent: "210 60% 45%", accentDark: "210 60% 35%",
    ring: "45 90% 48%", ringDark: "45 90% 38%",
    gradientFrom: "from-black", gradientVia: "via-red-600", gradientTo: "to-yellow-500",
    gradientFromDark: "dark:from-gray-200", gradientViaDark: "dark:via-red-500", gradientToDark: "dark:to-yellow-400",
    themeColor: "#FFCC00",
  },
  cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart", "Düsseldorf", "Leipzig"],
  promotion: { title: "Ace Abitur with AI", description: "Personalized study plans and exam strategies for Germany's university entrance qualification.", gradientFrom: "from-gray-900", gradientTo: "to-yellow-500", accentColor: "bg-red-500/30" },
  referralFamilyName: "SolveDE community",
  tagline: "Solve Life's Challenges With German Precision & AI",
  heroTitle: "Solve Life's Challenges",
  heroHighlight: "With German Precision & AI",
  heroDescription: "From Bürokratie to work-life balance in Germany. Get solutions that understand German efficiency, directness, and social systems — in Deutsch and English. Free 1-month trial.",
  heroTrustBadge: "Trusted by 5,000+ users across Germany",
  socialProofText: "Trusted by users across Germany",
  ctaTitle: "Ready to solve the impossible?",
  ctaDescription: "Join 5,000+ users solving problems with AI that understands German culture.",
  ctaFooter: "1-month free trial. No commitment.",
  footerTagline: "AI-powered problem solving for Germany. Culturally aware, precise, and bilingual.",
  footerCopyright: "Made with ❤️ in Germany 🇩🇪",
  dashboardGreeting: (name) => `Hallo, ${name}!`,
  dashboardSubtitle: "Share your concerns. We understand the German context.",
  problemDialogTitle: "Ask Your Best Friend AI 🇩🇪",
  problemDialogDescription: "Share your concerns — career, bureaucracy, family, or personal. Our AI understands German culture.",
  titlePlaceholder: "e.g., How to navigate Anmeldung and bureaucracy as a newcomer?",
  descriptionPlaceholder: "Share the full details. We're here to help...",
  shareTitle: "Your Best Friend AI 🇩🇪 — Solve Life's Challenges With German Precision & AI",
  shareDescription: "AI solutions that understand German culture and systems. Free trial!",
  features: [
    { iconName: "Heart", title: "Culturally Aware AI", desc: "Understands German directness, bureaucracy, work culture, and the balance of Ordnung and Gemütlichkeit." },
    { iconName: "Languages", title: "Deutsch & English", desc: "Express yourself in Deutsch or English. Full native support." },
    { iconName: "Sparkles", title: "Deeply Empathetic", desc: "We understand German life — Bürokratie, housing market, work-life balance, and social insurance complexity." },
    { iconName: "Users", title: "Community Spirit", desc: "Join a growing community solving problems together. Refer friends and earn free months." },
  ],
  useCases: [
    { label: "Bürokratie & Paperwork", emoji: "📋" }, { label: "Career & Workplace", emoji: "💼" },
    { label: "Housing & Rent", emoji: "🏠" }, { label: "Family & Relationships", emoji: "👨‍👩‍👧‍👦" },
    { label: "Education & Ausbildung", emoji: "📚" }, { label: "Financial & Insurance", emoji: "💰" },
    { label: "Integration & Language", emoji: "🌍" }, { label: "Mental Wellness", emoji: "🧘" },
    { label: "Work-Life Balance", emoji: "⚖️" },
  ],
  testimonials: [
    { name: "Thomas M.", city: "Berlin", text: "SolveDE helped me navigate the apartment search in Berlin. The advice on Schufa and Anschreiben was exactly right.", rating: 5 },
    { name: "Ayşe K.", city: "Munich", text: "As an immigrant, understanding German bureaucracy was overwhelming. The AI broke it down step by step.", rating: 5 },
    { name: "Stefan R.", city: "Hamburg", text: "Got practical career advice that understood German Arbeitskultur. Very direct and helpful — just like good German advice should be.", rating: 5 },
  ],
  faq: [
    { q: "What is Your Best Friend AI 🇩🇪?", a: "An AI platform helping people in Germany solve life challenges — bureaucracy, career, housing, family — with culturally aware solutions." },
    { q: "Which languages are supported?", a: "German (Deutsch) and English." },
    { q: "How much does it cost?", a: "Free 1-month trial, then €9/month." },
    { q: "Is my data private?", a: "Yes. We have a strict zero-share policy — your data is NEVER sold, shared, or disclosed to any third party. All data is encrypted in transit and at rest. When AI generates solutions, only your problem text is sent — never your name, email, or identity. Fully GDPR and BDSG compliant with data minimisation, purpose limitation, and your right to deletion and portability." },
    { q: "Can it help with bureaucracy?", a: "Yes — Anmeldung, tax forms, insurance, visa applications, and all the Formulare." },
    { q: "How is this different from ChatGPT?", a: "Your Best Friend AI 🇩🇪 is tuned for German context — bureaucratic processes, workplace culture, housing market, and social systems." },
  ],
  culturalAIContext: "You are an empathetic German expert problem solver. Understand German cultural nuances: directness, efficiency, Ordnung (order), Bürokratie (bureaucracy), Pünktlichkeit (punctuality), and the balance of work and Feierabend. Provide clear, structured, actionable solutions. Understand the housing market (Wohnungsmarkt), social insurance system, Ausbildung/university system, integration challenges, and the importance of rules and processes in German society.",
};

// ---------------------------------------------------------------------------
// BRAZIL
// ---------------------------------------------------------------------------
const BRAZIL_CONFIG: LocaleConfig = {
  code: "BR",
  countryName: "Brazil",
  appName: "Your Best Friend AI 🇧🇷",
  flagEmoji: "🇧🇷",
  domain: "solvebr.ai",
  htmlLang: "pt",
  ogLocale: "pt_BR",
  currency: "R$",
  currencyCode: "BRL",
  monthlyPrice: 29,
  formattedPrice: "R$29",
  defaultLanguage: "portuguese",
  languages: {
    portuguese: { key: "portuguese", label: "Portuguese", nativeLabel: "Português", greeting: "Olá" },
    english: { key: "english", label: "English", nativeLabel: "English", greeting: "Hello" },
  },
  theme: {
    primary: "145 70% 40%", primaryDark: "145 70% 30%",
    secondary: "50 90% 50%", secondaryDark: "50 90% 40%",
    accent: "215 80% 45%", accentDark: "215 80% 35%",
    ring: "145 70% 40%", ringDark: "145 70% 30%",
    gradientFrom: "from-green-600", gradientVia: "via-yellow-400", gradientTo: "to-blue-600",
    gradientFromDark: "dark:from-green-500", gradientViaDark: "dark:via-yellow-300", gradientToDark: "dark:to-blue-500",
    themeColor: "#009C3B",
  },
  cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Belo Horizonte", "Fortaleza", "Curitiba", "Recife"],
  promotion: { title: "Ace ENEM & Vestibular with AI", description: "Personalized study plans for Brazil's national college entrance exams.", gradientFrom: "from-green-700", gradientTo: "to-yellow-500", accentColor: "bg-blue-400/30" },
  referralFamilyName: "SolveBR community",
  tagline: "Solve Life's Challenges With Brazilian Spirit & AI",
  heroTitle: "Solve Life's Challenges",
  heroHighlight: "With Brazilian Spirit & AI",
  heroDescription: "From career challenges to family dynamics in the vibrant Brazilian landscape. Get solutions that understand jeitinho brasileiro, family bonds, and the warmth of Brazilian culture — in Portuguese and English. Free 1-month trial.",
  heroTrustBadge: "Trusted by 8,000+ Brazilians across the country",
  socialProofText: "Trusted by users across Brazil",
  ctaTitle: "Ready to solve the impossible?",
  ctaDescription: "Join 8,000+ Brazilians solving problems with AI that gets you.",
  ctaFooter: "1-month free trial. No commitment.",
  footerTagline: "AI-powered problem solving for Brazilians. Culturally aware, warm, and bilingual.",
  footerCopyright: "Made with ❤️ in Brazil 🇧🇷",
  dashboardGreeting: (name) => `Olá, ${name}!`,
  dashboardSubtitle: "What's going on? Share your concerns — we understand the Brazilian context.",
  problemDialogTitle: "Ask Your Best Friend AI 🇧🇷",
  problemDialogDescription: "Share your concerns — career, family, finances, or personal growth. Our AI understands Brazilian culture.",
  titlePlaceholder: "e.g., How to negotiate a salary increase in the current market?",
  descriptionPlaceholder: "Share the full story. We're listening with an open heart...",
  shareTitle: "Your Best Friend AI 🇧🇷 — Solve Life's Challenges With Brazilian Spirit & AI",
  shareDescription: "AI solutions that understand Brazilian culture and values. Free trial!",
  features: [
    { iconName: "Heart", title: "Culturally Aware AI", desc: "Understands jeitinho brasileiro, close family bonds, warmth, and the complexity of Brazilian social dynamics." },
    { iconName: "Languages", title: "Português & English", desc: "Express yourself in Portuguese or English. Full native support." },
    { iconName: "Sparkles", title: "Deeply Empathetic", desc: "We understand Brazilian challenges — economic pressures, education access, public services, and family expectations." },
    { iconName: "Users", title: "Community Spirit", desc: "Join a growing community solving problems together. Refer friends and earn free months." },
  ],
  useCases: [
    { label: "Career & Job Market", emoji: "💼" }, { label: "Education & ENEM", emoji: "📚" },
    { label: "Family Dynamics", emoji: "👨‍👩‍👧‍👦" }, { label: "Financial Planning", emoji: "💰" },
    { label: "Housing & Rent", emoji: "🏠" }, { label: "Relationships & Dating", emoji: "💑" },
    { label: "Health & SUS", emoji: "🏥" }, { label: "Mental Wellness", emoji: "🧘" },
    { label: "Entrepreneurship", emoji: "🚀" },
  ],
  testimonials: [
    { name: "Lucas S.", city: "São Paulo", text: "SolveBR understood the pressures of job hunting in SP. The advice on networking and CLT vs PJ was spot-on.", rating: 5 },
    { name: "Ana P.", city: "Rio de Janeiro", text: "Got great advice on family dynamics and setting boundaries — the AI truly understands Brazilian families.", rating: 5 },
    { name: "Rodrigo M.", city: "Belo Horizonte", text: "The Portuguese support is natural and warm. Helped me plan a career change with practical steps.", rating: 5 },
  ],
  faq: [
    { q: "What is Your Best Friend AI 🇧🇷?", a: "An AI platform helping Brazilians solve life challenges — career, family, finances, education — with culturally aware solutions." },
    { q: "Which languages are supported?", a: "Portuguese (Português) and English." },
    { q: "How much does it cost?", a: "Free 1-month trial, then R$29/month." },
    { q: "Is my data private?", a: "Yes. We have a strict zero-share policy — your data is NEVER sold, shared, or disclosed to any third party. All data is encrypted. When AI generates solutions, only your problem text is sent — never your name, email, or identity. Fully LGPD compliant with data minimisation, purpose limitation, and your right to deletion and portability." },
    { q: "Can it help with career issues?", a: "Yes — job market, CLT vs PJ, salary negotiation, and entrepreneurship." },
    { q: "How is this different from ChatGPT?", a: "Your Best Friend AI 🇧🇷 is tuned for Brazilian context — jeitinho, family culture, economic realities, and local social norms." },
  ],
  culturalAIContext: "You are an empathetic Brazilian expert problem solver. Understand Brazilian cultural nuances: jeitinho brasileiro, close family bonds, warmth (calor humano), saudade, and the resilience of Brazilian people. Provide clear, actionable solutions that respect Brazilian values while being practical. Understand the economic realities, CLT/PJ employment dynamics, SUS healthcare, ENEM/vestibular system, and the importance of personal relationships in Brazilian society.",
};

// ---------------------------------------------------------------------------
// EXPORTS & DETECTION
// ---------------------------------------------------------------------------

export const LOCALE_CONFIGS: Record<LocaleCode, LocaleConfig> = {
  IN: INDIA_CONFIG,
  SG: SINGAPORE_CONFIG,
  HK: HONG_KONG_CONFIG,
  JP: JAPAN_CONFIG,
  CN: CHINA_CONFIG,
  US: US_CONFIG,
  GB: UK_CONFIG,
  KR: KOREA_CONFIG,
  AE: UAE_CONFIG,
  AU: AUSTRALIA_CONFIG,
  DE: GERMANY_CONFIG,
  BR: BRAZIL_CONFIG,
};

export const DEFAULT_LOCALE: LocaleCode = "IN";

const TIMEZONE_MAP: Record<string, LocaleCode> = {
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN",
  "Asia/Singapore": "SG",
  "Asia/Hong_Kong": "HK",
  "Asia/Tokyo": "JP",
  "Asia/Shanghai": "CN", "Asia/Chongqing": "CN",
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US", "America/Los_Angeles": "US",
  "Europe/London": "GB",
  "Asia/Seoul": "KR",
  "Asia/Dubai": "AE",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU", "Australia/Perth": "AU",
  "Europe/Berlin": "DE", "Europe/Munich": "DE",
  "America/Sao_Paulo": "BR", "America/Rio_Branco": "BR",
};

export function detectLocaleFromTimezone(): LocaleCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    for (const [prefix, code] of Object.entries(TIMEZONE_MAP)) {
      if (tz.startsWith(prefix)) return code;
    }
  } catch {
    // Timezone detection failed
  }
  return DEFAULT_LOCALE;
}

const LANGUAGE_MAP: [RegExp, LocaleCode][] = [
  [/^ja/, "JP"],
  [/^ko/, "KR"],
  [/^zh-CN|^zh-Hans/, "CN"],
  [/^zh-HK|^zh-Hant-HK/, "HK"],
  [/^zh-SG/, "SG"],
  [/^ms-SG/, "SG"],
  [/^de/, "DE"],
  [/^pt-BR|^pt/, "BR"],
  [/^ar-AE|^ar/, "AE"],
  [/^en-AU/, "AU"],
  [/^en-GB/, "GB"],
  [/^en-US/, "US"],
  [/^hi|^ta|^te|^bn|^mr|^gu|^kn|^ml|^pa|^or/, "IN"],
];

export function detectLocaleFromLanguage(): LocaleCode | null {
  try {
    const lang = navigator.language || (navigator as any).userLanguage || "";
    for (const [pattern, code] of LANGUAGE_MAP) {
      if (pattern.test(lang)) return code;
    }
  } catch {
    // Language detection failed
  }
  return null;
}

export function getLocaleConfig(code: LocaleCode): LocaleConfig {
  return LOCALE_CONFIGS[code] || LOCALE_CONFIGS[DEFAULT_LOCALE];
}
