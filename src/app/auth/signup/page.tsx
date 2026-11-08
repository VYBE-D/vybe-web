"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PhotoStep from "../../../component/Signup/PhotoStep";
import { supabase } from "../../../lib/supabase";
import { useSiteFeatures } from "../../../context/SiteFeaturesContext";

type Step = "email" | "password" | "age" | "nickname" | "intent" | "consent" | "subIntent" | "photos" | "hosting" | "verify";

const INTENTS = ["casual", "bdsm", "both"] as const;
const SUB_INTENTS = [
  "Dominant", "Submissive", "Switch", "Beginner", "Experienced", "Exploring",
  "Soft dom", "Brat", "Rope", "Praise", "Degrade",
];

export default function SignupPage() {
  const router = useRouter();
  const { features, loading: featureLoading } = useSiteFeatures();
  const showExtraPages = features.extra_registration_enabled;
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [intents, setIntents] = useState<string[]>([]);
  const [subIntents, setSubIntents] = useState<string[]>([]);
  const [form, setForm] = useState({ email: "", password: "", nickname: "", ageConfirmed: false });

  const go = (next: Step) => { setError(""); setStep(next); };
  const action = (label: string, onClick: () => void, disabled = false) => (
    <button type="button" onClick={onClick} disabled={disabled}
      className="mt-2 w-full rounded-full border border-white/20 bg-white/10 py-3 font-medium backdrop-blur-md transition hover:bg-white/20 disabled:opacity-40">
      {label}
    </button>
  );

  const uploadPhotos = async (id: string) => {
    const urls: string[] = [];
    for (const file of photos) {
      const path = `${id}/${crypto.randomUUID()}`;
      const { error: uploadError } = await supabase.storage.from("users").upload(path, file);
      if (uploadError) throw uploadError;
      urls.push(supabase.storage.from("users").getPublicUrl(path).data.publicUrl);
    }
    return urls;
  };

  const register = async (hosting: "host" | "travel") => {
    if (loading || !form.ageConfirmed || !form.email || !form.password) return;
    if (showExtraPages && photos.length < 2) { setError("Please upload at least two photos."); return; }

    setLoading(true);
    setError("");
    try {
      // Collect hosting choice before creating the account, so it survives an
      // email-confirmation flow without a usable session yet.
      const nickname = showExtraPages ? form.nickname.trim() : "";
      const { data, error: signupError } = await supabase.auth.signUp({
        email: form.email.trim(), password: form.password,
        options: { data: {
          vybe_signup: true,
          age_confirmed: true,
          nickname,
          hosting,
          intent: showExtraPages ? intents : [],
          sub_intents: showExtraPages ? subIntents : [],
        } },
      });
      if (signupError) throw signupError;
      if (!data.user) throw new Error("Account creation failed.");

      if (!data.session) { go("verify"); return; }

      const urls = showExtraPages ? await uploadPhotos(data.user.id) : [];
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        nickname: nickname || `Member-${data.user.id.slice(0, 8)}`,
        hosting,
        intent: showExtraPages ? intents : [],
        sub_intents: showExtraPages ? subIntents : [],
        photos: urls,
        status: "ACTIVE",
      });
      if (profileError) throw profileError;
      router.replace("/home");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create your account.");
    } finally { setLoading(false); }
  };

  if (featureLoading) return <main className="min-h-screen bg-black" />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <motion.div key={step} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-xl">
        {error && <p role="alert" className="mb-4 rounded-xl border border-red-500/30 bg-red-900/30 p-3 text-sm text-red-200">{error}</p>}

        {step === "email" && <>
          <h1 className="mb-2 text-2xl font-bold">Welcome to VYBE</h1>
          <p className="mb-6 text-sm text-gray-300">Enter your email to get started.</p>
          <input type="email" autoComplete="email" aria-label="Email address" placeholder="Email address"
            className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none" value={form.email}
            onChange={event => setForm({ ...form, email: event.target.value })} />
          {action("Continue", () => { if (form.email.includes("@")) go("password"); else setError("Enter a valid email address."); })}
        </>}

        {step === "password" && <>
          <h1 className="mb-4 text-2xl font-bold">Secure your account</h1>
          <input type="password" autoComplete="new-password" aria-label="Password" placeholder="Password (at least 6 characters)"
            className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
            value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} />
          {action("Continue", () => form.password.length >= 6 ? go("age") : setError("Password must be at least 6 characters."))}
        </>}

        {step === "age" && <>
          <h1 className="mb-4 text-xl font-bold">Age confirmation</h1>
          <label className="mb-4 flex items-center gap-3 text-sm">
            <input type="checkbox" checked={form.ageConfirmed} onChange={event => setForm({ ...form, ageConfirmed: event.target.checked })} />
            I confirm that I am 18 or older
          </label>
          {action("Continue", () => go(showExtraPages ? "nickname" : "hosting"), !form.ageConfirmed)}
        </>}

        {showExtraPages && step === "nickname" && <>
          <h1 className="mb-4 text-xl font-bold">What should we call you?</h1>
          <input aria-label="Nickname" placeholder="Nickname" value={form.nickname}
            onChange={event => setForm({ ...form, nickname: event.target.value })}
            className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none" />
          {action("Continue", () => go("intent"), !form.nickname.trim())}
        </>}

        {showExtraPages && step === "intent" && <>
          <h1 className="mb-4 text-xl font-bold">What kind of vibe?</h1>
          {INTENTS.map(intent => action(intent.toUpperCase(), () => { setIntents([intent]); go(intent === "casual" ? "photos" : "consent"); }))}
        </>}

        {showExtraPages && step === "consent" && <>
          <h1 className="mb-4 text-xl font-bold">Consent &amp; respect</h1>
          <p className="mb-3 text-sm text-zinc-400">Respect consent and boundaries at all times.</p>
          {action("I agree", () => go("subIntent"))}
        </>}

        {showExtraPages && step === "subIntent" && <>
          <h1 className="mb-4 text-xl font-bold">Choose what fits you</h1>
          <div className="mb-4 grid max-h-48 grid-cols-2 gap-2 overflow-y-auto">
            {SUB_INTENTS.map(item => <button key={item} type="button"
              onClick={() => setSubIntents(previous => previous.includes(item) ? previous.filter(value => value !== item) : [...previous, item])}
              className={`rounded-lg border p-2 text-xs ${subIntents.includes(item) ? "bg-white text-black" : "border-white/10"}`}>{item}</button>)}
          </div>
          {action("Continue", () => go("photos"))}
        </>}

        {showExtraPages && step === "photos" && <PhotoStep photos={photos} setPhotos={setPhotos} onNext={() => go("hosting")} />}

        {step === "hosting" && <>
          <h1 className="mb-2 text-2xl font-bold">Where would you like to meet?</h1>
          <p className="mb-5 text-sm text-zinc-400">Choose whether you can host or prefer someone else to host you.</p>
          {action(loading ? "Creating account…" : "I can host", () => void register("host"), loading)}
          {action(loading ? "Creating account…" : "Host me", () => void register("travel"), loading)}
        </>}

        {step === "verify" && <>
          <h1 className="mb-3 text-2xl font-bold">Check your email</h1>
          <p className="mb-5 text-sm leading-relaxed text-zinc-300">We sent a confirmation link to your email. Confirm your address, then sign in. Your hosting choice was saved with your signup.</p>
          {action("Go to sign in", () => router.replace("/auth/login"))}
        </>}
      </motion.div>
    </main>
  );
}
