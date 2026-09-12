// Recharts renders to SVG, and props like `fill`/`stroke` on axes,
// grid lines, and tick labels are set as literal presentation
// attributes — CSS custom properties (the index.css token approach
// used everywhere else) aren't a reliable cross-browser way to theme
// those. This module is the one place that translates the resolved
// theme into concrete hex values for chart CHROME specifically.
//
// Deliberately narrow scope: this does NOT touch the data-series
// colors (the emerald/blue/amber/rose/slate/purple palette in
// SpendingByCategoryChart, or the emerald/rose bars in
// IncomeExpenseChart/BudgetVsActualChart) — those already read
// clearly against a dark surface, and changing them isn't necessary
// for readability, so they're left as the existing hardcoded
// constants in each chart file.
export function getChartChrome(resolvedTheme) {
  const isDark = resolvedTheme === 'dark'

  return {
    axisText: isDark ? '#94a3b8' : '#64748b',
    axisTextMuted: isDark ? '#7c8aa0' : '#94a3b8',
    gridLine: isDark ? '#1f2937' : '#f1f5f9',
    tooltipBg: isDark ? '#111827' : '#ffffff',
    tooltipBorder: isDark ? '#1f2937' : '#f3f4f6',
    tooltipText: isDark ? '#cbd5e1' : '#334155',
    tooltipTextMuted: isDark ? '#7c8aa0' : '#94a3b8',
    cursorFill: isDark ? '#1a2333' : '#f8fafc',
  }
}