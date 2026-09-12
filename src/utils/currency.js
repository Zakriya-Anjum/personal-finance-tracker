// Pure currency formatting — no React, no Context, no JSX. Same rule
// every other file in utils/ already follows. CURRENCY_OPTIONS is the
// single source of truth for which currencies this app supports and
// how each one displays; formatCurrency() is the single place that
// turns a raw number into the string every component renders.

export const CURRENCY_OPTIONS = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
]

const DEFAULT_CURRENCY_CODE = 'USD'

// The symbol comes from OUR OWN curated config, not from Intl's
// locale-currency database — deliberately. Intl.NumberFormat's
// currency-symbol resolution is tied to (locale, currency) together,
// and under 'en-US' a less common currency like PKR often falls back
// to printing the literal ISO code ("PKR 500.00") instead of a glyph
// ("₨500.00"), with real inconsistency across browsers. Controlling
// the symbol ourselves guarantees a predictable result everywhere.
//
// Intl.NumberFormat IS still used, but only for what it's reliable
// for: digit grouping and decimal handling. The locale is
// deliberately fixed to 'en-US' regardless of which currency is
// selected — this keeps every currency's numbers visually consistent
// with the rest of the app's existing style (comma thousands, period
// decimal) rather than having the whole app's numeric presentation
// shift depending on which currency happens to be selected. This is a
// display-preference app, not a localization system.
export function formatCurrency(amount, currencyCode = DEFAULT_CURRENCY_CODE, { decimals = 2 } = {}) {
  const currency =
    CURRENCY_OPTIONS.find((option) => option.code === currencyCode) ||
    CURRENCY_OPTIONS.find((option) => option.code === DEFAULT_CURRENCY_CODE)

  const numericAmount = Number(amount) || 0
  const isNegative = numericAmount < 0

  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(numericAmount))

  // Sign goes BEFORE the symbol ("-$120.00"), not between symbol and
  // digits ("$-120.00") — the latter is what naive `$${amount}`
  // string-building produces for negative numbers, and it reads as a
  // typo rather than a negative value.
  return `${isNegative ? '-' : ''}${currency.symbol}${formattedNumber}`
}