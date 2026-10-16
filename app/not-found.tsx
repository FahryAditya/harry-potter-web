import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[70vh] text-center max-w-lg mx-auto relative">
      {/* Lumos Wand Tip Glow */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold shadow-[0_0_50px_rgba(197,160,89,0.35)] animate-pulse">
          <Sparkles className="w-9 h-9 text-gold" />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-12 bg-gradient-to-b from-gold/60 to-transparent rounded-full" />
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold mb-2 block">
        404 — Lumos Wand Tip
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary tracking-wide mb-3">
        Extinguished Corridor
      </h1>
      <p className="font-serif text-sm text-text-secondary leading-relaxed mb-8 max-w-md">
        The corridor you seek has vanished into shifting staircases, or was never transcribed in the castle archives.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface-elevated border border-gold/50 hover:border-gold text-gold text-xs font-mono uppercase tracking-widest rounded-[2px] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Grand Hall</span>
      </Link>
    </div>
  );
}
