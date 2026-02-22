import { useEffect } from "react";
import { useLocale } from "@/contexts/locale-context";

interface DocumentHeadOptions {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

function setMetaTag(property: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let element = document.querySelector(`meta[${attr}="${property}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, property);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.href = href;
}

export function useDocumentHead(options: DocumentHeadOptions) {
  const { config } = useLocale();
  const baseTitle = config.appName;
  const baseUrl = `https://${config.domain}`;

  useEffect(() => {
    const {
      title,
      description,
      canonicalPath = "/",
      ogTitle,
      ogDescription,
      ogImage,
      ogType = "website",
      noIndex = false,
    } = options;

    const fullTitle = title ? `${title} | ${baseTitle}` : `${baseTitle} — ${config.tagline}`;
    document.title = fullTitle;

    if (description) {
      setMetaTag("description", description);
    }

    if (noIndex) {
      setMetaTag("robots", "noindex, nofollow");
    } else {
      setMetaTag("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    }

    setCanonical(`${baseUrl}${canonicalPath}`);

    setMetaTag("og:title", ogTitle || fullTitle, true);
    setMetaTag("og:description", ogDescription || description || "", true);
    setMetaTag("og:url", `${baseUrl}${canonicalPath}`, true);
    setMetaTag("og:type", ogType, true);
    setMetaTag("og:locale", config.ogLocale, true);
    if (ogImage) {
      setMetaTag("og:image", ogImage, true);
    }

    setMetaTag("twitter:title", ogTitle || fullTitle);
    setMetaTag("twitter:description", ogDescription || description || "");
    if (ogImage) {
      setMetaTag("twitter:image", ogImage);
    }
  }, [options.title, options.description, options.canonicalPath, options.ogTitle, options.ogDescription, options.ogImage, options.ogType, options.noIndex, config.code]);
}
