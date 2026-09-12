// Pure validation logic — no React, no JSX, no DOM. Same convention
// as transactionValidation.js and budgetValidation.js: takes plain
// form data, returns a plain errors object. This is the third form in
// the app to follow this pattern (Register previously kept its
// validation inline in the component instead) — extracted here so
// all three forms are consistent, and because the new password-length
// and email-format checks needed somewhere to live anyway.
//
// The backend remains the authoritative validator in every case (see
// authController.js, User.js) — these checks exist purely to give
// faster feedback than a round trip to the server would.

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/
const MIN_PASSWORD_LENGTH = 8

export function validateRegisterForm({ name, email, password, confirmPassword }) {
  const errors = {}

  if (!name.trim()) {
    errors.name = 'Name is required.'
  }

  const trimmedEmail = email.trim()
  if (!trimmedEmail) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }

  if (password && confirmPassword && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

export function validateLoginForm({ email, password }) {
  const errors = {}

  if (!email.trim()) {
    errors.email = 'Email is required.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  }

  return errors
}