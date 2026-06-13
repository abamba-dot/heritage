import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'heritages-cart'

function readInitialCart() {
  if (typeof window === 'undefined') return []

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readInitialCart)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  const addItem = (item) => {
    setItems((currentItems) => {
      const existing = currentItems.find((currentItem) => currentItem.signature === item.signature)

      if (existing) {
        return currentItems.map((currentItem) =>
          currentItem.signature === item.signature
            ? { ...currentItem, quantity: currentItem.quantity + 1 }
            : currentItem
        )
      }

      return [
        ...currentItems,
        {
          ...item,
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          quantity: 1,
        },
      ]
    })
    setIsCartOpen(true)
  }

  const removeItem = (id) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => (
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        ))
        .filter((item) => item.quantity > 0)
    )
  }

  const clearCart = () => setItems([])

  const value = useMemo(
    () => ({
      items,
      cartCount,
      isCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
    }),
    [items, cartCount, isCartOpen]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
