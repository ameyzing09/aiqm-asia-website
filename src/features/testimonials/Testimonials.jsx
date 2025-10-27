import { TESTIMONIALS } from '../../constants/testimonials'
import { useCarousel } from '../../hooks/useCarousel'
import { CarouselControls } from './CarouselControls'

export function Testimonials() {
  const { currentIndex, goToNext, goToPrevious, goToIndex } = useCarousel(TESTIMONIALS.length, 5000)

  const currentTestimonial = TESTIMONIALS[currentIndex]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Students Say
          </h2>
        </div>

        <div className="relative">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 lg:p-12">
            <svg className="w-12 h-12 text-primary-600 dark:text-primary-400 mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-8 italic">
              "{currentTestimonial.quote}"
            </p>
            <div className="flex flex-col items-start">
              <p className="font-semibold text-gray-900 dark:text-white text-lg">
                {currentTestimonial.author}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{currentTestimonial.role}</p>
            </div>
          </div>

          <CarouselControls
            currentIndex={currentIndex}
            totalItems={TESTIMONIALS.length}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onGoToIndex={goToIndex}
          />
        </div>
      </div>
    </section>
  )
}
