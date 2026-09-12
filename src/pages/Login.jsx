import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import PasswordInput from '../components/ui/PasswordInput'
import { validateLoginForm } from '../utils/authValidation'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Field-level validation (empty checks) plus a separate top-level
  // `error` for what the backend reports (wrong credentials, rate
  // limiting) — same dual-error-state convention as every other form
  // in the app.
  //
  // V6.12 note: this previously also seeded `error` from
  // `location.state?.message`, carrying a message across navigation
  // from a failed post-registration auto-login. That entire failure
  // path no longer exists — registration now establishes a session in
  // one call (see AuthContext.register()), so there is no longer a
  // second sign-in step that could fail independently and need to
  // hand a message forward. Removed rather than left in place unused.
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
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

    const validationErrors = validateLoginForm({ email, password })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600">
            <Wallet className="h-5.5 w-5.5 text-white" strokeWidth={2} />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-text-primary tracking-tight">
            Finance<span className="text-emerald-600 dark:text-emerald-400">Tracker</span>
          </h1>
          <p className="mt-1 text-sm text-text-muted">Sign in to your account</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm dark:shadow-none">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClasses('password')}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.password}</p>}
            </div>

            {error && (
              <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login