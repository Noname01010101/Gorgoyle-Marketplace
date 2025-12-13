import Header from "@/components/Header";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import MatchingSection from "@/components/home/MatchingSection";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <HeroSection />

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <FeatureSection
            title="Model Catalog"
            description="Browse our comprehensive collection of AI models with detailed specifications, capabilities, and performance metrics."
            linkText="View all models"
            linkHref="/models"
            imageSrc="./front-page/top_8_ai_logos.png"
            imageAlt="Claude versus OpenAI"
          />

          <FeatureSection
            title="Smart Pricing"
            description="Compare costs across providers and models. Understand pricing structures to optimize your AI spending."
            linkText="Compare pricing"
            linkHref="/pricing"
            imageSrc="./front-page/pricing.png"
            imageAlt=""
            reverse
          />

          <FeatureSection
            title="Real Performance"
            description="Access comprehensive benchmark data. Make decisions based on actual performance metrics, not marketing claims."
            linkText="View benchmarks"
            linkHref="/benchmarks"
            imageSrc="./front-page/claude_vs_openai_v2.png"
            imageAlt=""
          />

          <MatchingSection />
        </div>
      </section>

      <Footer />
    </div>
  );
}
