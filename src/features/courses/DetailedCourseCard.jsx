import { useState } from 'react'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { useGlobal } from '../../hooks/firebase'

export function DetailedCourseCard({ course }) {
  const { data: global } = useGlobal()
  const [showCertificate, setShowCertificate] = useState(false)
  return (
    <Card className="flex flex-col w-full">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-white">{course.title}</h3>
          <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full whitespace-nowrap">
            {course.level}
          </span>
        </div>
        <p className="text-primary-100 text-sm">{course.description}</p>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6 space-y-4">
        {/* Duration & Mode */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-primary-700 dark:text-primary-400">{course.duration}</span>
          </div>
          {course.mode.map((mode) => (
            <span key={mode} className="px-3 py-1.5 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400 text-xs font-medium rounded-lg">
              {mode}
            </span>
          ))}
        </div>

        {/* Accreditation Badges */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-semibold">Accreditation</p>
          <div className="flex flex-wrap gap-2">
            {course.accreditation.map((acc) => (
              <div key={acc} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">{acc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ideal For */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-semibold">Ideal For</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{course.idealFor}</p>
        </div>

        {/* Certification */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-semibold">Certification</p>
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{course.certification}</p>
          {course.sampleCertificateUrl && (
            <button
              onClick={() => setShowCertificate(true)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Sample Certificate
            </button>
          )}
        </div>

        {/* Key Topics */}
        <div className="flex-grow">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-semibold">Key Topics</p>
          <div className="flex flex-wrap gap-1.5">
            {course.topics.slice(0, 4).map((topic) => (
              <span key={topic} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded">
                {topic}
              </span>
            ))}
            {course.topics.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded">
                +{course.topics.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Enroll Button */}
        <Button
          href={global?.enquiryLink || '#enroll'}
          target={global?.enquiryLink ? '_blank' : undefined}
          rel={global?.enquiryLink ? 'noopener noreferrer' : undefined}
          variant="accent"
          size="md"
          className="w-full mt-auto"
        >
          Enroll Now
        </Button>
      </div>

      {/* Certificate Modal */}
      {showCertificate && course.sampleCertificateUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowCertificate(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sample Certificate</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{course.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={course.sampleCertificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Open in new tab"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Certificate Image */}
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img
                src={course.sampleCertificateUrl}
                alt={`${course.title} Sample Certificate`}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
