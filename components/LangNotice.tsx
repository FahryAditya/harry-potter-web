"use client";

import React from "react";
import { Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { isApiSupportedLang } from "@/lib/endpoints";

export function LangNotice() {
  const { lang, t } = useTranslation();

  // If the language is natively supported by the API, do not show the notice
  if (isApiSupportedLang(lang)) {
    return null;
  }

  return (
    <aside
      aria-label="Language translation notice"
      className="w-full bg-surface-elevated/80 border-b border-gold/30 px-4 py-2.5 text-xs text-text-secondary flex items-center justify-center gap-2.5 transition-all"
    >
      <Info className="w-4 h-4 text-gold shrink-0" />
      <span className="font-serif tracking-wide text-text-primary text-center">
        {t.langNotice.noticeText}
      </span>
    </aside>
  );
}
