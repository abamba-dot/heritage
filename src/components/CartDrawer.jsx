import { useMemo } from 'react'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const {
    items,
    cartCount,
    isCartOpen,
    openCart,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart()

  const whatsappText = useMemo(() => {
    if (!items.length) return ''

    const lines = items.flatMap((item, index) => [
      `${index + 1}. ${item.title}`,
      `Pays : ${item.country}${item.city ? ` / ${item.city}` : ''}`,
      `Style: ${item.style} | Couleur: ${item.color} | Taille: ${item.size}`,
      `Quantité: ${item.quantity}`,
      item.personalizations.length
        ? `Personnalisations: ${item.personalizations.join(' | ')}`
        : 'Personnalisations: aucune',
    ])

    return `Bonjour HÉRITAGES, je souhaite commander:\n\n${lines.join('\n')}`
  }, [items])

  const whatsappUrl = `https://wa.me/212781636843?text=${encodeURIComponent(whatsappText)}`

  return (
    <>
      <button
        type="button"
        onClick={openCart}
        className={`fixed bottom-5 right-5 z-[60] flex h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-4 text-[#0D0D0D] shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-[#C9A227] ${
          isCartOpen ? 'pointer-events-none translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
        }`}
        aria-label="Ouvrir le panier"
      >
        <IconCart />
        <span className="font-inter text-xs font-bold">{cartCount}</span>
      </button>

      <button
        type="button"
        onClick={() => closeCart()}
        className={`fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Fermer le panier"
      />

      <aside
        className={`fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-[420px] flex-col border-l border-white/10 bg-[#0D0D0D] text-[#F5F0E1] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Panier"
        aria-hidden={!isCartOpen}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div>
            <p className="font-inter text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">
              Panier
            </p>
            <h2 className="font-cinzel text-2xl font-bold">
              {cartCount} article{cartCount > 1 ? 's' : ''}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="border border-white/15 px-3 py-2 font-inter text-[10px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-white/35 hover:text-white"
          >
            Fermer
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {!items.length ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-cinzel text-xl text-white/70">Votre panier est vide</p>
              <a
                href="#configurateur"
                onClick={closeCart}
                className="mt-5 border border-[#D4AF37] px-6 py-3 font-cinzel text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-[#0D0D0D]"
              >
                Créer un t-shirt
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.id} className="border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-[#D4AF37]">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-inter text-xs uppercase tracking-[0.18em] text-white/45">
                        {item.country}{item.city ? ` / ${item.city}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="font-inter text-[10px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white"
                    >
                      Retirer
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 font-inter text-xs text-white/70">
                    <span>{item.style}</span>
                    <span>{item.color}</span>
                    <span>Taille {item.size}</span>
                  </div>

                  {item.personalizations.length > 0 && (
                    <ul className="mt-4 space-y-1 border-l border-[#D4AF37]/50 pl-3 font-inter text-xs leading-relaxed text-white/65">
                      {item.personalizations.map((personalization) => (
                        <li key={personalization}>{personalization}</li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-white/15">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-9 w-9 text-white/70 transition-colors hover:text-white"
                        aria-label="Diminuer la quantité"
                      >
                        -
                      </button>
                      <span className="min-w-9 text-center font-inter text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-9 w-9 text-white/70 transition-colors hover:text-white"
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 px-5 py-5">
          <div className="grid gap-3">
            <a
              href={items.length ? whatsappUrl : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!items.length}
              className={`flex items-center justify-center bg-[#25D366] py-4 font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#0D0D0D] transition-opacity ${
                items.length ? 'hover:opacity-90' : 'pointer-events-none opacity-40'
              }`}
            >
              Commander via WhatsApp
            </a>
            <button
              type="button"
              onClick={clearCart}
              disabled={!items.length}
              className="border border-white/15 py-3 font-inter text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/35 hover:text-white disabled:pointer-events-none disabled:opacity-35"
            >
              Vider le panier
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

function IconCart() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
