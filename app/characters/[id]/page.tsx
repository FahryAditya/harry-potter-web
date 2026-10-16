"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Feather, Sparkles } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePotterData } from "@/hooks/usePotterData";
import { FavoriteButton } from "@/components/FavoriteButton";
import { HOUSE_THEME } from "@/lib/constants";
import type { Character } from "@/types";
import { CharacterCard } from "@/components/cards/CharacterCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

interface CharacterDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CharacterDetailPage({ params }: CharacterDetailPageProps) {
  const resolvedParams = use(params);
  const characterIndex = parseInt(resolvedParams.id, 10);

  const { t } = useTranslation();
  const { data: allCharacters, loading, error, retry } = usePotterData<Character>("characters");

  const [activeTab, setActiveTab] = useState<"dossier" | "offspring" | "allegiance">("dossier");

  const character = allCharacters.find((c) => c.index === characterIndex);
  const houseStyle = character ? HOUSE_THEME[character.hogwartsHouse] : undefined;

  // Related characters from same house
  const relatedCharacters = character && character.hogwartsHouse
    ? allCharacters
        .filter((c) => c.hogwartsHouse === character.hogwartsHouse && c.index !== character.index)
        .slice(0, 4)
    : [];

  if (loading) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Skeleton className="w-48 h-6 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Skeleton className="lg:col-span-5 h-[480px]" />
          <Skeleton className="lg:col-span-7 h-[480px]" />
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link
          href="/characters"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.dossier.backToList}</span>
        </Link>
        <ErrorState
          message={error || "Record not found in the Ministry archives."}
          onRetry={retry}
        />
      </div>
    );
  }

  const favItem = {
    id: `characters-${character.index}`,
    type: "characters" as const,
    index: character.index,
    title: character.fullName,
    subtitle: character.hogwartsHouse || character.interpretedBy,
    image: character.image,
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between border-b border-border-dark pb-4">
        <Link
          href="/characters"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.dossier.backToList}</span>
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
          Record #{character.index}
        </span>
      </div>

      {/* Split 50/50: Framed Portrait and Profile Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Framed Portrait */}
        <div className="lg:col-span-5">
          <div className="relative w-full aspect-[3/4] max-w-md mx-auto bg-surface-elevated border border-gold/40 rounded-[2px] p-2 shadow-2xl">
            <div className="relative w-full h-full overflow-hidden border border-border-dark rounded-[2px]">
              <Image
                src={character.image || "/fallback-avatar.svg"}
                alt={character.fullName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 z-10">
                <FavoriteButton item={favItem} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Header Profile & Parchment Tabs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
                {t.dossier.kicker}
              </span>
              {character.hogwartsHouse && (
                <span
                  className={`px-2.5 py-0.5 text-xs font-serif uppercase tracking-wider rounded-[2px] border ${
                    houseStyle
                      ? `${houseStyle.bg} ${houseStyle.text} ${houseStyle.border}`
                      : "bg-surface border-border-dark text-text-secondary"
                  }`}
                >
                  {character.hogwartsHouse}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-text-primary">
              {character.fullName}
            </h1>

            {character.nickname && (
              <p className="font-serif italic text-base text-gold/80">
                &ldquo;{character.nickname}&rdquo;
              </p>
            )}
          </div>

          {/* Quick Metadata Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-surface border border-border-dark rounded-[2px]">
              <div className="flex items-center gap-2 text-text-secondary mb-1">
                <User className="w-4 h-4 text-gold" />
                <span className="uppercase font-mono text-[10px] tracking-wider">
                  {t.dossier.actor}
                </span>
              </div>
              <p className="font-serif text-base text-text-primary font-medium">
                {character.interpretedBy || "—"}
              </p>
            </div>

            <div className="p-4 bg-surface border border-border-dark rounded-[2px]">
              <div className="flex items-center gap-2 text-text-secondary mb-1">
                <Calendar className="w-4 h-4 text-gold" />
                <span className="uppercase font-mono text-[10px] tracking-wider">
                  {t.dossier.birthdate}
                </span>
              </div>
              <p className="font-serif text-base text-text-primary font-medium">
                {character.birthdate || "—"}
              </p>
            </div>
          </div>

          {/* Parchment Tabs Container */}
          <div className="border border-parchment-border bg-parchment rounded-[2px] text-ink overflow-hidden shadow-lg">
            {/* Tab Nav */}
            <div className="flex border-b border-parchment-border/80 bg-parchment-border/30">
              <button
                type="button"
                onClick={() => setActiveTab("dossier")}
                className={`flex-1 py-3 px-4 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer text-center ${
                  activeTab === "dossier"
                    ? "bg-parchment text-crimson font-bold border-b-2 border-crimson"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Chronicle Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("offspring")}
                className={`flex-1 py-3 px-4 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer text-center ${
                  activeTab === "offspring"
                    ? "bg-parchment text-crimson font-bold border-b-2 border-crimson"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {t.dossier.children} ({character.children.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6">
              {activeTab === "dossier" && (
                <div className="space-y-4 text-ink">
                  <div className="flex items-center gap-2 text-crimson font-mono text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Archival Registry Record #{character.index}</span>
                  </div>
                  <p className="font-serif text-sm leading-relaxed text-ink/90">
                    Officially recorded in the annals of wizarding history as {character.fullName}
                    {character.nickname ? ` (known in familiar circles as '${character.nickname}')` : ""}.
                    {character.hogwartsHouse
                      ? ` Aligned with the venerable house of ${character.hogwartsHouse} during their years at Hogwarts School of Witchcraft and Wizardry.`
                      : " House allegiance unrecorded in the surviving parchment folios."}
                  </p>
                  <p className="font-serif text-sm leading-relaxed text-ink/90">
                    Portrayed and brought to life in theatrical chronicles by {character.interpretedBy || "unknown actors"}.
                  </p>
                </div>
              )}

              {activeTab === "offspring" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-crimson font-mono text-xs uppercase tracking-wider">
                    <Feather className="w-4 h-4" />
                    <span>Genealogical Registry</span>
                  </div>
                  {character.children.length > 0 ? (
                    <ul className="space-y-2 font-serif text-sm text-ink list-disc list-inside">
                      {character.children.map((child, idx) => (
                        <li key={idx} className="font-medium">
                          {child}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-serif italic text-sm text-ink/70">
                      {t.dossier.noChildren}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Entries Carousel / Grid */}
      {relatedCharacters.length > 0 && (
        <div className="pt-8 border-t border-border-dark space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold font-bold block mb-1">
                House Alumni
              </span>
              <h3 className="font-serif text-2xl font-bold text-text-primary">
                Fellow Scholars of {character.hogwartsHouse}
              </h3>
            </div>
            <Link
              href={`/characters?house=${encodeURIComponent(character.hogwartsHouse)}`}
              className="text-xs font-mono uppercase tracking-wider text-gold hover:underline"
            >
              View All {character.hogwartsHouse} Alumni &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedCharacters.map((related) => (
              <CharacterCard key={related.index} character={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
