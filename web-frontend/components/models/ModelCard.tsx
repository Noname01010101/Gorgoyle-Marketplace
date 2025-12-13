import Link from "next/link";
import Card from "@/components/Card";
import { Model } from "@/lib/types";
import { formatPrice } from "@/lib/utils/formatters";

interface ModelCardProps {
  model: Model;
}

export default function ModelCard({ model }: ModelCardProps) {
  return (
    <Link
      href={`/models/${encodeURIComponent(model.name)}/${encodeURIComponent(
        model.version
      )}`}
    >
      <Card hover className="h-full">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {model.name}
            </h3>
            <p className="text-sm text-text-tertiary">
              {model.provider?.name || model.providerName} • v{model.version}
            </p>
          </div>

          {model.modelPricings && (
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-text-tertiary">Input</p>
                <p className="text-text-primary font-medium">
                  ${formatPrice(model.modelPricings.inputPricePerMillion)}/M
                </p>
              </div>
              <div>
                <p className="text-text-tertiary">Output</p>
                <p className="text-text-primary font-medium">
                  ${formatPrice(model.modelPricings.outputPricePerMillion)}/M
                </p>
              </div>
            </div>
          )}

          {model.fields && model.fields.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {model.fields.slice(0, 3).map((field) => (
                <span
                  key={field.id}
                  className="px-2 py-1 bg-card-bg-hover text-text-secondary text-xs rounded"
                >
                  {field.name}
                </span>
              ))}
              {model.fields.length > 3 && (
                <span className="px-2 py-1 text-text-tertiary text-xs">
                  +{model.fields.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
