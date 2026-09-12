// Express recognizes this as ERROR-HANDLING middleware specifically
// because it has FOUR parameters: (err, req, res, next). Regular
// middleware only takes (req, res, next) — three parameters. Express
// inspects the function's arity (parameter count) to decide which
// bucket a middleware function belongs to, so this exact signature
// isn't optional style, it's how Express identifies error handlers.
function errorHandler(err, req, res, next) {
  // Logging server-side gives us the full picture (stack trace,
  // exact message) for debugging, without exposing any of that to
  // whoever sent the request.
  console.error(err)

  // The client only gets a safe, generic message. Leaking internal
  // details (stack traces, database error text, file paths) could
  // expose implementation details useful to an attacker, and isn't
  // meaningful to a legitimate client anyway.
  res.status(500).json({ message: 'Internal server error' })
}

module.exports = errorHandler