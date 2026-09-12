import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { useCurrencyFormatter } from '../../context/SettingsContext'
import { getChartChrome } from '../../utils/chartTheme'

function IncomeExpenseTooltip({ active, payload, chrome, formatCurrency }) {
  if (!active || !payload || payload.length === 0) return null
  const { name, value } = payload[0]
  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-sm"
      style={{ backgroundColor: chrome.tooltipBg, borderColor: chrome.tooltipBorder }}
    >
      <p className="text-xs font-medium" style={{ color: chrome.tooltipText }}>{name}</p>
      <p className="text-xs" style={{ color: chrome.tooltipTextMuted }}>{formatCurrency(value, { decimals: 0 })}</p>
    </div>
  )
}

// Data-series colors (the emerald/rose bars) are unchanged across
// themes — they read clearly on both light and dark surfaces. Only
// the chart CHROME (axis text, tooltip) is theme-aware, via
// getChartChrome(resolvedTheme).
function IncomeExpenseChart({ totalIncome, totalExpenses }) {
  const { resolvedTheme } = useTheme()
  const chrome = getChartChrome(resolvedTheme)
  const formatCurrency = useCurrencyFormatter()

  const data = [
    { name: 'Income', value: totalIncome },
    { name: 'Expenses', value: totalExpenses },
  ]

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={70}
            tick={{ fontSize: 12, fill: chrome.axisText }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<IncomeExpenseTooltip chrome={chrome} formatCurrency={formatCurrency} />} cursor={{ fill: chrome.cursorFill }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
            <Cell fill="#059669" />
            <Cell fill="#f43f5e" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default IncomeExpenseChart