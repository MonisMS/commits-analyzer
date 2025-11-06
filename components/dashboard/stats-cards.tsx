'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCommit, Plus, Minus, Folder, Flame, TrendingUp, TrendingDown, Calendar, FileText, Clock, Activity, Code, Zap } from 'lucide-react';

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
  last30Days: number;
  previous30Days: number;
  percentageChange: number;
}

interface ContributionStreak {
  currentStreak: number;
  longestStreak: number;
  lastCommitDate: Date | null;
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

interface StatsCardsProps {
  commitStats: CommitStats;
  topRepositories: TopRepository[];
  commitComparison: CommitComparison;
  contributionStreak: ContributionStreak;
  repositoryStats: RepositoryStats;
  productivityStats: ProductivityStats;
  commitFrequencyStats: CommitFrequencyStats;
  languageStats: LanguageStat[];
}

export function StatsCards({ 
  commitStats, 
  topRepositories, 
  commitComparison,
  contributionStreak,
  repositoryStats,
  productivityStats,
  commitFrequencyStats,
  languageStats,
}: StatsCardsProps) {
  const netChanges = commitStats.totalAdditions - commitStats.totalDeletions;
  const isIncreasing = commitComparison.percentageChange > 0;
  const isDecreasing = commitComparison.percentageChange < 0;

  // Format last commit date
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format hour (0-23) to 12-hour format
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  // Get commit size quality indicator
  const getCommitSizeQuality = () => {
    const avgFiles = commitStats.avgFilesChanged;
    if (avgFiles < 5) return { label: 'Small', color: 'text-green-600' };
    if (avgFiles < 15) return { label: 'Medium', color: 'text-blue-600' };
    return { label: 'Large', color: 'text-orange-600' };
  };

  const commitSizeQuality = getCommitSizeQuality();

  // Format month (YYYY-MM) to readable format
  const formatMonth = (month: string) => {
    if (month === 'N/A') return 'N/A';
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* First Row - Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Commits with comparison */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <GitCommit className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            {commitStats.totalCommits.toLocaleString()}
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {isIncreasing && (
              <>
                <TrendingUp className="h-3 w-3 text-green-500 mr-1 animate-bounce" />
                <span className="text-green-500 font-medium">+{commitComparison.percentageChange}%</span>
                <span className="ml-1">vs last month</span>
              </>
            )}
            {isDecreasing && (
              <>
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-red-500 font-medium">{commitComparison.percentageChange}%</span>
                <span className="ml-1">vs last month</span>
              </>
            )}
            {!isIncreasing && !isDecreasing && (
              <span>No change vs last month</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. Code Changes - Improved */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Code Changes</CardTitle>
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Plus className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            {netChanges > 0 ? '+' : ''}{netChanges.toLocaleString()}
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <Plus className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">
                  +{commitStats.totalAdditions.toLocaleString()}
                </span>
              </div>
              <span className="text-muted-foreground">additions</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((commitStats.totalAdditions / (commitStats.totalAdditions + commitStats.totalDeletions)) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <div className="flex items-center">
                <Minus className="h-3 w-3 text-red-600 mr-1" />
                <span className="text-red-600 font-medium">
                  -{commitStats.totalDeletions.toLocaleString()}
                </span>
              </div>
              <span className="text-muted-foreground">deletions</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Repositories Analyzed */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Repositories</CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <Folder className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            {repositoryStats.totalRepositories}
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-xs text-muted-foreground truncate font-medium">
              Top: {repositoryStats.mostActiveRepo}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
              </div>
              <span className="text-xs text-muted-foreground">
                {repositoryStats.mostActiveRepoCommits}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Contribution Streak */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contribution Streak</CardTitle>
          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center animate-pulse">
            <Flame className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            {contributionStreak.currentStreak} {contributionStreak.currentStreak === 1 ? 'day' : 'days'}
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Longest streak</span>
              <span className="font-medium text-orange-600">
                {contributionStreak.longestStreak} {contributionStreak.longestStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="text-xs">{formatDate(contributionStreak.lastCommitDate)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Second Row - Productivity Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 5. Average Commit Size */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-cyan-500 bg-gradient-to-br from-cyan-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Commit Size</CardTitle>
          <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center">
            <FileText className="h-4 w-4 text-cyan-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
            {Number(commitStats.avgFilesChanged).toFixed(1)}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">files per commit</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              commitSizeQuality.label === 'Small' 
                ? 'bg-green-100 text-green-700' 
                : commitSizeQuality.label === 'Medium' 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {commitSizeQuality.label} commits
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                commitSizeQuality.label === 'Small' 
                  ? 'bg-gradient-to-r from-green-400 to-green-600' 
                  : commitSizeQuality.label === 'Medium' 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                  : 'bg-gradient-to-r from-orange-400 to-orange-600'
              }`}
              style={{ width: `${Math.min(Number(commitStats.avgFilesChanged) * 10, 100)}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Most Productive Day */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Productive</CardTitle>
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <Clock className="h-4 w-4 text-indigo-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent truncate">
            {productivityStats.mostProductiveDay}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-muted-foreground">Peak time:</span>
            <span className="font-medium text-indigo-600">
              {formatHour(productivityStats.mostProductiveHour)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-gradient-to-r from-indigo-200 to-indigo-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-1000 animate-pulse"
                style={{ width: '70%' }}
              ></div>
            </div>
            <Zap className="h-3 w-3 text-indigo-500" />
          </div>
        </CardContent>
      </Card>

      {/* 7. Commit Frequency */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-pink-500 bg-gradient-to-br from-pink-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Commit Frequency</CardTitle>
          <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
            <Activity className="h-4 w-4 text-pink-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
            {commitFrequencyStats.avgCommitsPerDay.toFixed(1)}/day
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              Best: {formatMonth(commitFrequencyStats.mostActiveMonth)}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              commitFrequencyStats.consistencyScore >= 80 
                ? 'bg-green-100 text-green-700' 
                : commitFrequencyStats.consistencyScore >= 50 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {commitFrequencyStats.consistencyScore}% consistent
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                commitFrequencyStats.consistencyScore >= 80 
                  ? 'bg-gradient-to-r from-green-400 to-green-600' 
                  : commitFrequencyStats.consistencyScore >= 50 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                  : 'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${commitFrequencyStats.consistencyScore}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* 8. Top Languages */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-violet-500 bg-gradient-to-br from-violet-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Languages</CardTitle>
          <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
            <Code className="h-4 w-4 text-violet-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            {languageStats[0]?.language || 'N/A'}
          </div>
          <div className="space-y-2 mt-2">
            {languageStats.slice(0, 3).map((lang: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full ${
                    idx === 0 ? 'bg-violet-500' : idx === 1 ? 'bg-violet-400' : 'bg-violet-300'
                  }`}></span>
                  {idx + 1}. {lang.language}
                </span>
                <span className="text-xs font-medium text-violet-600">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}