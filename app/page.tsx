import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, Layers, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuditForm } from '@/components/form/AuditForm';
import { Feature108 } from '@/components/ui/feature-tabs';
import { TOOLS } from '@/lib/audit-engine/tools';

export const metadata: Metadata = {
  title: 'StackDown — Free AI Spend Audit for Startups',
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
        'StackDown cross-references your AI stack and flags tools with redundant features. Cursor + Copilot? Claude + ChatGPT? You only need one.',
      buttonText: '',
      svgContent: (
        <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px]">
          {/* Main Card Background */}
          <rect x="20" y="20" width="240" height="140" rx="12" fill="#18181B" stroke="#27272A" strokeWidth="1" />
          
          {/* Header Area */}
          <rect x="21" y="21" width="238" height="32" rx="12" fill="#27272A" fillOpacity="0.3" />
          <path d="M21 53H259" stroke="#27272A" strokeWidth="1" />
          
          {/* Status Indicator */}
          <circle cx="36" cy="37" r="4" fill="#EF4444" />
          <text x="48" y="40" fill="#FAFAFA" fontSize="10" fontWeight="500" fontFamily="sans-serif">Conflict Detected</text>
          
          {/* Tool 1: Cursor */}
          <rect x="36" y="65" width="208" height="36" rx="6" fill="#09090B" stroke="#3F3F46" strokeWidth="1" strokeDasharray="2 2" />
          <rect x="44" y="73" width="20" height="20" rx="4" fill="#3B82F6" fillOpacity="0.2" />
          <text x="72" y="87" fill="#FAFAFA" fontSize="10" fontWeight="500" fontFamily="sans-serif">Cursor Business</text>
          <text x="204" y="87" fill="#A1A1AA" fontSize="10" fontFamily="sans-serif">$40/mo</text>
          
          {/* Link line connecting them */}
          <path d="M48 101L48 109" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          
          {/* Tool 2: Copilot */}
          <rect x="36" y="109" width="208" height="36" rx="6" fill="#27272A" fillOpacity="0.5" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.5" />
          <rect x="44" y="117" width="20" height="20" rx="4" fill="#EF4444" fillOpacity="0.2" />
          <text x="72" y="131" fill="#FAFAFA" fontSize="10" fontWeight="500" fontFamily="sans-serif">GitHub Copilot</text>
          <text x="144" y="131" fill="#EF4444" fontSize="9" fontWeight="600" fontFamily="sans-serif">100% OVERLAP</text>
          <text x="204" y="131" fill="#EF4444" fontSize="10" fontWeight="500" fontFamily="sans-serif">-$19/mo</text>
          
          {/* Decorative scanner line */}
          <rect x="20" y="60" width="240" height="1" fill="#3B82F6" fillOpacity="0.5" />
          <rect x="20" y="60" width="240" height="40" fill="url(#scanGradient)" opacity="0.2" />
          
          <defs>
            <linearGradient id="scanGradient" x1="140" y1="60" x2="140" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      ),
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
      svgContent: (
        <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px]">
          {/* Grid lines */}
          {[40, 80, 120].map((y) => (
            <line key={y} x1="40" y1={y} x2="250" y2={y} stroke="#27272A" strokeWidth="1"/>
          ))}
          {/* Current bars (tall, blue) */}
          <rect x="60" y="55" width="32" height="105" rx="3" fill="#3B82F6" fillOpacity="0.7"/>
          <rect x="120" y="38" width="32" height="122" rx="3" fill="#3B82F6" fillOpacity="0.7"/>
          <rect x="180" y="70" width="32" height="90" rx="3" fill="#3B82F6" fillOpacity="0.7"/>
          {/* Optimized bars (shorter, green) */}
          <rect x="60" y="95" width="32" height="65" rx="3" fill="#10B981" fillOpacity="0.8"/>
          <rect x="120" y="80" width="32" height="80" rx="3" fill="#10B981" fillOpacity="0.8"/>
          <rect x="180" y="100" width="32" height="60" rx="3" fill="#10B981" fillOpacity="0.8"/>
          {/* Arrow down (savings indicator) */}
          <line x1="230" y1="55" x2="230" y2="125" stroke="#10B981" strokeWidth="2" strokeDasharray="3 2"/>
          <polygon points="226,120 234,120 230,130" fill="#10B981"/>
          <text x="242" y="96" fill="#10B981" fontSize="9" fontFamily="monospace">-38%</text>
          {/* Labels */}
          <text x="76" y="172" textAnchor="middle" fill="#52525B" fontSize="8">Cursor</text>
          <text x="136" y="172" textAnchor="middle" fill="#52525B" fontSize="8">Claude</text>
          <text x="196" y="172" textAnchor="middle" fill="#52525B" fontSize="8">GPT</text>
          {/* Legend */}
          <rect x="50" y="18" width="8" height="6" rx="1" fill="#3B82F6" fillOpacity="0.7"/>
          <text x="62" y="24" fill="#52525B" fontSize="7">Current</text>
          <rect x="100" y="18" width="8" height="6" rx="1" fill="#10B981" fillOpacity="0.8"/>
          <text x="112" y="24" fill="#52525B" fontSize="7">Optimized</text>
        </svg>
      ),
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
      svgContent: (
        <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px]">
          {/* Main savings card */}
          <rect x="50" y="30" width="180" height="110" rx="10" fill="#18181B" stroke="#27272A" strokeWidth="1.5"/>
          <rect x="50" y="30" width="180" height="3" rx="2" fill="#10B981" fillOpacity="0.8"/>
          {/* Dollar sign */}
          <circle cx="140" cy="80" r="28" fill="#10B981" fillOpacity="0.1" stroke="#10B981" strokeOpacity="0.3" strokeWidth="1"/>
          <text x="140" y="88" textAnchor="middle" fill="#10B981" fontSize="28" fontWeight="700">$</text>
          {/* Savings amount */}
          <text x="140" y="118" textAnchor="middle" fill="#FAFAFA" fontSize="11" fontWeight="600">Save 15–30%</text>
          <text x="140" y="130" textAnchor="middle" fill="#52525B" fontSize="8">on Anthropic &amp; OpenAI API credits</text>
          {/* Left perk */}
          <rect x="58" y="150" width="70" height="18" rx="4" fill="#10B981" fillOpacity="0.1" stroke="#10B981" strokeOpacity="0.25" strokeWidth="1"/>
          <text x="93" y="162" textAnchor="middle" fill="#10B981" fontSize="7">Volume sourced</text>
          {/* Right perk */}
          <rect x="152" y="150" width="70" height="18" rx="4" fill="#3B82F6" fillOpacity="0.1" stroke="#3B82F6" strokeOpacity="0.25" strokeWidth="1"/>
          <text x="187" y="162" textAnchor="middle" fill="#3B82F6" fontSize="7">Pre-qualified</text>
          {/* Sparkles */}
          <circle cx="60" cy="45" r="2" fill="#10B981" opacity="0.6"/>
          <circle cx="220" cy="55" r="2" fill="#3B82F6" opacity="0.6"/>
          <circle cx="215" cy="38" r="1.5" fill="#10B981" opacity="0.4"/>
          <circle cx="65" cy="58" r="1.5" fill="#3B82F6" opacity="0.4"/>
        </svg>
      ),
    },
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-sm font-semibold text-foreground tracking-tight">
              StackDown
            </span>
            <span className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 hidden sm:inline">
              by Credex
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a
              href="#audit"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Start audit
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <section className="pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="max-w-2xl">
            <p className="text-sm text-muted-foreground mb-4">Free audit / No login / 3 minutes</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.15] tracking-tight text-foreground mb-5">
              Your team is overspending<br />
              on AI tools.
            </h1>
            <p className="text-base text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Most startups waste 20-40% on duplicate subscriptions and oversized plans.
              StackDown finds the waste in under 3 minutes.
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
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#1E1E21] rounded-lg overflow-hidden mb-20">
          {[
            { value: '20-40%', label: 'average overspend on AI tools' },
            { value: '$2,400', label: 'median annual savings found' },
            { value: '3 min', label: 'to get your full audit report' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-card p-6 text-center">
              <p className="text-xl sm:text-2xl font-semibold text-foreground mono-num">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </section>

        {/* Tools We Audit */}
        <section className="pb-8 border-t border-border pt-12">
          <p className="text-xs text-muted-foreground uppercase tracking-widest text-center mb-6">
            Tools we audit
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(TOOLS).map(([, tool]) => (
              <span
                key={tool.name}
                className="px-3 py-1.5 rounded-md bg-card border border-border
                  text-xs text-muted-foreground font-medium"
              >
                {tool.name}
              </span>
            ))}
          </div>
        </section>
      </main>

      {/* Feature tabs */}
      <div className="border-t border-border">
        <Feature108
          badge="How it works"
          heading="From spend chaos to clarity in 3 steps"
          description="Add your tools, get your audit, see exactly where to save."
          tabs={featureTabs}
        />
      </div>

      {/* Audit Form */}
      <section id="audit" className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
              Start your audit
            </h2>
            <p className="text-sm text-muted-foreground">
              Add your tools, review, and get instant results.
            </p>
          </div>
          <AuditForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border bg-card/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Do I need to create an account?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">No. The entire audit runs without a login or email address. We only ask for your email after showing your full results — and it&apos;s completely optional.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Where does the pricing data come from?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Every plan price comes from each vendor&apos;s official pricing page, verified weekly. Sources and verification dates are documented in our public pricing data file.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Will you sell my data?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">No. Your email (if provided) is only used to send your audit report. For audits with significant savings, Credex may reach out once about their discounted AI credits program.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">How accurate are the recommendations?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">The audit uses rule-based logic, not AI guesses. Each recommendation includes specific reasoning you can verify yourself. Think of it as a rigorous starting point, not a final decision.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">What&apos;s Credex?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Credex helps startups access discounted AI infrastructure credits from companies that over-purchased. The discounts are real — typically 15-30% below retail. StackDown is built by Credex as a free tool to help you find your savings first.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">What tools do you support?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Currently: Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Google Gemini, and Windsurf. These cover the vast majority of AI tool spend for engineering teams.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Built for startups spending $200-$10,000/mo on AI tools. Powered by Credex.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors">
              Credex.rocks
            </a>
            <span className="text-[#27272A]">/</span>
            <a href="mailto:hello@credex.rocks" className="hover:text-muted-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
