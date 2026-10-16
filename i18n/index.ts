import type { SupportedLang } from "@/types/api";
import type { TranslationKeys } from "@/types/i18n";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { it } from "./locales/it";
import { pt } from "./locales/pt";
import { uk } from "./locales/uk";
import { ja } from "./locales/ja";
import { zh } from "./locales/zh";
import { ko } from "./locales/ko";

export const LOCALES: Record<SupportedLang, TranslationKeys> = {
  en,
  es,
  fr,
  it,
  pt,
  uk,
  ja,
  zh,
  ko,
};

export function getTranslation(lang: SupportedLang): TranslationKeys {
  return LOCALES[lang] || en;
}
