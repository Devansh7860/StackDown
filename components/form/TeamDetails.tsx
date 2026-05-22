'use client';

import { cn } from '@/lib/utils';
import type { UseCase } from '@/lib/audit-engine/types';

interface TeamDetailsProps {
  teamSize: number;
  useCase: UseCase | '';
  onTeamSizeChange: (size: number) => void;
  onUseCaseChange: (useCase: UseCase) => void;
}

const USE_CASES: { id: UseCase; label: string; icon: string; desc: string }[] = [
  { id: 'coding', label: 'Coding', icon: '💻', desc: 'Software development, code review, debugging' },
  { id: 'writing', label: 'Writing', icon: '✍️', desc: 'Content creation, docs, marketing copy' },
  { id: 'data', label: 'Data', icon: '📊', desc: 'Analysis, SQL, spreadsheets, reporting' },
  { id: 'research', label: 'Research', icon: '🔬', desc: 'Literature review, competitive analysis' },
  { id: 'mixed', label: 'Mixed', icon: '🔀', desc: 'Across multiple categories' },
];

export function TeamDetails({
  teamSize,
  useCase,
  onTeamSizeChange,
  onUseCaseChange,
}: TeamDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#FAFAFA] mb-1">
          Tell us about your team
        </h2>
        <p className="text-sm text-[#71717A]">
          This helps us calibrate which plans are right-sized for you.
        </p>
      </div>

      {/* Team size */}
      <div>
        <label
          htmlFor="team-size"
          className="block text-sm font-medium text-[#A1A1AA] mb-3"
        >
          How many people use AI tools on your team?
        </label>
        <div className="flex items-center gap-4">
          <input
            id="team-size"
            type="number"
            min={1}
            max={10000}
            value={teamSize || ''}
            placeholder="e.g. 8"
            onChange={(e) => onTeamSizeChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-32 bg-[#27272A] border border-[#3F3F46] rounded-md px-3 py-2 text-sm
              text-[#FAFAFA] focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E]
              transition-colors font-mono"
          />
          <span className="text-sm text-[#71717A]">people</span>
        </div>
        <p className="mt-1.5 text-xs text-[#71717A]">
          Count everyone who uses any AI tool — devs, PMs, designers, etc.
        </p>
      </div>

      {/* Use case */}
      <div>
        <label className="block text-sm font-medium text-[#A1A1AA] mb-3">
          What is your team's primary use for AI tools?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {USE_CASES.map(({ id, label, icon, desc }) => {
            const isSelected = useCase === id;
            return (
              <button
                key={id}
                type="button"
                id={`use-case-${id}`}
                onClick={() => onUseCaseChange(id)}
                className={cn(
                  'flex flex-col gap-1 p-3 rounded-lg border text-left transition-all duration-200',
                  isSelected
                    ? 'border-[#22C55E] bg-[#22C55E]/10 text-[#FAFAFA]'
                    : 'border-[#27272A] bg-[#18181B] text-[#A1A1AA] hover:border-[#3F3F46] hover:bg-[#27272A]'
                )}
                aria-pressed={isSelected}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-[#71717A] leading-tight">{desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
