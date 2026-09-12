const Settings = require('../models/Settings')

// Only preference fields can ever be written by a client request.
// "user" is never in this list — ownership always comes from
// req.userId, never from anything in the request body.
const ALLOWED_FIELDS = ['currency', 'theme', 'notifications']

function pickAllowedFields(body) {
  const result = {}
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) {
      result[field] = body[field]
    }
  }
  return result
}

// GET /api/settings — returns the authenticated user's preferences,
// creating a default document the first time this user is ever
// accessed. No User lookup/identity seeding happens anymore — Settings
// no longer has any identity fields to seed.
async function getSettings(req, res, next) {
  try {
    let settings = await Settings.findOne({ user: req.userId })

    if (!settings) {
      settings = await Settings.create({
        user: req.userId,
        currency: 'USD',
        theme: 'Light',
        notifications: 'Enabled',
      })
    }

    res.json(settings)
  } catch (error) {
    next(error)
  }
}

// PUT /api/settings — updates the authenticated user's preferences.
// Ownership comes from req.userId. Only whitelisted preference fields
// are ever written, regardless of what else the client sends.
async function updateSettings(req, res, next) {
  try {
    const updateData = pickAllowedFields(req.body)

    const updatedSettings = await Settings.findOneAndUpdate(
      { user: req.userId },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedSettings) {
      return res.status(404).json({ message: 'Settings not found' })
    }

    res.json(updatedSettings)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationMessages = Object.values(error.errors).map(
        (fieldError) => fieldError.message
      )

      return res.status(400).json({
        message: 'Invalid settings data',
        errors: validationMessages,
      })
    }

    next(error)
  }
}

module.exports = { getSettings, updateSettings }