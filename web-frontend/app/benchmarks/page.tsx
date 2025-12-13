"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import CategoryFilter from "@/components/benchmarks/CategoryFilter";
import BenchmarkCard from "@/components/benchmarks/BenchmarkCard";
import { useBenchmarks } from "@/lib/hooks/useBenchmarks";
import { BenchmarkSummary } from "@/lib/types";

export default function BenchmarksPage() {
  const { models, benchmarkData, loading, error, refetch } = useBenchmarks();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const modelsWithBenchmarks = useMemo(() => {
    return models.filter((model) => benchmarkData.has(model.id));
  }, [models, benchmarkData]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        Array.from(benchmarkData.values()).flatMap(
          (data: BenchmarkSummary) => data.categories || []
        )
      )
    );
  }, [benchmarkData]);

  const sortedBenchmarkSummaries = useMemo(() => {
    return modelsWithBenchmarks
      .map((model) => {
        const data = benchmarkData.get(model.id);
        return data ? { ...data, model } : null;
      })
      .filter((item): item is BenchmarkSummary => item !== null)
      .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));
  }, [modelsWithBenchmarks, benchmarkData]);

  if (loading) return <LoadingState message="Loading benchmarks..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

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

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {sortedBenchmarkSummaries.length === 0 ? (
            <Card>
              <p className="text-center text-text-secondary py-8">
                No benchmark data available yet. Check back soon!
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {sortedBenchmarkSummaries.map((summary) => (
                <BenchmarkCard key={summary.model.id} summary={summary} />
              ))}
            </div>
          )}

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
