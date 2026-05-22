'use client';

import { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOOLS, PLANS, getPlansForTool } from '@/lib/audit-engine/tools';
import type { ToolId } from '@/lib/audit-engine/types';

interface ToolEntry {
  toolId: ToolId;
  planId: string;
  seats: number;
  monthlySpend: number;
  overrideSpend: boolean;
}

interface ToolRowProps {
  toolId: ToolId;
  entry?: ToolEntry;
  onAdd: (toolId: ToolId) => void;
  onRemove: (toolId: ToolId) => void;
  onChange: (toolId: ToolId, field: keyof ToolEntry, value: string | number | boolean) => void;
}

export function ToolRow({ toolId, entry, onAdd, onRemove, onChange }: ToolRowProps) {
  const [expanded, setExpanded] = useState(false);
  const tool = TOOLS[toolId];
  const plans = getPlansForTool(toolId);
  const isAdded = !!entry;

  const selectedPlan = plans.find(p => p.planId === entry?.planId);

  function handlePlanChange(planId: string) {
    onChange(toolId, 'planId', planId);
    const plan = plans.find(p => p.planId === planId);
    if (plan && !entry?.overrideSpend) {
      const seats = entry?.seats ?? 1;
      const autoSpend = plan.pricePerSeat * seats;
      onChange(toolId, 'monthlySpend', autoSpend);
    }
  }

  function handleSeatsChange(seats: number) {
    onChange(toolId, 'seats', seats);
    if (selectedPlan && !entry?.overrideSpend) {
      onChange(toolId, 'monthlySpend', selectedPlan.pricePerSeat * seats);
    }
  }

  return (
    <div
      className={cn(
        'border rounded-lg transition-all duration-200',
        isAdded
          ? 'border-[#22C55E]/40 bg-[#18181B]'
          : 'border-[#27272A] bg-[#18181B] hover:border-[#3F3F46]'
      )}
    >
      {/* Tool header row */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => {
          if (isAdded) {
            setExpanded(prev => !prev);
          }
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{tool.icon}</span>
          <div>
            <p className="text-sm font-medium text-[#FAFAFA]">{tool.name}</p>
            <p className="text-xs text-[#71717A]">{tool.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdded && (
            <>
              <span className="text-xs text-[#22C55E] font-medium hidden sm:block">
                {selectedPlan?.planName ?? 'Plan selected'} · ${entry.monthlySpend}/mo
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-[#71717A] transition-transform duration-200',
                  expanded && 'rotate-180'
                )}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(toolId);
                  setExpanded(false);
                }}
                className="p-1 rounded text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                aria-label={`Remove ${tool.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          {!isAdded && (
            <button
              type="button"
              id={`add-tool-${toolId}`}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(toolId);
                setExpanded(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30
                hover:bg-[#22C55E]/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Expanded detail form */}
      {isAdded && expanded && (
        <div className="px-4 pb-4 border-t border-[#27272A] pt-4 space-y-4">
          {/* Plan selector */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Plan
            </label>
            <div className="relative">
              <select
                id={`plan-${toolId}`}
                value={entry.planId}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="w-full bg-[#27272A] border border-[#3F3F46] rounded-md px-3 py-2 text-sm
                  text-[#FAFAFA] appearance-none cursor-pointer
                  focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E]
                  transition-colors"
              >
                <option value="">Select plan...</option>
                {plans.map(plan => (
                  <option key={plan.planId} value={plan.planId}>
                    {plan.planName}
                    {plan.pricePerSeat > 0 ? ` ($${plan.pricePerSeat}/seat/mo)` : plan.isEnterprise ? ' (custom pricing)' : ' (Free)'}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
            </div>
            {selectedPlan && selectedPlan.features.length > 0 && (
              <p className="mt-1 text-xs text-[#71717A] line-clamp-1">
                {selectedPlan.features.slice(0, 2).join(' · ')}
              </p>
            )}
          </div>

          {/* Seats + Spend row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5" htmlFor={`seats-${toolId}`}>
                Seats
              </label>
              <input
                id={`seats-${toolId}`}
                type="number"
                min={1}
                value={entry.seats}
                onChange={(e) => handleSeatsChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#27272A] border border-[#3F3F46] rounded-md px-3 py-2 text-sm
                  text-[#FAFAFA] focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E]
                  transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5" htmlFor={`spend-${toolId}`}>
                Monthly spend ($)
              </label>
              <input
                id={`spend-${toolId}`}
                type="number"
                min={0}
                step={0.01}
                value={entry.monthlySpend}
                onChange={(e) => onChange(toolId, 'monthlySpend', parseFloat(e.target.value) || 0)}
                disabled={!entry.overrideSpend && !!selectedPlan && selectedPlan.pricePerSeat > 0}
                className={cn(
                  'w-full bg-[#27272A] border border-[#3F3F46] rounded-md px-3 py-2 text-sm',
                  'text-[#FAFAFA] focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E]',
                  'transition-colors',
                  !entry.overrideSpend && selectedPlan && selectedPlan.pricePerSeat > 0 && 'opacity-60 cursor-not-allowed'
                )}
              />
            </div>
          </div>

          {/* Auto-calc hint + override toggle */}
          {selectedPlan && selectedPlan.pricePerSeat > 0 && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`override-${toolId}`}
                checked={entry.overrideSpend}
                onChange={(e) => onChange(toolId, 'overrideSpend', e.target.checked)}
                className="w-3.5 h-3.5 accent-[#22C55E]"
              />
              <label htmlFor={`override-${toolId}`} className="text-xs text-[#71717A] cursor-pointer">
                Override — I pay a different amount
                {!entry.overrideSpend && (
                  <span className="ml-1 text-[#A1A1AA]">
                    (auto: {entry.seats} × ${selectedPlan.pricePerSeat} = ${entry.seats * selectedPlan.pricePerSeat}/mo)
                  </span>
                )}
              </label>
            </div>
          )}

          {/* Min seats warning for Claude Team */}
          {selectedPlan?.planId === 'claude_team' && entry.seats < 5 && (
            <p className="text-xs text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded px-3 py-2">
              ⚠️ Claude Team has a 5-seat minimum. You may be paying for {5 - entry.seats} unused seat{5 - entry.seats !== 1 ? 's' : ''}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
