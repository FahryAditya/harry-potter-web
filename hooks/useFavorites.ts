"use client";

import { useApp } from "@/context/AppContext";

export function useFavorites() {
  const {
    userName,
    setUserName,
    favorites,
    addFavorite,
    removeFavorite,
    clearAllFavorites,
    isFavorite,
    isFavoritesDrawerOpen,
    setIsFavoritesDrawerOpen,
  } = useApp();

  return {
    userName,
    setUserName,
    favorites,
    addFavorite,
    removeFavorite,
    clearAllFavorites,
    isFavorite,
    isFavoritesDrawerOpen,
    setIsFavoritesDrawerOpen,
  };
}
