import { useTheme } from '../../hooks/useTheme'

const THEMES = [
  { name: 'blue', color: 'bg-blue-600', label: 'Blue Theme' },
  { name: 'purple', color: 'bg-purple-600', label: 'Purple Theme' },
  { name: 'dark', color: 'bg-gray-600', label: 'Dark Theme' },
  { name: 'green', color: 'bg-green-600', label: 'Green Theme' },
]

export function ThemeSwitcher({ className = '' }) {
  const { theme, changeTheme } = useTheme()

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {THEMES.map(({ name, color, label }) => (
        <button
          key={name}
          onClick={() => changeTheme(name)}
          className={`w-6 h-6 rounded-full ${color} border-2 ${
            theme === name ? 'border-white shadow-lg' : 'border-transparent'
          }`}
          title={label}
        />
      ))}
    </div>
  )
}
