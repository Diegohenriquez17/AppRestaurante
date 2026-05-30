import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, User } from 'lucide-react'
import { useAppStore } from '../store/AppStore.jsx'
import { formatTableName, slugify } from '../lib/format.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { useScrollSpy } from '../hooks/useScrollSpy.js'
import { SyncBanner } from '../components/ui/SyncBanner.jsx'
import { MenuHeader } from '../components/menu/MenuHeader.jsx'
import { MenuNavBar, MenuIndex } from '../components/menu/MenuNav.jsx'
import {
  FeaturedDish,
  ProductRow,
  PromoBanner,
  SectionHeader,
} from '../components/menu/ProductCards.jsx'
import { CartContent, CartDrawer, FloatingCartButton } from '../components/menu/Cart.jsx'
import { OrderStatus, ToastNotification } from '../components/menu/OrderStatus.jsx'

export function MenuPage({ isGarzon }) {
  const {
    state,
    remoteError,
    isHydrating,
    createOrder,
    getCartForTable,
    updateCartItem,
    removeFromCart,
    clearCart,
    setCartNote,
    setCartItemNote,
    setCartTip,
    currentUser,
  } = useAppStore()
  const { mesaId = 'mesa-01' } = useParams()
  const cart = getCartForTable(mesaId)
  usePageTitle(`Menu ${formatTableName(mesaId)} | ${state.restaurant.name}`)
  const [search, setSearch] = useState('')
  const [customerNote, setCustomerNote] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [guestCount, setGuestCount] = useState(2)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')

  const available = state.products.filter((p) => p.available)
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const featuredProducts = available.filter((p) => p.featured).slice(0, 6)
  const promoProducts = available.filter((p) => p.category === 'Promociones').slice(0, 4)

  // Secciones tipo carta, en el orden de las categorías.
  const sections = state.categories
    .map((cat) => ({
      id: `sec-${slugify(cat.name)}`,
      name: cat.name,
      items: available.filter((p) => p.category === cat.name),
    }))
    .filter((s) => s.items.length)
    .map((s, i) => ({ ...s, index: i + 1, count: s.items.length }))

  const activeId = useScrollSpy(sections.map((s) => s.id))

  const searching = search.trim().length > 0
  const searchResults = searching
    ? available.filter((p) =>
        `${p.name} ${p.description}`.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : []

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount =
    subtotal <= 0
      ? 0
      : subtotal >= 25000
        ? Math.round(subtotal * 0.1)
        : state.promotions[0]?.active
          ? Math.min(state.promotions[0].discountAmount, subtotal)
          : 0
  const payableBase = Math.max(0, subtotal - discount)
  const tipAmount = Math.round(payableBase * ((cart.tipPercent ?? 10) / 100))
  const total = payableBase + tipAmount
  const activeOrders = state.orders.filter(
    (order) => order.tableId === mesaId && !['Entregado', 'Cancelado'].includes(order.status),
  )

  const handleAddProduct = (product) => {
    updateCartItem(mesaId, product, 1)
    setToast(`${product.name} agregado`)
    window.clearTimeout(window.__lasthitToast)
    window.__lasthitToast = window.setTimeout(() => setToast(''), 1800)
  }

  const handleSubmitOrder = async () => {
    if (!cart.items.length) return
    const details = [
      customerName ? `Cliente: ${customerName}` : '',
      guestCount ? `Personas: ${guestCount}` : '',
      customerNote ? `Nota: ${customerNote}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    setCartNote(mesaId, details)
    await createOrder({
      mesaId,
      items: cart.items,
      note: details,
      subtotal,
      discount,
      tipAmount,
      total,
      orderType: 'Comer en el local',
      waiterId: isGarzon && currentUser ? currentUser.id : undefined,
      waiterName: isGarzon && currentUser ? currentUser.name : undefined,
    })
    clearCart(mesaId)
    setCustomerNote('')
    setCustomerName('')
    setCartOpen(false)
  }

  const qtyOf = (id) => cart.items.find((item) => item.id === id)?.quantity ?? 0

  const cartContentProps = {
    mesaId,
    cart,
    customerName,
    setCustomerName,
    guestCount,
    setGuestCount,
    customerNote,
    setCustomerNote,
    subtotal,
    discount,
    tipAmount,
    total,
    updateCartItem,
    removeFromCart,
    setCartItemNote,
    setCartTip,
    onSubmit: handleSubmitOrder,
  }

  return (
    <main className="min-h-screen bg-cream pb-28 text-ink lg:pb-12">
      {isHydrating ? <SyncBanner text="Conectando con Supabase..." /> : null}
      {remoteError ? (
        <SyncBanner text={`Supabase no disponible: ${remoteError}`} warning />
      ) : null}

      {isGarzon && currentUser ? (
        <div className="flex items-center justify-between gap-3 bg-emerald-700 px-4 py-2 text-white">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span className="text-sm font-bold">Garzón: {currentUser.name}</span>
          </div>
          <Link
            to="/garzon"
            className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold transition hover:bg-white/25"
          >
            ← Volver a mesas
          </Link>
        </div>
      ) : null}

      <MenuHeader restaurant={state.restaurant} mesaId={mesaId} />

      <MenuNavBar sections={sections} activeId={activeId} search={search} onSearch={setSearch} />

      <div className="mx-auto grid max-w-7xl gap-x-10 px-6 py-8 lg:grid-cols-[180px_minmax(0,1fr)_340px] lg:px-10">
        {/* Índice (desktop) */}
        <MenuIndex sections={sections} activeId={activeId} />

        {/* Contenido */}
        <div className="min-w-0">
          {activeOrders.length ? (
            <div className="mb-8 grid gap-4">
              {activeOrders.map((order) => (
                <OrderStatus key={order.id} order={order} />
              ))}
            </div>
          ) : null}

          {searching ? (
            <section>
              <SectionHeader index={1} title="Resultados" count={searchResults.length} />
              {searchResults.length ? (
                <div className="divide-y divide-cream-200">
                  {searchResults.map((product, i) => (
                    <ProductRow
                      key={product.id}
                      index={i + 1}
                      product={product}
                      quantity={qtyOf(product.id)}
                      onAdd={handleAddProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-16 text-center">
                  <Search className="h-8 w-8 text-cream-300" />
                  <p className="font-display text-xl font-semibold text-ink">Sin resultados</p>
                  <p className="text-sm text-ink-muted">
                    No encontramos “{search}”. Prueba con otra palabra.
                  </p>
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Destacados / promos */}
              {(promoProducts.length || featuredProducts.length) ? (
                <section className="mb-12">
                  <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-500">
                    De la casa
                  </p>
                  <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] lg:mx-0 lg:px-0">
                    {promoProducts.map((product) => (
                      <PromoBanner key={product.id} product={product} onAdd={handleAddProduct} />
                    ))}
                    {featuredProducts.map((product) => (
                      <FeaturedDish key={product.id} product={product} onAdd={handleAddProduct} />
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Secciones de la carta */}
              <div className="space-y-14">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-32">
                    <SectionHeader
                      index={section.index}
                      title={section.name}
                      count={section.count}
                    />
                    <div className="divide-y divide-cream-200">
                      {section.items.map((product, i) => (
                        <ProductRow
                          key={product.id}
                          index={i + 1}
                          product={product}
                          quantity={qtyOf(product.id)}
                          onAdd={handleAddProduct}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Carrito (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto overscroll-contain rounded-3xl border border-cream-200 bg-white p-5 shadow-soft [scrollbar-width:thin]">
            <CartContent {...cartContentProps} />
          </div>
        </aside>
      </div>

      <FloatingCartButton count={itemCount} total={total} onClick={() => setCartOpen(true)} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}>
        <CartContent {...cartContentProps} />
      </CartDrawer>

      {toast ? <ToastNotification text={toast} /> : null}
    </main>
  )
}
