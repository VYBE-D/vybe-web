"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PhotoStep from "../../../component/Signup/PhotoStep";
import { supabase } from "../../../lib/supabase";

/* ---------------- STEPS ---------------- */
type Step =
  | "email"
  | "password"
  | "nickname"
  | "age"
  | "intent"
  | "consent"
  | "subIntent"
  | "photos"
  | "hosting"
  | "done";

const INTENTS = ["casual", "bdsm", "both"] as const;

const SUB_INTENTS = [
  "Dominant", "Submissive", "Switch",
  "Beginner", "Experienced", "Exploring",
  "Soft dom", "Brat", "Rope",
  "Praise", "Degrade",
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);

  const [photos, setPhotos] = useState<File[]>([]);
  const [intents, setIntents] = useState<string[]>([]);
  const [subIntents, setSubIntents] = useState<string[]>([]);

  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    ageConfirmed: false,
    hosting: "",
  });

  const next = (s: Step) => setStep(s);

  /* ---------------- AUTH ---------------- */
  const createAccount = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (error) return alert(error.message);
    if (!data.user) return alert("Signup failed");

    next("nickname");
  };

  /* ---------------- PHOTO UPLOAD ---------------- */
  const uploadPhotos = async (userId: string) => {
    const urls: string[] = [];

    for (const file of photos) {
      const path = `${userId}/${crypto.randomUUID()}`;
      const { error } = await supabase.storage
        .from("users")
        .upload(path, file);

      if (error) throw error;

      const { data } = supabase.storage.from("users").getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    return urls;
  };

  /* ---------------- FINAL SUBMIT (STABILIZED) ---------------- */
  const finishSignup = async () => {
    if (photos.length < 2) return alert("Upload at least 2 photos");

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        const { data: { user: retryUser } } = await supabase.auth.getUser();
        if (!retryUser) throw new Error("Authentication failed. Please refresh.");
        var finalUser = retryUser;
      } else {
        var finalUser = user;
      }

      const photoUrls = await uploadPhotos(finalUser.id);

      const { error } = await supabase.from("profiles").upsert({
        id: finalUser.id,
        nickname: form.nickname,
        intent: intents,
        sub_intents: subIntents,
        hosting: form.hosting,
        photos: photoUrls,
        status: "ACTIVE",
      });

      if (error) throw error;

      router.replace("/home");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  const Tap = ({ label, onClick }: any) => (
    <button
      onClick={onClick}
      className="w-full rounded-full border border-white/20
      bg-white/10 backdrop-blur-md py-3 mt-2 hover:bg-white/20 transition"
    >
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-6 rounded-3xl
        bg-white/10 backdrop-blur-xl border border-white/20 text-white"
      >

        {step === "email" && (
          <>
            <h1 className="text-2xl font-bold mb-2">Welcome to Vybe</h1>
            <p className="text-gray-300 mb-6">Enter your email to get started.</p>
            <input
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none mb-2"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Tap label="Continue" onClick={() => next("password")} />
          </>
        )}

        {step === "password" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Secure your account</h1>
            <input
              type="password"
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none mb-2"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Tap label={loading ? "Creating..." : "Continue"} onClick={createAccount} />
          </>
        )}

        {step === "nickname" && (
          <>
            <h1 className="text-2xl font-bold mb-2">What should we call you?</h1>
            <input
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none mb-2"
              placeholder="Nickname"
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            />
            <Tap label="Continue" onClick={() => next("age")} />
          </>
        )}

        {step === "age" && (
          <>
            <h1 className="text-xl font-bold mb-4">Age Confirmation</h1>
            <label className="flex gap-2 text-sm mb-4">
              <input type="checkbox" onChange={(e) =>
                setForm({ ...form, ageConfirmed: e.target.checked })}
              />
              I confirm that I am 18 or older
            </label>
            <Tap label="I’m 18+" onClick={() => form.ageConfirmed && next("intent")} />
          </>
        )}

        {step === "intent" && (
          <>
            <h1 className="text-xl font-bold mb-4">What kind of vibe?</h1>
            {INTENTS.map((i) => (
              <Tap
                key={i}
                label={i.toUpperCase()}
                onClick={() => {
                  setIntents([i]);
                  next(i !== "casual" ? "consent" : "photos");
                }}
              />
            ))}
          </>
        )}

        {step === "consent" && (
          <>
            <h1 className="text-xl font-bold mb-4">Consent & Respect</h1>
            <Tap label="I Agree" onClick={() => next("subIntent")} />
          </>
        )}

        {step === "subIntent" && (
          <>
            <h1 className="text-xl font-bold mb-4">Choose what fits you</h1>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto mb-4">
               {SUB_INTENTS.map((t) => (
                <button 
                  key={t}
                  onClick={() => setSubIntents(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                  className={`p-2 rounded-lg text-xs border ${subIntents.includes(t) ? 'bg-white text-black' : 'border-white/10'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <Tap label="Continue" onClick={() => next("photos")} />
          </>
        )}

        {step === "photos" && (
          <PhotoStep photos={photos} setPhotos={setPhotos} onNext={() => next("hosting")} />
        )}

        {step === "hosting" && (
          <>
            <h1 className="text-xl font-bold mb-4">Hosting preference</h1>
            <Tap label="I can host" onClick={() => { setForm({ ...form, hosting: "host" }); next("done"); }} />
            <Tap label="we host" onClick={() => { setForm({ ...form, hosting: "travel" }); next("done"); }} />
          </>
        )}

        {step === "done" && (
          <>
            <h1 className="text-2xl font-bold mb-4">You’re in 🔥</h1>
            
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              📧 Check your email
                 We’ve sent you a secure link to continue.
                 Open your email and (supabase) to tap the link to access Vybe.
            </p>

            <Tap label={loading ? "Finishing..." : "Go to Home"} onClick={finishSignup} />
          </>
        )}

      </motion.div>
    </main>
  );
}