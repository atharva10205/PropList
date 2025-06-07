// A Map to keep track of login attempts for each email
const attemptsMap = new Map();

// Time window for rate limiting (15 minutes in milliseconds)
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

// Maximum number of allowed attempts within the window
const MAX_ATTEMPTS = 5;

/**
 * Checks whether a user is allowed to attempt login based on their email.
 * Blocks login if too many failed attempts occurred in the defined time window.
 */
export function checkLoginAttempts(email) {
  const now = Date.now(); // Current time in ms

  // Get the user's current login attempt record, or initialize if not existing
  const record = attemptsMap.get(email) || {
    attempts: [],          // Timestamps of failed attempts
    blockedUntil: null     // Timestamp until which user is blocked
  };

  // If the user is currently blocked and the block hasn't expired
  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000); // seconds left
    return {
      allowed: false,
      retryAfter,
      message: `Too many attempts. Try again in ${retryAfter} seconds.`,
    };
  }

  // Filter out old attempts outside the rate limit window
  record.attempts = record.attempts.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  const attemptsLeft = MAX_ATTEMPTS - record.attempts.length;

  // If no attempts left, block the user for the entire window
  if (attemptsLeft <= 0) {
    record.blockedUntil = now + RATE_LIMIT_WINDOW_MS;
    attemptsMap.set(email, record);
    return {
      allowed: false,
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
      message: `Too many attempts. Try again in ${Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)} seconds.`,
    };
  }

  // User is allowed to attempt login
  return {
    allowed: true,
    attemptsLeft,
  };
}

/**
 * Records a failed login attempt for the specified email.
 */
export function recordFailedAttempt(email) {
  const now = Date.now();
  const record = attemptsMap.get(email) || {
    attempts: [],
    blockedUntil: null,
  };

  record.attempts.push(now); // Add the current failed timestamp
  attemptsMap.set(email, record); // Update the record in the map
}

/**
 * Clears all login attempts and unblocks the user.
 * Typically used after a successful login.
 */
export function clearLoginAttempts(email) {
  attemptsMap.delete(email); // Remove the record entirely
}
