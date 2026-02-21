import express, { type Express } from "express";
import fs from "fs";
import path from "path";

const SOCIAL_CRAWLER_UA = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Discordbot|Googlebot|bingbot/i;

const BASE_URL = process.env.BASE_URL || "https://bharatsolve.ai";

interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
  canonicalPath: string;
}

function getPageMeta(urlPath: string): PageMeta {
  if (urlPath === "/" || urlPath === "") {
    return {
      title: "BharatSolve AI — Solve Life's Challenges With Indian Wisdom & AI",
      description:
        "Get empathetic, culturally-aware AI solutions for family, career & social challenges. Available in 12 Indian languages including Hindi, Tamil, Telugu & Bengali. Free 1-month trial.",
      ogImage: `${BASE_URL}/og-image.png`,
      canonicalPath: "/",
    };
  }

  return {
    title: "BharatSolve AI — Indian Wisdom & AI Problem Solver",
    description:
      "BharatSolve AI helps Indians solve real-life challenges using culturally aware AI in 12 Indian languages.",
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
    <meta property="og:site_name" content="BharatSolve AI" />
    <meta property="og:locale" content="en_IN" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${meta.ogImage || ""}" />`;

  return html.replace("</head>", `${metaTags}\n  </head>`);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use("/{*path}", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    const userAgent = req.headers["user-agent"] || "";

    if (SOCIAL_CRAWLER_UA.test(userAgent)) {
      const html = fs.readFileSync(indexPath, "utf-8");
      const meta = getPageMeta(req.path);
      res.send(injectMetaTags(html, meta));
    } else {
      res.sendFile(indexPath);
    }
  });
}
