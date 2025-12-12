import Link from "next/link";

export default function Header() {
  const navItems = [
    { href: "/models", label: "Models" },
    { href: "/pricing", label: "Pricing" },
    { href: "/capability-matching", label: "Matching" },
    { href: "/benchmarks", label: "Benchmarks" },
    { href: "/suggestions", label: "Suggestions" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-header-bg backdrop-blur-xl border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold text-text-primary hover:text-primary transition-colors"
        >
          Gorgoyle Marketplace
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button className="md:hidden text-text-secondary hover:text-text-primary">
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
  );
}
