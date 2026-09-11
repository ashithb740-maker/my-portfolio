"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: "pkce",
    },
  }
);

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loginWithGitHub = async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    if (error) {
      console.error("GitHub login error:", error);
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.url) {
      window.location.assign(data.url);
    } else {
      setErrorMessage("Could not start GitHub login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-slate-900">
          Admin Login
        </h1>

        <p className="mt-2 text-center text-slate-600">
          Sign in to manage your portfolio
        </p>

        <button
          type="button"
          onClick={loginWithGitHub}
          disabled={loading}
          className="mt-8 w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Connecting to GitHub..." : "Continue with GitHub"}
        </button>

        {errorMessage && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}
      </div>
    </main>
  );
}
