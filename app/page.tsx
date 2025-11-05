import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Commit Analyzer</span>
          </div>
          <Link href="/signin">
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            Powered by AI Classification
          </div>
          
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Understand Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Git History
            </span>
          </h1>
          
          <p className="mb-8 text-xl text-gray-400 sm:text-2xl">
            Automatically classify and analyze your GitHub commits with intelligent pattern recognition.
            Get insights into your development workflow.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signin">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                Get Started Free
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800 px-8 py-6 text-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">Powerful Features</h2>
          <p className="text-xl text-gray-400">Everything you need to understand your commit patterns</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <Card className="border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
            <div className="mb-4 h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Smart Classification</h3>
            <p className="text-gray-400">
              Automatically categorize commits as features, fixes, refactoring, documentation, and more using intelligent pattern matching.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
            <div className="mb-4 h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Visual Analytics</h3>
            <p className="text-gray-400">
              Beautiful charts and graphs showing commit trends over time, type distribution, and activity heatmaps.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm hover:border-pink-500/50 transition-colors">
            <div className="mb-4 h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Lightning Fast</h3>
            <p className="text-gray-400">
              Optimized caching and efficient database queries ensure your analytics load instantly every time.
            </p>
          </Card>

          {/* Feature 4 */}
          <Card className="border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm hover:border-green-500/50 transition-colors">
            <div className="mb-4 h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Secure & Private</h3>
            <p className="text-gray-400">
              Your data is encrypted and stored securely. We only access what you authorize through GitHub OAuth.
            </p>
          </Card>

          {/* Feature 5 */}
          <Card className="border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm hover:border-yellow-500/50 transition-colors">
            <div className="mb-4 h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Real-time Sync</h3>
            <p className="text-gray-400">
              Sync your repositories with one click. Stay up-to-date with your latest commits and contributions.
            </p>
          </Card>

          {/* Feature 6 */}
          <Card className="border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-colors">
            <div className="mb-4 h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Activity Insights</h3>
            <p className="text-gray-400">
              Track your coding patterns with activity heatmaps and discover when you're most productive.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-gray-800 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-12 text-center backdrop-blur-sm">
          <h2 className="mb-4 text-4xl font-bold">Ready to Analyze Your Commits?</h2>
          <p className="mb-8 text-xl text-gray-400">
            Sign in with GitHub and get instant insights into your development workflow.
          </p>
          <Link href="/signin">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
              Get Started Now
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>© 2025 Commit Analyzer. Built with Next.js, Better Auth, and Drizzle ORM.</p>
        </div>
      </footer>
    </div>
  );
}
