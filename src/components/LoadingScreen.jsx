import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const TITLE = 'HÉRITAGES'
const RADIALS = 22

export default function LoadingScreen({ onComplete }) {
  const rootRef        = useRef(null)
  const lettersRef     = useRef([])
  const taglineRef     = useRef(null)
  const subRef         = useRef(null)
  const fillRef        = useRef(null)
  const counterRef     = useRef(null)
  const radialRefs     = useRef([])
  const wave1Ref       = useRef(null)
  const wave2Ref       = useRef(null)
  const shimmerRef     = useRef(null)
  const lineTRef       = useRef(null)
  const lineBRef       = useRef(null)
  const progressWrapRef = useRef(null)
  const cityRefs       = useRef([])
  const bgGlowRef      = useRef(null)

  useEffect(() => {
    const W = window.innerWidth
    const H = window.innerHeight

    // Each letter starts at a unique off-screen position + rotation + scale
    const SCATTER = [
      { x: -W * 0.52, y: -H * 0.24, r: -20, s: 2.4 }, // H
      { x:  W * 0.30, y: -H * 0.50, r:  13, s: 1.9 }, // É
      { x:  W * 0.64, y: -H * 0.16, r:  -8, s: 2.1 }, // R
      { x:  W * 0.47, y:  H * 0.38, r:  16, s: 1.7 }, // I
      { x: -W * 0.06, y:  H * 0.52, r: -10, s: 2.2 }, // T
      { x: -W * 0.52, y:  H * 0.32, r:  19, s: 2.0 }, // A
      { x: -W * 0.67, y:  H * 0.10, r: -14, s: 2.4 }, // G
      { x:  W * 0.20, y: -H * 0.44, r:   9, s: 1.8 }, // E
      { x:  W * 0.57, y: -H * 0.32, r: -11, s: 2.1 }, // S
    ]

    const ctx = gsap.context(() => {

      // ── Radial lines: rotations set via GSAP to avoid transform conflicts
      radialRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { rotation: (i / RADIALS) * 360, scaleX: 0 })
      })

      // ── Scattered letters
      lettersRef.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, {
          x: SCATTER[i].x, y: SCATTER[i].y,
          rotation: SCATTER[i].r, scale: SCATTER[i].s,
          opacity: 0,
        })
      })

      gsap.set([lineTRef.current, lineBRef.current], { scaleX: 0, transformOrigin: 'center' })
      gsap.set([taglineRef.current, subRef.current], { opacity: 0, y: 12 })
      gsap.set(progressWrapRef.current, { opacity: 0 })
      gsap.set(fillRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(cityRefs.current, { opacity: 0 })
      gsap.set(shimmerRef.current, { x: -300 })
      gsap.set([wave1Ref.current, wave2Ref.current], { opacity: 0 })

      const counter = { val: 0 }
      const tl = gsap.timeline()

      // ── PHASE 1 · Gold radial explosion (0 → 0.75s)
      tl.to(radialRefs.current, {
        scaleX: 1, duration: 0.72,
        stagger: { each: 0.018, from: 'random' },
        ease: 'expo.out',
      }, 0)

      // Letters flash visible while scattered
      tl.to(lettersRef.current, {
        opacity: 1, duration: 0.06,
        stagger: { each: 0.022, from: 'random' },
      }, 0.14)

      // ── PHASE 2 · Letters converge from all directions (0.32 → 1.28s)
      tl.to(lettersRef.current, {
        x: 0, y: 0, rotation: 0, scale: 1,
        duration: 0.88,
        stagger: { each: 0.038, from: 'center' },
        ease: 'power4.out',
      }, 0.32)

      // ── PHASE 3 · Shockwave rings on lock (1.28s)
      tl.fromTo(wave1Ref.current,
        { scale: 0.15, opacity: 0.85 },
        { scale: 15, opacity: 0, duration: 1.5, ease: 'expo.out' },
        1.26
      )
      tl.fromTo(wave2Ref.current,
        { scale: 0.15, opacity: 0.5 },
        { scale: 11, opacity: 0, duration: 1.8, ease: 'expo.out' },
        1.44
      )

      // Background glow pulse at impact
      tl.fromTo(bgGlowRef.current,
        { opacity: 0.06 },
        { opacity: 0.28, duration: 0.22, ease: 'power2.in', yoyo: true, repeat: 1 },
        1.28
      )

      // ── PHASE 4 · Decorative rules + shimmer (1.4s)
      tl.to(lineTRef.current, { scaleX: 1, duration: 0.55, ease: 'power2.inOut' }, 1.4)
      tl.to(lineBRef.current, { scaleX: 1, duration: 0.55, ease: 'power2.inOut' }, 1.52)

      tl.to(shimmerRef.current, {
        x: W + 100, duration: 0.82, ease: 'power2.inOut',
      }, 1.64)

      // ── PHASE 5 · Tagline + city names (2.0s)
      tl.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 2.04)
      tl.to(subRef.current,     { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 2.18)
      tl.to(cityRefs.current,   { opacity: 1, duration: 0.42, stagger: 0.12 }, 2.12)

      // ── PHASE 6 · Progress bar (2.22 → 3.22s)
      tl.to(progressWrapRef.current, { opacity: 1, duration: 0.3 }, 2.18)
      tl.to(fillRef.current, { scaleX: 1, duration: 1.0, ease: 'power1.inOut' }, 2.24)
      tl.to(counter, {
        val: 100, duration: 1.0, ease: 'power1.inOut',
        onUpdate() {
          if (counterRef.current)
            counterRef.current.textContent = String(Math.round(counter.val)).padStart(3, '0')
        },
      }, 2.24)

      // Radials fade out as loading completes
      tl.to(radialRefs.current, { opacity: 0, duration: 0.6, ease: 'power1.in' }, 2.55)

      // ── PHASE 7 · Iris cinematic close (3.32 → 4.12s)
      tl.to(rootRef.current, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.8, ease: 'power2.in',
        onComplete: onComplete ?? (() => {}),
      }, 3.32)

    }, rootRef)

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: '#0D0D0D',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        clipPath: 'circle(150% at 50% 50%)',
        willChange: 'clip-path',
      }}
    >
      {/* Atmospheric radial glow */}
      <div ref={bgGlowRef} style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 52% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)',
      }} />

      {/* Grain texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(245,240,225,0.018) 1px, transparent 1px)',
        backgroundSize: '4px 4px',
      }} />

      {/* ── RADIAL BURST LINES ──────────────────────────────────── */}
      {Array.from({ length: RADIALS }, (_, i) => (
        <div
          key={i}
          ref={el => { radialRefs.current[i] = el }}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: '72vmax',
            height: '1px',
            background: i % 5 === 0
              ? 'linear-gradient(90deg, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0.14) 55%, transparent 100%)'
              : i % 3 === 0
                ? 'linear-gradient(90deg, rgba(212,175,55,0.28) 0%, transparent 70%)'
                : 'linear-gradient(90deg, rgba(212,175,55,0.12) 0%, transparent 55%)',
            transformOrigin: '0 50%',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── SHOCKWAVE RINGS ─────────────────────────────────────── */}
      <div ref={wave1Ref} style={{
        position: 'absolute',
        top: '50%', left: '50%',
        marginLeft: -70, marginTop: -70,
        width: 140, height: 140,
        borderRadius: '50%',
        border: '2px solid rgba(212,175,55,0.75)',
        opacity: 0, pointerEvents: 'none',
      }} />
      <div ref={wave2Ref} style={{
        position: 'absolute',
        top: '50%', left: '50%',
        marginLeft: -70, marginTop: -70,
        width: 140, height: 140,
        borderRadius: '50%',
        border: '1px solid rgba(212,175,55,0.38)',
        opacity: 0, pointerEvents: 'none',
      }} />

      {/* ── GOLD SHIMMER (sweeps across the title) ──────────────── */}
      <div ref={shimmerRef} style={{
        position: 'absolute',
        top: 'calc(50% - 120px)',
        left: 0,
        width: '160px', height: '240px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.1) 28%, rgba(255,224,80,0.55) 50%, rgba(212,175,55,0.1) 72%, transparent 100%)',
        pointerEvents: 'none', zIndex: 4,
      }} />

      {/* ── CENTER STAGE ────────────────────────────────────────── */}
      <div style={{
        textAlign: 'center', width: '100%',
        padding: '0 4rem', position: 'relative', zIndex: 2,
      }}>

        {/* Top gold rule */}
        <div ref={lineTRef} style={{
          width: '100%', maxWidth: '590px', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.45) 18%, #D4AF37 50%, rgba(212,175,55,0.45) 82%, transparent)',
          margin: '0 auto 2.5rem',
        }} />

        {/* H É R I T A G E S — letters fly in from scattered positions */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          {TITLE.split('').map((char, i) => (
            <span
              key={i}
              ref={el => { lettersRef.current[i] = el }}
              style={{
                display: 'block',
                fontFamily: '"Cinzel", "Cinzel Decorative", serif',
                fontSize: 'clamp(2.2rem, 9vw, 7.6rem)',
                fontWeight: 700,
                color: '#F5F0E1',
                lineHeight: 1,
                letterSpacing: '0.09em',
                willChange: 'transform, opacity',
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <p ref={taglineRef} style={{
          marginTop: '1.6rem',
          color: '#D4AF37',
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(0.5rem, 1.3vw, 0.72rem)',
          fontWeight: 400,
          letterSpacing: '0.56em',
          textTransform: 'uppercase',
          opacity: 0,
        }}>
          Every City Has a Story
        </p>

        <p ref={subRef} style={{
          marginTop: '0.5rem',
          color: 'rgba(245,240,225,0.28)',
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(0.42rem, 1vw, 0.56rem)',
          fontWeight: 300,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          opacity: 0,
        }}>
          World Cup Series · 2030
        </p>

        {/* Bottom gold rule */}
        <div ref={lineBRef} style={{
          width: '100%', maxWidth: '590px', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.45) 18%, #D4AF37 50%, rgba(212,175,55,0.45) 82%, transparent)',
          margin: '2.5rem auto 0',
        }} />
      </div>

      {/* City names — left vertical rail */}
      <div style={{
        position: 'absolute', left: '3.5%', top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
        display: 'flex', gap: '2.2rem', whiteSpace: 'nowrap', zIndex: 2,
      }}>
        {['ABIDJAN', 'CASABLANCA', 'LIBREVILLE'].map((city, i) => (
          <span
            key={city}
            ref={el => { cityRefs.current[i] = el }}
            style={{
              color: 'rgba(212,175,55,0.42)',
              fontSize: '0.55rem', letterSpacing: '0.38em',
              fontFamily: 'Inter, sans-serif', fontWeight: 300,
              textTransform: 'uppercase', opacity: 0,
            }}
          >
            {city}
          </span>
        ))}
      </div>

      {/* ── PROGRESS ────────────────────────────────────────────── */}
      <div ref={progressWrapRef} style={{
        position: 'absolute', bottom: '8%',
        left: '50%', transform: 'translateX(-50%)',
        width: 'min(48%, 380px)', zIndex: 2,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline', marginBottom: '7px',
        }}>
          <span style={{
            color: 'rgba(245,240,225,0.18)', fontFamily: 'Inter, sans-serif',
            fontSize: '0.48rem', letterSpacing: '0.28em', textTransform: 'uppercase',
          }}>Loading</span>
          <span ref={counterRef} style={{
            color: '#D4AF37', fontFamily: '"Courier New", Courier, monospace',
            fontSize: '0.68rem', letterSpacing: '0.06em',
          }}>000</span>
        </div>
        <div style={{ height: '1px', background: 'rgba(245,240,225,0.07)', position: 'relative', overflow: 'hidden' }}>
          <div ref={fillRef} style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, #8A6E10 0%, #D4AF37 35%, #F2D060 55%, #D4AF37 80%, #8A6E10 100%)',
          }} />
        </div>
      </div>
    </div>
  )
}
