"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import PriceFilter from "@/components/pricing/PriceFilter";
import CostCalculatorInfo from "@/components/pricing/CostCalculatorInfo";
import PricingTableRow from "@/components/pricing/PricingTableRow";
import SortSelect from "@/components/models/SortSelect";
import { usePricingModels } from "@/lib/hooks/usePricingModels";
import { safeNumber } from "@/lib/utils/formatters";

type SortOption = "total" | "input" | "output";

export default function PricingPage() {
  const [minInput, setMinInput] = useState(0);
  const [maxOutput, setMaxOutput] = useState(100);
  const [sortBy, setSortBy] = useState<SortOption>("total");

  const { models, loading, error, refetch } = usePricingModels(
    minInput,
    maxOutput
  );

  const sortedModels = useMemo(() => {
    return [...models].sort((a, b) => {
      const aInput = safeNumber(a.modelPricings?.inputPricePerMillion, 0);
      const aOutput = safeNumber(a.modelPricings?.outputPricePerMillion, 0);
      const bInput = safeNumber(b.modelPricings?.inputPricePerMillion, 0);
      const bOutput = safeNumber(b.modelPricings?.outputPricePerMillion, 0);

      if (sortBy === "input") return aInput - bInput;
      if (sortBy === "output") return aOutput - bOutput;
      return aInput + aOutput - (bInput + bOutput);
    });
  }, [models, sortBy]);

  const sortOptions = [
    { value: "total", label: "Total Cost" },
    { value: "input", label: "Input Price" },
    { value: "output", label: "Output Price" },
  ];

  if (loading) return <LoadingState message="Loading pricing data..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

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

          <PriceFilter
            minInput={minInput}
            maxOutput={maxOutput}
            onMinInputChange={setMinInput}
            onMaxOutputChange={setMaxOutput}
          />

          <Card className="mb-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-text-secondary">
                Showing {sortedModels.length} models
              </div>
              <SortSelect
                value={sortBy}
                onChange={(value) => setSortBy(value as SortOption)}
                options={sortOptions}
              />
            </div>
          </Card>

          <CostCalculatorInfo />

          {sortedModels.length === 0 ? (
            <Card>
              <p className="text-center text-text-secondary py-8">
                No models found in this price range. Try adjusting your filters.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedModels.map((model) => (
                <PricingTableRow key={model.id} model={model} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
