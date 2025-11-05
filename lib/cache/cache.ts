interface CacheItem<T> {
  data: T;
  expires: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();

  /**
   * Store data in cache with expiration
   * @param key - Unique identifier for this data
   * @param data - The data to cache
   * @param ttlSeconds - Time to live in seconds (default 5 minutes)
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const expires = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data, expires });
  }

  /**
   * Retrieve data from cache
   * @param key - Unique identifier for the data
   * @returns The cached data or null if expired/not found
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    // Not in cache
    if (!item) return null;
    
    // Expired - remove and return null
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    // Valid cache hit!
    return item.data as T;
  }

  /**
   * Remove specific item from cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Remove all cached data for a user
   * Call this after sync or classification
   */
  deleteUserData(userId: string): void {
    // Find all keys that start with this userId
    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(`user:${userId}:`)) {
        keysToDelete.push(key);
      }
    }
    
    // Delete them all
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Clear entire cache (useful for testing)
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics (for monitoring)
   */
  getStats() {
    let validItems = 0;
    let expiredItems = 0;
    const now = Date.now();

    for (const item of this.cache.values()) {
      if (now > item.expires) {
        expiredItems++;
      } else {
        validItems++;
      }
    }

    return {
      total: this.cache.size,
      valid: validItems,
      expired: expiredItems,
    };
  }
}

// Export singleton instance
export const cache = new SimpleCache();

// Standardized cache keys to avoid typos
export const CACHE_KEYS = {
  ANALYTICS_OVERVIEW: (userId: string) => `user:${userId}:analytics:overview`,
  COMMIT_TYPES: (userId: string) => `user:${userId}:commit_types`,
  COMMITS_OVER_TIME: (userId: string) => `user:${userId}:commits_over_time`,
  ACTIVITY_HEATMAP: (userId: string) => `user:${userId}:activity_heatmap`,
  COMMIT_STATS: (userId: string) => `user:${userId}:commit_stats`,
  TOP_REPOS: (userId: string) => `user:${userId}:top_repos`,
} as const;