import Link from "next/link";
import Card from "@/components/Card";
import { Model } from "@/lib/types";
import { formatPrice, calculateModelCost } from "@/lib/utils/formatters";

interface PricingTableRowProps {
  model: Model;
}

export default function PricingTableRow({ model }: PricingTableRowProps) {
  if (!model.modelPricings) return null;

  return (
    <Card hover>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-3">
          <Link
            href={`/models/${encodeURIComponent(
              model.name
            )}/${encodeURIComponent(model.version)}`}
          >
            <h3 className="text-lg font-semibold text-text-primary hover:text-primary transition-colors">
              {model.name}
            </h3>
          </Link>
          {model.provider && (
            <p className="text-sm text-text-tertiary">{model.provider.name}</p>
          )}
        </div>

        <div className="md:col-span-2 text-center">
          <div className="text-xs text-text-tertiary mb-1">Input</div>
          <div className="text-lg font-semibold text-text-primary">
            ${formatPrice(model.modelPricings.inputPricePerMillion)}
          </div>
          <div className="text-xs text-text-tertiary">/M tokens</div>
        </div>

        <div className="md:col-span-2 text-center">
          <div className="text-xs text-text-tertiary mb-1">Output</div>
          <div className="text-lg font-semibold text-text-primary">
            ${formatPrice(model.modelPricings.outputPricePerMillion)}
          </div>
          <div className="text-xs text-text-tertiary">/M tokens</div>
        </div>

        <div className="md:col-span-5">
          <div className="text-xs text-text-tertiary mb-2">Estimated Cost</div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <div className="text-text-primary font-medium">
                $
                {calculateModelCost(
                  model.modelPricings.inputPricePerMillion,
                  model.modelPricings.outputPricePerMillion,
                  100000,
                  50000
                ).toFixed(3)}
              </div>
              <div className="text-xs text-text-tertiary">Light</div>
            </div>
            <div>
              <div className="text-text-primary font-medium">
                $
                {calculateModelCost(
                  model.modelPricings.inputPricePerMillion,
                  model.modelPricings.outputPricePerMillion,
                  1000000,
                  500000
                ).toFixed(2)}
              </div>
              <div className="text-xs text-text-tertiary">Medium</div>
            </div>
            <div>
              <div className="text-text-primary font-medium">
                $
                {calculateModelCost(
                  model.modelPricings.inputPricePerMillion,
                  model.modelPricings.outputPricePerMillion,
                  10000000,
                  5000000
                ).toFixed(2)}
              </div>
              <div className="text-xs text-text-tertiary">Heavy</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
