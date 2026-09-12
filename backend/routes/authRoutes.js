const express = require('express')
const { registerUser, loginUser } = require('../controllers/authController')
const authLimiter = require('../middleware/rateLimiter')

const router = express.Router()

// authLimiter runs before each controller, but only on these two
// routes — every other route in the application (transactions,
// settings, and any future authenticated endpoint) is unaffected.
router.post('/register', authLimiter, registerUser)
router.post('/login', authLimiter, loginUser)

module.exports = router