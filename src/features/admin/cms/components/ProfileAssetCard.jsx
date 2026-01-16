import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useStorage } from '../hooks/useStorage'

/**
 * Professional Profile Photo Asset Card
 *
 * Features:
 * - Circular profile photo preview (120x120px)
 * - Drag-and-drop support with dashed border dropzone
 * - Overlay action buttons (Change/Remove)
 * - High-contrast person placeholder SVG
 * - Upload progress with animation
 */
export function ProfileAssetCard({
  value,
  onChange,
  storagePath,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  label,
  size = 'w-32 h-32', // 128px default
  className = '',
  wrapperClassName = '',
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState(null)
  const fileInputRef = useRef(null)
  const { upload, progress, error: uploadError, uploading, reset } = useStorage()

  const error = localError || uploadError

  // Handle file selection
  const handleFile = useCallback(
    async file => {
      setLocalError(null)
      reset()

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setLocalError('Please select an image file')
        return
      }

      // Validate file size
      if (file.size > maxSize) {
        setLocalError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
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
    },
    [storagePath, maxSize, upload, onChange, reset]
  )

  // Drag event handlers
  const handleDragOver = useCallback(e => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(e => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    e => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleInputChange = useCallback(
    e => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    onChange(null)
    setLocalError(null)
    reset()
  }, [onChange, reset])

  return (
    <div className={wrapperClassName}>
      <div className={`space-y-2 ${className}`}>
        {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="inline-block"
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
            <div className={`relative ${size}`}>
              <img
                src={value}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-white/10"
              />
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleClick}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                    title="Change photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-2 bg-red-500/30 hover:bg-red-500/40 text-red-300 rounded-full transition-colors"
                    title="Remove photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* State: Uploading */}
          {uploading && (
            <div
              className={`${size} bg-white/5 border border-white/10 rounded-full flex items-center justify-center`}
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"
                />
                <span className="text-xs text-primary-400">{progress}%</span>
              </div>
            </div>
          )}

          {/* State: Empty / Dropzone */}
          {!value && !uploading && (
            <div
              onClick={handleClick}
              className={`
                ${size} border-2 border-dashed rounded-full cursor-pointer
                flex flex-col items-center justify-center
                transition-colors duration-200
                ${
                  isDragging
                    ? 'border-primary-500 bg-primary-500/10'
                    : error
                      ? 'border-red-500/50 bg-red-500/5'
                      : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                }
              `}
            >
              {/* Person placeholder icon */}
              <svg
                className={`w-10 h-10 ${isDragging ? 'text-primary-400' : 'text-gray-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <p className="text-gray-500 text-xs mt-1">Upload</p>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
