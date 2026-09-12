const express = require('express')
const { getSettings, updateSettings } = require('../controllers/settingsController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Both routes require authentication — settings are always scoped to
// a specific user, so there is no meaningful "public" settings
// request. authMiddleware runs first, verifies the JWT, and sets
// req.userId before either controller function ever runs.
router.get('/', authMiddleware, getSettings)
router.put('/', authMiddleware, updateSettings)

module.exports = router