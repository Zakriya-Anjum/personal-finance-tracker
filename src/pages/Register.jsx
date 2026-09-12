import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import PasswordInput from '../components/ui/PasswordInput'
import { validateRegisterForm } from '../utils/authValidation'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // Field-level validation errors (name/email/password/confirmPassword),
  // same shape and rendering convention already used by
  // AddTransactionModal/AddBudgetModal — distinct from `error` below,
  // which is reserved for what the BACKEND reports (duplicate email,
  // network failure), not what the form itself catches before ever
  // making a request.
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function inputClasses(fieldName) {
    const base =
      'mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-text-secondary bg-surface placeholder:text-text-muted focus:outline-none focus:ring-2'
    return errors[fieldName]
      ? `${base} border-rose-400 dark:border-rose-500/60 focus:border-rose-400 focus:ring-rose-100 dark:focus:ring-rose-500/30`
      : `${base} border-border-strong focus:border-emerald-400 focus:ring-emerald-100 dark:focus:ring-emerald-500/30`
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validateRegisterForm({ name, email, password, confirmPassword })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setError(null)
    setIsSubmitting(true)

    try {
      // V6.12 — register() now establishes the session directly (the
      // backend issues a token on registration itself), so there is
      // no longer a separate follow-up sign-in step that could fail
      // independently of registration succeeding. One call, one
      // outcome.
      await register(name.trim(), email.trim(), password)
      // isNewUser travels as one-time React Router navigation state,
      // not persisted anywhere — Header reads it to show "Welcome"
      // instead of "Welcome back" for this one landing, and it
      // naturally disappears the moment the user navigates elsewhere.
      navigate('/', { state: { isNewUser: true } })
    } catch (registerError) {
      setError(registerError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600">
            <Wallet className="h-5.5 w-5.5 text-white" strokeWidth={2} />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-text-primary tracking-tight">
            Finance<span className="text-emerald-600 dark:text-emerald-400">Tracker</span>
          </h1>
          <p className="mt-1 text-sm text-text-muted">Create your account</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm dark:shadow-none">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClasses('name')}
                placeholder="Your full name"
              />
              {errors.name && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClasses('email')}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClasses('password')}
                placeholder="At least 8 characters"
              />
              {errors.password && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary">
                Confirm Password
              </label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={inputClasses('confirmPassword')}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.confirmPassword}</p>
              )}
            </div>

            {error && (
              <div role="alert" aria-live="polite" className="rounded-lg bg-rose-50 dark:bg-rose-500/10 p-3">
                <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
                  {typeof error === 'string' ? error : error.message}
                </p>
                {typeof error !== 'string' && error.errors && error.errors.length > 0 && (
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-rose-600 dark:text-rose-400">
                    {error.errors.map((message) => (
                      <li key={message}>{message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register