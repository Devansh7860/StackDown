'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadCaptureProps {
  token: string;
  totalSavings: number;
}

export function LeadCapture({ token, totalSavings }: LeadCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Honeypot check — if filled, silently succeed (bot)
    const form = e.target as HTMLFormElement;
    const honeypot = (form.elements.namedItem('company_website') as HTMLInputElement)?.value;
    if (honeypot) {
      setStatus('success');
      return;
    }

    setStatus('loading');
    
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, totalSavings }),
      });

      if (!res.ok) throw new Error('Failed to submit');
      
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="bg-[#111113] border border-[#1E1E21] rounded-xl p-6 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-50" />
      
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2 flex-1">
          <h3 className="text-sm font-semibold text-[#FAFAFA] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            Email this report
          </h3>
          <p className="text-xs text-[#71717A] leading-relaxed max-w-md">
            Get a permanent link to this audit sent to your inbox. Plus, teams that complete an audit get priority access to 15-30% volume discounts on Anthropic and OpenAI API credits via Credex.
          </p>
        </div>

        <div className="flex-1 max-w-[280px]">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg px-4 py-3"
              >
                <CheckCircle2 className="w-4 h-4" />
                Report sent to your inbox.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-2"
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#09090B] border border-[#27272A] rounded-lg pl-9 pr-3 py-2 text-sm
                      text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6]
                      transition-colors"
                  />
                </div>
                {/* Honeypot — hidden from humans, catches bots */}
                <input
                  type="text"
                  name="company_website"
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#09090B] px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Report'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {status === 'error' && (
                  <p className="text-[10px] text-[#EF4444] text-center mt-1">Something went wrong. Try again.</p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
