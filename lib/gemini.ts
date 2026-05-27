// lib/gemini.ts
// AI audit summary generation with graceful fallback using Google Gemini.

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AuditResult, AuditInput } from './audit-engine/types';

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

function buildPrompt(result: AuditResult, input: AuditInput): string {
  const toolList = input.tools.map(t => `${t.toolId} ($${t.monthlySpend}/mo)`).join(', ');
  const recs = result.recommendations
    .filter(r => r.monthlySavings > 0)
    .map(r => `${r.toolName}: ${r.recommendedAction}, save $${Math.round(r.monthlySavings)}/mo`)
    .join('; ');

  return `You are a highly analytical fractional CFO reviewing an AI tool spend audit for a ${input.teamSize}-person team focused on ${input.useCase}.

Their current stack: ${toolList}
Total current spend: $${Math.round(result.totalCurrentSpend)}/mo
Key actionable insights: ${recs || 'Stack is perfectly right-sized.'}
Total potential savings: $${Math.round(result.totalMonthlySavings)}/mo (${result.savingsPercentage}%)

Write a concise, 2-3 sentence personalized executive summary. Be extremely direct. State the most financially impactful change they must make immediately (e.g., 'Cancel Tool X in favor of Tool Y' or 'Downgrade 5 seats of Tool Z'). Sound like a rigorous financial advisor. Do not use bullet points, conversational filler, or headers. Use exact dollar amounts.`;
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
  if (!genAI) {
    console.warn('GEMINI_API_KEY not set — using fallback summary');
    return fallbackSummary(result, input);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    const response = await Promise.race([
      model.generateContent(buildPrompt(result, input)),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout')), 8000)
      ),
    ]);

    const text = response.response.text();
    if (text) return text.trim();
    return fallbackSummary(result, input);
  } catch (err) {
    console.error('Gemini API failed, using fallback:', err);
    return fallbackSummary(result, input);
  }
}
