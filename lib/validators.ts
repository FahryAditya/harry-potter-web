import type { Book, Character, House, Spell, FavoriteItem, UserFavoritesStore } from "@/types";

export function isBook(data: unknown): data is Book {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.number === "number" &&
    typeof d.title === "string" &&
    typeof d.originalTitle === "string" &&
    typeof d.releaseDate === "string" &&
    typeof d.description === "string" &&
    typeof d.pages === "number" &&
    typeof d.cover === "string" &&
    typeof d.index === "number"
  );
}

export function isCharacter(data: unknown): data is Character {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.fullName === "string" &&
    typeof d.nickname === "string" &&
    typeof d.hogwartsHouse === "string" &&
    typeof d.interpretedBy === "string" &&
    Array.isArray(d.children) &&
    typeof d.image === "string" &&
    typeof d.birthdate === "string" &&
    typeof d.index === "number"
  );
}

export function isHouse(data: unknown): data is House {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.house === "string" &&
    typeof d.emoji === "string" &&
    typeof d.founder === "string" &&
    Array.isArray(d.colors) &&
    typeof d.animal === "string" &&
    typeof d.index === "number"
  );
}

export function isSpell(data: unknown): data is Spell {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.spell === "string" &&
    typeof d.use === "string" &&
    typeof d.index === "number"
  );
}

export function isFavoriteItem(data: unknown): data is FavoriteItem {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  const validTypes = ["characters", "spells", "houses", "books"];
  return (
    typeof d.id === "string" &&
    typeof d.type === "string" &&
    validTypes.includes(d.type) &&
    typeof d.index === "number" &&
    typeof d.title === "string" &&
    typeof d.subtitle === "string" &&
    typeof d.addedAt === "number"
  );
}

export function isUserFavoritesStore(data: unknown): data is UserFavoritesStore {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.userName === "string" &&
    Array.isArray(d.items) &&
    d.items.every(isFavoriteItem)
  );
}

const USERNAME_REGEX = /^[a-zA-Z0-9 _-]{1,24}$/;

export function isValidUserName(name: string): boolean {
  const trimmed = name.trim();
  return USERNAME_REGEX.test(trimmed);
}
