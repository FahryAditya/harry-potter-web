"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-1.5 px-4 py-2 bg-surface hover:bg-surface-elevated disabled:opacity-40 disabled:pointer-events-none border border-border-dark hover:border-gold/40 text-text-primary text-xs uppercase font-mono tracking-wider rounded-[2px] transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 text-gold" />
        <span className="hidden sm:inline">{t.pagination.previous}</span>
      </button>

      <span className="px-3 py-1 font-mono text-xs text-text-secondary">
        {t.pagination.pageOf
          .replace("{current}", currentPage.toString())
          .replace("{total}", totalPages.toString())}
      </span>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-1.5 px-4 py-2 bg-surface hover:bg-surface-elevated disabled:opacity-40 disabled:pointer-events-none border border-border-dark hover:border-gold/40 text-text-primary text-xs uppercase font-mono tracking-wider rounded-[2px] transition-colors cursor-pointer"
      >
        <span className="hidden sm:inline">{t.pagination.next}</span>
        <ChevronRight className="w-4 h-4 text-gold" />
      </button>
    </div>
  );
}
