"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePotterData } from "@/hooks/usePotterData";
import { useTranslation } from "@/hooks/useTranslation";
import type { House, HouseFilterState } from "@/types";
import { filterHouses, getHouseFilterOptions } from "@/lib/filters";
import { sortHouses } from "@/lib/sorters";
import { SearchBar } from "@/components/controls/SearchBar";
import { CascadingFilters } from "@/components/controls/CascadingFilters";
import { SortSelect, type SortChoice } from "@/components/controls/SortSelect";
import { HouseCard } from "@/components/cards/HouseCard";
import { CardGridSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

export default function HousesPage() {
  const { lang, t } = useTranslation();
  const { data: rawHouses, loading, error, retry } = usePotterData<House>("houses");

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<HouseFilterState>({
    animal: "all",
    color: "all",
  });
  const [currentSort, setCurrentSort] = useState<SortChoice>("default");

  // Cascading options
  const filterOptions = useMemo(() => {
    return getHouseFilterOptions(rawHouses, filters);
  }, [rawHouses, filters]);

  // Search filter
  const searched = useMemo(() => {
    if (!searchQuery.trim()) return rawHouses;
    const q = searchQuery.toLowerCase().trim();
    return rawHouses.filter(
      (h) =>
        h.house.toLowerCase().includes(q) ||
        h.founder.toLowerCase().includes(q) ||
        h.animal.toLowerCase().includes(q)
    );
  }, [rawHouses, searchQuery]);

  // Cascading filter
  const filtered = useMemo(() => {
    return filterHouses(searched, filters);
  }, [searched, filters]);

  // Sort
  const sorted = useMemo(() => {
    if (currentSort === "default") return filtered;
    if (currentSort === "name-asc") {
      return sortHouses(filtered, "asc", lang);
    }
    if (currentSort === "name-desc") {
      return sortHouses(filtered, "desc", lang);
    }
    return filtered;
  }, [filtered, currentSort, lang]);

  const handleResetFilters = () => {
    setFilters({ animal: "all", color: "all" });
    setSearchQuery("");
    setCurrentSort("default");
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="mb-8 border-b border-border-dark pb-6">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold block mb-1">
          Hogwarts Heraldry
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-text-primary">
          {t.nav.houses}
        </h1>
        <p className="font-serif text-sm text-text-secondary mt-1">
          The four historic foundations established by the venerable founders of witchcraft and wizardry.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-surface border border-border-dark rounded-[2px] p-4 sm:p-5 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar onSearchChange={setSearchQuery} />

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="font-mono text-xs text-text-secondary shrink-0">
              <strong className="text-gold font-bold">{sorted.length}</strong> {t.search.resultsCount}
            </span>
            <SortSelect
              resource="houses"
              currentSort={currentSort}
              onSortChange={setCurrentSort}
            />
          </div>
        </div>

        {/* 2-Level Cascading Filters: Animal -> Color */}
        <CascadingFilters
          type="houses"
          filters={filters}
          options={filterOptions}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
        />
      </div>

      {/* Main Content Area: 4 Tall House Banners */}
      {loading ? (
        <CardGridSkeleton count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : sorted.length === 0 ? (
        <EmptyState onReset={handleResetFilters} />
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {sorted.map((house) => (
              <motion.div
                layout
                key={house.index}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <HouseCard house={house} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
