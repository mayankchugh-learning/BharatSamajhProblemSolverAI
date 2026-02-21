import { useEffect } from "react";

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

const BASE_TITLE = "BharatSolve AI";
const BASE_URL = "https://bharatsolve.ai";

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

    const fullTitle = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} — Solve Life's Challenges With Indian Wisdom & AI`;
    document.title = fullTitle;

    if (description) {
      setMetaTag("description", description);
    }

    if (noIndex) {
      setMetaTag("robots", "noindex, nofollow");
    } else {
      setMetaTag("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    }

    setCanonical(`${BASE_URL}${canonicalPath}`);

    setMetaTag("og:title", ogTitle || fullTitle, true);
    setMetaTag("og:description", ogDescription || description || "", true);
    setMetaTag("og:url", `${BASE_URL}${canonicalPath}`, true);
    setMetaTag("og:type", ogType, true);
    if (ogImage) {
      setMetaTag("og:image", ogImage, true);
    }

    setMetaTag("twitter:title", ogTitle || fullTitle);
    setMetaTag("twitter:description", ogDescription || description || "");
    if (ogImage) {
      setMetaTag("twitter:image", ogImage);
    }
  }, [options.title, options.description, options.canonicalPath]);
}
