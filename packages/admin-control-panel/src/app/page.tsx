export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gorgoyle Admin Panel</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your database records with a powerful web interface
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="AI Models"
          description="Manage AI models and their configurations"
          href="/models"
          icon="🤖"
        />
        <DashboardCard
          title="Providers"
          description="Manage AI service providers"
          href="/providers"
          icon="🏢"
        />
        <DashboardCard
          title="Model Pricing"
          description="Configure pricing information"
          href="/pricing"
          icon="💰"
        />
        <DashboardCard
          title="Benchmarks"
          description="View and manage benchmark results"
          href="/benchmarks"
          icon="📊"
        />
        <DashboardCard
          title="Fields"
          description="Manage model fields and attributes"
          href="/fields"
          icon="🏷️"
        />
      </div>

      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Quick Start Guide
        </h2>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
          <li>• Use the sidebar to navigate between different tables</li>
          <li>• Click on any table name to view, search, and filter records</li>
          <li>• Use the &ldquo;Add New&rdquo; button to create new records</li>
          <li>• Toggle dark mode using the theme switcher in the sidebar</li>
        </ul>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

function DashboardCard({ title, description, href, icon }: DashboardCardProps) {
  return (
    <a
      href={href}
      className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </a>
  );
}
