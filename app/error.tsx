"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for development diagnostics
    console.error("Global boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[60vh] text-center max-w-xl mx-auto">
      <div className="w-14 h-14 rounded-[2px] bg-crimson/15 border border-crimson/40 flex items-center justify-center text-crimson mb-6">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-crimson mb-1">
        Archival Disruption
      </span>
      <h2 className="font-serif text-3xl text-text-primary tracking-wide mb-3">
        An Unforeseen Magical Anomaly Occurred
      </h2>
      <p className="font-serif text-sm text-text-secondary leading-relaxed mb-8 max-w-md">
        {error.message || "The ancient spell sustaining this archive encountered an interruption."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-surface hover:bg-gold/10 border border-gold/40 hover:border-gold text-gold text-xs font-mono uppercase tracking-widest rounded-[2px] transition-colors cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Attempt Incantation Again</span>
      </button>
    </div>
  );
}
