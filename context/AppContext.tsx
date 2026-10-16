"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { SupportedLang, FavoriteItem, PotterItem } from "@/types";
import { getStoredLanguage, setStoredLanguage, getActiveUserName, setActiveUserName as persistUserName, getUserFavorites, saveUserFavorites, clearAllStoredData } from "@/lib/storage";
import { isValidUserName } from "@/lib/validators";
import { MAX_FAVORITES } from "@/lib/constants";
import { getTranslation } from "@/i18n";
import type { TranslationKeys } from "@/types/i18n";

interface AppContextValue {
  lang: SupportedLang;
  t: TranslationKeys;
  setLang: (newLang: SupportedLang) => void;
  userName: string;
  setUserName: (name: string) => boolean;
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, "addedAt">) => { success: boolean; error?: string };
  removeFavorite: (id: string) => void;
  clearAllFavorites: () => void;
  isFavorite: (id: string) => boolean;
  isFavoritesDrawerOpen: boolean;
  setIsFavoritesDrawerOpen: (open: boolean) => void;
  activeModalItem: PotterItem | null;
  setActiveModalItem: (item: PotterItem | null) => void;
  resetAllUserData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>("en");
  const [userName, setUserNameState] = useState<string>("");
  const [favorites, setFavoritesState] = useState<FavoriteItem[]>([]);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<PotterItem | null>(null);

  // Initialize from localStorage only on client mount to avoid hydration mismatch
  useEffect(() => {
    queueMicrotask(() => {
      const storedLang = getStoredLanguage();
      setLangState(storedLang);
      document.documentElement.lang = storedLang;

      const storedUser = getActiveUserName();
      setUserNameState(storedUser);

      if (storedUser) {
        const storedFavs = getUserFavorites(storedUser);
        setFavoritesState(storedFavs);
      }
    });
  }, []);

  const t = useMemo(() => getTranslation(lang), [lang]);

  const setLang = useCallback((newLang: SupportedLang) => {
    setLangState(newLang);
    setStoredLanguage(newLang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLang;
    }
  }, []);

  const setUserName = useCallback((name: string): boolean => {
    const trimmed = name.trim();
    if (!isValidUserName(trimmed)) {
      return false;
    }
    setUserNameState(trimmed);
    persistUserName(trimmed);
    // Load favorites for this user
    const existing = getUserFavorites(trimmed);
    setFavoritesState(existing);
    return true;
  }, []);

  const isFavorite = useCallback(
    (id: string): boolean => {
      return favorites.some((f) => f.id === id);
    },
    [favorites]
  );

  const addFavorite = useCallback(
    (item: Omit<FavoriteItem, "addedAt">): { success: boolean; error?: string } => {
      if (!userName.trim()) {
        setIsFavoritesDrawerOpen(true);
        return { success: false, error: "name_required" };
      }

      if (favorites.some((f) => f.id === item.id)) {
        return { success: true };
      }

      if (favorites.length >= MAX_FAVORITES) {
        return { success: false, error: "max_reached" };
      }

      const newItem: FavoriteItem = {
        ...item,
        addedAt: Date.now(),
      };

      const updated = [newItem, ...favorites];
      setFavoritesState(updated);
      saveUserFavorites(userName, updated);
      return { success: true };
    },
    [favorites, userName]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      const updated = favorites.filter((f) => f.id !== id);
      setFavoritesState(updated);
      if (userName.trim()) {
        saveUserFavorites(userName, updated);
      }
    },
    [favorites, userName]
  );

  const clearAllFavorites = useCallback(() => {
    setFavoritesState([]);
    if (userName.trim()) {
      saveUserFavorites(userName, []);
    }
  }, [userName]);

  const resetAllUserData = useCallback(() => {
    clearAllStoredData();
    setUserNameState("");
    setFavoritesState([]);
    setLangState("en");
    document.documentElement.lang = "en";
  }, []);

  const value = useMemo(
    () => ({
      lang,
      t,
      setLang,
      userName,
      setUserName,
      favorites,
      addFavorite,
      removeFavorite,
      clearAllFavorites,
      isFavorite,
      isFavoritesDrawerOpen,
      setIsFavoritesDrawerOpen,
      activeModalItem,
      setActiveModalItem,
      resetAllUserData,
    }),
    [
      lang,
      t,
      setLang,
      userName,
      setUserName,
      favorites,
      addFavorite,
      removeFavorite,
      clearAllFavorites,
      isFavorite,
      isFavoritesDrawerOpen,
      activeModalItem,
      resetAllUserData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
