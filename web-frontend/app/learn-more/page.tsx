import Link from "next/link";

export default function LearnMorePage() {
  const stats = [
    { label: "Models tracked", value: "300+" },
    { label: "Benchmarks", value: "40+" },
    { label: "Providers", value: "15+" },
    { label: "Updates / week", value: "1000s" },
  ];

  const pillars = [
    {
      title: "One place for every frontier model",
      description:
        "Stop juggling scattered docs, pricing pages, and benchmark spreadsheets. AI Store brings models, capabilities, and costs into a single, coherent view.",
    },
    {
      title: "Decisions backed by real performance",
      description:
        "Compare models using transparent benchmarks, not vague marketing claims. See how each model behaves on the tasks that matter to you.",
    },
    {
      title: "Built for people who ship",
      description:
        "From CTOs to solo developers, AI Store is designed for teams who need to move fast, stay informed, and avoid expensive mistakes.",
    },
  ];

  const flows = [
    {
      eyebrow: "For product & engineering leaders",
      title: "Align AI strategy with your roadmap",
      copy: "Quickly understand which models fit your product, your latency needs, and your risk profile. Share a single source of truth with your team.",
      bullets: [
        "Compare options by capability, price, and provider",
        "Avoid lock-in with a clear view across vendors",
        "Plan migrations with data, not guesswork",
      ],
    },
    {
      eyebrow: "For developers",
      title: "Ship features, not spreadsheets",
      copy: "Instead of digging through docs, use curated views of context length, rate limits, and supported modalities to pick a model you can integrate today.",
      bullets: [
        "Filter models by the constraints that matter",
        "See pricing in a way that maps to real usage",
        "Quick links into docs and API references",
      ],
    },
    {
      eyebrow: "For data & ML teams",
      title: "Treat models like a real catalog",
      copy: "Centralize how your org talks about models. Compare benchmarks, track what you approve for production, and keep an eye on what just got released.",
      bullets: [
        "Bring benchmarks and vendor data together",
        "Standardize how you evaluate new models",
        "Stay ahead of the release cycle without chaos",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple header matching home */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            AI Store
          </Link>
          <Link
            href="/models"
            className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
          >
            Explore models
          </Link>
        </nav>
      </header>

      <main className="pt-28 pb-24">
        {/* Hero */}
        <section className="px-6">
          <div className="max-w-5xl mx-auto grid gap-12 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                Learn more
              </p>
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
                The control center for your AI model choices.
              </h1>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                AI Store is where teams go when they need a clear, unbiased view
                of the AI landscape. Compare models, understand real
                performance, and choose what to ship with confidence.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/capability-matching"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-colors duration-200"
                >
                  Start matching models
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/10 text-sm font-medium text-gray-200 hover:border-white/30 hover:text-white transition-colors duration-200"
                >
                  Explore pricing
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 text-sm text-gray-400">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border border-white/5 rounded-2xl px-4 py-3 bg-white/5 bg-linear-to-br from-white/5 to-transparent"
                  >
                    <div className="text-lg font-semibold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-80 md:h-96">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-600/80 via-blue-500/30 to-transparent blur-3xl opacity-60" />
              <div className="relative h-full rounded-3xl bg-linear-to-br from-gray-900 via-gray-950 to-black border border-white/10 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 text-xs text-gray-400">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    Live model space
                  </span>
                  <span>Multi-provider • Multi-modal</span>
                </div>
                <div className="flex-1 p-5 flex flex-col gap-4 text-sm text-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.16em] text-gray-500">
                      Snapshot
                    </span>
                    <span className="text-xs text-gray-500">Today</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
                      <div className="text-[11px] text-gray-400 mb-1">
                        Best value
                      </div>
                      <div className="text-sm font-medium text-white">
                        Cost / token
                      </div>
                      <div className="text-[11px] text-emerald-400 mt-1">
                        -32% vs avg
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
                      <div className="text-[11px] text-gray-400 mb-1">
                        Latency
                      </div>
                      <div className="text-sm font-medium text-white">
                        {"<"} 400ms
                      </div>
                      <div className="text-[11px] text-blue-400 mt-1">
                        P95 tracked
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
                      <div className="text-[11px] text-gray-400 mb-1">
                        Reliability
                      </div>
                      <div className="text-sm font-medium text-white">
                        99.9%
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        Vendor mix
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 rounded-2xl bg-linear-to-r from-blue-600/40 via-blue-500/10 to-transparent border border-white/10 px-4 py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-gray-300">
                        Recommended next model
                      </div>
                      <div className="text-sm font-medium text-white mt-0.5">
                        Match for &quot;chat + tools&quot; use case
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-medium hover:bg-gray-100 transition-colors">
                      View details
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-white/5">
                    <span>Updated continuously from providers</span>
                    <span>Designed for teams, not dashboards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why it exists */}
        <section className="px-6 mt-24">
          <div className="max-w-5xl mx-auto grid gap-16 md:grid-cols-[minmax(0,2.2fr)_minmax(0,2fr)] items-start">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                Why AI Store
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                The AI ecosystem is moving fast. Your decisions can’t be
                guesses.
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Every week, new models ship, prices change, and capabilities
                evolve. Teams waste hours trying to keep up, only to make
                decisions based on outdated tabs and anecdotes.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                AI Store is a dedicated layer between you and the noise. It
                turns fragmented provider data into something teams can search,
                compare, and actually act on.
              </p>
            </div>

            <div className="space-y-5">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-3xl border border-white/5 bg-white/5 bg-linear-to-br from-white/5 to-transparent px-5 py-4"
                >
                  <h3 className="text-lg font-medium text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flows / Personas */}
        <section className="px-6 mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                  Built around real workflows
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Whether you ship product or platforms.
                </h2>
              </div>
              <p className="max-w-md text-sm text-gray-400 leading-relaxed">
                AI Store fits into the way your team already makes decisions:
                evaluating options, aligning stakeholders, and getting a model
                into production without surprises.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {flows.map((flow) => (
                <div
                  key={flow.title}
                  className="rounded-3xl border border-white/5 bg-linear-to-b from-white/5 to-transparent p-5 flex flex-col"
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400">
                    {flow.eyebrow}
                  </p>
                  <h3 className="mt-2 text-lg font-medium text-white">
                    {flow.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                    {flow.copy}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
                    {flow.bullets.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1.5 size-1.5 rounded-full bg-blue-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 mt-28">
          <div className="max-w-5xl mx-auto rounded-4xl border border-white/10 bg-linear-to-r from-blue-600/40 via-blue-600/10 to-transparent px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-blue-200/80">
                Ready when you are
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Start exploring the AI model space with clarity.
              </h2>
              <p className="text-sm md:text-base text-gray-200/80 max-w-xl leading-relaxed">
                Jump straight into the catalog, or let capability matching do
                the work for you. Either way, you stay in control of cost,
                performance, and risk.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/models"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto"
              >
                Explore models
              </Link>
              <Link
                href="/capability-matching"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/30 text-sm font-medium text-white hover:bg-white/5 transition-colors duration-200 w-full sm:w-auto"
              >
                Start matching
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-900 py-10 px-6 mt-24 text-center text-sm text-gray-600">
        <p>
          Built for developers, data scientists, and technical decision-makers.
        </p>
      </footer>
    </div>
  );
}
