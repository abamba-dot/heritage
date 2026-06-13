import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cities } from '../data/cities'

/**
 * Fixed horizontal city navigation bar.
 *
 * Props:
 *   selectedCityId — string, the currently selected city id (single source of truth)
 *   onSelect       — (cityId: string) => void, called on city button click
 *
 * Visibility: locked to #collections while that section is the active viewport.
 * Active state comes entirely from selectedCityId prop — no internal scroll tracking.
 * The underline indicator uses Framer Motion layoutId to slide between buttons.
 */
export default function CitySelector({ selectedCityId, onSelect }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const section = document.getElementById('collections')
    if (!section) return

    const updateVisibility = () => {
      const rect = section.getBoundingClientRect()
      setVisible(rect.top <= 0 && rect.bottom > 0)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)

    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  const activeCity = cities.find((c) => c.id === selectedCityId) ?? cities[0]
  const accentColor = activeCity.theme.accent

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="city-selector"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-40"
          aria-label="Navigation par ville"
        >
          <div className="flex justify-center border-b border-white/[0.07] bg-[#0D0D0D]/68 backdrop-blur-md">
            {/* Inner row scrolls horizontally on very narrow screens */}
            <div className="flex items-center overflow-x-auto py-3 px-4 scrollbar-none sm:px-8">
              {cities.map((city, i) => {
                const isActive = city.id === selectedCityId

                return (
                  <div key={city.id} className="flex shrink-0 items-center">
                    {i > 0 && (
                      <span
                        className="mx-4 text-[10px] select-none sm:mx-6"
                        style={{ color: 'rgba(255,255,255,0.18)' }}
                        aria-hidden="true"
                      >
                        •
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelect(city.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className="relative py-1 font-cinzel text-[10px] font-bold uppercase
                        tracking-[0.22em] transition-colors duration-300
                        sm:tracking-[0.3em] hover:opacity-90"
                      style={{
                        color: isActive ? accentColor : 'rgba(255,255,255,0.38)',
                      }}
                    >
                      {city.name}

                      {/* Sliding underline — Framer Motion layoutId moves it between buttons */}
                      {isActive && (
                        <motion.span
                          layoutId="city-underline"
                          className="absolute -bottom-0.5 left-0 right-0 h-px"
                          style={{ backgroundColor: accentColor }}
                          transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                        />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
