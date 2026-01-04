import { useState } from 'react'

/**
 * Glassmorphic form card container
 * Used to group related form fields in the CMS editors
 */
export function FormCard({
  title,
  description,
  children,
  className = '',
  actions,
}) {
  return (
    <div
      className={`
        backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6
        ${className}
      `}
    >
      {/* Header */}
      {(title || description || actions) && (
        <div className="flex items-start justify-between mb-6">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-gray-400 mt-1">{description}</p>
            )}
          </div>
          {actions && <div className="flex-shrink-0 ml-4">{actions}</div>}
        </div>
      )}

      {/* Content */}
      {children}
    </div>
  )
}

/**
 * Collapsible form card with expand/collapse functionality
 */
export function CollapsibleFormCard({
  title,
  description,
  children,
  className = '',
  defaultOpen = true,
  badge,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className={`
        backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden
        ${className}
      `}
    >
      {/* Header - clickable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-gray-400 mt-1">{description}</p>
            )}
          </div>
          {badge && (
            <span className="px-2 py-1 text-xs font-medium bg-primary-600/20 text-primary-400 rounded-full">
              {badge}
            </span>
          )}
        </div>

        {/* Chevron icon */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content - collapsible */}
      {isOpen && <div className="px-6 pb-6">{children}</div>}
    </div>
  )
}
