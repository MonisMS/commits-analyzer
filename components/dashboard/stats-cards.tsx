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

interface StatsCardsProps {
  commitStats: CommitStats;
  commitComparison: CommitComparison;
  contributionStreak: ContributionStreak;
  repositoryStats: RepositoryStats;
  productivityStats: ProductivityStats;
  commitFrequencyStats: CommitFrequencyStats;
  languageStats: LanguageStat[];
}

export function StatsCards({ 
  commitStats, 
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
  const formatDate = (date: Date | null | string) => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : new Date(date);
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
      <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-gray-300">Total Commits</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
            <GitCommit className="h-5 w-5 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-white">
            {commitStats.totalCommits.toLocaleString()}
          </div>
          <div className="flex items-center text-xs text-gray-400 mt-2">
            {isIncreasing && (
              <>
                <TrendingUp className="h-3 w-3 text-green-400 mr-1 animate-bounce" />
                <span className="text-green-400 font-medium">+{commitComparison.percentageChange}%</span>
                <span className="ml-1">vs last month</span>
              </>
            )}
            {isDecreasing && (
              <>
                <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                <span className="text-red-400 font-medium">{commitComparison.percentageChange}%</span>
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
      <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-gray-300">Code Changes</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
            <Plus className="h-5 w-5 text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-white">
            {netChanges > 0 ? '+' : ''}{netChanges.toLocaleString()}
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <Plus className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-green-400 font-medium">
                  +{commitStats.totalAdditions.toLocaleString()}
                </span>
              </div>
              <span className="text-gray-500">additions</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-500 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((commitStats.totalAdditions / (commitStats.totalAdditions + commitStats.totalDeletions)) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <div className="flex items-center">
                <Minus className="h-3 w-3 text-red-400 mr-1" />
                <span className="text-red-400 font-medium">
                  -{commitStats.totalDeletions.toLocaleString()}
                </span>
              </div>
              <span className="text-gray-500">deletions</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Repositories Analyzed */}
      <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-gray-300">Repositories</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
            <Folder className="h-5 w-5 text-green-400" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-white">
            {repositoryStats.totalRepositories}
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <p className="text-xs text-gray-400 truncate font-medium">
              Top: <span className="text-green-400">{repositoryStats.mostActiveRepo}</span>
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
              </div>
              <span className="text-xs text-gray-400">
                {repositoryStats.mostActiveRepoCommits}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Contribution Streak */}
      <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-gray-300">Contribution Streak</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors animate-pulse">
            <Flame className="h-5 w-5 text-orange-400" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-white">
            {contributionStreak.currentStreak} {contributionStreak.currentStreak === 1 ? 'day' : 'days'}
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Longest streak</span>
              <span className="font-medium text-orange-400">
                {contributionStreak.longestStreak} {contributionStreak.longestStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-400 mt-1">
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
      <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-gray-300">Avg Commit Size</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
            <FileText className="h-5 w-5 text-cyan-400" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-white">
            {Number(commitStats.avgFilesChanged).toFixed(1)}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">files per commit</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              commitSizeQuality.label === 'Small' 
                ? 'bg-green-500/20 text-green-400' 
                : commitSizeQuality.label === 'Medium' 
                ? 'bg-yellow-500/20 text-yellow-400' 
                : 'bg-orange-500/20 text-orange-400'
            }`}>
              {commitSizeQuality.label} commits
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                commitSizeQuality.label === 'Small' 
                  ? 'bg-gradient-to-r from-green-400 to-green-500' 
                  : commitSizeQuality.label === 'Medium' 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                  : 'bg-gradient-to-r from-orange-400 to-orange-500'
              }`}
              style={{ width: `${Math.min(Number(commitStats.avgFilesChanged) * 10, 100)}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Most Productive Day */}
      <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-gray-300">Most Productive</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
            <Clock className="h-5 w-5 text-indigo-400" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-white truncate">
            {productivityStats.mostProductiveDay}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-gray-400">Peak time:</span>
            <span className="font-medium text-indigo-400">
              {formatHour(productivityStats.mostProductiveHour)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-400 to-indigo-500 h-2 rounded-full transition-all duration-1000 animate-pulse"
                style={{ width: '70%' }}
              ></div>
            </div>
            <Zap className="h-3 w-3 text-indigo-400" />
          </div>
        </CardContent>
      </Card>

      {/* 7. Commit Frequency */}
      <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-pink-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-gray-300">Commit Frequency</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
            <Activity className="h-5 w-5 text-pink-400" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-white">
            {commitFrequencyStats.avgCommitsPerDay.toFixed(1)}/day
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              Best: <span className="text-pink-400">{formatMonth(commitFrequencyStats.mostActiveMonth)}</span>
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              commitFrequencyStats.consistencyScore >= 80 
                ? 'bg-green-500/20 text-green-400' 
                : commitFrequencyStats.consistencyScore >= 50 
                ? 'bg-yellow-500/20 text-yellow-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {commitFrequencyStats.consistencyScore}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                commitFrequencyStats.consistencyScore >= 80 
                  ? 'bg-gradient-to-r from-green-400 to-green-500' 
                  : commitFrequencyStats.consistencyScore >= 50 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                  : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              style={{ width: `${commitFrequencyStats.consistencyScore}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* 8. Top Languages */}
      <Card className="group relative overflow-hidden bg-[#0f1d35] border-gray-800/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-gray-300">Top Languages</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
            <Code className="h-5 w-5 text-violet-400" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-white">
            {languageStats[0]?.language || 'N/A'}
          </div>
          <div className="space-y-2 mt-3">
            {languageStats.slice(0, 3).map((lang: LanguageStat, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full ${
                    idx === 0 ? 'bg-violet-400' : idx === 1 ? 'bg-violet-500' : 'bg-violet-600'
                  }`}></span>
                  {idx + 1}. {lang.language}
                </span>
                <span className="text-xs font-medium text-violet-400">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}