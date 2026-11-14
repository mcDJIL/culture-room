"use client";

import { useCallback, useEffect, useState } from "react";

export type ResourceState = "loading" | "ready" | "error";

export function useResource<T>(loader: (signal: AbortSignal) => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<ResourceState>("loading");
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    setError("");

    loader(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
        setState("ready");
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted) return;
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        setError(caught instanceof Error ? caught.message : "Permintaan belum berhasil. Silakan coba lagi.");
        setState("error");
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  return { data, setData, state, error, reload };
}
