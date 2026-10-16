"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslation } from "@/hooks/useTranslation";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";

interface SearchBarProps {
  onSearchChange: (value: string) => void;
  defaultValue?: string;
}

export function SearchBar({ onSearchChange, defaultValue = "" }: SearchBarProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState(defaultValue);
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    onSearchChange(debouncedQuery);
  }, [debouncedQuery, onSearchChange]);

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
        <Search className="w-4 h-4 text-gold/70" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.search.placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-surface border border-border-dark focus:border-gold rounded-[2px] text-text-primary text-sm font-serif placeholder:text-text-secondary/60 outline-none transition-colors"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
