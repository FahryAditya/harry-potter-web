import type { SupportedLang, ApiSupportedLang, PotterResource, PotterQueryParams } from "@/types/api";
import { API_BASE_URL, API_SUPPORTED_LANGS, ALL_SUPPORTED_LANGS, VALID_RESOURCES } from "./constants";

export function isSupportedLang(code: string): code is SupportedLang {
  return ALL_SUPPORTED_LANGS.some((l) => l.code === code);
}

export function isApiSupportedLang(code: string): code is ApiSupportedLang {
  return (API_SUPPORTED_LANGS as readonly string[]).includes(code);
}

export function isValidResource(res: string): res is PotterResource {
  return (VALID_RESOURCES as readonly string[]).includes(res);
}

export function resolveApiLang(lang: SupportedLang): ApiSupportedLang {
  if (isApiSupportedLang(lang)) {
    return lang;
  }
  // Japanese, Chinese, and Korean map to English for API data queries
  return "en";
}

export function buildApiUrl(
  lang: SupportedLang,
  resource: PotterResource,
  params?: PotterQueryParams
): string {
  if (!isSupportedLang(lang)) {
    throw new Error(`Unsupported language code: ${lang}`);
  }
  if (!isValidResource(resource)) {
    throw new Error(`Unsupported resource type: ${resource}`);
  }

  const apiLang = resolveApiLang(lang);

  if (params?.random) {
    return `${API_BASE_URL}/${apiLang}/${resource}/random`;
  }

  const url = new URL(`${API_BASE_URL}/${apiLang}/${resource}`);

  if (typeof params?.index === "number" && !isNaN(params.index)) {
    url.searchParams.set("index", encodeURIComponent(params.index.toString()));
  }

  if (typeof params?.max === "number" && !isNaN(params.max)) {
    url.searchParams.set("max", encodeURIComponent(params.max.toString()));
  }

  if (typeof params?.page === "number" && !isNaN(params.page)) {
    url.searchParams.set("page", encodeURIComponent(params.page.toString()));
  }

  if (params?.search && params.search.trim().length > 0) {
    url.searchParams.set("search", encodeURIComponent(params.search.trim()));
  }

  return url.toString();
}
