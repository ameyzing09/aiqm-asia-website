import { useCourses } from '../../hooks/firebase'

const COMPARISON_HEADERS = ['Course', 'Duration', 'Mode', 'Accreditation', 'Ideal For', 'Outcome']

// Loading skeleton row
function TableRowSkeleton() {
  return (
    <tr className="bg-white dark:bg-gray-900 animate-pulse">
      <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </td>
      <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </td>
      <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700">
        <div className="flex gap-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-14" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12" />
        </div>
      </td>
      <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700">
        <div className="flex gap-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12" />
        </div>
      </td>
      <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-56" />
      </td>
    </tr>
  )
}

export function ComparisonTable() {
  const { data: courses, isLoading } = useCourses()

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-primary-600 dark:bg-primary-800">
            {COMPARISON_HEADERS.map(header => (
              <th
                key={header}
                className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-primary-700 dark:border-primary-900 last:border-r-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? // Show 5 skeleton rows while loading
              [1, 2, 3, 4, 5].map(i => <TableRowSkeleton key={i} />)
            : courses?.map((course, index) => (
                <tr
                  key={course.id}
                  className={`${
                    index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                  } hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors`}
                >
                  <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {course.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {course.level}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                    {course.duration}
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {course.mode?.map(mode => (
                        <span
                          key={mode}
                          className="px-2 py-0.5 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 text-xs rounded"
                        >
                          {mode}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {course.accreditation?.map(acc => (
                        <span
                          key={acc}
                          className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded"
                        >
                          {acc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {course.idealFor}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {course.outcome}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}
