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

interface CommitType {
  type: string;
  count: number;
  percentage: number;
}

interface CommitOverTime {
  date: string;
  commits: number;
}

interface CommitStats {
  totalCommits: number;
  totalAdditions: number;
  totalDeletions: number;
  avgFilesChanged: number;
  firstCommit: Date | null;
  lastCommit: Date | null;
}

interface TopRepository {
  repositoryName: string;
  commitCount: number;
  totalAdditions: number;
  totalDeletions: number;
}

interface CommitComparison {
  currentPeriod: number;
  previousPeriod: number;
  percentageChange: number;
}

interface ContributionStreak {
  currentStreak: number;
  longestStreak: number;
  lastCommitDate: string;
}

interface RepositoryStats {
  totalRepositories: number;
  mostActiveRepo: string;
  mostActiveRepoCommits: number;
}

interface ProductivityStats {
  mostProductiveDay: string;
  mostProductiveDayCount: number;
  mostProductiveHour: number;
  mostProductiveHourCount: number;
}

interface CommitFrequencyStats {
  avgCommitsPerDay: number;
  mostActiveMonth: string;
  mostActiveMonthCount: number;
  consistencyScore: number;
}

interface LanguageStat {
  language: string;
  count: number;
  percentage: number;
}

interface WeeklyPattern {
  day: string;
  commits: number;
}

interface HourlyPattern {
  hour: number;
  commits: number;
}

interface AnalyticsData {
  commitTypes: CommitType[];
  commitsOverTime: CommitOverTime[];
  activityHeatmap: unknown[];
  commitStats: CommitStats;
  topRepositories: TopRepository[];
  commitComparison: CommitComparison;
  contributionStreak: ContributionStreak;
  repositoryStats: RepositoryStats;
  productivityStats: ProductivityStats;
  commitFrequencyStats: CommitFrequencyStats;
  languageStats: LanguageStat[];
  weeklyPattern: WeeklyPattern[];
  hourlyPattern: HourlyPattern[];
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const getCommitTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      'Frontend': '#3b82f6',
      'Backend': '#10b981',
      'Configuration': '#f59e0b',
      'Documentation': '#8b5cf6',
      'Other': '#6b7280',
    };
    return colors[type] || '#6b7280';
  };

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
    } catch {
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
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Analytics Overview
          </h2>
          <p className="text-gray-400 mt-1">
            Your coding insights at a glance
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="border-gray-700 bg-[#0f1d35] text-gray-300 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <StatsCards
        commitStats={data.commitStats}
        commitComparison={data.commitComparison}
        contributionStreak={data.contributionStreak}
        repositoryStats={data.repositoryStats}
        productivityStats={data.productivityStats}
        commitFrequencyStats={data.commitFrequencyStats}
        languageStats={data.languageStats}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Commit Types */}
        <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="group-hover:text-blue-400 transition-colors text-white">Commit Types</CardTitle>
            <CardDescription className="text-gray-400">
              Distribution of commits by category
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <CommitTypePieChart data={data.commitTypes.map(ct => ({
              name: ct.type,
              value: ct.count,
              percentage: ct.percentage.toString(),
              color: getCommitTypeColor(ct.type)
            }))} />
          </CardContent>
        </Card>

        {/* Weekly Pattern */}
        <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="group-hover:text-blue-400 transition-colors text-white">Weekly Pattern</CardTitle>
            <CardDescription className="text-gray-400">
              Activity by day of the week
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <WeeklyPatternChart data={data.weeklyPattern} />
          </CardContent>
        </Card>

        {/* Repository Comparison */}
        <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="group-hover:text-blue-400 transition-colors text-white">Top Repositories</CardTitle>
            <CardDescription className="text-gray-400">
              Commits by repository
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <RepositoryComparisonChart data={data.topRepositories} />
          </CardContent>
        </Card>

        {/* Commits Over Time */}
        <Card className="lg:col-span-2 group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="group-hover:text-blue-400 transition-colors text-white">Commits Over Time</CardTitle>
            <CardDescription className="text-gray-400">
              Daily activity for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <CommitsOverTimeChart data={data.commitsOverTime.map(ct => ({
              date: new Date(ct.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              fullDate: ct.date,
              commits: ct.commits
            }))} />
          </CardContent>
        </Card>

        {/* Daily Activity Pattern */}
        <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="group-hover:text-blue-400 transition-colors text-white">Daily Activity</CardTitle>
            <CardDescription className="text-gray-400">
              24-hour coding pattern
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DailyActivityPattern data={data.hourlyPattern.map(hp => ({
              hour: hp.hour === 0 ? '12a' : hp.hour < 12 ? `${hp.hour}a` : hp.hour === 12 ? '12p' : `${hp.hour - 12}p`,
              commits: hp.commits,
              hourNum: hp.hour
            }))} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}