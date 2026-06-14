import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const heroImage = '/images/photohero1.png'

const maskSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 260">
  <text
    x="50%"
    y="50%"
    dominant-baseline="middle"
    text-anchor="middle"
    fill="white"
    font-family="Cinzel, Times New Roman, serif"
    font-size="190"
    font-weight="900"
    letter-spacing="-4"
  >HÉRITAGES</text>
</svg>
`)

const titleMask = `url("data:image/svg+xml,${maskSvg}")`

export default function Hero() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: '.scroller',
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          })
          .to('.mask', { maskSize: '110%', webkitMaskSize: '110%' })
          .to('.mask-image', { y: '20%' }, '<')
          .to('.overlay', { opacity: 0.8 }, '<')
          .to('.scroller .sticky', { height: '0vh' })
      })

      mm.add('(max-width: 767px)', () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: '.scroller',
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          })
          .to('.mask', { maskSize: '100%', webkitMaskSize: '100%' })
          .to('.mask-image', { y: '10%' }, '<')
          .to('.overlay', { opacity: 0.8 }, '<')
          .to('.scroller .sticky', { height: '0vh' })
          .to('.mask-image', { y: '0' }, '<')
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section id="hero" ref={sectionRef} className="-mb-[100vh] w-full">
      <div className="exitWrapper overflow-clip">
        <div className="scroller h-[300vh]">
          <div className="sticky relative top-0 h-screen w-full overflow-hidden bg-[#f1eee7]">

            {/* Fond plein écran — lookbook 6 modèles */}
            <img
              className="bgImage absolute inset-0 h-full w-full object-cover object-center"
              src={heroImage}
              alt="Lookbook Héritages"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />

            {/* Voile blanc : opacity 0 → 0.8 au scroll */}
            <div className="overlay absolute inset-0 bg-white opacity-0" />

            {/* Masque texte HÉRITAGES : maskSize 0% → 110% au scroll */}
            <div
              className="mask absolute inset-0 z-10 overflow-hidden"
              style={{
                maskImage: titleMask,
                WebkitMaskImage: titleMask,
                maskSize: '0%',
                WebkitMaskSize: '0%',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
              aria-hidden="true"
            >
              <img
                className="mask-image absolute left-1/2 top-1/2 h-[120vh] w-[120vw] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-center will-change-transform md:h-[130vh] md:w-[130vw]"
                src={heroImage}
                alt=""
                loading="eager"
                decoding="sync"
              />
            </div>

            {/* Tagline + flèche scroll — fixés en bas du viewport */}
            <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex flex-col items-center gap-4">
              <p className="font-inter text-[10px] font-medium uppercase tracking-[0.55em] text-[#F5F0E1] md:text-[11px]">
                Every City Has A Story
              </p>
              <ScrollArrow />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

function ScrollArrow() {
  return (
    <div
      className="animate-bounce"
      style={{ animationDuration: '1.4s', animationTimingFunction: 'cubic-bezier(0.4,0,0.6,1)' }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#F5F0E1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    </div>
  )
}
