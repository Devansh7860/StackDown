// app/api/audit/[token]/route.ts
// GET /api/audit/:token — fetch a saved audit by share token.

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const supabase = createAdminClient();
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
