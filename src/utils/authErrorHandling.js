// A session is considered invalid the moment any authenticated
// request comes back 401 — the token was valid when it was attached
// to the request, but the server no longer accepts it (expired,
// tampered, or otherwise rejected by authMiddleware). This single
// check is shared across TransactionContext, BudgetContext, and
// SettingsContext, all of which independently make authenticated
// requests (both reads and writes) and all need to react to a 401
// the same way: log out and let ProtectedRoute redirect. Extracted
// here because the surrounding catch/react-to-401 pattern repeats at
// roughly a dozen call sites across those three files — well past
// this codebase's own established convention for when duplication is
// worth pulling into a shared helper (see budgetCalculations.js's
// parseAmount comment, which treats a third consumer as the signal).
export function isSessionExpiredError(error) {
  return error?.status === 401
}