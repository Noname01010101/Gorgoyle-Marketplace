import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Model } from "@/lib/types";

export function useModels() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trpc.catalog.getModels.query({});
      setModels(data as Model[]);
    } catch (err) {
      setError("Failed to load models");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  return { models, loading, error, refetch: loadModels };
}
