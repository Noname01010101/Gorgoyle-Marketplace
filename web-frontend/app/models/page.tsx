"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ModelFilters from "@/components/models/ModelFilters";
import ModelGrid from "@/components/models/ModelGrid";
import { useModels } from "@/lib/hooks/useModels";
import { safeNumber } from "@/lib/utils/formatters";

type SortOption = "name" | "price" | "context";

export default function ModelsPage() {
  const { models, loading, error, refetch } = useModels();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const filteredAndSortedModels = useMemo(() => {
    return models
      .filter((model) =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "price") {
          const aPrice = safeNumber(a.modelPricings?.inputPricePerMillion, 0);
          const bPrice = safeNumber(b.modelPricings?.inputPricePerMillion, 0);
          return aPrice - bPrice;
        }
        return 0;
      });
  }, [models, searchTerm, sortBy]);

  const sortOptions = [
    { value: "name", label: "Sort by Name" },
    { value: "price", label: "Sort by Price" },
    { value: "context", label: "Sort by Context" },
  ];

  if (loading) return <LoadingState message="Loading models..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

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

          <ModelFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={(value) => setSortBy(value as SortOption)}
            sortOptions={sortOptions}
          />

          <ModelGrid models={filteredAndSortedModels} />
        </div>
      </main>
    </div>
  );
}
