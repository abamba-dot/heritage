import { useState } from 'react'

const FOOTER_LINKS = {
  navigation: [
    { label: 'Collections', href: '#collections' },
    { label: 'Configurateur', href: '#configurateur' },
    { label: 'Contact', href: '#contact' },
    { label: 'Suivi WhatsApp', href: 'https://wa.me/' },
  ],
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/' },
    { label: 'Pinterest', href: 'https://www.pinterest.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
  legal: [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'CGV', href: '/cgv' },
    { label: 'Politique de confidentialité', href: '/confidentialite' },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()

    if (!email.trim() || !email.includes('@')) {
      setMessage('Entre une adresse email valide.')
      return
    }

    setMessage('Merci, ton email est bien enregistré pour le suivi HÉRITAGES.')
    setEmail('')
  }

  return (
    <footer id="contact" className="bg-[#0D0D0D] border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-5 pt-14 pb-7 sm:px-6 md:px-10 md:pt-20 md:pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-12 border-b border-white/8 md:grid-cols-12 md:gap-x-8 md:gap-y-0 md:pb-14">

          {/* Brand column — full width on xs, spans 2 cols on sm 2-col grid, then md 4-col span */}
          <div className="col-span-2 md:col-span-4">
            <a href="/" className="inline-flex items-center gap-3 mb-4 group">
              <FooterLogo />
              <span className="font-cinzel text-xl font-bold tracking-[0.2em] text-[#F5F0E1]">
                HÉRITAGES
              </span>
            </a>
            <p className="font-inter text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase mb-5">
              Every City Has A Story
            </p>
            <p className="font-inter text-sm text-white/35 leading-relaxed max-w-xs">
              Des maillots qui portent l'âme de vos villes, conçus pour la Coupe du Monde 2030 au Maroc, Portugal et Espagne.
            </p>
          </div>

          {/* Nav */}
          <div className="md:col-span-2">
            <FooterColTitle>Navigation</FooterColTitle>
            <ul className="space-y-3.5">
              {FOOTER_LINKS.navigation.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="font-inter text-sm text-white/50 hover:text-[#D4AF37] transition-colors duration-300">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <FooterColTitle>Réseaux</FooterColTitle>
            <ul className="space-y-3.5">
              {FOOTER_LINKS.social.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="font-inter text-sm text-white/50 hover:text-[#D4AF37] transition-colors duration-300">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-2 md:col-span-4">
            <FooterColTitle>Légal</FooterColTitle>
            <ul className="space-y-3.5">
              {FOOTER_LINKS.legal.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="font-inter text-sm text-white/50 hover:text-[#D4AF37] transition-colors duration-300">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            {/* Newsletter hint */}
            <div className="mt-8">
              <FooterColTitle>Restez informé</FooterColTitle>
              <form onSubmit={handleNewsletterSubmit} className="mt-3">
                <div className="flex gap-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 font-inter text-xs text-[#F5F0E1] placeholder:text-white/25 outline-none focus:border-[#D4AF37]/50 transition-colors"
                  />
                  <button type="submit" className="bg-[#D4AF37] px-4 py-2.5 font-cinzel text-[10px] font-bold tracking-widest text-[#0D0D0D] hover:bg-[#C9A227] transition-colors">
                    OK
                  </button>
                </div>
                {message && (
                  <p className="mt-2 font-inter text-[11px] text-white/40">
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-inter text-[11px] text-white/25 tracking-wider">
            © 2026 HÉRITAGES — Tous droits réservés
          </p>
          <p className="font-inter text-[11px] text-white/20 tracking-widest uppercase">
            33°35'N 7°36'W — Casablanca, Maroc
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColTitle({ children }) {
  return (
    <h3 className="font-cinzel text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase mb-5">
      {children}
    </h3>
  )
}

function FooterLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="27" height="27" rx="2.5" stroke="#D4AF37" strokeOpacity="0.4" />
      <text x="14" y="21" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="17" fontWeight="700" fill="#D4AF37">H</text>
    </svg>
  )
}
