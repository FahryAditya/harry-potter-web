"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Calendar } from "lucide-react";
import type { Book } from "@/types";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useApp } from "@/context/AppContext";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { setActiveModalItem } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const [imgSrc, setImgSrc] = useState(book.cover || "/fallback-cover.svg");

  const favItem = {
    id: `books-${book.index}`,
    type: "books" as const,
    index: book.index,
    title: book.title,
    subtitle: `Tome #${book.number} • ${book.pages} pages`,
    image: book.cover,
  };

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: "#C5A059" }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col bg-surface border border-border-dark rounded-[2px] overflow-hidden transition-shadow hover:shadow-[0_4px_24px_rgba(197,160,89,0.12)] cursor-pointer"
      onClick={() => setActiveModalItem(book)}
    >
      {/* Vertical Book Cover Container */}
      <div className="relative w-full aspect-[2/3] bg-surface-elevated overflow-hidden border-b border-border-dark">
        <Image
          src={imgSrc}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc("/fallback-cover.svg")}
        />

        {/* Tome Number Badge Upper Left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded-[2px] bg-canvas/80 backdrop-blur-md border border-gold/40 text-gold">
            Tome #{book.number}
          </span>
        </div>

        {/* Favorite Button Upper Right */}
        <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
          <FavoriteButton item={favItem} />
        </div>

        {/* Subtle Bottom Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Book Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-surface">
        <div>
          <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-gold transition-colors leading-snug line-clamp-2">
            {book.title}
          </h3>
          {book.originalTitle && book.originalTitle !== book.title && (
            <p className="font-serif italic text-xs text-text-secondary/80 line-clamp-1 mt-0.5">
              {book.originalTitle}
            </p>
          )}
        </div>

        <p className="font-serif text-xs text-text-secondary leading-relaxed line-clamp-3">
          {book.description}
        </p>

        <div className="pt-2 border-t border-border-dark/60 flex items-center justify-between text-xs text-text-secondary font-mono">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            <span>{book.pages} p.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gold" />
            <span className="truncate">{book.releaseDate}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
