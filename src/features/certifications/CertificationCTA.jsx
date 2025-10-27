import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'

export function CertificationCTA() {
  return (
    <section id="get-certified" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Main CTA Card */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 rounded-2xl p-8 lg:p-12 shadow-2xl">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-white">Limited Seats Available</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Get Certified?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers with globally recognized certifications from AIQM India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                href="#enroll"
                variant="secondary"
                size="lg"
                className="bg-white hover:bg-gray-100 text-primary-700 border-none shadow-xl"
              >
                Get Certified Today
              </Button>
              <Link to="/courses">
                <Button
                  size="lg"
                  className="bg-accent-600 hover:bg-accent-700 text-white border-2 border-white/30"
                >
                  Browse Courses
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-primary-100 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Next batch starts in 2 weeks
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Flexible payment options
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Lifetime certification
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
            <div className="text-primary-600 dark:text-primary-400 font-bold text-2xl mb-2">
              Free
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Demo Sessions Available
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
            <div className="text-primary-600 dark:text-primary-400 font-bold text-2xl mb-2">
              24/7
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Learning Support Access
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
            <div className="text-primary-600 dark:text-primary-400 font-bold text-2xl mb-2">
              100%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Placement Assistance
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Have questions? Our certification advisors are here to help
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm">
            <a href="tel:+918001234567" className="flex items-center text-primary-600 dark:text-primary-400 hover:underline">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              +91 (800) 123-4567
            </a>
            <a href="mailto:certifications@aiqmindia.com" className="flex items-center text-primary-600 dark:text-primary-400 hover:underline">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              certifications@aiqmindia.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
