const jwt = require('jsonwebtoken')

// This middleware only answers ONE question: "does this request carry
// a valid JWT?" It deliberately does NOT check what that user is
// allowed to do or touch the database — that's authorization, a
// separate concern from authentication, and belongs to a later
// milestone.
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  // Clients are expected to send the token in the standard format:
  // "Authorization: Bearer <token>". The "Bearer" prefix is just a
  // convention indicating the type of credential — literally "whoever
  // bears/holds this token is the authenticated party."
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  // Splitting "Bearer <token>" on the space and taking the second
  // part extracts just the token itself.
  const token = authHeader.split(' ')[1]

  try {
    // jwt.verify() checks the token's signature against JWT_SECRET
    // (confirming it was issued by this server and hasn't been
    // tampered with) and checks that it hasn't expired. If either
    // check fails, it throws — caught below.
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // We trust the token's claim at this point without looking the
    // user up in MongoDB — a valid signature is treated as sufficient
    // proof the user authenticated successfully when the token was
    // issued. Later routes/controllers can use req.userId however
    // they need to.
    req.userId = decoded.userId

    next()
  } catch (error) {
    // A missing/invalid/expired token is a CLIENT problem (bad or
    // absent credentials), not an unexpected server failure — so it's
    // handled directly here with 401, rather than passed to
    // next(error) and the centralized 500 error handler.
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware