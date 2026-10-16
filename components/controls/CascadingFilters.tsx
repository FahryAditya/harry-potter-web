"use client";

import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type {
  CharacterFilterState,
  BookFilterState,
  HouseFilterState,
  SpellFilterState,
} from "@/types";

interface CharacterFiltersProps {
  type: "characters";
  filters: CharacterFilterState;
  onFilterChange: (newFilters: CharacterFilterState) => void;
  options: {
    houses: string[];
    actors: string[];
  };
  onReset: () => void;
}

interface BookFiltersProps {
  type: "books";
  filters: BookFilterState;
  onFilterChange: (newFilters: BookFilterState) => void;
  options: {
    years: string[];
  };
  onReset: () => void;
}

interface HouseFiltersProps {
  type: "houses";
  filters: HouseFilterState;
  onFilterChange: (newFilters: HouseFilterState) => void;
  options: {
    animals: string[];
    colors: string[];
  };
  onReset: () => void;
}

interface SpellFiltersProps {
  type: "spells";
  filters: SpellFilterState;
  onFilterChange: (newFilters: SpellFilterState) => void;
  options: {
    letters: string[];
  };
  onReset: () => void;
}

export type CascadingFiltersProps =
  | CharacterFiltersProps
  | BookFiltersProps
  | HouseFiltersProps
  | SpellFiltersProps;

export function CascadingFilters(props: CascadingFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-surface/70 border border-border-dark rounded-[2px]">
      <div className="flex items-center gap-1.5 text-gold text-xs font-mono uppercase tracking-wider pr-2 border-r border-border-dark/60">
        <Filter className="w-3.5 h-3.5" />
        <span>{t.filters.title}</span>
      </div>

      {props.type === "characters" && (
        <>
          {/* Level 1: House */}
          <select
            value={props.filters.house}
            onChange={(e) =>
              props.onFilterChange({
                ...props.filters,
                house: e.target.value,
                actor: "all", // cascade reset next level
              })
            }
            aria-label={t.filters.house}
            className="px-2.5 py-1.5 bg-canvas border border-border-dark focus:border-gold rounded-[2px] text-xs font-serif text-text-primary outline-none cursor-pointer"
          >
            <option value="all">{t.filters.house}: {t.filters.all}</option>
            {props.options.houses.map((house) => (
              <option key={house} value={house}>
                {house}
              </option>
            ))}
          </select>

          {/* Level 2: Actor (cascaded by house) */}
          <select
            value={props.filters.actor}
            onChange={(e) =>
              props.onFilterChange({
                ...props.filters,
                actor: e.target.value,
              })
            }
            aria-label={t.filters.actor}
            className="px-2.5 py-1.5 bg-canvas border border-border-dark focus:border-gold rounded-[2px] text-xs font-serif text-text-primary outline-none cursor-pointer max-w-[200px]"
          >
            <option value="all">{t.filters.actor}: {t.filters.all}</option>
            {props.options.actors.map((actor) => (
              <option key={actor} value={actor}>
                {actor}
              </option>
            ))}
          </select>

          {/* Level 3: Has Children */}
          <select
            value={props.filters.hasChildren}
            onChange={(e) =>
              props.onFilterChange({
                ...props.filters,
                hasChildren: e.target.value,
              })
            }
            aria-label={t.filters.hasChildren}
            className="px-2.5 py-1.5 bg-canvas border border-border-dark focus:border-gold rounded-[2px] text-xs font-serif text-text-primary outline-none cursor-pointer"
          >
            <option value="all">{t.filters.hasChildren}: {t.filters.all}</option>
            <option value="yes">{t.filters.hasChildrenYes}</option>
            <option value="no">{t.filters.hasChildrenNo}</option>
          </select>
        </>
      )}

      {props.type === "books" && (
        <>
          {/* Level 1: Release Year */}
          <select
            value={props.filters.releaseYear}
            onChange={(e) =>
              props.onFilterChange({
                ...props.filters,
                releaseYear: e.target.value,
              })
            }
            aria-label={t.filters.releaseYear}
            className="px-2.5 py-1.5 bg-canvas border border-border-dark focus:border-gold rounded-[2px] text-xs font-serif text-text-primary outline-none cursor-pointer"
          >
            <option value="all">{t.filters.releaseYear}: {t.filters.all}</option>
            {props.options.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Level 2: Page Range */}
          <select
            value={props.filters.pageRange}
            onChange={(e) =>
              props.onFilterChange({
                ...props.filters,
                pageRange: e.target.value,
              })
            }
            aria-label={t.filters.pageRange}
            className="px-2.5 py-1.5 bg-canvas border border-border-dark focus:border-gold rounded-[2px] text-xs font-serif text-text-primary outline-none cursor-pointer"
          >
            <option value="all">{t.filters.pageRange}: {t.filters.all}</option>
            <option value="under300">{t.filters.pagesUnder300}</option>
            <option value="300to500">{t.filters.pages300to500}</option>
            <option value="over500">{t.filters.pagesOver500}</option>
          </select>
        </>
      )}

      {props.type === "houses" && (
        <>
          {/* Level 1: Animal */}
          <select
            value={props.filters.animal}
            onChange={(e) =>
              props.onFilterChange({
                ...props.filters,
                animal: e.target.value,
                color: "all", // cascade reset color
              })
            }
            aria-label={t.filters.animal}
            className="px-2.5 py-1.5 bg-canvas border border-border-dark focus:border-gold rounded-[2px] text-xs font-serif text-text-primary outline-none cursor-pointer"
          >
            <option value="all">{t.filters.animal}: {t.filters.all}</option>
            {props.options.animals.map((animal) => (
              <option key={animal} value={animal}>
                {animal}
              </option>
            ))}
          </select>

          {/* Level 2: Color (cascaded by animal) */}
          <select
            value={props.filters.color}
            onChange={(e) =>
              props.onFilterChange({
                ...props.filters,
                color: e.target.value,
              })
            }
            aria-label={t.filters.color}
            className="px-2.5 py-1.5 bg-canvas border border-border-dark focus:border-gold rounded-[2px] text-xs font-serif text-text-primary outline-none cursor-pointer"
          >
            <option value="all">{t.filters.color}: {t.filters.all}</option>
            {props.options.colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </>
      )}

      {props.type === "spells" && (
        <>
          {/* Level 1: Starting Letter */}
          <select
            value={props.filters.startingLetter}
            onChange={(e) =>
              props.onFilterChange({
                ...props.filters,
                startingLetter: e.target.value,
              })
            }
            aria-label={t.filters.startingLetter}
            className="px-2.5 py-1.5 bg-canvas border border-border-dark focus:border-gold rounded-[2px] text-xs font-serif text-text-primary outline-none cursor-pointer"
          >
            <option value="all">{t.filters.startingLetter}: {t.filters.all}</option>
            {props.options.letters.map((letter) => (
              <option key={letter} value={letter}>
                {letter}
              </option>
            ))}
          </select>

          {/* Level 2: Keyword Input */}
          <input
            type="text"
            value={props.filters.keyword}
            onChange={(e) =>
              props.onFilterChange({
                ...props.filters,
                keyword: e.target.value,
              })
            }
            placeholder={t.filters.keyword}
            className="px-3 py-1.5 bg-canvas border border-border-dark focus:border-gold rounded-[2px] text-xs font-serif text-text-primary outline-none w-44"
          />
        </>
      )}

      {/* Reset Button */}
      <button
        type="button"
        onClick={props.onReset}
        className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1.5 text-text-secondary hover:text-gold text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
        title={t.filters.reset}
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t.filters.reset}</span>
      </button>
    </div>
  );
}
