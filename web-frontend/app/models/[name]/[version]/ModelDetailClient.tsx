"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { trpc } from "@/lib/trpc";
import Link from "next/link";

interface Model {
  id: number;
  name: string;
  version: string;
  providerName?: string;
  description?: string;
  provider?: {
    id: number;
    name: string;
  } | null;
  modelPricings?: {
    inputPricePerMillion?: any; // Prisma Decimal or string
    outputPricePerMillion?: any; // Prisma Decimal or string
  } | null;
  fields?: Array<{
    id: number;
    name: string;
  }>;
  metadata?: Record<string, any> | null;
  capabilities?: any;
  modalities?: any;
  supportedFormats?: any;
  languages?: any;
}

interface Benchmark {
  id: number;
  modelId?: number;
  type: string;
  score: number;
  maxScore?: number;
  metadata?: Record<string, any> | null;
}

interface Suggestion {
  model: Model;
  reason?: string;
  similarityScore: number;
}

export default function ModelDetailClient({
  name,
  version,
}: {
  name: string;
  version: string;
}) {
  const [model, setModel] = useState<Model | null>(null);
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "benchmarks" | "similar"
  >("overview");
  const isMountedRef = useRef(true);

  // Helpers to safely parse numbers/decimals coming from API
  const safeNumber = (v: any, fallback = 0) => {
    if (v == null) return fallback;
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const n = Number(v);
      return Number.isFinite(n) ? n : fallback;
    }
    if (typeof v === "object") {
      try {
        // @ts-ignore
        if (typeof v.toNumber === "function") return v.toNumber();
        const s = String(v);
        const n = Number(s);
        return Number.isFinite(n) ? n : fallback;
      } catch (e) {
        return fallback;
      }
    }
    return fallback;
  };

  const formatCount = (v: any) => {
    const n = Math.round(safeNumber(v, 0));
    try {
      return n.toLocaleString();
    } catch (_) {
      return String(n);
    }
  };

  const formatPrice = (v: any) => {
    const n = safeNumber(v, NaN);
    if (!Number.isFinite(n)) return "N/A";
    return n.toFixed(2);
  };

  const loadModelData = async () => {
    setLoading(true);
    setError(null);

    try {
      const modelResp: any = await trpc.catalog.getModelByNameAndVersion.query({
        name,
        version,
      });
      if (!modelResp) {
        if (!isMountedRef.current) return;
        setError(
          `Model not found — the requested model name/version does not exist. Model response: ${JSON.stringify(
            modelResp
          )}.
          name: ${name}, version: ${version}`
        );
        setModel(null);
        setBenchmarks([]);
        setSuggestions([]);
        setLoading(false);
        return;
      }

      // Fetch supporting data (sequential await typed as `any` to avoid
      // TypeScript's excessively deep type instantiation when using the
      // tRPC client types inside Promise.all). Results are normalized
      // at runtime below.
      const benchResp = (await trpc.benchmarks.getModelBenchmarks
        .query({ name, version })
        .catch((e) => {
          console.error("Failed fetching benchmarks:", e);
          return [];
        })) as any;

      const suggResp = (await trpc.suggestions.getSuggestionsForModel
        .query({ name, version })
        .catch((e) => {
          console.error("Failed fetching suggestions:", e);
          return { suggestions: [] };
        })) as any;

      if (!isMountedRef.current) return;

      setModel(modelResp as Model);

      // Normalize benchmarks response (accept array or { benchmarks: [] })
      const benchAny = benchResp as any;
      const benchArray: Benchmark[] = Array.isArray(benchAny)
        ? (benchAny as Benchmark[])
        : Array.isArray(benchAny?.benchmarks)
        ? benchAny.benchmarks
        : [];
      setBenchmarks(benchArray);

      // Normalize suggestions: support both shapes:
      // - Array of { model: {...}, reason, similarityScore }
      // - Array of flattened suggestion objects { modelId, modelName, explanation, similarityScore }
      // - Or wrapper { suggestions: [...] }
      const suggAny = suggResp as any;
      let rawSuggestions: any[] = [];
      if (Array.isArray(suggAny)) rawSuggestions = suggAny;
      else if (Array.isArray(suggAny?.suggestions))
        rawSuggestions = suggAny.suggestions;
      else rawSuggestions = [];

      const mappedSuggestions: Suggestion[] = rawSuggestions
        .map((s: any) => {
          if (s == null) return null as any;
          if (s.model) {
            return {
              model: s.model as Model,
              reason: s.reason ?? s.explanation ?? "",
              similarityScore: safeNumber(s.similarityScore, 0),
            } as Suggestion;
          }

          // Flattened suggestion shape -> convert to Suggestion
          const builtModel: Model = {
            id: safeNumber(s.modelId, -1),
            name: s.modelName ?? s.model?.name ?? "",
            version: s.modelVersion ?? s.model?.version ?? "",
            provider: s.providerName
              ? { id: -1, name: s.providerName }
              : s.model?.provider ?? null,
            description: s.description ?? s.model?.description ?? undefined,
            modelPricings:
              s.inputPricePerMillion != null || s.outputPricePerMillion != null
                ? {
                    inputPricePerMillion: s.inputPricePerMillion ?? undefined,
                    outputPricePerMillion: s.outputPricePerMillion ?? undefined,
                  }
                : s.model?.modelPricings ?? null,
            metadata: s.metadata ?? s.model?.metadata ?? null,
          } as Model;

          return {
            model: builtModel,
            reason: s.explanation ?? s.reason ?? "",
            similarityScore: safeNumber(s.similarityScore, 0),
          } as Suggestion;
        })
        .filter(Boolean) as Suggestion[];

      setSuggestions(mappedSuggestions);
    } catch (err: any) {
      console.error("Error loading model details:", err);
      if (!isMountedRef.current) return;
      const message =
        err?.message || "Unknown error while loading model details.";
      setError(`Failed to load model details — ${message}`);
    } finally {
      if (!isMountedRef.current) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    loadModelData();
    return () => {
      isMountedRef.current = false;
    };
  }, [name, version]);

  if (loading) return <LoadingState message="Loading model details..." />;
  if (error) return <ErrorState message={error} onRetry={loadModelData} />;
  if (!model)
    return <ErrorState message="Model not found" onRetry={loadModelData} />;

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
                  {model.metadata && (
                    <>
                      {model.metadata.contextWindowTokens && (
                        <div className="flex justify-between">
                          <span className="text-text-tertiary">
                            Context Window:
                          </span>
                          <span className="text-text-primary font-medium">
                            {formatCount(model.metadata.contextWindowTokens)}{" "}
                            tokens
                          </span>
                        </div>
                      )}
                      {model.metadata.maxOutputTokens && (
                        <div className="flex justify-between">
                          <span className="text-text-tertiary">
                            Max Output:
                          </span>
                          <span className="text-text-primary font-medium">
                            {formatCount(model.metadata.maxOutputTokens)} tokens
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  {(!model.metadata ||
                    (!model.metadata.contextWindowTokens &&
                      !model.metadata.maxOutputTokens)) && (
                    <p className="text-text-secondary text-sm">
                      No specification data available
                    </p>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold mb-4">Pricing</h3>
                <div className="space-y-3">
                  {model.modelPricings ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-text-tertiary">
                          Input Tokens:
                        </span>
                        <span className="text-text-primary font-medium">
                          $
                          {model.modelPricings.inputPricePerMillion != null
                            ? formatPrice(
                                model.modelPricings.inputPricePerMillion
                              )
                            : "N/A"}
                          /M
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-tertiary">
                          Output Tokens:
                        </span>
                        <span className="text-text-primary font-medium">
                          $
                          {model.modelPricings.outputPricePerMillion != null
                            ? formatPrice(
                                model.modelPricings.outputPricePerMillion
                              )
                            : "N/A"}
                          /M
                        </span>
                      </div>
                      {model.modelPricings.inputPricePerMillion != null &&
                        model.modelPricings.outputPricePerMillion != null && (
                          <div className="flex justify-between pt-3 border-t border-border">
                            <span className="text-text-tertiary">
                              Est. 1M tokens:
                            </span>
                            <span className="text-text-primary font-bold">
                              $
                              {(() => {
                                const inP = safeNumber(
                                  model.modelPricings?.inputPricePerMillion,
                                  NaN
                                );
                                const outP = safeNumber(
                                  model.modelPricings?.outputPricePerMillion,
                                  NaN
                                );
                                const avg = (inP + outP) / 2;
                                return Number.isFinite(avg)
                                  ? avg.toFixed(2)
                                  : "N/A";
                              })()}
                            </span>
                          </div>
                        )}
                    </>
                  ) : (
                    <p className="text-text-secondary text-sm">
                      No pricing data available
                    </p>
                  )}
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
                  {benchmarks.map((benchmark) => {
                    const scoreN = safeNumber(benchmark.score, NaN);
                    const maxSource =
                      benchmark.maxScore ?? benchmark.metadata?.maxScore;
                    const maxN = safeNumber(maxSource, NaN);
                    const percent =
                      Number.isFinite(scoreN) &&
                      Number.isFinite(maxN) &&
                      maxN !== 0
                        ? (scoreN / maxN) * 100
                        : NaN;

                    // derive a display label: prefer `type`, fall back to metadata.category
                    const rawLabel =
                      benchmark.type ??
                      benchmark.metadata?.category ??
                      "Uncategorized";
                    const label =
                      typeof rawLabel === "string" && rawLabel.length > 0
                        ? rawLabel.replace(/_/g, " ")
                        : "Uncategorized";
                    return (
                      <Card key={benchmark.id}>
                        <h3 className="text-lg font-semibold mb-3 capitalize">
                          {label}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-text-tertiary">Score:</span>
                            <span className="text-text-primary font-medium">
                              {Number.isFinite(scoreN)
                                ? scoreN.toFixed(1)
                                : "N/A"}
                              {Number.isFinite(maxN)
                                ? ` / ${maxN.toFixed(1)}`
                                : ""}
                            </span>
                          </div>
                          {Number.isFinite(percent) ? (
                            <>
                              <div className="w-full bg-border rounded-full h-2">
                                <div
                                  className="bg-primary rounded-full h-2 transition-all"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <p className="text-xs text-text-tertiary text-right">
                                {`${percent.toFixed(1)}%`}
                              </p>
                            </>
                          ) : null}
                        </div>
                      </Card>
                    );
                  })}
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
                  {suggestions.map((suggestion) => {
                    const href =
                      "/models/" +
                      encodeURIComponent(suggestion.model.name) +
                      "/" +
                      encodeURIComponent(suggestion.model.version);
                    // Debug the generated href in the browser console
                    // so we can inspect the exact value at runtime.
                    // This does not run on the server.
                    if (typeof window !== "undefined") {
                      // eslint-disable-next-line no-console
                      console.debug("Suggestion link:", href, suggestion.model);
                    }

                    return (
                      <Link key={suggestion.model.id} href={href}>
                        <Card hover data-href={href}>
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
                            {suggestion.model.modelPricings && (
                              <div className="flex justify-between">
                                <span className="text-text-tertiary">
                                  Input:
                                </span>
                                <span className="text-text-primary">
                                  {suggestion.model.modelPricings
                                    .inputPricePerMillion != null
                                    ? `$${formatPrice(
                                        suggestion.model.modelPricings
                                          .inputPricePerMillion
                                      )}/M`
                                    : "N/A"}
                                </span>
                              </div>
                            )}
                            {suggestion.model.metadata?.contextWindowTokens && (
                              <div className="flex justify-between">
                                <span className="text-text-tertiary">
                                  Context:
                                </span>
                                <span className="text-text-primary">
                                  {formatCount(
                                    suggestion.model.metadata
                                      .contextWindowTokens
                                  )}{" "}
                                  tokens
                                </span>
                              </div>
                            )}
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
