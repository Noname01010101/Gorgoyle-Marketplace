import Link from "next/link";

export default function MatchingSection() {
  return (
    <div className="text-center max-w-3xl mx-auto space-y-6 py-20">
      <h2 className="text-5xl font-semibold tracking-tight">Find Your Match</h2>
      <p className="text-xl text-gray-400 leading-relaxed">
        Tell us what you need, and we'll recommend the perfect AI model for your
        use case. Intelligent matching based on capabilities, budget, and
        requirements.
      </p>
      <Link
        href="/capability-matching"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm font-medium mt-4"
      >
        Start matching
      </Link>
    </div>
  );
}
