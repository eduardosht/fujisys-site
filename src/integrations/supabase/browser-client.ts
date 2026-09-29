import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export class SupabaseBrowserEnvironmentError extends Error {
  constructor() {
    super("Supabase browser authentication is unavailable outside the browser.");
    this.name = "SupabaseBrowserEnvironmentError";
  }
}

export class SupabaseBrowserConfigError extends Error {
  constructor() {
    super("Supabase browser authentication is not configured.");
    this.name = "SupabaseBrowserConfigError";
  }
}

let browserClient: SupabaseClient | undefined;

export function getBrowserSupabaseClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new SupabaseBrowserEnvironmentError();
  }

  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) {
    throw new SupabaseBrowserConfigError();
  }

  try {
    browserClient = createClient(url, publishableKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });
  } catch {
    throw new SupabaseBrowserConfigError();
  }

  return browserClient;
}
