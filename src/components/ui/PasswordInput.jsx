import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// A small, focused wrapper around a password <input> — adds a
// show/hide toggle without changing how the field behaves as a form
// control. It owns only its own `showPassword` state; value, onChange,
// and validation all stay exactly where they already lived (in
// Login.jsx / Register.jsx's own state), so this is a pure
// presentational swap-in for a plain <input type="password">, not a
// new layer of data flow.
//
// className is passed straight through to the <input> unchanged (so
// each page keeps its own existing styling untouched) — the extra
// right-side space for the toggle button is added via an inline style
// rather than appending a Tailwind padding utility to that className,
// since appending e.g. "pr-10" alongside an existing "px-3" would
// create two classes both targeting padding-right with no reliable,
// guaranteed winner. An inline style always wins unambiguously.
function PasswordInput({ id, name, value, onChange, autoComplete, placeholder, className = '', ...rest }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        style={{ paddingRight: '2.5rem' }}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted transition-colors hover:bg-surface-hover hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/30"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}

export default PasswordInput