// lib/audit-engine/index.ts
// Main runAudit() — pure function, no side effects, no async.

import type { AuditInput, AuditResult, ToolRecommendation } from './types';
import { evaluateTool } from './rules';
import { detectOverlaps } from './overlaps';

export function runAudit(input: AuditInput): AuditResult {
  // 1. Evaluate each tool individually
  const recommendations: ToolRecommendation[] = input.tools.map(tool =>
    evaluateTool(tool, { teamSize: input.teamSize, useCase: input.useCase })
  );

  // 2. Detect cross-tool overlaps
  const overlaps = detectOverlaps(input.tools, input.useCase);

  // 3. Aggregate savings — use the max of (per-tool savings, overlap waste)
  //    to avoid double-counting (e.g. Cursor+Copilot overlap already implies cancel Copilot)
  const overlapWasteByTool = new Map<string, number>();
  for (const overlap of overlaps) {
    for (const toolId of overlap.tools) {
      const current = overlapWasteByTool.get(toolId) ?? 0;
      overlapWasteByTool.set(toolId, Math.max(current, overlap.estimatedWaste));
    }
  }

  // Final savings per tool = max(rule-based savings, overlap waste for that tool)
  const finalRecommendations = recommendations.map(rec => {
    const overlapSavings = overlapWasteByTool.get(rec.toolId) ?? 0;
    if (overlapSavings > rec.monthlySavings) {
      return {
        ...rec,
        monthlySavings: overlapSavings,
        annualSavings: overlapSavings * 12,
        // If overlap is driving savings, mark as 'cancel' or 'consolidate'
        recommendedAction: rec.recommendedAction === 'keep'
          ? ('consolidate' as const)
          : rec.recommendedAction,
      };
    }
    return rec;
  });

  const totalMonthlySavings = finalRecommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );

  const totalCurrentSpend = input.tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const totalOptimizedSpend = Math.max(0, totalCurrentSpend - totalMonthlySavings);

  const savingsPercentage =
    totalCurrentSpend > 0
      ? Math.round((totalMonthlySavings / totalCurrentSpend) * 100)
      : 0;

  const savingsTier =
    totalMonthlySavings > 500
      ? 'high'
      : totalMonthlySavings > 100
      ? 'moderate'
      : totalMonthlySavings > 0
      ? 'low'
      : 'optimal';

  return {
    recommendations: finalRecommendations,
    overlaps,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    savingsTier,
    alreadyOptimal: totalMonthlySavings === 0 && overlaps.length === 0,
    toolCount: input.tools.length,
    totalCurrentSpend,
    totalOptimizedSpend,
    savingsPercentage,
  };
}

export type { AuditInput, AuditResult };
