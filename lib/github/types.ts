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