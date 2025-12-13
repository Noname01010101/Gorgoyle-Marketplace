import Card from "@/components/Card";

interface MatchFormProps {
  taskDescription: string;
  onTaskChange: (value: string) => void;
  maxPrice: number | undefined;
  onMaxPriceChange: (value: number | undefined) => void;
  costWeight: number;
  onCostWeightChange: (value: number) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function MatchForm({
  taskDescription,
  onTaskChange,
  maxPrice,
  onMaxPriceChange,
  costWeight,
  onCostWeightChange,
  onSubmit,
  loading = false,
}: MatchFormProps) {
  return (
    <Card>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Describe Your Task
          </label>
          <textarea
            value={taskDescription}
            onChange={(e) => onTaskChange(e.target.value)}
            placeholder="Example: I need a model for generating Python code with good documentation..."
            rows={4}
            className="w-full px-4 py-3 bg-card-bg border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Max Price ($/M tokens) - Optional
            </label>
            <input
              type="number"
              value={maxPrice ?? ""}
              onChange={(e) =>
                onMaxPriceChange(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="No limit"
              min="0"
              step="0.5"
              className="w-full px-4 py-3 bg-card-bg border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Cost Priority:{" "}
              {costWeight === 0
                ? "Quality"
                : costWeight === 1
                ? "Cost"
                : "Balanced"}
            </label>
            <input
              type="range"
              value={costWeight}
              onChange={(e) => onCostWeightChange(Number(e.target.value))}
              min="0"
              max="1"
              step="0.1"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-text-tertiary mt-1">
              <span>Quality</span>
              <span>Cost</span>
            </div>
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading || !taskDescription.trim()}
          className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Finding matches..." : "Find Models"}
        </button>
      </div>
    </Card>
  );
}
