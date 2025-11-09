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
    <div className="min-h-screen bg-[#0a1628]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between bg-[#0f1d35]/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-800/50">
          <div>
            <h1 className="text-4xl font-bold text-white animate-in fade-in-50 slide-in-from-left-5 duration-500">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-2 animate-in fade-in-50 slide-in-from-left-5 duration-700 delay-100">
              Welcome back, <span className="font-semibold text-blue-400">{user.name}</span>! 👋
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="space-y-6">
          {/* Action Cards */}
          <div className="grid gap-6 md:grid-cols-2 animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-200">
            <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <span className="text-2xl">🔄</span>
                  GitHub Data Sync
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Fetch your recent commits from GitHub repositories
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <SyncButton />
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <span className="text-2xl">🏷️</span>
                  Commit Classification
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Analyze and categorize your commits by type
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
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