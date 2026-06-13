import { createContext, useContext, useState, useMemo } from 'react'
import { cities } from '../data/cities'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [currentCity, setCurrentCity] = useState(cities[0])

  const value = useMemo(
    () => ({ currentCity, setCurrentCity }),
    [currentCity]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
