// lib/audit-engine/overlaps.ts
// Cross-tool conflict detection matrix.

import type { ToolId, ToolInput, UseCase, OverlapWarning } from './types';
import { TOOLS } from './tools';

interface OverlapRule {
  tools: [ToolId, ToolId];
  applicableUseCases: UseCase[];
  severity: 'high' | 'medium' | 'low';
  description: string;
  suggestedAction: string;
  savingsCalc: (a: ToolInput, b: ToolInput) => number;
}

const OVERLAP_RULES: OverlapRule[] = [
  {
    tools: ['cursor', 'github_copilot'],
    applicableUseCases: ['coding', 'mixed'],
    severity: 'high',
    description:
      'Cursor and GitHub Copilot have near-identical feature sets: inline code completions, AI chat, and context-aware suggestions. Cursor\'s multi-file editing and Composer agent go beyond anything Copilot offers — making Copilot entirely redundant for teams using Cursor as their primary editor.',
    suggestedAction:
      'Cancel GitHub Copilot. Cursor already covers everything Copilot does, plus multi-file agent workflows. The only reason to keep both is if some team members use VS Code exclusively — in that case, standardize on one IDE.',
    savingsCalc: (_, copilot) => copilot.monthlySpend,
  },
  {
    tools: ['cursor', 'windsurf'],
    applicableUseCases: ['coding', 'mixed'],
    severity: 'high',
    description:
      'Cursor and Windsurf are direct competitors in the AI-powered code editor space. Both offer inline completions, agentic coding, and multi-file context. Running both means your team is split across two IDEs with redundant subscriptions.',
    suggestedAction:
      'Standardize on one. Cursor has broader model access and a larger community; Windsurf Pro is $5/seat cheaper at $15 vs $20. Pick one and cancel the other.',
    savingsCalc: (cursor, windsurf) => Math.min(cursor.monthlySpend, windsurf.monthlySpend),
  },
  {
    tools: ['github_copilot', 'windsurf'],
    applicableUseCases: ['coding', 'mixed'],
    severity: 'high',
    description:
      'GitHub Copilot and Windsurf both provide in-editor AI code completion and chat. Windsurf\'s Cascade feature subsumes Copilot\'s inline suggestion workflow. Teams using Windsurf as their IDE do not need a separate Copilot subscription.',
    suggestedAction:
      'Cancel GitHub Copilot if Windsurf is your team\'s primary IDE.',
    savingsCalc: (copilot, _) => copilot.monthlySpend,
  },
  {
    tools: ['claude', 'chatgpt'],
    applicableUseCases: ['writing', 'research', 'mixed'],
    severity: 'medium',
    description:
      'Claude and ChatGPT overlap significantly for writing and research tasks. Both are general-purpose AI assistants — most teams that evaluate both settle on one after a few weeks.',
    suggestedAction:
      'Run a 2-week trial using only one. Track if any team member actively misses the other. If not, cancel it. Claude tends to win on long-form writing quality; ChatGPT on breadth of tools (DALL-E, Advanced Data Analysis, Custom GPTs).',
    savingsCalc: (claude, chatgpt) => Math.min(claude.monthlySpend, chatgpt.monthlySpend),
  },
  {
    tools: ['anthropic_api', 'claude'],
    applicableUseCases: ['coding', 'data', 'mixed'],
    severity: 'low',
    description:
      'You\'re paying for both the Anthropic API and Claude Pro web subscriptions. The API gives programmatic Claude access; Claude Pro gives web UI access. If your team\'s primary usage is through the API, the web UI subscriptions may be redundant.',
    suggestedAction:
      'Check if the Claude Pro subscribers are actually using the web interface daily. Developers who primarily call the API rarely use claude.ai. Cancelling unused Pro seats saves $20/seat/mo.',
    savingsCalc: (api, claude) => {
      // Conservative: save 50% of the smaller cost since some UI use is likely
      return Math.min(api.monthlySpend, claude.monthlySpend) * 0.5;
    },
  },
  {
    tools: ['openai_api', 'chatgpt'],
    applicableUseCases: ['coding', 'data', 'mixed'],
    severity: 'low',
    description:
      'You\'re paying for both the OpenAI API and ChatGPT Plus/Team. If your team primarily accesses GPT-4o via the API, the ChatGPT web subscriptions may be underutilized.',
    suggestedAction:
      'Verify actual usage of chatgpt.com vs API calls. Developers who build with the API rarely use the web interface enough to justify Plus at $20/seat/mo.',
    savingsCalc: (api, chatgpt) => Math.min(api.monthlySpend, chatgpt.monthlySpend) * 0.5,
  },
  {
    tools: ['anthropic_api', 'openai_api'],
    applicableUseCases: ['coding', 'data', 'mixed'],
    severity: 'low',
    description:
      'Using both Anthropic and OpenAI APIs is common for fallback/redundancy. However, if one provider handles >90% of your traffic, the other adds overhead without proportional value.',
    suggestedAction:
      'Check your API dashboards. If one provider handles >90% of calls, consolidate to reduce management overhead and gain volume discount leverage with the primary provider.',
    savingsCalc: (anthropic, openai) => {
      const smaller = Math.min(anthropic.monthlySpend, openai.monthlySpend);
      return smaller * 0.5; // conservative: save 50% of the smaller spend
    },
  },
];

export function detectOverlaps(tools: ToolInput[], useCase: UseCase): OverlapWarning[] {
  const warnings: OverlapWarning[] = [];
  const toolMap = new Map<ToolId, ToolInput>(tools.map(t => [t.toolId, t]));

  for (const rule of OVERLAP_RULES) {
    const [idA, idB] = rule.tools;
    const toolA = toolMap.get(idA);
    const toolB = toolMap.get(idB);

    if (!toolA || !toolB) continue;
    if (!rule.applicableUseCases.includes(useCase) && useCase !== 'mixed') continue;

    const estimatedWaste = rule.savingsCalc(toolA, toolB);

    warnings.push({
      tools: [idA, idB],
      toolNames: [TOOLS[idA].name, TOOLS[idB].name],
      severity: rule.severity,
      description: rule.description,
      suggestedAction: rule.suggestedAction,
      estimatedWaste,
    });
  }

  return warnings;
}
