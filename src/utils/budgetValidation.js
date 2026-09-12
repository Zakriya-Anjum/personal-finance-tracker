// Pure frontend validation — mirrors transactionValidation.js exactly.
// Backend Schema validation remains authoritative; this only improves
// immediate user feedback.
export function validateBudgetForm(formData) {
  const errors = {}

  if (!formData.category) {
    errors.category = 'Category is required.'
  }

  const limit = formData.limit.trim()
  if (!limit) {
    errors.limit = 'Limit is required.'
  } else if (isNaN(Number(limit))) {
    errors.limit = 'Limit must be a valid number.'
  } else if (Number(limit) <= 0) {
    errors.limit = 'Limit must be greater than zero.'
  }

  return errors
}