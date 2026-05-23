'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuditResult, ToolRecommendation, OverlapWarning } from '@/lib/audit-engine/types';
import { TOOLS } from '@/lib/audit-engine/tools';
import { useCountUp } from '@/hooks/useCountUp';
import confetti from 'canvas-confetti';

interface AuditData {
  shareToken: string;
  result: AuditResult;
  aiSummary: string;
}

function fmt(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}

const ACTION_LABELS: Record<string, string> = {
  downgrade: 'Downgrade plan',
  cancel: 'Cancel',
  switch: 'Consider cancelling',
  consolidate: 'Consolidate',
  optimize: 'Optimize spend',
  keep: 'Keep as-is',
};

const ACTION_COLORS: Record<string, string> = {
  downgrade: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30',
  cancel: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
  switch: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
  consolidate: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
  optimize: 'text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/30',
  keep: 'text-[#71717A] bg-[#27272A] border-[#3F3F46]',
};

const SEVERITY_COLORS: Record<string, string> = {
  high: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
  medium: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
  low: 'text-[#71717A] bg-[#27272A] border-[#3F3F46]',
};

function RecommendationCard({ rec }: { rec: ToolRecommendation }) {
  const tool = TOOLS[rec.toolId];
  const hasSavings = rec.monthlySavings > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'border rounded-xl p-5 space-y-3',
        hasSavings ? 'border-[#22C55E]/30 bg-[#18181B]' : 'border-[#27272A] bg-[#18181B]'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{tool?.icon}</span>
          <div>
            <p className="text-sm font-semibold text-[#FAFAFA]">{rec.toolName}</p>
            <p className="text-xs text-[#71717A]">{rec.currentPlan}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasSavings && (
            <div className="text-right">
              <p className="text-sm font-mono font-bold text-[#22C55E]">{fmt(rec.monthlySavings)}/mo</p>
              <p className="text-xs text-[#71717A]">{fmt(rec.annualSavings)}/yr</p>
            </div>
          )}
          <span className={cn('text-xs font-medium px-2 py-1 rounded border', ACTION_COLORS[rec.recommendedAction] ?? ACTION_COLORS.keep)}>
            {ACTION_LABELS[rec.recommendedAction]}
          </span>
        </div>
      </div>
      <p className="text-sm text-[#A1A1AA] leading-relaxed">{rec.reasoning}</p>
      <div className="flex items-center gap-2">
        <div className={cn(
          'w-1.5 h-1.5 rounded-full',
          rec.confidence === 'high' ? 'bg-[#22C55E]' : rec.confidence === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#71717A]'
        )} />
        <span className="text-xs text-[#52525B]">{rec.confidence} confidence</span>
        {rec.credexRelevant && (
          <span className="ml-auto text-xs text-[#A78BFA] bg-[#A78BFA]/10 border border-[#A78BFA]/30 px-2 py-0.5 rounded-full">
            ✦ Credex can amplify this
          </span>
        )}
      </div>
    </motion.div>
  );
}

function OverlapCard({ overlap }: { overlap: OverlapWarning }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-[#27272A] rounded-xl p-5 space-y-3 bg-[#18181B]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
          <p className="text-sm font-semibold text-[#FAFAFA]">{overlap.toolNames.join(' + ')}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-mono font-semibold text-[#F59E0B]">~{fmt(overlap.estimatedWaste)}/mo</span>
          <span className={cn('text-xs font-medium px-2 py-1 rounded border', SEVERITY_COLORS[overlap.severity])}>
            {overlap.severity}
          </span>
        </div>
      </div>
      <p className="text-sm text-[#A1A1AA] leading-relaxed">{overlap.description}</p>
      <div className="p-3 rounded-lg bg-[#27272A] border border-[#3F3F46]">
        <p className="text-xs font-medium text-[#71717A] uppercase tracking-wider mb-1">Suggested action</p>
        <p className="text-sm text-[#FAFAFA]">{overlap.suggestedAction}</p>
      </div>
    </motion.div>
  );
}

export function AuditResultClient() {
  const params = useParams();
  const token = params?.token as string;

  const [data, setData] = useState<AuditData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    try {
      const cached = sessionStorage.getItem(`audit_${token}`);
      if (cached) {
        setData(JSON.parse(cached) as AuditData);
        return;
      }
    } catch { /* no sessionStorage */ }

    fetch(`/api/audit/${token}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then((d: AuditData) => setData(d))
      .catch(() => setNotFound(true));
  }, [token]);

  useEffect(() => {
    if (data?.result && data.result.totalMonthlySavings > 1000) {
      // Fire confetti from the bottom center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#22C55E', '#A78BFA', '#FAFAFA'],
      });
    }
  }, [data]);

  const animatedSavings = useCountUp(data?.result.totalMonthlySavings ?? 0);

  async function copyLink() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SpendLens AI Audit',
          text: 'Check out my AI spend optimization results:',
          url,
        });
        return;
      } catch (err) {
        // If user cancelled, just return. If error, fall back to clipboard
        if ((err as Error).name === 'AbortError') return;
      }
    }

    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-4xl">🔍</p>
          <p className="text-lg font-semibold text-[#FAFAFA]">Audit not found</p>
          <p className="text-sm text-[#71717A]">This link may have expired or is invalid.</p>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#22C55E] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Run a new audit
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#09090B] dot-grid-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#71717A]">Loading your audit...</p>
        </div>
      </div>
    );
  }

  const { result, aiSummary } = data;
  const hasIssues = result.totalMonthlySavings > 0 || result.overlaps.length > 0;
  const actionableRecs = result.recommendations.filter(r => r.recommendedAction !== 'keep');
  const keepRecs = result.recommendations.filter(r => r.recommendedAction === 'keep');

  return (
    <div className="min-h-screen bg-[#09090B] dot-grid-bg">
      <nav className="sticky top-0 z-50 border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-[#71717A]" />
            <span className="font-bold text-[#FAFAFA]">Spend<span className="text-[#22C55E]">Lens</span></span>
          </Link>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              bg-[#27272A] border border-[#3F3F46] text-[#A1A1AA]
              hover:bg-[#3F3F46] hover:text-[#FAFAFA] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Share audit'}
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          {hasIssues ? (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-[#22C55E]/10 border border-[#22C55E]/30 text-xs font-medium text-[#22C55E] mb-2">
                <TrendingDown className="w-3.5 h-3.5" />
                {result.savingsTier === 'high' ? 'Significant savings found' :
                 result.savingsTier === 'moderate' ? 'Moderate savings found' : 'Some savings found'}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text">
                {fmt(animatedSavings)}<span className="text-2xl font-normal text-[#71717A]">/mo</span>
              </h1>
              <p className="text-[#A1A1AA]">
                {fmt(result.totalAnnualSavings)}/yr · {result.savingsPercentage}% of {fmt(result.totalCurrentSpend)}/mo
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-[#27272A] border border-[#3F3F46] text-xs font-medium text-[#71717A] mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                Stack looks optimized
              </div>
              <h1 className="text-4xl font-bold text-[#FAFAFA]">You&apos;re in good shape</h1>
              <p className="text-[#A1A1AA]">No major savings found. Current spend: {fmt(result.totalCurrentSpend)}/mo.</p>
            </>
          )}
        </motion.div>

        {aiSummary && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-5 rounded-xl border border-[#27272A] bg-[#18181B] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#71717A] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-[#A78BFA]" />
              AI Analysis
            </div>
            <p className="text-sm text-[#FAFAFA] leading-relaxed">{aiSummary}</p>
          </motion.div>
        )}

        {result.overlaps.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-[#71717A] uppercase tracking-widest">
              Tool Overlaps ({result.overlaps.length})
            </h2>
            {result.overlaps.map((overlap, i) => <OverlapCard key={i} overlap={overlap} />)}
          </section>
        )}

        {actionableRecs.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-[#71717A] uppercase tracking-widest">
              Recommendations ({actionableRecs.length})
            </h2>
            {actionableRecs.map(rec => <RecommendationCard key={rec.toolId} rec={rec} />)}
          </section>
        )}

        {keepRecs.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-[#71717A] uppercase tracking-widest">No changes needed</h2>
            <div className="border border-[#27272A] rounded-xl divide-y divide-[#27272A]">
              {keepRecs.map(rec => {
                const tool = TOOLS[rec.toolId];
                return (
                  <div key={rec.toolId} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{tool?.icon}</span>
                      <span className="text-sm text-[#A1A1AA]">{rec.toolName}</span>
                      <span className="text-xs text-[#52525B]">· {rec.currentPlan}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {hasIssues && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-[#A78BFA]/30 bg-[#A78BFA]/5 space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#FAFAFA]">Want to save more with Credex?</p>
              <p className="text-sm text-[#A1A1AA]">
                Credex helps startups source discounted AI API credits — typically 15–30% below retail.
                If you&apos;re spending on Anthropic or OpenAI APIs, we can help you save immediately.
              </p>
            </div>
            <a href="https://credex.in" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
                bg-[#A78BFA] hover:bg-[#9333EA] text-white transition-colors">
              Talk to Credex <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        )}

        <div className="text-center pb-8">
          <Link href="/#audit" className="text-sm text-[#71717A] hover:text-[#A1A1AA] transition-colors">
            ← Run another audit
          </Link>
        </div>
      </main>
    </div>
  );
}
