import Card from "@/components/Card";

interface PriceFilterProps {
  minInput: number;
  maxOutput: number;
  onMinInputChange: (value: number) => void;
  onMaxOutputChange: (value: number) => void;
}

export default function PriceFilter({
  minInput,
  maxOutput,
  onMinInputChange,
  onMaxOutputChange,
}: PriceFilterProps) {
  return (
    <Card className="mb-8">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">
          Filter by Price Range ($/M tokens)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-tertiary mb-2">
              Min Input Price
            </label>
            <input
              type="number"
              value={minInput}
              onChange={(e) => onMinInputChange(Number(e.target.value))}
              min="0"
              step="0.5"
              className="w-full px-4 py-3 bg-card-bg border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-text-tertiary mb-2">
              Max Output Price
            </label>
            <input
              type="number"
              value={maxOutput}
              onChange={(e) => onMaxOutputChange(Number(e.target.value))}
              min="0"
              step="0.5"
              className="w-full px-4 py-3 bg-card-bg border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
