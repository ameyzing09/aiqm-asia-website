import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { useGlobal } from '../../hooks/firebase'

export function CourseCard({ course }) {
  const { data: global } = useGlobal()
  const [showCertificate, setShowCertificate] = useState(false)

  return (
    <>
      <Card className="flex flex-col w-full sm:w-80 lg:w-96">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6">
          <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
              {course.duration}
            </span>
            <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
              {course.level}
            </span>
          </div>
        </div>
        <div className="flex flex-col flex-grow p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{course.description}</p>

          {/* View Sample Certificate Button */}
          {course.sampleCertificateUrl && (
            <button
              onClick={() => setShowCertificate(true)}
              className="mb-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center justify-center gap-2 py-2 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Sample Certificate
            </button>
          )}

          <Button
            href={global?.enquiryLink || '#enroll'}
            target={global?.enquiryLink ? '_blank' : undefined}
            rel={global?.enquiryLink ? 'noopener noreferrer' : undefined}
            variant="accent"
            size="md"
            className="w-full"
          >
            Enroll Now
          </Button>
        </div>
      </Card>

      {/* Certificate Lightbox Modal */}
      <AnimatePresence>
        {showCertificate && course.sampleCertificateUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
            onClick={() => setShowCertificate(false)}
          >
            {/* Mobile-friendly header with close button */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
              <span className="text-white text-sm font-medium truncate pr-4">
                {course.title} - Sample Certificate
              </span>
              <button
                onClick={() => setShowCertificate(false)}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white min-w-[44px] min-h-[44px] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>

            {/* Certificate image - responsive sizing */}
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={course.sampleCertificateUrl}
              alt={`${course.title} Sample Certificate`}
              className="max-w-[95vw] sm:max-w-[85vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            />

            {/* Mobile hint text */}
            <p className="absolute bottom-4 text-white/60 text-sm">Tap anywhere to close</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
