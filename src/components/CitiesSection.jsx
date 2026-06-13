import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { cities } from '../data/cities'

const FADE  = { duration: 0.42, ease: 'easeInOut' }
const SLIDE = { duration: 0.32, ease: [0.22, 1, 0.36, 1] }

function hexAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16) || 0
  const g = parseInt(hex.slice(3, 5), 16) || 0
  const b = parseInt(hex.slice(5, 7), 16) || 0
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5
}

export default function CitiesSection({ selectedCityId }) {
  const city   = cities.find((c) => c.id === selectedCityId) ?? cities[0]
  const accent = city.theme.accent
  const text   = city.theme.textOnBg
  const bg     = city.theme.background
  // dark = true → ville sombre (Abidjan, Libreville) : texte clair + overlay sombre
  const dark   = isLight(text)
  const cardBg = dark ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.22)'

  useEffect(() => {
    const sel = cities.find((c) => c.id === selectedCityId) ?? cities[0]
    gsap.set(document.documentElement, {
      '--theme-bg':     sel.theme.background,
      '--theme-accent': sel.theme.accent,
      '--theme-text':   sel.theme.textOnBg,
    })
  }, [selectedCityId])

  return (
    <section id="collections" style={{ backgroundColor: bg }}>

      {/* ═══════════════════════════════════════════════════════
          MOBILE  (< 768 px)

          Stratégie image :
          • Un <img> transparent ("placeholder") avec w-full h-auto
            donne sa hauteur naturelle au conteneur.
          • Les 3 images déco sont absolues dans ce même conteneur
            et crossfadent via opacity.
          • object-contain + object-top → image toujours entière,
            depuis le haut ; fond de ville comble les éventuels espaces.
          • Le fond du wrapper s'anime en couleur (motion.div) pour
            que les barres vides changent doucement entre deux villes.

          Texte : en dessous de l'image, dans le flux du document.
          Section height = hauteur image + hauteur bloc texte.
      ═══════════════════════════════════════════════════════ */}
      <div className="md:hidden">

        <motion.div
          className="relative w-full overflow-hidden"
          animate={{ backgroundColor: bg }}
          transition={FADE}
        >
          {/*
            Placeholder invisible — source = ville active.
            Son h-auto définit la hauteur du wrapper selon le ratio
            réel de l'image mobile (portrait/carré/paysage).
            Les images préchargées (motion.img ci-dessous) évitent
            tout rechargement réseau supplémentaire.
          */}
          <img
            src={city.assets.heroDecorMobile ?? city.assets.heroDecor}
            className="block w-full h-auto object-contain object-top
              opacity-0 pointer-events-none select-none"
            aria-hidden="true"
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />

          {/* Images réelles — absolues, crossfade par Framer Motion */}
          {cities.map((c, i) => {
            const src = c.assets.heroDecorMobile ?? c.assets.heroDecor
            return (
              <motion.img
                key={c.id}
                src={src}
                alt={c.id === selectedCityId ? `Collection ${c.name} — HÉRITAGES` : ''}
                aria-hidden={c.id !== selectedCityId}
                className="absolute inset-0 h-full w-full object-contain object-top"
                animate={{ opacity: c.id === selectedCityId ? 1 : 0 }}
                transition={FADE}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                decoding={i === 0 ? 'sync' : 'async'}
              />
            )
          })}
        </motion.div>

        {/* Bloc texte en dessous — fond plein = couleur ville */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`m-${selectedCityId}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={SLIDE}
            className="relative px-5 pb-10 pt-6"
            style={{ backgroundColor: bg }}
          >
            {/* Trait doré */}
            <div
              className="mb-5 h-px w-10"
              style={{ backgroundColor: hexAlpha(accent, 0.5) }}
            />

            {/* Pays + tagline */}
            <div
              className="border-l-2 px-4 py-3.5"
              style={{
                borderLeftColor: hexAlpha(accent, 0.72),
                backgroundColor: cardBg,
              }}
            >
              <p
                className="font-inter text-[10px] font-semibold uppercase tracking-[0.45em]"
                style={{ color: hexAlpha(text, 0.55) }}
              >
                {city.country}
              </p>
              <p
                className="mt-2 font-inter text-sm italic leading-relaxed"
                style={{ color: hexAlpha(text, 0.88) }}
              >
                "{city.tagline}"
              </p>
            </div>

            {/* CTA pleine largeur */}
            <CTA
              city={city}
              accent={accent}
              className="mt-5 flex w-full items-center justify-center border
                py-4 font-cinzel text-[11px] font-bold uppercase tracking-[0.22em]
                transition-colors duration-300"
            />

            {/* Coordonnées GPS */}
            <p
              className="mt-5 text-right font-mono text-[9px] uppercase tracking-[0.22em]"
              style={{ color: hexAlpha(text, 0.35) }}
            >
              {city.coordinates}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>


      {/* ═══════════════════════════════════════════════════════
          DESKTOP  (≥ 768 px)

          • h-screen stricte.
          • object-cover object-center — image plein écran.
          • Toutes les images montées, crossfade par opacity.
          • Texte en overlay centré-gauche.
      ═══════════════════════════════════════════════════════ */}
      <div className="relative hidden h-screen md:block">

        {cities.map((c, i) => (
          <motion.img
            key={c.id}
            src={c.assets.heroDecor}
            alt={c.id === selectedCityId ? `Collection ${c.name} — HÉRITAGES` : ''}
            aria-hidden={c.id !== selectedCityId}
            className="absolute inset-0 z-0 h-full w-full object-cover object-center"
            animate={{ opacity: c.id === selectedCityId ? 1 : 0 }}
            transition={FADE}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            decoding={i === 0 ? 'sync' : 'async'}
          />
        ))}

        {/* Overlay adapté à la luminosité de la ville */}
        <div
          className="absolute inset-0 z-[1] transition-colors duration-500"
          style={{ backgroundColor: dark ? 'rgba(0,0,0,0.32)' : 'rgba(0,0,0,0.06)' }}
        />
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_110%,rgba(0,0,0,0.6)_0%,transparent_58%)]" />

        {/* Texte en overlay */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`d-${selectedCityId}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={SLIDE}
            className="relative z-10 flex h-full flex-col justify-center
              pt-[80px] px-10 md:px-14 lg:px-24"
          >
            <div className="w-full max-w-[520px]">
              <div
                className="border-l-2 px-5 py-4 backdrop-blur-sm"
                style={{
                  borderLeftColor: hexAlpha(accent, 0.72),
                  backgroundColor: cardBg,
                }}
              >
                <p
                  className="font-inter text-[11px] font-semibold uppercase tracking-[0.45em]"
                  style={{ color: hexAlpha(text, 0.58) }}
                >
                  {city.country}
                </p>
                <p
                  className="mt-2.5 font-inter text-sm italic leading-relaxed tracking-wide md:text-base"
                  style={{ color: hexAlpha(text, 0.9) }}
                >
                  "{city.tagline}"
                </p>
              </div>

              <CTA
                city={city}
                accent={accent}
                className="mt-6 inline-flex items-center justify-center border
                  px-8 py-4 font-cinzel text-[11px] font-bold uppercase tracking-[0.24em]
                  transition-colors duration-300 focus:outline-none
                  focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
              />
            </div>

            <p
              className="absolute bottom-10 right-12 font-mono text-[10px]
                uppercase tracking-[0.28em]"
              style={{ color: hexAlpha(text, 0.38) }}
            >
              {city.coordinates}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function CTA({ city, accent, className }) {
  const handleEnter = (e) => {
    e.currentTarget.style.backgroundColor = accent
    e.currentTarget.style.color = isLight(accent) ? '#0D0D0D' : '#F5F0E1'
  }
  const handleLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent'
    e.currentTarget.style.color = accent
  }
  return (
    <a
      href="#configurateur"
      className={className}
      style={{ borderColor: accent, color: accent }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      Voir la collection {city.name}
    </a>
  )
}
