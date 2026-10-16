"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Wand2 } from "lucide-react";
import type { Spell } from "@/types";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useApp } from "@/context/AppContext";

interface SpellCardProps {
  spell: Spell;
}

export function SpellCard({ spell }: SpellCardProps) {
  const { setActiveModalItem, isReducedMotion } = useApp();
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = systemReducedMotion || isReducedMotion;
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const favItem = {
    id: `spells-${spell.index}`,
    type: "spells" as const,
    index: spell.index,
    title: spell.spell,
    subtitle: spell.use,
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRotateX(-((y - rect.height / 2) / (rect.height / 2)) * 6);
    setRotateY(((x - rect.width / 2) / (rect.width / 2)) * 6);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      animate={{ rotateX, rotateY }}
      whileHover={shouldReduceMotion ? undefined : { y: -5, borderColor: "#E5B869" }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className="group relative flex flex-col justify-between p-6 bg-parchment border border-parchment-border rounded-[2px] min-h-[220px] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(229,184,105,0.25)] cursor-pointer text-ink will-change-transform"
      onClick={() => setActiveModalItem(spell)}
    >
      {/* Decorative Corner Flairs for Gothic Scroll Feel */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-ink/30 pointer-events-none" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-ink/30 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-ink/30 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-ink/30 pointer-events-none" />

      {/* Top Row: Rune index, wand gesture SVG & favorite star */}
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

      {/* Bottom: Archive Footer & Wand Vector Motion Diagram */}
      <div className="pt-3 border-t border-parchment-border/80 flex items-center justify-between text-ink/70 font-mono text-[10px] uppercase tracking-widest">
        {/* Animated Wand Trajectory Path on Hover */}
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 44 16" className="w-9 h-3.5 overflow-visible" fill="none" aria-hidden="true">
            <path
              d="M2 13 C 12 1, 22 15, 40 4"
              stroke="#9E2A2B"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="transition-all duration-700 [stroke-dasharray:55] [stroke-dashoffset:55] group-hover:[stroke-dashoffset:0]"
            />
            <circle cx="40" cy="4" r="2" fill="#E5B869" />
          </svg>
          <span className="text-[9px]">Wand Arc</span>
        </div>
        <span>Tap to inspect &rarr;</span>
      </div>
    </motion.div>
  );
}
