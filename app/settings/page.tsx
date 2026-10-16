"use client";

import React, { useState } from "react";
import { Settings as SettingsIcon, Globe, Trash2, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import { useApp } from "@/context/AppContext";
import { UserNameInput } from "@/components/layout/UserNameInput";
import { ALL_SUPPORTED_LANGS, MAX_FAVORITES } from "@/lib/constants";
import type { SupportedLang } from "@/types";

export default function SettingsPage() {
  const { lang, setLang, t } = useTranslation();
  const { favorites } = useFavorites();
  const { resetAllUserData } = useApp();

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleClearAll = () => {
    resetAllUserData();
    setIsConfirmingClear(false);
    setSuccessMessage(t.settings.clearSuccess);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-10">
      {/* Header */}
      <div className="border-b border-border-dark pb-6">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-[0.25em] mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>Sanctum Chamber</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-text-primary">
          {t.settings.title}
        </h1>
        <p className="font-serif text-sm text-text-secondary mt-1">
          {t.settings.subtitle}
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-surface border border-gold/40 rounded-[2px] flex items-center gap-3 text-gold">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="font-serif text-sm">{successMessage}</span>
        </div>
      )}

      {/* 1. Scholar Profile Section */}
      <section className="p-6 bg-surface border border-border-dark rounded-[2px] space-y-4">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-wider border-b border-border-dark pb-3">
          <Shield className="w-4 h-4" />
          <span>{t.settings.profileSection}</span>
        </div>
        <UserNameInput />
        <div className="flex items-center justify-between pt-2 text-xs font-mono text-text-secondary border-t border-border-dark/60">
          <span>Active Vault Storage</span>
          <span className="text-gold">
            {favorites.length} of {MAX_FAVORITES} slots inscribed
          </span>
        </div>
      </section>

      {/* 2. Language Selection (9 Languages) */}
      <section className="p-6 bg-surface border border-border-dark rounded-[2px] space-y-4">
        <div className="flex items-center gap-2 text-gold font-mono text-xs uppercase tracking-wider border-b border-border-dark pb-3">
          <Globe className="w-4 h-4" />
          <span>{t.settings.languageSection}</span>
        </div>
        <p className="font-serif text-xs text-text-secondary leading-relaxed">
          Select your scholarly dialect. Translations adapt the full interface and archival tools.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {ALL_SUPPORTED_LANGS.map((item) => {
            const isSelected = item.code === lang;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLang(item.code as SupportedLang)}
                className={`p-3 rounded-[2px] border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-gold/15 border-gold text-gold font-bold shadow-sm"
                    : "bg-surface-elevated/40 border-border-dark text-text-primary hover:border-gold/40 hover:text-gold"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-mono text-xs uppercase tracking-widest">
                    {item.code}
                  </span>
                  {isSelected && <span className="text-gold text-xs">● Active</span>}
                </div>
                <span className="font-serif text-sm font-medium">{item.nativeName}</span>
                <span className="text-[11px] font-mono text-text-secondary/70">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Danger Zone */}
      <section className="p-6 bg-surface border border-crimson/30 rounded-[2px] space-y-4">
        <div className="flex items-center gap-2 text-crimson font-mono text-xs uppercase tracking-wider border-b border-crimson/20 pb-3">
          <AlertTriangle className="w-4 h-4" />
          <span>{t.settings.dangerZone}</span>
        </div>
        <p className="font-serif text-xs text-text-secondary leading-relaxed">
          Purge all locally stored scholar records, preferences, and preserved vault slots from browser storage.
        </p>

        {!isConfirmingClear ? (
          <button
            type="button"
            onClick={() => setIsConfirmingClear(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-crimson/15 hover:bg-crimson/25 border border-crimson/40 hover:border-crimson text-red-300 text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.settings.clearAllData}</span>
          </button>
        ) : (
          <div className="p-4 bg-canvas border border-crimson rounded-[2px] space-y-3">
            <p className="font-serif text-xs text-red-200 leading-relaxed">
              {t.settings.confirmClearAllMessage}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmingClear(false)}
                className="px-4 py-2 bg-surface hover:bg-surface-elevated border border-border-dark text-text-secondary text-xs font-mono uppercase tracking-wider rounded-[2px] cursor-pointer"
              >
                {t.favorites.confirmCancel}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 bg-crimson hover:bg-crimson/80 text-white text-xs font-mono uppercase tracking-wider rounded-[2px] cursor-pointer font-bold"
              >
                {t.favorites.confirmYes}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
