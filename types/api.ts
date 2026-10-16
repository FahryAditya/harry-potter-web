export type PotterResource = "characters" | "spells" | "houses" | "books";

export type SupportedLang = "en" | "es" | "fr" | "it" | "pt" | "uk" | "ja" | "zh" | "ko";

export type ApiSupportedLang = "en" | "es" | "fr" | "it" | "pt" | "uk";

export interface Book {
  number: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  description: string;
  pages: number;
  cover: string;
  index: number;
}

export interface Character {
  fullName: string;
  nickname: string;
  hogwartsHouse: string;
  interpretedBy: string;
  children: string[];
  image: string;
  birthdate: string;
  index: number;
}

export interface House {
  house: string;
  emoji: string;
  founder: string;
  colors: string[];
  animal: string;
  index: number;
}

export interface Spell {
  spell: string;
  use: string;
  index: number;
}

export type PotterItem = Book | Character | House | Spell;

export interface PotterQueryParams {
  index?: number;
  max?: number;
  page?: number;
  search?: string;
  random?: boolean;
}
