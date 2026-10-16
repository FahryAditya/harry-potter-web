"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { ALL_SUPPORTED_LANGS } from "@/lib/constants";
import type { SupportedLang } from "@/types";

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = ALL_SUPPORTED_LANGS.find((l) => l.code === lang) || ALL_SUPPORTED_LANGS[0];

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface hover:bg-surface-elevated border border-border-dark hover:border-gold/50 text-text-primary text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-gold" />
        <span className="font-mono text-xs">{currentLang.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-surface border border-border-dark rounded-[2px] shadow-2xl py-1 z-50 divide-y divide-border-dark/40"
          role="menu"
        >
          <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-widest text-text-secondary">
            Select Language
          </div>
          <div className="py-1">
            {ALL_SUPPORTED_LANGS.map((item) => {
              const isSelected = item.code === lang;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLang(item.code as SupportedLang);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-gold/10 text-gold font-medium"
                      : "text-text-primary hover:bg-surface-elevated hover:text-gold"
                  }`}
                  role="menuitem"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono uppercase text-[11px] text-text-secondary w-6">
                      {item.code}
                    </span>
                    <span>{item.nativeName}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-gold" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
