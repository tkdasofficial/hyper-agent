import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { SUPABASE_PROJECT_ID, SUPABASE_URL } from '@/supabase/config/config';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    // Test connection by checking renders table or querying public schema
    const { error } = await supabase.from('renders').select('count', { count: 'exact', head: true });

    return NextResponse.json({
      connected: !error,
      projectId: SUPABASE_PROJECT_ID,
      endpoint: SUPABASE_URL,
      status: error ? 'table_check_or_empty' : 'operational',
      message: error ? error.message : 'Supabase Backend is connected and operational.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({
      connected: false,
      error: message,
    }, { status: 500 });
  }
}
