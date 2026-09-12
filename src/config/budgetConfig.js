import { Utensils, Car, ShoppingBag, Clapperboard, Zap, HeartPulse } from 'lucide-react'

// Each iconBg now carries its own dark: variant directly in the string.
// This is deliberate: these are literal Tailwind class strings that
// get interpolated into a className at render time, so Tailwind's
// build-time scanner needs to see the FULL class name (including any
// dark: variant) as a literal somewhere in source — it can't be
// composed generically at the consuming component. Keeping the pairing
// here means there's exactly one place each category's color pairing
// is defined, light and dark together.
export const budgetConfig = [
  { icon: Utensils, iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', iconColor: 'text-emerald-600 dark:text-emerald-400', category: 'Food', limit: 500 },
  { icon: Car, iconBg: 'bg-blue-50 dark:bg-blue-500/10', iconColor: 'text-blue-600 dark:text-blue-400', category: 'Transport', limit: 200 },
  { icon: ShoppingBag, iconBg: 'bg-rose-50 dark:bg-rose-500/10', iconColor: 'text-rose-500 dark:text-rose-400', category: 'Shopping', limit: 350 },
  { icon: Clapperboard, iconBg: 'bg-purple-50 dark:bg-purple-500/10', iconColor: 'text-purple-600 dark:text-purple-400', category: 'Entertainment', limit: 150 },
  { icon: Zap, iconBg: 'bg-amber-50 dark:bg-amber-500/10', iconColor: 'text-amber-600 dark:text-amber-400', category: 'Utilities', limit: 250 },
  { icon: HeartPulse, iconBg: 'bg-slate-100 dark:bg-slate-500/10', iconColor: 'text-slate-600 dark:text-slate-400', category: 'Health', limit: 150 },
]

// V6.13 — the single source of truth for spending category NAMES.
// AddBudgetModal.jsx and AddTransactionModal.jsx previously each
// hardcoded their own copy of this exact list (AddTransactionModal's
// with 'Income' appended, since income isn't a budgetable expense
// category) — nothing enforced the two ever staying in sync. Both now
// derive from this one array instead of restating it, so budgetConfig
// above remains the only place a category's name, icon, and color are
// actually defined; this is purely a derived view of it, not a new
// parallel list to maintain.
export const BUDGET_CATEGORIES = budgetConfig.map((config) => config.category)