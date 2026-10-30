"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSiteFeatures } from "../../../context/SiteFeaturesContext";

// The profile feature is hidden from navigation AND blocked for direct visits.
export default function ProfileFeatureLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { features, loading } = useSiteFeatures();
  useEffect(() => {
    if (!loading && !features.profile_tab_enabled) router.replace("/home");
  }, [features.profile_tab_enabled, loading, router]);

  if (loading || !features.profile_tab_enabled) return null;
  return <>{children}</>;
}
