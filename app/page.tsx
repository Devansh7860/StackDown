import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, Layers, Sparkles } from 'lucide-react';
import { AuditForm } from '@/components/form/AuditForm';
import { Feature108 } from '@/components/ui/feature-tabs';
import { TOOLS } from '@/lib/audit-engine/tools';

export const metadata: Metadata = {
  title: 'SpendLens — Free AI Spend Audit for Startups',
  description:
    'Most startups overspend 20-40% on AI subscriptions. Find out in 3 minutes where your team is wasting money — free, no login required.',
};

const featureTabs = [
  {
    value: 'detect',
    icon: <Layers className="h-auto w-4 shrink-0" />,
    label: 'Detect overlaps',
    content: {
      badge: 'Overlap Detection',
      title: 'Stop paying twice for the same capability.',
      description:
        'SpendLens cross-references your AI stack and flags tools with redundant features. Cursor + Copilot? Claude + ChatGPT? You only need one.',
      buttonText: '',
      imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80',
      imageAlt: 'Data analytics dashboard showing overlapping subscriptions',
    },
  },
  {
    value: 'optimize',
    icon: <BarChart3 className="h-auto w-4 shrink-0" />,
    label: 'Right-size plans',
    content: {
      badge: 'Plan Optimization',
      title: 'Match your plan to your actual usage.',
      description:
        'Team of 3 on a 5-seat minimum plan? Business tier when Pro covers your needs? We find every mismatch and show you the exact savings.',
      buttonText: '',
      imageSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80',
      imageAlt: 'Financial optimization dashboard',
    },
  },
  {
    value: 'save',
    icon: <Sparkles className="h-auto w-4 shrink-0" />,
    label: 'Save with Credex',
    content: {
      badge: 'Credex Integration',
      title: 'Discounted AI API credits, 15-30% below retail.',
      description:
        'For teams spending on Anthropic or OpenAI APIs, Credex sources volume-discounted credits. Your audit identifies exactly where this applies.',
      buttonText: '',
      imageSrc: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&q=80',
      imageAlt: 'Cost savings visualization',
    },
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[#1E1E21] bg-[#09090B]/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-sm font-semibold text-[#FAFAFA] tracking-tight">
              SpendLens
            </span>
            <span className="text-[10px] text-[#52525B] border border-[#27272A] rounded px-1.5 py-0.5 hidden sm:inline">
              by Credex
            </span>
          </Link>
          <a
            href="#audit"
            className="text-sm text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
          >
            Start audit
          </a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <section className="pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="max-w-2xl">
            <p className="text-sm text-[#52525B] mb-4">Free audit / No login / 3 minutes</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.15] tracking-tight text-[#FAFAFA] mb-5">
              Your team is overspending<br />
              on AI tools.
            </h1>
            <p className="text-base text-[#71717A] max-w-lg mb-8 leading-relaxed">
              Most startups waste 20-40% on duplicate subscriptions and oversized plans.
              SpendLens finds the waste in under 3 minutes.
            </p>
            <a
              href="#audit"
              id="hero-cta"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                bg-[#FAFAFA] text-[#09090B] font-medium text-sm
                hover:bg-[#E4E4E7] transition-colors"
            >
              Run free audit
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Stats strip */}
        <section className="grid grid-cols-3 gap-px bg-[#1E1E21] rounded-lg overflow-hidden mb-20">
          {[
            { value: '20-40%', label: 'average overspend on AI tools' },
            { value: '$2,400', label: 'median annual savings found' },
            { value: '3 min', label: 'to get your full audit report' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-[#111113] p-6 text-center">
              <p className="text-xl sm:text-2xl font-semibold text-[#FAFAFA] mono-num">{value}</p>
              <p className="text-xs text-[#52525B] mt-1">{label}</p>
            </div>
          ))}
        </section>

        {/* Tools We Audit */}
        <section className="pb-8 border-t border-[#1E1E21] pt-12">
          <p className="text-xs text-[#52525B] uppercase tracking-widest text-center mb-6">
            Tools we audit
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(TOOLS).map(([, tool]) => (
              <span
                key={tool.name}
                className="px-3 py-1.5 rounded-md bg-[#111113] border border-[#1E1E21]
                  text-xs text-[#71717A] font-medium"
              >
                {tool.name}
              </span>
            ))}
          </div>
        </section>
      </main>

      {/* Feature tabs */}
      <div className="border-t border-[#1E1E21]">
        <Feature108
          badge="How it works"
          heading="From spend chaos to clarity in 3 steps"
          description="Add your tools, get your audit, see exactly where to save."
          tabs={featureTabs}
        />
      </div>

      {/* Audit Form */}
      <section id="audit" className="border-t border-[#1E1E21]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#FAFAFA] mb-2">
              Start your audit
            </h2>
            <p className="text-sm text-[#52525B]">
              Add your tools, review, and get instant results.
            </p>
          </div>
          <AuditForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E1E21]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#3F3F46]">
            Built for startups spending $200-$10,000/mo on AI tools. Powered by Credex.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#3F3F46]">
            <a href="https://credex.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#71717A] transition-colors">
              Credex.in
            </a>
            <span className="text-[#27272A]">/</span>
            <a href="mailto:hello@credex.in" className="hover:text-[#71717A] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
