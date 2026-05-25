// components/ui/tool-logo.tsx
// Renders tool brand logos from the public/logos directory

import type { ToolId } from '@/lib/audit-engine/types';

interface ToolLogoProps {
  toolId: ToolId;
  size?: number;
  className?: string;
}

export function ToolLogo({ toolId, size = 20, className }: ToolLogoProps) {
  return (
    <img
      src={`/logos/${toolId}.svg`}
      alt={`${toolId} logo`}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    />
  );
}
