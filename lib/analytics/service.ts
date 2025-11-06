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
 * Get commit stats for last 30 days comparison
 */
export async function getCommitComparison(userId: string) {
  const now = new Date();
  const last30Days = new Date();
  last30Days.setDate(now.getDate() - 30);
  const previous30Days = new Date();
  previous30Days.setDate(now.getDate() - 60);

  // Get commits from last 30 days
  const recentCommits = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(commits)
    .where(
      and(
        eq(commits.userId, userId),
        gte(commits.committedAt, last30Days)
      )
    );

  // Get commits from previous 30 days (31-60 days ago)
  const previousCommits = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(commits)
    .where(
      and(
        eq(commits.userId, userId),
        gte(commits.committedAt, previous30Days),
        sql`${commits.committedAt} < ${last30Days}`
      )
    );

  const recentCount = recentCommits[0]?.count || 0;
  const previousCount = previousCommits[0]?.count || 0;
  
  // Calculate percentage change
  let percentageChange = 0;
  if (previousCount > 0) {
    percentageChange = ((recentCount - previousCount) / previousCount) * 100;
  } else if (recentCount > 0) {
    percentageChange = 100;
  }

  return {
    last30Days: recentCount,
    previous30Days: previousCount,
    percentageChange: Math.round(percentageChange),
  };
}

/**
 * Get contribution streak information
 */
export async function getContributionStreak(userId: string) {
  // Get all commit dates
  const commitDates = await db
    .select({
      date: sql<string>`DATE(${commits.committedAt})`,
    })
    .from(commits)
    .where(eq(commits.userId, userId))
    .groupBy(sql`DATE(${commits.committedAt})`)
    .orderBy(sql`DATE(${commits.committedAt}) DESC`);

  if (commitDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCommitDate: null,
    };
  }

  const dates = commitDates.map(d => new Date(d.date));
  const lastCommitDate = dates[0];

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let checkDate = new Date(today);
  const lastCommit = new Date(lastCommitDate);
  lastCommit.setHours(0, 0, 0, 0);
  
  // Check if last commit was today or yesterday
  const daysDiff = Math.floor((today.getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 1) {
    // Start counting from the most recent commit
    checkDate = new Date(lastCommit);
    
    for (const date of dates) {
      const commitDate = new Date(date);
      commitDate.setHours(0, 0, 0, 0);
      
      const diff = Math.floor((checkDate.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 0) {
        currentStreak++;
      } else if (diff === 1) {
        currentStreak++;
        checkDate = new Date(commitDate);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;
  
  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    prevDate.setHours(0, 0, 0, 0);
    const currDate = new Date(dates[i]);
    currDate.setHours(0, 0, 0, 0);
    
    const diff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak,
    lastCommitDate,
  };
}

/**
 * Get repository statistics
 */
export async function getRepositoryStats(userId: string) {
  // Get total repositories
  const totalRepos = await db
    .select({
      count: sql<number>`count(DISTINCT ${commits.repositoryId})::int`,
    })
    .from(commits)
    .where(eq(commits.userId, userId));

  // Get most active repository
  const topRepo = await db
    .select({
      name: repositories.name,
      commitCount: sql<number>`count(*)::int`,
    })
    .from(commits)
    .innerJoin(repositories, eq(repositories.id, commits.repositoryId))
    .where(eq(commits.userId, userId))
    .groupBy(repositories.name)
    .orderBy(sql`count(*) DESC`)
    .limit(1);

  return {
    totalRepositories: totalRepos[0]?.count || 0,
    mostActiveRepo: topRepo[0]?.name || 'N/A',
    mostActiveRepoCommits: topRepo[0]?.commitCount || 0,
  };
}

/**
 * Get productivity statistics
 */
export async function getProductivityStats(userId: string) {
  // Get most productive day of week
  const dayStats = await db
    .select({
      dayOfWeek: sql<number>`EXTRACT(DOW FROM ${commits.committedAt})::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(commits)
    .where(eq(commits.userId, userId))
    .groupBy(sql`EXTRACT(DOW FROM ${commits.committedAt})`)
    .orderBy(sql`count(*) DESC`)
    .limit(1);

  // Get most productive hour
  const hourStats = await db
    .select({
      hour: sql<number>`EXTRACT(HOUR FROM ${commits.committedAt})::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(commits)
    .where(eq(commits.userId, userId))
    .groupBy(sql`EXTRACT(HOUR FROM ${commits.committedAt})`)
    .orderBy(sql`count(*) DESC`)
    .limit(1);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  return {
    mostProductiveDay: dayStats[0] ? daysOfWeek[dayStats[0].dayOfWeek] : 'N/A',
    mostProductiveDayCount: dayStats[0]?.count || 0,
    mostProductiveHour: hourStats[0]?.hour ?? 0,
    mostProductiveHourCount: hourStats[0]?.count || 0,
  };
}

/**
 * Get commit frequency statistics
 */
export async function getCommitFrequencyStats(userId: string) {
  const stats = await db
    .select({
      totalCommits: sql<number>`count(*)::int`,
      firstCommit: sql<Date | null>`min(${commits.committedAt})`,
      lastCommit: sql<Date | null>`max(${commits.committedAt})`,
    })
    .from(commits)
    .where(eq(commits.userId, userId));

  const totalCommits = stats[0]?.totalCommits || 0;
  const firstCommit = stats[0]?.firstCommit ? new Date(stats[0].firstCommit) : null;
  const lastCommit = stats[0]?.lastCommit ? new Date(stats[0].lastCommit) : null;

  let avgCommitsPerDay = 0;
  if (firstCommit && lastCommit) {
    const daysDiff = Math.max(1, Math.ceil((lastCommit.getTime() - firstCommit.getTime()) / (1000 * 60 * 60 * 24)));
    avgCommitsPerDay = totalCommits / daysDiff;
  }

  // Get most active month
  const monthStats = await db
    .select({
      month: sql<string>`TO_CHAR(${commits.committedAt}, 'YYYY-MM')`,
      count: sql<number>`count(*)::int`,
    })
    .from(commits)
    .where(eq(commits.userId, userId))
    .groupBy(sql`TO_CHAR(${commits.committedAt}, 'YYYY-MM')`)
    .orderBy(sql`count(*) DESC`)
    .limit(1);

  // Calculate consistency score (0-100)
  // Based on how evenly distributed commits are across days
  const dailyCommits = await db
    .select({
      date: sql<string>`DATE(${commits.committedAt})`,
      count: sql<number>`count(*)::int`,
    })
    .from(commits)
    .where(eq(commits.userId, userId))
    .groupBy(sql`DATE(${commits.committedAt})`);

  let consistencyScore = 0;
  if (dailyCommits.length > 0) {
    const avgPerDay = totalCommits / dailyCommits.length;
    const variance = dailyCommits.reduce((sum, day) => {
      return sum + Math.pow(day.count - avgPerDay, 2);
    }, 0) / dailyCommits.length;
    const stdDev = Math.sqrt(variance);
    // Lower standard deviation = more consistent
    // Score from 0-100 where 100 is most consistent
    consistencyScore = Math.max(0, Math.min(100, 100 - (stdDev * 10)));
  }

  return {
    avgCommitsPerDay: avgCommitsPerDay,
    mostActiveMonth: monthStats[0]?.month || 'N/A',
    mostActiveMonthCount: monthStats[0]?.count || 0,
    consistencyScore: Math.round(consistencyScore),
  };
}

/**
 * Get language usage statistics from file extensions
 */
export async function getLanguageStats(userId: string) {
  // This is a simplified version - you'd need to track file extensions in commits
  // For now, we'll return placeholder data
  // In a real implementation, you'd parse commit file paths and extract extensions
  
  // Get a sample to analyze file patterns
  const recentCommits = await db
    .select({
      message: commits.message,
      filesChanged: commits.filesChanged,
    })
    .from(commits)
    .where(eq(commits.userId, userId))
    .limit(100);

  // Simple heuristic: look for file extensions in commit messages
  const languageMap: Record<string, number> = {};
  
  recentCommits.forEach(commit => {
    const msg = commit.message.toLowerCase();
    if (msg.includes('.ts') || msg.includes('.tsx') || msg.includes('typescript')) languageMap['TypeScript'] = (languageMap['TypeScript'] || 0) + 1;
    if (msg.includes('.js') || msg.includes('.jsx') || msg.includes('javascript')) languageMap['JavaScript'] = (languageMap['JavaScript'] || 0) + 1;
    if (msg.includes('.py') || msg.includes('python')) languageMap['Python'] = (languageMap['Python'] || 0) + 1;
    if (msg.includes('.java')) languageMap['Java'] = (languageMap['Java'] || 0) + 1;
    if (msg.includes('.go')) languageMap['Go'] = (languageMap['Go'] || 0) + 1;
    if (msg.includes('.rs') || msg.includes('rust')) languageMap['Rust'] = (languageMap['Rust'] || 0) + 1;
    if (msg.includes('.cpp') || msg.includes('.c')) languageMap['C/C++'] = (languageMap['C/C++'] || 0) + 1;
    if (msg.includes('.rb') || msg.includes('ruby')) languageMap['Ruby'] = (languageMap['Ruby'] || 0) + 1;
    if (msg.includes('.php')) languageMap['PHP'] = (languageMap['PHP'] || 0) + 1;
    if (msg.includes('.css') || msg.includes('.scss')) languageMap['CSS'] = (languageMap['CSS'] || 0) + 1;
    if (msg.includes('.html')) languageMap['HTML'] = (languageMap['HTML'] || 0) + 1;
    if (msg.includes('.md') || msg.includes('markdown')) languageMap['Markdown'] = (languageMap['Markdown'] || 0) + 1;
  });

  // Get top 3 languages
  const sortedLanguages = Object.entries(languageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const total = sortedLanguages.reduce((sum, [, count]) => sum + count, 0);

  return sortedLanguages.map(([lang, count]) => ({
    language: lang,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));
}

/**
 * Get weekly commit pattern (commits by day of week)
 */
export async function getWeeklyPattern(userId: string) {
  const dayStats = await db
    .select({
      dayOfWeek: sql<number>`EXTRACT(DOW FROM ${commits.committedAt})::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(commits)
    .where(eq(commits.userId, userId))
    .groupBy(sql`EXTRACT(DOW FROM ${commits.committedAt})`);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Create data for all days, defaulting to 0 commits
  const weeklyData = daysOfWeek.map((day, index) => {
    const stat = dayStats.find(s => s.dayOfWeek === index);
    return {
      day: day.slice(0, 3), // Abbreviated day name
      commits: stat?.count || 0,
    };
  });

  return weeklyData;
}

/**
 * Get hourly commit pattern (24-hour activity)
 */
export async function getHourlyPattern(userId: string) {
  const hourStats = await db
    .select({
      hour: sql<number>`EXTRACT(HOUR FROM ${commits.committedAt})::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(commits)
    .where(eq(commits.userId, userId))
    .groupBy(sql`EXTRACT(HOUR FROM ${commits.committedAt})`);

  // Create data for all 24 hours
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const stat = hourStats.find(s => s.hour === hour);
    const formatHour = (h: number) => {
      if (h === 0) return '12a';
      if (h === 12) return '12p';
      return h > 12 ? `${h - 12}p` : `${h}a`;
    };

    return {
      hour: formatHour(hour),
      hourNum: hour,
      commits: stat?.count || 0,
    };
  });

  return hourlyData;
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