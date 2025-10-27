import { NAV_LINKS } from '../../constants/navigation'
import { Button } from '../../components/Button'

export function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
      {NAV_LINKS.map((link) => (
        <a
          key={link.name}
          href={link.href}
          onClick={onClose}
          className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
        >
          {link.name}
        </a>
      ))}
      <Button
        href="#enroll"
        variant="accent"
        size="md"
        onClick={onClose}
        className="w-full mt-4"
      >
        Enroll Now
      </Button>
    </div>
  )
}
