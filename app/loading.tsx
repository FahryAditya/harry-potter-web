import React from "react";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[50vh]">
      <div className="w-12 h-12 rounded-[2px] bg-surface-elevated border border-gold/40 flex items-center justify-center text-gold mb-4 animate-pulse">
        <Sparkles className="w-6 h-6 animate-spin text-gold" style={{ animationDuration: "3s" }} />
      </div>
      <p className="font-serif text-sm tracking-widest text-text-secondary uppercase">
        Consulting ancient scrolls...
      </p>
    </div>
  );
}
