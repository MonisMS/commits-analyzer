'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCommit, Plus, Minus, FileText, TrendingUp } from 'lucide-react';

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

interface StatsCardsProps {
  commitStats: CommitStats;
  topRepositories: TopRepository[];
}

export function StatsCards({ commitStats, topRepositories }: StatsCardsProps) {
  const netChanges = commitStats.totalAdditions - commitStats.totalDeletions;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
          <GitCommit className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{commitStats.totalCommits}</div>
          <p className="text-xs text-muted-foreground">
            Last 30 days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Code Changes</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {netChanges > 0 ? '+' : ''}{netChanges.toLocaleString()}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Plus className="h-3 w-3 text-green-500 mr-1" />
            {commitStats.totalAdditions.toLocaleString()}
            <Minus className="h-3 w-3 text-red-500 ml-2 mr-1" />
            {commitStats.totalDeletions.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Files/Commit</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Number(commitStats.avgFilesChanged).toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">
            Files changed per commit
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Active Repo</CardTitle>
          <GitCommit className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold truncate">
            {topRepositories[0]?.repositoryName || 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            {topRepositories[0]?.commitCount || 0} commits
          </p>
        </CardContent>
      </Card>
    </div>
  );
}