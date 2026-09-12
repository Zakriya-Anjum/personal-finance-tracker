const express = require('express')

// Same controller import as before — this milestone doesn't touch
// controllers at all. Only WHERE the route is defined is changing.
const { getApiStatus } = require('../controllers/indexController')

const router = express.Router()

// This route is grouped here specifically because it's about the
// application's home/status endpoint — that's what "home" means in
// this file's name. As the API grows, routes about transactions will
// live in transactionsRoutes.js, routes about settings in
// settingsRoutes.js, and so on. Each file groups routes by WHAT
// FEATURE they belong to, not just "all routes in one place."
router.get('/', getApiStatus)

module.exports = router