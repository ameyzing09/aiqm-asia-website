import { motion } from 'framer-motion'

/**
 * Text input with character counter and validation states
 *
 * Visual states based on percentage of maxLength:
 * - 0-80%:   Normal (border-white/10)
 * - 80-100%: Warning (border-amber-500)
 * - >100%:   Error (border-red-500)
 */
export function ValidatedInput({
  label,
  value = '',
  onChange,
  maxLength,
  placeholder = '',
  required = false,
  type = 'text',
  error,
  className = '',
  wrapperClassName = '', // For grid column control (e.g., 'col-span-8')
}) {
  const strValue = String(value)
  const length = strValue.length
  const percentage = maxLength ? (length / maxLength) * 100 : 0

  // Determine visual state
  const isError = percentage > 100
  const isWarning = percentage > 80 && percentage <= 100

  // Border color based on state
  const borderColor = isError
    ? 'border-red-500'
    : isWarning
    ? 'border-amber-500'
    : 'border-white/10'

  // Counter color based on state
  const counterColor = isError
    ? 'text-red-400'
    : isWarning
    ? 'text-amber-400'
    : 'text-gray-500'

  // Focus ring color
  const focusRing = isError
    ? 'focus:ring-red-500/20 focus:border-red-500'
    : isWarning
    ? 'focus:ring-amber-500/20 focus:border-amber-500'
    : 'focus:ring-primary-500/20 focus:border-primary-500'

  return (
    <div className={wrapperClassName}>
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <motion.div
        animate={isError ? { x: [-2, 2, -2, 2, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 bg-white/5 border ${borderColor} rounded-lg
            text-white placeholder-gray-500
            focus:outline-none focus:ring-1 ${focusRing}
            transition-colors duration-200
          `}
        />
      </motion.div>

      <div className="flex items-center justify-between">
        {/* Error message */}
        {error && (
          <span className="text-xs text-red-400">{error}</span>
        )}
        {!error && <span />}

        {/* Character counter */}
        {maxLength && (
          <span className={`text-xs ${counterColor}`}>
            {length}/{maxLength}
          </span>
        )}
      </div>
    </div>
    </div>
  )
}
