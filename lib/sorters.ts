import type { Character, Book, House, Spell, SortOrder, SupportedLang } from "@/types";

function parseBirthYear(birthdateStr: string): number {
  const match = birthdateStr.match(/\b(18\d\d|19\d\d|20\d\d)\b/);
  return match ? parseInt(match[1], 10) : 0;
}

export function sortCharacters(
  items: readonly Character[],
  sortBy: "name" | "birthdate",
  order: SortOrder,
  lang: SupportedLang
): Character[] {
  if (order === "default") return [...items];

  const sorted = [...items];
  sorted.sort((a, b) => {
    if (sortBy === "birthdate") {
      const yearA = parseBirthYear(a.birthdate);
      const yearB = parseBirthYear(b.birthdate);
      return order === "asc" ? yearA - yearB : yearB - yearA;
    }
    // name
    const cmp = a.fullName.localeCompare(b.fullName, lang);
    return order === "asc" ? cmp : -cmp;
  });

  return sorted;
}

export function sortBooks(
  items: readonly Book[],
  sortBy: "title" | "number" | "pages",
  order: SortOrder,
  lang: SupportedLang
): Book[] {
  if (order === "default") return [...items];

  const sorted = [...items];
  sorted.sort((a, b) => {
    if (sortBy === "number") {
      return order === "asc" ? a.number - b.number : b.number - a.number;
    }
    if (sortBy === "pages") {
      return order === "asc" ? a.pages - b.pages : b.pages - a.pages;
    }
    const cmp = a.title.localeCompare(b.title, lang);
    return order === "asc" ? cmp : -cmp;
  });

  return sorted;
}

export function sortHouses(
  items: readonly House[],
  order: SortOrder,
  lang: SupportedLang
): House[] {
  if (order === "default") return [...items];

  const sorted = [...items];
  sorted.sort((a, b) => {
    const cmp = a.house.localeCompare(b.house, lang);
    return order === "asc" ? cmp : -cmp;
  });

  return sorted;
}

export function sortSpells(
  items: readonly Spell[],
  order: SortOrder,
  lang: SupportedLang
): Spell[] {
  if (order === "default") return [...items];

  const sorted = [...items];
  sorted.sort((a, b) => {
    const cmp = a.spell.localeCompare(b.spell, lang);
    return order === "asc" ? cmp : -cmp;
  });

  return sorted;
}
