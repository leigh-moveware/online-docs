import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Outreach Distributor</h1>
        <p className="text-lg text-gray-600">
          Enterprise-grade outreach management system powered by Moveware
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Campaigns</h2>
          <p className="text-gray-600 mb-4">
            Create and manage outreach campaigns with advanced targeting and personalization.
          </p>
          <Link 
            href="/campaigns" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Campaigns →
          </Link>
        </div>

        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Analytics</h2>
          <p className="text-gray-600 mb-4">
            Track performance metrics and gain insights into your outreach efforts.
          </p>
          <Link 
            href="/analytics" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Analytics →
          </Link>
        </div>

        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Contacts</h2>
          <p className="text-gray-600 mb-4">
            Manage your contact database with intelligent segmentation and filtering.
          </p>
          <Link 
            href="/contacts" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Manage Contacts →
          </Link>
        </div>

        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Settings</h2>
          <p className="text-gray-600 mb-4">
            Configure your workspace, integrations, and user preferences.
          </p>
          <Link 
            href="/settings" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go to Settings →
          </Link>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Connect your Moveware API credentials in Settings</li>
          <li>Import or create your first contact list</li>
          <li>Set up your first outreach campaign</li>
          <li>Monitor results in the Analytics dashboard</li>
        </ul>
      </div>
    </div>
  )
}