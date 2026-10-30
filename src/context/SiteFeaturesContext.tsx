"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_SITE_FEATURES, normalizeSiteFeatures, type SiteFeatures } from "../lib/features";

type FeatureContextValue = {
  features: SiteFeatures;
  available: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  setFeaturesFromSave: (features: SiteFeatures) => void;
};

const SiteFeaturesContext = createContext<FeatureContextValue | null>(null);

export function SiteFeaturesProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<SiteFeatures>(DEFAULT_SITE_FEATURES);
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/site-features", { cache: "no-store" });
      if (!response.ok) throw new Error("Feature settings unavailable");
      const result = await response.json();
      setAvailable(result.available === true);
      setFeatures(normalizeSiteFeatures(result.features));
    } catch {
      // Fail closed: the website cannot sell memberships if settings cannot be verified.
      setFeatures(DEFAULT_SITE_FEATURES);
      setAvailable(false);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void refresh();
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    const poll = window.setInterval(() => void refresh(), 60_000);
    return () => { window.removeEventListener("focus", onFocus); window.clearInterval(poll); };
  }, [refresh]);

  const setFeaturesFromSave = useCallback((next: SiteFeatures) => {
    setFeatures(normalizeSiteFeatures(next));
    setAvailable(true);
  }, []);

  return <SiteFeaturesContext.Provider value={{ features, available, loading, refresh, setFeaturesFromSave }}>{children}</SiteFeaturesContext.Provider>;
}

export function useSiteFeatures(): FeatureContextValue {
  const context = useContext(SiteFeaturesContext);
  if (!context) throw new Error("useSiteFeatures must be inside SiteFeaturesProvider");
  return context;
}
