// Server component — owns the Suspense boundary.
// All client logic lives in ./client.tsx

import { Suspense } from 'react';
import { Metadata } from 'next';
import { AuditResultClient } from './client';
import { createAdminClient } from '@/lib/supabase/admin';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  
  const defaultMeta: Metadata = {
    title: 'SpendLens AI Audit',
    description: 'Check out this AI tool spend optimization audit.',
  };

  const supabase = createAdminClient();
  if (!supabase) return defaultMeta;

  const { data } = await supabase
    .from('audits')
    .select('audit_result')
    .eq('share_token', token)
    .single();

  if (!data?.audit_result) return defaultMeta;

  const savings = data.audit_result.totalMonthlySavings;
  const title = savings > 0 
    ? `SpendLens found $${Math.round(savings).toLocaleString()}/mo in AI savings`
    : 'SpendLens AI Audit - Stack is Optimized';

  return {
    title,
    description: 'See the full breakdown of AI tool overlaps, right-sizing opportunities, and recommendations.',
    openGraph: {
      title,
      description: 'See the full breakdown of AI tool overlaps, right-sizing opportunities, and recommendations.',
      type: 'website',
      images: [
        {
          url: `/og-default.png`,
          width: 1200,
          height: 630,
          alt: 'SpendLens Audit Result',
        },
      ],
    },
  };
}

function LoadingShell() {
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#71717A]">Loading your audit...</p>
      </div>
    </div>
  );
}

export default function AuditResultPage() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <AuditResultClient />
    </Suspense>
  );
}
