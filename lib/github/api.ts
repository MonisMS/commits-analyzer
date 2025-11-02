import { RateLimit } from "better-auth";
import { createGithubClient } from "./client";
import {
  Commit,
  GitHubUser,
  RateLimitInfo,
  RateLimitQueryResult,
  Repository,
} from "./types";

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
    const result = (await client(query)) as RateLimitQueryResult;

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

export async function getUserRepositories(
  accessToken: string
): Promise<Repository[]> {
  try {
    const client = createGithubClient(accessToken);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const query = `
        
         query($cursor: String) {
        viewer {
          repositories(
            first: 50, 
            after: $cursor, 
            orderBy: {field: UPDATED_AT, direction: DESC}
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              databaseId
              name
              nameWithOwner
              isPrivate
              primaryLanguage {
                name
              }
              updatedAt
              owner {
                login
              }
            }
          }
        }
      }
    `;

    let allRepos: Repository[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    if (hasNextPage && allRepos.length < 200) {
      const result = await client(query, { cursor });

      const repos = result.viewer.repositories.nodes
        .filter((repo) => {
          const repoUpdateAt = new Date(repo.updatedAt);
          return repoUpdateAt >= sixtyDaysAgo;
        })
        .map((repo) => ({
          id: repo.databaseId,
          name: repo.name,
          fullName: repo.nameWithOwner,
          private: repo.isPrivate,
          language: repo.primaryLanguage?.name || null,
          updatedAt: repo.updatedAt,
          owner: repo.owner.login,
        }));
      allRepos = [...allRepos, ...repos];
      hasNextPage = result.viewer.repositories.pageInfo.hasNextPage;
      cursor = result.viewer.repositories.pageInfo.endCursor;

      // Stop if we have enough repos or if no repos in last 60 days
      if (allRepos.length >= 200 || repos.length === 0) break;
    }

    console.log(
      `Found ${allRepos.length} repositories updated in last 60 days`
    );
    return allRepos;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw new Error("Failed to fetch repositories");
  }
}

export async function getRepositoryCommits(
  accessToken: string,
  owner: string,
  repo: string,
  since?: Date
): Promise<Commit[]> {
  try {
    const client = createGithubClient(accessToken);
    const sinceDate = since?.toISOString();

    const query = `
      query($owner: String!, $name: String!, $since: GitTimestamp, $cursor: String) {
        repository(owner: $owner, name: $name) {
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 50, after: $cursor, since: $since) {
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                  nodes {
                    oid
                    message
                    committedDate
                    author {
                      name
                      email
                    }
                    additions
                    deletions
                    changedFilesIfAvailable
                    files(first: 100) {
                      nodes {
                        path
                        additions
                        deletions
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    let allCommits: Commit[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;
    let pageCount = 0;
    const maxPages = 3;

    while (hasNextPage && pageCount < maxPages) {
      const result: any = await client(query, {
        owner,
        name: repo,
        since: sinceDate,
        cursor,
      });

      const commitHistory =
        result.repository?.defaultBranchRef?.target?.history;

      if (!commitHistory) {
        console.warn(`No commit history found for ${owner}/${repo}`);
        break;
      }

      const commits = commitHistory.nodes.map((commit: any) => ({
        sha: commit.oid,
        message: commit.message,
        authorName: commit.author?.name || "Unknown",
        authorEmail: commit.author?.email || "",
        committedAt: new Date(commit.committedDate),
        filesChanged:
          commit.changedFilesIfAvailable || commit.files?.nodes?.length || 0,
        additions: commit.additions || 0,
        deletions: commit.deletions || 0,
        files:
          commit.files?.nodes?.map((file: any) => ({
            filename: file.path,
            status: "modified",
            additions: file.additions || 0,
            deletions: file.deletions || 0,
          })) || [],
      }));

      allCommits = [...allCommits, ...commits];
      hasNextPage = commitHistory.pageInfo.hasNextPage;
      cursor = commitHistory.pageInfo.endCursor;
      pageCount++;
    }

    console.log(
      `Fetched ${allCommits.length} commits from ${owner}/${repo} (${pageCount} pages)`
    );
    return allCommits;
  } catch (error) {
    console.error(`Error fetching commits for ${owner}/${repo}:`, error);
    throw new Error(`Failed to fetch commits for ${owner}/${repo}`);
  }
}

export async function getUserCommits(
  accessToken: string,
  days: number = 30
): Promise<{ repo: Repository; commits: Commit[] }[]> {
  // Check rate limit before starting
  const rateLimit = await checkRateLimit(accessToken);
  if (rateLimit && rateLimit.remaining < 200) {
    const resetTime = rateLimit.reset.toLocaleTimeString();
    throw new Error(
      `Rate limit too low (${rateLimit.remaining} remaining). Resets at ${resetTime}`
    );
  }

  const repositories = await getUserRepositories(accessToken);
  const since = new Date();
  since.setDate(since.getDate() - days);

  // Limit to first 10 repos to avoid rate limiting
  const maxRepos = 10;
  const reposToProcess = repositories.slice(0, maxRepos);

  console.log(
    `Processing ${reposToProcess.length} of ${repositories.length} repositories`
  );

  const results: { repo: Repository; commits: Commit[] }[] = [];

  for (const repo of reposToProcess) {
    try {
      // Check rate limit before each repo
      const currentRateLimit = await checkRateLimit(accessToken);
      if (currentRateLimit && currentRateLimit.remaining < 200) {
        console.warn("Rate limit too low, stopping sync");
        break;
      }

      const [owner, repoName] = repo.fullName.split("/");
      const commits = await getRepositoryCommits(
        accessToken,
        owner,
        repoName,
        since
      );

      if (commits.length > 0) {
        results.push({ repo, commits });
      }

      // Small delay to avoid hitting rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.warn(`Skipping repository ${repo.fullName} due to error:`, error);
      // Continue with other repositories
    }
  }

  console.log(`Successfully processed ${results.length} repositories`);
  return results;
}

export async function getViewer(accessToken: string): Promise<GitHubUser> {
  try {
    const client = createGithubClient(accessToken);
    const query = `
      query {
        viewer {
          login
          name
          email
          avatarUrl
          bio
        }
      }
    `;

    const result: any = await client(query);
    return result.viewer;
  } catch (error) {
    console.error("Error fetching viewer:", error);
    throw new Error("Failed to fetch user information");
  }
}
