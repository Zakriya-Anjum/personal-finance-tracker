// A controller's ONLY job is answering "what should happen when this
// route is triggered?" It doesn't know or care which URL or HTTP
// method led here — that's the router's responsibility, not this
// file's. This keeps the two concerns cleanly separated: routing
// (which URL maps to which function) vs. logic (what that function
// actually does).

// This is the exact same code that used to sit directly inside
// router.get('/', ...) — only its LOCATION changed, not its behavior.
function getApiStatus(req, res) {
  res.json({ message: 'Personal Finance Tracker API is running' })
}

module.exports = { getApiStatus }