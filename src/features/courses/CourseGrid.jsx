import { ALL_COURSES } from '../../constants/coursesData'
import { DetailedCourseCard } from './DetailedCourseCard'

export function CourseGrid() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8">
          {ALL_COURSES.map((course) => (
            <div key={course.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]">
              <DetailedCourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
