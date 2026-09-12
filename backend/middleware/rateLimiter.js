const rateLimit = require('express-rate-limit')

// This limiter is deliberately scoped to authentication endpoints
// only — login/registration are the specific brute-force/spam risk
// this application has (unlimited password guesses, unlimited account
// creation). Normal authenticated transaction/settings requests don't
// share that risk profile (they already require a valid JWT, which
// itself is the real gate), so they are NOT limited by this.
//
// 10 attempts per 15 minutes is generous enough that a real user
// mistyping their password a few times in a row will never notice
// it, while still making automated credential-guessing impractically
// slow.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  // Sent as the JSON body when the limit is exceeded — matches the
  // existing { message } error shape every other backend response
  // already uses, so the frontend's existing ApiError handling
  // (V6.3) surfaces this correctly with zero frontend changes needed.
  message: { message: 'Too many attempts. Please try again later.' },
  // Standard headers (RateLimit-*) instead of the older, non-standard
  // X-RateLimit-* headers — this is the current recommended default
  // for express-rate-limit and requires no extra configuration.
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = authLimiter