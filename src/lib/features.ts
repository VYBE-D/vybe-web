/** Defaults are intentionally OFF while a backend is unavailable.
 * This is UI configuration only; payment creation has its own server-side check.
 */
export type SiteFeatures = {
  subscriptions_enabled: boolean;
  profile_tab_enabled: boolean;
  extra_registration_enabled: boolean;
};

export type SiteFeatureKey = keyof SiteFeatures;

export const DEFAULT_SITE_FEATURES: SiteFeatures = {
  subscriptions_enabled: false,
  profile_tab_enabled: false,
  extra_registration_enabled: false,
};

export const SITE_FEATURE_KEYS = Object.keys(DEFAULT_SITE_FEATURES) as SiteFeatureKey[];

export function normalizeSiteFeatures(value: unknown): SiteFeatures {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    subscriptions_enabled: input.subscriptions_enabled === true,
    profile_tab_enabled: input.profile_tab_enabled === true,
    extra_registration_enabled: input.extra_registration_enabled === true,
  };
}
