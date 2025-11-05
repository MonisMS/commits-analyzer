import { db } from "@/db/drizzle";
import { commits, repositories } from "@/db/schema";
import { eq, sql, and, gte } from "drizzle-orm";
import { CommitType } from "@/lib/classification/types";
import { TYPE_DISPLAY_NAMES } from "@/lib/classification/rules";

/**
 * Get commit distribution by type for pie chart
 * Returns array of objects with name, value, percentage, and color
 */
export async function getCommitTypeDistribution(userId: string) {
  // Get count of each commit type
  const typeStats = await db
    .select({
      type: commits.classification,
      count: sql<number>`count(*)::int`,
    })
    .from(commits)
    .where(eq(commits.userId, userId))
    .groupBy(commits.classification);

  // Return empty array if no data
  if (typeStats.length === 0) {
    return [];
  }

  // Calculate total for percentages
  const total = typeStats.reduce((sum, stat) => sum + stat.count, 0);

  // Avoid division by zero
  if (total === 0) {
    return [];
  }

  // Transform into format for pie chart
  return typeStats.map((stat) => ({
    name: TYPE_DISPLAY_NAMES[stat.type as CommitType],
    value: stat.count,
    percentage: ((stat.count / total) * 100).toFixed(1),
    color: getTypeColorHex(stat.type as CommitType),
  }));
}

/**
 * Get daily commit counts for the last 30 days for line chart
 * Returns array of objects with date and commit count
 */
export async function getCommitsOverTime(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get commits grouped by day
  const dailyCommits = await db
    .select({
      date: sql<string>`DATE(${commits.committedAt})`,
      count: sql<number>`count(*)::int`,
    })
    .from(commits)
    .where(
      and(
        eq(commits.userId, userId),
        gte(commits.committedAt, startDate)
      )
    )
    .groupBy(sql`DATE(${commits.committedAt})`)
    .orderBy(sql`DATE(${commits.committedAt})`);

  // Format for chart display
  return dailyCommits.map((day) => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: new Date(day.date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    commits: day.count,
  }));
}

/**
 * Get commit activity by hour and day of week for heatmap
 * Returns array of objects with hour and counts for each day
 */
export async function getActivityHeatmap(userId: string) {
  // Get commits grouped by hour and day of week
  const hourlyCommits = await db
    .select({
      hour: sql<number>`EXTRACT(HOUR FROM ${commits.committedAt})::int`,
      dayOfWeek: sql<number>`EXTRACT(DOW FROM ${commits.committedAt})::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(commits)
    .where(eq(commits.userId, userId))
    .groupBy(
      sql`EXTRACT(HOUR FROM ${commits.committedAt})`,
      sql`EXTRACT(DOW FROM ${commits.committedAt})`
    );

  // Build heatmap data structure
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const heatmapData: Array<{ hour: number; [key: string]: number }> = [];

  for (let hour = 0; hour < 24; hour++) {
    const hourData: { hour: number; [key: string]: number } = { hour };

    for (let day = 0; day < 7; day++) {
      const commitData = hourlyCommits.find(
        (c) => c.hour === hour && c.dayOfWeek === day
      );
      hourData[daysOfWeek[day]] = commitData?.count || 0;
    }

    heatmapData.push(hourData);
  }

  return heatmapData;
}

/**
 * Get overall commit statistics (totals, averages, date ranges)
 */
export async function getCommitStats(userId: string) {
  const stats = await db
    .select({
      totalCommits: sql<number>`count(*)::int`,
      totalAdditions: sql<number>`COALESCE(sum(${commits.additions}), 0)::int`,
      totalDeletions: sql<number>`COALESCE(sum(${commits.deletions}), 0)::int`,
      avgFilesChanged: sql<number>`COALESCE(avg(${commits.filesChanged}), 0)::numeric`,
      firstCommit: sql<Date | null>`min(${commits.committedAt})`,
      lastCommit: sql<Date | null>`max(${commits.committedAt})`,
    })
    .from(commits)
    .where(eq(commits.userId, userId));

  // Return default stats if no data
  if (!stats[0] || stats[0].totalCommits === 0) {
    return {
      totalCommits: 0,
      totalAdditions: 0,
      totalDeletions: 0,
      avgFilesChanged: 0,
      firstCommit: null,
      lastCommit: null,
    };
  }

  return stats[0];
}

/**
 * Get top repositories by commit count
 */
export async function getTopRepositories(userId: string, limit: number = 5) {
  const repoStats = await db
    .select({
      repositoryName: repositories.name,
      commitCount: sql<number>`count(*)::int`,
      totalAdditions: sql<number>`COALESCE(sum(${commits.additions}), 0)::int`,
      totalDeletions: sql<number>`COALESCE(sum(${commits.deletions}), 0)::int`,
    })
    .from(commits)
    .innerJoin(repositories, eq(repositories.id, commits.repositoryId))
    .where(eq(commits.userId, userId))
    .groupBy(repositories.name)
    .orderBy(sql`count(*) DESC`)
    .limit(limit);

  return repoStats;
}

/**
 * Helper function to convert type to hex color for charts
 */
function getTypeColorHex(type: CommitType): string {
  const colorMap: Record<CommitType, string> = {
    frontend: '#3B82F6', // Blue
    backend: '#10B981',  // Green
    docs: '#8B5CF6',     // Purple
    config: '#F59E0B',   // Orange
    test: '#EC4899',     // Pink
    other: '#6B7280',    // Gray
  };
  return colorMap[type];
}