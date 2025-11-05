
import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { classifyUserCommits } from '@/lib/classification/service';
import { cache } from '@/lib/cache/cache';

// Force dynamic rendering - this route requires authentication and database access
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await classifyUserCommits(user.id);
cache.deleteUserData(user.id);
console.log('🗑️  Cache invalidated for user after classification');
    return NextResponse.json({
      success: true,
      data: result,
      message: `Classified ${result.classified} commits, skipped ${result.skipped}`,
    });
  } catch (error) {
    console.error('Classification error:', error);
    return NextResponse.json(
      { error: 'Failed to classify commits' },
      { status: 500 }
    );
  }
}