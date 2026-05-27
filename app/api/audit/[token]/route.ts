// app/api/audit/[token]/route.ts
// GET /api/audit/:token — fetch a saved audit by share token.

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createPublicClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  // Prefer service role (admin) — falls back to anon key for public reads.
  // RLS allows public SELECT on audits table, so anon key works for share links.
  const adminClient = createAdminClient();
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  return createPublicClient(url, anonKey, { auth: { persistSession: false } });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('audits')
    .select('share_token, audit_result, ai_summary, created_at')
    .eq('share_token', token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  return NextResponse.json({
    shareToken: data.share_token,
    result: data.audit_result,
    aiSummary: data.ai_summary,
  });
}
