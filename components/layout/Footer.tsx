"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-border-dark bg-canvas relative z-10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[88px] py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-serif text-sm tracking-[0.15em] text-gold font-bold">
              POTTER EXPLORER
            </span>
            <span className="text-border-dark">|</span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-text-secondary">
              Hogwarts Archival System
            </span>
          </div>
          <p className="text-xs text-text-secondary/70 max-w-xl">
            {t.ui.footerDisclaimer}
          </p>
        </div>

        <div className="text-right">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary/60">
            Data provided by PotterAPI
          </span>
        </div>
      </div>
    </footer>
  );
}
