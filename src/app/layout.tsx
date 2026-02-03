import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Outreach Distributor',
  description: 'Enterprise-grade outreach management system powered by Moveware',
  keywords: ['outreach', 'management', 'moveware', 'crm'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <nav className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold">Outreach Distributor</h1>
            </nav>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t mt-auto">
            <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
              © {new Date().getFullYear()} Outreach Distributor. Powered by Moveware.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}