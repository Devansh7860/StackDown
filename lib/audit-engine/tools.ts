// lib/audit-engine/tools.ts
// Verified pricing data for all supported AI tools
// IMPORTANT: Verify all prices at vendor pricing pages before submission.
// Last verified: 2026-05-22

import type { ToolId, UseCase } from './types';

export interface PlanDefinition {
  planId: string;
  toolId: ToolId;
  toolName: string;
  planName: string;
  pricePerSeat: number;       // $/seat/month
  minSeats: number;
  maxSeats?: number;          // undefined = unlimited
  features: string[];         // key features for comparison
  bestFor: UseCase[];         // which use cases this plan serves well
  isEnterprise: boolean;      // true = custom pricing, can't compare directly
  sourceUrl: string;          // official pricing page for verification
}

export const TOOL_IDS: ToolId[] = [
  'cursor',
  'github_copilot',
  'claude',
  'chatgpt',
  'anthropic_api',
  'openai_api',
  'gemini',
  'windsurf',
];

export const TOOLS: Record<ToolId, { name: string; icon: string; category: string; description: string }> = {
  cursor: {
    name: 'Cursor',
    icon: '⌨️',
    category: 'IDE / Code Editor',
    description: 'AI-first code editor with Composer, multi-file editing, and agent mode',
  },
  github_copilot: {
    name: 'GitHub Copilot',
    icon: '🤖',
    category: 'Code Completion',
    description: 'AI pair programmer integrated into VS Code, JetBrains, and more',
  },
  claude: {
    name: 'Claude',
    icon: '🧠',
    category: 'General AI Assistant',
    description: 'Anthropic\'s conversational AI — strong at writing, coding, and analysis',
  },
  chatgpt: {
    name: 'ChatGPT',
    icon: '💬',
    category: 'General AI Assistant',
    description: 'OpenAI\'s flagship chat interface with GPT-4o, DALL-E, and custom GPTs',
  },
  anthropic_api: {
    name: 'Anthropic API',
    icon: '🔌',
    category: 'API Access',
    description: 'Direct programmatic access to Claude models — pay per token',
  },
  openai_api: {
    name: 'OpenAI API',
    icon: '🔌',
    category: 'API Access',
    description: 'Direct programmatic access to GPT-4o and other OpenAI models — pay per token',
  },
  gemini: {
    name: 'Gemini',
    icon: '✨',
    category: 'General AI Assistant',
    description: 'Google\'s multimodal AI with deep Workspace integration',
  },
  windsurf: {
    name: 'Windsurf',
    icon: '🏄',
    category: 'IDE / Code Editor',
    description: 'Codeium\'s AI-powered IDE with Cascade agentic coding',
  },
};

export const PLANS: PlanDefinition[] = [
  // ============ CURSOR ============
  // Source: https://cursor.com/pricing
  {
    planId: 'cursor_hobby',
    toolId: 'cursor',
    toolName: 'Cursor',
    planName: 'Hobby',
    pricePerSeat: 0,
    minSeats: 1,
    features: ['2,000 completions/month', '50 slow premium requests'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://cursor.com/pricing',
  },
  {
    planId: 'cursor_pro',
    toolId: 'cursor',
    toolName: 'Cursor',
    planName: 'Pro',
    pricePerSeat: 20,
    minSeats: 1,
    features: ['Unlimited Tab completions', 'Unlimited Auto mode', '$20 monthly premium credits'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://cursor.com/pricing',
  },
  {
    planId: 'cursor_pro_plus',
    toolId: 'cursor',
    toolName: 'Cursor',
    planName: 'Pro+',
    pricePerSeat: 60,
    minSeats: 1,
    features: ['Everything in Pro', '$60 monthly premium credits'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://cursor.com/pricing',
  },
  {
    planId: 'cursor_ultra',
    toolId: 'cursor',
    toolName: 'Cursor',
    planName: 'Ultra',
    pricePerSeat: 200,
    minSeats: 1,
    features: ['Everything in Pro+', '$200 monthly premium credits', 'Priority feature access'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://cursor.com/pricing',
  },
  {
    planId: 'cursor_teams',
    toolId: 'cursor',
    toolName: 'Cursor',
    planName: 'Teams',
    pricePerSeat: 40,
    minSeats: 1,
    features: ['Everything in Pro', 'SSO/SAML', 'Centralized billing', 'Admin dashboard', 'Usage policies', 'Zero data retention'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://cursor.com/pricing',
  },
  {
    planId: 'cursor_enterprise',
    toolId: 'cursor',
    toolName: 'Cursor',
    planName: 'Enterprise',
    pricePerSeat: 0, // custom pricing
    minSeats: 1,
    features: ['Everything in Business', 'Custom contracts', 'Dedicated support', 'Custom model access'],
    bestFor: ['coding'],
    isEnterprise: true,
    sourceUrl: 'https://cursor.com/pricing',
  },

  // ============ GITHUB COPILOT ============
  // Source: https://github.com/features/copilot#pricing
  {
    planId: 'copilot_free',
    toolId: 'github_copilot',
    toolName: 'GitHub Copilot',
    planName: 'Free',
    pricePerSeat: 0,
    minSeats: 1,
    features: ['2,000 code completions/mo', 'Select models', 'Evaluation use'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://github.com/features/copilot#pricing',
  },
  {
    planId: 'copilot_pro',
    toolId: 'github_copilot',
    toolName: 'GitHub Copilot',
    planName: 'Pro',
    pricePerSeat: 10,
    minSeats: 1,
    features: ['Unlimited code completions', 'Copilot Chat', '$10 AI Credits/mo'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://github.com/features/copilot#pricing',
  },
  {
    planId: 'copilot_pro_plus',
    toolId: 'github_copilot',
    toolName: 'GitHub Copilot',
    planName: 'Pro+',
    pricePerSeat: 39,
    minSeats: 1,
    features: ['Everything in Pro', 'Higher usage limits', 'Claude Opus and o3 access'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://github.com/features/copilot#pricing',
  },
  {
    planId: 'copilot_business',
    toolId: 'github_copilot',
    toolName: 'GitHub Copilot',
    planName: 'Business',
    pricePerSeat: 19,
    minSeats: 1,
    features: ['Everything in Individual', 'Organization management', 'Policy controls', 'Audit logs', 'IP indemnity'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://github.com/features/copilot#pricing',
  },
  {
    planId: 'copilot_enterprise',
    toolId: 'github_copilot',
    toolName: 'GitHub Copilot',
    planName: 'Enterprise',
    pricePerSeat: 39,
    minSeats: 1,
    features: ['Everything in Business', 'Custom fine-tuned models', 'Org-level knowledge bases', 'Docset integration'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://github.com/features/copilot#pricing',
  },

  // ============ CLAUDE ============
  // Source: https://www.anthropic.com/pricing
  {
    planId: 'claude_free',
    toolId: 'claude',
    toolName: 'Claude',
    planName: 'Free',
    pricePerSeat: 0,
    minSeats: 1,
    features: ['Basic usage', 'Limited messages', 'Claude 3.5 Haiku'],
    bestFor: ['writing', 'research'],
    isEnterprise: false,
    sourceUrl: 'https://www.anthropic.com/pricing',
  },
  {
    planId: 'claude_pro',
    toolId: 'claude',
    toolName: 'Claude',
    planName: 'Pro',
    pricePerSeat: 20,
    minSeats: 1,
    features: ['5x more usage vs Free', 'Priority access', 'Early feature access', 'Claude 3.5 Sonnet & Opus'],
    bestFor: ['writing', 'research', 'coding'],
    isEnterprise: false,
    sourceUrl: 'https://www.anthropic.com/pricing',
  },
  {
    planId: 'claude_max_5x',
    toolId: 'claude',
    toolName: 'Claude',
    planName: 'Max (5×)',
    pricePerSeat: 100,
    minSeats: 1,
    features: ['5× the usage limits of Pro', 'Highest priority access', 'All Pro features'],
    bestFor: ['coding', 'data'],
    isEnterprise: false,
    sourceUrl: 'https://www.anthropic.com/pricing',
  },
  {
    planId: 'claude_max_20x',
    toolId: 'claude',
    toolName: 'Claude',
    planName: 'Max (20×)',
    pricePerSeat: 200,
    minSeats: 1,
    features: ['20× the usage limits of Pro', 'Highest priority access', 'All Pro features'],
    bestFor: ['coding', 'data'],
    isEnterprise: false,
    sourceUrl: 'https://www.anthropic.com/pricing',
  },
  {
    planId: 'claude_team',
    toolId: 'claude',
    toolName: 'Claude',
    planName: 'Team',
    pricePerSeat: 30,
    minSeats: 5,  // IMPORTANT: 5-seat minimum
    features: ['Higher usage than Pro', 'Admin console', 'Team management', '200K context window', 'Usage statistics'],
    bestFor: ['writing', 'coding', 'mixed'],
    isEnterprise: false,
    sourceUrl: 'https://www.anthropic.com/pricing',
  },
  {
    planId: 'claude_enterprise',
    toolId: 'claude',
    toolName: 'Claude',
    planName: 'Enterprise',
    pricePerSeat: 0, // custom pricing
    minSeats: 1,
    features: ['SSO/SAML', 'Role-based access', 'Audit logs', 'Custom data retention', 'Expanded context'],
    bestFor: ['mixed'],
    isEnterprise: true,
    sourceUrl: 'https://www.anthropic.com/pricing',
  },

  // ============ CHATGPT ============
  // Source: https://openai.com/chatgpt/pricing
  {
    planId: 'chatgpt_free',
    toolId: 'chatgpt',
    toolName: 'ChatGPT',
    planName: 'Free',
    pricePerSeat: 0,
    minSeats: 1,
    features: ['GPT-4o mini', 'Limited GPT-4o access', 'Basic DALL-E'],
    bestFor: ['writing', 'research'],
    isEnterprise: false,
    sourceUrl: 'https://openai.com/chatgpt/pricing',
  },
  {
    planId: 'chatgpt_go',
    toolId: 'chatgpt',
    toolName: 'ChatGPT',
    planName: 'Go',
    pricePerSeat: 8,
    minSeats: 1,
    features: ['Higher limits than Free', 'Standard response times'],
    bestFor: ['writing', 'research'],
    isEnterprise: false,
    sourceUrl: 'https://openai.com/chatgpt/pricing',
  },
  {
    planId: 'chatgpt_plus',
    toolId: 'chatgpt',
    toolName: 'ChatGPT',
    planName: 'Plus',
    pricePerSeat: 20,
    minSeats: 1,
    features: ['GPT-4o full access', 'DALL-E 3', 'Advanced Data Analysis', 'Custom GPTs', 'GPT-4o with canvas'],
    bestFor: ['writing', 'research', 'data'],
    isEnterprise: false,
    sourceUrl: 'https://openai.com/chatgpt/pricing',
  },
  {
    planId: 'chatgpt_pro',
    toolId: 'chatgpt',
    toolName: 'ChatGPT',
    planName: 'Pro',
    pricePerSeat: 200,
    minSeats: 1,
    features: ['Unlimited access', 'Advanced reasoning models', 'Pro mode', 'Highest usage limits'],
    bestFor: ['research', 'coding', 'data'],
    isEnterprise: false,
    sourceUrl: 'https://openai.com/chatgpt/pricing',
  },
  {
    planId: 'chatgpt_team',
    toolId: 'chatgpt',
    toolName: 'ChatGPT',
    planName: 'Team',
    pricePerSeat: 30,
    minSeats: 2,
    features: ['Everything in Plus', 'Admin console', 'Shared workspace', 'Higher message limits', 'Data excluded from training'],
    bestFor: ['writing', 'mixed'],
    isEnterprise: false,
    sourceUrl: 'https://openai.com/chatgpt/pricing',
  },
  {
    planId: 'chatgpt_enterprise',
    toolId: 'chatgpt',
    toolName: 'ChatGPT',
    planName: 'Enterprise',
    pricePerSeat: 0, // custom pricing
    minSeats: 1,
    features: ['Unlimited GPT-4o', 'SSO', 'Admin portal', 'Custom data retention', 'Extended context', 'API access'],
    bestFor: ['mixed'],
    isEnterprise: true,
    sourceUrl: 'https://openai.com/chatgpt/pricing',
  },

  // ============ ANTHROPIC API ============
  // Source: https://www.anthropic.com/pricing#api
  {
    planId: 'anthropic_api_payg',
    toolId: 'anthropic_api',
    toolName: 'Anthropic API',
    planName: 'Pay-as-you-go',
    pricePerSeat: 0,  // usage-based — entered as monthly spend
    minSeats: 1,
    features: ['Direct API access', 'All Claude models', 'Pay per token', 'No seat licenses'],
    bestFor: ['coding', 'data'],
    isEnterprise: false,
    sourceUrl: 'https://www.anthropic.com/pricing#api',
  },

  // ============ OPENAI API ============
  // Source: https://openai.com/pricing
  {
    planId: 'openai_api_payg',
    toolId: 'openai_api',
    toolName: 'OpenAI API',
    planName: 'Pay-as-you-go',
    pricePerSeat: 0,  // usage-based — entered as monthly spend
    minSeats: 1,
    features: ['Direct API access', 'GPT-4o, GPT-4o mini, o1', 'Pay per token', 'No seat licenses'],
    bestFor: ['coding', 'data'],
    isEnterprise: false,
    sourceUrl: 'https://openai.com/pricing',
  },

  // ============ GEMINI ============
  // Source: https://one.google.com/about/plans
  {
    planId: 'gemini_free',
    toolId: 'gemini',
    toolName: 'Gemini',
    planName: 'Free',
    pricePerSeat: 0,
    minSeats: 1,
    features: ['Gemini 1.5 Flash', 'Basic features', 'Limited Gemini Pro access'],
    bestFor: ['research'],
    isEnterprise: false,
    sourceUrl: 'https://one.google.com/about/plans',
  },
  {
    planId: 'gemini_advanced',
    toolId: 'gemini',
    toolName: 'Gemini',
    planName: 'Advanced (Google One AI Premium)',
    pricePerSeat: 19.99,
    minSeats: 1,
    features: ['Gemini 1.5 Pro Ultra', 'Google One AI Premium', '2TB storage', 'Workspace integration (Docs, Sheets, Gmail)', 'Gemini in Meet'],
    bestFor: ['data', 'research'],
    isEnterprise: false,
    sourceUrl: 'https://one.google.com/about/plans',
  },
  {
    planId: 'gemini_api',
    toolId: 'gemini',
    toolName: 'Gemini',
    planName: 'API (Pay-as-you-go)',
    pricePerSeat: 0,  // usage-based
    minSeats: 1,
    features: ['Direct API access', 'All Gemini models', 'Pay per token'],
    bestFor: ['coding', 'data'],
    isEnterprise: false,
    sourceUrl: 'https://ai.google.dev/pricing',
  },

  // ============ WINDSURF ============
  // Source: https://codeium.com/pricing
  {
    planId: 'windsurf_free',
    toolId: 'windsurf',
    toolName: 'Windsurf',
    planName: 'Free',
    pricePerSeat: 0,
    minSeats: 1,
    features: ['Limited flow actions/month', 'Basic chat', 'Autocomplete'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://codeium.com/pricing',
  },
  {
    planId: 'windsurf_pro',
    toolId: 'windsurf',
    toolName: 'Windsurf',
    planName: 'Pro',
    pricePerSeat: 15,
    minSeats: 1,
    features: ['Unlimited autocomplete', 'Advanced models (Claude 3.5, GPT-4o)', 'Cascade agentic coding', '500 premium credits/mo'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://codeium.com/pricing',
  },
  {
    planId: 'windsurf_team',
    toolId: 'windsurf',
    toolName: 'Windsurf',
    planName: 'Teams',
    pricePerSeat: 35,
    minSeats: 1,
    features: ['Everything in Pro', 'Admin controls', 'Usage analytics', 'Centralized billing', 'Priority support'],
    bestFor: ['coding'],
    isEnterprise: false,
    sourceUrl: 'https://codeium.com/pricing',
  },
];

/** Get all plans for a specific tool */
export function getPlansForTool(toolId: ToolId): PlanDefinition[] {
  return PLANS.filter(p => p.toolId === toolId);
}

/** Get a specific plan by planId */
export function getPlanById(planId: string): PlanDefinition | undefined {
  return PLANS.find(p => p.planId === planId);
}
