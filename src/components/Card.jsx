export function Card({ children, className = '', hover = true }) {
  const baseStyles = 'bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden'
  const hoverStyles = hover ? 'hover:shadow-2xl transition-all duration-300' : ''

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  )
}
