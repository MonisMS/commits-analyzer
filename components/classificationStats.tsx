'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CommitType } from '@/lib/classification/types';
import { TYPE_COLORS, TYPE_DISPLAY_NAMES } from '@/lib/classification/rules';

export function ClassificationStats() {
  const [stats, setStats] = useState<Record<CommitType, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/classification/stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch classification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classification Statistics</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classification Statistics</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Sync your GitHub data and run classification to see statistics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalCommits = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classification Statistics</CardTitle>
        <CardDescription>
          Breakdown of {totalCommits} commits by type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(Object.entries(stats) as [CommitType, number][]).map(([type, count]) => {
            const percentage = totalCommits > 0 ? (count / totalCommits * 100).toFixed(1) : '0';
            return (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={TYPE_COLORS[type]}>
                    {TYPE_DISPLAY_NAMES[type]}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-medium">{count}</div>
                  <div className="text-sm text-gray-500">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}