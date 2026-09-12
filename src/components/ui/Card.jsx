function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-border bg-surface shadow-sm dark:shadow-none ${className}`}>
      {children}
    </div>
  )
}

export default Card