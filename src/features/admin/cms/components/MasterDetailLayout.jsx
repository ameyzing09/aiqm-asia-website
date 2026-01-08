import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Master-Detail Layout Component
 *
 * Desktop (lg+): Side-by-side layout
 * - Master list: lg:col-span-4 (scrollable)
 * - Detail panel: lg:col-span-8
 *
 * Mobile (<lg): Toggle view with back button
 * - Shows either list OR detail, not both
 */
export function MasterDetailLayout({
  items = [],
  selectedId,
  onSelect,
  renderListItem,
  renderListItemMeta,
  emptyMessage = 'No items yet',
  emptyIcon,
  addButton,
  children,
  detailTitle,
  className = '',
}) {
  // Mobile view state: 'list' or 'detail'
  const [mobileView, setMobileView] = useState('list')

  // When selection changes, switch to detail view on mobile
  useEffect(() => {
    if (selectedId) {
      setMobileView('detail')
    }
  }, [selectedId])

  // Handle item selection
  const handleSelect = (id) => {
    onSelect(id)
  }

  // Handle back button on mobile
  const handleBack = () => {
    setMobileView('list')
  }

  // Find selected item for mobile header
  const selectedItem = items.find(item => item.id === selectedId)

  return (
    <div className={`grid grid-cols-12 gap-4 lg:gap-6 overflow-hidden w-full max-w-full box-border ${className}`}>
      {/* Master List Panel */}
      <div className={`col-span-12 lg:col-span-4 ${mobileView === 'detail' ? 'hidden lg:block' : 'block'}`}>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-full">
          {/* List Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
            {addButton && (
              <button
                onClick={addButton.onClick}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {addButton.label}
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
            {items.length === 0 ? (
              // Empty State
              <div className="p-8 text-center">
                {emptyIcon || (
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                )}
                <p className="text-gray-500 text-sm">{emptyMessage}</p>
                {addButton && (
                  <button
                    onClick={addButton.onClick}
                    className="mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium"
                  >
                    + {addButton.label}
                  </button>
                )}
              </div>
            ) : (
              // Item List
              <div className="divide-y divide-white/5">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`
                      w-full p-4 text-left transition-colors
                      ${selectedId === item.id
                        ? 'bg-primary-600/20 border-l-2 border-primary-500'
                        : 'hover:bg-white/5 border-l-2 border-transparent'
                      }
                    `}
                  >
                    {renderListItem ? (
                      renderListItem(item, selectedId === item.id)
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className={`font-medium truncate ${selectedId === item.id ? 'text-white' : 'text-gray-300'}`}>
                            {item.title || item.name || 'Untitled'}
                          </p>
                          {renderListItemMeta && (
                            <div className="mt-1">
                              {renderListItemMeta(item)}
                            </div>
                          )}
                        </div>
                        {item.active === false && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-700 text-gray-400 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <div className={`col-span-12 lg:col-span-8 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
        <AnimatePresence mode="wait">
          {selectedId ? (
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Detail Header - Mobile Back Button */}
              <div className="lg:hidden p-4 border-b border-white/10 flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="font-medium text-white truncate">
                  {detailTitle || selectedItem?.title || selectedItem?.name || 'Edit Item'}
                </span>
              </div>

              {/* Detail Content */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          ) : (
            // No Selection State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center hidden lg:block"
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <p className="text-gray-400">Select an item from the list to edit</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
