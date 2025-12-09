import Link from "next/link";

export default function Home() {
  const navItems = [
    { href: "/models", label: "Models" },
    { href: "/pricing", label: "Pricing" },
    { href: "/capability-matching", label: "Matching" },
    { href: "/benchmarks", label: "Benchmarks" },
    { href: "/suggestions", label: "Suggestions" },
    { href: "/api-check", label: "API" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold">
            AI Store
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-300">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-7xl md:text-7xl font-semibold tracking-tight mb-10">
            The AI Marketplace
          </h1>
          <p className="text-2xl md:text-3xl text-gray-400 font-light">
            The intelligent way to find your perfect AI model.
          </p>

          <div className="flex items-center justify-center gap-6 pt-8">
            <Link
              href="/models"
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              Explore models
            </Link>
            <Link
              href="/learn-more"
              className="px-6 py-3 text-blue-200 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Model Catalog */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-5xl font-semibold tracking-tight">
                  Model Catalog
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Browse our comprehensive collection of AI models with detailed
                  specifications, capabilities, and performance metrics.
                </p>
                <Link
                  href="/models"
                  className="inline-block text-blue-500 hover:text-blue-400 transition-colors text-lg"
                >
                  View all models →
                </Link>
              </div>
              <div className="h-80 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl flex items-center justify-center border border-gray-800">
                <img
                  src="./front-page/top_8_ai_logos.png"
                  alt="Claude versus OpenAI"
                />
              </div>
            </div>
          </div>

          {/* Pricing Comparison */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="h-80 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl flex items-center justify-center border border-gray-800 order-2 md:order-1">
                <img src="./front-page/pricing.png" alt="" />
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <h2 className="text-5xl font-semibold tracking-tight">
                  Smart Pricing
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Compare costs across providers and models. Understand pricing
                  structures to optimize your AI spending.
                </p>
                <Link
                  href="/pricing"
                  className="inline-block text-blue-500 hover:text-blue-400 transition-colors text-lg"
                >
                  Compare pricing →
                </Link>
              </div>
            </div>
          </div>

          {/* Benchmarks */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-5xl font-semibold tracking-tight">
                  Real Performance
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Access comprehensive benchmark data. Make decisions based on
                  actual performance metrics, not marketing claims.
                </p>
                <Link
                  href="/benchmarks"
                  className="inline-block text-blue-500 hover:text-blue-400 transition-colors text-lg"
                >
                  View benchmarks →
                </Link>
              </div>
              <div className="h-80 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl flex items-center justify-center border border-gray-800">
                <img src="./front-page/claude_vs_openai_v2.png" alt="" />
              </div>
            </div>
          </div>

          {/* Capability Matching */}
          <div>
            <div className="text-center max-w-3xl mx-auto space-y-6 py-20">
              <h2 className="text-5xl font-semibold tracking-tight">
                Find Your Match
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Tell us what you need, and we'll recommend the perfect AI model
                for your use case. Intelligent matching based on capabilities,
                budget, and requirements.
              </p>
              <Link
                href="/capability-matching"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm font-medium mt-4"
              >
                Start matching
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-12 px-6 mt-32">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>
            Built for developers, data scientists, and technical decision-makers
          </p>
        </div>
      </footer>
    </div>
  );
}
