import Link from "next/link";
import Card from "@/components/Card";
import { Model } from "@/lib/types";
import { formatPrice, calculateModelCost } from "@/lib/utils/formatters";

interface PricingCardProps {
  model: Model;
  inputTokens?: number;
  outputTokens?: number;
}

export default function PricingCard({
  model,
  inputTokens = 1000000,
  outputTokens = 1000000,
}: PricingCardProps) {
  if (!model.modelPricings) return null;

  const totalCost = calculateModelCost(
    model.modelPricings.inputPricePerMillion,
    model.modelPricings.outputPricePerMillion,
    inputTokens,
    outputTokens
  );

  return (
    <Link
      href={`/models/${encodeURIComponent(model.name)}/${encodeURIComponent(
        model.version
      )}`}
    >
      <Card hover>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-1">
              {model.name}
            </h3>
            <p className="text-sm text-text-tertiary">
              {model.provider?.name || model.providerName} • v{model.version}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-t border-border">
            <div>
              <p className="text-xs text-text-tertiary mb-1">Input Price</p>
              <p className="text-lg font-semibold text-text-primary">
                ${formatPrice(model.modelPricings.inputPricePerMillion)}
              </p>
              <p className="text-xs text-text-tertiary">per M tokens</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary mb-1">Output Price</p>
              <p className="text-lg font-semibold text-text-primary">
                ${formatPrice(model.modelPricings.outputPricePerMillion)}
              </p>
              <p className="text-xs text-text-tertiary">per M tokens</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-text-tertiary mb-1">
              Estimated Cost (1M in + 1M out)
            </p>
            <p className="text-2xl font-bold text-primary">
              ${totalCost.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
