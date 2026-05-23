import { describe, it, expect } from 'vitest';
import { detectOverlaps } from '@/lib/audit-engine/overlaps';

describe('overlap detection', () => {
  it('detects Cursor + Copilot as high severity for coding', () => {
    const overlaps = detectOverlaps(
      [
        { toolId: 'cursor', planId: 'cursor_pro', seats: 5, monthlySpend: 100 },
        { toolId: 'github_copilot', planId: 'copilot_business', seats: 5, monthlySpend: 95 },
      ],
      'coding'
    );
    expect(overlaps.length).toBeGreaterThan(0);
    const cursorCopilot = overlaps.find(
      o => o.tools.includes('cursor') && o.tools.includes('github_copilot')
    );
    expect(cursorCopilot?.severity).toBe('high');
  });

  it('Cursor + Copilot overlap: estimated waste = full Copilot spend', () => {
    const overlaps = detectOverlaps(
      [
        { toolId: 'cursor', planId: 'cursor_pro', seats: 5, monthlySpend: 100 },
        { toolId: 'github_copilot', planId: 'copilot_business', seats: 5, monthlySpend: 95 },
      ],
      'coding'
    );
    const cursorCopilot = overlaps.find(
      o => o.tools.includes('cursor') && o.tools.includes('github_copilot')
    );
    expect(cursorCopilot?.estimatedWaste).toBe(95); // full Copilot cost
  });

  it('detects Claude + ChatGPT as medium severity for writing', () => {
    const overlaps = detectOverlaps(
      [
        { toolId: 'claude', planId: 'claude_pro', seats: 3, monthlySpend: 60 },
        { toolId: 'chatgpt', planId: 'chatgpt_plus', seats: 3, monthlySpend: 60 },
      ],
      'writing'
    );
    const claudeChatgpt = overlaps.find(
      o => o.tools.includes('claude') && o.tools.includes('chatgpt')
    );
    expect(claudeChatgpt).toBeDefined();
    expect(claudeChatgpt?.severity).toBe('medium');
  });

  it('no overlaps for a single tool', () => {
    const overlaps = detectOverlaps(
      [{ toolId: 'cursor', planId: 'cursor_pro', seats: 5, monthlySpend: 100 }],
      'coding'
    );
    expect(overlaps.length).toBe(0);
  });

  it('Claude + ChatGPT overlap not triggered for coding-only use case', () => {
    const overlaps = detectOverlaps(
      [
        { toolId: 'claude', planId: 'claude_pro', seats: 3, monthlySpend: 60 },
        { toolId: 'chatgpt', planId: 'chatgpt_plus', seats: 3, monthlySpend: 60 },
      ],
      'coding' // Claude+ChatGPT rule only applies to writing/research/mixed
    );
    const claudeChatgpt = overlaps.find(
      o => o.tools.includes('claude') && o.tools.includes('chatgpt')
    );
    expect(claudeChatgpt).toBeUndefined();
  });

  it('detects Cursor + Windsurf overlap', () => {
    const overlaps = detectOverlaps(
      [
        { toolId: 'cursor', planId: 'cursor_pro', seats: 3, monthlySpend: 60 },
        { toolId: 'windsurf', planId: 'windsurf_pro', seats: 3, monthlySpend: 45 },
      ],
      'coding'
    );
    const found = overlaps.find(
      o => o.tools.includes('cursor') && o.tools.includes('windsurf')
    );
    expect(found?.severity).toBe('high');
    // saves the cheaper one (windsurf at $45)
    expect(found?.estimatedWaste).toBe(45);
  });
});
