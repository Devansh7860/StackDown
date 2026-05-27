// lib/schemas.ts
// Zod validation schemas for StackDown

import { z } from 'zod';
import { TOOL_IDS } from './audit-engine/tools';

export const auditInputSchema = z.object({
  tools: z
    .array(
      z.object({
        toolId: z.enum(TOOL_IDS as [string, ...string[]]),
        planId: z.string().min(1, 'Please select a plan'),
        seats: z.number().int().min(1, 'At least 1 seat required'),
        monthlySpend: z.number().min(0, 'Spend cannot be negative'),
      })
    )
    .min(1, 'Add at least one AI tool to audit'),
  teamSize: z.number().int().min(1, 'Team size must be at least 1'),
  useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
});

export type AuditInputSchema = z.infer<typeof auditInputSchema>;

export const leadCaptureSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  companyName: z.string().optional(),
  role: z.string().optional(),
  auditId: z.string().optional(),
  // Honeypot field — should always be empty
  company_website: z.string().max(0, 'Bot detected').optional(),
});

export type LeadCaptureSchema = z.infer<typeof leadCaptureSchema>;
