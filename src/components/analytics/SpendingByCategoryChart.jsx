// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

// // A restrained, finance-appropriate palette — emerald first (the
// // app's existing primary accent), followed by muted supporting tones.
// // Deliberately NOT the original six-color Tailwind bar palette:
// // Recharts needs real color values (it sets SVG fill attributes
// // directly), and this is also the moment to tone down the palette per
// // the "no purple as a dominant color, no dashboard-template look"
// // direction — purple appears once, last, as a minor accent only.
// import { useTheme } from '../../context/ThemeContext'
// import { getChartChrome } from '../../utils/chartTheme'

// const CHART_COLORS = ['#059669', '#3b82f6', '#f59e0b', '#f43f5e', '#64748b', '#8b5cf6']

// function formatCurrency(amount) {
//   return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
// }

// // Recharts calls this to render tooltip content — kept small and
// // factual (category, amount, percentage), matching the existing
// // project's "no invented insights" principle. No extra commentary,
// // just the numbers the user is hovering over.
// function CategoryTooltip({ active, payload, chrome }) {
//   if (!active || !payload || payload.length === 0) return null

//   const { category, total, percentage } = payload[0].payload

//   return (
//     <div
//       className="rounded-lg border px-3 py-2 shadow-sm"
//       style={{ backgroundColor: chrome.tooltipBg, borderColor: chrome.tooltipBorder }}
//     >
//       <p className="text-xs font-medium" style={{ color: chrome.tooltipText }}>{category}</p>
//       <p className="text-xs" style={{ color: chrome.tooltipTextMuted }}>
//         {formatCurrency(total)} · {Math.round(percentage)}%
//       </p>
//     </div>
//   )
// }

// // Receives the EXACT shape calculateCategoryBreakdown() already
// // produces — { category, total, percentage }[] — no reshaping needed,
// // which is the point of reusing the existing utility rather than
// // duplicating category-grouping logic here.
// function SpendingByCategoryChart({ categoryBreakdown }) {
//   const { resolvedTheme } = useTheme()
//   const chrome = getChartChrome(resolvedTheme)

//   return (
//     <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
//       {/* ResponsiveContainer measures its parent and resizes the
//           chart to fit — this is what makes the chart correctly
//           responsive on mobile/tablet/desktop without any hardcoded
//           pixel dimensions. A fixed height still has to be given (SVG
//           can't infer height from content the way block-level HTML
//           can), but width is fully fluid. */}
//       <div className="mx-auto h-56 w-56 shrink-0">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={categoryBreakdown}
//               dataKey="total"
//               nameKey="category"
//               innerRadius="65%"
//               outerRadius="100%"
//               paddingAngle={2}
//               // Chart color is one signal among several, not the only
//               // one — every category's name/amount/percentage is also
//               // shown as plain text in the legend list below, so the
//               // chart remains fully understandable even if two colors
//               // are hard to distinguish.
//               stroke="none"
//             >
//               {categoryBreakdown.map((entry, index) => (
//                 <Cell key={entry.category} fill={CHART_COLORS[index % CHART_COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip content={<CategoryTooltip chrome={chrome} />} />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Text legend — this is the accessible, always-visible source
//           of truth for the data. A screen reader, or a user who can't
//           distinguish the chart's colors, gets the complete picture
//           from this list alone, independent of the chart rendering
//           correctly at all. */}
//       <ul className="min-w-0 flex-1 space-y-3">
//         {categoryBreakdown.map((item, index) => (
//           <li key={item.category} className="flex items-center justify-between gap-3 text-sm">
//             <span className="flex min-w-0 items-center gap-2">
//               <span
//                 className="h-2.5 w-2.5 shrink-0 rounded-full"
//                 style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
//                 aria-hidden="true"
//               />
//               <span className="truncate font-medium text-text-secondary">{item.category}</span>
//             </span>
//             <span className="shrink-0 text-text-muted">
//               {formatCurrency(item.total)}{' '}
//               <span className="text-text-subtle">({Math.round(item.percentage)}%)</span>
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default SpendingByCategoryChart









import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { useCurrencyFormatter } from '../../context/SettingsContext'
import { getChartChrome } from '../../utils/chartTheme'

const CHART_COLORS = ['#059669', '#3b82f6', '#f59e0b', '#f43f5e', '#64748b', '#8b5cf6']

function CategoryTooltip({ active, payload, chrome, formatCurrency }) {
  if (!active || !payload || payload.length === 0) return null

  const { category, total, percentage } = payload[0].payload

  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-sm"
      style={{ backgroundColor: chrome.tooltipBg, borderColor: chrome.tooltipBorder }}
    >
      <p className="text-xs font-medium" style={{ color: chrome.tooltipText }}>{category}</p>
      <p className="text-xs" style={{ color: chrome.tooltipTextMuted }}>
        {formatCurrency(total)} · {Math.round(percentage)}%
      </p>
    </div>
  )
}

function SpendingByCategoryChart({ categoryBreakdown }) {
  const { resolvedTheme } = useTheme()
  const chrome = getChartChrome(resolvedTheme)
  const formatCurrency = useCurrencyFormatter()

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="mx-auto h-56 w-56 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryBreakdown}
              dataKey="total"
              nameKey="category"
              innerRadius="65%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
            >
              {categoryBreakdown.map((entry, index) => (
                <Cell key={entry.category} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CategoryTooltip chrome={chrome} formatCurrency={formatCurrency} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="min-w-0 flex-1 space-y-3">
        {categoryBreakdown.map((item, index) => (
          <li key={item.category} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                aria-hidden="true"
              />
              <span className="truncate font-medium text-text-secondary">{item.category}</span>
            </span>
            <span className="shrink-0 text-text-muted">
              {formatCurrency(item.total)}{' '}
              <span className="text-text-subtle">({Math.round(item.percentage)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SpendingByCategoryChart