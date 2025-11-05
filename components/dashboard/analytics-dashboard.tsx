'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CommitTypePieChart } from './charts/commit-type-pie-chart';
import { CommitsOverTimeChart } from './charts/commits-over-time-chart';
import { ActivityHeatmap } from './charts/activity-heatmap';
import { StatsCards } from './stats-cards';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalyticsData {
  commitTypes: any[];
  commitsOverTime: any[];
  activityHeatmap: any[];
  commitStats: any;
  topRepositories: any[];
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async (force: boolean = false) => {
    try {
      if (force) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const url = force 
        ? '/api/analytics/overview?force=true' 
        : '/api/analytics/overview';
      
      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch analytics data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchAnalyticsData(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.commitTypes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Sync your GitHub data and classify commits to see analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add refresh button */}
      <div className="flex justify-end">
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <StatsCards
        commitStats={data.commitStats}
        topRepositories={data.topRepositories}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Commit Types</CardTitle>
            <CardDescription>
              Distribution of commits by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CommitTypePieChart data={data.commitTypes} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commits Over Time</CardTitle>
            <CardDescription>
              Daily commit activity for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CommitsOverTimeChart data={data.commitsOverTime} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity Heatmap</CardTitle>
            <CardDescription>
              Commit activity by hour and day of week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityHeatmap data={data.activityHeatmap} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}