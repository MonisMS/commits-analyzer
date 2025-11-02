import { db } from "@/db/drizzle";
import { user, account } from "@/db/schema";
import { eq, and } from "drizzle-orm";


export async function getUserById(id: string) {
    const result = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return result[0];
}

/**
 * Get GitHub access token for a user
 * Better Auth stores tokens in the account table
 */
export async function getGitHubToken(userId: string): Promise<string | null> {
    const result = await db
        .select({ accessToken: account.accessToken })
        .from(account)
        .where(
            and(
                eq(account.userId, userId),
                eq(account.providerId, 'github')
            )
        )
        .limit(1);
    
    return result[0]?.accessToken || null;
}