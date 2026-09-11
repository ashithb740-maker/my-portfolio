"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const exchangeCode = async () => {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/admin";

      if (!code) {
        router.replace(`/admin/login?error=missing_code`);
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Supabase auth callback error:", error);
        router.replace(`/admin/login?error=auth_callback_failed`);
        return;
      }

      router.replace(next);
    };

    exchangeCode();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <p className="text-lg">Signing you in...</p>
    </main>
  );
}
