import { Card } from '../../components/Card'
import { Button } from '../../components/Button'

export function DetailedCourseCard({ course }) {
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
        <Button href="#enroll" variant="accent" size="md" className="w-full mt-auto">
          Enroll Now
        </Button>
      </div>
    </Card>
  )
}
