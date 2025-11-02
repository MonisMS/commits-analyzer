import { getServerUser } from "@/lib/auth";
import { getGitHubToken } from "@/lib/db/queries";
import { checkRateLimit } from "@/lib/github/api";
import { NextResponse } from "next/server";

export async function GET(){
    try {
const user = await getServerUser()
if(!user){
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
const githubToken = await getGitHubToken(user.id);
if(!githubToken){
    return NextResponse.json({ error: 'No GitHub token found. Please sign in again.' }, { status: 400 });
}
const rateLimit = await checkRateLimit(githubToken);
 if (!rateLimit) {
      return NextResponse.json(
        { error: 'Failed to check rate limit' },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      data: rateLimit,
      warning: rateLimit.remaining < 500 ? 'Rate limit getting low' : null,
    });
}
   catch (error) {
    console.error('Rate limit check error:', error);
    return NextResponse.json(
      { error: 'Failed to check rate limit' },
      { status: 500 }
    );
  }
}

