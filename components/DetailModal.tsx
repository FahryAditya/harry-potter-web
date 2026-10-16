"use client";

import React from "react";
import Image from "next/image";
import { X, Calendar, User, BookOpen, Shield, Sparkles, Feather } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";
import { FavoriteButton } from "@/components/FavoriteButton";
import { isBook, isCharacter, isHouse, isSpell } from "@/lib/validators";
import { HOUSE_THEME } from "@/lib/constants";

export function DetailModal() {
  const { activeModalItem, setActiveModalItem } = useApp();
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  if (!activeModalItem) return null;

  const handleClose = () => setActiveModalItem(null);

  const renderContent = () => {
    if (isCharacter(activeModalItem)) {
      const houseStyle = HOUSE_THEME[activeModalItem.hogwartsHouse];
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-48 h-64 bg-surface-elevated border border-border-dark rounded-[2px] relative overflow-hidden shrink-0">
              <Image
                src={activeModalItem.image || "/fallback-avatar.svg"}
                alt={activeModalItem.fullName}
                fill
                sizes="(max-width: 640px) 100vw, 192px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                  {t.dossier.kicker}
                </span>
                <h3 className="font-serif text-2xl text-text-primary tracking-wide">
                  {activeModalItem.fullName}
                </h3>
                {activeModalItem.nickname && (
                  <p className="font-serif italic text-sm text-gold/80">
                    &ldquo;{activeModalItem.nickname}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {activeModalItem.hogwartsHouse && (
                  <span
                    className={`px-2.5 py-1 text-xs font-serif uppercase tracking-wider rounded-[2px] border ${
                      houseStyle ? `${houseStyle.bg} ${houseStyle.text} ${houseStyle.border}` : "bg-surface border-border-dark text-text-secondary"
                    }`}
                  >
                    {activeModalItem.hogwartsHouse}
                  </span>
                )}
                <span className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded-[2px] bg-surface border border-border-dark text-text-secondary">
                  {t.dossier.index}: #{activeModalItem.index}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-canvas border border-border-dark rounded-[2px]">
                  <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                    <User className="w-3.5 h-3.5 text-gold" />
                    <span className="uppercase font-mono text-[10px] tracking-wider">{t.dossier.actor}</span>
                  </div>
                  <span className="font-serif text-text-primary text-sm">
                    {activeModalItem.interpretedBy || "—"}
                  </span>
                </div>

                <div className="p-3 bg-canvas border border-border-dark rounded-[2px]">
                  <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    <span className="uppercase font-mono text-[10px] tracking-wider">{t.dossier.birthdate}</span>
                  </div>
                  <span className="font-serif text-text-primary text-sm">
                    {activeModalItem.birthdate || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Children List */}
          <div className="p-4 bg-canvas border border-border-dark rounded-[2px]">
            <div className="flex items-center gap-2 mb-2">
              <Feather className="w-4 h-4 text-gold" />
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                {t.dossier.children}
              </span>
            </div>
            {activeModalItem.children && activeModalItem.children.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-serif text-text-primary list-disc list-inside">
                {activeModalItem.children.map((child, idx) => (
                  <li key={idx}>{child}</li>
                ))}
              </ul>
            ) : (
              <p className="font-serif italic text-xs text-text-secondary">
                {t.dossier.noChildren}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (isBook(activeModalItem)) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-44 h-64 bg-surface-elevated border border-border-dark rounded-[2px] relative overflow-hidden shrink-0">
              <Image
                src={activeModalItem.cover || "/fallback-cover.svg"}
                alt={activeModalItem.title}
                fill
                sizes="(max-width: 640px) 100vw, 176px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
                  Tome #{activeModalItem.number}
                </span>
                <h3 className="font-serif text-2xl text-text-primary tracking-wide">
                  {activeModalItem.title}
                </h3>
                {activeModalItem.originalTitle && activeModalItem.originalTitle !== activeModalItem.title && (
                  <p className="font-serif italic text-xs text-text-secondary mt-0.5">
                    {t.dossier.originalTitle}: {activeModalItem.originalTitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-canvas border border-border-dark rounded-[2px]">
                  <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-gold" />
                    <span className="uppercase font-mono text-[10px] tracking-wider">{t.dossier.pages}</span>
                  </div>
                  <span className="font-serif text-text-primary text-sm">
                    {activeModalItem.pages} pages
                  </span>
                </div>

                <div className="p-3 bg-canvas border border-border-dark rounded-[2px]">
                  <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    <span className="uppercase font-mono text-[10px] tracking-wider">{t.dossier.releaseDate}</span>
                  </div>
                  <span className="font-serif text-text-primary text-sm">
                    {activeModalItem.releaseDate}
                  </span>
                </div>
              </div>

              <p className="font-serif text-sm text-text-secondary leading-relaxed pt-2">
                {activeModalItem.description}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (isHouse(activeModalItem)) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-dark">
            <div className="flex items-center gap-4">
              <span className="text-4xl" role="img" aria-label={activeModalItem.house}>
                {activeModalItem.emoji}
              </span>
              <div>
                <h3 className="font-serif text-2xl text-text-primary tracking-wider">
                  {activeModalItem.house}
                </h3>
                <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                  Founder: {activeModalItem.founder}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-canvas border border-border-dark rounded-[2px] space-y-1">
              <div className="flex items-center gap-2 text-text-secondary">
                <Shield className="w-4 h-4 text-gold" />
                <span className="font-mono text-xs uppercase tracking-wider">{t.dossier.animal}</span>
              </div>
              <p className="font-serif text-base text-text-primary font-medium">
                {activeModalItem.animal}
              </p>
            </div>

            <div className="p-4 bg-canvas border border-border-dark rounded-[2px] space-y-1">
              <div className="flex items-center gap-2 text-text-secondary">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="font-mono text-xs uppercase tracking-wider">{t.dossier.colors}</span>
              </div>
              <div className="flex gap-2 pt-1">
                {activeModalItem.colors.map((color, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-serif uppercase tracking-wider bg-surface border border-border-dark rounded-[2px] text-text-primary"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isSpell(activeModalItem)) {
      return (
        <div className="space-y-6">
          <div className="p-6 bg-parchment border border-parchment-border rounded-[2px] text-ink relative">
            <span className="font-mono text-[10px] uppercase tracking-widest text-crimson font-bold block mb-1">
              Incantation Scroll #{activeModalItem.index}
            </span>
            <h3 className="font-serif text-3xl font-bold tracking-wide text-ink mb-4">
              {activeModalItem.spell}
            </h3>
            <div className="border-t border-parchment-border/80 pt-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink/70 block mb-1">
                {t.dossier.effect}
              </span>
              <p className="font-serif text-base text-ink leading-relaxed">
                {activeModalItem.use}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const getFavoriteItemData = () => {
    if (isCharacter(activeModalItem)) {
      return {
        id: `characters-${activeModalItem.index}`,
        type: "characters" as const,
        index: activeModalItem.index,
        title: activeModalItem.fullName,
        subtitle: activeModalItem.hogwartsHouse || activeModalItem.interpretedBy,
        image: activeModalItem.image,
      };
    }
    if (isBook(activeModalItem)) {
      return {
        id: `books-${activeModalItem.index}`,
        type: "books" as const,
        index: activeModalItem.index,
        title: activeModalItem.title,
        subtitle: `Tome #${activeModalItem.number} (${activeModalItem.pages}p)`,
        image: activeModalItem.cover,
      };
    }
    if (isHouse(activeModalItem)) {
      return {
        id: `houses-${activeModalItem.index}`,
        type: "houses" as const,
        index: activeModalItem.index,
        title: activeModalItem.house,
        subtitle: `${activeModalItem.animal} • ${activeModalItem.founder}`,
      };
    }
    if (isSpell(activeModalItem)) {
      return {
        id: `spells-${activeModalItem.index}`,
        type: "spells" as const,
        index: activeModalItem.index,
        title: activeModalItem.spell,
        subtitle: activeModalItem.use,
      };
    }
    return null;
  };

  const favData = getFavoriteItemData();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
          className="relative bg-surface border border-border-dark p-6 sm:p-8 max-w-2xl w-full rounded-[2px] shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Top Actions: Favorite Button & Close */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-dark">
            {favData && <FavoriteButton item={favData} showText />}
            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-[2px] transition-colors ml-auto cursor-pointer"
              aria-label="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          {renderContent()}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
