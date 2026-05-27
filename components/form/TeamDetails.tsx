'use client';

import { cn } from '@/lib/utils';
import type { UseCase } from '@/lib/audit-engine/types';
import { Terminal, PenTool, BarChart3, Microscope, Shuffle } from 'lucide-react';
import type { ReactNode } from 'react';

interface TeamDetailsProps {
  teamSize: number;
  useCase: UseCase | '';
  onTeamSizeChange: (size: number) => void;
  onUseCaseChange: (useCase: UseCase) => void;
}

const USE_CASES: { id: UseCase; label: string; icon: ReactNode; desc: string }[] = [
  { id: 'coding', label: 'Coding', icon: <Terminal className="w-5 h-5" />, desc: 'Software development, code review, debugging' },
  { id: 'writing', label: 'Writing', icon: <PenTool className="w-5 h-5" />, desc: 'Content creation, docs, marketing copy' },
  { id: 'data', label: 'Data', icon: <BarChart3 className="w-5 h-5" />, desc: 'Analysis, SQL, spreadsheets, reporting' },
  { id: 'research', label: 'Research', icon: <Microscope className="w-5 h-5" />, desc: 'Literature review, competitive analysis' },
  { id: 'mixed', label: 'Mixed', icon: <Shuffle className="w-5 h-5" />, desc: 'Across multiple categories' },
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
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Tell us about your team
        </h2>
        <p className="text-sm text-muted-foreground">
          This helps us calibrate which plans are right-sized for you.
        </p>
      </div>

      {/* Team size */}
      <div>
        <label
          htmlFor="team-size"
          className="block text-sm font-medium text-muted-foreground mb-3"
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
            className="w-32 bg-card border border-border rounded-md px-3 py-2 text-sm
              text-foreground focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6]
              transition-colors font-mono"
          />
          <span className="text-sm text-muted-foreground">people</span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Count everyone who uses any AI tool — devs, PMs, designers, etc.
        </p>
      </div>

      {/* Use case */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-3">
          What is your team's primary use for AI tools?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {USE_CASES.map(({ id, label, icon, desc }) => {
            const isSelected = useCase === id;
            return (
               <button
                key={id}
                type="button"
                id={`use-case-${id}`}
                onClick={() => onUseCaseChange(id)}
                className={cn(
                  'flex flex-col gap-2 p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden',
                  isSelected
                    ? 'border-[#3B82F6]/50 bg-[#3B82F6]/5 text-foreground shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                    : 'border-border bg-card text-muted-foreground hover:border-muted hover:bg-secondary'
                )}
                aria-pressed={isSelected}
              >
                {isSelected && (
                   <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-50" />
                )}
                <span className={cn("text-lg", isSelected ? "text-[#3B82F6]" : "text-muted-foreground")}>{icon}</span>
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground leading-relaxed">{desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
