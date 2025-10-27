import { COURSES } from '../../constants/courses'
import { CourseCard } from './CourseCard'

export function FeaturedCourses() {
  return (
    <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Certification Programs
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Industry-recognized certifications designed to transform your career
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}
