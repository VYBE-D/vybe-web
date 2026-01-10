"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion"; // Added to match Signup animation
import { supabase } from "../../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.replace("/home");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Matched Background (Pure Black)
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      
      {/* 2. Added Motion Wrapper to match Signup entry */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleLogin}
          // 3. Matched Container: White Glass (bg-white/10), White Border (border-white/20)
          className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-300 text-sm">
              Enter your credentials to continue.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email Input - Styled to match implied 'input' class from Signup */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-white/30 text-white placeholder-gray-400 p-3 rounded-xl outline-none transition-colors"
              required
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-white/30 text-white placeholder-gray-400 p-3 rounded-xl outline-none transition-colors"
              required
            />

            {/* Login Button - Matched 'Tap' component style (rounded-full, white/10) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full border border-white/20 
              bg-white/10 backdrop-blur-md py-3 mt-4 hover:bg-white/20 transition-all 
              font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-white font-semibold hover:underline decoration-white/50 underline-offset-4"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </main>
  );
}