# VYBE – website feature controls

This is the **updated source-code copy** with reversible admin switches for membership sales, Profile tab, and extended registration steps. Existing product/store code is retained.

## Admin switches

Open `/admin` (while signed in as an admin) and use **Website controls**:

| Switch | OFF | ON |
| --- | --- | --- |
| **Subscriptions** | Hide upsells and reject new membership invoices server-side | Show membership upgrade pages and allow new membership invoices |
| **Profile tab** | Hide Profile from bottom navigation and redirect direct `/profile/*` visits to Home | Show the Profile tab and pages |
| **Extra registration pages** | Skip nickname, interests, consent and photo screens | Use the detailed registration flow |

**Always retained in registration:** account email/password, 18+ confirmation, and **I can host / Host me** selection. The database continues to store the hosting choice. The `host` and `travel` values are preserved for existing integrations. Existing profile records and payments are never deleted by these controls.

## Required once Supabase is resumed

1. Apply `supabase/migrations/20261029_site_feature_settings.sql` to the **existing production Supabase database**. It creates one persistent settings row with all switches OFF by default.
2. Confirm your Next.js server deployment has `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and **server-only** `SUPABASE_SERVICE_ROLE_KEY` configured. Do not prefix the service key with `NEXT_PUBLIC_` and never expose it to browser code.
3. Deploy this updated site, sign into `/admin` as a user with `profiles.role = 'admin'`, then change switches. The API verifies Supabase authentication and checks admin role on the server before every update. No client-side database writes are permitted.
4. `/api/site-features` dynamically serves the stored settings (`Cache-Control: no-store`). Existing visitors refresh their settings automatically (on focus or within about 60 seconds). Membership purchase requests also check the live database setting on the server.

**If Supabase remains paused:** Switches show OFF, are disabled and will explain that settings cannot be saved; the site fails closed for memberships. It is **not possible** to make a persistent shared live admin switch using only browser local storage on a paused backend. The `/admin` role check and products also require the backend to be online.

## Important limitations

- This setting blocks **new membership purchases**; it does **not** cancel any recurring billing arrangements already active at a payment provider. Pause renewals there separately if required.
- Disabling Profile affects this site's Profile UI, not existing profiles in Supabase or other profile display components elsewhere.
- If Supabase requires email verification, signup writes hosting preference to Supabase auth user metadata before email confirmation; a follow-up login/callback attempts to create a missing profile. When detailed registration is enabled and verification is required, new photo files cannot be stored until the user has authenticated. Photo completion should be implemented in a separate authenticated step for that case.
- The original payment webhook path mismatch and other payment security hardening have not been addressed in this scope. Do not run live payments until the webhook integration is verified.
- No production database or GitHub repository has been modified by this ZIP file.

## Development

```sh
npm ci
npm run dev
```

The former `NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED` build flag is no longer used: live settings in Supabase replace it.
