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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <SignOutButton />
        </div>

        <div className="space-y-6">
          {/* Action Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>GitHub Data Sync</CardTitle>
                <CardDescription>
                  Fetch your recent commits from GitHub repositories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SyncButton />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commit Classification</CardTitle>
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