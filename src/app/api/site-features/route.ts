import { NextResponse } from "next/server";
import { SITE_FEATURE_KEYS, type SiteFeatureKey } from "../../../lib/features";
import { createPrivateDb, createPublicDb, readSiteFeatures } from "../../../lib/site-features-server";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  const result = await readSiteFeatures();
  return NextResponse.json(result, { headers: noStore });
}

export async function PATCH(request: Request) {
  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return NextResponse.json({ error: "Admin sign-in required" }, { status: 401, headers: noStore });

  const publicDb = createPublicDb();
  const privateDb = createPrivateDb();
  if (!publicDb || !privateDb) {
    return NextResponse.json({ error: "Backend credentials are unavailable. Cannot save site settings." }, { status: 503, headers: noStore });
  }

  // Verify a real Supabase session on the server, NOT a client-supplied admin flag.
  let auth;
  let authError;
  try {
    ({ data: auth, error: authError } = await publicDb.auth.getUser(token));
  } catch {
    return NextResponse.json({ error: "Authentication backend is unavailable." }, { status: 503, headers: noStore });
  }
  if (authError || !auth.user) {
    return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401, headers: noStore });
  }

  let profile;
  let roleError;
  try {
    ({ data: profile, error: roleError } = await privateDb.from("profiles")
      .select("role").eq("id", auth.user.id).single());
  } catch {
    return NextResponse.json({ error: "Admin authorization backend is unavailable." }, { status: 503, headers: noStore });
  }
  if (roleError || profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin permission required" }, { status: 403, headers: noStore });
  }

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: noStore }); }

  const input = body as { key?: unknown; enabled?: unknown } | null;
  const key = input?.key;
  const enabled = input?.enabled;
  if (typeof key !== "string" || !SITE_FEATURE_KEYS.includes(key as SiteFeatureKey) || typeof enabled !== "boolean") {
    return NextResponse.json({ error: "Expected a supported feature key and boolean enabled value" }, { status: 400, headers: noStore });
  }

  try {
    const { data, error } = await privateDb.from("site_feature_settings")
      .update({ [key]: enabled, updated_by: auth.user.id, updated_at: new Date().toISOString() })
      .eq("id", 1)
      .select("subscriptions_enabled,profile_tab_enabled,extra_registration_enabled")
      .single();
    if (error || !data) throw error || new Error("Site feature settings row not found");
    return NextResponse.json({ features: data, available: true }, { headers: noStore });
  } catch {
    return NextResponse.json({ error: "Could not save. Resume Supabase and apply the site feature migration." }, { status: 503, headers: noStore });
  }
}
