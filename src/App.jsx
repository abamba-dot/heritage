import { useState, useEffect, useCallback } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { cities } from './data/cities'

import Header from './components/Header'
import CitySelector from './components/CitySelector'
import Hero from './components/Hero'
import CitiesSection from './components/CitiesSection'
import Configurator from './components/Configurator'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'

gsap.registerPlugin(ScrollTrigger)

function AppContent() {
  // Single source of truth for the active city — passed down to CitySelector + CitiesSection
  const [selectedCityId, setSelectedCityId] = useState(cities[0].id) // 'abidjan'

  useEffect(() => {
    // Disable Lenis on touch devices — native scroll works better on iOS Safari
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouch) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Store the raf reference so gsap.ticker.remove receives the same function object
    const rafCb = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(rafCb)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(rafCb)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* ── Fixed UI layer (z-50 header, z-40 city selector) ────────────── */}
      <Header />
      <CitySelector selectedCityId={selectedCityId} onSelect={setSelectedCityId} />

      <main>
        {/* Hero — sticky scroll-mask reveal, -mb-100vh exit trick */}
        <Hero />

        {/* Cities — single h-screen section, crossfade on CitySelector click */}
        <CitiesSection selectedCityId={selectedCityId} />

        {/* Configurator — city / style / color / size */}
        <Configurator />
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const handleLoadingDone = useCallback(() => setLoading(false), [])

  return (
    <ThemeProvider>
      <CartProvider>
        {loading && <LoadingScreen onComplete={handleLoadingDone} />}
        <AppContent />
        <CartDrawer />
      </CartProvider>
    </ThemeProvider>
  )
}
