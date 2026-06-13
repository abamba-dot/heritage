import { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { label: 'Collections', href: '#collections' },
  { label: 'Configurateur', href: '#configurateur' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)
  const { cartCount, openCart } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 60
      setScrolled(isScrolled)
      if (isScrolled) setMenuOpen(false)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Over the Hero (scroll < 60px), the background is light cream (#f1eee7) → dark text needed.
  // Once scrolled, the header itself has a dark background → light text.
  // When CitiesWrapper is visible, scrollY is already >> 60, so the scrolled state covers it.
  const fgColor = scrolled ? '#F5F0E1' : '#1A1A1A'
  const fgMuted = scrolled ? 'rgba(245,240,225,0.7)' : 'rgba(26,26,26,0.62)'

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
        ${scrolled
          ? 'pointer-events-none -translate-y-full opacity-0 backdrop-blur-sm'
          : 'translate-y-0 bg-transparent opacity-100'
        }`}
      style={
        scrolled
          ? {
              backgroundColor: 'color-mix(in srgb, var(--theme-bg, #0D0D0D) 28%, #0D0D0D 72%)',
              boxShadow: '0 1px 0 color-mix(in srgb, var(--theme-accent, #D4AF37) 22%, transparent)',
            }
          : undefined
      }
    >
      <div className="max-w-[1440px] mx-auto px-4 py-4 flex items-center justify-between sm:px-6 md:px-10 md:py-5">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <LogoMark scrolled={scrolled} />
          <span
            className="font-cinzel text-base font-bold tracking-[0.18em] transition-colors duration-500
              group-hover:text-[#D4AF37] sm:text-lg sm:tracking-[0.2em]"
            style={{ color: fgColor }}
          >
            HÉRITAGES
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10" aria-label="Navigation principale">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="relative font-inter text-[11px] font-medium tracking-[0.22em] uppercase
                transition-colors duration-300 hover:text-[#D4AF37]
                after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#D4AF37]
                after:transition-all after:duration-300 hover:after:w-full"
              style={{ color: fgMuted }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={openCart}
            className="relative transition-colors duration-300 hover:text-[#D4AF37]"
            aria-label="Panier"
            style={{ color: fgMuted }}
          >
            <IconCart />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <span className="font-inter text-[9px] font-bold text-[#0D0D0D]">{cartCount}</span>
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden transition-colors hover:text-[#D4AF37]"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: fgMuted }}
          >
            <IconMenu open={menuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out bg-[#0D0D0D]
          ${menuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <nav className="px-6 py-6 flex flex-col gap-5 border-t border-white/5">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-inter text-xs tracking-[0.25em] uppercase text-[#F5F0E1]/70 hover:text-[#D4AF37] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

function LogoMark({ scrolled }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="34" height="34" rx="3" fill="#D4AF37" fillOpacity="0.12" />
      <rect
        x="0.5" y="0.5" width="33" height="33" rx="2.5"
        stroke="#D4AF37"
        strokeOpacity={scrolled ? '0.3' : '0.5'}
      />
      <text
        x="17" y="25"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="22"
        fontWeight="700"
        fill="#D4AF37"
      >
        H
      </text>
    </svg>
  )
}

function IconCart() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function IconMenu({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="8" x2="21" y2="8" />
          <line x1="3" y1="16" x2="21" y2="16" />
        </>
      )}
    </svg>
  )
}
