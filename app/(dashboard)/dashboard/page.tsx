import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SyncButton } from "@/components/syncButton";
export default async function DashboardPage() {
  const user = await getServerUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>
        
        <div className="grid gap-6">
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
        </div>
      </div>
    </div>
  );
}