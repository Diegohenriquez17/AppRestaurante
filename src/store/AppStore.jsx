/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { demoState, buildProductImage } from '../data/demoData.js'
import {
  addRemoteCategory,
  addRemoteTable,
  createRemoteOrder,
  deleteRemoteProduct,
  isSupabaseEnabled,
  loadRemoteState,
  loadOrganizations,
  saveRemoteOrganization,
  deleteRemoteOrganization,
  saveRemoteStaffUser,
  deleteRemoteStaffUser,
  toggleRemoteStaffUser,
  normalizeTableSlug,
  saveRemoteProduct,
  toggleRemoteProductAvailability,
  updateRemoteOrderStatus,
  updateRemoteRestaurantConfig,
  loginWithEmailAndPassword,
} from '../lib/repository.js'

const STORAGE_KEY = 'lasthit-demo-state-v1'
const AUTH_KEY = 'lasthit-auth-user'
const SESSIONS_KEY = 'lasthit-sessions-v1'
const CHANNEL_NAME = 'lasthit-demo-sync'
const AppStoreContext = createContext(null)

function cloneDemoState() {
  return JSON.parse(JSON.stringify(demoState))
}

function loadInitialState() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const parsed = JSON.parse(saved)
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

function loadSessions() {
  const saved = localStorage.getItem(SESSIONS_KEY)
  if (saved) {
    try { return JSON.parse(saved) } catch { return [] }
  }
  return []
}

export function AppStoreProvider({ children }) {
  const [state, setState] = useState(loadInitialState)
  const [currentUser, setCurrentUser] = useState(loadAuthUser)
  const [sessions, setSessions] = useState(loadSessions)
  const [organizations, setOrganizations] = useState([])
  const [currentOrganizationId, setCurrentOrganizationId] = useState(() => {
    return localStorage.getItem('lasthit-current-org-id') || ''
  })
  const [impersonatedOrgId, setImpersonatedOrgId] = useState(() => {
    return localStorage.getItem('lasthit-impersonated-org-id') || ''
  })

  const [remoteMode] = useState(isSupabaseEnabled())
  const [remoteError, setRemoteError] = useState('')
  const [isHydrating, setIsHydrating] = useState(isSupabaseEnabled())

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Persist sessions to localStorage
  useEffect(() => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  }, [sessions])

  // Load organizations on startup
  useEffect(() => {
    if (!isSupabaseEnabled()) {
      const localOrgs = [
        { id: 'org-guaton', name: 'Restaurante Guaton XII', slug: 'guaton-xii', plan: 'Venta Única', status: 'Activo', rut: '76.999.888-k', mrr: 45000 },
        { id: 'org-dios', name: 'Restaurante El Dios', slug: 'el-dios', plan: 'Básico', status: 'Activo', rut: '77.111.222-3', mrr: 25000 },
        { id: 'org-jefe', name: 'Empresa de Jefe', slug: 'empresa-jefe', plan: 'Venta Única', status: 'Activo', rut: '76.123.456-7', mrr: 84980 },
        { id: 'org-ncxo', name: 'Ncxo+', slug: 'ncxo-plus', plan: 'Básico', status: 'Activo', rut: '', mrr: 0 },
        { id: 'org-prueba', name: 'Prueba de cambio', slug: 'prueba-de-cambio', plan: 'Empresa', status: 'Activo', rut: '76.123.456-7', mrr: 0 }
      ]
      setOrganizations(localOrgs)
      if (!currentOrganizationId) {
        setCurrentOrganizationId('org-guaton')
        localStorage.setItem('lasthit-current-org-id', 'org-guaton')
      }
      return
    }

    loadOrganizations()
      .then((orgs) => {
        setOrganizations(orgs)
        if (orgs.length > 0) {
          const savedOrgId = localStorage.getItem('lasthit-current-org-id')
          const exists = orgs.some(o => o.id === savedOrgId)
          if (exists) {
            setCurrentOrganizationId(savedOrgId)
          } else {
            setCurrentOrganizationId('')
            localStorage.removeItem('lasthit-current-org-id')
          }
        }
      })
      .catch(console.error)
  }, [])

  // Load tenant-specific state
  useEffect(() => {
    if (!currentOrganizationId) return

    localStorage.setItem('lasthit-current-org-id', currentOrganizationId)

    if (!isSupabaseEnabled()) {
      const org = organizations.find(o => o.id === currentOrganizationId)
      if (org) {
        setState(current => ({
          ...current,
          restaurant: {
            ...current.restaurant,
            name: org.name,
            primaryColor: org.slug === 'el-dios' ? '#10b981' : '#c2553d'
          }
        }))
      }
      setIsHydrating(false)
      return
    }

    setIsHydrating(true)
    let active = true
    loadRemoteState(currentOrganizationId)
      .then((remoteState) => {
        if (!active || !remoteState) return
        setState((current) => ({
          ...remoteState,
          carts: current.carts || {},
          reservations: current.reservations || [],
        }))
        setRemoteError('')
      })
      .catch((error) => {
        if (!active) return
        setRemoteError(error.message)
      })
      .finally(() => {
        if (active) setIsHydrating(false)
      })

    return () => {
      active = false
    }
  }, [currentOrganizationId, organizations])

  // Sync state between browser tabs
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
      sessions,
      organizations,
      currentOrganizationId,
      impersonatedOrgId,
      remoteMode,
      remoteError,
      isHydrating,
      async login(pinOrEmail, password) {
        // 1. Superadmin check
        if (pinOrEmail?.trim().toLowerCase() === 'diegohenriquez176@gmail.com') {
          if (password !== 'diego2412') {
            throw new Error('Contraseña incorrecta para Superadmin')
          }
          const superadminUser = {
            id: 'super-admin-user',
            name: 'Diegol Admin',
            role: 'superadmin',
            email: 'diegohenriquez176@gmail.com',
            active: true
          }
          setCurrentUser(superadminUser)
          localStorage.setItem(AUTH_KEY, JSON.stringify(superadminUser))
          return superadminUser
        }

        // 2. Email-based Restaurant Admin check
        if (pinOrEmail?.includes('@')) {
          if (remoteMode) {
            const data = await loginWithEmailAndPassword(pinOrEmail, password)
            if (!data) {
              throw new Error('Credenciales incorrectas o usuario inactivo')
            }
            const loggedUser = {
              id: data.id,
              name: data.name,
              role: data.role,
              pin: data.pin,
              email: data.email,
              active: data.active,
              organizationId: data.organization_id,
            }
            setCurrentUser(loggedUser)
            localStorage.setItem(AUTH_KEY, JSON.stringify(loggedUser))
            
            // Switch to the logged user's organization!
            setCurrentOrganizationId(data.organization_id)
            localStorage.setItem('lasthit-current-org-id', data.organization_id)
            return loggedUser
          } else {
            // Local mode fallback
            const localUser = (state.staffUsers || []).find(
              (u) => u.email?.trim().toLowerCase() === pinOrEmail.trim().toLowerCase() && u.password === password && u.active
            )
            if (!localUser) {
              throw new Error('Credenciales incorrectas o usuario inactivo')
            }
            setCurrentUser(localUser)
            localStorage.setItem(AUTH_KEY, JSON.stringify(localUser))
            return localUser
          }
        }

        // 3. PIN-based Staff login (as original)
        const users = state.staffUsers || []
        const user = users.find((u) => u.pin === pinOrEmail && u.active)
        if (!user) return null

        setCurrentUser(user)
        localStorage.setItem(AUTH_KEY, JSON.stringify(user))

        // Record session start
        const newSession = {
          id: crypto.randomUUID(),
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          loginAt: new Date().toISOString(),
          logoutAt: null,
          tablesServed: [],
          ordersCreated: [],
        }
        setSessions((prev) => [newSession, ...prev])
        return user
      },
      async registerRestaurant(restaurantName, adminName, adminEmail, adminPassword) {
        const slug = restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        const orgPayload = {
          name: restaurantName,
          slug,
          plan: 'Básico',
          status: 'Activo',
          rut: '',
          mrr: 0
        }
        
        let newOrg
        if (remoteMode) {
          newOrg = await saveRemoteOrganization(orgPayload)
        } else {
          newOrg = { ...orgPayload, id: crypto.randomUUID(), created_at: new Date().toISOString() }
        }

        // Add to state
        setOrganizations((prev) => [...prev, newOrg])

        // Create default restaurant settings
        const settingsPayload = {
          singleton: false,
          name: restaurantName,
          whatsapp: '',
          base_url: window.location.origin,
          primary_color: '#0d9488',
        }
        if (remoteMode) {
          await updateRemoteRestaurantConfig(settingsPayload, newOrg.id)
        }

        // Create admin user in staff_users
        const pin = Math.floor(1000 + Math.random() * 9000).toString()
        const staffPayload = {
          id: crypto.randomUUID(),
          name: adminName,
          role: 'administrador',
          pin,
          active: true,
          email: adminEmail.trim().toLowerCase(),
          password: adminPassword,
          createdAt: new Date().toISOString()
        }

        if (remoteMode) {
          await saveRemoteStaffUser(staffPayload, newOrg.id)
          // reload organizations
          const orgs = await loadOrganizations()
          setOrganizations(orgs)
        } else {
          persist((current) => ({
            ...current,
            staffUsers: [...(current.staffUsers || []), staffPayload]
          }))
        }
        
        return { organization: newOrg, staff: staffPayload }
      },
      logout() {
        if (currentUser && currentUser.role !== 'superadmin') {
          setSessions((prev) => {
            const idx = prev.findIndex(
              (s) => s.userId === currentUser.id && s.logoutAt === null,
            )
            if (idx >= 0) {
              const updated = [...prev]
              const session = updated[idx]
              const sessionOrders = state.orders.filter(
                (o) =>
                  o.waiterId === currentUser.id &&
                  new Date(o.createdAt) >= new Date(session.loginAt),
              )
              updated[idx] = {
                ...session,
                logoutAt: new Date().toISOString(),
                tablesServed: [...new Set(sessionOrders.map((o) => o.tableLabel))],
                ordersCreated: sessionOrders.map((o) => ({
                  id: o.id,
                  number: o.number,
                  tableLabel: o.tableLabel,
                  total: o.total,
                  status: o.status,
                  createdAt: o.createdAt,
                })),
              }
              return updated
            }
            return prev
          })
        }
        setCurrentUser(null)
        localStorage.removeItem(AUTH_KEY)

        // Clear impersonation if logging out
        if (impersonatedOrgId) {
          localStorage.removeItem('lasthit-impersonated-org-id')
          setImpersonatedOrgId('')
          // Reset to default org
          const mainOrg = organizations.find(o => o.slug === 'guaton-xii') || organizations[0]
          if (mainOrg) {
            setCurrentOrganizationId(mainOrg.id)
            localStorage.setItem('lasthit-current-org-id', mainOrg.id)
          }
        }
      },
      switchOrganization(orgId) {
        setCurrentOrganizationId(orgId)
        if (orgId) {
          localStorage.setItem('lasthit-current-org-id', orgId)
        } else {
          localStorage.removeItem('lasthit-current-org-id')
        }
      },
      impersonateTenant(tenantId) {
        if (tenantId) {
          setImpersonatedOrgId(tenantId)
          localStorage.setItem('lasthit-impersonated-org-id', tenantId)
          setCurrentOrganizationId(tenantId)
        } else {
          setImpersonatedOrgId('')
          localStorage.removeItem('lasthit-impersonated-org-id')
          localStorage.removeItem('lasthit-current-org-id')
          setCurrentOrganizationId('')
        }
      },
      async saveOrganization(org) {
        let savedOrg = org
        if (remoteMode) {
          savedOrg = await saveRemoteOrganization(org)
        } else {
          savedOrg = { ...org, id: org.id || crypto.randomUUID(), created_at: new Date().toISOString() }
        }
        setOrganizations((prev) => {
          const exists = prev.some((o) => o.id === savedOrg.id)
          if (exists) {
            return prev.map((o) => (o.id === savedOrg.id ? savedOrg : o))
          }
          return [...prev, savedOrg]
        })
        return savedOrg
      },
      async removeOrganization(orgId) {
        if (remoteMode) {
          await deleteRemoteOrganization(orgId)
        }
        setOrganizations((prev) => prev.filter((o) => o.id !== orgId))
      },
      getUserSessions(userId) {
        return sessions.filter((s) => s.userId === userId)
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
          const remoteOrder = await createRemoteOrder(payload, state, currentOrganizationId)
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
          remoteProduct = await saveRemoteProduct(product, state, currentOrganizationId)
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
                    buildProductImage(remoteProduct.name, current.restaurant.primaryColor || '#c2553d'),
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
              buildProductImage(product.name, current.restaurant.primaryColor || '#c2553d'),
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
          remoteCategory = await addRemoteCategory(name, currentOrganizationId)
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
          remoteTable = await addRemoteTable(label, currentOrganizationId)
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
          await updateRemoteRestaurantConfig(config, currentOrganizationId)
        }
        persist((current) => ({
          ...current,
          restaurant: { ...current.restaurant, ...config },
        }))
      },

      // ── Staff Users ──
      async addStaffUser(name, role) {
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
        if (remoteMode) {
          const remoteUser = await saveRemoteStaffUser(newUser, currentOrganizationId)
          persist((current) => ({
            ...current,
            staffUsers: [...(current.staffUsers || []), {
              id: remoteUser.id,
              name: remoteUser.name,
              role: remoteUser.role,
              pin: remoteUser.pin,
              active: remoteUser.active,
              createdAt: remoteUser.created_at,
            }],
          }))
          return remoteUser
        }
        persist((current) => ({
          ...current,
          staffUsers: [...(current.staffUsers || []), newUser],
        }))
        return newUser
      },
      async removeStaffUser(userId) {
        if (remoteMode) {
          await deleteRemoteStaffUser(userId)
        }
        persist((current) => ({
          ...current,
          staffUsers: (current.staffUsers || []).filter((u) => u.id !== userId),
        }))
      },
      async toggleStaffUser(userId) {
        const u = (state.staffUsers || []).find((x) => x.id === userId)
        if (!u) return
        const nextActive = !u.active
        if (remoteMode) {
          await toggleRemoteStaffUser(userId, nextActive)
        }
        persist((current) => ({
          ...current,
          staffUsers: (current.staffUsers || []).map((user) =>
            user.id === userId ? { ...user, active: nextActive } : user,
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
    [currentUser, sessions, organizations, currentOrganizationId, impersonatedOrgId, isHydrating, remoteError, remoteMode, state],
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
