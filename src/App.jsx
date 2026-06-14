import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Configurator from './components/Configurator'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import LoadingScreen from './components/LoadingScreen'

gsap.registerPlugin(ScrollTrigger)

function AppContent() {
  useEffect(() => {
    // Disable Lenis on mobile and touch — native scroll + iOS Safari are more reliable.
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isMobile || isTouch) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

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
      <Header />
      <main>
        <Hero />
        <Configurator />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <LoadingScreen />
      <AppContent />
      <CartDrawer />
    </CartProvider>
  )
}
