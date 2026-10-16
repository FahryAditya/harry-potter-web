import type { SupportedLang, PotterResource, PotterQueryParams } from "@/types/api";
import { buildApiUrl } from "./endpoints";
import { isBook, isCharacter, isHouse, isSpell } from "./validators";
import { API_TIMEOUT_MS } from "./constants";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly isTimeout: boolean = false
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function validateItem(resource: PotterResource, item: unknown): boolean {
  switch (resource) {
    case "books":
      return isBook(item);
    case "characters":
      return isCharacter(item);
    case "houses":
      return isHouse(item);
    case "spells":
      return isSpell(item);
    default:
      return false;
  }
}

export async function fetchPotter<T>(
  lang: SupportedLang,
  resource: PotterResource,
  params?: PotterQueryParams,
  externalSignal?: AbortSignal
): Promise<T[]> {
  const url = buildApiUrl(lang, resource, params);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  // Link external signal if provided (for cancelling old requests on param change)
  if (externalSignal) {
    externalSignal.addEventListener("abort", () => controller.abort());
  }

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch ${resource} from PotterAPI: HTTP ${response.status}`,
        response.status
      );
    }

    const rawData: unknown = await response.json();

    // The API returns either an array of items or a single item (for random / single index)
    if (Array.isArray(rawData)) {
      const validItems: T[] = [];
      for (const item of rawData) {
        if (validateItem(resource, item)) {
          validItems.push(item as T);
        }
      }
      return validItems;
    } else if (rawData && typeof rawData === "object") {
      if (validateItem(resource, rawData)) {
        return [rawData as T];
      }
      return [];
    }

    return [];
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      // Check if aborted by timeout or user
      if (externalSignal?.aborted) {
        throw new ApiError(`Request for ${resource} was cancelled.`, undefined, false);
      }
      throw new ApiError(
        `Request for ${resource} timed out after ${API_TIMEOUT_MS / 1000}s.`,
        undefined,
        true
      );
    }

    const errMessage = error instanceof Error ? error.message : "Unknown network error";
    throw new ApiError(`Network error while fetching ${resource}: ${errMessage}`);
  }
}

export async function fetchPotterRandom<T>(
  lang: SupportedLang,
  resource: PotterResource,
  signal?: AbortSignal
): Promise<T | null> {
  const items = await fetchPotter<T>(lang, resource, { random: true }, signal);
  return items.length > 0 ? items[0] : null;
}
