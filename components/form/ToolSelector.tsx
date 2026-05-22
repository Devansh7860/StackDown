'use client';

import { cn } from '@/lib/utils';
import { TOOL_IDS, TOOLS } from '@/lib/audit-engine/tools';
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
    field: keyof ToolEntry,
    value: string | number | boolean
  ) {
    onChange(
      tools.map(t =>
        t.toolId === toolId ? { ...t, [field]: value } : t
      )
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-[#FAFAFA] mb-1">
          What AI tools does your team pay for?
        </h2>
        <p className="text-sm text-[#71717A]">
          Click <strong className="text-[#A1A1AA]">Add</strong> next to each tool you subscribe to, then fill in the plan details.
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
          'flex items-center justify-between p-3 rounded-lg',
          'border border-[#3F3F46] bg-[#27272A]'
        )}>
          <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
            <DollarSign className="w-4 h-4 text-[#71717A]" />
            <span>
              {tools.length} tool{tools.length !== 1 ? 's' : ''} tracked
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm font-mono font-semibold text-[#FAFAFA]">
              ${totalMonthlySpend.toLocaleString()}
            </span>
            <span className="text-xs text-[#71717A] ml-1">/mo</span>
          </div>
        </div>
      )}

      {tools.length === 0 && (
        <p className="text-center text-sm text-[#71717A] py-4">
          No tools added yet — click <strong className="text-[#A1A1AA]">Add</strong> next to any tool above.
        </p>
      )}
    </div>
  );
}
