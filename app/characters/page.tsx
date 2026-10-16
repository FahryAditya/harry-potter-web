"use client";

import React, { useState, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { usePotterData } from "@/hooks/usePotterData";
import { useTranslation } from "@/hooks/useTranslation";
import type { Character, CharacterFilterState } from "@/types";
import { filterCharacters, getCharacterFilterOptions } from "@/lib/filters";
import { sortCharacters } from "@/lib/sorters";
import { SearchBar } from "@/components/controls/SearchBar";
import { CascadingFilters } from "@/components/controls/CascadingFilters";
import { SortSelect, type SortChoice } from "@/components/controls/SortSelect";
import { Pagination } from "@/components/controls/Pagination";
import { CharacterCard } from "@/components/cards/CharacterCard";
import { CardGridSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

const ITEMS_PER_PAGE = 12;

function CharactersContent({ initialHouse }: { initialHouse: string }) {
  const { lang, t } = useTranslation();
  const { data: rawCharacters, loading, error, retry } = usePotterData<Character>("characters");

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<CharacterFilterState>({
    house: initialHouse,
    actor: "all",
    hasChildren: "all",
  });
  const [currentSort, setCurrentSort] = useState<SortChoice>("default");
  const [currentPage, setCurrentPage] = useState(1);

  // Compute cascading options
  const filterOptions = useMemo(() => {
    return getCharacterFilterOptions(rawCharacters, filters);
  }, [rawCharacters, filters]);

  // 1. Filter by Search Query
  const searched = useMemo(() => {
    if (!searchQuery.trim()) return rawCharacters;
    const q = searchQuery.toLowerCase().trim();
    return rawCharacters.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.nickname.toLowerCase().includes(q) ||
        c.interpretedBy.toLowerCase().includes(q)
    );
  }, [rawCharacters, searchQuery]);

  // 2. Filter by Cascading Filters (House -> Actor -> Has Children)
  const filtered = useMemo(() => {
    return filterCharacters(searched, filters);
  }, [searched, filters]);

  // 3. Sort
  const sorted = useMemo(() => {
    if (currentSort === "default") return filtered;
    if (currentSort === "name-asc") {
      return sortCharacters(filtered, "name", "asc", lang);
    }
    if (currentSort === "name-desc") {
      return sortCharacters(filtered, "name", "desc", lang);
    }
    if (currentSort === "birthdate-asc") {
      return sortCharacters(filtered, "birthdate", "asc", lang);
    }
    if (currentSort === "birthdate-desc") {
      return sortCharacters(filtered, "birthdate", "desc", lang);
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
    setFilters({ house: "all", actor: "all", hasChildren: "all" });
    setSearchQuery("");
    setCurrentSort("default");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="mb-8 border-b border-border-dark pb-6">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold block mb-1">
          Hogwarts Registry
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-text-primary">
          {t.nav.characters}
        </h1>
        <p className="font-serif text-sm text-text-secondary mt-1">
          Explore historical archives of wizards, witches, and magical beings recorded in chronicles.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
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
              resource="characters"
              currentSort={currentSort}
              onSortChange={(choice) => {
                setCurrentSort(choice);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* 3-Level Cascading Filters */}
        <CascadingFilters
          type="characters"
          filters={filters}
          options={filterOptions}
          onFilterChange={(newF) => {
            setFilters(newF);
            setCurrentPage(1);
          }}
          onReset={handleResetFilters}
        />
      </div>

      {/* Main Content Area */}
      {loading ? (
        <CardGridSkeleton count={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : sorted.length === 0 ? (
        <EmptyState onReset={handleResetFilters} />
      ) : (
        <>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {paginatedItems.map((char) => (
                <motion.div
                  layout
                  key={char.index}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <CharacterCard character={char} />
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

function CharactersWrapper() {
  const searchParams = useSearchParams();
  const initialHouseParam = searchParams.get("house") || "all";
  return <CharactersContent key={initialHouseParam} initialHouse={initialHouseParam} />;
}

export default function CharactersPage() {
  return (
    <Suspense fallback={<CardGridSkeleton count={8} />}>
      <CharactersWrapper />
    </Suspense>
  );
}
