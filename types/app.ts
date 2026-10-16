import type { PotterResource } from "./api";

export interface FavoriteItem {
  id: string; // e.g. "characters-0"
  type: PotterResource;
  index: number;
  title: string;
  subtitle: string;
  image?: string;
  addedAt: number;
}

export interface UserFavoritesStore {
  userName: string;
  items: FavoriteItem[];
}

export type SortOrder = "asc" | "desc" | "default";

export type CharacterSortBy = "name" | "birthdate";
export type BookSortBy = "title" | "number" | "pages";
export type HouseSortBy = "name";
export type SpellSortBy = "name";

export type AnySortBy = CharacterSortBy | BookSortBy | HouseSortBy | SpellSortBy;

export interface CharacterFilterState {
  house: string;
  actor: string;
  hasChildren: string; // "all" | "yes" | "no"
}

export interface BookFilterState {
  releaseYear: string;
  pageRange: string; // "all" | "under300" | "300to500" | "over500"
}

export interface HouseFilterState {
  animal: string;
  color: string;
}

export interface SpellFilterState {
  startingLetter: string;
  keyword: string;
}
