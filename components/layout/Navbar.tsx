"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Star, Menu, X, Sparkles, BookOpen, Users, Wand2, Shield, Settings } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MAX_FAVORITES } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { favorites, setIsFavoritesDrawerOpen } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Track scroll direction: down -> slide out to right, up -> slide back in
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar at the top of the viewport
      if (currentScrollY <= 20) {
        setIsHidden(false);
        lastScrollY = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY;
      // Filter out micro-scroll jitters
      if (Math.abs(diff) < 6) return;

      if (diff > 0 && currentScrollY > 72) {
        // Scrolling down -> hide moving to the right
        setIsHidden(true);
      } else if (diff < 0) {
        // Scrolling up -> reveal from the right
        setIsHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.home, icon: Sparkles },
    { href: "/characters", label: t.nav.characters, icon: Users },
    { href: "/spells", label: t.nav.spells, icon: Wand2 },
    { href: "/houses", label: t.nav.houses, icon: Shield },
    { href: "/books", label: t.nav.books, icon: BookOpen },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <motion.header
      initial={false}
      animate={
        shouldReduceMotion
          ? { opacity: isHidden && !mobileMenuOpen ? 0 : 1 }
          : {
              x: isHidden && !mobileMenuOpen ? "100%" : "0%",
              opacity: isHidden && !mobileMenuOpen ? 0 : 1,
            }
      }
      transition={{
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1], // Smooth snappy cubic-bezier
      }}
      className="sticky top-0 z-40 h-[72px] bg-canvas/90 backdrop-blur-md border-b border-border-dark flex items-center will-change-transform shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-gold group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-[2px] border border-gold/50 flex items-center justify-center bg-surface group-hover:border-gold transition-colors shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-gold transition-transform group-hover:scale-110"
              aria-hidden="true"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="rgba(229, 184, 105, 0.2)" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-sm sm:text-base tracking-[0.2em] text-text-primary group-hover:text-gold transition-colors">
              POTTER EXPLORER
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-secondary">
              Archives of Magic
            </span>
          </div>
        </Link>

        {/* Desktop Navigation with Shared Layout Glow */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-3.5 py-2 text-xs font-serif uppercase tracking-wider rounded-[2px] transition-colors ${
                  isActive
                    ? "text-gold font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {isActive && (
                  <>
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-surface border border-gold/45 rounded-[2px] shadow-[0_0_12px_rgba(229,184,105,0.15)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                    <motion.span
                      layoutId="nav-active-line"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-gold shadow-[0_0_8px_#E5B869]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  </>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-gold opacity-100" : "opacity-75"}`} />
                  <span>{link.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Favorites & Language */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFavoritesDrawerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 min-h-[40px] bg-surface hover:bg-surface-elevated border border-border-dark hover:border-gold/50 rounded-[2px] text-xs font-mono transition-colors text-text-primary cursor-pointer active:scale-95"
            aria-label="Open Vault"
          >
            <Star className={`w-3.5 h-3.5 ${favorites.length > 0 ? "fill-gold text-gold" : "text-text-secondary"}`} />
            <span className="text-[11px] font-mono tracking-wider">
              {favorites.length}/{MAX_FAVORITES}
            </span>
          </button>

          <LanguageSwitcher />

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary bg-surface border border-border-dark rounded-[2px] transition-colors cursor-pointer active:scale-95"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-surface border-b border-border-dark p-4 shadow-2xl z-50 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-serif tracking-wider rounded-[2px] transition-colors ${
                  isActive
                    ? "bg-surface-elevated text-gold border border-gold/40"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                }`}
              >
                <Icon className="w-4 h-4 text-gold/70" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </motion.header>
  );
}
