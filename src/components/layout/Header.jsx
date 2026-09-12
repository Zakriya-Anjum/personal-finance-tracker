import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function Header({ onOpenMobileNav }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // isNewUser arrives as one-time React Router navigation state, set
  // only by Register.jsx's post-registration navigate('/') call — it
  // is NOT persisted anywhere (no backend field, no localStorage, no
  // AuthContext state), so it naturally disappears the moment the
  // user navigates to any other route. That's the correct behavior
  // for a first-visit greeting, not a limitation of the approach.
  const isNewUser = Boolean(location.state?.isNewUser)
  const greeting = isNewUser ? 'Welcome' : 'Welcome back'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 sm:px-6 bg-surface/80 backdrop-blur border-b border-border-strong">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open menu"
        className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-text-muted hover:bg-surface-hover hover:text-text-primary"
      >
        <Menu className="h-6 w-6" strokeWidth={1.75} />
      </button>

      <div className="hidden md:block">
        <h1 className="text-sm font-medium text-text-muted">
          {greeting}, <span className="text-text-primary">{user?.name}</span>
        </h1>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-2 rounded-lg border border-border-strong px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
      >
        <LogOut className="h-4 w-4" strokeWidth={2} />
        Logout
      </button>
    </header>
  )
}

export default Header