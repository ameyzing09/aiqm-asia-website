import { useCourses } from '../../hooks/firebase'

// Loading skeleton for mobile comparison card
function ComparisonCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 p-4">
        <div className="h-5 bg-white/30 rounded w-3/4 mb-2" />
        <div className="h-3 bg-white/20 rounded w-1/3" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-4">
        <div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
        <div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-2" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-16" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-14" />
          </div>
        </div>
        <div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-14" />
          </div>
        </div>
        <div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        </div>
        <div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
      </div>
    </div>
  )
}

export function ComparisonCards() {
  const { data: courses, isLoading } = useCourses()

  return (
    <div className="md:hidden space-y-6">
      {isLoading
        ? // Show 5 skeleton cards while loading
          [1, 2, 3, 4, 5].map(i => <ComparisonCardSkeleton key={i} />)
        : courses?.map(course => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4">
                <h3 className="text-lg font-bold text-white">{course.title}</h3>
                <p className="text-primary-100 text-sm mt-1">{course.level}</p>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Duration */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Duration
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.duration}
                  </p>
                </div>

                {/* Mode */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Mode
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {course.mode?.map(mode => (
                      <span
                        key={mode}
                        className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 text-sm rounded-lg"
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Accreditation */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Accreditation
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {course.accreditation?.map(acc => (
                      <span
                        key={acc}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-lg border border-green-200 dark:border-green-800"
                      >
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ideal For */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Ideal For
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{course.idealFor}</p>
                </div>

                {/* Outcome */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Outcome
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{course.outcome}</p>
                </div>
              </div>
            </div>
          ))}
    </div>
  )
}
