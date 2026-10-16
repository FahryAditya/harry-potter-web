"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Shield, Sparkles, Users } from "lucide-react";
import type { House } from "@/types";
import { HOUSE_THEME } from "@/lib/constants";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useTranslation } from "@/hooks/useTranslation";
import { useApp } from "@/context/AppContext";

interface HouseCardProps {
  house: House;
}

export function HouseCard({ house }: HouseCardProps) {
  const { t } = useTranslation();
  const { setActiveModalItem, isReducedMotion } = useApp();
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = systemReducedMotion || isReducedMotion;

  const theme = HOUSE_THEME[house.house] || {
    bg: "bg-surface",
    text: "text-gold",
    border: "border-border-dark",
    accent: "#C5A059",
  };

  const favItem = {
    id: `houses-${house.index}`,
    type: "houses" as const,
    index: house.index,
    title: house.house,
    subtitle: `${house.animal} • ${house.founder}`,
  };

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX(-((y - centerY) / centerY) * 6);
    setRotateY(((x - centerX) / centerX) * 6);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.28,
    });
  };

  const handleCardMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      animate={{ rotateX, rotateY }}
      whileHover={shouldReduceMotion ? undefined : { y: -6, borderColor: theme.accent }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.22 }}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={`group relative flex flex-col justify-between p-6 sm:p-8 bg-surface border ${theme.border} rounded-[2px] min-h-[460px] overflow-hidden transition-shadow hover:shadow-[0_12px_36px_rgba(0,0,0,0.55)] cursor-pointer will-change-transform`}
      onClick={() => setActiveModalItem(house)}
    >
      {/* Dynamic Specular Glare */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 rounded-[2px]"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(229,184,105,0.22), transparent 60%)`,
        }}
      />
      {/* Subtle House Tint Gradient in Background */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none transition-opacity group-hover:opacity-25"
        style={{
          background: `radial-gradient(circle at top right, ${theme.accent}, transparent 70%)`,
        }}
      />

      {/* Top Banner Row */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl" role="img" aria-label={house.house}>
            {house.emoji}
          </span>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
              Hogwarts House
            </span>
            <h3 className="font-serif text-2xl font-bold tracking-wider text-text-primary group-hover:text-gold transition-colors">
              {house.house}
            </h3>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <FavoriteButton item={favItem} />
        </div>
      </div>

      {/* Center Heraldry Info */}
      <div className="relative z-10 my-6 space-y-4">
        <div className="p-4 bg-canvas/80 border border-border-dark rounded-[2px] space-y-1">
          <div className="flex items-center gap-2 text-text-secondary">
            <Shield className="w-4 h-4 text-gold" />
            <span className="font-mono text-[11px] uppercase tracking-wider">{t.dossier.animal}</span>
          </div>
          <p className="font-serif text-base text-text-primary font-medium">
            {house.animal}
          </p>
        </div>

        <div className="p-4 bg-canvas/80 border border-border-dark rounded-[2px] space-y-1">
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary block">
            {t.dossier.founder}
          </span>
          <p className="font-serif text-base text-text-primary">
            {house.founder}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
            {t.dossier.colors}:
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {house.colors.map((c, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[11px] font-serif uppercase tracking-wider bg-canvas border border-border-dark rounded-[2px] text-text-primary"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action: View Alumni Link */}
      <div className="relative z-10 pt-4 border-t border-border-dark/80 flex items-center justify-between">
        <Link
          href={`/characters?house=${encodeURIComponent(house.house)}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold hover:text-text-primary transition-colors"
        >
          <Users className="w-3.5 h-3.5" />
          <span>View House Alumni</span>
        </Link>
        <span className="font-mono text-[10px] text-text-secondary uppercase">
          Archive #{house.index}
        </span>
      </div>
    </motion.div>
  );
}
