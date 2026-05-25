import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const emailSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  totalSavings: z.number().min(0),
});

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const parsed = emailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { email, token, totalSavings } = parsed.data;
  const auditUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/audit/${token}`;

  // 1. Save to Supabase (optional, fails gracefully)
  const supabase = createAdminClient();
  if (supabase) {
    // Just try to update the audit record with the email
    const { error } = await supabase
      .from('audits')
      .update({ email: email } as any)
      .eq('share_token', token);

    if (error) {
      console.warn('Failed to save email to Supabase (column might not exist):', error.message);
    }
  }

  // 2. Send email via Resend
  if (!resend) {
    console.warn('RESEND_API_KEY not set. Mocking email delivery.');
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));
    return NextResponse.json({ success: true, mocked: true });
  }

  try {
    await resend.emails.send({
      from: 'SpendLens <onboarding@resend.dev>',
      to: [email],
      subject: `Your SpendLens AI Audit ($${totalSavings}/mo savings)`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-w-xl; margin: 0 auto; color: #18181b;">
          <h2 style="color: #09090b;">Your SpendLens Audit is ready.</h2>
          <p>We found <strong>$${totalSavings}/mo</strong> in potential savings across your team's AI tools.</p>
          <p>You can view your full interactive breakdown, right-sizing recommendations, and AI summary here:</p>
          <p><a href="${auditUrl}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">View your full report &rarr;</a></p>
          <br />
          <hr style="border: none; border-top: 1px solid #e4e4e7;" />
          <h3 style="color: #09090b;">Unlock Credex API Discounts</h3>
          <p style="color: #52525b; font-size: 14px;">As a bonus, teams that complete a SpendLens audit are eligible for 15-30% volume discounts on Anthropic and OpenAI API credits through Credex. Reply to this email if you're interested in activating this.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
