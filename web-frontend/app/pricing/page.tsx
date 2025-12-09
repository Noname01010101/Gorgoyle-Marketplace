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
}

export default function PricingPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minInput, setMinInput] = useState(0);
  const [maxOutput, setMaxOutput] = useState(100);
  const [sortBy, setSortBy] = useState<"total" | "input" | "output">("total");

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    filterModels();
  }, [minInput, maxOutput, models, sortBy]);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trpc.catalog.getModels.query({});
      const raw: unknown = data;
      setModels(raw as Model[]);
    } catch (err) {
      setError("Failed to load pricing data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterModels = () => {
    let filtered = models.filter((model) => {
      if (!model.modelPricings) return false;
      const inputPrice = parseFloat(
        model.modelPricings.inputPricePerMillion?.toString() || "0"
      );
      const outputPrice = parseFloat(
        model.modelPricings.outputPricePerMillion?.toString() || "0"
      );
      return inputPrice >= minInput && outputPrice <= maxOutput;
    });

    filtered.sort((a, b) => {
      const aInput = parseFloat(
        a.modelPricings?.inputPricePerMillion?.toString() || "0"
      );
      const aOutput = parseFloat(
        a.modelPricings?.outputPricePerMillion?.toString() || "0"
      );
      const bInput = parseFloat(
        b.modelPricings?.inputPricePerMillion?.toString() || "0"
      );
      const bOutput = parseFloat(
        b.modelPricings?.outputPricePerMillion?.toString() || "0"
      );

      if (sortBy === "input") return aInput - bInput;
      if (sortBy === "output") return aOutput - bOutput;
      return aInput + aOutput - (bInput + bOutput);
    });

    setFilteredModels(filtered);
  };

  const calculateCost = (
    model: Model,
    inputTokens: number,
    outputTokens: number
  ) => {
    if (!model.modelPricings) return 0;
    const inputPrice = parseFloat(
      model.modelPricings.inputPricePerMillion?.toString() || "0"
    );
    const outputPrice = parseFloat(
      model.modelPricings.outputPricePerMillion?.toString() || "0"
    );
    const inputCost = (inputTokens / 1000000) * inputPrice;
    const outputCost = (outputTokens / 1000000) * outputPrice;
    return inputCost + outputCost;
  };

  if (loading) return <LoadingState message="Loading pricing data..." />;
  if (error) return <ErrorState message={error} onRetry={loadModels} />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-semibold tracking-tight mb-4">
              AI Model Pricing
            </h1>
            <p className="text-xl text-text-secondary">
              Compare costs and find the most cost-effective model for your
              needs
            </p>
          </div>

          {/* Price Range Filters */}
          <Card className="mb-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">
                Filter by Price Range ($/M tokens)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-text-tertiary mb-2">
                    Min Input Price
                  </label>
                  <input
                    type="number"
                    value={minInput}
                    onChange={(e) => setMinInput(Number(e.target.value))}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 bg-card-bg border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-tertiary mb-2">
                    Max Output Price
                  </label>
                  <input
                    type="number"
                    value={maxOutput}
                    onChange={(e) => setMaxOutput(Number(e.target.value))}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 bg-card-bg border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-tertiary mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-2 bg-card-bg border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="total">Total Cost</option>
                    <option value="input">Input Price</option>
                    <option value="output">Output Price</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-text-secondary">
                Showing {filteredModels.length} of {models.length} models
              </div>
            </div>
          </Card>

          {/* Cost Calculator */}
          <Card className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Cost Calculator</h3>
            <p className="text-text-secondary mb-4">
              Estimate costs for typical usage patterns
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-semibold text-text-primary">Light Use</div>
                <div className="text-text-tertiary">100K in / 50K out</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-text-primary">
                  Medium Use
                </div>
                <div className="text-text-tertiary">1M in / 500K out</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-text-primary">Heavy Use</div>
                <div className="text-text-tertiary">10M in / 5M out</div>
              </div>
            </div>
          </Card>

          {/* Pricing Table */}
          {filteredModels.length === 0 ? (
            <Card>
              <p className="text-center text-text-secondary py-8">
                No models found in this price range. Try adjusting your filters.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredModels.map((model) => (
                <Card key={model.id} hover>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3">
                      <Link href={`/models/${model.id}`}>
                        <h3 className="text-lg font-semibold text-text-primary hover:text-primary transition-colors">
                          {model.name}
                        </h3>
                      </Link>
                      {model.provider && (
                        <p className="text-sm text-text-tertiary">
                          {model.provider.name}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2 text-center">
                      <div className="text-xs text-text-tertiary mb-1">
                        Input
                      </div>
                      <div className="text-lg font-semibold text-text-primary">
                        $
                        {model.modelPricings?.inputPricePerMillion?.toString() ||
                          "N/A"}
                      </div>
                      <div className="text-xs text-text-tertiary">
                        /M tokens
                      </div>
                    </div>

                    <div className="md:col-span-2 text-center">
                      <div className="text-xs text-text-tertiary mb-1">
                        Output
                      </div>
                      <div className="text-lg font-semibold text-text-primary">
                        $
                        {model.modelPricings?.outputPricePerMillion?.toString() ||
                          "N/A"}
                      </div>
                      <div className="text-xs text-text-tertiary">
                        /M tokens
                      </div>
                    </div>

                    <div className="md:col-span-5">
                      <div className="text-xs text-text-tertiary mb-2">
                        Estimated Cost
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-text-primary font-medium">
                            ${calculateCost(model, 100000, 50000).toFixed(3)}
                          </div>
                          <div className="text-xs text-text-tertiary">
                            Light
                          </div>
                        </div>
                        <div>
                          <div className="text-text-primary font-medium">
                            ${calculateCost(model, 1000000, 500000).toFixed(2)}
                          </div>
                          <div className="text-xs text-text-tertiary">
                            Medium
                          </div>
                        </div>
                        <div>
                          <div className="text-text-primary font-medium">
                            $
                            {calculateCost(model, 10000000, 5000000).toFixed(2)}
                          </div>
                          <div className="text-xs text-text-tertiary">
                            Heavy
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
