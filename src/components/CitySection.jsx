import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.14,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function CitySection({ city, index }) {
  const contentRef = useRef(null)
  const isInView = useInView(contentRef, {
    amount: 0.4,
    margin: '-8% 0px -8% 0px',
  })

  const isFirst = index === 0

  return (
    <section
      id={city.id}
      className="relative min-h-screen snap-start snap-always overflow-hidden"
      style={{
        backgroundColor: city.theme.background,
        '--city-accent': city.theme.accent,
        '--city-text': city.theme.textOnBg,
      }}
      data-theme-bg={city.theme.background}
    >
      {/*
        The heroDecor image already contains the city name, code, and "HÉRITAGES" branding
        baked into the photo. No large HTML title is rendered on top of it.
        HTML content is limited to: tagline, GPS coordinates, and CTA.
      */}
      <img
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={city.assets.heroDecor}
        alt={`Collection ${city.name} — HÉRITAGES`}
        loading={isFirst ? 'eager' : 'lazy'}
        fetchPriority={isFirst ? 'high' : 'auto'}
        decoding={isFirst ? 'sync' : 'async'}
      />

      {/* Gradient overlays for text readability */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.08)_60%)]" />

      <div
        ref={contentRef}
        className="relative z-10 flex min-h-screen flex-col justify-end px-5 pb-20 pt-28
          md:justify-center md:px-12 md:pb-16 lg:px-20"
      >
        <div className="max-w-[640px]">

          {/* Country + tagline card */}
          <motion.div
            custom={0}
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="border-l-2 border-[var(--city-accent)]/80 bg-black/20 px-5 py-4
              backdrop-blur-[2px] shadow-[0_20px_80px_rgba(0,0,0,0.3)]"
          >
            <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.45em] text-white/65 md:text-xs">
              {city.country}
            </p>
            <p className="mt-2.5 font-inter text-sm font-medium italic tracking-wide text-white/90 md:text-base">
              "{city.tagline}"
            </p>
          </motion.div>

          {/* CTA */}
          <motion.a
            custom={1}
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            href="#configurateur"
            className="mt-7 inline-flex items-center justify-center border border-[var(--city-accent)]
              px-7 py-4 font-cinzel text-[11px] font-bold uppercase tracking-[0.24em]
              text-[var(--city-accent)] transition-all duration-300
              hover:bg-[var(--city-accent)] hover:text-[#0D0D0D]
              focus:outline-none focus:ring-2 focus:ring-[var(--city-accent)]
              focus:ring-offset-2 focus:ring-offset-black"
          >
            Voir la collection {city.name}
          </motion.a>
        </div>

        {/* GPS coordinates — bottom right */}
        <motion.p
          custom={2}
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="absolute bottom-8 right-5 font-mono text-[10px] uppercase
            tracking-[0.28em] text-white/55 md:bottom-10 md:right-12"
        >
          {city.coordinates}
        </motion.p>
      </div>
    </section>
  )
}
