import type { Metadata } from 'next';
import Link from 'next/link';
import { AuditForm } from '@/components/form/AuditForm';
import { TOOLS } from '@/lib/audit-engine/tools';

export const metadata: Metadata = {
  title: 'SpendLens — Free AI Spend Audit for Startups',
  description:
    'Most startups overspend 20-40% on AI subscriptions. Find out in 3 minutes where your team is wasting money — free, no login required.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090B] dot-grid-bg">
      {/* ── Sticky Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#FAFAFA] tracking-tight">
              Spend<span className="text-[#22C55E]">Lens</span>
            </span>
            <span className="hidden sm:inline text-xs text-[#71717A] border border-[#27272A] rounded px-1.5 py-0.5">
              by Credex
            </span>
          </Link>
          <Link
            href="#audit"
            className="text-sm font-medium px-4 py-1.5 rounded-lg
              bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30
              hover:bg-[#22C55E]/20 transition-colors"
          >
            Start Audit →
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* ── Hero Section ── */}
        <section className="py-16 sm:py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-[#18181B] border border-[#27272A] text-xs text-[#A1A1AA] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            Free · No login required · Takes 3 minutes
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 gradient-text">
            Your AI tools are<br />
            costing you more<br />
            than they should.
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg text-[#A1A1AA] max-w-xl mx-auto mb-10 leading-relaxed">
            Most startups overspend{' '}
            <strong className="text-[#FAFAFA]">20–40%</strong> on AI subscriptions.
            Duplicate tools, oversized plans, wrong tiers.
            Find out in 3 minutes — no email, no login.
          </p>

          {/* CTA button */}
          <a
            href="#audit"
            id="hero-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl
              bg-[#22C55E] hover:bg-[#16A34A] text-black font-bold text-base
              transition-all duration-200
              shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_32px_rgba(34,197,94,0.5)]"
          >
            Start Your Free Audit
            <span aria-hidden>→</span>
          </a>

          {/* Social proof */}
          <blockquote className="mt-12 max-w-lg mx-auto text-left border-l-2 border-[#27272A] pl-4">
            <p className="text-sm italic text-[#71717A] leading-relaxed">
              &ldquo;Saved us $340/mo — we had no idea we were paying for Copilot and Cursor simultaneously.&rdquo;
            </p>
            <footer className="mt-2 text-xs text-[#52525B]">
              — Engineering Manager, 12-person SaaS startup
            </footer>
          </blockquote>
        </section>

        {/* ── How It Works ── */}
        <section className="py-12 border-t border-[#27272A]" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="text-sm font-semibold text-[#71717A] uppercase tracking-widest text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Add your tools',
                desc: 'Tell us what AI tools your team pays for — Cursor, Copilot, Claude, ChatGPT, and more.',
              },
              {
                num: '02',
                title: 'Get your audit',
                desc: 'Our engine checks for plan mismatches, tool overlaps, and over-provisioned seats — with specific reasoning.',
              },
              {
                num: '03',
                title: 'Save & share',
                desc: 'See exactly how much you can save. Share the report or book a free Credex consultation.',
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="relative p-5 rounded-xl border border-[#27272A] bg-[#18181B]">
                <div className="text-3xl font-mono font-bold text-[#3F3F46] mb-3">{num}</div>
                <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">{title}</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tools We Audit ── */}
        <section className="py-12 border-t border-[#27272A]" aria-labelledby="tools-we-audit">
          <h2 id="tools-we-audit" className="text-sm font-semibold text-[#71717A] uppercase tracking-widest text-center mb-8">
            Tools We Audit
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.values(TOOLS).map((tool) => (
              <div
                key={tool.name}
                className="flex items-center gap-2 px-3 py-2 rounded-lg
                  bg-[#18181B] border border-[#27272A] text-sm text-[#A1A1AA]
                  hover:border-[#3F3F46] hover:text-[#FAFAFA] transition-colors"
              >
                <span>{tool.icon}</span>
                <span className="font-medium">{tool.name}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#52525B] mt-6">
            More tools coming soon. Request one →{' '}
            <a href="mailto:hello@credex.in" className="text-[#71717A] hover:text-[#A1A1AA] underline">
              hello@credex.in
            </a>
          </p>
        </section>

        {/* ── Audit Form ── */}
        <section id="audit" className="py-16 border-t border-[#27272A]" aria-labelledby="start-audit-heading">
          <div className="text-center mb-10">
            <h2 id="start-audit-heading" className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] mb-3">
              Start your free audit
            </h2>
            <p className="text-sm text-[#71717A]">
              3 steps. No account. Instant results.
            </p>
          </div>

          <AuditForm />
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#27272A] mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#52525B]">
            Built for startups spending $200–$10,000/mo on AI tools.{' '}
            <span className="text-[#71717A]">Powered by Credex.</span>
          </p>
          <div className="flex items-center gap-4 text-xs text-[#52525B]">
            <a href="https://credex.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#A1A1AA] transition-colors">
              Credex.in
            </a>
            <span>·</span>
            <a href="mailto:hello@credex.in" className="hover:text-[#A1A1AA] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
