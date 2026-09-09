import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  getPrivateServiceRoleKey,
} from '@/supabase/config/config';

let clientInstance: SupabaseClient<Database> | null = null;
let adminInstance: SupabaseClient<Database> | null = null;

/**
 * Standard client for browser / public queries using Anon key.
 * Uses hardcoded root config from supabase/config/config.ts with process.env fallback.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!clientInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;
    clientInstance = createClient<Database>(url, key);
  }
  return clientInstance;
}

/**
 * Server-only client using the Service Role Key for backend administration / webhooks.
 * Service role key is securely resolved only on the private server runtime and never exposed to git or client.
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (typeof window !== 'undefined') {
    throw new Error('getSupabaseAdmin can only be called from server-side code');
  }

  if (!adminInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
    const serviceRoleKey = getPrivateServiceRoleKey();
    adminInstance = createClient<Database>(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return adminInstance;
}
