"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Wand2, Sparkles, Users, Shield, RefreshCw } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useApp } from "@/context/AppContext";
import { fetchPotter, fetchPotterRandom } from "@/lib/api";
import { triggerSpellBurst } from "@/lib/burst";
import type { Character, Spell, Book } from "@/types";
import { CharacterCard } from "@/components/cards/CharacterCard";
import { SpellCard } from "@/components/cards/SpellCard";
import { BookCard } from "@/components/cards/BookCard";
import { BookCardSkeleton, CharacterCardSkeleton, SpellCardSkeleton } from "@/components/ui/Skeleton";
import { MagneticButton } from "@/components/ui/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const { lang, t } = useTranslation();
  const { setActiveModalItem, isReducedMotion } = useApp();
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = systemReducedMotion || isReducedMotion;
  const { scrollY } = useScroll();
  const heroContainerRef = useRef<HTMLDivElement>(null);

  // Smooth parallax scroll transforms
  const heroTextY = useTransform(scrollY, [0, 600], [0, 50]);
  const heroFrameY = useTransform(scrollY, [0, 600], [0, -40]);
  const heroBadgeY = useTransform(scrollY, [0, 600], [0, 25]);

  // Decoupled Section States (Streaming / Independent UX)
  const [featuredCharacters, setFeaturedCharacters] = useState<Character[]>([]);
  const [charsLoading, setCharsLoading] = useState(true);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [randomSpell, setRandomSpell] = useState<Spell | null>(null);
  const [randomCharacter, setRandomCharacter] = useState<Character | null>(null);
  const [isLoadingSpell, setIsLoadingSpell] = useState(false);

  // GSAP Cinematic Entrance, Idle Float & ScrollTrigger Draw Line
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

      // Ambient Floating Gold Dust Particles (Task 4.3)
      gsap.to(".hero-gold-dust-1", {
        y: "-=14",
        x: "+=6",
        rotation: 45,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-gold-dust-2", {
        y: "+=12",
        x: "-=8",
        rotation: -45,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // GSAP ScrollTrigger Drawing Line for Section 4 (Task 4.2)
      gsap.fromTo(
        ".scroll-arch-line",
        { strokeDashoffset: 600 },
        {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".daily-prophet-section",
            start: "top 80%",
          },
        }
      );
    }, heroContainerRef);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  useEffect(() => {
    let isCancelled = false;

    // Decoupled Section Streaming (independent loading)
    setBooksLoading(true);
    fetchPotter<Book>(lang, "books", { max: 3 })
      .then((books) => {
        if (!isCancelled) {
          setFeaturedBooks(books);
          setBooksLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) setBooksLoading(false);
      });

    setCharsLoading(true);
    fetchPotter<Character>(lang, "characters", { max: 4 })
      .then((chars) => {
        if (!isCancelled) {
          setFeaturedCharacters(chars);
          setCharsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) setCharsLoading(false);
      });

    fetchPotterRandom<Spell>(lang, "spells").then((spell) => {
      if (!isCancelled && spell) setRandomSpell(spell);
    }).catch(() => {});

    fetchPotterRandom<Character>(lang, "characters").then((randChar) => {
      if (!isCancelled && randChar) setRandomCharacter(randChar);
    }).catch(() => {});

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

            <div className="flex flex-wrap gap-4 pt-4 items-center">
              <MagneticButton>
                <Link
                  href="/characters"
                  className="hero-anim-cta inline-flex items-center gap-2.5 px-6 py-3.5 bg-gold hover:bg-gold/90 text-canvas font-mono text-xs uppercase tracking-widest font-bold rounded-[2px] transition-colors shadow-lg shadow-gold/20"
                >
                  <span>{t.hero.exploreBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </MagneticButton>

              <button
                type="button"
                onClick={handleRandomDiscovery}
                className="hero-anim-cta inline-flex items-center gap-2 px-6 py-3.5 bg-surface hover:bg-surface-elevated border border-border-dark hover:border-gold/50 text-text-primary font-mono text-xs uppercase tracking-widest rounded-[2px] transition-colors cursor-pointer active:scale-95"
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
              {/* Ambient Floating SVG Stars / Gold Dust (Task 4.3) */}
              <div className="hero-gold-dust-1 pointer-events-none absolute -top-3 -left-3 w-6 h-6 text-gold opacity-80 z-20" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_8px_#E5B869]">
                  <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
                </svg>
              </div>
              <div className="hero-gold-dust-2 pointer-events-none absolute -bottom-3 -right-3 w-5 h-5 text-gold opacity-70 z-20" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_6px_#E5B869]">
                  <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
                </svg>
              </div>

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

      {/* 2. BAND PERKAMEN: "ARCHIVES OF MAGIC" (BOOKS) */}
      <section className="py-16 bg-surface border-b border-border-dark relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="border-l-2 border-gold pl-3 mb-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold font-bold block">
                  {t.landing.archivesKicker}
                </span>
              </div>
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

          {booksLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <BookCardSkeleton />
              <BookCardSkeleton />
              <BookCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book.index} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. STRIP 4 KARAKTER UNGGULAN */}
      <section className="py-16 border-b border-border-dark bg-canvas">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="border-l-2 border-gold pl-3 mb-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold font-bold block">
                  {t.landing.featuredCharactersKicker}
                </span>
              </div>
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

          {charsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CharacterCardSkeleton />
              <CharacterCardSkeleton />
              <CharacterCardSkeleton />
              <CharacterCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCharacters.map((char) => (
                <CharacterCard key={char.index} character={char} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. SPLIT 50/50: MANTRA ACAK & DAILY PROPHET PRINT BROADSHEET */}
      <section className="py-16 bg-surface-elevated/40 daily-prophet-section relative">
        {/* Animated Ornate Top Divider Line (Task 4.2 GSAP ScrollTrigger) */}
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 overflow-hidden pointer-events-none" aria-hidden="true">
          <svg className="w-full h-4" viewBox="0 0 1200 16" fill="none">
            <line
              x1="0"
              y1="8"
              x2="1200"
              y2="8"
              stroke="#E5B869"
              strokeWidth="1.5"
              strokeDasharray="600"
              strokeDashoffset="600"
              className="scroll-arch-line"
              opacity="0.5"
            />
            <circle cx="600" cy="8" r="4" fill="#E5B869" opacity="0.8" />
            <polygon points="600,2 605,8 600,14 595,8" fill="#E5B869" />
          </svg>
        </div>

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 50% Left: Interactive Incantation Discovery */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 bg-surface border border-border-dark rounded-[2px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="border-l-2 border-crimson pl-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-crimson font-bold block">
                    {t.landing.discoveryKicker}
                  </span>
                </div>
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
                <SpellCardSkeleton />
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-border-dark flex items-center justify-between">
              <MagneticButton strength={0.25}>
                <Link
                  href="/spells"
                  className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold hover:text-text-primary transition-colors"
                >
                  <span>View Full Spellbook</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* 50% Right: The Daily Prophet Newsprint Broadsheet (Task 3.2 & 5.4 Cinemagraph) */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 bg-parchment text-ink border-2 border-parchment-border rounded-[2px] shadow-2xl relative overflow-hidden group/prophet">
            <div className="space-y-4">
              {/* Authentic Masthead with Double-Line Border */}
              <div className="border-t-2 border-b-2 border-ink py-2 text-center relative">
                <span className="font-serif text-3xl sm:text-4xl font-black tracking-[0.18em] text-ink uppercase block leading-none">
                  THE DAILY PROPHET
                </span>
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-ink/80 pt-1.5 border-t border-ink/40 mt-1.5 px-1">
                  <span>Vol. CCXCIV • No. 14,082</span>
                  <span>Ministry Archival Edition</span>
                  <span>Two Sickles</span>
                </div>
              </div>

              {/* Lead Article with Drop Cap & Cinemagraph Seal */}
              <div className="p-4 bg-white/50 border border-ink/20 rounded-[2px] space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-crimson" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-crimson font-bold">
                      Historical Archival Dispatch
                    </span>
                  </div>

                  {/* Cinemagraph Motion: Rotating Outer Seal Ring & Breathing Shield Emblem (Task 5.4) */}
                  <div className="relative w-10 h-10 shrink-0" title="Ministry Archival Seal">
                    <svg
                      className="w-10 h-10 text-ink/40 animate-[spin_45s_linear_infinite]"
                      viewBox="0 0 100 100"
                      fill="none"
                    >
                      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" />
                      <polygon points="50,12 53,20 47,20" fill="currentColor" />
                      <polygon points="50,88 53,80 47,80" fill="currentColor" />
                      <polygon points="12,50 20,47 20,53" fill="currentColor" />
                      <polygon points="88,50 80,47 80,53" fill="currentColor" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                      <Shield className="w-4 h-4 text-crimson" />
                    </div>
                  </div>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink leading-tight">
                  Four Ancient Houses of Hogwarts Stand Eternal
                </h3>
                <p className="font-serif text-sm text-ink/90 leading-relaxed text-justify first-letter:float-left first-letter:text-4xl first-letter:font-bold first-letter:font-serif first-letter:text-crimson first-letter:mr-2.5 first-letter:leading-none">
                  Founded over a millennium ago by Godric Gryffindor, Helga Hufflepuff, Rowena Ravenclaw, and Salazar Slytherin, Hogwarts School remains the premier sanctuary for European witchcraft and wizardry. The sacred wards, bound to the ancient castle foundations, continue to guard generations of young wizards against the encroaching shadows.
                </p>
              </div>

              {/* Dispatch Column Links with Micro-Interaction Darting Arrows */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <Link
                  href="/houses"
                  className="group/btn p-3 bg-white/60 hover:bg-white border border-ink/30 hover:border-ink rounded-[2px] transition-all block text-center text-ink shadow-sm hover:shadow"
                >
                  <Shield className="w-4 h-4 text-crimson mx-auto mb-1 group-hover/btn:scale-110 transition-transform" />
                  <span className="uppercase flex items-center justify-center gap-1 font-serif text-xs font-bold text-ink">
                    <span>Four Houses</span>
                    <ArrowRight className="w-3 h-3 text-crimson opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                  </span>
                  <span className="text-ink/70 text-[9px] block">
                    Heraldry & Founder Lore
                  </span>
                </Link>

                <Link
                  href="/characters"
                  className="group/btn p-3 bg-white/60 hover:bg-white border border-ink/30 hover:border-ink rounded-[2px] transition-all block text-center text-ink shadow-sm hover:shadow"
                >
                  <Users className="w-4 h-4 text-crimson mx-auto mb-1 group-hover/btn:scale-110 transition-transform" />
                  <span className="uppercase flex items-center justify-center gap-1 font-serif text-xs font-bold text-ink">
                    <span>Alumni Records</span>
                    <ArrowRight className="w-3 h-3 text-crimson opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                  </span>
                  <span className="text-ink/70 text-[9px] block">
                    Wizard Chronicles
                  </span>
                </Link>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-ink/30 flex items-center justify-between text-xs font-mono text-ink/75">
              <span>Archives Registry Bureau</span>
              <Link
                href="/settings"
                className="group/link inline-flex items-center gap-1 text-crimson hover:underline uppercase tracking-wider font-bold"
              >
                <span>Vault Preferences</span>
                <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
