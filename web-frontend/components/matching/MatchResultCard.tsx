import Link from "next/link";
import Card from "@/components/Card";
import { MatchResult } from "@/lib/types";
import { formatPrice } from "@/lib/utils/formatters";

interface MatchResultCardProps {
  result: MatchResult;
  rank: number;
}

export default function MatchResultCard({
  result,
  rank,
}: MatchResultCardProps) {
  return (
    <Card>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
            #{rank}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <Link
              href={`/models/${encodeURIComponent(
                result.model.name
              )}/${encodeURIComponent(result.model.version)}`}
              className="text-xl font-semibold text-text-primary hover:text-primary transition-colors"
            >
              {result.model.name}
            </Link>
            <p className="text-sm text-text-tertiary mt-1">
              {result.model.provider?.name || result.model.providerName} • v
              {result.model.version}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-text-tertiary">Match Score</p>
              <p className="text-lg font-semibold text-primary">
                {(result.score * 100).toFixed(0)}%
              </p>
            </div>

            {result.model.modelPricings && (
              <>
                <div>
                  <p className="text-xs text-text-tertiary">Input Price</p>
                  <p className="text-sm font-medium text-text-primary">
                    ${formatPrice(result.model.modelPricings.inputPricePerMillion)}
                    /M
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Output Price</p>
                  <p className="text-sm font-medium text-text-primary">
                    ${formatPrice(result.model.modelPricings.outputPricePerMillion)}
                    /M
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-sm text-text-secondary">{result.reasoning}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
