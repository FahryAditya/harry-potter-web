"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { User, Calendar, ExternalLink } from "lucide-react";
import type { Character } from "@/types";
import { HOUSE_THEME } from "@/lib/constants";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useTranslation } from "@/hooks/useTranslation";
import { useApp } from "@/context/AppContext";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const { t } = useTranslation();
  const { setActiveModalItem } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const [imgSrc, setImgSrc] = useState(character.image || "/fallback-avatar.svg");
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const houseStyle = HOUSE_THEME[character.hogwartsHouse];

  const favItem = {
    id: `characters-${character.index}`,
    type: "characters" as const,
    index: character.index,
    title: character.fullName,
    subtitle: character.hogwartsHouse || character.interpretedBy,
    image: character.image,
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX(-((y - centerY) / centerY) * 7);
    setRotateY(((x - centerX) / centerX) * 7);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
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
      whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: "#E5B869" }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className="group relative flex flex-col bg-surface border border-border-dark rounded-[2px] overflow-hidden transition-shadow hover:shadow-[0_8px_28px_rgba(229,184,105,0.18)] cursor-pointer will-change-transform"
      onClick={() => setActiveModalItem(character)}
    >
      {/* Specular Gilded Glare */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 rounded-[2px]"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(229,184,105,0.22), transparent 60%)`,
        }}
      />
      {/* 3:4 Aspect Ratio Framed Dark Portrait */}
      <div className="relative w-full aspect-[3/4] bg-surface-elevated overflow-hidden border-b border-border-dark">
        <Image
          src={imgSrc}
          alt={character.fullName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc("/fallback-avatar.svg")}
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-black/30 to-black/40 pointer-events-none" />

        {/* Upper Left: House Pill */}
        {character.hogwartsHouse && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-2 py-0.5 text-[10px] font-serif uppercase tracking-widest rounded-[2px] border backdrop-blur-md ${
                houseStyle
                  ? `${houseStyle.bg} ${houseStyle.text} ${houseStyle.border}`
                  : "bg-black/60 border-border-dark text-text-secondary"
              }`}
            >
              {character.hogwartsHouse}
            </span>
          </div>
        )}

        {/* Upper Right: Favorite Star */}
        <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
          <FavoriteButton item={favItem} />
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-gold block mb-0.5">
            Record #{character.index}
          </span>
          <h3 className="font-serif text-lg font-bold text-text-primary group-hover:text-gold transition-colors leading-tight line-clamp-1">
            {character.fullName}
          </h3>
          {character.nickname && (
            <p className="font-serif italic text-xs text-text-secondary/90 line-clamp-1">
              &ldquo;{character.nickname}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Card Metadata Footer */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-surface">
        <div className="space-y-1.5 text-xs text-text-secondary font-serif">
          {character.interpretedBy && (
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="truncate">{character.interpretedBy}</span>
            </div>
          )}
          {character.birthdate && (
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="truncate">{character.birthdate}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-border-dark/60 flex items-center justify-between">
          <Link
            href={`/characters/${character.index}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold hover:text-text-primary transition-colors"
          >
            <span>{t.landing.viewDossier}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <span className="font-mono text-[10px] text-text-secondary/60 uppercase">
            {character.children.length > 0 ? `${character.children.length} offspring` : "no offspring"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
