'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { StepIndicator } from './StepIndicator';
import { ToolSelector } from './ToolSelector';
import { TeamDetails } from './TeamDetails';
import { ReviewStep } from './ReviewStep';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import type { ToolId, UseCase } from '@/lib/audit-engine/types';
import { ChevronLeft, Minus } from 'lucide-react';

interface ToolEntry {
  toolId: ToolId;
  planId: string;
  seats: number;
  monthlySpend: number;
  overrideSpend: boolean;
}

interface FormState {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase | '';
  currentStep: number;
}

const DEFAULT_STATE: FormState = {
  tools: [],
  teamSize: 0,
  useCase: '',
  currentStep: 1,
};

interface ValidationError {
  step1?: string;
  step2?: string;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -50 : 50,
    opacity: 0,
  }),
};

export function AuditForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(DEFAULT_STATE);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<ValidationError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [restoredToast, setRestoredToast] = useState(false);

  const handleRestore = useCallback(() => {
    setRestoredToast(true);
    setTimeout(() => setRestoredToast(false), 4000);
  }, []);

  const { saveState, loadState, clearState } = useFormPersistence(handleRestore);

  // Load persisted state on mount
  useEffect(() => {
    const saved = loadState();
    if (saved && (saved.tools?.length > 0 || saved.teamSize > 0)) {
      setFormState({
        tools: (saved.tools ?? []) as ToolEntry[],
        teamSize: saved.teamSize ?? 0,
        useCase: (saved.useCase ?? '') as UseCase | '',
        currentStep: saved.currentStep ?? 1,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save state on every change
  useEffect(() => {
    if (formState.tools.length > 0 || formState.teamSize > 0) {
      saveState(formState as Parameters<typeof saveState>[0]);
    }
  }, [formState, saveState]);

  function updateTools(tools: ToolEntry[]) {
    setFormState(prev => ({ ...prev, tools }));
    if (errors.step1) setErrors(prev => ({ ...prev, step1: undefined }));
  }

  function updateTeamSize(teamSize: number) {
    setFormState(prev => ({ ...prev, teamSize }));
  }

  function updateUseCase(useCase: UseCase) {
    setFormState(prev => ({ ...prev, useCase }));
    if (errors.step2) setErrors(prev => ({ ...prev, step2: undefined }));
  }

  function validateStep1(): boolean {
    if (formState.tools.length === 0) {
      setErrors(prev => ({ ...prev, step1: 'Please add at least one AI tool.' }));
      return false;
    }
    const incomplete = formState.tools.find(t => !t.planId);
    if (incomplete) {
      setErrors(prev => ({ ...prev, step1: `Please select a plan for all added tools.` }));
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    if (!formState.teamSize || formState.teamSize < 1) {
      setErrors(prev => ({ ...prev, step2: 'Please enter your team size.' }));
      return false;
    }
    if (!formState.useCase) {
      setErrors(prev => ({ ...prev, step2: 'Please select your primary use case.' }));
      return false;
    }
    return true;
  }

  function goNext() {
    const { currentStep } = formState;
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    setDirection(1);
    setFormState(prev => ({ ...prev, currentStep: Math.min(3, prev.currentStep + 1) }));
  }

  function goBack() {
    setDirection(-1);
    setFormState(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }));
  }

  async function handleSubmit() {
    if (!validateStep1() || !validateStep2()) {
      setFormState(prev => ({ ...prev, currentStep: 1 }));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        tools: formState.tools.map(t => ({
          toolId: t.toolId,
          planId: t.planId,
          seats: t.seats,
          monthlySpend: t.monthlySpend,
        })),
        teamSize: formState.teamSize,
        useCase: formState.useCase,
      };

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 429) {
          throw new Error('Too many audits. Please wait an hour before trying again.');
        }
        throw new Error(err.error ?? 'Something went wrong. Please try again.');
      }

      const data = await res.json();
      clearState();
      // Cache result in sessionStorage so results page renders without Supabase
      try {
        sessionStorage.setItem(`audit_${data.shareToken}`, JSON.stringify(data));
      } catch { /* storage unavailable — results page will try Supabase */ }
      router.push(`/audit/${data.shareToken}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setSubmitError(message);
      setIsSubmitting(false);
    }
  }

  const { currentStep, tools, teamSize, useCase } = formState;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Restored session toast */}
      <AnimatePresence>
        {restoredToast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#111113] border border-[#1E1E21] text-sm text-[#71717A]"
          >
            <Minus className="w-3 h-3" />
            <span>Previous session restored.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#111113] border border-[#1E1E21] rounded-xl p-6 shadow-lg">
        <StepIndicator currentStep={currentStep} />

        {/* Animated step content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {currentStep === 1 && (
              <ToolSelector tools={tools} onChange={updateTools} />
            )}
            {currentStep === 2 && (
              <TeamDetails
                teamSize={teamSize}
                useCase={useCase}
                onTeamSizeChange={updateTeamSize}
                onUseCaseChange={updateUseCase}
              />
            )}
            {currentStep === 3 && (
              <ReviewStep
                tools={tools as Parameters<typeof ReviewStep>[0]['tools']}
                teamSize={teamSize}
                useCase={useCase}
                onSubmit={handleSubmit}
                onBack={goBack}
                isSubmitting={isSubmitting}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Error messages */}
        {(errors.step1 && currentStep === 1) && (
          <p className="mt-3 text-sm text-[#EF4444] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] flex-shrink-0" /> {errors.step1}
          </p>
        )}
        {(errors.step2 && currentStep === 2) && (
          <p className="mt-3 text-sm text-[#EF4444] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] flex-shrink-0" /> {errors.step2}
          </p>
        )}
        {submitError && (
          <p className="mt-3 text-sm text-[#EF4444] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] flex-shrink-0" /> {submitError}
          </p>
        )}

        {/* Navigation buttons (steps 1 + 2 only — step 3 has its own submit button) */}
        {currentStep < 3 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#27272A]">
            <button
              type="button"
              onClick={goBack}
              disabled={currentStep === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm text-[#A1A1AA]
                hover:text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-30 disabled:cursor-not-allowed
                transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              id={`step${currentStep}-next-btn`}
              onClick={goNext}
              className="px-5 py-2.5 rounded-lg bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#09090B] font-medium text-sm
                transition-colors"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Back button for step 3 */}
        {currentStep === 3 && (
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 mt-3 px-4 py-2 rounded-md text-sm text-[#71717A]
              hover:text-[#A1A1AA] hover:bg-[#27272A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Edit tools
          </button>
        )}
      </div>
    </div>
  );
}
