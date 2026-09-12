import { createContext, useContext, useState, useEffect, useLayoutEffect, useMemo } from 'react'
import { useSettings } from './SettingsContext'

// ThemeContext does NOT own any persisted state of its own. The one
// and only source of truth for the user's THEME PREFERENCE remains
// settings.theme, owned entirely by SettingsContext (backend-persisted,
// per-user, exactly like currency/notifications). This context's job
// is narrower: read that preference, resolve it against the OS
// scheme when needed, and apply the result to the DOM. If this
// context held its own copy of the preference, there would be two
// places that could disagree about what the user's theme is — this
// design deliberately avoids that.
const ThemeContext = createContext(undefined)

function getSystemPrefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Pure resolution: (user preference, current OS scheme) -> 'light' | 'dark'.
// This is the ONE place that distinction is computed, so every
// consumer (the DOM class toggle below, and any component that reads
// useTheme() directly, like the chart components) agrees on the result.
function resolveTheme(preference, systemPrefersDark) {
  if (preference === 'Dark') return 'dark'
  if (preference === 'Light') return 'light'
  return systemPrefersDark ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const { settings } = useSettings()

  // While settings are still loading, or nobody is authenticated,
  // settings is null — there is no known user preference at that
  // moment. 'System' is used as the neutral, non-user-specific
  // default in that gap. Critically, this is NOT a cache of any
  // previous user's choice: it's recomputed from `settings` on every
  // render, so it can never carry User A's preference into User B's
  // session — the moment `settings` becomes null (logout) or becomes
  // User B's real settings (login), this value updates accordingly.
  const themePreference = settings?.theme ?? 'System'

  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemPrefersDark)

  // The OS-change listener is only ever attached while the user has
  // actually chosen 'System' — for an explicit Light/Dark choice, OS
  // changes are irrelevant and no listener exists, so there's nothing
  // to clean up incorrectly either.
  useEffect(() => {
    if (themePreference !== 'System') return
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function handleChange(event) {
      setSystemPrefersDark(event.matches)
    }

    // Re-sync immediately on entering System mode, in case the OS
    // scheme changed while a different preference was active.
    setSystemPrefersDark(mediaQuery.matches)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themePreference])

  const resolvedTheme = useMemo(
    () => resolveTheme(themePreference, systemPrefersDark),
    [themePreference, systemPrefersDark]
  )

  // useLayoutEffect (not useEffect) runs before the browser paints,
  // which is what actually prevents a visible flash on THIS render —
  // by the time pixels are committed, the correct class is already
  // in place. There is deliberately no localStorage-based hint here:
  // the brief window while auth/settings are still loading resolves
  // to 'System' (computed synchronously above, no flash within that
  // state), and once the real settings arrive this effect re-applies
  // synchronously. A cross-session hint was considered and rejected —
  // see the implementation report for why.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  return (
    <ThemeContext.Provider value={{ themePreference, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}