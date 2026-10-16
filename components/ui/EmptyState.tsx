"use client";

import React from "react";
import { Compass, RotateCcw } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface EmptyStateProps {
  onReset?: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center p-14 my-8 bg-surface border border-border-dark rounded-[2px] text-center max-w-xl mx-auto">
      <div className="w-14 h-14 flex items-center justify-center rounded-[2px] bg-surface-elevated border border-gold/30 text-gold mb-5">
        <Compass className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="font-serif text-2xl text-text-primary tracking-wide mb-2.5">
        {t.ui.emptyTitle}
      </h3>
      <p className="text-text-secondary text-sm mb-6 max-w-md leading-relaxed">
        {t.ui.emptyDesc}
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-elevated hover:bg-gold/10 border border-gold/40 hover:border-gold text-gold text-xs tracking-wider uppercase rounded-[2px] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t.filters.reset}
        </button>
      )}
    </div>
  );
}
