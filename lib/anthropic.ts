// lib/anthropic.ts
// AI audit summary generation with graceful fallback.

import Anthropic from '@anthropic-ai/sdk';
import type { AuditResult, AuditInput } from './audit-engine/types';

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

function buildPrompt(result: AuditResult, input: AuditInput): string {
  const toolList = input.tools.map(t => `${t.toolId} ($${t.monthlySpend}/mo)`).join(', ');
  const recs = result.recommendations
    .filter(r => r.monthlySavings > 0)
    .map(r => `${r.toolName}: ${r.recommendedAction}, save $${Math.round(r.monthlySavings)}/mo`)
    .join('; ');

  return `You are a financial analyst reviewing an AI tool spend audit for a ${input.teamSize}-person team focused on ${input.useCase}.

Their current stack: ${toolList}
Total current spend: $${Math.round(result.totalCurrentSpend)}/mo
Key recommendations: ${recs || 'stack looks optimized'}
Total potential savings: $${Math.round(result.totalMonthlySavings)}/mo (${result.savingsPercentage}%)

Write a 2-3 sentence personalized audit summary. Be direct and specific — include actual dollar amounts. Sound like a financial advisor, not a chatbot. Do not use bullet points or headers.`;
}

function fallbackSummary(result: AuditResult, input: AuditInput): string {
  if (result.alreadyOptimal) {
    return `Your ${input.teamSize}-person team's AI stack looks well-optimized at $${Math.round(result.totalCurrentSpend)}/mo. All tools appear right-sized with no significant overlaps or plan mismatches detected. Keep an eye on seat counts as your team grows.`;
  }

  const biggestWin = result.recommendations
    .filter(r => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  const overlapNote = result.overlaps.length > 0
    ? ` Your team is also running ${result.overlaps[0].toolNames.join(' and ')} simultaneously — a redundancy worth addressing.`
    : '';

  return `Your ${input.teamSize}-person team is spending $${Math.round(result.totalCurrentSpend)}/mo on AI tools, with $${Math.round(result.totalMonthlySavings)}/mo ($${Math.round(result.totalAnnualSavings)}/yr) in identifiable savings.${biggestWin ? ` The biggest opportunity is ${biggestWin.toolName} — ${biggestWin.reasoning.split('.')[0]}.` : ''}${overlapNote}`;
}

export async function generateAuditSummary(
  result: AuditResult,
  input: AuditInput
): Promise<string> {
  if (!client) {
    console.warn('ANTHROPIC_API_KEY not set — using fallback summary');
    return fallbackSummary(result, input);
  }

  try {
    const response = await Promise.race([
      client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 200,
        messages: [{ role: 'user', content: buildPrompt(result, input) }],
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Anthropic timeout')), 8000)
      ),
    ]);

    const text = response.content[0];
    if (text.type === 'text') return text.text;
    return fallbackSummary(result, input);
  } catch (err) {
    console.error('Anthropic API failed, using fallback:', err);
    return fallbackSummary(result, input);
  }
}
