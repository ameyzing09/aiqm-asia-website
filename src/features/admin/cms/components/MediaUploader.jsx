import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useStorage } from '../hooks/useStorage'

/**
 * Media uploader component with drag-and-drop support
 *
 * Features:
 * - Drag-and-drop zone with glassmorphic styling
 * - Click to select file
 * - Pulsing progress bar during upload
 * - Preview current image (if exists)
 * - Returns downloadURL to parent via onUpload callback
 */
export function MediaUploader({
  value,
  onUpload,
  storagePath,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  label,
  className = '',
  compact = false, // For small avatar/profile photo uploads
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
    if (file.size > maxSize) {
      setLocalError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    try {
      // Generate unique filename
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const path = `${storagePath}/${timestamp}.${extension}`

      const url = await upload(file, path)
      onUpload(url)
    } catch (err) {
      // Error is handled by useStorage hook
      console.error('Upload failed:', err)
    }
  }, [storagePath, maxSize, upload, onUpload, reset])

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

  // Click to browse handler
  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleInputChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  // Remove image handler
  const handleRemove = useCallback(() => {
    onUpload(null)
    setLocalError(null)
    reset()
  }, [onUpload, reset])

  return (
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
        onClick={!value && !uploading ? handleClick : undefined}
        className={`
          relative rounded-xl overflow-hidden transition-all duration-200
          ${!value && !uploading ? 'cursor-pointer' : ''}
          ${isDragging ? 'ring-2 ring-primary-500' : ''}
        `}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        {/* State: Has image preview */}
        {value && !uploading && (
          <div className={`relative ${compact ? 'w-20 h-20' : 'aspect-video'}`}>
            <img
              src={value}
              alt="Preview"
              className={`w-full h-full object-cover ${compact ? 'rounded-full' : 'rounded-xl'}`}
            />
            {/* Overlay with actions */}
            <div className={`absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center ${compact ? 'rounded-full' : 'rounded-xl'}`}>
              {compact ? (
                <button
                  type="button"
                  onClick={handleClick}
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                  title="Change image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClick}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* State: Uploading */}
        {uploading && (
          compact ? (
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="aspect-video bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center p-6">
              <div className="w-full max-w-xs mb-4">
                {/* Progress bar background */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  {/* Animated progress bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary-500 rounded-full"
                  />
                </div>
              </div>
              {/* Pulsing percentage */}
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-sm text-primary-400 font-medium"
              >
                Uploading... {progress}%
              </motion.span>
            </div>
          )
        )}

        {/* State: Empty / Drop zone */}
        {!value && !uploading && (
          compact ? (
            <div
              className={`
                w-20 h-20 border-2 border-dashed rounded-full
                flex flex-col items-center justify-center
                transition-colors duration-200
                ${isDragging
                  ? 'border-primary-500 bg-primary-500/10'
                  : error
                  ? 'border-red-500/50 bg-red-500/5'
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                }
              `}
            >
              <svg
                className={`w-6 h-6 ${isDragging ? 'text-primary-400' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          ) : (
            <div
              className={`
                aspect-video border-2 border-dashed rounded-xl
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
              {/* Upload icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                isDragging ? 'bg-primary-500/20' : 'bg-white/10'
              }`}>
                <svg
                  className={`w-6 h-6 ${isDragging ? 'text-primary-400' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Instructions */}
              <p className="text-gray-300 text-sm font-medium mb-1">
                {isDragging ? 'Drop image here' : 'Drop image or click to browse'}
              </p>
              <p className="text-gray-500 text-xs">
                PNG, JPG, WebP up to {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          )
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
  )
}
