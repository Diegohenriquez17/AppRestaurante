/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { demoState, buildProductImage } from '../data/demoData.js'
import {
  addRemoteCategory,
  addRemoteTable,
  createRemoteOrder,
  deleteRemoteProduct,
  isSupabaseEnabled,
  loadRemoteState,
  normalizeTableSlug,
  saveRemoteProduct,
  toggleRemoteProductAvailability,
  updateRemoteOrderStatus,
  updateRemoteRestaurantConfig,
} from '../lib/repository.js'

const STORAGE_KEY = 'lasthit-demo-state-v1'
const AUTH_KEY = 'lasthit-auth-user'
const CHANNEL_NAME = 'lasthit-demo-sync'
const AppStoreContext = createContext(null)

function cloneDemoState() {
  return JSON.parse(JSON.stringify(demoState))
}

function loadInitialState() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const parsed = JSON.parse(saved)
    // Ensure new fields exist for backwards compat
    if (!parsed.staffUsers) parsed.staffUsers = cloneDemoState().staffUsers
    if (!parsed.reservations) parsed.reservations = []
    return parsed
  }
  return cloneDemoState()
}

function generatePin(existingPins) {
  let pin
  do {
    pin = String(Math.floor(1000 + Math.random() * 9000))
  } while (existingPins.includes(pin))
  return pin
}

function loadAuthUser() {
  const saved = localStorage.getItem(AUTH_KEY)
  if (saved) {
    try { return JSON.parse(saved) } catch { return null }
  }
  return null
}

export function AppStoreProvider({ children }) {
  const [state, setState] = useState(loadInitialState)
  const [currentUser, setCurrentUser] = useState(loadAuthUser)
  const [remoteMode, setRemoteMode] = useState(isSupabaseEnabled())
  const [remoteError, setRemoteError] = useState('')
  const [isHydrating, setIsHydrating] = useState(isSupabaseEnabled())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (!isSupabaseEnabled()) {
      return
    }

    let active = true
    loadRemoteState()
      .then((remoteState) => {
        if (!active || !remoteState) return
        setState((current) => ({
          ...remoteState,
          carts: current.carts,
          staffUsers: current.staffUsers || cloneDemoState().staffUsers,
          reservations: current.reservations || [],
        }))
        setRemoteMode(true)
        setRemoteError('')
      })
      .catch((error) => {
        if (!active) return
        setRemoteMode(false)
        setRemoteError(error.message)
      })
      .finally(() => {
        if (active) setIsHydrating(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channel.onmessage = (event) => {
      if (event.data?.type === 'sync-state') {
        setState(event.data.payload)
      }
    }
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        setState(JSON.parse(event.newValue))
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => {
      channel.close()
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const persist = (updater) => {
    setState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater
      const channel = new BroadcastChannel(CHANNEL_NAME)
      channel.postMessage({ type: 'sync-state', payload: next })
      channel.close()
      return next
    })
  }

  const api = useMemo(
    () => ({
      state,
      currentUser,
      remoteMode,
      remoteError,
      isHydrating,
      login(pin) {
        const users = state.staffUsers || []
        const user = users.find((u) => u.pin === pin && u.active)
        if (!user) return null
        setCurrentUser(user)
        localStorage.setItem(AUTH_KEY, JSON.stringify(user))
        return user
      },
      logout() {
        setCurrentUser(null)
        localStorage.removeItem(AUTH_KEY)
      },
      getCartForTable(tableSlug) {
        return state.carts[tableSlug] ?? { items: [], note: '', tipPercent: 10 }
      },
      updateCartItem(tableSlug, product, delta) {
        persist((current) => {
          const cart = current.carts[tableSlug] ?? { items: [], note: '', tipPercent: 10 }
          const found = cart.items.find((item) => item.id === product.id)
          let nextItems
          if (found) {
            nextItems = cart.items
              .map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + delta }
                  : item,
              )
              .filter((item) => item.quantity > 0)
          } else {
            nextItems = [...cart.items, { ...product, quantity: 1, notes: '' }]
          }
          return {
            ...current,
            carts: {
              ...current.carts,
              [tableSlug]: { ...cart, items: nextItems },
            },
          }
        })
      },
      removeFromCart(tableSlug, productId) {
        persist((current) => {
          const cart = current.carts[tableSlug] ?? { items: [], note: '', tipPercent: 10 }
          return {
            ...current,
            carts: {
              ...current.carts,
              [tableSlug]: {
                ...cart,
                items: cart.items.filter((item) => item.id !== productId),
              },
            },
          }
        })
      },
      setCartItemNote(tableSlug, productId, notes) {
        persist((current) => {
          const cart = current.carts[tableSlug] ?? { items: [], note: '', tipPercent: 10 }
          return {
            ...current,
            carts: {
              ...current.carts,
              [tableSlug]: {
                ...cart,
                items: cart.items.map((item) =>
                  item.id === productId ? { ...item, notes } : item,
                ),
              },
            },
          }
        })
      },
      clearCart(tableSlug) {
        persist((current) => ({
          ...current,
          carts: {
            ...current.carts,
            [tableSlug]: { items: [], note: '', tipPercent: 10 },
          },
        }))
      },
      setCartNote(tableSlug, note) {
        persist((current) => {
          const cart = current.carts[tableSlug] ?? { items: [], note: '', tipPercent: 10 }
          return {
            ...current,
            carts: {
              ...current.carts,
              [tableSlug]: { ...cart, note },
            },
          }
        })
      },
      setCartTip(tableSlug, tipPercent) {
        persist((current) => {
          const cart = current.carts[tableSlug] ?? { items: [], note: '', tipPercent: 10 }
          return {
            ...current,
            carts: {
              ...current.carts,
              [tableSlug]: { ...cart, tipPercent },
            },
          }
        })
      },
      async createOrder(payload) {
        const now = new Date().toISOString()
        const nextNumber = String(state.orderCounter + 1).padStart(4, '0')
        const tableRecord =
          state.tables.find((table) => table.slug === payload.mesaId) ??
          {
            id: payload.mesaId,
            slug: payload.mesaId,
            label: payload.mesaId.replace('mesa-', 'Mesa '),
          }
        const localOrder = {
          id: crypto.randomUUID(),
          number: nextNumber,
          tableId: payload.mesaId,
          tableLabel: tableRecord.label,
          orderType: payload.orderType,
          items: payload.items,
          note: payload.note,
          subtotal: payload.subtotal,
          discount: payload.discount,
          tipAmount: payload.tipAmount,
          total: payload.total,
          status: 'Pendiente',
          paymentMethod: null,
          waiterId: payload.waiterId || null,
          waiterName: payload.waiterName || null,
          createdAt: now,
          whatsAppMessage: buildWhatsAppMessage({
            number: nextNumber,
            mesa: tableRecord.label,
            orderType: payload.orderType,
            items: payload.items,
            note: payload.note,
            total: payload.total,
          }),
        }

        if (remoteMode) {
          const remoteOrder = await createRemoteOrder(payload, state)
          remoteOrder.paymentMethod = null
          remoteOrder.waiterId = payload.waiterId || null
          remoteOrder.waiterName = payload.waiterName || null
          persist((current) => ({
            ...current,
            orders: [remoteOrder, ...current.orders],
            orderCounter: Math.max(current.orderCounter, Number(remoteOrder.number)),
          }))
          return remoteOrder
        }

        persist((current) => ({
          ...current,
          orders: [localOrder, ...current.orders],
          orderCounter: current.orderCounter + 1,
        }))
        return localOrder
      },
      async updateOrderStatus(orderId, status) {
        if (remoteMode) {
          await updateRemoteOrderStatus(orderId, status)
        }
        persist((current) => ({
          ...current,
          orders: current.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
        }))
      },
      setOrderPaymentMethod(orderId, paymentMethod) {
        persist((current) => ({
          ...current,
          orders: current.orders.map((order) =>
            order.id === orderId ? { ...order, paymentMethod } : order,
          ),
        }))
      },
      async saveProduct(product) {
        let remoteProduct = null
        if (remoteMode) {
          remoteProduct = await saveRemoteProduct(product, state)
        }
        persist((current) => {
          const normalized = {
            ...(remoteProduct
              ? {
                  id: remoteProduct.id,
                  name: remoteProduct.name,
                  description: remoteProduct.description ?? '',
                  price: remoteProduct.price,
                  category: remoteProduct.category_name,
                  image:
                    remoteProduct.image_url ||
                    buildProductImage(remoteProduct.name, current.restaurant.primaryColor),
                  available: remoteProduct.available,
                  featured: remoteProduct.featured,
                  vegetarian: remoteProduct.vegetarian,
                  prepTime: remoteProduct.prep_time,
                }
              : product),
            id: remoteProduct?.id || product.id || crypto.randomUUID(),
            image:
              remoteProduct?.image_url ||
              product.image ||
              buildProductImage(product.name, current.restaurant.primaryColor),
          }
          const exists = current.products.some((item) => item.id === normalized.id)
          return {
            ...current,
            products: exists
              ? current.products.map((item) => (item.id === normalized.id ? normalized : item))
              : [normalized, ...current.products],
          }
        })
      },
      async deleteProduct(productId) {
        if (remoteMode) {
          await deleteRemoteProduct(productId)
        }
        persist((current) => ({
          ...current,
          products: current.products.filter((product) => product.id !== productId),
        }))
      },
      async toggleProductAvailability(productId) {
        const nextAvailability = !state.products.find((product) => product.id === productId)?.available
        if (remoteMode) {
          await toggleRemoteProductAvailability(productId, nextAvailability)
        }
        persist((current) => ({
          ...current,
          products: current.products.map((product) =>
            product.id === productId
              ? { ...product, available: !product.available }
              : product,
          ),
        }))
      },
      async addCategory(name) {
        let remoteCategory = null
        if (remoteMode) {
          remoteCategory = await addRemoteCategory(name)
        }
        persist((current) => ({
          ...current,
          categories: [
            ...current.categories,
            {
              id: remoteCategory?.id || crypto.randomUUID(),
              name: remoteCategory?.name || name,
              description:
                remoteCategory?.description || 'Categoria creada desde el panel admin',
            },
          ],
        }))
      },
      async addTable(label) {
        let remoteTable = null
        if (remoteMode) {
          remoteTable = await addRemoteTable(label)
        }
        persist((current) => ({
          ...current,
          tables: [
            ...current.tables,
            {
              id: remoteTable?.id || crypto.randomUUID(),
              label: remoteTable?.label || label,
              slug: remoteTable?.slug || normalizeTableSlug(label),
            },
          ],
        }))
      },
      async updateRestaurantConfig(config) {
        if (remoteMode) {
          await updateRemoteRestaurantConfig(config)
        }
        persist((current) => ({
          ...current,
          restaurant: { ...current.restaurant, ...config },
        }))
      },

      // ── Staff Users ──
      addStaffUser(name, role) {
        const existingPins = (state.staffUsers || []).map((u) => u.pin)
        const pin = generatePin(existingPins)
        const newUser = {
          id: crypto.randomUUID(),
          name,
          role,
          pin,
          active: true,
          createdAt: new Date().toISOString(),
        }
        persist((current) => ({
          ...current,
          staffUsers: [...(current.staffUsers || []), newUser],
        }))
        return newUser
      },
      removeStaffUser(userId) {
        persist((current) => ({
          ...current,
          staffUsers: (current.staffUsers || []).filter((u) => u.id !== userId),
        }))
      },
      toggleStaffUser(userId) {
        persist((current) => ({
          ...current,
          staffUsers: (current.staffUsers || []).map((u) =>
            u.id === userId ? { ...u, active: !u.active } : u,
          ),
        }))
      },

      // ── Reservations ──
      addReservation(reservation) {
        const newReservation = {
          id: crypto.randomUUID(),
          ...reservation,
          status: 'Pendiente',
          createdAt: new Date().toISOString(),
        }
        persist((current) => ({
          ...current,
          reservations: [newReservation, ...(current.reservations || [])],
        }))
        return newReservation
      },
      updateReservationStatus(reservationId, status) {
        persist((current) => ({
          ...current,
          reservations: (current.reservations || []).map((r) =>
            r.id === reservationId ? { ...r, status } : r,
          ),
        }))
      },
      removeReservation(reservationId) {
        persist((current) => ({
          ...current,
          reservations: (current.reservations || []).filter((r) => r.id !== reservationId),
        }))
      },
    }),
    [currentUser, isHydrating, remoteError, remoteMode, state],
  )

  return <AppStoreContext.Provider value={api}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const context = useContext(AppStoreContext)
  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider')
  }
  return context
}

function buildWhatsAppMessage({ mesa, orderType, items, note, total }) {
  return `Nuevo pedido recibido
Mesa: ${mesa.replace('Mesa ', '')}
Tipo de pedido: ${orderType}

Detalle:
${items.map((item) => `- ${item.quantity}x ${item.name}`).join('\n')}

Notas:
${note || 'Sin notas especiales.'}

Total: ${new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(total)}`
}
