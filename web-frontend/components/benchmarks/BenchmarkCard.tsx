import Link from "next/link";
import Card from "@/components/Card";
import { BenchmarkSummary } from "@/lib/types";

interface BenchmarkCardProps {
  summary: BenchmarkSummary;
}

export default function BenchmarkCard({ summary }: BenchmarkCardProps) {
  return (
    <Link
      href={`/models/${encodeURIComponent(
        summary.model.name
      )}/${encodeURIComponent(summary.model.version)}?tab=benchmarks`}
    >
      <Card hover>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-1">
              {summary.model.name}
            </h3>
            <p className="text-sm text-text-tertiary">
              {summary.model.provider?.name || summary.model.providerName} • v
              {summary.model.version}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {summary.averageScore.toFixed(1)}
            </div>
            <div className="text-xs text-text-tertiary">Avg Score</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-tertiary">Total Benchmarks</span>
            <span className="text-text-primary font-medium">
              {summary.totalBenchmarks}
            </span>
          </div>

          {summary.categories && summary.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {summary.categories.map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 bg-card-bg-hover text-text-secondary text-xs rounded capitalize"
                >
                  {category.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
