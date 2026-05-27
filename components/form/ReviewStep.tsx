'use client';

import { TOOLS } from '@/lib/audit-engine/tools';
import type { ToolId, UseCase } from '@/lib/audit-engine/types';
import { Loader2 } from 'lucide-react';
import { ToolLogo } from '@/components/ui/tool-logo';

interface ToolEntry {
  toolId: ToolId;
  planId: string;
  seats: number;
  monthlySpend: number;
}

interface ReviewStepProps {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase | '';
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const USE_CASE_LABELS: Record<string, string> = {
  coding: 'Coding',
  writing: 'Writing',
  data: 'Data Analysis',
  research: 'Research',
  mixed: 'Mixed',
};

export function ReviewStep({
  tools,
  teamSize,
  useCase,
  onSubmit,
  onBack,
  isSubmitting,
}: ReviewStepProps) {
  const totalMonthly = tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const totalAnnual = totalMonthly * 12;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Review your stack
        </h2>
        <p className="text-sm text-muted-foreground">
          Confirm everything looks right before we run your audit.
        </p>
      </div>

      {/* Tool list */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-2 bg-muted border-b border-muted">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your AI Stack</p>
        </div>
        <div className="divide-y divide-[#27272A]">
          {tools.map((tool) => {
            const toolMeta = TOOLS[tool.toolId];
            return (
              <div key={tool.toolId} className="flex items-center justify-between px-4 py-3 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <ToolLogo toolId={tool.toolId} size={18} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{toolMeta.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {tool.planId ? tool.planId.split('_').slice(1).join(' ') : 'No plan selected'} · {tool.seats} seat{tool.seats !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-semibold text-foreground">
                    ${tool.monthlySpend.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="px-4 py-3 bg-muted border-t border-muted space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Team · {teamSize} people · {useCase ? USE_CASE_LABELS[useCase] : '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monthly total</span>
            <span className="text-sm font-mono font-bold text-foreground">
              ${totalMonthly.toLocaleString()}<span className="text-muted-foreground font-normal">/mo</span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Annual</span>
            <span className="text-xs font-mono text-muted-foreground">
              ${totalAnnual.toLocaleString()}/yr
            </span>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="button"
        id="submit-audit-btn"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
          bg-[#FAFAFA] hover:bg-[#E4E4E7] disabled:opacity-50 disabled:cursor-not-allowed
          text-[#09090B] font-semibold text-sm transition-all duration-300
          shadow-[0_0_20px_rgba(250,250,250,0.1)] hover:shadow-[0_0_30px_rgba(250,250,250,0.15)]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing your stack...
          </>
        ) : (
          'Get My Audit →'
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Your data is analyzed server-side and immediately linked to a private URL.
        No account created. Results are instant.
      </p>
    </div>
  );
}
