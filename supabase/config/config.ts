/**
 * Root-Level Supabase Backend Configuration
 *
 * This file contains the root project configuration and public credentials,
 * allowing the application to initialize without requiring external .env files
 * for public client access.
 *
 * SECURITY NOTICE:
 * - Public Anon Key and Project URL are safe to store here for client and backend initialization.
 * - The Service Role Key is strictly confidential (bypasses Row-Level Security) and must NEVER
 *   be hardcoded in this file or committed to version control.
 * - Manage the Service Role Key strictly via private server environment variables on your host.
 */

export const SUPABASE_CONFIG = {
  projectId: 'ubpxaotwigtpsptiivao',
  url: 'https://ubpxaotwigtpsptiivao.supabase.co',
  anonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicHhhb3R3aWd0cHNwdGlpdmFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MzI4ODksImV4cCI6MjEwNDUwODg4OX0.tcHNqHmfJOsW9s8S5kWX8gtqAVjVJi48L8Bp5cFGMf4',
  region: 'ap-northeast-1',
} as const;

export const SUPABASE_URL = SUPABASE_CONFIG.url;
export const SUPABASE_ANON_KEY = SUPABASE_CONFIG.anonKey;
export const SUPABASE_PROJECT_ID = SUPABASE_CONFIG.projectId;

/**
 * Server-only helper to retrieve the Service Role Key from the private server environment.
 * Throws immediately if accessed in browser context or if the server key is not configured.
 */
export function getPrivateServiceRoleKey(): string {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: Service Role Key cannot be accessed on the client-side.');
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required on the private server environment to perform administrative operations.'
    );
  }
  return key;
}
