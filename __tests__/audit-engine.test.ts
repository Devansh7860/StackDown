import { describe, it, expect } from 'vitest';
import { runAudit } from '@/lib/audit-engine/index';

describe('audit engine — per-tool rules', () => {
  it('recommends downgrading Cursor Business to Pro for team < 20', () => {
    const result = runAudit({
      tools: [{ toolId: 'cursor', planId: 'cursor_business', seats: 5, monthlySpend: 200 }],
      teamSize: 5,
      useCase: 'coding',
    });
    const rec = result.recommendations[0];
    expect(rec.recommendedAction).toBe('downgrade');
    expect(rec.recommendedPlan).toBe('cursor_pro');
    expect(rec.monthlySavings).toBe(100); // (40-20) * 5
  });

  it('keeps Cursor Pro as-is for coding team', () => {
    const result = runAudit({
      tools: [{ toolId: 'cursor', planId: 'cursor_pro', seats: 3, monthlySpend: 60 }],
      teamSize: 3,
      useCase: 'coding',
    });
    expect(result.alreadyOptimal).toBe(true);
    expect(result.totalMonthlySavings).toBe(0);
  });

  it('flags Claude Team for team smaller than 5 — minimum seat trap', () => {
    const result = runAudit({
      tools: [{ toolId: 'claude', planId: 'claude_team', seats: 5, monthlySpend: 150 }],
      teamSize: 2,
      useCase: 'writing',
    });
    const rec = result.recommendations.find(r => r.toolId === 'claude');
    expect(rec?.recommendedAction).toBe('downgrade');
    expect(rec?.monthlySavings).toBeGreaterThan(0);
    // 5 * $30 = $150 current, 2 * $20 = $40 optimal → $110 savings
    expect(rec?.monthlySavings).toBe(110);
  });

  it('classifies savings > $500/mo as high tier', () => {
    const result = runAudit({
      tools: [
        { toolId: 'cursor', planId: 'cursor_business', seats: 20, monthlySpend: 800 },
        { toolId: 'github_copilot', planId: 'copilot_business', seats: 20, monthlySpend: 380 },
      ],
      teamSize: 20,
      useCase: 'coding',
    });
    expect(result.savingsTier).toBe('high');
    expect(result.totalMonthlySavings).toBeGreaterThan(500);
  });

  it('annual savings = 12 × monthly savings', () => {
    const result = runAudit({
      tools: [{ toolId: 'cursor', planId: 'cursor_business', seats: 10, monthlySpend: 400 }],
      teamSize: 10,
      useCase: 'coding',
    });
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it('reasoning strings are specific — contain $ and are > 30 chars', () => {
    const result = runAudit({
      tools: [{ toolId: 'cursor', planId: 'cursor_business', seats: 5, monthlySpend: 200 }],
      teamSize: 5,
      useCase: 'coding',
    });
    const reasoning = result.recommendations[0].reasoning;
    expect(reasoning).toContain('$');
    expect(reasoning.length).toBeGreaterThan(30);
  });

  it('flags Gemini Advanced as low-value for coding teams', () => {
    const result = runAudit({
      tools: [{ toolId: 'gemini', planId: 'gemini_advanced', seats: 3, monthlySpend: 60 }],
      teamSize: 5,
      useCase: 'coding',
    });
    const rec = result.recommendations[0];
    expect(rec.recommendedAction).toBe('switch');
    expect(rec.monthlySavings).toBe(60);
  });
});

describe('audit engine — totals and percentages', () => {
  it('calculates totalCurrentSpend correctly', () => {
    const result = runAudit({
      tools: [
        { toolId: 'cursor', planId: 'cursor_pro', seats: 5, monthlySpend: 100 },
        { toolId: 'github_copilot', planId: 'copilot_individual', seats: 5, monthlySpend: 50 },
      ],
      teamSize: 5,
      useCase: 'coding',
    });
    expect(result.totalCurrentSpend).toBe(150);
  });

  it('optimizedSpend = currentSpend - monthlySavings', () => {
    const result = runAudit({
      tools: [{ toolId: 'cursor', planId: 'cursor_business', seats: 5, monthlySpend: 200 }],
      teamSize: 5,
      useCase: 'coding',
    });
    expect(result.totalOptimizedSpend).toBe(result.totalCurrentSpend - result.totalMonthlySavings);
  });
});
