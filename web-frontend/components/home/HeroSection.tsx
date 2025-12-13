import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-7xl md:text-7xl font-semibold tracking-tight mb-10">
          Gorgoyle Marketplace
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
  );
}
