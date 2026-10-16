"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center p-12 my-8 bg-surface border border-crimson/40 rounded-[2px] text-center max-w-xl mx-auto">
      <div className="w-12 h-12 flex items-center justify-center rounded-[2px] bg-crimson/10 border border-crimson/30 text-crimson mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-xl text-text-primary tracking-wide mb-2">
        {t.ui.errorTitle}
      </h3>
      <p className="text-text-secondary text-sm mb-6 max-w-md">
        {message || t.ui.errorTitle}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-elevated hover:bg-gold/10 border border-gold/40 hover:border-gold text-gold text-xs tracking-wider uppercase rounded-[2px] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t.ui.retry}
        </button>
      )}
    </div>
  );
}
