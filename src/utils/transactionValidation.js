// Pure validation logic — no React, no JSX, no DOM. Takes plain data,
// returns a plain object. This means it can be unit-tested on its own
// and reused by any future form (e.g. an "Edit Transaction" form) without
// depending on AddTransactionModal at all.

export function validateTransactionForm(formData) {
  const errors = {}

  const title = formData.title.trim()
  if (!title) {
    errors.title = 'Title is required.'
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.'
  }

  // Number(''), Number(' ') and Number('abc') all matter here:
  // Number('') is 0 (not NaN), so we check for an empty string first,
  // then fall back to isNaN for genuinely non-numeric input.
  const amount = formData.amount.trim()
  if (!amount) {
    errors.amount = 'Amount is required.'
  } else if (isNaN(Number(amount))) {
    errors.amount = 'Amount must be a valid number.'
  } else if (Number(amount) <= 0) {
    errors.amount = 'Amount must be greater than zero.'
  }

  if (!formData.category) {
    errors.category = 'Category is required.'
  }

  if (!formData.date) {
    errors.date = 'Date is required.'
  }

  return errors
}