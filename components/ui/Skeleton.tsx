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

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-surface border border-border-dark p-4 rounded-[2px] h-[380px]"
        >
          <Skeleton className="w-full h-[240px] mb-4" />
          <Skeleton className="w-3/4 h-5 mb-2" />
          <Skeleton className="w-1/2 h-4 mb-4" />
          <div className="mt-auto flex justify-between items-center">
            <Skeleton className="w-1/3 h-4" />
            <Skeleton className="w-8 h-8 rounded-[2px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
