import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { DEFAULT_CONTENT } from "./defaultContent";
import { PortfolioContentSchema, type PortfolioContent } from "./contentSchema";

const CACHE_KEY = "portfolio:content:cache";

interface ContentContextType {
  content: PortfolioContent;
  isLoading: boolean;
  source: "default" | "cache" | "network";
}

const ContentContext = createContext<ContentContextType>({
  content: DEFAULT_CONTENT,
  isLoading: true,
  source: "default",
});

function readCache(): PortfolioContent | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = PortfolioContentSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function writeCache(content: PortfolioContent): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch {
    // storage full or unavailable — cache is best-effort only
  }
}

interface ContentProviderProps {
  children: React.ReactNode;
  /** When set (preview mode), this content is used and no network fetch happens. */
  override?: PortfolioContent | null;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children, override }) => {
  const cached = React.useMemo(() => (override ? null : readCache()), [override]);

  const [content, setContent] = useState<PortfolioContent>(
    override ?? cached ?? DEFAULT_CONTENT
  );
  const [isLoading, setIsLoading] = useState(!override);
  const [source, setSource] = useState<"default" | "cache" | "network">(
    override ? "network" : cached ? "cache" : "default"
  );

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data?.content) {
        const parsed = PortfolioContentSchema.safeParse(data.content);
        if (parsed.success) {
          setContent(parsed.data);
          setSource("network");
          writeCache(parsed.data);
          return;
        }
      }
      // No published content in KV: fall back to defaults.
      if (!cached) {
        setContent(DEFAULT_CONTENT);
        setSource("default");
      }
    } catch {
      // Offline or endpoint missing: keep cache/defaults.
    } finally {
      setIsLoading(false);
    }
  }, [cached]);

  useEffect(() => {
    if (override) {
      setContent(override);
      setIsLoading(false);
      setSource("network");
      return;
    }
    let cancelled = false;
    const run = () => {
      if (!cancelled) void load();
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [override, load]);

  return (
    <ContentContext.Provider value={{ content, isLoading, source }}>
      {children}
    </ContentContext.Provider>
  );
};

export function useContent(): ContentContextType {
  return useContext(ContentContext);
}
