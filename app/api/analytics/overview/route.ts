import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import {
  getCommitTypeDistribution,
  getCommitsOverTime,
  getActivityHeatmap,
  getCommitStats,
  getTopRepositories,
  getCommitComparison,
  getContributionStreak,
  getRepositoryStats,
  getProductivityStats,
  getCommitFrequencyStats,
  getLanguageStats,
  getWeeklyPattern,
  getHourlyPattern,
} from '@/lib/analytics/service';
import { cache, CACHE_KEYS } from '@/lib/cache/cache';

// Force dynamic rendering - this route requires authentication and database access
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Check authentication
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to get from cache first
    const cacheKey = CACHE_KEYS.ANALYTICS_OVERVIEW(user.id);
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('📦 Cache HIT for analytics overview');
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    console.log('💾 Cache MISS - fetching from database');

    // Fetch all analytics data in parallel for better performance
    const [
      commitTypes,
      commitsOverTime,
      activityHeatmap,
      commitStats,
      topRepositories,
      commitComparison,
      contributionStreak,
      repositoryStats,
      productivityStats,
      commitFrequencyStats,
      languageStats,
      weeklyPattern,
      hourlyPattern,
    ] = await Promise.all([
      getCommitTypeDistribution(user.id),
      getCommitsOverTime(user.id),
      getActivityHeatmap(user.id),
      getCommitStats(user.id),
      getTopRepositories(user.id),
      getCommitComparison(user.id),
      getContributionStreak(user.id),
      getRepositoryStats(user.id),
      getProductivityStats(user.id),
      getCommitFrequencyStats(user.id),
      getLanguageStats(user.id),
      getWeeklyPattern(user.id),
      getHourlyPattern(user.id),
    ]);

    const data = {
      commitTypes,
      commitsOverTime,
      activityHeatmap,
      commitStats,
      topRepositories,
      commitComparison,
      contributionStreak,
      repositoryStats,
      productivityStats,
      commitFrequencyStats,
      languageStats,
      weeklyPattern,
      hourlyPattern,
    };

    // Store in cache for 5 minutes
    cache.set(cacheKey, data, 300);

    return NextResponse.json({
      success: true,
      data,
      cached: false,
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}