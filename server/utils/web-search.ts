import { logger } from "./logger";

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface WebSearchResult {
  query: string;
  results: SearchResult[];
  searchPerformed: boolean;
}

async function searchBrave(query: string, apiKey: string): Promise<SearchResult[]> {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": apiKey,
    },
  });

  if (!response.ok) {
    logger.warn({ status: response.status, provider: "brave" }, "Web search Brave returned error");
    return [];
  }

  const data = await response.json();
  return (data.web?.results || []).slice(0, 5).map((r: any) => ({
    title: r.title || "",
    snippet: r.description || "",
    url: r.url || "",
  }));
}

async function searchSerper(query: string, apiKey: string): Promise<SearchResult[]> {
  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, num: 5 }),
  });

  if (!response.ok) {
    logger.warn({ status: response.status, provider: "serper" }, "Web search Serper returned error");
    return [];
  }

  const data = await response.json();
  return (data.organic || []).slice(0, 5).map((r: any) => ({
    title: r.title || "",
    snippet: r.snippet || "",
    url: r.link || "",
  }));
}

/**
 * Searches the web for information relevant to the user's problem.
 * Supports Brave Search (BRAVE_SEARCH_API_KEY) and Serper/Google (SERPER_API_KEY).
 * Gracefully returns empty results when no search provider is configured.
 */
export async function searchWeb(query: string): Promise<WebSearchResult> {
  const braveKey = process.env.BRAVE_SEARCH_API_KEY;
  const serperKey = process.env.SERPER_API_KEY;

  if (!braveKey && !serperKey) {
    return { query, results: [], searchPerformed: false };
  }

  try {
    let results: SearchResult[] = [];

    if (braveKey) {
      results = await searchBrave(query, braveKey);
    } else if (serperKey) {
      results = await searchSerper(query, serperKey);
    }

    return { query, results, searchPerformed: results.length > 0 };
  } catch (err) {
    logger.warn({ err }, "Web search failed");
    return { query, results: [], searchPerformed: false };
  }
}

/**
 * Builds a contextual search query from the problem details.
 */
export function buildSearchQuery(title: string, category: string, locale?: string): string {
  const categoryLabels: Record<string, string> = {
    education: "education",
    law: "law legal rights",
    health: "health medical",
    finance: "finance business money",
    career: "career employment job",
    family: "family relationships",
    technology: "technology IT software",
    government: "government public services policy",
    housing: "housing property real estate",
    mental_wellness: "mental health wellness",
    other: "",
  };

  const categoryTerm = categoryLabels[category] || "";
  const localeSuffix = locale ? ` ${locale}` : "";
  return `${title} ${categoryTerm}${localeSuffix}`.trim();
}

/**
 * Formats search results into a prompt section the LLM can use.
 */
export function formatSearchResultsForPrompt(searchResult: WebSearchResult): string {
  if (!searchResult.searchPerformed || searchResult.results.length === 0) {
    return "";
  }

  const formatted = searchResult.results
    .map(
      (r, i) => `[${i + 1}] ${r.title}\n${r.snippet}\nSource: ${r.url}`
    )
    .join("\n\n");

  return [
    "",
    "--- RELEVANT WEB SEARCH RESULTS ---",
    "The following are recent search results related to this problem.",
    "Use these to supplement your knowledge with up-to-date, accurate information.",
    "Cite sources when using specific facts or data from these results.",
    "",
    formatted,
    "--- END SEARCH RESULTS ---",
  ].join("\n");
}
