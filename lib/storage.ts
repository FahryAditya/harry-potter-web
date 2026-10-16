import type { FavoriteItem, SupportedLang } from "@/types";
import { isFavoriteItem } from "./validators";
import { isSupportedLang } from "./endpoints";
import { MAX_FAVORITES } from "./constants";

const ACTIVE_USER_KEY = "potter_active_user";
const LANG_STORAGE_KEY = "potter_lang";
const FAVORITES_PREFIX = "potter_fav_";

function getFavoritesKey(userName: string): string {
  const safeName = userName.trim().toLowerCase().replace(/\s+/g, "_");
  return `${FAVORITES_PREFIX}${safeName}`;
}

export function getActiveUserName(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(ACTIVE_USER_KEY) || "";
  } catch {
    return "";
  }
}

export function setActiveUserName(userName: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_USER_KEY, userName.trim());
  } catch {
    // Graceful fallback for private browsing / quota issues
  }
}

export function getUserFavorites(userName: string): FavoriteItem[] {
  if (typeof window === "undefined" || !userName.trim()) return [];
  try {
    const raw = localStorage.getItem(getFavoritesKey(userName));
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const validItems: FavoriteItem[] = [];
    for (const item of parsed) {
      if (isFavoriteItem(item)) {
        validItems.push(item);
      }
    }
    return validItems.slice(0, MAX_FAVORITES);
  } catch {
    // If parsing fails or corrupted, reset safely
    return [];
  }
}

export function saveUserFavorites(userName: string, items: readonly FavoriteItem[]): boolean {
  if (typeof window === "undefined" || !userName.trim()) return false;
  try {
    const trimmedItems = items.slice(0, MAX_FAVORITES);
    localStorage.setItem(getFavoritesKey(userName), JSON.stringify(trimmedItems));
    return true;
  } catch {
    return false;
  }
}

export function getStoredLanguage(): SupportedLang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored && isSupportedLang(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage errors
  }
  return "en";
}

export function setStoredLanguage(lang: SupportedLang): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore storage errors
  }
}

export function clearAllStoredData(): void {
  if (typeof window === "undefined") return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("potter_") || key === ACTIVE_USER_KEY || key === LANG_STORAGE_KEY)) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage errors
  }
}
