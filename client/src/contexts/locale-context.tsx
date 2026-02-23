import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type LocaleCode,
  type LocaleConfig,
  LOCALE_CONFIGS,
  DEFAULT_LOCALE,
  getLocaleConfig,
  detectLocaleFromTimezone,
  detectLocaleFromLanguage,
} from "@shared/locales";

const STORAGE_KEY = "solveai-locale";

interface LocaleContextType {
  locale: LocaleCode;
  config: LocaleConfig;
  setLocale: (code: LocaleCode) => void;
  availableLocales: { code: LocaleCode; name: string; flagEmoji: string }[];
}

const LocaleContext = createContext<LocaleContextType | null>(null);

function resolveInitialLocale(): LocaleCode {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLocale = params.get("locale")?.toUpperCase() as LocaleCode;
    if (urlLocale && LOCALE_CONFIGS[urlLocale]) return urlLocale;
  } catch {
    // URL parsing failed
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY) as LocaleCode;
    if (stored && LOCALE_CONFIGS[stored]) return stored;
  } catch {
    // localStorage unavailable
  }

  const fromLang = detectLocaleFromLanguage();
  if (fromLang) return fromLang;

  return detectLocaleFromTimezone();
}

function setFavicon(flagEmoji: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${flagEmoji}</text></svg>`;
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  const links = document.querySelectorAll('link[rel="icon"]');
  links.forEach((link) => {
    (link as HTMLLinkElement).href = dataUrl;
  });
}

function applyTheme(config: LocaleConfig) {
  const root = document.documentElement;
  root.style.setProperty("--primary", config.theme.primary);
  root.style.setProperty("--secondary", config.theme.secondary);
  root.style.setProperty("--accent", config.theme.accent);
  root.style.setProperty("--ring", config.theme.ring);

  root.setAttribute("data-locale", config.code);

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", config.theme.themeColor);

  setFavicon(config.flagEmoji);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(resolveInitialLocale);
  const config = getLocaleConfig(locale);

  useEffect(() => {
    applyTheme(config);
  }, [config]);

  const setLocale = useCallback((code: LocaleCode) => {
    if (!LOCALE_CONFIGS[code]) return;
    setLocaleState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const availableLocales = Object.values(LOCALE_CONFIGS).map((c) => ({
    code: c.code,
    name: c.countryName,
    flagEmoji: c.flagEmoji,
  }));

  return (
    <LocaleContext.Provider value={{ locale, config, setLocale, availableLocales }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
