"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import { useTranslation } from "@/hooks/useTranslation";
import type { FavoriteItem } from "@/types";

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, "addedAt">;
  className?: string;
  showText?: boolean;
}

export function FavoriteButton({ item, className = "", showText = false }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [isSparking, setIsSparking] = useState(false);

  const favorited = isFavorite(item.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (favorited) {
      removeFavorite(item.id);
    } else {
      const res = addFavorite(item);
      if (res.success) {
        setIsSparking(true);
        setTimeout(() => setIsSparking(false), 500);
      }
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
      className={`relative inline-flex items-center gap-1.5 p-2 rounded-[2px] transition-colors cursor-pointer ${
        favorited
          ? "bg-gold/15 text-gold border border-gold/50"
          : "bg-surface/80 hover:bg-surface-elevated text-text-secondary hover:text-gold border border-border-dark hover:border-gold/30"
      } ${className}`}
      title={favorited ? t.favorites.remove : t.favorites.add}
      aria-label={favorited ? t.favorites.remove : t.favorites.add}
    >
      <motion.div
        animate={
          isSparking && !shouldReduceMotion
            ? { rotate: [0, -25, 25, -10, 0], scale: [1, 1.35, 1] }
            : {}
        }
        transition={{ duration: 0.4 }}
      >
        <Star
          className={`w-4 h-4 transition-colors ${
            favorited ? "fill-gold text-gold" : "text-current"
          }`}
        />
      </motion.div>
      {showText && (
        <span className="font-mono text-xs uppercase tracking-wider">
          {favorited ? t.favorites.remove : t.favorites.add}
        </span>
      )}
    </motion.button>
  );
}
