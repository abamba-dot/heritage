import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { label: 'COLLECTIONS', href: '#configurateur' },
  { label: 'CONFIGURATEUR', href: '#configurateur' },
  { label: 'CONTACT', href: '#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount, openCart } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  const fgMuted = scrolled ? 'text-[#F5F0E1]/55' : 'text-[#1A1A1A]/65'
  // Text-shadow only when header is transparent over the hero photo (first 60px of scroll)
  const navShadow = !scrolled ? { textShadow: '0 1px 8px rgba(0,0,0,0.4)' } : undefined

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0D0D0D] border-b border-[#2A2A2A]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

        {/* Logo — invisible while Hero section intersects the viewport */}
        <a
          href="/"
          className="flex items-center transition-opacity duration-300"
          style={{
            opacity: isHeroVisible ? 0 : 1,
            pointerEvents: isHeroVisible ? 'none' : 'auto',
          }}
          tabIndex={isHeroVisible ? -1 : 0}
        >
          <img
            src="/images/logoheritages.png"
            alt="HÉRITAGES"
            className="h-10 w-auto object-contain"
          />
        </a>

        {/* Desktop nav — always visible */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`font-inter text-[10px] tracking-[0.22em] uppercase hover:text-[#D4AF37] transition-colors duration-200 ${fgMuted}`}
              style={navShadow}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Icons — always visible */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={openCart}
            aria-label="Panier"
            className={`relative hover:text-[#D4AF37] transition-colors ${fgMuted}`}
            style={navShadow}
          >
            <IconCart />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37]">
                <span className="font-inter text-[9px] font-bold text-[#0D0D0D]">{cartCount}</span>
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className={`lg:hidden hover:text-[#D4AF37] transition-colors ${fgMuted}`}
            style={navShadow}
          >
            <IconMenu open={menuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 bg-[#0D0D0D] border-t border-[#2A2A2A] ${
          menuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-6 py-5 flex flex-col gap-4">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-inter text-[10px] tracking-[0.25em] text-[#F5F0E1]/55 uppercase hover:text-[#D4AF37] transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

function IconCart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function IconMenu({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
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
