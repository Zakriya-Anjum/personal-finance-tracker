const mongoose = require('mongoose')

// A Schema is a BLUEPRINT — it describes the SHAPE that every
// Transaction document should have (what fields exist, what type each
// one is, and whether it's required), but it doesn't store any data
// itself and doesn't touch MongoDB at all yet. Think of it like a
// form template: it defines what fields a form has, but filling out
// the template doesn't happen until someone actually creates a
// document later.
const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    // trim removes leading/trailing whitespace automatically before
    // saving — so "  Groceries  " becomes "Groceries".
    trim: true,
    // A custom validator function. Mongoose calls it with the
    // value AFTER trim has already run, so a title of "   " becomes
    // "" by the time this check sees it — catching whitespace-only
    // titles that `required: true` alone would NOT catch (required
    // only rejects missing/undefined/null, not empty strings).
    validate: {
      validator: function (value) {
        return value.length > 0
      },
      message: 'Title cannot be empty',
    },
  },
  amount: {
    type: Number,
    required: true,
    // min gives us both a numeric floor AND a validation error if
    // violated. We use a small positive number as the boundary
    // rather than 0 itself, since amounts must be greater than zero,
    // not merely non-negative.
    min: [0.01, 'Amount must be greater than 0'],
  },
  type: {
    type: String,
    required: true,
    // enum restricts this field to an exact whitelist of allowed
    // values. Anything outside this list — "Income" (wrong case),
    // "food", "transfer" — fails validation automatically, without
    // us writing any custom logic.
    enum: {
      values: ['income', 'expense'],
      message: '{VALUE} is not a valid transaction type',
    },
  },
  category: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return value.length > 0
      },
      message: 'Category cannot be empty',
    },
  },
  // The date the transaction actually occurred, as chosen by the user
  // in the frontend form — NOT when the document was saved to the
  // database. Using Mongoose's real Date type (rather than storing it
  // as a String) means MongoDB understands it as an actual date: it
  // can be compared, sorted, and range-queried correctly if needed
  // later, instead of relying on string comparison tricks.
  date: {
    type: Date,
    required: true,
  },
  // Ownership: this stores the _id of the User who owns this
  // transaction, not a copy of their name/email — just a reference.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

// mongoose.model() takes our Schema (the blueprint) and turns it into
// a MODEL — an actual usable tool with methods like .find(), .create(),
// .updateOne(), etc., that know how to talk to MongoDB using this
// specific shape. The Schema alone can't DO anything with the
// database; the Model is what gives us that capability.
const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction