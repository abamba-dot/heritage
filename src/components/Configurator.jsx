import { useState, useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'
import { cities } from '../data/cities'
import { worldCountries } from '../data/worldCountries'

const SHIRT_COLORS = [
  { id: 'or', label: 'Or', hex: '#D4AF37' },
  { id: 'noir', label: 'Noir', hex: '#0D0D0D' },
  { id: 'blanc', label: 'Blanc', hex: '#FFFFFF' },
  { id: 'vert', label: 'Vert', hex: '#1E4D2B' },
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

const CITY_COUNTRY_CODES = {
  "CÔTE D'IVOIRE": 'CI',
  MAROC: 'MA',
  GABON: 'GA',
}

/**
 * Returns a dark or light foreground color for readability
 * depending on the luminance of the given hex background.
 */
function getContrastColor(hex) {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16) || 0
  const g = parseInt(clean.substring(2, 4), 16) || 0
  const b = parseInt(clean.substring(4, 6), 16) || 0
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#0D0D0D' : '#F5F0E1'
}

export default function Configurator() {
  const { currentCity, setCurrentCity } = useTheme()
  const { addItem } = useCart()

  const [selectedCountryCode, setSelectedCountryCode] = useState(
    CITY_COUNTRY_CODES[currentCity.country] ?? 'CI'
  )
  const [selectedCityName, setSelectedCityName] = useState(currentCity.name)
  const [style, setStyle] = useState('homme')
  const [color, setColor] = useState(SHIRT_COLORS[0])
  const [size, setSize] = useState('M')
  const [hasCustomRequest, setHasCustomRequest] = useState(false)
  const [customRequests, setCustomRequests] = useState([''])

  const theme = currentCity.theme
  const accent = theme.accent
  const textColor = theme.textOnBg
  const bgColor = theme.background
  const ctaTextColor = useMemo(() => getContrastColor(accent), [accent])
  const selectedCountryName = useMemo(() => {
    return worldCountries.find((country) => country.code === selectedCountryCode)?.name ?? selectedCountryCode
  }, [selectedCountryCode])
  const citySuggestions = useMemo(
    () => cities.map((city) => `${city.name} — ${city.country}`),
    []
  )

  const handleCountryChange = (e) => {
    const countryCode = e.target.value
    const heritageCity = cities.find((city) => CITY_COUNTRY_CODES[city.country] === countryCode)

    setSelectedCountryCode(countryCode)

    if (heritageCity) {
      setSelectedCityName(heritageCity.name)
      setCurrentCity(heritageCity)
    } else {
      setSelectedCityName('')
    }
  }

  const handleCityChange = (e) => {
    const value = e.target.value
    const cleanCityName = value.split(' — ')[0].trim()
    const heritageCity = cities.find(
      (city) => city.name.toLowerCase() === cleanCityName.toLowerCase()
    )

    setSelectedCityName(cleanCityName)

    if (heritageCity) {
      setSelectedCountryCode(CITY_COUNTRY_CODES[heritageCity.country] ?? selectedCountryCode)
      setCurrentCity(heritageCity)
    }
  }

  const buildCartItem = () => {
    const styleLabel = style === 'homme' ? 'Homme' : 'Femme'
    const personalizations = customRequests
      .map((request) => request.trim())
      .filter(Boolean)
    const cityLabel = selectedCityName.trim() || 'Ville à préciser'

    return {
      title: `HÉRITAGES ${cityLabel}`,
      country: selectedCountryName,
      city: cityLabel,
      style: styleLabel,
      color: color.label,
      colorHex: color.hex,
      size,
      personalizations: hasCustomRequest ? personalizations : [],
      signature: JSON.stringify({
        country: selectedCountryName,
        city: cityLabel,
        style: styleLabel,
        color: color.label,
        size,
        personalizations: hasCustomRequest ? personalizations : [],
      }),
    }
  }

  const handleAddToCart = () => {
    addItem(buildCartItem())
  }

  const updateCustomRequest = (index, value) => {
    setCustomRequests((requests) =>
      requests.map((request, itemIndex) => (itemIndex === index ? value : request))
    )
  }

  const addCustomRequest = (value = '') => {
    setHasCustomRequest(true)
    setCustomRequests((requests) => [...requests, value])
  }

  const removeCustomRequest = (index) => {
    setCustomRequests((requests) => {
      const next = requests.filter((_, itemIndex) => itemIndex !== index)
      return next.length ? next : ['']
    })
  }

  const silhouetteOnRight = currentCity.silhouettePosition === 'right'

  return (
    <section
      id="configurateur"
      className="relative min-h-screen overflow-hidden scroll-mt-[90px] px-5 py-20 pt-28 transition-colors duration-[400ms] ease-in-out sm:px-6 md:pt-36 lg:pt-40"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {/* Monument silhouette watermark */}
      <img
        src={currentCity.assets.monumentSilhouette}
        alt=""
        aria-hidden="true"
        className={`
          pointer-events-none absolute top-1/2 h-[70vh] max-w-none -translate-y-1/2
          select-none opacity-[0.12] transition-all duration-[400ms]
          ${silhouetteOnRight ? '-right-[12%] rotate-3' : '-left-[12%] -rotate-3'}
        `}
        style={{
          color: accent,
          filter: `drop-shadow(0 0 30px ${accent})`,
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[480px]">
        {/* Header */}
        <header className="mb-10 text-center">
          <p className="font-inter mb-3 text-[10px] font-medium uppercase tracking-[0.35em] opacity-60">
            Configurateur
          </p>
          <h2 className="font-cinzel text-2xl font-bold tracking-tight md:text-4xl">
            Personnalise ton t-shirt
          </h2>
          <p className="font-inter mt-3 text-sm opacity-70">
            Crée une pièce unique à ton image.
          </p>
        </header>

        {/* Step 1 — Country + City */}
        <Step title="Étape 1 — Choisis ton pays et ta ville" accent={accent}>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              label="Pays"
              value={selectedCountryCode}
              onChange={handleCountryChange}
              accent={accent}
              textColor={textColor}
            >
              {worldCountries.map((country) => (
                <option key={country.code} value={country.code} className="bg-[#0D0D0D] text-[#F5F0E1]">
                  {country.name}
                </option>
              ))}
            </SelectField>

            <TextField
              label="Ville"
              value={selectedCityName}
              onChange={handleCityChange}
              accent={accent}
              textColor={textColor}
              list="heritage-city-suggestions"
              placeholder="Ex: Dakar, Paris, Tokyo..."
            />
            <datalist id="heritage-city-suggestions">
              {citySuggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          </div>
          <p className="font-inter mt-3 text-xs leading-relaxed opacity-60">
            Tous les pays sont disponibles. Pour la ville, le champ est libre: le client peut écrire n'importe quelle ville du monde.
          </p>
        </Step>

        {/* Step 2 — Style */}
        <Step title="Étape 2 — Choisis le style" accent={accent}>
          <div className="grid grid-cols-2 gap-3">
            <StyleButton
              label="Homme"
              selected={style === 'homme'}
              onClick={() => setStyle('homme')}
              icon={<IconMale />}
              accent={accent}
              textColor={textColor}
            />
            <StyleButton
              label="Femme"
              selected={style === 'femme'}
              onClick={() => setStyle('femme')}
              icon={<IconFemale />}
              accent={accent}
              textColor={textColor}
            />
          </div>
        </Step>

        {/* Step 3 — Color */}
        <Step title="Étape 3 — Choisis la couleur" accent={accent}>
          <div className="flex flex-wrap gap-5">
            {SHIRT_COLORS.map((c) => {
              const selected = color.id === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Couleur ${c.label}`}
                  aria-pressed={selected}
                  className={`
                    relative h-14 w-14 rounded-full transition-all duration-[400ms]
                    ${selected ? 'scale-110' : 'hover:scale-105'}
                  `}
                  style={{
                    backgroundColor: c.hex,
                    boxShadow: selected
                      ? `0 0 0 3px ${bgColor}, 0 0 0 5px ${accent}`
                      : `0 0 0 1px ${textColor}15`,
                  }}
                >
                  {selected && (
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: `inset 0 0 0 2px ${getContrastColor(c.hex)}30`,
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
          <p className="font-inter mt-3 text-xs opacity-60">{color.label}</p>
        </Step>

        {/* Step 4 — Size */}
        <Step title="Étape 4 — Choisis la taille" accent={accent}>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => {
              const selected = size === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={selected}
                  className="flex h-12 min-w-[3rem] flex-1 items-center justify-center border font-cinzel text-sm font-bold transition-all duration-[400ms] hover:opacity-90"
                  style={{
                    borderColor: selected ? accent : `${textColor}20`,
                    color: selected ? accent : textColor,
                    backgroundColor: selected ? `${accent}14` : 'transparent',
                  }}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </Step>

        {/* Step 5 — Free personalization */}
        <Step title="Étape 5 — Personnalisation libre" accent={accent}>
          <label
            className="flex cursor-pointer items-start gap-3 border p-4 font-inter text-sm transition-colors duration-[400ms]"
            style={{
              borderColor: hasCustomRequest ? accent : `${textColor}20`,
              backgroundColor: hasCustomRequest ? `${accent}12` : 'transparent',
            }}
          >
            <input
              type="checkbox"
              checked={hasCustomRequest}
              onChange={(e) => {
                setHasCustomRequest(e.target.checked)
                if (e.target.checked && customRequests.length === 0) {
                  setCustomRequests([''])
                }
              }}
              className="mt-1 h-4 w-4 accent-current"
              style={{ color: accent }}
            />
            <span>
              <span className="block font-medium">Autre personnalisation</span>
              <span className="mt-1 block text-xs opacity-60">
                Coche cette case pour écrire une ou plusieurs demandes: nom, numéro, phrase, broderie, placement, packaging ou autre idée.
              </span>
            </span>
          </label>

          {hasCustomRequest && (
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                'Nom au dos: ',
                'Numéro préféré: ',
                'Phrase personnalisée: ',
                'Placement spécial: ',
                'Couleur ou finition spéciale: ',
                'Autre idée: ',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => addCustomRequest(preset)}
                  className="border px-3 py-2 font-inter text-[10px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 hover:opacity-90"
                  style={{
                    borderColor: `${accent}55`,
                    color: accent,
                    backgroundColor: `${accent}0F`,
                  }}
                >
                  + {preset.replace(': ', '')}
                </button>
              ))}
            </div>
          )}

          {hasCustomRequest && (
            <div className="mt-4 space-y-3">
              {customRequests.map((request, index) => (
                <div key={index} className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-inter text-[10px] font-medium uppercase tracking-[0.2em] opacity-55">
                      Demande {index + 1}
                    </p>
                    {customRequests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCustomRequest(index)}
                        className="font-inter text-[10px] uppercase tracking-[0.18em] opacity-60 transition-opacity hover:opacity-100"
                      >
                        Retirer
                      </button>
                    )}
                  </div>
                  <textarea
                    value={request}
                    onChange={(e) => updateCustomRequest(index, e.target.value)}
                    rows={3}
                    maxLength={220}
                    placeholder="Ex: Ajouter le nom AMINA au dos, numéro 10, petit texte sous le col..."
                    className="w-full resize-none rounded-none border bg-transparent px-4 py-3.5 font-inter text-sm outline-none transition-colors duration-[400ms] placeholder:opacity-45"
                    style={{
                      borderColor: `${textColor}30`,
                      color: textColor,
                    }}
                  />
                  <p className="font-inter text-right text-[10px] opacity-50">
                    {request.length}/220 caractères
                  </p>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addCustomRequest()}
                className="w-full border border-dashed py-3 font-cinzel text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 hover:opacity-90"
                style={{
                  borderColor: `${accent}70`,
                  color: accent,
                }}
              >
                Ajouter une autre personnalisation
              </button>
            </div>
          )}
        </Step>

        {/* Final CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-10 w-full py-4 font-cinzel text-xs font-bold uppercase tracking-[0.25em] transition-all duration-[400ms] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: accent,
            color: ctaTextColor,
            '--tw-ring-color': accent,
            '--tw-ring-offset-color': bgColor,
          }}
        >
          Ajouter au panier
        </button>
      </div>
    </section>
  )
}

function Step({ title, children, accent }) {
  return (
    <div className="mb-8">
      <h3
        className="font-cinzel mb-3 text-xs font-bold uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

function SelectField({ label, value, onChange, children, accent, textColor }) {
  return (
    <label className="block">
      <span className="font-inter mb-2 block text-[10px] font-medium uppercase tracking-[0.24em] opacity-55">
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-none border bg-transparent px-4 py-3.5 pr-10 font-inter text-sm outline-none transition-colors duration-[400ms] [color-scheme:dark]"
          style={{
            borderColor: `${textColor}30`,
            color: textColor,
            backgroundColor: 'transparent',
          }}
        >
          {children}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: accent }}
        >
          <IconChevron />
        </span>
      </span>
    </label>
  )
}

function TextField({ label, value, onChange, accent, textColor, list, placeholder }) {
  return (
    <label className="block">
      <span className="font-inter mb-2 block text-[10px] font-medium uppercase tracking-[0.24em] opacity-55">
        {label}
      </span>
      <span className="relative block">
        <input
          type="text"
          value={value}
          onChange={onChange}
          list={list}
          placeholder={placeholder}
          className="w-full rounded-none border bg-transparent px-4 py-3.5 pr-10 font-inter text-sm outline-none transition-colors duration-[400ms] placeholder:opacity-45"
          style={{
            borderColor: `${textColor}30`,
            color: textColor,
          }}
        />
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.16em]"
          style={{ color: accent }}
        >
          libre
        </span>
      </span>
    </label>
  )
}

function StyleButton({ label, selected, onClick, icon, accent, textColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="flex items-center justify-center gap-3 border py-3.5 font-inter text-sm font-medium transition-all duration-[400ms] hover:opacity-90"
      style={{
        borderColor: selected ? accent : `${textColor}20`,
        color: selected ? accent : textColor,
        backgroundColor: selected ? `${accent}14` : 'transparent',
      }}
    >
      <span style={{ color: selected ? accent : textColor }}>{icon}</span>
      {label}
    </button>
  )
}

/* Icons */
function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function IconMale() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="14" r="5" />
      <path d="M19 5l-6 6" />
      <path d="M22 5h-5M19 8V3" />
    </svg>
  )
}

function IconFemale() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="5" />
      <path d="M12 14v7" />
      <path d="M9 21h6" />
    </svg>
  )
}
