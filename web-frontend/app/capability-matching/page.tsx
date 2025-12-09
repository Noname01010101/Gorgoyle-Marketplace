"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { trpc } from "@/lib/trpc";
import Link from "next/link";

interface MatchResult {
  model: {
    id: number;
    name: string;
    version: string;
    providerName: string;
    provider?: {
      id: number;
      name: string;
    };
    modelPricings?: {
      inputPricePerMillion: any; // Prisma Decimal
      outputPricePerMillion: any; // Prisma Decimal
    };
    fields?: Array<{
      id: number;
      name: string;
    }>;
    metadata?: any;
    capabilities?: any;
    modalities?: any;
    supportedFormats?: any;
    languages?: any;
  };
  score: number;
  reasoning: string;
}

export default function CapabilityMatchingPage() {
  const [taskDescription, setTaskDescription] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [costWeight, setCostWeight] = useState(0.5);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!taskDescription.trim()) {
      setError("Please describe your task");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const response = await trpc.match.matchModelsForTask.query({
        taskDescription,
        constraints: maxPrice
          ? { maxPricePerMillionTokens: maxPrice }
          : undefined,
        preferences: { costWeight },
      });

      setResults((response.results as any) || []);
    } catch (err) {
      setError("Failed to find matching models");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exampleTasks = [
    "Code generation and debugging assistance",
    "Customer support chatbot with high accuracy",
    "Content writing and creative storytelling",
    "Data analysis and report generation",
    "Translation between multiple languages",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-semibold tracking-tight mb-4">
              Find Your Perfect Match
            </h1>
            <p className="text-xl text-text-secondary">
              Tell us what you need, and we'll recommend the best AI models for
              your use case
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Describe Your Task
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Example: I need a model for generating Python code with good documentation..."
                  rows={4}
                  className="w-full px-4 py-3 bg-card-bg border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Max Price ($/M tokens) - Optional
                  </label>
                  <input
                    type="number"
                    value={maxPrice || ""}
                    onChange={(e) =>
                      setMaxPrice(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="No limit"
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 bg-card-bg border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Cost Priority:{" "}
                    {costWeight === 0
                      ? "Quality"
                      : costWeight === 1
                      ? "Cost"
                      : "Balanced"}
                  </label>
                  <input
                    type="range"
                    value={costWeight}
                    onChange={(e) => setCostWeight(Number(e.target.value))}
                    min="0"
                    max="1"
                    step="0.1"
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-text-tertiary mt-1">
                    <span>Best Quality</span>
                    <span>Lowest Cost</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={loading || !taskDescription.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Finding matches..." : "Find Matching Models"}
              </button>
            </div>
          </Card>

          {/* Example Tasks */}
          {!hasSearched && (
            <Card className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Example Tasks</h3>
              <div className="space-y-2">
                {exampleTasks.map((task, index) => (
                  <button
                    key={index}
                    onClick={() => setTaskDescription(task)}
                    className="block w-full text-left px-4 py-3 bg-card-bg-hover hover:bg-border rounded-lg text-text-secondary hover:text-text-primary transition-colors text-sm"
                  >
                    {task}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="mb-8 border-red-500">
              <p className="text-red-500">{error}</p>
            </Card>
          )}

          {/* Loading State */}
          {loading && <LoadingState message="Analyzing your requirements..." />}

          {/* Results */}
          {!loading && hasSearched && results.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">
                Recommended Models ({results.length})
              </h2>

              {results.map((result, index) => (
                <Card key={result.model.id} hover>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <Link href={`/models/${result.model.id}`}>
                            <h3 className="text-2xl font-semibold text-text-primary hover:text-primary transition-colors">
                              {result.model.name}
                            </h3>
                          </Link>
                          {result.model.provider && (
                            <p className="text-sm text-text-tertiary mt-1">
                              {result.model.provider.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {(result.score * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-text-tertiary">
                          Match Score
                        </div>
                      </div>
                    </div>

                    <div className="bg-card-bg-hover p-4 rounded-lg">
                      <p className="text-text-secondary leading-relaxed">
                        {result.reasoning}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {result.model.modelPricings && (
                        <>
                          <div>
                            <div className="text-text-tertiary mb-1">
                              Input Price
                            </div>
                            <div className="text-text-primary font-semibold">
                              $
                              {result.model.modelPricings.inputPricePerMillion?.toString() ||
                                "N/A"}
                              /M
                            </div>
                          </div>
                          <div>
                            <div className="text-text-tertiary mb-1">
                              Output Price
                            </div>
                            <div className="text-text-primary font-semibold">
                              $
                              {result.model.modelPricings.outputPricePerMillion?.toString() ||
                                "N/A"}
                              /M
                            </div>
                          </div>
                        </>
                      )}
                      {result.model.metadata?.contextWindowTokens && (
                        <div>
                          <div className="text-text-tertiary mb-1">
                            Context Window
                          </div>
                          <div className="text-text-primary font-semibold">
                            {result.model.metadata.contextWindowTokens.toLocaleString()}
                          </div>
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/models/${result.model.id}`}
                          className="btn-primary inline-block text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && hasSearched && results.length === 0 && (
            <Card>
              <p className="text-center text-text-secondary py-8">
                No models found matching your criteria. Try adjusting your
                requirements.
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
