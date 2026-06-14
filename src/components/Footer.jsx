import { countries } from "../data/countries";

const NAV_LINKS = [
  { label: "Collections", href: "#configurateur" },
  { label: "Configurateur", href: "#configurateur" },
  { label: "À Propos", href: "#contact" },
  { label: "Contact", href: "#contact" },
  { label: "CGV", href: "/cgv" },
  { label: "Mentions légales", href: "/mentions-legales" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "Pinterest", href: "https://www.pinterest.com/" },
  { label: "Facebook", href: "https://www.facebook.com/" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0D0D0D] border-t border-[#D4AF37]/30">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-8 sm:px-8 lg:px-12">
        {/* Logo + tagline */}
        <div className="mb-12 flex flex-col items-start gap-3">
          <a href="/" className="flex items-center group">
            <img
              src="/images/logoheritages.png"
              alt="HÉRITAGES"
              className="h-10 w-auto object-contain"
            />
          </a>
          <p className="font-inter text-[10px] tracking-[0.45em] text-[#D4AF37]/70 uppercase">
            Every City Has A Story
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 gap-10 border-t border-[#2A2A2A] pt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {/* Column 1 — Liens */}
          <div>
            <ColTitle>Liens</ColTitle>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="font-inter text-sm text-[#F5F0E1]/45 hover:text-[#D4AF37] transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — Pays de la collection */}
          <div>
            <ColTitle>Pays de la collection</ColTitle>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {countries.map((country) => (
                <li key={country.id}>
                  <a
                    href="#configurateur"
                    className="flex items-center gap-2 font-inter text-sm text-[#F5F0E1]/45 hover:text-[#D4AF37] transition-colors duration-200"
                  >
                    <span className="text-base leading-none">
                      {country.flag}
                    </span>
                    <span>{country.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact + Réseaux */}
          <div className="space-y-8">
            <div>
              <ColTitle>Contact</ColTitle>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://wa.me/212781636843"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-inter text-sm text-[#F5F0E1]/45 hover:text-[#D4AF37] transition-colors duration-200"
                  >
                    Commander via WhatsApp
                  </a>
                </li>
                <li>
                  <p className="font-inter text-sm text-[#F5F0E1]/30">
                    Casablanca, Maroc
                  </p>
                </li>
              </ul>
            </div>

            <div>
              <ColTitle>Réseaux</ColTitle>
              <ul className="space-y-3">
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-inter text-sm text-[#F5F0E1]/45 hover:text-[#D4AF37] transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-[#2A2A2A] pt-7 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="font-inter text-[11px] tracking-[0.15em] text-[#F5F0E1]/25">
            © 2026 HÉRITAGES — Wear Your Roots
          </p>
          <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-[#F5F0E1]/15">
            33°35&apos;N 7°36&apos;W — Casablanca
          </p>
        </div>
      </div>
    </footer>
  );
}

function ColTitle({ children }) {
  return (
    <h3 className="mb-5 font-cinzel text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase">
      {children}
    </h3>
  );
}
