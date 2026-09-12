const mongoose = require('mongoose')

// Budgets reuse the SAME category vocabulary transactions already
// use (minus 'Income', which is never a budgetable expense category)
// — this avoids introducing a second, parallel category concept.
const BUDGET_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Health']

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: {
      values: BUDGET_CATEGORIES,
      message: '{VALUE} is not a valid budget category',
    },
  },
  limit: {
    type: Number,
    required: true,
    min: [0.01, 'Limit must be greater than 0'],
  },
})

// A compound unique index — not unique:true on a single field — since
// uniqueness here means "one budget per category, PER USER," not
// "category must be globally unique." Two different users can each
// have a "Food" budget; the same user cannot have two.
budgetSchema.index({ user: 1, category: 1 }, { unique: true })

const Budget = mongoose.model('Budget', budgetSchema)

module.exports = Budget