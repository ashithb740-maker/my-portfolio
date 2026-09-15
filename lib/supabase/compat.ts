import { createBrowserClient } from "@supabase/ssr";

export function createClient(url: string, key: string) {
  return createBrowserClient(url, key, {
    auth: {
      lockAcquireTimeout: 10000,
      experimental: {
        passkey: true,
      },
    },
  });
}
