import { Navigation } from '../features/navigation/Navigation'
import { Footer } from '../features/footer/Footer'
import { CourseGrid } from '../features/courses/CourseGrid'
import { ComparisonTable } from '../features/courses/ComparisonTable'
import { ComparisonCards } from '../features/courses/ComparisonCards'
import { CTABanner } from '../features/courses/CTABanner'

export function CoursesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Page Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <nav className="flex justify-center mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</a>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="font-medium text-gray-900 dark:text-white">Courses</li>
            </ol>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose from our comprehensive range of Lean Six Sigma certifications designed to elevate your career and transform your organization.
          </p>
        </div>
      </section>

      {/* Course Cards */}
      <CourseGrid />

      {/* Comparison Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Course Comparison
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Compare all our courses at a glance to find the perfect fit for your goals
            </p>
          </div>
          <ComparisonTable />
          <ComparisonCards />
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />

      <Footer />
    </div>
  )
}
