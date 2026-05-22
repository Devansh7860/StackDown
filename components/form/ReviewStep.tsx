'use client';

import { TOOLS } from '@/lib/audit-engine/tools';
import type { ToolId, UseCase } from '@/lib/audit-engine/types';
import { Loader2 } from 'lucide-react';

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
        <h2 className="text-lg font-semibold text-[#FAFAFA] mb-1">
          Review your stack
        </h2>
        <p className="text-sm text-[#71717A]">
          Confirm everything looks right before we run your audit.
        </p>
      </div>

      {/* Tool list */}
      <div className="border border-[#27272A] rounded-lg overflow-hidden">
        <div className="px-4 py-2 bg-[#27272A] border-b border-[#3F3F46]">
          <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">Your AI Stack</p>
        </div>
        <div className="divide-y divide-[#27272A]">
          {tools.map((tool) => {
            const toolMeta = TOOLS[tool.toolId];
            return (
              <div key={tool.toolId} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{toolMeta.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-[#FAFAFA]">{toolMeta.name}</p>
                    <p className="text-xs text-[#71717A]">
                      {tool.planId ? tool.planId.split('_').slice(1).join(' ') : 'No plan selected'} · {tool.seats} seat{tool.seats !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-semibold text-[#FAFAFA]">
                    ${tool.monthlySpend.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#71717A]">/mo</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="px-4 py-3 bg-[#27272A] border-t border-[#3F3F46] space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#71717A]">
              Team · {teamSize} people · {useCase ? USE_CASE_LABELS[useCase] : '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#A1A1AA]">Monthly total</span>
            <span className="text-sm font-mono font-bold text-[#FAFAFA]">
              ${totalMonthly.toLocaleString()}<span className="text-[#71717A] font-normal">/mo</span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#71717A]">Annual</span>
            <span className="text-xs font-mono text-[#71717A]">
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
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg
          bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-60 disabled:cursor-not-allowed
          text-black font-semibold text-sm transition-all duration-200
          shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
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

      <p className="text-center text-xs text-[#71717A]">
        Your data is analyzed server-side and immediately linked to a private URL.
        No account created. Results are instant.
      </p>
    </div>
  );
}
