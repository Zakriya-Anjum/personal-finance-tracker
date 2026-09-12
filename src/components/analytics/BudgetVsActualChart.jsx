import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { useCurrencyFormatter } from '../../context/SettingsContext'
import { getChartChrome } from '../../utils/chartTheme'

function BudgetTooltip({ active, payload, chrome, formatCurrency }) {
  if (!active || !payload || payload.length === 0) return null
  const { category, limit, spent } = payload[0].payload
  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-sm"
      style={{ backgroundColor: chrome.tooltipBg, borderColor: chrome.tooltipBorder }}
    >
      <p className="text-xs font-medium" style={{ color: chrome.tooltipText }}>{category}</p>
      <p className="text-xs" style={{ color: chrome.tooltipTextMuted }}>
        {formatCurrency(spent, { decimals: 0 })} of {formatCurrency(limit, { decimals: 0 })}
      </p>
    </div>
  )
}

function BudgetVsActualChart({ budgetVsActual }) {
  const { resolvedTheme } = useTheme()
  const chrome = getChartChrome(resolvedTheme)
  const formatCurrency = useCurrencyFormatter()

  return (
    <div style={{ height: Math.max(budgetVsActual.length * 44, 120) }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={budgetVsActual} layout="vertical" margin={{ left: 8, right: 16 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="category"
            width={90}
            tick={{ fontSize: 12, fill: chrome.axisText }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<BudgetTooltip chrome={chrome} formatCurrency={formatCurrency} />} cursor={{ fill: chrome.cursorFill }} />
          <Bar dataKey="spent" radius={[0, 6, 6, 0]} barSize={18}>
            {budgetVsActual.map((entry) => (
              <Cell key={entry.category} fill={entry.spent > entry.limit ? '#f43f5e' : '#059669'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BudgetVsActualChart