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
    <div className="flex flex-col items-center justify-center p-12 my-8 bg-surface border border-crimson/40 rounded-[2px] text-center max-w-xl mx-auto shadow-2xl">
      <div className="border-l-2 border-crimson pl-3 mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-crimson font-bold block">
          Archival Scroll Disturbance
        </span>
      </div>
      <div className="w-12 h-12 flex items-center justify-center rounded-[2px] bg-crimson/10 border border-crimson/30 text-crimson mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-2xl text-text-primary tracking-wide mb-2">
        {t.ui.errorTitle || "Penelusuran Gulungan Terputus"}
      </h3>
      <p className="text-text-secondary text-sm mb-6 max-w-md leading-relaxed">
        {message || "Komunikasi dengan arsip sihir eksternal mengalami gangguan. Sila periksa koneksi atau rapalkan ulang mantra."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated hover:bg-gold/15 border border-gold/50 hover:border-gold text-gold text-xs tracking-widest font-mono uppercase rounded-[2px] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t.ui.retry || "Rapalkan Ulang Mantra"}</span>
        </button>
      )}
    </div>
  );
}
