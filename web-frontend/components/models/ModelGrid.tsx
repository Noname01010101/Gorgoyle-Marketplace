import Card from "@/components/Card";
import ModelCard from "./ModelCard";
import { Model } from "@/lib/types";

interface ModelGridProps {
  models: Model[];
}

export default function ModelGrid({ models }: ModelGridProps) {
  if (models.length === 0) {
    return (
      <Card>
        <p className="text-center text-text-secondary py-8">
          No models found matching your search.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </div>
  );
}
