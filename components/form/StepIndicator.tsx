'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: 'Your Tools' },
  { number: 2, label: 'Team Details' },
  { number: 3, label: 'Review' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Step dots + connecting line */}
      <div className="relative flex items-center justify-between mb-3">
        {/* Background line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#27272A]" />

        {/* Progress line */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-px bg-[#22C55E] transition-all duration-500 ease-out"
          style={{
            left: 0,
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
          }}
        />

        {STEPS.map((step) => {
          const isDone = step.number < currentStep;
          const isActive = step.number === currentStep;
          return (
            <div key={step.number} className="relative z-10 flex items-center justify-center">
              <div
                className={cn(
                  'w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-300',
                  isDone && 'bg-[#22C55E] border-[#22C55E] text-black',
                  isActive && 'bg-[#09090B] border-[#22C55E] text-[#22C55E]',
                  !isDone && !isActive && 'bg-[#09090B] border-[#27272A] text-[#71717A]'
                )}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : step.number}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step labels */}
      <div className="flex justify-between">
        {STEPS.map((step) => {
          const isActive = step.number === currentStep;
          const isDone = step.number < currentStep;
          return (
            <span
              key={step.number}
              className={cn(
                'text-xs font-medium transition-colors duration-300',
                isActive && 'text-[#FAFAFA]',
                isDone && 'text-[#22C55E]',
                !isActive && !isDone && 'text-[#71717A]'
              )}
            >
              {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
