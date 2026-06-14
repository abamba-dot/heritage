import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const LETTERS = 'HÉRITAGES'.split('')

export default function LoadingScreen() {
  const [done, setDone] = useState(false)
  const ref = useRef(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ onComplete: () => setDone(true) })

      // [0s–0.3s] Black silence

      // [0.3s] HÉRITAGES letters stagger in (y 60→0, opacity 0→1)
      tl.to('.ls-letter', {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.3,
      })

      // [~1.25s] Gold line draws left→right
      tl.to('.ls-line', {
        width: '100%',
        duration: 0.38,
        ease: 'power2.inOut',
      }, '-=0.05')

      // [~1.6s] Tagline fades in simultaneously
      tl.to('.ls-tagline', {
        opacity: 1,
        duration: 0.28,
        ease: 'power2.out',
      }, '<0.08')

      // [~1.7s] H logo appears above text (scale 0.5→1, opacity 0→1)
      tl.to('.ls-logo', {
        scale: 1,
        opacity: 1,
        duration: 0.52,
        ease: 'back.out(1.4)',
      }, '+=0.08')

      // [~2.3s] White studio flash in
      tl.to('.ls-flash', { opacity: 0.15, duration: 0.11, ease: 'none' }, '+=0.05')
      // White flash out
      tl.to('.ls-flash', { opacity: 0, duration: 0.28, ease: 'power1.in' })

      // [~2.75s] Full screen fade out → unmount
      tl.to(ref.current, { opacity: 0, duration: 0.32, ease: 'power2.in' }, '+=0.04')
    },
    { scope: ref }
  )

  if (done) return null

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0D0D0D]"
    >
      {/* Icône — reveals last (~1.7s) */}
      <div
        className="ls-logo mb-10"
        style={{ opacity: 0, transform: 'scale(0.5)' }}
      >
        <img
          src="/images/icone%20heritage.png"
          alt=""
          aria-hidden="true"
          width={72}
          height={72}
          className="h-[72px] w-[72px] object-contain"
          style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.65))' }}
        />
      </div>

      {/* HÉRITAGES — letters stagger in one by one */}
      <div className="flex select-none" aria-label="HÉRITAGES">
        {LETTERS.map((char, i) => (
          <span
            key={i}
            className="ls-letter inline-block font-block leading-none text-[#F5F0E1]"
            style={{
              fontSize: 'clamp(52px, 10vw, 130px)',
              opacity: 0,
              transform: 'translateY(60px)',
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Gold divider line — draws from 0 to 100% */}
      <div
        className="ls-line mt-5 h-px bg-[#D4AF37]"
        style={{ width: 0 }}
      />

      {/* Tagline */}
      <p
        className="ls-tagline mt-4 font-inter text-[11px] font-light uppercase tracking-[0.45em] text-[#D4AF37]"
        style={{ opacity: 0 }}
      >
        Every City Has A Story
      </p>

      {/* White flash overlay */}
      <div
        className="ls-flash pointer-events-none absolute inset-0 bg-white"
        style={{ opacity: 0 }}
      />
    </div>
  )
}

