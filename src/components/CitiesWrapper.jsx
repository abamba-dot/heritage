import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import CitySection from './CitySection'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function CitiesWrapper({ cities }) {
  const wrapperRef = useRef(null)

  useGSAP(
    () => {
      if (!cities.length) return undefined

      const root = document.documentElement

      // Set initial CSS vars to match the first city
      gsap.set(root, {
        '--theme-bg': cities[0].theme.background,
        '--theme-accent': cities[0].theme.accent,
        '--theme-text': cities[0].theme.textOnBg,
      })

      const triggers = cities.map((city, index) => {
        const section = wrapperRef.current?.querySelector(`#${city.id}`)
        const nextCity = cities[index + 1]
        if (!section) return null

        return ScrollTrigger.create({
          trigger: section,
          scroller: wrapperRef.current,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            gsap.to(root, {
              '--theme-bg': city.theme.background,
              '--theme-accent': city.theme.accent,
              '--theme-text': city.theme.textOnBg,
              duration: 0.35,
              overwrite: true,
            })
          },
          onEnterBack: () => {
            gsap.to(root, {
              '--theme-bg': city.theme.background,
              '--theme-accent': city.theme.accent,
              '--theme-text': city.theme.textOnBg,
              duration: 0.35,
              overwrite: true,
            })
          },
          onUpdate: (self) => {
            if (!nextCity) return
            const interpolated = gsap.utils.interpolate(
              city.theme.background,
              nextCity.theme.background,
              self.progress
            )
            gsap.set(root, { '--theme-bg': interpolated })
          },
        })
      })

      ScrollTrigger.refresh()

      return () => {
        triggers.forEach((t) => t?.kill())
      }
    },
    { scope: wrapperRef, dependencies: [cities] }
  )

  return (
    <div
      id="collections"
      ref={wrapperRef}
      // data-lenis-prevent tells Lenis to not intercept wheel events here,
      // routing them to this element's native scroll instead.
      // overscroll-behavior: auto (the default) lets the scroll chain to the
      // window at top/bottom boundaries so the user can reach Hero and Configurator.
      data-lenis-prevent=""
      className="citiesWrapper h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-[var(--theme-bg,#0D0D0D)]"
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'y mandatory',
      }}
    >
      {cities.map((city, index) => (
        <CitySection key={city.id} city={city} index={index} />
      ))}
    </div>
  )
}
