"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePotterData } from "@/hooks/usePotterData";
import { useTranslation } from "@/hooks/useTranslation";
import type { Spell, SpellFilterState } from "@/types";
import { filterSpells, getSpellFilterOptions } from "@/lib/filters";
import { sortSpells } from "@/lib/sorters";
import { SearchBar } from "@/components/controls/SearchBar";
import { CascadingFilters } from "@/components/controls/CascadingFilters";
import { SortSelect, type SortChoice } from "@/components/controls/SortSelect";
import { Pagination } from "@/components/controls/Pagination";
import { SpellCard } from "@/components/cards/SpellCard";
import { CardGridSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

const ITEMS_PER_PAGE = 12;

export default function SpellsPage() {
  const { lang, t } = useTranslation();
  const { data: rawSpells, loading, error, retry } = usePotterData<Spell>("spells");

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SpellFilterState>({
    startingLetter: "all",
    keyword: "",
  });
  const [currentSort, setCurrentSort] = useState<SortChoice>("default");
  const [currentPage, setCurrentPage] = useState(1);

  // Cascading options
  const filterOptions = useMemo(() => {
    return getSpellFilterOptions(rawSpells);
  }, [rawSpells]);

  // 1. Search Query
  const searched = useMemo(() => {
    if (!searchQuery.trim()) return rawSpells;
    const q = searchQuery.toLowerCase().trim();
    return rawSpells.filter(
      (s) => s.spell.toLowerCase().includes(q) || s.use.toLowerCase().includes(q)
    );
  }, [rawSpells, searchQuery]);

  // 2. Cascading Filters (Starting Letter -> Keyword in Use)
  const filtered = useMemo(() => {
    return filterSpells(searched, filters);
  }, [searched, filters]);

  // 3. Sort
  const sorted = useMemo(() => {
    if (currentSort === "default") return filtered;
    if (currentSort === "name-asc") {
      return sortSpells(filtered, "asc", lang);
    }
    if (currentSort === "name-desc") {
      return sortSpells(filtered, "desc", lang);
    }
    return filtered;
  }, [filtered, currentSort, lang]);

  // 4. Pagination
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sorted.slice(start, start + ITEMS_PER_PAGE);
  }, [sorted, currentPage]);

  const handleResetFilters = () => {
    setFilters({ startingLetter: "all", keyword: "" });
    setSearchQuery("");
    setCurrentSort("default");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="mb-8 border-b border-border-dark pb-6">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson font-bold block mb-1">
          Arcane Incantations
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-text-primary">
          {t.nav.spells}
        </h1>
        <p className="font-serif text-sm text-text-secondary mt-1">
          Ancient charms, hexes, curses, and enchantments compiled in the library grimoires.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-surface border border-border-dark rounded-[2px] p-4 sm:p-5 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar
            onSearchChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
          />

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="font-mono text-xs text-text-secondary shrink-0">
              <strong className="text-gold font-bold">{sorted.length}</strong> {t.search.resultsCount}
            </span>
            <SortSelect
              resource="spells"
              currentSort={currentSort}
              onSortChange={(choice) => {
                setCurrentSort(choice);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* 2-Level Cascading Filters: Starting Letter -> Effect Keyword */}
        <CascadingFilters
          type="spells"
          filters={filters}
          options={filterOptions}
          onFilterChange={(newF) => {
            setFilters(newF);
            setCurrentPage(1);
          }}
          onReset={handleResetFilters}
        />
      </div>

      {/* Main Content Area: Parchment Scroll Grid */}
      {loading ? (
        <CardGridSkeleton count={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : sorted.length === 0 ? (
        <EmptyState onReset={handleResetFilters} />
      ) : (
        <>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {paginatedItems.map((spell) => (
                <motion.div
                  layout
                  key={spell.index}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <SpellCard spell={spell} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 180, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
}
