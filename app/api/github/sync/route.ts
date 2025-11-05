import { getServerUser } from "@/lib/auth";
import { getGitHubToken } from "@/lib/db/queries";
import { syncUserData } from "@/lib/github/sync";
import { NextResponse } from "next/server";
import { cache } from "@/lib/cache/cache";

// Force dynamic rendering - this route requires authentication and database access
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
    try {
        const user = await getServerUser()
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const githubToken = await getGitHubToken(user.id);
        if (!githubToken) {
      return NextResponse.json({ error: 'No GitHub token found. Please sign in again.' }, { status: 400 });
    }

    const result = await syncUserData(githubToken, user.id, 30)
cache.deleteUserData(user.id);
    console.log('🗑️  Cache invalidated for user after sync');
return NextResponse.json({
      success: true,
      data: result,
      message: `Synced ${result.commitsAdded} commits from ${result.repositoriesSynced} repositories`,
    });

    } catch (error) {
    console.error('GitHub sync error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Rate limit')) {
        return NextResponse.json(
          { 
            error: error.message,
            code: 'RATE_LIMIT_EXCEEDED' 
          },
          { status: 429 }
        );
      }
    }
    return NextResponse.json(
      { error: 'Failed to sync GitHub data' },
      { status: 500 }
    );
  }
}