import { createBrowserClient } from "@supabase/ssr"
import { config, isSupabaseConfigured } from "../config"

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not properly configured. Please check your environment variables.")
  }

  return createBrowserClient(config.supabase.url, config.supabase.anonKey)
}
