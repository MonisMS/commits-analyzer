'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CommitTypePieChart } from './charts/commit-type-pie-chart';
import { CommitsOverTimeChart } from './charts/commits-over-time-chart';
import { WeeklyPatternChart } from './charts/weekly-pattern-chart';
import { DailyActivityPattern } from './charts/daily-activity-pattern';
import { RepositoryComparisonChart } from './charts/repository-comparison-chart';
import { StatsCards } from './stats-cards';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalyticsData {
  commitTypes: any[];
  commitsOverTime: any[];
  activityHeatmap: any[];
  commitStats: any;
  topRepositories: any[];
  commitComparison: any;
  contributionStreak: any;
  repositoryStats: any;
  productivityStats: any;
  commitFrequencyStats: any;
  languageStats: any[];
  weeklyPattern: any[];
  hourlyPattern: any[];
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
      <div className="space-y-6 animate-in fade-in-50 duration-700">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-10 w-24 bg-gradient-to-r from-gray-200 to-gray-300" />
                <Skeleton className="h-3 w-40 bg-gradient-to-r from-gray-200 to-gray-300" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className={`animate-pulse ${i === 3 ? 'lg:col-span-2' : ''}`}>
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-gradient-to-r from-gray-200 to-gray-300" />
                <Skeleton className="h-4 w-48 bg-gradient-to-r from-gray-200 to-gray-300 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-80 w-full bg-gradient-to-r from-gray-200 to-gray-300" />
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
    <div className="space-y-6 animate-in fade-in-50 duration-700">
      {/* Add refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Overview
          </h2>
          <p className="text-muted-foreground mt-1">
            Your coding insights at a glance
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="hover:scale-105 transition-all duration-300 hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <StatsCards
        commitStats={data.commitStats}
        topRepositories={data.topRepositories}
        commitComparison={data.commitComparison}
        contributionStreak={data.contributionStreak}
        repositoryStats={data.repositoryStats}
        productivityStats={data.productivityStats}
        commitFrequencyStats={data.commitFrequencyStats}
        languageStats={data.languageStats}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Commit Types */}
        <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <CardHeader>
            <CardTitle className="group-hover:text-blue-600 transition-colors">Commit Types</CardTitle>
            <CardDescription>
              Distribution of commits by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CommitTypePieChart data={data.commitTypes} />
          </CardContent>
        </Card>

        {/* Weekly Pattern */}
        <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <CardHeader>
            <CardTitle className="group-hover:text-blue-600 transition-colors">Weekly Pattern</CardTitle>
            <CardDescription>
              Activity by day of the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyPatternChart data={data.weeklyPattern} />
          </CardContent>
        </Card>

        {/* Repository Comparison */}
        <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <CardHeader>
            <CardTitle className="group-hover:text-blue-600 transition-colors">Top Repositories</CardTitle>
            <CardDescription>
              Commits by repository
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RepositoryComparisonChart data={data.topRepositories} />
          </CardContent>
        </Card>

        {/* Commits Over Time */}
        <Card className="lg:col-span-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <CardHeader>
            <CardTitle className="group-hover:text-blue-600 transition-colors">Commits Over Time</CardTitle>
            <CardDescription>
              Daily activity for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CommitsOverTimeChart data={data.commitsOverTime} />
          </CardContent>
        </Card>

        {/* Daily Activity Pattern */}
        <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <CardHeader>
            <CardTitle className="group-hover:text-blue-600 transition-colors">Daily Activity</CardTitle>
            <CardDescription>
              24-hour coding pattern
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DailyActivityPattern data={data.hourlyPattern} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}