import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

/** Complete simplified signups after email confirmation, if no DB trigger did so. */
export async function completeDeferredProfile(user: User): Promise<void> {
  const meta = user.user_metadata || {};
  if (meta.vybe_signup !== true || !["host", "travel"].includes(meta.hosting)) return;

  const { data: existing, error: readError } = await supabase.from("profiles")
    .select("id").eq("id", user.id).maybeSingle();
  if (readError || existing) return;

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    nickname: typeof meta.nickname === "string" && meta.nickname.trim() ? meta.nickname.trim() : `Member-${user.id.slice(0, 8)}`,
    hosting: meta.hosting,
    intent: Array.isArray(meta.intent) ? meta.intent : [],
    sub_intents: Array.isArray(meta.sub_intents) ? meta.sub_intents : [],
    photos: Array.isArray(meta.photos) ? meta.photos : [],
    status: "ACTIVE",
  });
  if (error) console.warn("Profile completion was deferred:", error.message);
}
