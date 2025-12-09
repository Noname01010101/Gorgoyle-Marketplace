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

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "context">("name");

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trpc.catalog.getModels.query({});
      setModels(data);
    } catch (err) {
      setError("Failed to load models");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedModels = models
    .filter((model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price")
        return a.inputPricePerMillion - b.inputPricePerMillion;
      if (sortBy === "context") return b.contextWindow - a.contextWindow;
      return 0;
    });

  if (loading) return <LoadingState message="Loading models..." />;
  if (error) return <ErrorState message={error} onRetry={loadModels} />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-semibold tracking-tight mb-4">
              AI Model Catalog
            </h1>
            <p className="text-xl text-text-secondary">
              Browse and compare {models.length} AI models from leading
              providers
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-card-bg border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-card-bg border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="context">Sort by Context</option>
                </select>
              </div>
            </div>
          </div>

          {/* Models Grid */}
          {filteredAndSortedModels.length === 0 ? (
            <Card>
              <p className="text-center text-text-secondary py-8">
                No models found matching your search.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedModels.map((model) => (
                <Link key={model.id} href={`/models/${model.id}`}>
                  <Card hover className="h-full">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">
                          {model.name}
                        </h3>
                        {model.provider && (
                          <p className="text-sm text-primary">
                            {model.provider.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-tertiary">Context:</span>
                          <span className="text-text-primary font-medium">
                            {model.contextWindow.toLocaleString()} tokens
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-tertiary">
                            Max Output:
                          </span>
                          <span className="text-text-primary font-medium">
                            {model.maxOutputTokens.toLocaleString()} tokens
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-tertiary">Input:</span>
                          <span className="text-text-primary font-medium">
                            ${model.inputPricePerMillion}/M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-tertiary">Output:</span>
                          <span className="text-text-primary font-medium">
                            ${model.outputPricePerMillion}/M
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <span className="text-primary text-sm hover:text-primary-hover transition-colors">
                          View details →
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
