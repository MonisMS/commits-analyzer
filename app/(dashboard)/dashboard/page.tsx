import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SyncButton } from "@/components/syncButton";
import { ClassifyButton } from "@/components/classifyButton";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between backdrop-blur-sm bg-white/50 rounded-2xl p-6 shadow-sm border border-white/50">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-in fade-in-50 slide-in-from-left-5 duration-500">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2 animate-in fade-in-50 slide-in-from-left-5 duration-700 delay-100">
              Welcome back, <span className="font-semibold text-blue-600">{user.name}</span>! 👋
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="space-y-6">
          {/* Action Cards */}
          <div className="grid gap-6 md:grid-cols-2 animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-200">
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔄</span>
                  GitHub Data Sync
                </CardTitle>
                <CardDescription>
                  Fetch your recent commits from GitHub repositories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SyncButton />
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🏷️</span>
                  Commit Classification
                </CardTitle>
                <CardDescription>
                  Analyze and categorize your commits by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClassifyButton />
              </CardContent>
            </Card>
          </div>

          {/* Analytics Dashboard */}
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
}