import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function PrixDisplay({ prix, hasPersonalisation }) {
  const numRef = useRef(null)
  const prevRef = useRef(prix)

  useEffect(() => {
    const from = prevRef.current
    const to = prix
    prevRef.current = to
    if (from === to) return
    const start = performance.now()
    const ease = (t) => 1 - (1 - t) ** 3
    const frame = (now) => {
      const p = Math.min((now - start) / 600, 1)
      if (numRef.current) numRef.current.textContent = Math.round(from + (to - from) * ease(p))
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [prix])

  return (
    <div className="py-5">
      <p className="font-inter text-[10px] uppercase tracking-[0.35em] text-[#F5F0E1]/50">
        TOTAL
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span ref={numRef} className="font-cinzel text-[48px] leading-none font-black text-[#D4AF37]">
          {prix}
        </span>
        <span className="font-cinzel text-xl text-[#D4AF37]/70">DH</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={hasPersonalisation ? 'perso' : 'std'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1.5 font-inter text-xs text-[#F5F0E1]/50"
        >
          {hasPersonalisation ? 'T-shirt personnalisé' : 'T-shirt standard'}
        </motion.p>
      </AnimatePresence>
      <AnimatePresence>
        {hasPersonalisation && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3 inline-block border border-[#D4AF37] bg-[#1A1500] px-2.5 py-1 font-inter text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]"
          >
            + PERSONNALISATION
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
