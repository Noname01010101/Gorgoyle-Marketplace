import Link from "next/link";

export default function ModelsPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Model Catalog</h2>
      <p className="mb-4 text-gray-700">
        Browse and search AI models. Click a model for details.
      </p>
      {/* TODO: Fetch and list models from API */}
      <div className="bg-white rounded shadow p-4 flex flex-col gap-2">
        <Link href="/models/1" className="hover:underline text-indigo-700">
          Example Model 1
        </Link>
        <Link href="/models/2" className="hover:underline text-indigo-700">
          Example Model 2
        </Link>
      </div>
    </div>
  );
}
