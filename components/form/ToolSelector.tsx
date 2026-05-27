'use client';

import { cn } from '@/lib/utils';
import { TOOL_IDS } from '@/lib/audit-engine/tools';
import type { ToolId } from '@/lib/audit-engine/types';
import { ToolRow } from './ToolRow';
import { DollarSign } from 'lucide-react';

interface ToolEntry {
  toolId: ToolId;
  planId: string;
  seats: number;
  monthlySpend: number;
  overrideSpend: boolean;
}

interface ToolSelectorProps {
  tools: ToolEntry[];
  onChange: (tools: ToolEntry[]) => void;
}

export function ToolSelector({ tools, onChange }: ToolSelectorProps) {
  const addedIds = new Set(tools.map(t => t.toolId));

  const totalMonthlySpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);

  function handleAdd(toolId: ToolId) {
    if (addedIds.has(toolId)) return;
    onChange([
      ...tools,
      { toolId, planId: '', seats: 1, monthlySpend: 0, overrideSpend: false },
    ]);
  }

  function handleRemove(toolId: ToolId) {
    onChange(tools.filter(t => t.toolId !== toolId));
  }

  function handleChange(
    toolId: ToolId,
    updates: Partial<ToolEntry>
  ) {
    onChange(
      tools.map(t =>
        t.toolId === toolId ? { ...t, ...updates } : t
      )
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">
          What AI tools does your team pay for?
        </h2>
        <p className="text-sm text-muted-foreground">
          Click <strong className="text-muted-foreground">Add</strong> next to each tool you subscribe to, then fill in the plan details.
        </p>
      </div>

      <div className="space-y-2">
        {TOOL_IDS.map(toolId => (
          <ToolRow
            key={toolId}
            toolId={toolId}
            entry={tools.find(t => t.toolId === toolId)}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* Running total */}
      {tools.length > 0 && (
        <div className={cn(
          'flex items-center justify-between p-4 rounded-xl mt-4',
          'border border-border bg-gradient-to-r from-[#111113] to-[#09090B] shadow-sm'
        )}>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-[#FAFAFA]/5 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="font-medium text-foreground">
              {tools.length} tool{tools.length !== 1 ? 's' : ''} tracked
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-mono font-semibold text-foreground tracking-tight">
              ${totalMonthlySpend.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground ml-1 font-medium">/mo</span>
          </div>
        </div>
      )}

      {tools.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          No tools added yet — click <strong className="text-muted-foreground">Add</strong> next to any tool above.
        </p>
      )}
    </div>
  );
}
