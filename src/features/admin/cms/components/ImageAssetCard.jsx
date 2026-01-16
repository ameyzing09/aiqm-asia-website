import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useStorage } from '../hooks/useStorage'

/**
 * Professional Image Asset Card with overlay actions
 *
 * Features:
 * - Configurable aspect ratio (aspect-video, aspect-square, aspect-[4/3], etc.)
 * - Drag-and-drop support with dashed border dropzone
 * - Overlay action buttons (Change/Remove)
 * - High-contrast placeholder SVG
 * - Upload progress with animation
 */
export function ImageAssetCard({
  value,
  onChange,
  storagePath,
  accept = 'image/*',
  maxSizeBytes = 5 * 1024 * 1024, // 5MB default
  label,
  aspectRatio = 'aspect-video',
  maxWidth = 'max-w-sm',
  placeholderIcon,
  className = '',
  wrapperClassName = '',
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState(null)
  const fileInputRef = useRef(null)
  const { upload, progress, error: uploadError, uploading, reset } = useStorage()

  const error = localError || uploadError

  // Handle file selection
  const handleFile = useCallback(async (file) => {
    setLocalError(null)
    reset()

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setLocalError('Please select an image file')
      return
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      setLocalError(`File size must be less than ${Math.round(maxSizeBytes / 1024 / 1024)}MB`)
      return
    }

    try {
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const path = `${storagePath}/${timestamp}.${extension}`

      const url = await upload(file, path)
      onChange(url)
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }, [storagePath, maxSizeBytes, upload, onChange, reset])

  // Drag event handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleInputChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleRemove = useCallback(() => {
    onChange(null)
    setLocalError(null)
    reset()
  }, [onChange, reset])

  return (
    <div className={wrapperClassName}>
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative ${maxWidth}`}
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />

          {/* State: Has image */}
          {value && !uploading && (
            <div className={`relative ${aspectRatio} rounded-xl overflow-hidden border border-white/10`}>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClick}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-4 py-2 bg-red-500/30 hover:bg-red-500/40 text-red-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* State: Uploading */}
          {uploading && (
            <div className={`${aspectRatio} bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center p-6`}>
              <div className="w-full max-w-xs mb-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary-500 rounded-full"
                  />
                </div>
              </div>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-sm text-primary-400 font-medium"
              >
                Uploading... {progress}%
              </motion.span>
            </div>
          )}

          {/* State: Empty / Dropzone */}
          {!value && !uploading && (
            <div
              onClick={handleClick}
              className={`
                ${aspectRatio} border-2 border-dashed rounded-xl cursor-pointer
                flex flex-col items-center justify-center p-6
                transition-colors duration-200
                ${isDragging
                  ? 'border-primary-500 bg-primary-500/10'
                  : error
                  ? 'border-red-500/50 bg-red-500/5'
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                }
              `}
            >
              {/* Placeholder icon */}
              <div className={`mb-3 ${isDragging ? 'text-primary-400' : 'text-gray-500'}`}>
                {placeholderIcon || (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              {/* Instructions */}
              <p className="text-gray-400 text-sm font-medium mb-1">
                {isDragging ? 'Drop image here' : 'Drop image or click to browse'}
              </p>
              <p className="text-gray-500 text-xs">
                PNG, JPG, WebP up to {Math.round(maxSizeBytes / 1024 / 1024)}MB
              </p>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
