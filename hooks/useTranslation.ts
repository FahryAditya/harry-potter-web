"use client";

import { useApp } from "@/context/AppContext";

export function useTranslation() {
  const { lang, t, setLang } = useApp();
  return { lang, t, setLang };
}
