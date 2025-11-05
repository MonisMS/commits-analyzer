import { db } from '@/db/drizzle';
import { commits } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { classifyCommit } from './engine';
import { CommitType } from './types';


export async function classifyUserCommits(userId: string): Promise<{
  classified: number;
  skipped: number;
  errors: number;
}> {
  console.log(`Starting classification for user ${userId}`);

 
  const unclassifiedCommits = await db
    .select()
    .from(commits)
    .where(
      and(
        eq(commits.userId, userId),
        eq(commits.classification, 'other')
      )
    );

  console.log(`Found ${unclassifiedCommits.length} unclassified commits`);

  let classified = 0;
  let skipped = 0;
  let errors = 0;

  for (const commit of unclassifiedCommits) {
    try {
      const result = classifyCommit(commit.message);
      
      // Only update if classification changed
      if (result.type !== 'other') {
        await db
          .update(commits)
          .set({ classification: result.type })
          .where(eq(commits.id, commit.id));
        
        classified++;
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`Error classifying commit ${commit.id}:`, error);
      errors++;
    }
  }

  console.log(
    `Classification complete: ${classified} classified, ${skipped} skipped, ${errors} errors`
  );

  return { classified, skipped, errors };
}


export async function getClassificationStats(
  userId: string
): Promise<Record<CommitType, number>> {
  const result = await db
    .select({
      classification: commits.classification,
    })
    .from(commits)
    .where(eq(commits.userId, userId));

  const stats: Record<CommitType, number> = {
    frontend: 0,
    backend: 0,
    docs: 0,
    config: 0,
    test: 0,
    other: 0,
  };

  for (const row of result) {
    const type = row.classification as CommitType;
    stats[type] = (stats[type] || 0) + 1;
  }

  return stats;
}


export async function getCommitsByType(
  userId: string,
  type: CommitType,
  limit: number = 10
) {
  return await db
    .select()
    .from(commits)
    .where(
      and(
        eq(commits.userId, userId),
        eq(commits.classification, type)
      )
    )
    .limit(limit)
    .orderBy(commits.committedAt);
}


export async function reclassifyAllCommits(userId: string): Promise<{
  classified: number;
  errors: number;
}> {
  console.log(`Reclassifying all commits for user ${userId}`);

  const allCommits = await db
    .select()
    .from(commits)
    .where(eq(commits.userId, userId));

  let classified = 0;
  let errors = 0;

  for (const commit of allCommits) {
    try {
      const result = classifyCommit(commit.message);
      
      await db
        .update(commits)
        .set({ classification: result.type })
        .where(eq(commits.id, commit.id));
      
      classified++;
    } catch (error) {
      console.error(`Error reclassifying commit ${commit.id}:`, error);
      errors++;
    }
  }

  console.log(`Reclassification complete: ${classified} classified, ${errors} errors`);

  return { classified, errors };
}