import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Model } from "@/lib/types";

export function usePricingModels(minInput: number, maxOutput: number) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadModels = async (min = minInput, max = maxOutput) => {
    try {
      setLoading(true);
      setError(null);
      const data = await trpc.pricing.filterByPriceRangeInput.query({
        minInput: min,
        maxOutput: max,
      });
      setModels(data as Model[]);
    } catch (err) {
      setError("Failed to load pricing data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels(minInput, maxOutput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minInput, maxOutput]);

  return { models, loading, error, refetch: loadModels };
}
