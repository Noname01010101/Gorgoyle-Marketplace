import Card from "@/components/Card";

export default function CostCalculatorInfo() {
  return (
    <Card className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Cost Calculator</h3>
      <p className="text-text-secondary mb-4">
        Estimate costs for typical usage patterns
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="space-y-2">
          <div className="font-semibold text-text-primary">Light Use</div>
          <div className="text-text-tertiary">100K in / 50K out</div>
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-text-primary">Medium Use</div>
          <div className="text-text-tertiary">1M in / 500K out</div>
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-text-primary">Heavy Use</div>
          <div className="text-text-tertiary">10M in / 5M out</div>
        </div>
      </div>
    </Card>
  );
}
