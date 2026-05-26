import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const leadSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  totalSavings: z.number().min(0),
  // optional fields
  companyName: z.string().optional(),
  role: z.string().optional(),
  // honeypot — must be empty
  company_website: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { email, token, totalSavings, companyName, role, company_website } = parsed.data;

  // Honeypot check — bots fill hidden fields
  if (company_website) {
    // Silently succeed (don't tell bots they were caught)
    return NextResponse.json({ success: true });
  }

  const auditUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/audit/${token}`;
  const isHighSavings = totalSavings >= 500;

  // 1. Save lead to Supabase
  const supabase = createAdminClient();
  if (supabase) {
    try {
      await supabase.from('leads').insert({
        email,
        company_name: companyName ?? null,
        role: role ?? null,
        high_savings: isHighSavings,
        email_sent: false,
      });
    } catch (err) {
      // leads table may not exist yet — don't block email
      console.warn('Supabase lead insert failed:', err);
    }
  }

  // 2. Send confirmation email via Resend
  if (!resend) {
    console.warn('RESEND_API_KEY not set — mocking email delivery');
    await new Promise(r => setTimeout(r, 800));
    return NextResponse.json({ success: true, mocked: true });
  }

  try {
    await resend.emails.send({
      from: 'SpendLens <onboarding@resend.dev>',
      to: [email],
      subject: `Your AI Spend Audit — ${totalSavings > 0 ? `$${Math.round(totalSavings)}/mo savings found` : 'Your optimized stack'}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; color: #18181b; background: #09090b; padding: 40px 32px; border-radius: 12px;">
          <h2 style="color: #fafafa; font-size: 20px; margin-bottom: 8px;">Your SpendLens audit is ready.</h2>

          ${totalSavings > 0
            ? `<p style="color: #a1a1aa; font-size: 15px; line-height: 1.6;">
                We identified <strong style="color: #22c55e;">$${Math.round(totalSavings)}/month</strong> 
                ($${Math.round(totalSavings * 12)}/year) in potential savings across your team's AI stack.
               </p>`
            : `<p style="color: #a1a1aa; font-size: 15px; line-height: 1.6;">
                Your AI stack looks well-optimized — we found no significant savings opportunities. 
                That's a good thing.
               </p>`}

          <p style="color: #71717a; font-size: 14px; margin-top: 24px;">
            View your full breakdown, per-tool recommendations, and AI summary:
          </p>

          <a href="${auditUrl}" 
             style="display: inline-block; margin-top: 12px; padding: 12px 24px; background: #3b82f6; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            View Your Audit Report →
          </a>

          ${isHighSavings ? `
          <div style="margin-top: 40px; padding: 20px; background: #18181b; border-radius: 8px; border: 1px solid #27272a;">
            <h3 style="color: #fafafa; font-size: 15px; margin-bottom: 8px;">Unlock Credex Volume Discounts</h3>
            <p style="color: #71717a; font-size: 13px; line-height: 1.6; margin: 0;">
              Teams with savings above $500/mo typically qualify for Credex's discounted AI API credits program — 
              15-30% below retail on Anthropic and OpenAI usage. Reply to this email if you'd like to explore this.
            </p>
          </div>` : ''}

          <p style="color: #3f3f46; font-size: 12px; margin-top: 40px; border-top: 1px solid #27272a; padding-top: 20px;">
            SpendLens by Credex — Free AI tool spend auditing for startups.<br/>
            You're receiving this because you requested your audit report.
          </p>
        </div>
      `,
    });

    // Mark email as sent
    if (supabase) {
      supabase.from('leads').update({ email_sent: true }).eq('email', email).then(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
