"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      experimental: {
        passkey: true,
      },
    },
  }
);

export default function PasskeySetup() {
  const [userReady, setUserReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserReady(Boolean(data.user));
    });
  }, []);

  if (!userReady) return null;

  async function registerPasskey() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { error } = await supabase.auth.registerPasskey();

      if (error) {
        setError(error.message || "Could not register the passkey.");
        return;
      }

      setMessage("Face / biometric login is now set up on this device.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Passkey setup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border border-white/10 bg-black/85 p-4 text-white shadow-2xl backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <span>🔐</span>
        <span>Face / Biometric Login</span>
      </div>
      <p className="mb-3 text-xs text-white/70">
        Register this device so you can sign in without typing your password.
      </p>
      <button
        type="button"
        onClick={registerPasskey}
        disabled={loading}
        className="w-full rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Waiting for verification..." : "Set Up Face / Biometrics"}
      </button>
      {message && <p className="mt-2 text-xs text-green-300">✓ {message}</p>}
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}
