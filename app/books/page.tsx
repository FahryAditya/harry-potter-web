"use client";

import React, { useState, useMemo } from "react";
import { usePotterData } from "@/hooks/usePotterData";
import { useTranslation } from "@/hooks/useTranslation";
import type { Book, BookFilterState } from "@/types";
import { filterBooks, getBookFilterOptions } from "@/lib/filters";
import { sortBooks } from "@/lib/sorters";
import { SearchBar } from "@/components/controls/SearchBar";
import { CascadingFilters } from "@/components/controls/CascadingFilters";
import { SortSelect, type SortChoice } from "@/components/controls/SortSelect";
import { BookCard } from "@/components/cards/BookCard";
import { CardGridSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

export default function BooksPage() {
  const { lang, t } = useTranslation();
  const { data: rawBooks, loading, error, retry } = usePotterData<Book>("books");

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<BookFilterState>({
    releaseYear: "all",
    pageRange: "all",
  });
  const [currentSort, setCurrentSort] = useState<SortChoice>("default");

  // Filter options
  const filterOptions = useMemo(() => {
    return getBookFilterOptions(rawBooks);
  }, [rawBooks]);

  // 1. Search Query
  const searched = useMemo(() => {
    if (!searchQuery.trim()) return rawBooks;
    const q = searchQuery.toLowerCase().trim();
    return rawBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.originalTitle.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
  }, [rawBooks, searchQuery]);

  // 2. Cascading Filters (Release Year -> Page Range)
  const filtered = useMemo(() => {
    return filterBooks(searched, filters);
  }, [searched, filters]);

  // 3. Sort
  const sorted = useMemo(() => {
    if (currentSort === "default") return filtered;
    if (currentSort === "name-asc") {
      return sortBooks(filtered, "title", "asc", lang);
    }
    if (currentSort === "name-desc") {
      return sortBooks(filtered, "title", "desc", lang);
    }
    if (currentSort === "number-asc") {
      return sortBooks(filtered, "number", "asc", lang);
    }
    if (currentSort === "number-desc") {
      return sortBooks(filtered, "number", "desc", lang);
    }
    if (currentSort === "pages-asc") {
      return sortBooks(filtered, "pages", "asc", lang);
    }
    if (currentSort === "pages-desc") {
      return sortBooks(filtered, "pages", "desc", lang);
    }
    return filtered;
  }, [filtered, currentSort, lang]);

  const handleResetFilters = () => {
    setFilters({ releaseYear: "all", pageRange: "all" });
    setSearchQuery("");
    setCurrentSort("default");
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="mb-8 border-b border-border-dark pb-6">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold block mb-1">
          Hogwarts Library
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-text-primary">
          {t.nav.books}
        </h1>
        <p className="font-serif text-sm text-text-secondary mt-1">
          The canonical literary tomes and foundation chronicles of the Harry Potter universe.
        </p>
      </div>

      {/* Toolbar */}
      <div className="sticky top-[72px] z-30 bg-canvas/95 backdrop-blur-md border-y border-border-dark py-4 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar onSearchChange={setSearchQuery} />

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="font-mono text-xs text-text-secondary shrink-0">
              <strong className="text-gold font-bold">{sorted.length}</strong> {t.search.resultsCount}
            </span>
            <SortSelect
              resource="books"
              currentSort={currentSort}
              onSortChange={setCurrentSort}
            />
          </div>
        </div>

        {/* 2-Level Cascading Filters: Release Year -> Page Range */}
        <CascadingFilters
          type="books"
          filters={filters}
          options={filterOptions}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
        />
      </div>

      {/* Main Content Area: Vertical Book Cover Grid */}
      {loading ? (
        <CardGridSkeleton count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : sorted.length === 0 ? (
        <EmptyState onReset={handleResetFilters} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map((book) => (
            <BookCard key={book.index} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
