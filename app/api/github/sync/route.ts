import { getServerUser } from "@/lib/auth";
import { getUserById } from "@/lib/db/queries";
import { syncUserData } from "@/lib/github/sync";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const user = await getServerUser()
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const dbUser = await getUserById(user.id);
        if (!dbUser?.githubToken) {
      return NextResponse.json({ error: 'No GitHub token found' }, { status: 400 });
    }

    const result = await syncUserData(dbUser.githubToken,user.id,30)

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