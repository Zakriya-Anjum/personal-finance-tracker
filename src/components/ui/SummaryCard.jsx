import Card from '../ui/Card'

function SummaryCard({ title, value, description, icon: Icon, iconBg, iconColor }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-muted">{title}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-4.5 w-4.5 ${iconColor}`} strokeWidth={2} />
        </div>
      </div>
      <p className="mt-4 text-2xl font-semibold text-text-primary tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-text-muted">{description}</p>
    </Card>
  )
}

export default SummaryCard