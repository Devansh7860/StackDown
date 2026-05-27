'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  ArrowDownRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { AuditResult, ToolRecommendation, OverlapWarning } from '@/lib/audit-engine/types';
import { ToolLogo } from '@/components/ui/tool-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { useCountUp } from '@/hooks/useCountUp';
import { LeadCapture } from '@/components/form/LeadCapture';

interface AuditData {
  shareToken: string;
  result: AuditResult;
  aiSummary: string;
}

function fmt(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}

const ACTION_LABELS: Record<string, string> = {
  downgrade: 'Downgrade',
  cancel: 'Cancel',
  switch: 'Switch',
  consolidate: 'Consolidate',
  optimize: 'Optimize',
  keep: 'Keep',
};

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  subtext,
  highlight,
}: {
  label: string;
  value: string;
  subtext?: string;
  highlight?: 'green' | 'red' | 'neutral';
}) {
  const colorMap = {
    green: 'text-[#22C55E]',
    red: 'text-[#EF4444]',
    neutral: 'text-foreground',
  };

  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-xl p-6 shadow-sm">
      {highlight === 'green' && (
         <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent opacity-50" />
      )}
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">{label}</p>
      <p className={cn('text-3xl font-semibold mono-num tracking-tight', colorMap[highlight ?? 'neutral'])}>
        {value}
      </p>
      {subtext && <p className="text-xs text-muted-foreground mt-1.5 font-medium">{subtext}</p>}
    </div>
  );
}

// ─── Tool Row ────────────────────────────────────────────────────────────────

function ToolBreakdownRow({ rec }: { rec: ToolRecommendation }) {
  const hasSavings = rec.monthlySavings > 0;
  const optimizedCost = rec.currentMonthlySpend - rec.monthlySavings;

  return (
    <div className="border-b border-border last:border-b-0 p-4 hover:bg-card transition-colors">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left side: Logo + Name */}
        <div className="flex items-center gap-3 min-w-0 w-[200px] flex-shrink-0">
          <ToolLogo toolId={rec.toolId} size={20} className="flex-shrink-0 opacity-80" />
          <div className="min-w-0">
            <span className="block text-sm text-foreground font-medium truncate">{rec.toolName}</span>
            <span className="block text-[11px] text-muted-foreground truncate mt-0.5">{rec.currentPlan}</span>
          </div>
        </div>

        {/* Center: The Ledger (Current -> Optimized -> Savings) */}
        <div className="hidden sm:flex flex-1 items-center justify-end gap-10">
          <div className="w-20 text-right">
            <span className="text-sm mono-num text-muted-foreground">{fmt(rec.currentMonthlySpend)}</span>
          </div>
          
          <ArrowDownRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-50" />
          
          <div className="w-20 text-right">
            <span className={cn(
              "text-sm mono-num font-medium",
              hasSavings ? "text-foreground" : "text-muted-foreground"
            )}>
              {fmt(optimizedCost)}
            </span>
          </div>
          
          <div className="w-24 text-right">
            <span className={cn(
              'text-sm mono-num font-medium',
              hasSavings ? 'text-[#10B981]' : 'text-muted-foreground'
            )}>
              {hasSavings ? `-${fmt(rec.monthlySavings)}` : '--'}
            </span>
          </div>
        </div>

        {/* Right side: Action Tag */}
        <div className="w-24 flex justify-end flex-shrink-0">
          <span className={cn(
            'text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wider',
              rec.recommendedAction === 'keep'
              ? 'text-muted-foreground bg-secondary border border-border'
              : rec.recommendedAction === 'cancel'
                ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20'
                : 'text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20'
          )}>
            {ACTION_LABELS[rec.recommendedAction]}
          </span>
        </div>
      </div>
      
      {/* Reasoning Sub-row */}
      {(rec.recommendedAction !== 'keep' || rec.reasoning.length > 50) && (
        <div className="mt-3 pl-8 sm:pl-[244px] pr-24">
           <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg border border-border/50">
             <div className="flex-1">
               {rec.recommendedAction !== 'keep' && (
                 <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground mb-1">
                   Action to take:
                 </p>
               )}
               <p className="text-[12px] text-muted-foreground leading-relaxed">
                 {rec.reasoning}
               </p>
               {rec.credexRelevant && (
                <p className="text-[10px] text-[#3B82F6] mt-2 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  Qualifies for Credex Volume Discount
                </p>
               )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

// ─── Overlap callout ─────────────────────────────────────────────────────────

function OverlapCallout({ overlap }: { overlap: OverlapWarning }) {
  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#EF4444] to-transparent opacity-40" />
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-sm text-foreground font-medium">{overlap.toolNames.join(' & ')}</h4>
            <span className="text-[11px] mono-num font-medium text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded">
              Est. Waste: {fmt(overlap.estimatedWaste)}/mo
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{overlap.suggestedAction}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function AuditResultClient() {
  const params = useParams();
  const token = params?.token as string;

  const [data, setData] = useState<AuditData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;

    const cacheKey = `audit_${token}`;

    // 1. Check sessionStorage (same-tab fast path)
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setData(JSON.parse(cached) as AuditData);
        return;
      }
    } catch { /* no sessionStorage */ }

    // 2. Check localStorage (new tab, same browser — 7-day cache)
    try {
      const lsCached = localStorage.getItem(cacheKey);
      const lsTs = localStorage.getItem(`${cacheKey}_ts`);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (lsCached && lsTs && Date.now() - Number(lsTs) < sevenDays) {
        const parsed = JSON.parse(lsCached) as AuditData;
        setData(parsed);
        // Backfill sessionStorage for repeated access
        try { sessionStorage.setItem(cacheKey, lsCached); } catch { /* noop */ }
        return;
      }
    } catch { /* no localStorage */ }

    // 3. Fall through to Supabase API
    fetch(`/api/audit/${token}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then((d: AuditData) => {
        setData(d);
        // Cache for future loads
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(d));
          localStorage.setItem(cacheKey, JSON.stringify(d));
          localStorage.setItem(`${cacheKey}_ts`, String(Date.now()));
        } catch { /* noop */ }
      })
      .catch(() => setNotFound(true));
  }, [token]);

  const animatedSavings = useCountUp(data?.result.totalMonthlySavings ?? 0);

  // Chart data: per-tool before/after comparison
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.result.recommendations
      .filter(r => r.currentMonthlySpend > 0)
      .map(r => ({
        name: r.toolName,
        current: r.currentMonthlySpend,
        optimized: r.currentMonthlySpend - r.monthlySavings,
      }));
  }, [data]);

  async function copyLink() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'StackDown Audit', url });
        return;
      } catch (err) {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm font-medium text-foreground">Audit not found</p>
          <p className="text-xs text-muted-foreground">This link may have expired or is invalid.</p>
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-muted-foreground">
            <ArrowLeft className="w-3 h-3" /> Run a new audit
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-border border-t-[#FAFAFA] rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground">Loading audit...</p>
        </div>
      </div>
    );
  }

  const { result, aiSummary } = data;
  const optimizedSpend = result.totalCurrentSpend - result.totalMonthlySavings;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="no-print sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="w-3 h-3" />
            <span className="font-semibold text-foreground text-sm">StackDown</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => window.print()}
              className="no-print flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium
                bg-card border border-border text-muted-foreground
                hover:border-border hover:text-muted-foreground transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={copyLink}
              className="no-print flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium
                bg-card border border-border text-muted-foreground
                hover:border-border hover:text-muted-foreground transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Share'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* KPI Strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          <KpiCard
            label="Current spend"
            value={`${fmt(result.totalCurrentSpend)}/mo`}
            subtext={`${fmt(result.totalCurrentSpend * 12)}/yr`}
          />
          <KpiCard
            label="Optimized spend"
            value={`${fmt(optimizedSpend)}/mo`}
            subtext={`${fmt(optimizedSpend * 12)}/yr`}
          />
          <KpiCard
            label="Total savings"
            value={`${fmt(animatedSavings)}/mo`}
            subtext={`${result.savingsPercentage}% reduction`}
            highlight="green"
          />
        </motion.div>

        {/* Executive Summary (AI) */}
        {aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="relative overflow-hidden bg-gradient-to-b from-[#111113] to-[#09090B] border border-border rounded-xl p-6 shadow-sm"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-40" />
            <div className="flex items-start gap-4">
               <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                 <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
               </div>
               <div>
                 <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Executive Briefing</p>
                 <p className="text-[14px] text-foreground leading-relaxed font-medium">
                   {aiSummary}
                 </p>
               </div>
            </div>
          </motion.div>
        )}

        {/* Spend comparison chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-b from-[#111113] to-[#09090B] border border-border rounded-xl p-6 shadow-sm"
          >
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-6 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]" /> Current Spend
              <span className="text-muted-foreground">vs</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Optimized
            </p>
            <div className="h-[220px] min-h-[220px]" style={{ minHeight: 220 }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barGap={2} barCategoryGap="25%">
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#52525B', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#3F3F46', fontSize: 10 }}
                    tickFormatter={(v: number) => `$${v}`}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: 'hsl(var(--foreground))',
                      padding: '8px 12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px', fontWeight: 500 }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={((value: number | string, name: string) => [
                      `$${Math.round(Number(value)).toLocaleString()}`,
                      name === 'current' ? 'Current' : 'Optimized',
                    ]) as never}
                    cursor={{ fill: 'rgba(150,150,150,0.1)' }}
                  />
                  <Bar dataKey="current" radius={[4, 4, 0, 0]} maxBarSize={36}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill="#3B82F6" fillOpacity={0.8} />
                    ))}
                  </Bar>
                  <Bar dataKey="optimized" radius={[4, 4, 0, 0]} maxBarSize={36}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.optimized < entry.current ? '#10B981' : '#3F3F46'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Overlaps */}
        {result.overlaps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
              Overlapping tools
            </p>
            {result.overlaps.map((overlap, i) => (
              <OverlapCallout key={i} overlap={overlap} />
            ))}
          </motion.div>
        )}

        {/* Tool breakdown table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
              Per-tool breakdown
            </p>
            <div className="hidden sm:flex items-center gap-8 text-[10px] text-muted-foreground uppercase tracking-wider pr-16">
              <span className="w-20 text-right">Current</span>
              <span className="w-3" />
              <span className="w-20 text-right">Optimized</span>
              <span className="w-20 text-right">Savings</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {result.recommendations.map(rec => (
              <ToolBreakdownRow key={rec.toolId} rec={rec} />
            ))}
          </div>
        </motion.div>



        {/* Credex CTA — minimal */}
        {result.totalMonthlySavings > 0 && (
          <div className="flex items-center justify-between py-3 px-4 rounded-md bg-card border border-border">
            <p className="text-xs text-muted-foreground">
              Credex offers 15-30% off AI API credits for qualifying teams.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              Learn more <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Lead Capture */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LeadCapture token={token} totalSavings={result.totalMonthlySavings} />
        </motion.div>

        {/* Footer link */}
        <div className="text-center pb-8">
          <Link href="/#audit" className="text-xs text-muted-foreground hover:text-muted-foreground transition-colors">
            Run another audit
          </Link>
        </div>
      </main>
    </div>
  );
}
