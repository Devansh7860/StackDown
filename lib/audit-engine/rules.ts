// lib/audit-engine/rules.ts
// Per-tool evaluation logic — every rule must be financially defensible.

import type { ToolId, ToolInput, UseCase, ToolRecommendation } from './types';
import { getPlanById, getPlansForTool, TOOLS } from './tools';

interface EvalContext {
  teamSize: number;
  useCase: UseCase;
}

// ─── Helper ────────────────────────────────────────────────────────────────

function formatDollars(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

// ─── Individual tool evaluators ────────────────────────────────────────────

function evalCursor(tool: ToolInput, ctx: EvalContext): ToolRecommendation {
  const plan = getPlanById(tool.planId);
  const base: Omit<ToolRecommendation, 'recommendedAction' | 'projectedMonthlySpend' | 'monthlySavings' | 'annualSavings' | 'reasoning' | 'confidence' | 'credexRelevant'> = {
    toolId: tool.toolId,
    toolName: TOOLS.cursor.name,
    currentPlan: plan?.planName ?? tool.planId,
    currentMonthlySpend: tool.monthlySpend,
  };

  // Business → Pro downgrade for teams < 20 with no compliance need
  if (tool.planId === 'cursor_business' && ctx.teamSize < 20) {
    const projected = 20 * tool.seats;
    const savings = tool.monthlySpend - projected;
    return {
      ...base,
      recommendedAction: 'downgrade',
      recommendedPlan: 'cursor_pro',
      projectedMonthlySpend: Math.max(0, projected),
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reasoning: `Cursor Business adds SSO/SAML, admin dashboard, and invoice billing over Pro. For a team of ${ctx.teamSize} without compliance or SSO requirements, Pro at $20/seat delivers identical coding capabilities. Downgrading ${tool.seats} seat${tool.seats !== 1 ? 's' : ''} saves ${formatDollars(savings)}/mo (${formatDollars(savings * 12)}/yr).`,
      confidence: 'high',
      credexRelevant: savings > 0,
    };
  }

  // Seat over-provisioning: declared seats > team size
  if (tool.seats > ctx.teamSize && ctx.teamSize > 0) {
    const currentPricePerSeat = plan?.pricePerSeat ?? (tool.monthlySpend / tool.seats);
    const excessSeats = tool.seats - ctx.teamSize;
    const savings = excessSeats * currentPricePerSeat;
    return {
      ...base,
      recommendedAction: 'optimize',
      projectedMonthlySpend: Math.max(0, tool.monthlySpend - savings),
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reasoning: `You have ${tool.seats} Cursor seats but only ${ctx.teamSize} people on the team. ${excessSeats} seat${excessSeats !== 1 ? 's' : ''} appear unused — possibly from past hiring or trial accounts not cleaned up. Removing them saves ${formatDollars(savings)}/mo.`,
      confidence: 'medium',
      credexRelevant: false,
    };
  }

  // Already optimal
  return {
    ...base,
    recommendedAction: 'keep',
    projectedMonthlySpend: tool.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: `Cursor ${plan?.planName ?? ''} is well-matched for your team of ${ctx.teamSize}. No changes recommended.`,
    confidence: 'high',
    credexRelevant: false,
  };
}

function evalGithubCopilot(tool: ToolInput, ctx: EvalContext): ToolRecommendation {
  const plan = getPlanById(tool.planId);
  const base = {
    toolId: tool.toolId,
    toolName: TOOLS.github_copilot.name,
    currentPlan: plan?.planName ?? tool.planId,
    currentMonthlySpend: tool.monthlySpend,
  };

  // Business → Individual downgrade for small teams with no compliance need
  if (tool.planId === 'copilot_business' && ctx.teamSize < 20) {
    const projected = 10 * tool.seats;
    const savings = tool.monthlySpend - projected;
    return {
      ...base,
      recommendedAction: 'downgrade',
      recommendedPlan: 'copilot_individual',
      projectedMonthlySpend: Math.max(0, projected),
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reasoning: `Copilot Business adds org management, policy controls, and IP indemnity over Individual. For a team of ${ctx.teamSize} without an enterprise legal requirement, Individual at $10/seat covers the same coding features. Saves ${formatDollars(savings)}/mo across ${tool.seats} seat${tool.seats !== 1 ? 's' : ''}.`,
      confidence: 'high',
      credexRelevant: false,
    };
  }

  // Seat over-provisioning
  if (tool.seats > ctx.teamSize && ctx.teamSize > 0) {
    const currentPricePerSeat = plan?.pricePerSeat ?? (tool.monthlySpend / tool.seats);
    const excessSeats = tool.seats - ctx.teamSize;
    const savings = excessSeats * currentPricePerSeat;
    return {
      ...base,
      recommendedAction: 'optimize',
      projectedMonthlySpend: Math.max(0, tool.monthlySpend - savings),
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reasoning: `${tool.seats} Copilot seats for ${ctx.teamSize} people — ${excessSeats} seat${excessSeats !== 1 ? 's' : ''} are likely unused. Deprovision them to save ${formatDollars(savings)}/mo.`,
      confidence: 'medium',
      credexRelevant: false,
    };
  }

  return {
    ...base,
    recommendedAction: 'keep',
    projectedMonthlySpend: tool.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: `GitHub Copilot ${plan?.planName ?? ''} looks right-sized for your team.`,
    confidence: 'high',
    credexRelevant: false,
  };
}

function evalClaude(tool: ToolInput, ctx: EvalContext): ToolRecommendation {
  const plan = getPlanById(tool.planId);
  const base = {
    toolId: tool.toolId,
    toolName: TOOLS.claude.name,
    currentPlan: plan?.planName ?? tool.planId,
    currentMonthlySpend: tool.monthlySpend,
  };

  // Claude Team 5-seat minimum trap
  if (tool.planId === 'claude_team') {
    const minimumBilling = 5 * 30; // $150/mo minimum
    if (ctx.teamSize < 5) {
      // They're paying for seats they can't use
      const optimalCost = ctx.teamSize * 20; // Pro per actual users
      const savings = minimumBilling - optimalCost;
      return {
        ...base,
        recommendedAction: 'downgrade',
        recommendedPlan: 'claude_pro',
        projectedMonthlySpend: optimalCost,
        monthlySavings: Math.max(0, savings),
        annualSavings: Math.max(0, savings) * 12,
        reasoning: `Claude Team has a 5-seat minimum at $30/seat = ${formatDollars(minimumBilling)}/mo, but your team only has ${ctx.teamSize} people. You're paying for ${5 - ctx.teamSize} unused seat${5 - ctx.teamSize !== 1 ? 's' : ''}. Switching to Claude Pro at $20/seat × ${ctx.teamSize} = ${formatDollars(optimalCost)}/mo saves ${formatDollars(savings)}/mo (${formatDollars(savings * 12)}/yr).`,
        confidence: 'high',
        credexRelevant: savings > 0,
      };
    }
  }

  // Max plans — check if heavy usage actually justifies the cost
  if (tool.planId === 'claude_max_20x') {
    const proPlan = 20 * tool.seats;
    const savings = tool.monthlySpend - proPlan;
    if (savings > 0) {
      return {
        ...base,
        recommendedAction: 'downgrade',
        recommendedPlan: 'claude_pro',
        projectedMonthlySpend: proPlan,
        monthlySavings: Math.max(0, savings),
        annualSavings: Math.max(0, savings) * 12,
        reasoning: `Claude Max (20×) at $200/seat is justified only for extremely heavy usage (power users running 20× the Pro limit daily). For most teams, Pro at $20/seat provides sufficient capacity. If usage regularly hits Pro limits, try Max (5×) at $100/seat first. Potential savings: ${formatDollars(savings)}/mo.`,
        confidence: 'medium',
        credexRelevant: savings > 0,
      };
    }
  }

  return {
    ...base,
    recommendedAction: 'keep',
    projectedMonthlySpend: tool.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: `Claude ${plan?.planName ?? ''} looks appropriate for your team size and use case.`,
    confidence: 'high',
    credexRelevant: false,
  };
}

function evalChatGPT(tool: ToolInput, ctx: EvalContext): ToolRecommendation {
  const plan = getPlanById(tool.planId);
  const base = {
    toolId: tool.toolId,
    toolName: TOOLS.chatgpt.name,
    currentPlan: plan?.planName ?? tool.planId,
    currentMonthlySpend: tool.monthlySpend,
  };

  // Team plan for very small team — might not need admin console
  if (tool.planId === 'chatgpt_team' && tool.seats <= 3) {
    const projected = 20 * tool.seats;
    const savings = tool.monthlySpend - projected;
    return {
      ...base,
      recommendedAction: 'downgrade',
      recommendedPlan: 'chatgpt_plus',
      projectedMonthlySpend: Math.max(0, projected),
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reasoning: `ChatGPT Team at $30/seat adds an admin console and shared workspace — features that add limited value for ${tool.seats} people. Switching to individual Plus subscriptions at $20/seat saves ${formatDollars(savings)}/mo. Trade-off: lose shared workspace and training data exclusion (which Plus users can toggle individually).`,
      confidence: 'medium',
      credexRelevant: false,
    };
  }

  return {
    ...base,
    recommendedAction: 'keep',
    projectedMonthlySpend: tool.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: `ChatGPT ${plan?.planName ?? ''} is appropriately sized for your team.`,
    confidence: 'high',
    credexRelevant: false,
  };
}

function evalAnthropicApi(tool: ToolInput, _ctx: EvalContext): ToolRecommendation {
  const base = {
    toolId: tool.toolId,
    toolName: TOOLS.anthropic_api.name,
    currentPlan: 'Pay-as-you-go',
    currentMonthlySpend: tool.monthlySpend,
  };

  // API spend is usage-based — no plan-level optimization possible
  // Flag high spend as Credex-relevant (credits discount)
  if (tool.monthlySpend > 100) {
    return {
      ...base,
      recommendedAction: 'optimize',
      projectedMonthlySpend: tool.monthlySpend * 0.8, // 20% savings estimate via Credex
      monthlySavings: tool.monthlySpend * 0.2,
      annualSavings: tool.monthlySpend * 0.2 * 12,
      reasoning: `Your Anthropic API spend of ${formatDollars(tool.monthlySpend)}/mo is a candidate for Credex discounted credits. Credex sources API credits from companies that over-forecasted their usage, typically 15–30% below retail price. At your spend level, this could save ${formatDollars(tool.monthlySpend * 0.2)}–${formatDollars(tool.monthlySpend * 0.3)}/mo without any workflow changes.`,
      confidence: 'medium',
      credexRelevant: true,
    };
  }

  return {
    ...base,
    recommendedAction: 'keep',
    projectedMonthlySpend: tool.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: `Anthropic API spend of ${formatDollars(tool.monthlySpend)}/mo is usage-based — no seat optimization possible. Spend appears reasonable.`,
    confidence: 'high',
    credexRelevant: false,
  };
}

function evalOpenAiApi(tool: ToolInput, _ctx: EvalContext): ToolRecommendation {
  const base = {
    toolId: tool.toolId,
    toolName: TOOLS.openai_api.name,
    currentPlan: 'Pay-as-you-go',
    currentMonthlySpend: tool.monthlySpend,
  };

  if (tool.monthlySpend > 100) {
    return {
      ...base,
      recommendedAction: 'optimize',
      projectedMonthlySpend: tool.monthlySpend * 0.8,
      monthlySavings: tool.monthlySpend * 0.2,
      annualSavings: tool.monthlySpend * 0.2 * 12,
      reasoning: `OpenAI API spend of ${formatDollars(tool.monthlySpend)}/mo qualifies for Credex discounted credits at 15–30% below retail. Estimated savings: ${formatDollars(tool.monthlySpend * 0.2)}–${formatDollars(tool.monthlySpend * 0.3)}/mo with no architectural changes required.`,
      confidence: 'medium',
      credexRelevant: true,
    };
  }

  return {
    ...base,
    recommendedAction: 'keep',
    projectedMonthlySpend: tool.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: `OpenAI API spend of ${formatDollars(tool.monthlySpend)}/mo is usage-based and appears reasonable.`,
    confidence: 'high',
    credexRelevant: false,
  };
}

function evalGemini(tool: ToolInput, ctx: EvalContext): ToolRecommendation {
  const plan = getPlanById(tool.planId);
  const base = {
    toolId: tool.toolId,
    toolName: TOOLS.gemini.name,
    currentPlan: plan?.planName ?? tool.planId,
    currentMonthlySpend: tool.monthlySpend,
  };

  // Advanced plan — check if it's the right use case
  if (tool.planId === 'gemini_advanced' && ctx.useCase === 'coding') {
    return {
      ...base,
      recommendedAction: 'switch',
      projectedMonthlySpend: 0,
      monthlySavings: tool.monthlySpend,
      annualSavings: tool.monthlySpend * 12,
      reasoning: `Gemini Advanced (Google One AI Premium) bundles 2TB storage and deep Google Workspace integration. For a coding-focused team, these features are unlikely to drive significant value — coding workflows don't benefit much from Gmail/Docs AI integration. Consider cancelling and reallocating to your primary coding AI tool. Saves ${formatDollars(tool.monthlySpend)}/mo.`,
      confidence: 'medium',
      credexRelevant: false,
    };
  }

  return {
    ...base,
    recommendedAction: 'keep',
    projectedMonthlySpend: tool.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: `Gemini ${plan?.planName ?? ''} looks appropriate for your ${ctx.useCase} use case.`,
    confidence: 'high',
    credexRelevant: false,
  };
}

function evalWindsurf(tool: ToolInput, ctx: EvalContext): ToolRecommendation {
  const plan = getPlanById(tool.planId);
  const base = {
    toolId: tool.toolId,
    toolName: TOOLS.windsurf.name,
    currentPlan: plan?.planName ?? tool.planId,
    currentMonthlySpend: tool.monthlySpend,
  };

  // Teams plan for small team
  if (tool.planId === 'windsurf_team' && ctx.teamSize < 10) {
    const projected = 15 * tool.seats;
    const savings = tool.monthlySpend - projected;
    return {
      ...base,
      recommendedAction: 'downgrade',
      recommendedPlan: 'windsurf_pro',
      projectedMonthlySpend: Math.max(0, projected),
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reasoning: `Windsurf Teams at $35/seat adds admin controls and usage analytics over Pro. For a team of ${ctx.teamSize}, these management features rarely justify the ${formatDollars(35 - 15)}/seat premium. Windsurf Pro at $15/seat delivers the same Cascade agentic coding capabilities. Saves ${formatDollars(savings)}/mo.`,
      confidence: 'high',
      credexRelevant: savings > 0,
    };
  }

  return {
    ...base,
    recommendedAction: 'keep',
    projectedMonthlySpend: tool.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: `Windsurf ${plan?.planName ?? ''} is well-matched for your needs.`,
    confidence: 'high',
    credexRelevant: false,
  };
}

// ─── Main dispatcher ───────────────────────────────────────────────────────

const EVALUATORS: Partial<Record<ToolId, (tool: ToolInput, ctx: EvalContext) => ToolRecommendation>> = {
  cursor: evalCursor,
  github_copilot: evalGithubCopilot,
  claude: evalClaude,
  chatgpt: evalChatGPT,
  anthropic_api: evalAnthropicApi,
  openai_api: evalOpenAiApi,
  gemini: evalGemini,
  windsurf: evalWindsurf,
};

export function evaluateTool(tool: ToolInput, ctx: EvalContext): ToolRecommendation {
  const evaluator = EVALUATORS[tool.toolId];
  if (evaluator) return evaluator(tool, ctx);

  // Fallback for unrecognized tools
  return {
    toolId: tool.toolId,
    toolName: tool.toolId,
    currentPlan: tool.planId,
    currentMonthlySpend: tool.monthlySpend,
    recommendedAction: 'keep',
    projectedMonthlySpend: tool.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: 'No specific rules available for this tool.',
    confidence: 'low',
    credexRelevant: false,
  };
}
