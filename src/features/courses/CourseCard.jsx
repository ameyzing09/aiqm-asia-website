import { Card } from '../../components/Card'
import { Button } from '../../components/Button'

export function CourseCard({ course }) {
  return (
    <Card className="flex flex-col w-full sm:w-80 lg:w-96">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
        <div className="flex gap-3">
          <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">{course.duration}</span>
          <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">{course.level}</span>
        </div>
      </div>
      <div className="flex flex-col flex-grow p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">{course.description}</p>
        <Button href="#enroll" variant="accent" size="md" className="w-full">
          Enroll Now
        </Button>
      </div>
    </Card>
  )
}
