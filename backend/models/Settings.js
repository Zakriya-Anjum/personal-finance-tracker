const mongoose = require('mongoose')

// Settings now represents PREFERENCES ONLY. Account identity (name,
// email) belongs to User — that's the single source of truth for who
// someone is. Settings should never maintain its own independent copy
// of identity data; doing so risks two different values existing for
// "the user's name" with no way to know which one is real.
const settingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  currency: {
    type: String,
    required: true,
    enum: {
      values: ['USD', 'PKR', 'EUR', 'GBP'],
      message: '{VALUE} is not a supported currency',
    },
  },
  theme: {
    type: String,
    required: true,
    enum: {
      values: ['Light', 'Dark', 'System'],
      message: '{VALUE} is not a supported theme',
    },
  },
  notifications: {
    type: String,
    required: true,
    enum: {
      values: ['Enabled', 'Disabled'],
      message: '{VALUE} is not a valid notifications value',
    },
  },
})

const Settings = mongoose.model('Settings', settingsSchema)

module.exports = Settings