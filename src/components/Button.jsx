export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = 'font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all text-center inline-block'

  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-white dark:bg-gray-800 border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700',
    accent: 'bg-accent-600 hover:bg-accent-700 text-white'
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-4 text-lg'
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  if (href) {
    return (
      <a href={href} className={combinedClassName} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={combinedClassName} {...props}>
      {children}
    </button>
  )
}
