"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { flowType: "pkce" },
  }
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [faceLoading, setFaceLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const next = searchParams.get("next");
  const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.replace(destination);
    };
    checkSession();
  }, [destination, router]);

  const loginWithPassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.replace(destination);
  };

  const loginWithFace = async () => {
    setFaceLoading(true);
    setErrorMessage("");

    try {
      if (!window.isSecureContext) {
        throw new Error("Face/biometric login requires HTTPS. Please use the deployed website.");
      }
      if (!window.PublicKeyCredential || !navigator.credentials) {
        throw new Error("This browser does not support passkey/biometric login.");
      }

      const auth = supabase.auth as typeof supabase.auth & {
        signInWithPasskey?: () => Promise<{ data: unknown; error: Error | null }>;
      };

      if (!auth.signInWithPasskey) {
        throw new Error("Passkey login is not available in the current Supabase Auth client.");
      }

      const { error } = await auth.signInWithPasskey();
      if (error) throw error;

      router.replace(destination);
    } catch (error) {
      console.error("Passkey login error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Face/biometric login failed.");
      setFaceLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">🔐</div>
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-950">Admin Login</h1>
          <p className="mt-2 text-center text-slate-600">Sign in to manage your portfolio</p>

          <form onSubmit={loginWithPassword} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
              <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-xl border border-slate-300 px-4 py-3.5 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm text-slate-500 hover:text-slate-900">{showPassword ? "🙈" : "👁️"}</button>
              </div>
            </div>
            <button type="submit" disabled={loading || faceLoading} className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button type="button" onClick={loginWithFace} disabled={loading || faceLoading} className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 font-semibold text-slate-800 transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60">
            <span className="text-xl">👤</span>
            {faceLoading ? "Verifying..." : "Login with Face / Biometrics"}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-slate-500">Uses your device's secure passkey system such as Face ID, Windows Hello, fingerprint, or device PIN. Your biometric data is not stored by this website.</p>

          {errorMessage && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-700">{errorMessage}</p>}
        </div>
      </div>
    </main>
  );
}
