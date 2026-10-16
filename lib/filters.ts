import type {
  Character,
  Book,
  House,
  Spell,
  CharacterFilterState,
  BookFilterState,
  HouseFilterState,
  SpellFilterState,
} from "@/types";

/* ==========================================================
   CHARACTERS: House -> Actor -> Has Children
   ========================================================== */

export function filterCharacters(
  items: readonly Character[],
  filters: CharacterFilterState
): Character[] {
  return items.filter((char) => {
    // 1. House filter
    if (filters.house && filters.house !== "all" && char.hogwartsHouse !== filters.house) {
      return false;
    }

    // 2. Actor filter
    if (filters.actor && filters.actor !== "all" && char.interpretedBy !== filters.actor) {
      return false;
    }

    // 3. Has Children filter
    if (filters.hasChildren === "yes" && char.children.length === 0) {
      return false;
    }
    if (filters.hasChildren === "no" && char.children.length > 0) {
      return false;
    }

    return true;
  });
}

export function getCharacterFilterOptions(
  items: readonly Character[],
  currentFilters: CharacterFilterState
) {
  // Houses available from all characters
  const houses = Array.from(
    new Set(items.map((c) => c.hogwartsHouse).filter(Boolean))
  ).sort();

  // Actors cascaded by selected house
  const houseFiltered = currentFilters.house && currentFilters.house !== "all"
    ? items.filter((c) => c.hogwartsHouse === currentFilters.house)
    : items;

  const actors = Array.from(
    new Set(houseFiltered.map((c) => c.interpretedBy).filter(Boolean))
  ).sort();

  return { houses, actors };
}

/* ==========================================================
   BOOKS: Release Year -> Page Range
   ========================================================== */

export function extractReleaseYear(dateStr: string): string {
  const match = dateStr.match(/\b(19\d\d|20\d\d)\b/);
  return match ? match[1] : "";
}

export function filterBooks(
  items: readonly Book[],
  filters: BookFilterState
): Book[] {
  return items.filter((book) => {
    // 1. Release Year
    if (filters.releaseYear && filters.releaseYear !== "all") {
      const year = extractReleaseYear(book.releaseDate);
      if (year !== filters.releaseYear) {
        return false;
      }
    }

    // 2. Page Range
    if (filters.pageRange === "under300" && book.pages >= 300) {
      return false;
    }
    if (filters.pageRange === "300to500" && (book.pages < 300 || book.pages > 500)) {
      return false;
    }
    if (filters.pageRange === "over500" && book.pages <= 500) {
      return false;
    }

    return true;
  });
}

export function getBookFilterOptions(
  items: readonly Book[]
) {
  const years = Array.from(
    new Set(items.map((b) => extractReleaseYear(b.releaseDate)).filter(Boolean))
  ).sort();

  return { years };
}

/* ==========================================================
   HOUSES: Animal -> Color
   ========================================================== */

export function filterHouses(
  items: readonly House[],
  filters: HouseFilterState
): House[] {
  return items.filter((house) => {
    // 1. Animal
    if (filters.animal && filters.animal !== "all" && house.animal.toLowerCase() !== filters.animal.toLowerCase()) {
      return false;
    }

    // 2. Color
    if (filters.color && filters.color !== "all") {
      const hasColor = house.colors.some((c) => c.toLowerCase() === filters.color.toLowerCase());
      if (!hasColor) return false;
    }

    return true;
  });
}

export function getHouseFilterOptions(
  items: readonly House[],
  currentFilters: HouseFilterState
) {
  const animals = Array.from(
    new Set(items.map((h) => h.animal).filter(Boolean))
  ).sort();

  // Colors cascaded by selected animal
  const animalFiltered = currentFilters.animal && currentFilters.animal !== "all"
    ? items.filter((h) => h.animal.toLowerCase() === currentFilters.animal.toLowerCase())
    : items;

  const colors = Array.from(
    new Set(animalFiltered.flatMap((h) => h.colors).filter(Boolean))
  ).sort();

  return { animals, colors };
}

/* ==========================================================
   SPELLS: Starting Letter -> Keyword in Use
   ========================================================== */

export function filterSpells(
  items: readonly Spell[],
  filters: SpellFilterState
): Spell[] {
  return items.filter((spell) => {
    // 1. Starting Letter
    if (filters.startingLetter && filters.startingLetter !== "all") {
      const firstLetter = spell.spell.trim().charAt(0).toUpperCase();
      if (firstLetter !== filters.startingLetter.toUpperCase()) {
        return false;
      }
    }

    // 2. Keyword in Use
    if (filters.keyword && filters.keyword.trim().length > 0) {
      const kw = filters.keyword.toLowerCase().trim();
      if (!spell.use.toLowerCase().includes(kw)) {
        return false;
      }
    }

    return true;
  });
}

export function getSpellFilterOptions(
  items: readonly Spell[]
) {
  const letters = Array.from(
    new Set(items.map((s) => s.spell.trim().charAt(0).toUpperCase()).filter(Boolean))
  ).sort();

  return { letters };
}
