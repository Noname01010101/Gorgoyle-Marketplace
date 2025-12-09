"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { trpc } from "@/lib/trpc";
import Link from "next/link";

interface Model {
  id: number;
  name: string;
  provider?: {
    name: string;
  };
}

interface BenchmarkSummary {
  modelId: number;
  model: Model;
  averageScore: number;
  totalBenchmarks: number;
  categories: string[];
}

export default function BenchmarksPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<Map<number, any>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadBenchmarks();
  }, []);

  const loadBenchmarks = async () => {
    try {
      setLoading(true);
      setError(null);

      const modelsData = await trpc.catalog.getModels.query({});
      setModels(modelsData);

      // Load benchmark summaries for all models
      const benchmarkPromises = modelsData.map(async (model: Model) => {
        try {
          const summary = await trpc.benchmarks.getModelBenchmarkSummary.query({
            modelId: model.id,
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

  const modelsWithBenchmarks = models.filter((model) =>
    benchmarkData.has(model.id)
  );
  const categories = Array.from(
    new Set(
      Array.from(benchmarkData.values()).flatMap(
        (data: any) => data.categories || []
      )
    )
  );

  if (loading) return <LoadingState message="Loading benchmarks..." />;
  if (error) return <ErrorState message={error} onRetry={loadBenchmarks} />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-semibold tracking-tight mb-4">
              Model Benchmarks
            </h1>
            <p className="text-xl text-text-secondary">
              Compare real-world performance across{" "}
              {modelsWithBenchmarks.length} models
            </p>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-8">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-primary text-white"
                      : "bg-card-bg text-text-secondary hover:bg-card-bg-hover"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-card-bg text-text-secondary hover:bg-card-bg-hover"
                    }`}
                  >
                    {category.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Benchmark Cards */}
          {modelsWithBenchmarks.length === 0 ? (
            <Card>
              <p className="text-center text-text-secondary py-8">
                No benchmark data available yet. Check back soon!
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {modelsWithBenchmarks
                .sort((a, b) => {
                  const aData = benchmarkData.get(a.id);
                  const bData = benchmarkData.get(b.id);
                  return (
                    (bData?.averageScore || 0) - (aData?.averageScore || 0)
                  );
                })
                .map((model) => {
                  const data = benchmarkData.get(model.id);
                  if (!data) return null;

                  return (
                    <Card key={model.id} hover>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/models/${model.id}`}>
                              <h3 className="text-2xl font-semibold text-text-primary hover:text-primary transition-colors">
                                {model.name}
                              </h3>
                            </Link>
                            {model.provider && (
                              <p className="text-sm text-text-tertiary mt-1">
                                {model.provider.name}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-primary">
                              {data.averageScore?.toFixed(1) || "N/A"}
                            </div>
                            <div className="text-xs text-text-tertiary">
                              Average Score
                            </div>
                          </div>
                        </div>

                        {data.categories && data.categories.length > 0 && (
                          <div>
                            <div className="text-sm text-text-tertiary mb-2">
                              {data.totalBenchmarks} benchmarks across{" "}
                              {data.categories.length} categories
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {data.categories.map((category: string) => (
                                <span
                                  key={category}
                                  className="px-3 py-1 bg-card-bg-hover border border-border rounded-full text-xs text-text-secondary capitalize"
                                >
                                  {category.replace(/_/g, " ")}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-border">
                          <Link
                            href={`/models/${model.id}`}
                            className="text-primary hover:text-primary-hover transition-colors text-sm"
                          >
                            View detailed benchmarks →
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          )}

          {/* Info Card */}
          <Card className="mt-12">
            <h3 className="text-xl font-semibold mb-3">About Benchmarks</h3>
            <p className="text-text-secondary leading-relaxed">
              Our benchmarks measure real-world performance across various tasks
              and domains. Scores are normalized on a scale where higher values
              indicate better performance. Use these metrics alongside pricing
              and specifications to make informed decisions about which model
              best suits your needs.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
