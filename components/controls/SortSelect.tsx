"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { PotterResource } from "@/types";

export type SortChoice =
  | "name-asc"
  | "name-desc"
  | "birthdate-asc"
  | "birthdate-desc"
  | "number-asc"
  | "number-desc"
  | "pages-asc"
  | "pages-desc"
  | "default";

interface SortSelectProps {
  resource: PotterResource;
  currentSort: SortChoice;
  onSortChange: (choice: SortChoice) => void;
}

export function SortSelect({ resource, currentSort, onSortChange }: SortSelectProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gold/70 shrink-0" />
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortChoice)}
        aria-label={t.sort.label}
        className="px-3 py-2 bg-surface border border-border-dark focus:border-gold rounded-[2px] text-text-primary text-xs font-serif outline-none cursor-pointer"
      >
        <option value="default">{t.sort.label}: Default</option>
        <option value="name-asc">{t.sort.nameAsc}</option>
        <option value="name-desc">{t.sort.nameDesc}</option>

        {resource === "characters" && (
          <>
            <option value="birthdate-asc">{t.sort.birthdateAsc}</option>
            <option value="birthdate-desc">{t.sort.birthdateDesc}</option>
          </>
        )}

        {resource === "books" && (
          <>
            <option value="number-asc">{t.sort.numberAsc}</option>
            <option value="number-desc">{t.sort.numberDesc}</option>
            <option value="pages-asc">{t.sort.pagesAsc}</option>
            <option value="pages-desc">{t.sort.pagesDesc}</option>
          </>
        )}
      </select>
    </div>
  );
}
