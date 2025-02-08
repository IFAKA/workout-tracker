import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.DATABASE_URL!,
    process.env.DATABASE_KEY!
  );
}
