import { useEffect, useState } from "react";
import type { Product } from "../productsApi";
import { fetchProduct } from "../productsApi";

export function useProduct(id: string | undefined) {
  const [item, setItem] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!id) {
        setItem(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProduct(id);
        if (!cancelled) setItem(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load product");
        if (!cancelled) setItem(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { item, isLoading, error };
}

