"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PotterResource, PotterQueryParams } from "@/types";
import { fetchPotter } from "@/lib/api";
import { useApp } from "@/context/AppContext";

export function usePotterData<T>(
  resource: PotterResource,
  queryParams?: PotterQueryParams
) {
  const { lang, t } = useApp();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const queryParamsKey = JSON.stringify(queryParams || {});

  const loadData = useCallback(async () => {
    // Abort previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const parsedParams: PotterQueryParams | undefined = queryParamsKey
        ? JSON.parse(queryParamsKey)
        : undefined;

      const items = await fetchPotter<T>(
        lang,
        resource,
        parsedParams,
        controller.signal
      );

      setData(items);
    } catch (err: unknown) {
      if (controller.signal.aborted) {
        // Request cancelled intentionally; do not set error state
        return;
      }
      const message = err instanceof Error ? err.message : t.ui.errorTitle;
      setError(message);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [lang, resource, queryParamsKey, t.ui.errorTitle]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        loadData();
      }
    });
    return () => {
      cancelled = true;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

  return {
    data,
    loading,
    error,
    retry: loadData,
  };
}
