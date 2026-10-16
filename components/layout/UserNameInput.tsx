"use client";

import React, { useState } from "react";
import { UserCheck, Edit3 } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useTranslation } from "@/hooks/useTranslation";
import { isValidUserName } from "@/lib/validators";

export function UserNameInput() {
  const { userName, setUserName } = useFavorites();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(!userName);
  const [inputValue, setInputValue] = useState(userName);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUserName(inputValue)) {
      setErrorMessage(t.favorites.nameHint);
      return;
    }
    const success = setUserName(inputValue);
    if (success) {
      setErrorMessage("");
      setIsEditing(false);
    } else {
      setErrorMessage(t.favorites.nameHint);
    }
  };

  if (!isEditing && userName) {
    return (
      <div className="flex items-center justify-between p-3 bg-surface border border-border-dark rounded-[2px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[2px] bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-text-secondary">
              {t.settings.nameLabel}
            </div>
            <div className="font-serif text-sm text-text-primary font-medium tracking-wide">
              {userName}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setInputValue(userName);
            setIsEditing(true);
          }}
          className="p-1.5 text-text-secondary hover:text-gold transition-colors"
          title="Edit Name"
          aria-label="Edit Name"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <div className="space-y-1">
        <label
          htmlFor="scholar-name-input"
          className="block text-xs uppercase font-mono tracking-wider text-text-secondary"
        >
          {t.favorites.nameRequired}
        </label>
        <div className="flex gap-2">
          <input
            id="scholar-name-input"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder={t.favorites.namePlaceholder}
            className="flex-1 px-3 py-2 bg-canvas border border-border-dark focus:border-gold rounded-[2px] text-text-primary text-sm font-serif placeholder:text-text-secondary/60 outline-none transition-colors"
            maxLength={24}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gold/10 hover:bg-gold/20 border border-gold/40 hover:border-gold text-gold text-xs uppercase tracking-wider rounded-[2px] transition-colors font-mono cursor-pointer"
          >
            {t.favorites.saveName}
          </button>
        </div>
      </div>
      {errorMessage ? (
        <p className="text-xs text-crimson font-mono">{errorMessage}</p>
      ) : (
        <p className="text-[11px] text-text-secondary/70 font-mono">
          {t.favorites.nameHint}
        </p>
      )}
    </form>
  );
}
