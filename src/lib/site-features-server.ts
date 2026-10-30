import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_SITE_FEATURES, normalizeSiteFeatures, type SiteFeatures } from "./features";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createPublicDb(): SupabaseClient | null {
  if (!supabaseUrl || !anonKey) return null;
  return createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function createPrivateDb(): SupabaseClient | null {
  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function readSiteFeatures(): Promise<{ features: SiteFeatures; available: boolean }> {
  // Server-only database client; API returns only the three public boolean flags.
  const db = createPrivateDb();
  if (!db) return { features: DEFAULT_SITE_FEATURES, available: false };
  try {
    const { data, error } = await db.from("site_feature_settings")
      .select("subscriptions_enabled,profile_tab_enabled,extra_registration_enabled")
      .eq("id", 1).single();
    if (error || !data) return { features: DEFAULT_SITE_FEATURES, available: false };
    return { features: normalizeSiteFeatures(data), available: true };
  } catch {
    return { features: DEFAULT_SITE_FEATURES, available: false };
  }
}
