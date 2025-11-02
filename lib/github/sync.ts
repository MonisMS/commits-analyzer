import { db } from "@/db/drizzle";
import { checkRateLimit, getUserCommits } from "./api";
import { commits, repositories } from "@/db/schema";


export async function syncUserData(
    accessToken:string,
    userId:string,
    days:number= 30 

){
    console.log(`Starting sync for user ${userId} (last${days})`);
    
const rateLimit = await checkRateLimit(accessToken);
if(rateLimit && rateLimit.remaining <200){
    throw new Error(
        `Rate limit too low: ${rateLimit.remaining} remaining. Resets at ${rateLimit.reset.toLocaleTimeString()}`
    )
}
 console.log(`Rate limit: ${rateLimit?.remaining}/${rateLimit?.limit} remaining`);


 const userCommits = await getUserCommits(accessToken,days);

 let totalCommits =0;
 let totalRepos = 0;

for(const {repo,commits:repoCommits} of userCommits){
    const [dbRepo] = await db
    .insert(repositories)
    .values({
        userId: userId,
        githubRepoId: repo.id,
        name: repo.name,
        fullName: repo.fullName,
        private: repo.private,
        language: repo.language,
        lastSyncAt: new Date(), 
    })
    .onConflictDoUpdate({
    target: [repositories.userId, repositories.githubRepoId],
        set: {
          name: repo.name,
          fullName: repo.fullName,
          private: repo.private,
          language: repo.language,
          lastSyncAt: new Date(),
        },
      })
      .returning();
for (const commit of repoCommits) {
      try {
        await db.insert(commits).values({
          userId: userId,
          repositoryId: dbRepo.id,
          githubCommitSha: commit.sha,
          message: commit.message,
          authorName: commit.authorName,
          authorEmail: commit.authorEmail,
          committedAt: commit.committedAt,
          classification: 'other', // Will be classified in Guide 4
          filesChanged: commit.filesChanged,
          additions: commit.additions,
          deletions: commit.deletions,
        }).onConflictDoNothing();
        
        totalCommits++;
      } catch (error) {
        console.warn(`Failed to insert commit ${commit.sha}:`, error);
      }
    }
    
    totalRepos++;



  }
  const finalRateLimit = await checkRateLimit(accessToken);
  console.log(`Sync completed: ${totalCommits} commits from ${totalRepos} repositories`);
  console.log(`Rate limit after sync: ${finalRateLimit?.remaining}/${finalRateLimit?.limit} remaining`);
  
  return {
    commitsAdded: totalCommits,
    repositoriesSynced: totalRepos,
    rateLimitRemaining: finalRateLimit?.remaining || 0,
  };
}




