import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { useCurrencyFormatter } from '../../context/SettingsContext'
import { getChartChrome } from '../../utils/chartTheme'

function TrendTooltip({ active, payload, chrome, formatCurrency }) {
  if (!active || !payload || payload.length === 0) return null
  const { label, total } = payload[0].payload
  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-sm"
      style={{ backgroundColor: chrome.tooltipBg, borderColor: chrome.tooltipBorder }}
    >
      <p className="text-xs font-medium" style={{ color: chrome.tooltipText }}>{label}</p>
      <p className="text-xs" style={{ color: chrome.tooltipTextMuted }}>{formatCurrency(total, { decimals: 0 })}</p>
    </div>
  )
}

function SpendingTrendChart({ data }) {
  const { resolvedTheme } = useTheme()
  const chrome = getChartChrome(resolvedTheme)
  const formatCurrency = useCurrencyFormatter()

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -16, right: 16, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chrome.gridLine} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: chrome.axisTextMuted }} axisLine={false} tickLine={false} />
          {/* NEW in V6.11-B — this axis previously had no tickFormatter
              at all, so it showed bare unformatted numbers ("500",
              "1000") regardless of currency. This is genuinely new
              behavior, not just a hardcode swap. */}
          <YAxis
            tick={{ fontSize: 11, fill: chrome.axisTextMuted }}
            axisLine={false}
            tickLine={false}
            width={56}
            tickFormatter={(value) => formatCurrency(value, { decimals: 0 })}
          />
          <Tooltip content={<TrendTooltip chrome={chrome} formatCurrency={formatCurrency} />} />
          <Line type="monotone" dataKey="total" stroke="#059669" strokeWidth={2} dot={{ r: 3, fill: '#059669' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SpendingTrendChart