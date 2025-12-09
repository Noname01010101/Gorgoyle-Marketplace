"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/Card";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { trpc } from "@/lib/trpc";
import Link from "next/link";

interface Model {
  id: number;
  name: string;
  providerId: number;
  contextWindow: number;
  maxOutputTokens: number;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  description?: string;
  provider?: {
    name: string;
  };
}

interface Benchmark {
  id: number;
  modelId: number;
  category: string;
  score: number;
  maxScore: number;
}

interface Suggestion {
  model: Model;
  reason: string;
  similarityScore: number;
}

export default function ModelDetailPage({
  params,
}: {
  params: { modelId: string };
}) {
  const modelId = parseInt(params.modelId);

  const [model, setModel] = useState<Model | null>(null);
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "benchmarks" | "similar"
  >("overview");

  useEffect(() => {
    loadModelData();
  }, [modelId]);

  const loadModelData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [modelsData, benchmarksData, suggestionsData] = await Promise.all([
        trpc.catalog.getModels.query({}),
        trpc.benchmarks.getModelBenchmarks.query({ modelId }).catch(() => []),
        trpc.suggestions.getSuggestionsForModel
          .query({ modelId })
          .catch(() => ({ suggestions: [] })),
      ]);

      const foundModel = modelsData.find((m: Model) => m.id === modelId);
      if (!foundModel) {
        setError("Model not found");
        return;
      }

      setModel(foundModel);
      setBenchmarks(benchmarksData);
      setSuggestions(suggestionsData.suggestions || []);
    } catch (err) {
      setError("Failed to load model details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading model details..." />;
  if (error) return <ErrorState message={error} onRetry={loadModelData} />;
  if (!model) return <ErrorState message="Model not found" />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/models"
            className="inline-flex items-center text-text-secondary hover:text-text-primary mb-8 transition-colors"
          >
            <span className="mr-2">←</span> Back to Models
          </Link>

          {/* Model Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-semibold tracking-tight mb-4">
              {model.name}
            </h1>
            {model.provider && (
              <p className="text-xl text-primary mb-4">{model.provider.name}</p>
            )}
            {model.description && (
              <p className="text-lg text-text-secondary">{model.description}</p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            {[
              { id: "overview", label: "Overview" },
              { id: "benchmarks", label: "Benchmarks" },
              { id: "similar", label: "Similar Models" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Context Window:</span>
                    <span className="text-text-primary font-medium">
                      {model.contextWindow.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Max Output:</span>
                    <span className="text-text-primary font-medium">
                      {model.maxOutputTokens.toLocaleString()} tokens
                    </span>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold mb-4">Pricing</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Input Tokens:</span>
                    <span className="text-text-primary font-medium">
                      ${model.inputPricePerMillion}/M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Output Tokens:</span>
                    <span className="text-text-primary font-medium">
                      ${model.outputPricePerMillion}/M
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="text-text-tertiary">Est. 1M tokens:</span>
                    <span className="text-text-primary font-bold">
                      $
                      {(
                        (model.inputPricePerMillion +
                          model.outputPricePerMillion) /
                        2
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "benchmarks" && (
            <div>
              {benchmarks.length === 0 ? (
                <Card>
                  <p className="text-center text-text-secondary py-8">
                    No benchmark data available for this model.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {benchmarks.map((benchmark) => (
                    <Card key={benchmark.id}>
                      <h3 className="text-lg font-semibold mb-3 capitalize">
                        {benchmark.category.replace(/_/g, " ")}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-tertiary">Score:</span>
                          <span className="text-text-primary font-medium">
                            {benchmark.score} / {benchmark.maxScore}
                          </span>
                        </div>
                        <div className="w-full bg-border rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{
                              width: `${
                                (benchmark.score / benchmark.maxScore) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-text-tertiary text-right">
                          {(
                            (benchmark.score / benchmark.maxScore) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "similar" && (
            <div>
              {suggestions.length === 0 ? (
                <Card>
                  <p className="text-center text-text-secondary py-8">
                    No similar models found.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestions.map((suggestion) => (
                    <Link
                      key={suggestion.model.id}
                      href={`/models/${suggestion.model.id}`}
                    >
                      <Card hover>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold">
                            {suggestion.model.name}
                          </h3>
                          <span className="text-sm text-primary font-medium">
                            {(suggestion.similarityScore * 100).toFixed(0)}%
                            match
                          </span>
                        </div>
                        <p className="text-text-secondary mb-4">
                          {suggestion.reason}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-text-tertiary">Input:</span>
                            <span className="text-text-primary">
                              ${suggestion.model.inputPricePerMillion}/M
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-tertiary">Context:</span>
                            <span className="text-text-primary">
                              {suggestion.model.contextWindow.toLocaleString()}{" "}
                              tokens
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
