import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Model, BenchmarkSummary } from "@/lib/types";

export function useBenchmarks() {
  const [models, setModels] = useState<Model[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<
    Map<number, BenchmarkSummary>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBenchmarks = async () => {
    try {
      setLoading(true);
      setError(null);

      const modelsData = await trpc.catalog.getModels.query({});
      setModels(modelsData as any);

      const benchmarkPromises = modelsData.map(async (model: any) => {
        try {
          const summary = await trpc.benchmarks.getModelBenchmarkSummary.query({
            name: model.name,
            version: model.version ?? "",
          });
          return { modelId: model.id, summary };
        } catch {
          return { modelId: model.id, summary: null };
        }
      });

      const results = await Promise.all(benchmarkPromises);
      const dataMap = new Map();
      results.forEach(({ modelId, summary }) => {
        if (summary && !("error" in summary)) {
          dataMap.set(modelId, summary);
        }
      });

      setBenchmarkData(dataMap);
    } catch (err) {
      setError("Failed to load benchmark data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBenchmarks();
  }, []);

  return { models, benchmarkData, loading, error, refetch: loadBenchmarks };
}
