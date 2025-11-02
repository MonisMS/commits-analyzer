import { int } from "better-auth";

export interface RateLimitInfo {
    remaining: number;
    reset: Date;
    limit: number;
    used: number;
    cost: number;

}

export interface RateLimitQueryResult {
  rateLimit: {
    limit: number;
    remaining: number;
    resetAt: string;
    used: number;
    cost: number;
  };
}

export interface Repository {
    id: number,
    name: string,
    fullName: string,
    private: boolean,
    language: string | null,
    updatedAt: string,
    owner: string,
}

export interface Commit {
     sha: string;
  message: string;
  authorName: string;
  authorEmail: string;
  committedAt: Date;
  filesChanged: number;
  additions: number;
  deletions: number;
  files: CommitFile[];
}


export interface CommitFile {
     filename: string;
  status: string;
  additions: number;
  deletions: number;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  email: string | null;
  avatarUrl: string;
  bio: string | null;
}