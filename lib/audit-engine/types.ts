// lib/audit-engine/types.ts
// All TypeScript types for the StackDown audit engine

export type ToolId =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolInput {
  toolId: ToolId;
  planId: string;           // e.g. 'cursor_pro', 'claude_team'
  seats: number;
  monthlySpend: number;     // what they actually pay (may differ from plan × seats)
}

export interface TeamContext {
  teamSize: number;
  useCase: UseCase;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
}

export interface ToolRecommendation {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendedAction: 'downgrade' | 'switch' | 'cancel' | 'keep' | 'consolidate' | 'optimize';
  recommendedPlan?: string;
  recommendedTool?: string;
  projectedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;        // MUST be specific. Finance person reads this.
  confidence: 'high' | 'medium' | 'low';
  credexRelevant: boolean;  // true = this saving could be amplified by Credex credits
}

export interface OverlapWarning {
  tools: ToolId[];
  toolNames: string[];
  severity: 'high' | 'medium' | 'low';
  description: string;
  suggestedAction: string;
  estimatedWaste: number;   // dollars/month being wasted by the overlap
}

export interface AuditResult {
  recommendations: ToolRecommendation[];
  overlaps: OverlapWarning[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsTier: 'high' | 'moderate' | 'low' | 'optimal';
  alreadyOptimal: boolean;
  toolCount: number;
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
  savingsPercentage: number;
}
