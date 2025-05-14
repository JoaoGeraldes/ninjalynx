import { Duration } from '@upstash/ratelimit';

export const SETTINGS = {
  API_KEY: process.env.API_KEY,
  /**
   * Maximum failed backend attempts to authenticate before permanent failure (requires a redeploy)
   */
  MAX_ALLOWED_FAILED_ATTEMPTS: 20,
  /**
   * When using `FEATURE_FLAG.useRateLimit` setup these configurations, which will impact the rate limit (X requests per Y amount of time limit)
   */
  RATE_LIMIT_CONFIGURATION: {
    maxRequests: 40, // maximum requests per X (duration) time.
    duration: '60 s' as Duration, // limit -- amount of time per maxRequests
  },

  MONGODB: {
    /**
     * This value — the development MongoDB database URL — should come from an environment variable.
     *
     * ⚠️ Avoid changing ` DEV_MONGODB_DATABASE` here. Keep it in environment variable.
     */
    DEV_MONGODB_DATABASE: process.env.DEV_MONGODB_DATABASE,
    /**
     * This value — the production MongoDB database URL — should come from an environment variable.
     *
     * ⚠️ Avoid changing ` PROD_MONGODB_DATABASE` here. Keep it in environment variable.
     */
    PROD_MONGODB_DATABASE: process.env.PROD_MONGODB_DATABASE,
    /**
     * Items limit per database query
     */
    ITEMS_PER_RESPONSE: 10,
  },
};
