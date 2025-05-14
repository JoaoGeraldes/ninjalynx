/**
 * Enable or disable features in the app.
 */
export const FEATURE_FLAG = {
  /**
   * Rate limit requests per ip per X amount of time
   */
  useRateLimit: true,
  /**
   * Prevent access to backend API if failed attempts to authenticate exceeds the amount configured on `MAX_ALLOWED_FAILED_ATTEMPTS`
   */
  useMaxAllowedFailedAttempts: true,

  /** Whether to allow or disallow the database import feature */
  allowImportDatabase: false,
};
