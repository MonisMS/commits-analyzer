import { RateLimit } from "better-auth";
import { createGithubClient } from "./client";
import { RateLimitInfo, RateLimitQueryResult } from "./types";

export async function checkRateLimit(
  accessToken: string
): Promise<RateLimitInfo | null> {
  try {
    const client = createGithubClient(accessToken);
    const query = `
        query{
        rateLimit{
        limit 
        remaining
        resetAt
        used
        cost 
        
        }}`;
    const result = await client(query) as RateLimitQueryResult;

    return {
      remaining: result.rateLimit.remaining,
      reset: new Date(result.rateLimit.resetAt),
      limit: result.rateLimit.used,
      used: result.rateLimit.used,
      cost: result.rateLimit.cost,
    };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return null;
  }
}



