import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Transactions', path: '/transactions' },
  { name: 'Budgets', path: '/budgets' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Settings', path: '/settings' },
]

function Sidebar({ isMobileNavOpen, onCloseMobileNav }) {
  return (
    <>
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 dark:bg-black/60 md:hidden"
          onClick={onCloseMobileNav}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-surface border-r border-border-strong
          transition-transform duration-200 ease-in-out
          ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:flex
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <span className="text-lg font-semibold text-text-primary tracking-tight">
            Finance<span className="text-emerald-600 dark:text-emerald-400">Tracker</span>
          </span>
          <button
            type="button"
            onClick={onCloseMobileNav}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-hover hover:text-text-primary md:hidden"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onCloseMobileNav}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar