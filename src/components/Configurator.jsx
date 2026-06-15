import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { useCart } from '../context/CartContext'
import { countries } from '../data/countries'
import { CONFIG } from '../data/config'
import PrixDisplay from './PrixDisplay'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

// ─── Breakpoint hook ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const fn = (e) => setMobile(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return mobile
}

// ─── Animated counter — attaches to a ref'd <span> ───────────────────────────
function useAnimatedCount(target) {
  const ref = useRef(null)
  const prevRef = useRef(target)
  useEffect(() => {
    const from = prevRef.current
    const to = target
    prevRef.current = to
    if (from === to) return
    const start = performance.now()
    const ease = (t) => 1 - (1 - t) ** 3
    const frame = (now) => {
      const p = Math.min((now - start) / 600, 1)
      if (ref.current) ref.current.textContent = Math.round(from + (to - from) * ease(p))
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [target])
  return ref
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Configurator() {
  const { addItem } = useCart()
  const isMobile = useIsMobile()
  const [orderData, setOrderData] = useState(null)

  const handleAddToCart = ({ selectedCountry, size, hasCustomRequest, customRequest }) => {
    const hasPersonalisation = hasCustomRequest
    const price = hasPersonalisation ? CONFIG.prix_personnalise : CONFIG.prix_standard

    addItem(
      {
        title: `HÉRITAGES ${selectedCountry.name}`,
        country: `${selectedCountry.flag} ${selectedCountry.name} +${selectedCountry.code}`,
        city: '',
        style: 'World Cup Series',
        color: 'Collection officielle',
        colorHex: '#D4AF37',
        size,
        price,
        personalizations:
          hasPersonalisation && customRequest.trim() ? [customRequest.trim()] : [],
        image: selectedCountry.image,
        flag: selectedCountry.flag,
        signature: JSON.stringify({ country: selectedCountry.id, size, hasPersonalisation }),
      },
      { openCart: false }
    )

    setOrderData({
      selectedCountry,
      size,
      hasPersonalisation,
      customRequest: customRequest.trim(),
      price,
    })
  }

  const buildWhatsappUrl = (data) => {
    if (!data) return '#'
    const { selectedCountry, size, hasPersonalisation, customRequest } = data
    let msg
    if (hasPersonalisation) {
      msg = `Bonjour, je souhaite commander :\nHÉRITAGES — ${selectedCountry.name} | Taille ${size}\nT-shirt personnalisé — ${CONFIG.prix_personnalise} ${CONFIG.devise}`
      if (customRequest) msg += `\nDemande : ${customRequest}`
    } else {
      msg = `Bonjour, je souhaite commander :\nHÉRITAGES — ${selectedCountry.name} | Taille ${size}\nT-shirt standard — ${CONFIG.prix_standard} ${CONFIG.devise}`
    }
    return `https://wa.me/${CONFIG.whatsapp_number}?text=${encodeURIComponent(msg)}`
  }

  return (
    <>
      <section id="configurateur" className="scroll-mt-16">
        {isMobile ? (
          <MobileWizard onAddToCart={handleAddToCart} />
        ) : (
          <DesktopLayout onAddToCart={handleAddToCart} />
        )}
      </section>

      {/* ── Confirmation modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {orderData && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="w-full max-w-md border border-white/10 bg-[#0D0D0D] p-6 text-[#F5F0E1] shadow-2xl"
            >
              <p className="font-inter text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">
                Commande confirmée
              </p>
              <h3 className="mt-2 font-block text-2xl font-bold">Récapitulatif</h3>

              {/* Country + size */}
              <div className="mt-4 flex items-center gap-3 border-b border-white/10 pb-3">
                <span className="text-xl">{orderData.selectedCountry.flag}</span>
                <span className="font-inter text-sm text-[#F5F0E1]/80">
                  {orderData.selectedCountry.name}
                </span>
                <span className="text-[#F5F0E1]/22">|</span>
                <span className="font-inter text-sm text-[#F5F0E1]/80">Taille {orderData.size}</span>
              </div>

              {/* Pricing lines */}
              <div className="mt-3 space-y-2">
                <div className="flex justify-between font-inter text-sm text-[#F5F0E1]/72">
                  <span>T-shirt standard</span>
                  <span>{CONFIG.prix_standard} {CONFIG.devise}</span>
                </div>
                {orderData.hasPersonalisation && (
                  <div className="flex justify-between font-inter text-sm text-[#D4AF37]/80">
                    <span>+ Personnalisation</span>
                    <span>+ {CONFIG.prix_personnalise - CONFIG.prix_standard} {CONFIG.devise}</span>
                  </div>
                )}
              </div>

              <div className="my-3 border-t border-white/10" />

              {/* Total */}
              <div className="flex items-center justify-between border-l-[3px] border-[#D4AF37] bg-[#1A1500] px-4 py-3">
                <span className="font-cinzel text-sm uppercase tracking-[0.2em] text-[#F5F0E1]">
                  TOTAL
                </span>
                <span className="font-cinzel text-2xl font-black text-[#D4AF37]">
                  {orderData.price} {CONFIG.devise}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-5 grid gap-3">
                <a
                  href={buildWhatsappUrl(orderData)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#D4AF37] py-3 text-center font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#0D0D0D] transition-opacity hover:opacity-90"
                >
                  Commander via WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setOrderData(null)}
                  className="border border-[#D4AF37] py-3 font-cinzel text-xs uppercase tracking-[0.25em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/10"
                >
                  Continuer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MOBILE — Stepper Wizard
// ══════════════════════════════════════════════════════════════════════════════
const STEP_LABELS = ['01 — PAYS', '02 — TAILLE', '03 — PERSONNALISATION']

const stepVariants = {
  enter: (dir) => ({ x: dir > 0 ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({
    x: dir > 0 ? -64 : 64,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  }),
}

function MobileWizard({ onAddToCart }) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [countryId, setCountryId] = useState('')
  const [size, setSize] = useState('')
  const [hasCustomRequest, setHasCustomRequest] = useState(false)
  const [customRequest, setCustomRequest] = useState('')
  const [previewCountry, setPreviewCountry] = useState(null)
  const [pendingStep, setPendingStep] = useState(null)

  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const selectedCountry = useMemo(
    () => countries.find((c) => c.id === countryId) ?? null,
    [countryId]
  )

  const goTo = (n, dir) => { setDirection(dir); setStep(n) }
  const goNext = () => goTo(Math.min(3, step + 1), 1)
  const goPrev = () => goTo(Math.max(1, step - 1), -1)

  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchStartY.current = e.targetTouches[0].clientY
  }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
    if (Math.abs(dx) > 52 && Math.abs(dx) > dy * 1.5) {
      dx > 0 ? goNext() : goPrev()
    }
    touchStartX.current = null
  }

  const handleSubmit = () => {
    if (!selectedCountry || !size) return
    onAddToCart({ selectedCountry, size, hasCustomRequest, customRequest })
    setStep(1)
    setDirection(1)
    setCountryId('')
    setSize('')
    setHasCustomRequest(false)
    setCustomRequest('')
  }

  return (
    <div
      className="relative min-h-screen bg-[#0D0D0D] pt-16 text-[#F5F0E1]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress bar — sticky below header */}
      <div className="sticky top-16 z-40 border-b border-[#1A1A1A] bg-[#0D0D0D] px-5 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-7 shrink-0">
            <AnimatePresence>
              {step > 1 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  type="button"
                  onClick={goPrev}
                  className="flex h-7 w-7 items-center justify-center text-[#F5F0E1]/55 hover:text-[#D4AF37]"
                  aria-label="Étape précédente"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <LayoutGroup id="mob-stepper">
            <div className="flex flex-1 gap-1.5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="relative h-[2px] flex-1 overflow-hidden bg-[#2A2A2A]">
                  {step === n && (
                    <motion.div
                      layoutId="step-active-bar"
                      className="absolute inset-0 bg-[#D4AF37]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {step > n && <div className="absolute inset-0 bg-[#D4AF37]/35" />}
                </div>
              ))}
            </div>
          </LayoutGroup>

          <div className="w-7 shrink-0" />
        </div>
        <p className="mt-2 text-center font-inter text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]">
          {STEP_LABELS[step - 1]}
        </p>
      </div>

      {/* Step content */}
      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {step === 1 && (
              <MobileStep1
                selectedCountryId={countryId}
                onSelectCountry={setPreviewCountry}
              />
            )}
            {step === 2 && (
              <MobileStep2
                selectedCountry={selectedCountry}
                size={size}
                onSelectSize={setSize}
                onBack={goPrev}
                onNext={goNext}
              />
            )}
            {step === 3 && (
              <MobileStep3
                selectedCountry={selectedCountry}
                size={size}
                hasCustomRequest={hasCustomRequest}
                setHasCustomRequest={setHasCustomRequest}
                customRequest={customRequest}
                setCustomRequest={setCustomRequest}
                onSubmit={handleSubmit}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Country preview overlay — slides up from bottom */}
      <AnimatePresence
        onExitComplete={() => {
          if (pendingStep !== null) {
            goTo(pendingStep, 1)
            setPendingStep(null)
          }
        }}
      >
        {previewCountry && (
          <motion.div
            className="fixed inset-0 z-[150] flex flex-col bg-[#0D0D0D]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative min-h-0 flex-1">
              <img
                src={previewCountry.image}
                alt={previewCountry.name}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0D0D0D]" />
            </div>
            <div className="border-t border-[#D4AF37]/25 bg-[#0D0D0D] px-6 py-7">
              <p className="font-inter text-[9px] font-bold uppercase tracking-[0.42em] text-[#D4AF37]">
                World Cup Series
              </p>
              <h2 className="mt-1 font-block text-3xl font-black text-[#F5F0E1]">
                {previewCountry.name.toUpperCase()}
              </h2>
              <p className="mt-1 font-inter text-sm text-[#D4AF37]/72">+{previewCountry.code}</p>
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setCountryId(previewCountry.id)
                    setPendingStep(2)
                    setPreviewCountry(null)
                  }}
                  className="w-full bg-[#D4AF37] py-4 font-cinzel text-sm font-black uppercase tracking-[0.22em] text-[#0D0D0D] active:opacity-80"
                >
                  Confirmer ce pays
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewCountry(null)}
                  className="w-full border border-[#F5F0E1]/20 py-3 font-inter text-xs uppercase tracking-[0.22em] text-[#F5F0E1]/52"
                >
                  Changer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileStep1({ selectedCountryId, onSelectCountry }) {
  return (
    <div className="px-5 pb-10 pt-6">
      <p className="font-inter text-[9px] font-bold uppercase tracking-[0.45em] text-[#D4AF37]/65">
        Étape 1 sur 3
      </p>
      <h2 className="mt-2 font-block text-2xl font-black text-[#F5F0E1]">
        Choisis ton pays
      </h2>
      <p className="mt-1 font-inter text-xs text-[#F5F0E1]/40">
        Appuie sur un pays pour voir le maillot.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {countries.map((country) => {
          const active = selectedCountryId === country.id
          return (
            <button
              key={country.id}
              type="button"
              onClick={() => onSelectCountry(country)}
              className="relative overflow-hidden p-4 text-left active:scale-[0.97]"
              style={{
                border: `1px solid ${active ? '#D4AF37' : '#222'}`,
                backgroundColor: active ? '#1A1500' : '#161616',
              }}
            >
              {active && (
                <motion.div
                  layoutId="m-country-ring"
                  className="absolute inset-0 border border-[#D4AF37]"
                  transition={{ duration: 0.2 }}
                />
              )}
              <span className="relative z-10 block text-3xl leading-none">{country.flag}</span>
              <span
                className="relative z-10 mt-2.5 block font-inter text-[11px] leading-snug"
                style={{ color: active ? '#D4AF37' : 'rgba(245,240,225,0.52)' }}
              >
                {country.name}
              </span>
              {active && (
                <span className="relative z-10 mt-0.5 block font-inter text-[9px] text-[#D4AF37]/55">
                  ✓ sélectionné
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MobileStep2({ selectedCountry, size, onSelectSize, onBack, onNext }) {
  return (
    <div className="px-5 pb-32 pt-6">
      {selectedCountry && (
        <button
          type="button"
          onClick={onBack}
          className="mb-5 flex items-center gap-2 border border-[#D4AF37] bg-[#1A1500] px-3 py-2 active:opacity-70"
        >
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className="font-inter text-xs text-[#D4AF37]">{selectedCountry.name}</span>
          <span className="ml-1 font-inter text-[10px] text-[#D4AF37]/45">modifier ↑</span>
        </button>
      )}
      <p className="font-inter text-[9px] font-bold uppercase tracking-[0.45em] text-[#D4AF37]/65">
        Étape 2 sur 3
      </p>
      <h2 className="mt-2 font-block text-2xl font-black text-[#F5F0E1]">
        Choisis ta taille
      </h2>
      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {SIZES.map((s) => {
          const active = size === s
          return (
            <button
              key={s}
              type="button"
              onClick={() => onSelectSize(s)}
              className="min-h-[64px] font-cinzel text-base font-bold active:scale-95"
              style={{
                border: `1px solid ${active ? '#D4AF37' : '#222'}`,
                color: active ? '#D4AF37' : 'rgba(245,240,225,0.5)',
                backgroundColor: active ? '#1A1500' : 'transparent',
              }}
            >
              {s}
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {size && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-[#1A1A1A] bg-[#0D0D0D] p-4"
          >
            <button
              type="button"
              onClick={onNext}
              className="flex w-full items-center justify-center gap-2 bg-[#D4AF37] py-4 font-cinzel text-sm font-black uppercase tracking-[0.25em] text-[#0D0D0D] active:opacity-85"
            >
              Suivant
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileStep3({
  selectedCountry, size,
  hasCustomRequest, setHasCustomRequest,
  customRequest, setCustomRequest,
  onSubmit,
}) {
  const prix = hasCustomRequest ? CONFIG.prix_personnalise : CONFIG.prix_standard
  const mobilePriceRef = useRef(null)
  const prevPrixRef = useRef(prix)
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipTimer = useRef(null)

  useEffect(() => {
    const from = prevPrixRef.current
    const to = prix
    prevPrixRef.current = to
    if (from === to) return
    const start = performance.now()
    const ease = (t) => 1 - (1 - t) ** 3
    const frame = (now) => {
      const p = Math.min((now - start) / 600, 1)
      if (mobilePriceRef.current) {
        mobilePriceRef.current.textContent = Math.round(from + (to - from) * ease(p))
      }
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [prix])

  useEffect(() => {
    if (hasCustomRequest) {
      clearTimeout(tooltipTimer.current)
      setShowTooltip(true)
      tooltipTimer.current = setTimeout(() => setShowTooltip(false), 2500)
    } else {
      setShowTooltip(false)
      clearTimeout(tooltipTimer.current)
    }
    return () => clearTimeout(tooltipTimer.current)
  }, [hasCustomRequest])

  return (
    <div className="px-5 pb-32 pt-6">
      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 border border-[#D4AF37]/30 bg-[#1A1A1A] px-3 py-2.5">
        {selectedCountry && (
          <span className="font-inter text-sm text-[#F5F0E1]/80">
            {selectedCountry.flag} {selectedCountry.name}
          </span>
        )}
        <span className="text-[#F5F0E1]/22">|</span>
        <span className="font-inter text-sm text-[#F5F0E1]/80">Taille {size}</span>
      </div>

      <p className="font-inter text-[9px] font-bold uppercase tracking-[0.45em] text-[#D4AF37]/65">
        Étape 3 sur 3
      </p>
      <h2 className="mt-2 font-block text-2xl font-black text-[#F5F0E1]">
        Personnalisation
      </h2>

      <div className="mt-5 space-y-3">
        <label className="flex cursor-pointer gap-3 border border-[#222] bg-[#161616] p-4">
          <input
            type="checkbox"
            checked={hasCustomRequest}
            onChange={(e) => setHasCustomRequest(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#D4AF37]"
          />
          <span>
            <span className="block font-inter text-sm font-semibold text-[#F5F0E1]">
              Ajouter une demande spéciale
            </span>
            <span className="mt-1 block font-inter text-xs leading-relaxed text-[#F5F0E1]/38">
              Nom, numéro, broderie, packaging ou autre.
            </span>
          </span>
        </label>

        <AnimatePresence initial={false}>
          {hasCustomRequest && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <textarea
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                rows={3}
                placeholder="ex: Nom ATLAS, numéro 10, broderie dorée..."
                className="w-full resize-none border border-[#D4AF37]/22 bg-[#111] px-4 py-3 font-inter text-sm text-[#F5F0E1] outline-none placeholder:text-[#D4AF37]/28 focus:border-[#D4AF37]/55"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 border-l-[3px] border-[#D4AF37] bg-[#1A1A1A] px-4 py-3">
        <p className="mb-2 font-inter text-[9px] font-bold uppercase tracking-[0.38em] text-[#D4AF37]/50">
          Récapitulatif
        </p>
        {selectedCountry && (
          <p className="font-inter text-sm text-[#F5F0E1]/75">
            {selectedCountry.flag} HÉRITAGES {selectedCountry.name}
          </p>
        )}
        <p className="font-inter text-sm text-[#F5F0E1]/75">Taille {size}</p>
        {hasCustomRequest && customRequest.trim() && (
          <p className="mt-1.5 font-inter text-xs italic text-[#D4AF37]/65">
            « {customRequest.trim()} »
          </p>
        )}
      </div>

      {/* Fixed bottom bar — prix + bouton */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center border-t border-[#D4AF37]/30 bg-[#0D0D0D]">
        <div className="relative pl-5 pr-4 py-3">
          <AnimatePresence>
            {showTooltip && (
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-full left-4 mb-2 whitespace-nowrap rounded border border-[#D4AF37] bg-[#1A1500] px-2.5 py-1 font-inter text-[11px] text-[#F5F0E1]"
              >
                Personnalisation incluse ✦
              </motion.span>
            )}
          </AnimatePresence>
          <span className="font-cinzel text-[22px] font-black text-[#D4AF37]">
            <span ref={mobilePriceRef}>{prix}</span> {CONFIG.devise}
          </span>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          className="m-2 flex flex-1 items-center justify-center gap-3 bg-[#D4AF37] py-3.5 font-cinzel text-sm font-black uppercase tracking-[0.22em] text-[#0D0D0D] active:opacity-85"
        >
          <IconCart />
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// DESKTOP — Two-column sticky layout
// ══════════════════════════════════════════════════════════════════════════════
function DesktopLayout({ onAddToCart }) {
  const [countryId, setCountryId] = useState('')
  const [size, setSize] = useState('')
  const [hasCustomRequest, setHasCustomRequest] = useState(false)
  const [customRequest, setCustomRequest] = useState('')
  const [errors, setErrors] = useState({ country: false, size: false })

  const countryGridRef = useRef(null)
  const sizeRowRef = useRef(null)

  const selectedCountry = useMemo(
    () => countries.find((c) => c.id === countryId) ?? null,
    [countryId]
  )

  const prix = hasCustomRequest ? CONFIG.prix_personnalise : CONFIG.prix_standard
  const recapPriceRef = useAnimatedCount(prix)

  const shake = (el) => {
    if (!el) return
    gsap.killTweensOf(el)
    gsap.timeline()
      .to(el, { x: -8, duration: 0.07, ease: 'power2.out' })
      .to(el, { x: 8, duration: 0.06 })
      .to(el, { x: -6, duration: 0.06 })
      .to(el, { x: 5, duration: 0.06 })
      .to(el, { x: 0, duration: 0.05, ease: 'power2.out' })
  }

  const handleAddToCart = () => {
    const next = { country: !countryId, size: !size }
    setErrors(next)
    if (next.country) shake(countryGridRef.current)
    if (next.size) shake(sizeRowRef.current)
    if (next.country || next.size) return
    onAddToCart({ selectedCountry, size, hasCustomRequest, customRequest })
    setCountryId('')
    setSize('')
    setHasCustomRequest(false)
    setCustomRequest('')
    setErrors({ country: false, size: false })
  }

  return (
    <div className="bg-[#0D0D0D] text-[#F5F0E1] lg:grid lg:grid-cols-[55%_45%]">

      {/* LEFT — sticky image */}
      <div className="relative">
        <div className="relative h-[45vh] overflow-hidden bg-[#0D0D0D] lg:sticky lg:top-0 lg:h-screen lg:overflow-visible">
          <AnimatePresence mode="wait">
            {selectedCountry ? (
              <motion.div
                key={selectedCountry.id}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={selectedCountry.image}
                  alt={selectedCountry.name}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10">
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.3 }}
                    className="font-inter text-[9px] font-bold uppercase tracking-[0.45em] text-[#D4AF37]"
                  >
                    World Cup Series
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26, duration: 0.32 }}
                    className="font-block text-2xl font-black text-[#F5F0E1] lg:text-4xl"
                  >
                    {selectedCountry.name.toUpperCase()}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.36 }}
                    className="mt-1 font-inter text-sm text-[#D4AF37]/75"
                  >
                    +{selectedCountry.code}
                  </motion.p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="flex h-full flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span
                  className="select-none font-cinzel font-black leading-none text-[#D4AF37]"
                  style={{ fontSize: 'clamp(100px, 18vw, 220px)', opacity: 0.06 }}
                >
                  H
                </span>
                <p className="mt-4 font-inter text-[10px] uppercase tracking-[0.4em] text-[#F5F0E1]/32">
                  Sélectionne ton pays
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="relative bg-[#0F0F0F] px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(30,77,43,0.2),transparent_55%)]" />
        <div className="relative mx-auto max-w-[480px]">
          <p className="font-inter text-[9px] font-bold uppercase tracking-[0.55em] text-[#D4AF37]">
            Configurateur
          </p>
          <h2 className="mt-3 font-block text-[clamp(26px,3.5vw,48px)] font-black leading-tight text-[#F5F0E1]">
            Personnalise<br />ton t-shirt
          </h2>
          <p className="mt-3 font-inter text-sm text-[#F5F0E1]/48">
            Crée une pièce unique à ton image.
          </p>
          <div className="mt-6 h-px bg-[#D4AF37]/22" />

          <div className="mt-10 space-y-12">

            <ConfigStep label="01 — Pays">
              <div ref={countryGridRef} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {countries.map((country) => {
                  const active = countryId === country.id
                  return (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => {
                        setCountryId(country.id)
                        setErrors((e) => ({ ...e, country: false }))
                      }}
                      className="relative overflow-hidden p-3 text-left transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none"
                      style={{
                        border: `1px solid ${active ? '#D4AF37' : errors.country ? '#D46A37' : '#222'}`,
                        backgroundColor: active ? '#1A1500' : '#161616',
                      }}
                    >
                      {active && (
                        <motion.div
                          layoutId="d-country-ring"
                          className="absolute inset-0 border border-[#D4AF37]"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      <span className="relative z-10 block text-2xl leading-none">{country.flag}</span>
                      <span
                        className="relative z-10 mt-2 block font-inter text-[10px] leading-snug"
                        style={{ color: active ? '#D4AF37' : 'rgba(245,240,225,0.52)' }}
                      >
                        {country.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </ConfigStep>

            <ConfigStep label="02 — Taille">
              <div ref={sizeRowRef} className="flex flex-wrap gap-2">
                {SIZES.map((s) => {
                  const active = size === s
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSize(s)
                        setErrors((e) => ({ ...e, size: false }))
                      }}
                      className="h-12 min-w-[3rem] flex-1 font-cinzel text-sm font-bold transition-all duration-200 focus:outline-none"
                      style={{
                        border: `1px solid ${active ? '#D4AF37' : errors.size ? '#D46A37' : '#222'}`,
                        color: active ? '#D4AF37' : 'rgba(245,240,225,0.48)',
                        backgroundColor: active ? '#1A1500' : 'transparent',
                      }}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </ConfigStep>

            <ConfigStep label="03 — Personnalisation">
              <label className="flex cursor-pointer gap-3 border border-[#222] bg-[#161616] p-4 transition-colors hover:border-[#2E2E2E]">
                <input
                  type="checkbox"
                  checked={hasCustomRequest}
                  onChange={(e) => setHasCustomRequest(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#D4AF37]"
                />
                <span>
                  <span className="block font-inter text-sm font-semibold text-[#F5F0E1]">
                    Ajouter une demande spéciale
                  </span>
                  <span className="mt-1 block font-inter text-xs leading-relaxed text-[#F5F0E1]/40">
                    Nom, numéro, phrase, broderie, placement, packaging ou toute autre idée.
                  </span>
                </span>
              </label>
              <AnimatePresence initial={false}>
                {hasCustomRequest && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <textarea
                      value={customRequest}
                      onChange={(e) => setCustomRequest(e.target.value)}
                      rows={4}
                      placeholder="ex: Nom ATLAS au dos, numéro 10, broderie dorée sur la manche..."
                      className="mt-3 w-full resize-none border border-[#D4AF37]/22 bg-[#111] px-4 py-3.5 font-inter text-sm text-[#F5F0E1] outline-none transition-colors placeholder:text-[#D4AF37]/28 focus:border-[#D4AF37]/52"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </ConfigStep>

            {/* Live recap */}
            <div className="border-l-[3px] border-[#D4AF37] bg-[#1A1A1A] px-4 py-3">
              <p className="mb-1.5 font-inter text-[9px] font-bold uppercase tracking-[0.38em] text-[#D4AF37]/52">
                Récapitulatif
              </p>
              <p className="font-inter text-sm text-[#F5F0E1]/72">
                <span style={{ color: selectedCountry ? undefined : 'rgba(245,240,225,0.2)' }}>
                  {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : '—'}
                </span>
                <span className="mx-2" style={{ color: 'rgba(245,240,225,0.18)' }}>·</span>
                <span style={{ color: size ? undefined : 'rgba(245,240,225,0.2)' }}>
                  {size ? `Taille ${size}` : '—'}
                </span>
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-inter text-[9px] font-bold uppercase tracking-[0.38em] text-[#D4AF37]/55">
                  TOTAL
                </span>
                <span className="font-inter text-sm font-bold text-[#D4AF37]">
                  <span ref={recapPriceRef}>{prix}</span> {CONFIG.devise}
                </span>
              </div>
            </div>

            {/* Prix display — entre récap et CTA */}
            <PrixDisplay prix={prix} hasPersonalisation={hasCustomRequest} />

            <AnimatePresence>
              {(errors.country || errors.size) && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="-mt-8 font-inter text-xs text-[#D46A37]"
                >
                  Merci de sélectionner un pays et une taille.
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-3 bg-[#D4AF37] py-5 font-cinzel text-sm font-black uppercase tracking-[0.22em] text-[#0D0D0D] transition-all duration-200 hover:bg-[#E8C84A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0D0D0D]"
            >
              <IconCart />
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Shared ───────────────────────────────────────────────────────────────────
function ConfigStep({ label, children }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      <p className="font-inter text-[9px] font-bold uppercase tracking-[0.45em] text-[#D4AF37]">
        {label}
      </p>
      {children}
    </motion.div>
  )
}

function IconCart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
