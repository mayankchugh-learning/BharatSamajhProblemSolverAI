import express, { type Express } from "express";
import fs from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { LOCALE_CONFIGS, DEFAULT_LOCALE, type LocaleConfig } from "@shared/locales";

const SOCIAL_CRAWLER_UA = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Discordbot|Googlebot|bingbot/i;

const BASE_URL = process.env.BASE_URL || "https://bharatsolve.ai";

function detectLocaleFromBaseUrl(): LocaleConfig {
  try {
    const host = new URL(BASE_URL).hostname;
    for (const config of Object.values(LOCALE_CONFIGS)) {
      if (config.domain === host) return config;
    }
  } catch {
    // Invalid URL, fall through to default
  }
  return LOCALE_CONFIGS[DEFAULT_LOCALE];
}

const localeConfig = detectLocaleFromBaseUrl();

interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
  canonicalPath: string;
}

function getPageMeta(urlPath: string): PageMeta {
  const appName = localeConfig.appName;
  const tagline = localeConfig.tagline;

  if (urlPath === "/" || urlPath === "") {
    return {
      title: `${appName} — ${tagline}`,
      description: localeConfig.heroDescription,
      ogImage: `${BASE_URL}/og-image.png`,
      canonicalPath: "/",
    };
  }

  return {
    title: `${appName} — ${tagline}`,
    description: localeConfig.footerTagline,
    ogImage: `${BASE_URL}/og-image.png`,
    canonicalPath: urlPath,
  };
}

function injectMetaTags(html: string, meta: PageMeta): string {
  const metaTags = `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <link rel="canonical" href="${BASE_URL}${meta.canonicalPath}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${BASE_URL}${meta.canonicalPath}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${meta.ogImage || ""}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="${localeConfig.appName}" />
    <meta property="og:locale" content="${localeConfig.ogLocale}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${meta.ogImage || ""}" />`;

  return html.replace("</head>", `${metaTags}\n  </head>`);
}

let cachedIndexHtml: string | null = null;

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexPath = path.resolve(distPath, "index.html");
  cachedIndexHtml = fs.readFileSync(indexPath, "utf-8");

  app.get("/robots.txt", (_req, res) => {
    const robotsTxt = `# ${localeConfig.appName} — robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /problems/

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl-delay for polite crawling
User-agent: Bingbot
Crawl-delay: 5
`;
    res.set("Content-Type", "text/plain");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(robotsTxt);
  });

  app.use(express.static(distPath));

  app.use("/{*path}", async (req, res) => {
    const userAgent = req.headers["user-agent"] || "";

    if (SOCIAL_CRAWLER_UA.test(userAgent)) {
      const html = cachedIndexHtml || await readFile(indexPath, "utf-8");
      const meta = getPageMeta(req.path);
      res.send(injectMetaTags(html, meta));
    } else {
      res.sendFile(indexPath);
    }
  });
}
