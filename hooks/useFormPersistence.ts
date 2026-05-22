'use client';

import { useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'spendlens_audit_draft';

interface FormState {
  tools: Array<{
    toolId: string;
    planId: string;
    seats: number;
    monthlySpend: number;
  }>;
  teamSize: number;
  useCase: string;
  currentStep: number;
}

interface UseFormPersistenceReturn {
  saveState: (state: FormState) => void;
  loadState: () => FormState | null;
  clearState: () => void;
}

export function useFormPersistence(
  onRestore?: () => void
): UseFormPersistenceReturn {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRestored = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (hasRestored.current) return;
    hasRestored.current = true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FormState;
        // Check it has meaningful data (at least one tool or non-zero teamSize)
        if (parsed.tools?.length > 0 || parsed.teamSize > 0) {
          onRestore?.();
        }
      }
    } catch {
      // localStorage unavailable or corrupted — silently ignore
    }
  }, [onRestore]);

  const saveState = useCallback((state: FormState) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Storage quota exceeded or unavailable — silently ignore
      }
    }, 500); // 500ms debounce per architecture spec
  }, []);

  const loadState = useCallback((): FormState | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as FormState;
    } catch {
      return null;
    }
  }, []);

  const clearState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Silently ignore
    }
  }, []);

  return { saveState, loadState, clearState };
}
