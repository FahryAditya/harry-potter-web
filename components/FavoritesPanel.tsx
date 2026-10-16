"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Trash2, AlertCircle, Shield, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import { useTranslation } from "@/hooks/useTranslation";
import { UserNameInput } from "@/components/layout/UserNameInput";
import { MAX_FAVORITES } from "@/lib/constants";
import type { FavoriteItem } from "@/types";

export function FavoritesPanel() {
  const {
    favorites,
    removeFavorite,
    clearAllFavorites,
    isFavoritesDrawerOpen,
    setIsFavoritesDrawerOpen,
  } = useFavorites();
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  // State for confirming removal of a single item
  const [itemToRemove, setItemToRemove] = useState<FavoriteItem | null>(null);
  // State for confirming purge of all items
  const [isConfirmingClearAll, setIsConfirmingClearAll] = useState(false);

  if (!isFavoritesDrawerOpen) return null;

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeFavorite(itemToRemove.id);
      setItemToRemove(null);
    }
  };

  const handleConfirmClearAll = () => {
    clearAllFavorites();
    setIsConfirmingClearAll(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="vault-panel-title"
      role="region"
    >
      {/* Backdrop */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsFavoritesDrawerOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={shouldReduceMotion ? { x: 0 } : { x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="w-screen max-w-md bg-canvas border-l border-border-dark flex flex-col shadow-2xl relative z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-border-dark flex items-center justify-between bg-surface">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[2px] bg-gold/10 border border-gold/40 flex items-center justify-center text-gold">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h2
                  id="vault-panel-title"
                  className="font-serif text-lg tracking-wide text-text-primary"
                >
                  {t.favorites.drawerTitle}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                  {t.favorites.slotsUsed
                    .replace("{used}", favorites.length.toString())
                    .replace("{max}", MAX_FAVORITES.toString())}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFavoritesDrawerOpen(false)}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-[2px] transition-colors"
              aria-label="Close Vault"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* User Name Inscription Box */}
            <div className="p-4 bg-surface/50 border border-border-dark rounded-[2px]">
              <UserNameInput />
            </div>

            {/* Slots Overview (4 Slots) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                  Vault Reliquary ({favorites.length}/{MAX_FAVORITES})
                </span>
                {favorites.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingClearAll(true)}
                    className="text-[11px] font-mono text-crimson hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    {t.favorites.clearAll}
                  </button>
                )}
              </div>

              {/* Grid of the 4 slots */}
              <div className="grid grid-cols-1 gap-3">
                {Array.from({ length: MAX_FAVORITES }).map((_, index) => {
                  const item = favorites[index];
                  if (!item) {
                    // Empty Slot
                    return (
                      <div
                        key={`empty-${index}`}
                        className="h-20 border border-dashed border-border-dark bg-surface/20 rounded-[2px] flex items-center justify-center text-text-secondary/40 text-xs font-mono tracking-widest"
                      >
                        [ SLOT {index + 1} VACANT ]
                      </div>
                    );
                  }

                  // Preserved Item Card
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-surface border border-border-dark hover:border-gold/40 rounded-[2px] flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-12 h-14 bg-surface-elevated border border-border-dark rounded-[2px] shrink-0 relative overflow-hidden flex items-center justify-center">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Sparkles className="w-4 h-4 text-gold/60" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="inline-block px-1.5 py-0.5 text-[9px] uppercase font-mono tracking-widest rounded-[2px] bg-gold/10 text-gold mb-1">
                            {item.type}
                          </span>
                          <h4 className="font-serif text-sm text-text-primary truncate">
                            {item.title}
                          </h4>
                          <p className="font-serif text-xs text-text-secondary truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setItemToRemove(item)}
                        className="p-2 text-text-secondary hover:text-crimson hover:bg-surface-elevated rounded-[2px] transition-colors shrink-0 cursor-pointer"
                        title={t.favorites.remove}
                        aria-label={`${t.favorites.remove} ${item.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Empty state notice if no favorites at all */}
            {favorites.length === 0 && (
              <div className="p-6 text-center text-text-secondary font-serif text-sm leading-relaxed border border-border-dark/60 bg-surface/30 rounded-[2px]">
                <p>{t.favorites.emptyMessage}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal for Single Removal */}
      <AnimatePresence>
        {itemToRemove && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80"
              onClick={() => setItemToRemove(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-surface border border-border-dark p-6 max-w-sm w-full rounded-[2px] shadow-2xl text-center space-y-4 z-10"
            >
              <div className="w-10 h-10 mx-auto rounded-[2px] bg-crimson/10 border border-crimson/30 flex items-center justify-center text-crimson">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-text-primary">
                {t.favorites.confirmRemoveTitle}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {t.favorites.confirmRemoveMessage}
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setItemToRemove(null)}
                  className="flex-1 py-2 px-3 bg-surface-elevated hover:bg-surface border border-border-dark text-xs uppercase font-mono tracking-wider rounded-[2px] text-text-secondary cursor-pointer"
                >
                  {t.favorites.confirmCancel}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRemove}
                  className="flex-1 py-2 px-3 bg-crimson/20 hover:bg-crimson/30 border border-crimson/60 text-xs uppercase font-mono tracking-wider rounded-[2px] text-red-200 cursor-pointer"
                >
                  {t.favorites.confirmYes}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Clear All */}
      <AnimatePresence>
        {isConfirmingClearAll && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80"
              onClick={() => setIsConfirmingClearAll(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-surface border border-crimson/40 p-6 max-w-sm w-full rounded-[2px] shadow-2xl text-center space-y-4 z-10"
            >
              <div className="w-10 h-10 mx-auto rounded-[2px] bg-crimson/10 border border-crimson/40 flex items-center justify-center text-crimson">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-text-primary">
                {t.favorites.clearAll}?
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {t.settings.confirmClearAllMessage}
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmingClearAll(false)}
                  className="flex-1 py-2 px-3 bg-surface-elevated hover:bg-surface border border-border-dark text-xs uppercase font-mono tracking-wider rounded-[2px] text-text-secondary cursor-pointer"
                >
                  {t.favorites.confirmCancel}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClearAll}
                  className="flex-1 py-2 px-3 bg-crimson hover:bg-crimson/80 text-white text-xs uppercase font-mono tracking-wider rounded-[2px] cursor-pointer"
                >
                  {t.favorites.confirmYes}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
