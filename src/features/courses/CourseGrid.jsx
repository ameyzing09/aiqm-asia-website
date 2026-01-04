import { useCourses } from '../../hooks/firebase'
import { DetailedCourseCard } from './DetailedCourseCard'

// Loading skeleton for course card
function CourseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* Header gradient skeleton */}
      <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

        {/* Level & Duration badges */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
        </div>

        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-28" />
        </div>
      </div>
    </div>
  )
}

export function CourseGrid() {
  const { data: courses, isLoading } = useCourses()

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8">
          {isLoading ? (
            // Show 5 skeleton cards while loading
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]">
                <CourseCardSkeleton />
              </div>
            ))
          ) : (
            courses?.map((course) => (
              <div key={course.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]">
                <DetailedCourseCard course={course} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
