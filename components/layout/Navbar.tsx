"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const navLinks = [
    { href: "/", label: t.nav.home, icon: Sparkles },
    { href: "/characters", label: t.nav.characters, icon: Users },
    { href: "/spells", label: t.nav.spells, icon: Wand2 },
    { href: "/houses", label: t.nav.houses, icon: Shield },
    { href: "/books", label: t.nav.books, icon: BookOpen },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 h-[72px] bg-canvas/90 backdrop-blur-md border-b border-border-dark flex items-center">
      <div className="max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-gold group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-[2px] border border-gold/40 flex items-center justify-center bg-surface group-hover:border-gold transition-colors">
            <span className="font-serif font-bold text-sm tracking-widest text-gold">⚡</span>
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-serif uppercase tracking-wider rounded-[2px] transition-all ${
                  isActive
                    ? "bg-surface text-gold border border-gold/40"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface/50 border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5 opacity-70" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Favorites & Language */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFavoritesDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface hover:bg-surface-elevated border border-border-dark hover:border-gold/50 rounded-[2px] text-xs font-mono transition-colors text-text-primary cursor-pointer"
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
            className="md:hidden p-2 text-text-secondary hover:text-text-primary bg-surface border border-border-dark rounded-[2px]"
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
    </header>
  );
}
