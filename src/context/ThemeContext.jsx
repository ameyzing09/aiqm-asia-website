import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext(null)

const THEME_MAP = {
  blue: 'blue',
  purple: 'purple',
  dark: 'dark',
  green: 'green',
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('blue')
  const [darkMode, setDarkMode] = useState(false)

  // Apply theme to document - defined before useEffect that uses it
  const applyTheme = (newTheme, isDark) => {
    const root = document.documentElement
    root.setAttribute('data-theme', THEME_MAP[newTheme])
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'blue'
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setTheme(savedTheme)
    setDarkMode(savedDarkMode)
    applyTheme(savedTheme, savedDarkMode)
  }, [])

  const changeTheme = newTheme => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme, darkMode)
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode)
    applyTheme(theme, newDarkMode)
  }

  const value = {
    theme,
    darkMode,
    changeTheme,
    toggleDarkMode,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
