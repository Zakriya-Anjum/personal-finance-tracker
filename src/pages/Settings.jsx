import { useState, useRef, useEffect } from 'react'
import { User, Mail, DollarSign, Palette, AlertCircle, Check } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import { CURRENCY_OPTIONS } from '../utils/currency'

// V6.11-C — Notifications has been removed from this page entirely.
// It was never backed by real application behavior (nothing in the
// frontend read settings.notifications), so keeping it here would
// have meant promising functionality the app doesn't provide. The
// backend Settings model/controller still define and persist the
// field — that's a deliberate, separate decision (see the
// implementation report), not an oversight; removing a required
// Mongoose schema field is a materially different, riskier change
// than removing a UI control, and nothing here needs it.
//
// Theme and Currency are also no longer rendered through a shared
// generic preferencesDisplay.map() loop. That abstraction existed to
// render several similar rows generically, but Currency already
// needed its own rendering shape (descriptive labels), and with
// Notifications gone there are only two rows left, in two different
// shapes — a "generic renderer" for two dissimilar cases was
// indirection without benefit. Each row is now written explicitly,
// with its own specific description of what it controls.

const THEME_OPTIONS = ['Light', 'Dark', 'System']

const inputClasses =
  'w-full max-w-xs rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-text-secondary focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/30'

function Settings() {
  const { user } = useAuth()
  const { settings, updateSetting, isLoading, error, refetch } = useSettings()

  // savingKey identifies which specific control is actively mid-save
  // (used only for that control's aria-busy). isSaving (derived below)
  // is broader and disables EVERY preference control while ANY save
  // is in flight — this is the fix for a real race condition:
  // updateSetting() builds its payload as { ...settings, [key]: value },
  // reading `settings` from closure at call time. Previously only the
  // specific control being changed was disabled, so a user could
  // change Theme, then change Currency before the first request
  // resolved — the second call would read a stale settings snapshot
  // (without the pending Theme change baked in), and when it resolved
  // it would silently revert Theme back to its old value. Serializing
  // saves at the page level closes that gap without needing to touch
  // SettingsContext, which today has exactly one caller (this page).
  const [savingKey, setSavingKey] = useState(null)
  const [savedKey, setSavedKey] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const savedTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
    }
  }, [])

  const isSaving = savingKey !== null

  async function handleChange(key, value) {
    setSaveError(null)
    setSavedKey(null)
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)

    setSavingKey(key)
    try {
      await updateSetting(key, value)
      setSavedKey(key)
      // Transient — clears on its own after a few seconds, or
      // immediately if the person starts another change first. This
      // is deliberately NOT a toast/notification system: it's a small
      // inline indicator scoped to the row that just changed.
      savedTimeoutRef.current = setTimeout(() => setSavedKey(null), 2500)
    } catch (updateError) {
      setSaveError(updateError.message)
    } finally {
      setSavingKey(null)
    }
  }

  if (isLoading || (!settings && !error)) {
    return (
      <div className="space-y-8">
        <PageHeader title="Settings" description="Manage your account and preferences." />
        <p className="text-sm text-text-muted">Loading your settings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader title="Settings" description="Manage your account and preferences." />
        <Card className="p-6">
          <EmptyState
            icon={AlertCircle}
            title="Couldn't load your settings"
            description={error}
            buttonLabel="Retry"
            onButtonClick={refetch}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Manage your account and preferences." />

      <Card className="p-6">
        <h2 className="text-base font-semibold text-text-primary">Account</h2>
        <p className="mt-1 text-xs text-text-muted">
          Your account identity. Contact support to change these details.
        </p>

        <div className="mt-6 divide-y divide-border">
          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                <User className="h-4.5 w-4.5 text-text-secondary" strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-text-secondary">Name</span>
            </div>
            <span className="inline-flex items-center rounded-lg bg-surface-muted px-3 py-1.5 text-sm font-medium text-text-secondary">
              {user?.name}
            </span>
          </div>

          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                <Mail className="h-4.5 w-4.5 text-text-secondary" strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-text-secondary">Email</span>
            </div>
            <span className="inline-flex items-center rounded-lg bg-surface-muted px-3 py-1.5 text-sm font-medium text-text-secondary">
              {user?.email}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-semibold text-text-primary">Preferences</h2>
        <p className="mt-1 text-xs text-text-muted">Changes are applied immediately.</p>

        {saveError && (
          <div role="alert" aria-live="polite" className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-500/10 p-3">
            <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Failed to save setting: {saveError}</p>
          </div>
        )}

        {/* Visually-hidden live region for screen readers. The visible
            "Saved" checkmark next to each row is purely visual and
            wouldn't be reliably announced on its own — this gives
            assistive tech an explicit, unambiguous confirmation. */}
        <p className="sr-only" role="status" aria-live="polite">
          {savedKey === 'theme' && 'Theme saved.'}
          {savedKey === 'currency' && 'Currency saved.'}
        </p>

        <div className="mt-6 divide-y divide-border">
          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                <Palette className="h-4.5 w-4.5 text-text-secondary" strokeWidth={2} />
              </div>
              <div>
                <label htmlFor="theme" className="text-sm font-medium text-text-secondary">
                  Theme
                </label>
                <p className="text-xs text-text-muted">Choose how the interface looks.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {savedKey === 'theme' && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Saved
                </span>
              )}
              <select
                id="theme"
                value={settings.theme}
                onChange={(event) => handleChange('theme', event.target.value)}
                disabled={isSaving}
                aria-busy={savingKey === 'theme'}
                className={`${inputClasses} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {THEME_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                <DollarSign className="h-4.5 w-4.5 text-text-secondary" strokeWidth={2} />
              </div>
              <div>
                <label htmlFor="currency" className="text-sm font-medium text-text-secondary">
                  Currency
                </label>
                <p className="text-xs text-text-muted">Choose how monetary amounts are displayed throughout the app.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {savedKey === 'currency' && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Saved
                </span>
              )}
              <select
                id="currency"
                value={settings.currency}
                onChange={(event) => handleChange('currency', event.target.value)}
                disabled={isSaving}
                aria-busy={savingKey === 'currency'}
                className={`${inputClasses} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {CURRENCY_OPTIONS.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} — {currency.name} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Settings