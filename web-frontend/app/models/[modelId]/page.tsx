export default function ModelDetailPage({
  params,
}: {
  params: { modelId: string };
}) {
  // TODO: Fetch model details from API using params.modelId
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Model Details</h2>
      <div className="bg-white rounded shadow p-4">
        <p className="mb-2">
          Model ID: <span className="font-mono">{params.modelId}</span>
        </p>
        {/* TODO: Show model info, pricing, benchmarks, etc. */}
        <p className="text-gray-500">Model details coming soon...</p>
      </div>
    </div>
  );
}
