import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import {
  getCommitTypeDistribution,
  getCommitsOverTime,
  getActivityHeatmap,
  getCommitStats,
  getTopRepositories,
} from '@/lib/analytics/service';

export async function GET() {
  try {
    // Check authentication
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all analytics data in parallel for better performance
    const [
      commitTypes,
      commitsOverTime,
      activityHeatmap,
      commitStats,
      topRepositories,
    ] = await Promise.all([
      getCommitTypeDistribution(user.id),
      getCommitsOverTime(user.id),
      getActivityHeatmap(user.id),
      getCommitStats(user.id),
      getTopRepositories(user.id),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        commitTypes,
        commitsOverTime,
        activityHeatmap,
        commitStats,
        topRepositories,
      },
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}