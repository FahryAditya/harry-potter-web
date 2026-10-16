import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer rounded-[2px] border border-border-dark/60 ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton with exact 3:4 portrait ratio for Character Cards
 */
export function CharacterCardSkeleton() {
  return (
    <div className="flex flex-col bg-surface border border-border-dark rounded-[2px] overflow-hidden">
      <Skeleton className="w-full aspect-[3/4]" />
      <div className="p-4 space-y-2">
        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-1/2 h-3.5" />
        <div className="pt-2 border-t border-border-dark/60 flex justify-between items-center">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-16 h-3" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton with exact 2:3 vertical cover ratio for Book Cards
 */
export function BookCardSkeleton() {
  return (
    <div className="flex flex-col bg-surface border border-border-dark rounded-[2px] overflow-hidden p-4">
      <Skeleton className="w-full aspect-[2/3] mb-4" />
      <Skeleton className="w-4/5 h-5 mb-2" />
      <Skeleton className="w-1/2 h-4 mb-3" />
      <div className="mt-auto pt-2 border-t border-border-dark/60 flex justify-between items-center">
        <Skeleton className="w-16 h-3" />
        <Skeleton className="w-20 h-3" />
      </div>
    </div>
  );
}

/**
 * Skeleton for parchment scroll Spell Cards
 */
export function SpellCardSkeleton() {
  return (
    <div className="p-6 bg-parchment/15 border border-border-dark rounded-[2px] min-h-[220px] flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <Skeleton className="w-28 h-3.5" />
        <Skeleton className="w-6 h-6 rounded-[2px]" />
      </div>
      <div className="my-4 space-y-2">
        <Skeleton className="w-3/5 h-6" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-4/5 h-4" />
      </div>
      <div className="pt-3 border-t border-border-dark/50 flex justify-between items-center">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-24 h-3" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 8, type = "character" }: { count?: number; type?: "character" | "book" | "spell" }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        type === "book" ? (
          <BookCardSkeleton key={i} />
        ) : type === "spell" ? (
          <SpellCardSkeleton key={i} />
        ) : (
          <CharacterCardSkeleton key={i} />
        )
      ))}
    </div>
  );
}
