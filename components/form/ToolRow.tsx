'use client';

import { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOOLS, getPlansForTool } from '@/lib/audit-engine/tools';
import type { ToolId } from '@/lib/audit-engine/types';
import { ToolLogo } from '@/components/ui/tool-logo';

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
  onChange: (toolId: ToolId, updates: Partial<ToolEntry>) => void;
}

export function ToolRow({ toolId, entry, onAdd, onRemove, onChange }: ToolRowProps) {
  const [expanded, setExpanded] = useState(false);
  const tool = TOOLS[toolId];
  const plans = getPlansForTool(toolId);
  const isAdded = !!entry;

  const selectedPlan = plans.find(p => p.planId === entry?.planId);

  function handlePlanChange(planId: string) {
    const plan = plans.find(p => p.planId === planId);
    const seats = entry?.seats ?? 1;
    // Batch planId + auto-spend in one call to avoid stale closure clobber
    if (plan && !entry?.overrideSpend) {
      onChange(toolId, { planId, monthlySpend: plan.pricePerSeat * seats });
    } else {
      onChange(toolId, { planId });
    }
  }

  function handleSeatsChange(seats: number) {
    if (selectedPlan && !entry?.overrideSpend) {
      onChange(toolId, { seats, monthlySpend: selectedPlan.pricePerSeat * seats });
    } else {
      onChange(toolId, { seats });
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-300 relative overflow-hidden',
        isAdded
          ? 'border border-[#3B82F6]/30 bg-[#3B82F6]/5 shadow-[0_0_20px_rgba(59,130,246,0.05)]'
          : 'border border-border bg-card hover:border-muted hover:bg-secondary'
      )}
    >
      {isAdded && (
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-30" />
      )}
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
          <ToolLogo toolId={toolId} size={22} className={isAdded ? "opacity-100" : "opacity-60"} />
          <div>
            <p className={cn("text-sm font-medium transition-colors", isAdded ? "text-[#3B82F6]" : "text-foreground")}>{tool.name}</p>
            <p className="text-xs text-muted-foreground">{tool.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdded && (
            <>
              <span className="text-xs text-[#3B82F6] font-medium hidden sm:block">
                {selectedPlan?.planName ?? 'Plan selected'} · ${entry.monthlySpend}/mo
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-muted-foreground transition-transform duration-200',
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
                className="p-1 rounded text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
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
                bg-[#FAFAFA] text-[#09090B] border border-transparent
                hover:bg-[#E4E4E7] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Expanded detail form */}
      {isAdded && expanded && (
        <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
          {/* Plan selector */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Plan
            </label>
            <div className="relative">
              <select
                id={`plan-${toolId}`}
                value={entry.planId}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="w-full bg-muted border border-muted rounded-md px-3 py-2 text-sm
                  text-foreground appearance-none cursor-pointer
                  focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6]
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
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {selectedPlan && selectedPlan.features.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                {selectedPlan.features.slice(0, 2).join(' · ')}
              </p>
            )}
          </div>

          {/* Seats + Spend row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor={`seats-${toolId}`}>
                Seats
              </label>
              <input
                id={`seats-${toolId}`}
                type="number"
                min={1}
                value={entry.seats}
                onChange={(e) => handleSeatsChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-muted border border-muted rounded-md px-3 py-2 text-sm
                  text-foreground focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6]
                  transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor={`spend-${toolId}`}>
                Monthly spend ($)
              </label>
              <input
                id={`spend-${toolId}`}
                type="number"
                min={0}
                step={0.01}
                value={entry.monthlySpend}
                onChange={(e) => onChange(toolId, { monthlySpend: parseFloat(e.target.value) || 0 })}
                disabled={!entry.overrideSpend && !!selectedPlan && selectedPlan.pricePerSeat > 0}
                className={cn(
                  'w-full bg-muted border border-muted rounded-md px-3 py-2 text-sm',
                  'text-foreground focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6]',
                  'transition-colors font-mono',
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
                onChange={(e) => onChange(toolId, { overrideSpend: e.target.checked })}
                className="w-3.5 h-3.5 accent-[#3B82F6]"
              />
              <label htmlFor={`override-${toolId}`} className="text-xs text-muted-foreground cursor-pointer hover:text-muted-foreground transition-colors">
                Override — I pay a different amount
                {!entry.overrideSpend && (
                  <span className="ml-1 text-muted-foreground">
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
