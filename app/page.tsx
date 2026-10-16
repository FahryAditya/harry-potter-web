"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, Wand2, Sparkles, Users, Shield, RefreshCw } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useApp } from "@/context/AppContext";
import { fetchPotter, fetchPotterRandom } from "@/lib/api";
import { triggerSpellBurst } from "@/lib/burst";
import type { Character, Spell, Book } from "@/types";
import { CharacterCard } from "@/components/cards/CharacterCard";
import { SpellCard } from "@/components/cards/SpellCard";
import { BookCard } from "@/components/cards/BookCard";

export default function HomePage() {
  const { lang, t } = useTranslation();
  const { setActiveModalItem } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroContainerRef = useRef<HTMLDivElement>(null);

  // Smooth parallax scroll transforms
  const heroTextY = useTransform(scrollY, [0, 600], [0, 50]);
  const heroFrameY = useTransform(scrollY, [0, 600], [0, -40]);
  const heroBadgeY = useTransform(scrollY, [0, 600], [0, 25]);

  const [featuredCharacters, setFeaturedCharacters] = useState<Character[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [randomSpell, setRandomSpell] = useState<Spell | null>(null);
  const [randomCharacter, setRandomCharacter] = useState<Character | null>(null);
  const [isLoadingSpell, setIsLoadingSpell] = useState(false);

  // GSAP Cinematic Entrance & Continuous Idle Float
  useEffect(() => {
    if (shouldReduceMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-anim-kicker",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          ".hero-anim-title",
          { opacity: 0, y: 35, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 },
          "-=0.35"
        )
        .fromTo(
          ".hero-anim-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          ".hero-anim-cta",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.4"
        )
        .fromTo(
          ".hero-anim-frame",
          { opacity: 0, scale: 0.94, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1 },
          "-=0.7"
        );

      // Organic subtle breathing float on the Gothic Arch
      gsap.to(".hero-anim-frame", {
        y: "-=8",
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroContainerRef);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  useEffect(() => {
    let isCancelled = false;

    // Load featured characters and books for the landing page
    Promise.all([
      fetchPotter<Character>(lang, "characters", { max: 4 }),
      fetchPotter<Book>(lang, "books", { max: 3 }),
      fetchPotterRandom<Spell>(lang, "spells"),
      fetchPotterRandom<Character>(lang, "characters"),
    ])
      .then(([chars, books, spell, randChar]) => {
        if (!isCancelled) {
          setFeaturedCharacters(chars);
          setFeaturedBooks(books);
          setRandomSpell(spell);
          setRandomCharacter(randChar);
        }
      })
      .catch(() => {
        // Safe fallback; error states handled gracefully
      });

    return () => {
      isCancelled = true;
    };
  }, [lang]);

  const handleCastAnotherSpell = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      triggerSpellBurst(e.clientX, e.clientY, 16);
    }
    setIsLoadingSpell(true);
    try {
      const spell = await fetchPotterRandom<Spell>(lang, "spells");
      if (spell) setRandomSpell(spell);
    } catch {
      // Ignored
    } finally {
      setIsLoadingSpell(false);
    }
  };

  const handleRandomDiscovery = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      triggerSpellBurst(e.clientX, e.clientY, 20);
    }
    try {
      const char = await fetchPotterRandom<Character>(lang, "characters");
      if (char) {
        setActiveModalItem(char);
      }
    } catch {
      // Ignored
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section ref={heroContainerRef} className="relative overflow-hidden border-b border-border-dark py-16 sm:py-24 lg:py-32">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content with Parallax */}
          <motion.div
            style={{ y: shouldReduceMotion ? 0 : heroTextY }}
            className="lg:col-span-7 space-y-6 will-change-transform"
          >
            <motion.div
              style={{ y: shouldReduceMotion ? 0 : heroBadgeY }}
              className="hero-anim-kicker inline-flex items-center gap-2 px-3 py-1 bg-surface border border-gold/30 rounded-[2px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
                {t.hero.kicker}
              </span>
            </motion.div>

            <h1 className="hero-anim-title font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.05]">
              {t.hero.title}
            </h1>

            <p className="hero-anim-subtitle font-serif text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/characters"
                className="hero-anim-cta inline-flex items-center gap-2.5 px-6 py-3.5 bg-gold hover:bg-gold/90 text-canvas font-mono text-xs uppercase tracking-widest font-bold rounded-[2px] transition-colors"
              >
                <span>{t.hero.exploreBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={handleRandomDiscovery}
                className="hero-anim-cta inline-flex items-center gap-2 px-6 py-3.5 bg-surface hover:bg-surface-elevated border border-border-dark hover:border-gold/50 text-text-primary font-mono text-xs uppercase tracking-widest rounded-[2px] transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-gold" />
                <span>{t.hero.randomBtn}</span>
              </button>
            </div>
          </motion.div>

          {/* Hero Right: Gothic Architectural Frame with Parallax */}
          <motion.div
            style={{ y: shouldReduceMotion ? 0 : heroFrameY }}
            className="hero-anim-frame lg:col-span-5 flex justify-center lg:justify-end will-change-transform"
          >
            <div className="relative w-full max-w-sm aspect-[4/5] p-3 bg-surface border border-gold/40 rounded-[2px] shadow-2xl">
              {/* Inner Arch Frame */}
              <div className="w-full h-full border border-border-dark p-4 flex flex-col justify-between relative overflow-hidden bg-canvas">
                {/* Decorative Arch Runes */}
                <div className="text-center pb-4 border-b border-border-dark/60">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-secondary">
                    Collegium Hogwarts 1997
                  </span>
                  <div className="w-12 h-0.5 bg-gold/50 mx-auto mt-2" />
                </div>

                {randomCharacter ? (
                  <div className="flex flex-col items-center text-center space-y-3 my-auto">
                    <div className="w-28 h-28 rounded-full border border-gold/40 relative overflow-hidden bg-surface-elevated shadow-lg">
                      <Image
                        src={randomCharacter.image || "/fallback-avatar.svg"}
                        alt={randomCharacter.fullName}
                        fill
                        sizes="112px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gold block mb-1">
                        Featured Scholar
                      </span>
                      <h4 className="font-serif text-xl font-bold text-text-primary">
                        {randomCharacter.fullName}
                      </h4>
                      <p className="font-serif text-xs text-text-secondary">
                        {randomCharacter.hogwartsHouse || randomCharacter.interpretedBy}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="my-auto text-center space-y-2">
                    <Wand2 className="w-8 h-8 text-gold/60 mx-auto" />
                    <span className="font-serif text-xs text-text-secondary">
                      Loading ancient chronicle...
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-border-dark/60 text-center">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-text-secondary/70">
                    Officially Preserved in Archives
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. BAND PERKAMEN: "ARCHIVES OF MAGIC" */}
      <section className="py-16 bg-surface border-b border-border-dark relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold font-bold block mb-1">
                {t.landing.archivesKicker}
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary">
                {t.landing.archivesTitle}
              </h2>
              <p className="font-serif text-sm text-text-secondary mt-1">
                {t.landing.archivesSubtitle}
              </p>
            </div>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold hover:text-text-primary transition-colors"
            >
              <span>{t.landing.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.index} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. STRIP 4 KARAKTER UNGGULAN */}
      <section className="py-16 border-b border-border-dark bg-canvas">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold font-bold block mb-1">
                {t.landing.featuredCharactersKicker}
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary">
                {t.landing.featuredCharactersTitle}
              </h2>
            </div>
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold hover:text-text-primary transition-colors"
            >
              <span>{t.landing.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCharacters.map((char) => (
              <CharacterCard key={char.index} character={char} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SPLIT 50/50: MANTRA ACAK & DAILY PROPHET SHOWCASE */}
      <section className="py-16 bg-surface-elevated/40">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 50% Left: Interactive Incantation Discovery */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 bg-surface border border-border-dark rounded-[2px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-crimson font-bold">
                  {t.landing.discoveryKicker}
                </span>
                <button
                  type="button"
                  onClick={handleCastAnotherSpell}
                  disabled={isLoadingSpell}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-elevated hover:bg-gold/10 border border-border-dark hover:border-gold text-gold text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSpell ? "animate-spin" : ""}`} />
                  <span>{t.landing.discoveryAction}</span>
                </button>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                {t.landing.discoveryTitle}
              </h2>
              <p className="font-serif text-sm text-text-secondary mb-6">
                {t.landing.discoverySubtitle}
              </p>

              {randomSpell ? (
                <SpellCard spell={randomSpell} />
              ) : (
                <div className="p-8 text-center text-text-secondary font-serif text-sm bg-parchment text-ink rounded-[2px]">
                  Consulting wand registry...
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-border-dark flex items-center justify-between">
              <Link
                href="/spells"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold hover:text-text-primary transition-colors"
              >
                <span>View Full Spellbook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 50% Right: Daily Prophet Archival Showcase (Substituted for trailer) */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 bg-canvas border border-border-dark rounded-[2px] relative overflow-hidden">
            <div className="space-y-4">
              <div className="border-b-2 border-border-dark pb-3 text-center">
                <span className="font-serif text-3xl sm:text-4xl font-extrabold tracking-[0.2em] text-gold uppercase block">
                  The Daily Prophet
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-secondary">
                  Special Archival Edition • Ministry of Magic Archives
                </span>
              </div>

              <div className="p-5 bg-surface border border-border-dark/80 rounded-[2px] space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-crimson font-bold block">
                  Archive Intelligence
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-text-primary leading-tight">
                  Four Ancient Houses of Hogwarts Stand Eternal
                </h3>
                <p className="font-serif text-sm text-text-secondary leading-relaxed">
                  Founded over a millennium ago by Godric Gryffindor, Helga Hufflepuff, Rowena Ravenclaw, and Salazar Slytherin, Hogwarts School remains the premier sanctuary for European witchcraft and wizardry.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <Link
                  href="/houses"
                  className="p-4 bg-surface hover:bg-surface-elevated border border-border-dark hover:border-gold/40 rounded-[2px] transition-colors block text-center"
                >
                  <Shield className="w-5 h-5 text-gold mx-auto mb-1.5" />
                  <span className="uppercase text-text-primary block font-serif text-sm font-bold">
                    Four Houses
                  </span>
                  <span className="text-text-secondary text-[10px]">
                    Inspect Banners & Lore
                  </span>
                </Link>

                <Link
                  href="/characters"
                  className="p-4 bg-surface hover:bg-surface-elevated border border-border-dark hover:border-gold/40 rounded-[2px] transition-colors block text-center"
                >
                  <Users className="w-5 h-5 text-gold mx-auto mb-1.5" />
                  <span className="uppercase text-text-primary block font-serif text-sm font-bold">
                    Alumni Records
                  </span>
                  <span className="text-text-secondary text-[10px]">
                    Filtered by Allegiance
                  </span>
                </Link>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border-dark flex items-center justify-between text-xs font-mono text-text-secondary">
              <span>Hogwarts Archives Division</span>
              <Link
                href="/settings"
                className="text-gold hover:underline uppercase tracking-wider"
              >
                Manage Vault & Preferences
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
