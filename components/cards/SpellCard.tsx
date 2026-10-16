"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Wand2 } from "lucide-react";
import type { Spell } from "@/types";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useApp } from "@/context/AppContext";

interface SpellCardProps {
  spell: Spell;
}

export function SpellCard({ spell }: SpellCardProps) {
  const { setActiveModalItem } = useApp();
  const shouldReduceMotion = useReducedMotion();

  const favItem = {
    id: `spells-${spell.index}`,
    type: "spells" as const,
    index: spell.index,
    title: spell.spell,
    subtitle: spell.use,
  };

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: "#8B2222" }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between p-6 bg-parchment border border-parchment-border rounded-[2px] min-h-[220px] transition-shadow hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] cursor-pointer text-ink"
      onClick={() => setActiveModalItem(spell)}
    >
      {/* Decorative Corner Flairs for Gothic Scroll Feel */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-ink/30 pointer-events-none" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-ink/30 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-ink/30 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-ink/30 pointer-events-none" />

      {/* Top Row: Rune index & favorite star */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-crimson">
          <Wand2 className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
            Incantation #{spell.index}
          </span>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <FavoriteButton item={favItem} />
        </div>
      </div>

      {/* Center: Spell Title & Effect */}
      <div className="my-3 space-y-2">
        <h3 className="font-serif text-2xl font-bold tracking-wide text-ink group-hover:text-crimson transition-colors">
          {spell.spell}
        </h3>
        <p className="font-serif text-sm text-ink/80 leading-relaxed line-clamp-3">
          {spell.use}
        </p>
      </div>

      {/* Bottom: Archive Footer */}
      <div className="pt-3 border-t border-parchment-border/80 flex items-center justify-between text-ink/60 font-mono text-[10px] uppercase tracking-widest">
        <span>Scroll Record</span>
        <span>Tap to inspect</span>
      </div>
    </motion.div>
  );
}
