-- Apply once to the EXISTING Supabase project after it is resumed.
-- Settings default OFF. No client-side UPDATE permission is granted.
create table if not exists public.site_feature_settings (
  id integer primary key default 1 check (id = 1),
  subscriptions_enabled boolean not null default false,
  profile_tab_enabled boolean not null default false,
  extra_registration_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

insert into public.site_feature_settings (id) values (1)
on conflict (id) do nothing;

alter table public.site_feature_settings enable row level security;

-- No public read/write policies. Server API reads via the service-role client.
revoke all on public.site_feature_settings from anon, authenticated;
grant select, insert, update, delete on public.site_feature_settings to service_role;
-- Only the backend, with a service-role key and verified admin session, may change flags.
