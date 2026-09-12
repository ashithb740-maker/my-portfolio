"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const next = searchParams.get("next");
        const destination =
          next && next.startsWith("/") && !next.startsWith("//")
            ? next
            : "/admin";
        router.replace(destination);
      }
    };

    const error = searchParams.get("error");
    if (error === "auth_callback_failed") {
      setErrorMessage("GitHub login could not be completed. Please try again.");
    } else if (error === "missing_code") {
      setErrorMessage("Login callback was incomplete. Please try again.");
    }

    checkSession();
  }, [router, searchParams]);

  const loginWithGitHub = async () => {
    setLoading(true);
    setErrorMessage("");

    const next = searchParams.get("next");
    const safeNext =
      next && next.startsWith("/") && !next.startsWith("//")
        ? next
        : "/admin";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      },
    });

    if (error) {
      console.error("GitHub login error:", error);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-3xl">
            🔐
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-950">Admin Login</h1>
          <p className="mt-2 text-slate-600">Sign in to manage your portfolio</p>
        </div>

        <button
          type="button"
          onClick={loginWithGitHub}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-slate-950 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-xl">◉</span>
          {loading ? "Connecting to GitHub..." : "Continue with GitHub"}
        </button>

        {errorMessage && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          Authorized access only
        </p>
      </div>
    </main>
  );
}
