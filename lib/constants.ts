import type { SupportedLang, ApiSupportedLang, PotterResource } from "@/types/api";

export const MAX_FAVORITES = 4;

export const API_BASE_URL = "https://potterapi-fedeperin.vercel.app";

export const API_TIMEOUT_MS = 8000;

export const SEARCH_DEBOUNCE_MS = 350;

export const API_SUPPORTED_LANGS: readonly ApiSupportedLang[] = [
  "en",
  "es",
  "fr",
  "it",
  "pt",
  "uk",
] as const;

export const ALL_SUPPORTED_LANGS: readonly { code: SupportedLang; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
] as const;

export const VALID_RESOURCES: readonly PotterResource[] = [
  "characters",
  "spells",
  "houses",
  "books",
] as const;

export const HOUSE_THEME: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  Gryffindor: {
    bg: "bg-[#740001]/20",
    text: "text-[#C5A059]",
    border: "border-[#740001]",
    accent: "#740001",
  },
  Slytherin: {
    bg: "bg-[#1A472A]/20",
    text: "text-[#A8B2A1]",
    border: "border-[#1A472A]",
    accent: "#1A472A",
  },
  Ravenclaw: {
    bg: "bg-[#0E1A40]/20",
    text: "text-[#967444]",
    border: "border-[#0E1A40]",
    accent: "#0E1A40",
  },
  Hufflepuff: {
    bg: "bg-[#D49B24]/20",
    text: "text-[#D49B24]",
    border: "border-[#D49B24]",
    accent: "#D49B24",
  },
};
