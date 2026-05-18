import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  BadgePercent,
  BarChart3,
  CalendarDays,
  ChefHat,
  CheckCircle2,
  ChevronDown,
  Check,
  ClipboardList,
  Clock3,
  DollarSign,
  Download,
  Eye,
  Flame,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Minus,
  Package,
  Pencil,
  Plus,
  QrCode,
  Search,
  Settings,
  Share2,
  ShoppingBag,
  Tags,
  Trash2,
  TrendingUp,
  User,
  UserCog,
  Users,
  X,
} from 'lucide-react'
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import { useAppStore } from './store/AppStore.jsx'

const currency = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  className = '',
  buttonClassName = '',
  disabled = false,
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef(null)
  const listRef = useRef(null)

  const normalized = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt,
  )
  const current = normalized.find((opt) => opt.value === value)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    const onEsc = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const idx = normalized.findIndex((opt) => opt.value === value)
    setActiveIndex(idx >= 0 ? idx : 0)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = (e) => {
    if (disabled) return
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(normalized.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const opt = normalized[activeIndex]
      if (opt) {
        onChange(opt.value)
        setOpen(false)
      }
    }
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2.5 text-left text-[0.92rem] text-stone-800 outline-none transition disabled:cursor-not-allowed disabled:opacity-50 ${
          open ? 'border-[#c2553d] ring-2 ring-[#c2553d]/15' : 'border-stone-200 hover:border-stone-300'
        } ${buttonClassName}`}
      >
        <span className={current ? 'truncate' : 'truncate text-stone-400'}>
          {current ? current.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-stone-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-1.5 max-h-64 overflow-y-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg shadow-stone-900/10"
        >
          {normalized.map((opt, idx) => {
            const isSelected = opt.value === value
            const isActive = idx === activeIndex
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-[0.92rem] transition ${
                  isActive
                    ? 'bg-[#fbf2ea] text-[#9a3f2c]'
                    : isSelected
                      ? 'text-[#9a3f2c]'
                      : 'text-stone-700'
                }`}
              >
                <span className="truncate font-medium">{opt.label}</span>
                {isSelected ? <Check size={15} className="shrink-0 text-[#c2553d]" /> : null}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/menu/:mesaId" element={<MenuPage />} />
      <Route path="/cocina" element={<KitchenPage />} />
      <Route path="/pos" element={<PosPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProductsPage />} />
        <Route path="categorias" element={<AdminCategoriesPage />} />
        <Route path="promociones" element={<AdminPromotionsPage />} />
        <Route path="mesas" element={<AdminTablesPage />} />
        <Route path="pedidos" element={<AdminOrdersPage />} />
        <Route path="clientes" element={<AdminCustomersPage />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="configuracion" element={<AdminConfigPage />} />
        <Route path="reportes" element={<AdminReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function MenuPage() {
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
  } = useAppStore()
  const { mesaId = 'mesa-01' } = useParams()
  const cart = getCartForTable(mesaId)
  usePageTitle(`Menu ${formatTableName(mesaId)} | ${state.restaurant.name}`)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')
  const [tag, setTag] = useState('todos')
  const [customerNote, setCustomerNote] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [guestCount, setGuestCount] = useState(2)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')

  const categories = ['Todos', ...state.categories.map((item) => item.name)]
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const featuredProducts = state.products
    .filter((product) => product.available && product.featured)
    .slice(0, 5)
  const promoProducts = state.products
    .filter((product) => product.available && product.category === 'Promociones')
    .slice(0, 4)
  const filteredProducts = state.products.filter((product) => {
    if (!product.available) return false
    if (
      search &&
      !`${product.name} ${product.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    ) {
      return false
    }
    if (category !== 'Todos' && product.category !== category) {
      return false
    }
    if (tag === 'vegetariano' && !product.vegetarian) {
      return false
    }
    if (tag === 'destacado' && !product.featured) {
      return false
    }
    return true
  })

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
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
    const order = await createOrder({
      mesaId,
      items: cart.items,
      note: details,
      subtotal,
      discount,
      tipAmount,
      total,
      orderType: 'Comer en el local',
    })
    clearCart(mesaId)
    setCustomerNote('')
    setCustomerName('')
    setCartOpen(false)
  }

  return (
    <main className="min-h-screen bg-stone-50 pb-28 text-stone-950 lg:pb-8">
      {isHydrating ? <SyncBanner text="Conectando con Supabase..." /> : null}
      {remoteError ? (
        <SyncBanner text={`Supabase no disponible: ${remoteError}`} warning />
      ) : null}

      <MenuHeader restaurant={state.restaurant} mesaId={mesaId} />

      <section className="sticky top-0 z-30 border-b border-stone-200 bg-stone-50/95 px-4 py-3 backdrop-blur lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-3">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryChips categories={categories} active={category} onChange={setCategory} />
          <FilterChips active={tag} onChange={setTag} />
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <section className="grid gap-7">
          {activeOrders.map((order) => (
            <OrderStatus key={order.id} order={order} />
          ))}
          {promoProducts.length ? (
            <section className="grid gap-3">
              <SectionTitle title="Promociones" subtitle="Combos y ofertas de hoy" />
              <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
                {promoProducts.map((product) => (
                  <PromoBanner key={product.id} product={product} onAdd={handleAddProduct} />
                ))}
              </div>
            </section>
          ) : null}

          {featuredProducts.length ? (
            <section className="grid gap-3">
              <SectionTitle title="Más pedidos" subtitle="Favoritos de la casa" />
              <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
                {featuredProducts.map((product) => (
                  <RecommendedCard
                    key={product.id}
                    product={product}
                    onAdd={handleAddProduct}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="grid gap-3">
            <SectionTitle title="Menu" subtitle={`${filteredProducts.length} productos disponibles`} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cart.items.find((item) => item.id === product.id)?.quantity ?? 0}
                  onAdd={handleAddProduct}
                />
              ))}
            </div>
          </section>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto overscroll-contain rounded-2xl border border-stone-200 bg-white p-4 shadow-soft [scrollbar-width:thin]">
            <CartContent
              mesaId={mesaId}
              cart={cart}
              customerName={customerName}
              setCustomerName={setCustomerName}
              guestCount={guestCount}
              setGuestCount={setGuestCount}
              customerNote={customerNote}
              setCustomerNote={setCustomerNote}
              subtotal={subtotal}
              discount={discount}
              tipAmount={tipAmount}
              total={total}
              updateCartItem={updateCartItem}
              removeFromCart={removeFromCart}
              setCartItemNote={setCartItemNote}
              setCartTip={setCartTip}
              onSubmit={handleSubmitOrder}
            />
          </div>
        </aside>
      </div>

      <FloatingCartButton
        count={itemCount}
        total={total}
        onClick={() => setCartOpen(true)}
      />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}>
        <CartContent
          mesaId={mesaId}
          cart={cart}
          customerName={customerName}
          setCustomerName={setCustomerName}
          guestCount={guestCount}
          setGuestCount={setGuestCount}
          customerNote={customerNote}
          setCustomerNote={setCustomerNote}
          subtotal={subtotal}
          discount={discount}
          tipAmount={tipAmount}
          total={total}
          updateCartItem={updateCartItem}
          removeFromCart={removeFromCart}
          setCartItemNote={setCartItemNote}
          setCartTip={setCartTip}
          onSubmit={handleSubmitOrder}
        />
      </CartDrawer>

      {toast ? <ToastNotification text={toast} /> : null}
    </main>
  )
}

function MenuHeader({ restaurant, mesaId }) {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-4 lg:px-8 lg:pt-8">
        <div
          className="relative overflow-hidden rounded-[2rem] bg-stone-950 p-5 text-white shadow-soft sm:p-7 lg:p-9"
          style={{
            background:
              'radial-gradient(circle at 12% 20%, rgba(194,85,61,0.32), transparent 28%), radial-gradient(circle at 88% 8%, rgba(217,150,65,0.28), transparent 32%), linear-gradient(135deg, #1c1410 0%, #2a201a 55%, #2f2620 100%)',
          }}
        >
          <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-white/10 blur-sm" />
          <div className="absolute bottom-4 right-4 hidden h-32 w-32 rounded-[2rem] bg-gradient-to-br from-rose-400 to-orange-300 opacity-80 shadow-2xl sm:block" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-400 text-xl font-black text-stone-950 shadow-lg shadow-orange-950/30">
                  A
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
                    AcroDevs Restaurant
                  </p>
                  <h1 className="text-2xl font-black leading-tight sm:text-4xl">
                    {restaurant.name}
                  </h1>
                </div>
              </div>
              <p className="mt-5 max-w-xl text-lg font-semibold text-white">
                Haz tu pedido desde la mesa
              </p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-stone-300 sm:text-base">
                Escoge, agrega notas y envia tu orden directo a cocina.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-3xl border border-white/10 bg-white/10 p-2 backdrop-blur">
              <MenuHeaderStat label="Mesa" value={formatTableName(mesaId).replace('Mesa ', '')} />
              <MenuHeaderStat label="Estado" value="Abierto" />
              <MenuHeaderStat label="Tiempo" value="15-20" suffix="min" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function MenuHeaderStat({ label, value, suffix }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 text-center ring-1 ring-white/10">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-stone-300">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-white">
        {value}
        {suffix ? <span className="ml-1 text-xs font-bold text-stone-300">{suffix}</span> : null}
      </p>
    </div>
  )
}

function SearchBar({ value, onChange }) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
      <input
        className="h-14 w-full rounded-2xl border border-stone-200 bg-white pl-12 pr-4 text-base font-semibold text-stone-950 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar comida, bebida o promoción..."
        aria-label="Buscar productos"
      />
    </label>
  )
}

function CategoryChips({ categories, active, onChange }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:px-0">
      {categories.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`shrink-0 rounded-full px-5 py-3 text-sm font-black transition ${
            active === item
              ? 'bg-stone-950 text-white shadow-lg shadow-stone-300'
              : 'border border-stone-200 bg-white text-stone-600 shadow-sm'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

function FilterChips({ active, onChange }) {
  const filters = [
    { id: 'todos', label: 'Todo' },
    { id: 'vegetariano', label: 'Vegetariano' },
    { id: 'destacado', label: 'Destacado' },
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onChange(filter.id)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${
            active === filter.id
              ? 'bg-orange-500 text-stone-950 shadow-md shadow-orange-100'
              : 'bg-white text-stone-500 ring-1 ring-stone-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-black text-stone-950 sm:text-2xl">{title}</h2>
        <p className="text-sm font-semibold text-stone-500">{subtitle}</p>
      </div>
    </div>
  )
}

function PromoBanner({ product, onAdd }) {
  return (
    <motion.article
      whileTap={{ scale: 0.98 }}
      className="grid min-w-[285px] grid-cols-[1fr_112px] overflow-hidden rounded-3xl bg-stone-950 text-white shadow-soft sm:min-w-[360px]"
    >
      <div className="grid gap-3 p-4">
        <span className="w-fit rounded-full bg-rose-500 px-3 py-1 text-xs font-black uppercase tracking-[0.12em]">
          Promo
        </span>
        <div>
          <h3 className="text-xl font-black leading-tight">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-stone-300">{product.description}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <strong className="text-lg">{currency.format(product.price)}</strong>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="rounded-full bg-orange-400 px-4 py-2 text-sm font-black text-stone-950"
          >
            Agregar
          </button>
        </div>
      </div>
      <div
        className="bg-cover bg-center"
        style={{ backgroundImage: `url("${product.image}")` }}
        aria-hidden="true"
      />
    </motion.article>
  )
}

function RecommendedCard({ product, onAdd }) {
  return (
    <motion.article
      whileTap={{ scale: 0.98 }}
      className="min-w-[235px] overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
    >
      <div
        className="h-32 bg-stone-200 bg-cover bg-center"
        style={{ backgroundImage: `url("${product.image}")` }}
      />
      <div className="grid gap-2 p-4">
        <div className="flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] text-orange-500">
          <Flame className="h-4 w-4" />
          Más pedido
        </div>
        <h3 className="line-clamp-1 text-lg font-black text-stone-950">{product.name}</h3>
        <div className="flex items-center justify-between">
          <strong>{currency.format(product.price)}</strong>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="grid h-10 w-10 place-items-center rounded-full bg-stone-950 text-white"
            aria-label={`Agregar ${product.name}`}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

function ProductCard({ product, quantity, onAdd }) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      className="overflow-hidden rounded-[1.7rem] border border-stone-200 bg-white shadow-sm transition hover:shadow-soft"
    >
      <div className="relative">
        <div
          className="h-48 bg-stone-200 bg-cover bg-center sm:h-44"
          style={{ backgroundImage: `url("${product.image}")` }}
        />
        {quantity ? (
          <span className="absolute right-3 top-3 rounded-full bg-stone-950 px-3 py-1 text-sm font-black text-white shadow-lg">
            {quantity} en pedido
          </span>
        ) : null}
      </div>
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {product.featured ? <ProductBadge label="Destacado" tone="amber" /> : null}
          {product.vegetarian ? <ProductBadge label="Vegetariano" tone="green" /> : null}
          {product.category === 'Promociones' ? <ProductBadge label="Promo" tone="rose" /> : null}
        </div>
        <div>
          <h3 className="text-xl font-black leading-tight text-stone-950">{product.name}</h3>
          <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-stone-500">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm font-bold text-stone-400">
          <span>{product.category}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4" />
            {product.prepTime} min
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <strong className="text-xl font-black text-stone-950">
            {currency.format(product.price)}
          </strong>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 text-sm font-black text-stone-950 shadow-lg shadow-orange-100 transition hover:bg-orange-400"
          >
            <Plus className="h-5 w-5" />
            Agregar
          </button>
        </div>
      </div>
    </motion.article>
  )
}

function ProductBadge({ label, tone }) {
  const tones = {
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-orange-50 text-orange-700',
    rose: 'bg-rose-50 text-rose-700',
  }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${tones[tone]}`}>
      {label}
    </span>
  )
}

function FloatingCartButton({ count, total, onClick }) {
  if (!count) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed inset-x-4 bottom-4 z-40 flex h-16 items-center justify-between rounded-2xl bg-stone-950 px-5 text-left text-white shadow-2xl shadow-stone-400/40 lg:hidden"
    >
      <span className="inline-flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-400 text-stone-950">
          <ShoppingBag className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-black">Ver pedido</span>
          <span className="text-xs text-stone-300">{count} productos</span>
        </span>
      </span>
      <strong className="text-lg">{currency.format(total)}</strong>
    </button>
  )
}

function CartDrawer({ open, onClose, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-stone-950/55 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar pedido"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[2rem] bg-white p-4 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <strong className="text-lg font-black text-stone-950">Tu pedido</strong>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-stone-100 text-stone-600"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}

function CartContent({
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
  onSubmit,
}) {
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl bg-stone-950 p-4 text-white">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-300">
          Pedido mesa
        </p>
        <div className="mt-2 flex items-center justify-between">
          <strong className="text-2xl font-black">{formatTableName(mesaId)}</strong>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
            {cart.items.length} items
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_110px] gap-2">
        <label className="grid gap-1">
          <span className="text-xs font-black uppercase tracking-[0.12em] text-stone-400">
            Nombre opcional
          </span>
          <span className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 pl-9 pr-3 font-semibold outline-none focus:border-orange-400"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Tu nombre"
            />
          </span>
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-black uppercase tracking-[0.12em] text-stone-400">
            Personas
          </span>
          <span className="relative">
            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 pl-9 pr-2 font-semibold outline-none focus:border-orange-400"
              type="number"
              min="1"
              value={guestCount}
              onChange={(event) => setGuestCount(Number(event.target.value))}
            />
          </span>
        </label>
      </div>

      <div className="grid gap-3">
        {cart.items.length ? (
          cart.items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-stone-200 bg-white p-3">
              <div className="grid grid-cols-[58px_1fr_auto] gap-3">
                <div
                  className="h-14 w-14 rounded-2xl bg-stone-200 bg-cover bg-center"
                  style={{ backgroundImage: `url("${item.image}")` }}
                />
                <div>
                  <strong className="line-clamp-1 text-sm font-black text-stone-950">
                    {item.name}
                  </strong>
                  <p className="mt-1 text-sm font-bold text-stone-500">
                    {currency.format(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <CartQuantityButton
                    label="Restar"
                    onClick={() => updateCartItem(mesaId, item, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </CartQuantityButton>
                  <span className="w-7 text-center text-sm font-black">{item.quantity}</span>
                  <CartQuantityButton
                    label="Sumar"
                    onClick={() => updateCartItem(mesaId, item, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </CartQuantityButton>
                </div>
              </div>
              <div className="mt-3 grid gap-2">
                <input
                  className="h-11 rounded-2xl border border-stone-200 bg-stone-50 px-3 text-sm font-semibold outline-none focus:border-orange-400"
                  value={item.notes ?? ''}
                  onChange={(event) => setCartItemNote(mesaId, item.id, event.target.value)}
                  placeholder="Nota: sin mayo, sin cebolla..."
                />
                <button
                  type="button"
                  onClick={() => removeFromCart(mesaId, item.id)}
                  className="inline-flex w-fit items-center gap-2 text-sm font-black text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Quitar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-5 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-stone-300" />
            <p className="mt-2 font-black text-stone-950">Tu pedido esta vacio</p>
            <p className="text-sm text-stone-500">Agrega productos del menu para comenzar.</p>
          </div>
        )}
      </div>

      <label className="grid gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-black text-stone-700">
          <MessageSquare className="h-4 w-4" />
          Nota general
        </span>
        <textarea
          className="min-h-24 rounded-2xl border border-stone-200 bg-stone-50 p-3 text-sm font-semibold outline-none focus:border-orange-400"
          value={customerNote}
          onChange={(event) => setCustomerNote(event.target.value)}
          placeholder="Ej: una bebida sin hielo, traer cubiertos..."
        />
      </label>

      <div className="grid gap-2 rounded-2xl bg-stone-50 p-3">
        <p className="text-sm font-black text-stone-700">Propina sugerida</p>
        <div className="grid grid-cols-3 gap-2">
          {[0, 10, 15].map((tip) => (
            <button
              key={tip}
              type="button"
              onClick={() => setCartTip(mesaId, tip)}
              className={`rounded-2xl px-3 py-2 text-sm font-black ${
                (cart.tipPercent ?? 10) === tip
                  ? 'bg-stone-950 text-white'
                  : 'bg-white text-stone-600 ring-1 ring-stone-200'
              }`}
            >
              {tip}%
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 rounded-2xl border border-stone-200 p-4 text-sm font-bold text-stone-500">
        <CartTotalLine label="Subtotal" value={subtotal} />
        <CartTotalLine label="Descuento" value={-discount} />
        <CartTotalLine label="Propina" value={tipAmount} />
        <div className="mt-2 flex items-center justify-between border-t border-stone-200 pt-3 text-lg font-black text-stone-950">
          <span>Total</span>
          <span>{currency.format(total)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!cart.items.length}
        className="h-14 rounded-2xl bg-orange-500 text-base font-black text-stone-950 shadow-lg shadow-orange-100 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
      >
        Enviar pedido
      </button>
    </div>
  )
}

function CartQuantityButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-stone-700"
      aria-label={label}
    >
      {children}
    </button>
  )
}

function CartTotalLine({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span>{currency.format(value)}</span>
    </div>
  )
}

function OrderStatus({ order }) {
  const steps = [
    { key: 'Pendiente', label: 'Pedido recibido', icon: ClipboardList, description: 'Tu pedido fue enviado a cocina' },
    { key: 'En preparación', label: 'Preparando', icon: ChefHat, description: 'El chef está preparando tu orden' },
    { key: 'Listo', label: '¡Listo!', icon: CheckCircle2, description: 'Tu pedido está listo para servir' },
    { key: 'Entregado', label: 'Entregado', icon: ShoppingBag, description: '¡Buen provecho!' },
  ]
  const normalizedStatus = order.status === 'En preparaciÃ³n' ? 'En preparación' : order.status
  const activeIndex = Math.max(0, steps.findIndex((s) => s.key === normalizedStatus))
  const ActiveIcon = steps[activeIndex].icon

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/80 p-5 shadow-lg shadow-orange-100/40"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">
            Seguimiento en vivo
          </p>
          <h2 className="mt-1 text-2xl font-black text-stone-950">
            Pedido #{order.number}
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {order.tableLabel} · {formatTime(order.createdAt)}
          </p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200">
          <ActiveIcon size={24} />
        </div>
      </div>

      <div className="relative mb-5">
        <div className="h-2.5 rounded-full bg-stone-200">
          <motion.div
            className="h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
            initial={{ width: '0%' }}
            animate={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === activeIndex
          const isCompleted = index < activeIndex

          return (
            <div key={step.key} className="flex flex-col items-center gap-2 text-center">
              <div
                className={`relative grid h-11 w-11 place-items-center rounded-xl transition-all duration-500 ${
                  isCompleted
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                    : isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 ring-4 ring-orange-100'
                      : 'bg-stone-100 text-stone-400'
                }`}
              >
                <Icon size={20} />
                {isActive ? (
                  <span className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white bg-orange-400" />
                ) : null}
              </div>
              <div>
                <p
                  className={`text-xs font-black leading-tight ${
                    isCompleted || isActive ? 'text-orange-800' : 'text-stone-400'
                  }`}
                >
                  {step.label}
                </p>
                {isActive ? (
                  <p className="mt-0.5 text-[0.65rem] font-semibold leading-tight text-orange-600">
                    {step.description}
                  </p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}

function ToastNotification({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed left-1/2 top-4 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-stone-950 px-4 py-3 text-sm font-black text-white shadow-2xl"
    >
      <CheckCircle2 className="h-5 w-5 text-orange-400" />
      {text}
    </motion.div>
  )
}

function KitchenPage() {
  const { state, updateOrderStatus, remoteMode } = useAppStore()
  usePageTitle(`Cocina | ${state.restaurant.name}`)
  const [tab, setTab] = useState('activa')
  const [fadingOrders, setFadingOrders] = useState(new Set())
  const today = new Date().toISOString().slice(0, 10)

  const activeOrders = [...state.orders]
    .filter((order) =>
      ['Pendiente', 'En preparación'].includes(order.status) || fadingOrders.has(order.id),
    )
    .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt))

  const todayCompletedOrders = [...state.orders]
    .filter((order) => {
      if (fadingOrders.has(order.id)) return false
      if (!['Listo', 'Entregado', 'Cancelado'].includes(order.status)) return false
      return new Date(order.createdAt).toISOString().slice(0, 10) === today
    })
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))

  const handleMarkReady = (orderId) => {
    void updateOrderStatus(orderId, 'Listo')
    setFadingOrders((prev) => new Set([...prev, orderId]))
    setTimeout(() => {
      setFadingOrders((prev) => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    }, 1500)
  }

  return (
    <main className="grid gap-5 w-full px-4 py-5 sm:px-6 lg:px-8">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-soft sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">KDS</p>
          <h1 className="mt-2 text-3xl font-black text-stone-950">Cocina en tiempo real</h1>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <KitchenCounter label={remoteMode ? 'Supabase' : 'Local'} value="Activo" />
          <KitchenCounter label="Pendientes" value={activeOrders.filter((order) => order.status === 'Pendiente').length} />
          <KitchenCounter label="Preparando" value={state.orders.filter((order) => order.status === 'En preparación').length} />
          <KitchenCounter label="Listos" value={state.orders.filter((order) => order.status === 'Listo').length} />
          <KitchenCounter label="Entregados hoy" value={todayCompletedOrders.filter((order) => order.status === 'Entregado').length} />
        </div>
      </section>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('activa')}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition ${
            tab === 'activa'
              ? 'bg-stone-950 text-white shadow-lg shadow-stone-300'
              : 'border border-stone-200 bg-white text-stone-600 shadow-sm'
          }`}
        >
          <Flame size={18} />
          Cocina activa
          {activeOrders.length ? (
            <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-black text-white">
              {activeOrders.length}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => setTab('historial')}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition ${
            tab === 'historial'
              ? 'bg-stone-950 text-white shadow-lg shadow-stone-300'
              : 'border border-stone-200 bg-white text-stone-600 shadow-sm'
          }`}
        >
          <ClipboardList size={18} />
          Pedidos de hoy
          {todayCompletedOrders.length ? (
            <span className="rounded-full bg-stone-500 px-2.5 py-0.5 text-xs font-black text-white">
              {todayCompletedOrders.length}
            </span>
          ) : null}
        </button>
      </div>

      {tab === 'activa' ? (
        <section className="grid gap-4">
          {activeOrders.length ? (
            activeOrders.map((order) => (
              <motion.article
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`grid gap-4 rounded-xl border bg-white p-4 shadow-soft xl:grid-cols-[210px_minmax(260px,1fr)_minmax(220px,0.8fr)_260px] xl:items-center transition-all duration-700 ${getKitchenBorderClass(order.status)} ${fadingOrders.has(order.id) ? 'scale-95 opacity-40 bg-orange-50 border-orange-400' : ''}`}
              >
                <div className="grid gap-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-400">
                      Pedido #{order.number}
                    </p>
                    <h2 className="text-2xl font-black text-stone-950">{order.tableLabel}</h2>
                  </div>
                  <span className={`status-badge status-${slugify(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid gap-2">
                  <div className="flex flex-wrap gap-2 text-sm text-stone-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={16} />
                      {formatTime(order.createdAt)}
                    </span>
                    <span>{elapsedMinutes(order.createdAt)} min</span>
                    <span>{currency.format(order.total)}</span>
                  </div>
                  <ul className="grid gap-1 text-stone-800">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        <strong>{item.quantity}x</strong> {item.name}
                        {item.notes ? (
                          <span className="ml-2 rounded bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                            📝 {item.notes}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-stone-50 p-3 text-sm text-stone-600">
                  {order.note ? (
                    <>
                    <strong>Notas:</strong>
                    <p>{order.note}</p>
                    </>
                  ) : (
                    <span>Sin notas especiales.</span>
                  )}
                </div>

                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                  {order.status === 'Pendiente' ? (
                    <button
                      type="button"
                      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 font-black text-amber-700"
                      onClick={() => void updateOrderStatus(order.id, 'En preparación')}
                    >
                      Preparar
                    </button>
                  ) : null}
                  {order.status === 'Pendiente' || order.status === 'En preparación' ? (
                    <button
                      type="button"
                      className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 font-black text-orange-700"
                      onClick={() => handleMarkReady(order.id)}
                    >
                      Listo
                    </button>
                  ) : null}
                  {fadingOrders.has(order.id) ? (
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 font-black text-white">
                      <CheckCircle2 size={18} />
                      Moviendo a pedidos de hoy...
                    </div>
                  ) : null}
                </div>
              </motion.article>
            ))
          ) : (
            <div className="rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 p-10 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-orange-400" />
              <strong className="mt-4 block text-xl text-orange-800">¡Todo al día!</strong>
              <p className="mt-1 text-orange-600">No hay pedidos pendientes en cocina.</p>
            </div>
          )}
        </section>
      ) : (
        <section className="grid gap-4">
          {todayCompletedOrders.length ? (
            todayCompletedOrders.map((order) => (
              <motion.article
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl border bg-white p-4 shadow-soft ${getKitchenBorderClass(order.status)}`}
              >
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                      Pedido #{order.number}
                    </p>
                    <h2 className="text-xl font-black text-stone-950">{order.tableLabel}</h2>
                    <p className="mt-1 text-sm text-stone-500">{formatTime(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong className="text-lg font-black text-stone-950">{currency.format(order.total)}</strong>
                    <span className={`status-badge status-${slugify(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid gap-2 rounded-lg bg-stone-50 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-400">Detalle del pedido</p>
                  <ul className="grid gap-1 text-sm text-stone-800">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-start gap-2">
                        <span><strong>{item.quantity}x</strong> {item.name} — {currency.format(item.price * item.quantity)}</span>
                        {item.notes ? (
                          <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                            📝 {item.notes}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>

                {order.note ? (
                  <div className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                    <strong>Notas del cliente:</strong> {order.note}
                  </div>
                ) : null}

                <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-stone-500">
                  <div className="rounded-lg bg-stone-50 p-2 text-center">
                    <p className="text-[0.65rem] font-black uppercase text-stone-400">Subtotal</p>
                    <strong className="text-stone-700">{currency.format(order.subtotal)}</strong>
                  </div>
                  <div className="rounded-lg bg-stone-50 p-2 text-center">
                    <p className="text-[0.65rem] font-black uppercase text-stone-400">Descuento</p>
                    <strong className="text-stone-700">{currency.format(order.discount)}</strong>
                  </div>
                  <div className="rounded-lg bg-stone-50 p-2 text-center">
                    <p className="text-[0.65rem] font-black uppercase text-stone-400">Propina</p>
                    <strong className="text-stone-700">{currency.format(order.tipAmount)}</strong>
                  </div>
                </div>

                {order.status === 'Listo' ? (
                  <button
                    type="button"
                    className="mt-3 w-full rounded-lg bg-stone-950 px-4 py-3 font-black text-white shadow-lg transition hover:bg-stone-800"
                    onClick={() => void updateOrderStatus(order.id, 'Entregado')}
                  >
                    Marcar entregado ✓
                  </button>
                ) : null}
              </motion.article>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center text-stone-500">
              <ClipboardList className="mx-auto h-12 w-12 text-stone-300" />
              <strong className="mt-3 block text-lg text-stone-700">Sin pedidos completados hoy</strong>
              <p className="mt-1">Los pedidos entregados aparecerán aquí como registro del día.</p>
            </div>
          )}
        </section>
      )}
    </main>
  )
}

function PosPage() {
  const { state } = useAppStore()
  usePageTitle(`POS | ${state.restaurant.name}`)

  return (
    <main className="generic-page">
      <section className="section-header">
        <div>
          <p className="eyebrow">POS demo</p>
          <h1>Resumen operativo</h1>
        </div>
      </section>
      <section className="stats-grid">
        <StatCard
          label="Productos activos"
          value={state.products.filter((item) => item.available).length}
        />
        <StatCard label="Mesas creadas" value={state.tables.length} />
        <StatCard label="Pedidos hoy" value={state.orders.length} />
        <StatCard
          label="Venta demo"
          value={currency.format(state.orders.reduce((sum, item) => sum + item.total, 0))}
        />
      </section>
    </main>
  )
}

function AdminLayout() {
  const { state, remoteMode } = useAppStore()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    ['Dashboard', '/admin', LayoutDashboard],
    ['Pedidos', '/admin/pedidos', ClipboardList],
    ['Cocina', '/cocina', ChefHat, true],
    ['Mesas', '/admin/mesas', QrCode],
    ['Productos', '/admin/productos', Package],
    ['Categorías', '/admin/categorias', Tags],
    ['Promociones', '/admin/promociones', BadgePercent],
    ['Clientes', '/admin/clientes', Users],
    ['Usuarios', '/admin/usuarios', UserCog],
    ['Reportes', '/admin/reportes', BarChart3],
    ['Configuración', '/admin/configuracion', Settings],
  ]

  const isActive = (href) =>
    href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href)

  const renderDesktopLink = ([label, href, Icon, external]) => {
    const active = isActive(href)
    const baseClass =
      'relative inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-4 text-[0.88rem] transition'
    const stateClass = active
      ? 'text-[#9a3f2c] font-semibold'
      : 'text-stone-600 font-medium hover:text-stone-900'

    const content = (
      <>
        <Icon size={15} strokeWidth={active ? 2.4 : 2} />
        <span>{label}</span>
        {external ? <Share2 size={11} className="opacity-50" /> : null}
        {active ? (
          <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[#c2553d]" />
        ) : null}
      </>
    )

    if (external) {
      return (
        <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={`${baseClass} ${stateClass}`}>
          {content}
        </a>
      )
    }

    return (
      <NavLink key={href} to={href} end={href === '/admin'} className={`${baseClass} ${stateClass}`}>
        {content}
      </NavLink>
    )
  }

  const renderMobileLink = ([label, href, Icon, external]) => {
    const active = isActive(href)
    const baseClass = 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.92rem] transition'
    const stateClass = active
      ? 'bg-[#fbf2ea] text-[#9a3f2c] font-semibold'
      : 'text-stone-700 font-medium hover:bg-stone-100'

    const content = (
      <>
        <Icon size={18} strokeWidth={active ? 2.4 : 2} />
        <span>{label}</span>
        {external ? <Share2 size={13} className="ml-auto opacity-50" /> : null}
      </>
    )

    if (external) {
      return (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
          className={`${baseClass} ${stateClass}`}
        >
          {content}
        </a>
      )
    }

    return (
      <NavLink
        key={href}
        to={href}
        end={href === '/admin'}
        onClick={() => setMenuOpen(false)}
        className={`${baseClass} ${stateClass}`}
      >
        {content}
      </NavLink>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf6f0] text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/90 backdrop-blur">
        <div className="flex w-full items-center gap-4 px-4 py-3 sm:px-6 lg:px-8 lg:py-0">
          <Link to="/admin" className="flex shrink-0 items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-md bg-[#2a221c] text-base text-[#faf6f0]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              A
            </div>
            <div className="leading-tight">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#c2553d]">
                AcroDevs
              </p>
              <h2
                className="mt-0.5 text-base text-stone-900"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                {state.restaurant.name}
              </h2>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 overflow-x-auto lg:flex">
            {navItems.map(renderDesktopLink)}
          </nav>

          <div className="ml-auto hidden items-center gap-2 rounded-full border border-stone-200 bg-[#fbf8f3] pl-3 pr-3.5 py-1.5 lg:flex">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#c2553d] opacity-40" />
              <span className="relative h-2 w-2 rounded-full bg-[#c2553d]" />
            </span>
            <span className="text-xs font-semibold text-stone-700">
              {remoteMode ? 'Conectado' : 'Local'}
            </span>
          </div>

          <button
            type="button"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-700 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-stone-200/70 bg-white px-4 py-3 lg:hidden">
            <nav className="grid gap-0.5">{navItems.map(renderMobileLink)}</nav>
          </div>
        ) : null}
      </header>

      <section className="min-w-0 w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </section>
    </div>
  )
}

function AdminDashboard() {
  const { state, remoteMode } = useAppStore()
  usePageTitle(`Admin Dashboard | ${state.restaurant.name}`)
  const income = state.orders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = state.orders.filter((order) => order.status === 'Pendiente').length
  const readyOrders = state.orders.filter((order) => order.status === 'Listo').length
  const activeOrders = state.orders.filter((order) =>
    ['Pendiente', 'En preparación', 'Listo'].includes(order.status),
  ).length
  const chartData = buildSalesChartData(state.orders)
  const topProducts = getTopProducts(state.orders).slice(0, 5)
  const recentActivity = state.orders.slice(0, 6)

  return (
    <div className="grid gap-5 w-full">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-soft sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
            Panel administrador
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-stone-950 sm:text-4xl">
            Control del restaurante
          </h1>
          <p className="mt-2 max-w-2xl text-stone-500">
            Ventas, cocina, pedidos y catalogo en una vista de operacion diaria.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-sm font-bold text-orange-700">
          <CheckCircle2 size={18} />
          {remoteMode ? 'Supabase conectado' : 'Modo local'}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={DollarSign} label="Ventas del dia" value={currency.format(income)} tone="emerald" />
        <MetricCard icon={ClipboardList} label="Pedidos activos" value={activeOrders} tone="blue" />
        <MetricCard icon={Clock3} label="Pendientes" value={pendingOrders} tone="amber" />
        <MetricCard icon={CheckCircle2} label="Listos" value={readyOrders} tone="green" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
        <DashboardPanel title="Ventas semanales" action="CLP">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.sales}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c2553d" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#c2553d" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ddd0" />
                <XAxis dataKey="day" stroke="#8a7d70" />
                <YAxis stroke="#8a7d70" />
                <Tooltip formatter={(value) => currency.format(value)} />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#c2553d"
                  strokeWidth={3}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Pedidos por estado" action={`${state.orders.length} total`}>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.status}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ddd0" />
                <XAxis dataKey="estado" stroke="#8a7d70" />
                <YAxis allowDecimals={false} stroke="#8a7d70" />
                <Tooltip />
                <Bar dataKey="pedidos" fill="#2a201a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)]">
        <DashboardPanel title="Productos mas vendidos" action={`${topProducts.length} items`}>
          <div className="grid gap-3">
            {topProducts.length ? (
              topProducts.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between gap-3 rounded-lg bg-stone-50 p-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-sm font-black text-stone-700 shadow-sm">
                      {index + 1}
                    </span>
                    <div>
                      <strong>{item.name}</strong>
                      <p className="text-sm text-stone-500">{item.quantity} vendidos</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-orange-600">
                    {currency.format(item.total)}
                  </span>
                </div>
              ))
            ) : (
              <EmptyAdminState text="Aun no hay ventas registradas." />
            )}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Actividad reciente" action="En vivo">
          <div className="grid gap-3">
            {recentActivity.length ? (
              recentActivity.map((order) => (
                <div key={order.id} className="flex flex-col gap-2 rounded-lg border border-stone-100 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <strong>Pedido #{order.number}</strong>
                    <p className="text-sm text-stone-500">
                      {order.tableLabel} · {formatTime(order.createdAt)}
                    </p>
                  </div>
                  <span className={`status-badge status-${slugify(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              ))
            ) : (
              <EmptyAdminState text="Los pedidos nuevos apareceran aqui." />
            )}
          </div>
        </DashboardPanel>
      </section>
    </div>
  )
}

function AdminProductsPage() {
  const { state, saveProduct, deleteProduct, toggleProductAvailability } = useAppStore()
  usePageTitle(`Productos | ${state.restaurant.name}`)
  const [form, setForm] = useState(() => createBlankProductForm(state.categories))
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [viewMode, setViewMode] = useState('tabla')
  const filteredProducts = state.products.filter((product) => {
    const matchesQuery = `${product.name} ${product.description}`
      .toLowerCase()
      .includes(query.toLowerCase())
    const matchesCategory =
      selectedCategory === 'Todas' || product.category === selectedCategory
    return matchesQuery && matchesCategory
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    void saveProduct(form)
    setForm(createBlankProductForm(state.categories))
  }

  const startEditing = (product) => setForm(product)

  return (
    <div className="grid gap-5 w-full">
      <AdminPageHeader
        eyebrow="Catalogo"
        title="Productos"
        description="Gestiona disponibilidad, precios, categorias e imagenes del menu."
        action={
          <div className="flex rounded-lg border border-stone-200 bg-white p-1">
            {['tabla', 'grid'].map((mode) => (
              <button
                key={mode}
                type="button"
                className={`rounded-md px-3 py-2 text-sm font-black capitalize ${
                  viewMode === mode ? 'bg-stone-950 text-white' : 'text-stone-500'
                }`}
                onClick={() => setViewMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-stone-200 bg-white p-4 shadow-soft"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">
                Editor
              </p>
              <h2 className="text-xl font-black">
                {form.id ? 'Editar producto' : 'Nuevo producto'}
              </h2>
            </div>
            <Package className="text-orange-600" size={24} />
          </div>

          <div className="grid gap-3">
            <label className="field">
              <span>Nombre</span>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </label>
            <label className="field">
              <span>Categoria</span>
              <CustomSelect
                value={form.category}
                onChange={(val) => setForm({ ...form, category: val })}
                options={state.categories.map((c) => ({ value: c.name, label: c.name }))}
                placeholder="Selecciona categoría"
              />
            </label>
            <label className="field">
              <span>Descripcion</span>
              <textarea
                rows="3"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                required
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="field">
                <span>Precio</span>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
                  required
                />
              </label>
              <label className="field">
                <span>Minutos</span>
                <input
                  type="number"
                  min="1"
                  value={form.prepTime}
                  onChange={(event) => setForm({ ...form, prepTime: Number(event.target.value) })}
                />
              </label>
            </div>
            <label className="field">
              <span>Imagen URL</span>
              <input
                value={form.image}
                onChange={(event) => setForm({ ...form, image: event.target.value })}
                placeholder="Opcional"
              />
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                ['featured', 'Destacado'],
                ['vegetarian', 'Veggie'],
                ['available', 'Activo'],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-2 py-2 text-sm font-bold"
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(event) => setForm({ ...form, [key]: event.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="submit" className="primary-button">
              Guardar
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setForm(createBlankProductForm(state.categories))}
            >
              Limpiar
            </button>
          </div>
        </motion.form>

        <section className="min-w-0 rounded-xl border border-stone-200 bg-white shadow-soft">
          <div className="grid gap-3 border-b border-stone-200 p-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                className="w-full rounded-lg border border-stone-200 bg-stone-50 py-3 pl-10 pr-3 outline-none focus:border-orange-500"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar producto..."
              />
            </label>
            <CustomSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={['Todas', ...state.categories.map((c) => c.name)]}
              placeholder="Categoría"
            />
          </div>

          {viewMode === 'tabla' ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-stone-200 text-xs uppercase tracking-[0.12em] text-stone-500">
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Categoria</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <ProductTableRow
                      key={product.id}
                      product={product}
                      onEdit={startEditing}
                      onToggle={toggleProductAvailability}
                      onDelete={deleteProduct}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductAdminCard
                  key={product.id}
                  product={product}
                  onEdit={startEditing}
                  onToggle={toggleProductAvailability}
                  onDelete={deleteProduct}
                />
              ))}
            </div>
          )}

          {!filteredProducts.length ? (
            <div className="p-6">
              <EmptyAdminState text="No encontramos productos con esos filtros." />
            </div>
          ) : null}
        </section>
      </section>
    </div>
  )
}

function AdminCategoriesPage() {
  const { state, addCategory } = useAppStore()
  usePageTitle(`Categorias | ${state.restaurant.name}`)
  const [value, setValue] = useState('')

  return (
    <div className="grid gap-5 w-full overflow-hidden">
      <AdminPageHeader
        eyebrow="Categorias"
        title="Gestion rapida"
        description="Organiza el menu para que el cliente encuentre rapido lo que quiere pedir."
      />

      <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <form
          className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft"
          onSubmit={(event) => {
            event.preventDefault()
            void addCategory(value)
            setValue('')
          }}
        >
          <h2 className="text-xl font-black text-stone-950">Nueva categoria</h2>
          <label className="field">
            <span>Nombre</span>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Ejemplo: Postres"
              required
            />
          </label>
          <button type="submit" className="primary-button">
            Crear categoria
          </button>
        </form>

        <div className="min-w-0 rounded-xl border border-stone-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-stone-950">Categorias activas</h2>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-black text-stone-500">
              {state.categories.length}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {state.categories.map((category) => (
              <div key={category.id} className="min-w-0 rounded-lg border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-100 text-orange-700">
                    <Tags size={19} />
                  </span>
                  <div className="min-w-0">
                    <strong className="block truncate text-stone-950">{category.name}</strong>
                    <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                      {category.description || 'Sin descripcion'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function AdminPromotionsPage() {
  const { state, saveProduct, deleteProduct, toggleProductAvailability } = useAppStore()
  usePageTitle(`Promociones | ${state.restaurant.name}`)
  const [promo, setPromo] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    prepTime: 10,
    available: true,
    featured: true,
    vegetarian: false,
    image: '',
  })

  const promoProducts = state.products.filter((product) => product.category === 'Promociones')
  const handlePromoSubmit = (event) => {
    event.preventDefault()
    void saveProduct({
      ...promo,
      id: promo.id || '',
      category: 'Promociones',
    })
    setPromo({
      id: '',
      name: '',
      description: '',
      price: 0,
      prepTime: 10,
      available: true,
      featured: true,
      vegetarian: false,
      image: '',
    })
  }

  return (
    <div className="grid gap-5 w-full">
      <AdminPageHeader
        eyebrow="Promociones"
        title="Promociones del menu"
        description="Crea promociones visibles en el menu del cliente dentro de la categoria Promociones."
      />

      <section className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
        <form className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft" onSubmit={handlePromoSubmit}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-stone-950">
              {promo.id ? 'Editar promocion' : 'Nueva promocion'}
            </h2>
            <BadgePercent className="text-orange-600" size={26} />
          </div>
          <div className="grid gap-3">
            <label className="field">
              <span>Nombre</span>
              <input
                value={promo.name}
                onChange={(event) => setPromo({ ...promo, name: event.target.value })}
                placeholder="Combo familiar"
                required
              />
            </label>
            <label className="field">
              <span>Descripcion</span>
              <textarea
                rows="3"
                value={promo.description}
                onChange={(event) => setPromo({ ...promo, description: event.target.value })}
                placeholder="2 pizzas + bebida + papas"
                required
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="field">
                <span>Precio</span>
                <input
                  type="number"
                  min="0"
                  value={promo.price}
                  onChange={(event) => setPromo({ ...promo, price: Number(event.target.value) })}
                  required
                />
              </label>
              <label className="field">
                <span>Minutos</span>
                <input
                  type="number"
                  min="1"
                  value={promo.prepTime}
                  onChange={(event) => setPromo({ ...promo, prepTime: Number(event.target.value) })}
                />
              </label>
            </div>
            <label className="field">
              <span>Imagen URL</span>
              <input
                value={promo.image}
                onChange={(event) => setPromo({ ...promo, image: event.target.value })}
                placeholder="Opcional"
              />
            </label>
            <button type="submit" className="primary-button">
              Agregar al menu
            </button>
          </div>
        </form>

        <div className="min-w-0 rounded-xl border border-stone-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-stone-950">Promociones visibles</h2>
              <p className="text-sm text-stone-500">Esto es lo que aparece al cliente en el menu.</p>
            </div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-black text-orange-700">
              {promoProducts.length} activas
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {promoProducts.map((product) => (
              <ProductAdminCard
                key={product.id}
                product={product}
                onEdit={(item) => setPromo(item)}
                onToggle={toggleProductAvailability}
                onDelete={deleteProduct}
              />
            ))}
            {!promoProducts.length ? <EmptyAdminState text="Todavia no hay promociones en el menu." /> : null}
          </div>
        </div>
      </section>
    </div>
  )
}

function AdminTablesPage() {
  const { state, addTable } = useAppStore()
  usePageTitle(`Mesas y QR | ${state.restaurant.name}`)
  const [tableName, setTableName] = useState('')

  return (
    <div className="grid gap-5 w-full overflow-hidden">
      <AdminPageHeader
        eyebrow="Mesas y QR"
        title="Codigos por mesa"
        description="Genera, descarga y comparte el QR de cada mesa para abrir el menu correcto."
      />

      <section className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <form
          className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft"
          onSubmit={(event) => {
            event.preventDefault()
            void addTable(tableName)
            setTableName('')
          }}
        >
          <h2 className="text-xl font-black text-stone-950">Crear mesa</h2>
          <label className="field">
            <span>Nombre visible</span>
            <input
              value={tableName}
              onChange={(event) => setTableName(event.target.value)}
              placeholder="Mesa 09"
              required
            />
          </label>
          <button type="submit" className="primary-button">
            Generar mesa
          </button>
        </form>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {state.tables.map((table) => (
            <QrTableCard key={table.id} table={table} />
          ))}
        </div>
      </section>
    </div>
  )
}

function AdminOrdersPage() {
  const { state, updateOrderStatus } = useAppStore()
  usePageTitle(`Pedidos | ${state.restaurant.name}`)

  return (
    <div className="grid gap-5 w-full overflow-hidden">
      <AdminPageHeader
        eyebrow="Pedidos"
        title="Seguimiento manual"
        description="Revisa pedidos, mesa, detalle y cambia el estado operativo."
      />

      <section className="grid gap-4">
          {state.orders.length ? (
            state.orders.map((order) => (
              <article
                key={order.id}
                className="grid min-w-0 gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-soft lg:grid-cols-[180px_minmax(0,1fr)_240px] lg:items-center"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                    Pedido #{order.number}
                  </p>
                  <h2 className="text-xl font-black text-stone-950">{order.tableLabel}</h2>
                  <p className="text-sm text-stone-500">{formatTime(order.createdAt)}</p>
                </div>

                <div className="min-w-0">
                  <p className="line-clamp-2 text-stone-600">
                    {order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                  </p>
                  {order.note ? (
                    <p className="mt-2 rounded-lg bg-stone-50 p-2 text-sm text-stone-500">
                      {order.note}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <span className={`status-badge status-${slugify(order.status)}`}>
                    {order.status}
                  </span>
                  <CustomSelect
                    value={order.status}
                    onChange={(val) => void updateOrderStatus(order.id, val)}
                    options={['Pendiente', 'En preparación', 'Listo', 'Entregado', 'Cancelado']}
                  />
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-stone-200 bg-white p-8 text-center shadow-soft">
              <strong>No hay pedidos cargados</strong>
              <p className="text-stone-500">Envia uno desde el menu para probar la trazabilidad completa.</p>
            </div>
          )}
      </section>
    </div>
  )
}

function AdminCustomersPage() {
  usePageTitle('Clientes | AcroDevs Restaurant')
  return (
    <div className="generic-page">
      <section className="section-header">
        <div>
          <p className="eyebrow">Clientes</p>
          <h1>Reservado para siguiente etapa</h1>
        </div>
      </section>
      <div className="panel-card">
        <p>
          En esta version dejamos la estructura lista. La siguiente iteracion puede guardar
          historial de clientes, frecuencia de consumo y preferencias.
        </p>
      </div>
    </div>
  )
}

function AdminUsersPage() {
  usePageTitle('Usuarios | AcroDevs Restaurant')

  return (
    <div className="grid gap-5 w-full">
      <AdminPageHeader
        eyebrow="Equipo"
        title="Usuarios"
        description="Gestion de roles para administradores, cocina y operadores del restaurante."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Administrador', 'Acceso completo al sistema', UserCog],
          ['Cocina', 'Gestion de comandas y estados', ChefHat],
          ['Caja', 'Pedidos, ventas y reportes', ClipboardList],
        ].map(([title, description, Icon]) => (
          <article key={title} className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft">
            <Icon className="text-orange-600" size={28} />
            <h2 className="mt-4 text-lg font-black">{title}</h2>
            <p className="mt-2 text-stone-500">{description}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

function AdminReportsPage() {
  const { state } = useAppStore()
  usePageTitle(`Reportes | ${state.restaurant.name}`)
  const chartData = buildSalesChartData(state.orders)

  return (
    <div className="grid gap-5 w-full">
      <AdminPageHeader
        eyebrow="Analitica"
        title="Reportes"
        description="Resumen comercial de ventas, pedidos y rendimiento semanal."
      />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <DashboardPanel title="Ventas ultimos 7 dias" action="Semana">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.sales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ddd0" />
                <XAxis dataKey="day" stroke="#8a7d70" />
                <YAxis stroke="#8a7d70" />
                <Tooltip formatter={(value) => currency.format(value)} />
                <Area type="monotone" dataKey="ventas" stroke="#c2553d" fill="#d2f9e8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardPanel>
        <DashboardPanel title="Indicadores" action={<CalendarDays size={16} />}>
          <div className="grid gap-3">
            <MetricLine label="Ventas totales" value={currency.format(state.orders.reduce((sum, order) => sum + order.total, 0))} />
            <MetricLine label="Pedidos" value={state.orders.length} />
            <MetricLine label="Ticket promedio" value={currency.format(state.orders.length ? state.orders.reduce((sum, order) => sum + order.total, 0) / state.orders.length : 0)} />
            <MetricLine label="Tendencia" value={<span className="inline-flex items-center gap-1 text-orange-600"><TrendingUp size={16} /> Operativa</span>} />
          </div>
        </DashboardPanel>
      </section>
    </div>
  )
}

function AdminConfigPage() {
  const { state, updateRestaurantConfig } = useAppStore()
  usePageTitle(`Configuracion | ${state.restaurant.name}`)
  const [config, setConfig] = useState(() => state.restaurant)

  return (
    <div className="generic-page">
      <section className="section-header">
        <div>
          <p className="eyebrow">Configuracion</p>
          <h1>Datos generales</h1>
        </div>
      </section>
      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault()
          void updateRestaurantConfig(config)
        }}
      >
        <div className="form-grid">
          <label className="field">
            <span>Nombre restaurante</span>
            <input
              value={config.name}
              onChange={(event) => setConfig({ ...config, name: event.target.value })}
            />
          </label>
          <label className="field">
            <span>WhatsApp</span>
            <input
              value={config.whatsapp}
              onChange={(event) => setConfig({ ...config, whatsapp: event.target.value })}
              placeholder="56912345678"
            />
          </label>
          <label className="field">
            <span>Dominio base</span>
            <input
              value={config.baseUrl}
              onChange={(event) => setConfig({ ...config, baseUrl: event.target.value })}
            />
          </label>
          <label className="field">
            <span>Color principal</span>
            <input
              value={config.primaryColor}
              onChange={(event) => setConfig({ ...config, primaryColor: event.target.value })}
            />
          </label>
        </div>
        <button type="submit" className="primary-button">
          Guardar configuracion
        </button>
      </form>
      <div className="panel-card">
        <p className="eyebrow">Supabase</p>
        <p>
          URL detectada:{' '}
          <code>
            {import.meta.env.VITE_SUPABASE_URL ||
              'https://gdayxcyifngmjhiqkpoq.supabase.co'}
          </code>
        </p>
        <p>
          Para activar persistencia real solo falta completar las tablas y las politicas RLS
          definitivas.
        </p>
      </div>
    </div>
  )
}

function QrTableCard({ table }) {
  const { state } = useAppStore()
  const [qrCode, setQrCode] = useState('')

  const tableActiveOrders = state.orders.filter(
    (order) => order.tableId === table.slug && !['Entregado', 'Cancelado'].includes(order.status),
  )
  const isOccupied = tableActiveOrders.length > 0

  useEffect(() => {
    let active = true
    QRCode.toDataURL(`${state.restaurant.baseUrl}/menu/${table.slug}`, {
      margin: 1,
      width: 320,
    }).then((value) => {
      if (active) setQrCode(value)
    })
    return () => {
      active = false
    }
  }, [state.restaurant.baseUrl, table.slug])

  const downloadQr = () => {
    if (!qrCode) return
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `${table.slug}.png`
    link.click()
  }

  return (
    <article className="grid min-w-0 gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
            isOccupied
              ? 'bg-rose-50 text-rose-700'
              : 'bg-orange-50 text-orange-700'
          }`}>
            <span className={`h-2 w-2 rounded-full ${isOccupied ? 'bg-rose-500 animate-pulse' : 'bg-orange-500'}`} />
            {isOccupied ? `Ocupada · ${tableActiveOrders.length} pedido${tableActiveOrders.length > 1 ? 's' : ''}` : 'Libre'}
          </div>
          <h2 className="text-xl font-black text-stone-950">{table.label}</h2>
        </div>
        <a
          className="inline-flex h-10 items-center justify-center rounded-lg border border-stone-200 bg-white px-3 font-black"
          href={`/menu/${table.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Menú ↗
        </a>
      </div>

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
        {qrCode ? (
          <img
            src={qrCode}
            alt={`QR ${table.label}`}
            className="mx-auto aspect-square w-full max-w-[220px] rounded-lg bg-white p-2"
          />
        ) : (
          <div className="mx-auto aspect-square w-full max-w-[220px] rounded-lg bg-white" />
        )}
      </div>

      <p className="break-all rounded-lg bg-stone-50 p-3 text-sm text-stone-500">
        {state.restaurant.baseUrl}/menu/{table.slug}
      </p>

      <div className="grid grid-cols-3 gap-2">
        <a
          className="grid h-11 place-items-center rounded-lg border border-stone-200 bg-white text-stone-700"
          href={`/menu/${table.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Ver menu en nueva pestaña"
        >
          <Eye size={18} />
        </a>
        <button
          type="button"
          className="grid h-11 place-items-center rounded-lg border border-stone-200 bg-white text-stone-700"
          onClick={downloadQr}
          title="Descargar QR"
        >
          <Download size={18} />
        </button>
        <button
          type="button"
          className="grid h-11 place-items-center rounded-lg border border-stone-200 bg-white text-stone-700"
          title="Compartir QR"
          onClick={() => void navigator.clipboard?.writeText(`${state.restaurant.baseUrl}/menu/${table.slug}`)}
        >
          <Share2 size={18} />
        </button>
      </div>
    </article>
  )
}

function AdminPageHeader({ eyebrow, title, description, action }) {
  return (
    <section className="flex flex-col justify-between gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-soft sm:flex-row sm:items-center">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-black text-stone-950 sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-stone-500">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </section>
  )
}

function DashboardPanel({ title, action, children }) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-stone-950">{title}</h2>
        {action ? (
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-500">
            {action}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function MetricCard({ icon: Icon, label, value, tone }) {
  const tones = {
    emerald: 'bg-orange-50 text-orange-700',
    blue: 'bg-amber-50 text-amber-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-orange-50 text-orange-700',
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-stone-500">{label}</p>
          <strong className="mt-2 block text-2xl font-black text-stone-950">{value}</strong>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.article>
  )
}

function ProductTableRow({ product, onEdit, onToggle, onDelete }) {
  return (
    <tr className="border-b border-stone-100 last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 shrink-0 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url("${product.image}")` }}
          />
          <div>
            <strong>{product.name}</strong>
            <p className="line-clamp-1 text-sm text-stone-500">{product.description}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold text-stone-600">
          {product.category}
        </span>
      </td>
      <td className="px-4 py-3 font-black">{currency.format(product.price)}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          className={`rounded-full px-3 py-1 text-sm font-black ${
            product.available ? 'bg-orange-50 text-orange-700' : 'bg-rose-50 text-rose-700'
          }`}
          onClick={() => void onToggle(product.id)}
        >
          {product.available ? 'Activo' : 'Inactivo'}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <IconAction label="Editar" icon={Pencil} onClick={() => onEdit(product)} />
          <IconAction label="Eliminar" icon={Trash2} danger onClick={() => void onDelete(product.id)} />
        </div>
      </td>
    </tr>
  )
}

function ProductAdminCard({ product, onEdit, onToggle, onDelete }) {
  return (
    <article className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <div
        className="h-36 bg-cover bg-center"
        style={{ backgroundImage: `url("${product.image}")` }}
      />
      <div className="grid gap-3 p-4">
        <div>
          <strong>{product.name}</strong>
          <p className="text-sm text-stone-500">{product.category}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-black">{currency.format(product.price)}</span>
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-sm font-black ${
              product.available ? 'bg-orange-50 text-orange-700' : 'bg-rose-50 text-rose-700'
            }`}
            onClick={() => void onToggle(product.id)}
          >
            {product.available ? 'Activo' : 'Inactivo'}
          </button>
        </div>
        <div className="flex gap-2">
          <button type="button" className="secondary-button flex-1" onClick={() => onEdit(product)}>
            Editar
          </button>
          <button
            type="button"
            className="secondary-button danger-button"
            onClick={() => void onDelete(product.id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}

function IconAction({ label, icon: Icon, onClick, danger = false }) {
  return (
    <button
      type="button"
      className={`grid h-10 w-10 place-items-center rounded-lg border ${
        danger
          ? 'border-rose-100 bg-rose-50 text-rose-700'
          : 'border-stone-200 bg-white text-stone-700'
      }`}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      <Icon size={18} />
    </button>
  )
}

function EmptyAdminState({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-stone-500">
      {text}
    </div>
  )
}

function MetricLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-stone-50 p-3">
      <span className="text-sm font-bold text-stone-500">{label}</span>
      <strong className="text-right text-stone-950">{value}</strong>
    </div>
  )
}

function KitchenCounter({ label, value }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-center">
      <p className="text-xs font-bold text-stone-500">{label}</p>
      <strong className="text-lg font-black text-stone-950">{value}</strong>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function SyncBanner({ text, warning = false }) {
  return <div className={warning ? 'sync-banner sync-banner-warning' : 'sync-banner'}>{text}</div>
}

function formatTime(dateValue) {
  return new Date(dateValue).toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function elapsedMinutes(dateValue) {
  return Math.max(0, Math.floor((Date.now() - new Date(dateValue).getTime()) / 60000))
}

function slugify(value) {
  return value
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll('ó', 'o')
    .replaceAll('í', 'i')
}

function getKitchenBorderClass(status) {
  const classes = {
    Pendiente: 'border-amber-300 shadow-amber-100',
    'En preparación': 'border-amber-300 shadow-amber-100',
    Listo: 'border-orange-300 shadow-orange-100',
    Entregado: 'border-stone-200',
    Cancelado: 'border-rose-300 shadow-rose-100',
  }
  return classes[status] ?? 'border-stone-200'
}

function buildSalesChartData(orders) {
  const dayFormatter = new Intl.DateTimeFormat('es-CL', { weekday: 'short' })
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    return {
      key: date.toISOString().slice(0, 10),
      day: dayFormatter.format(date).replace('.', ''),
      ventas: 0,
    }
  })
  const byDay = new Map(days.map((day) => [day.key, day]))

  orders.forEach((order) => {
    const key = new Date(order.createdAt).toISOString().slice(0, 10)
    if (byDay.has(key)) {
      byDay.get(key).ventas += order.total
    }
  })

  const statuses = ['Pendiente', 'En preparación', 'Listo', 'Entregado', 'Cancelado']
  return {
    sales: days,
    status: statuses.map((status) => ({
      estado: status === 'En preparación' ? 'Prep.' : status,
      pedidos: orders.filter((order) => order.status === status).length,
    })),
  }
}

function getTopProducts(orders) {
  const totals = new Map()
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const current = totals.get(item.name) ?? { name: item.name, quantity: 0, total: 0 }
      current.quantity += item.quantity
      current.total += item.quantity * item.price
      totals.set(item.name, current)
    })
  })
  return [...totals.values()].sort((left, right) => right.quantity - left.quantity)
}

function usePageTitle(title) {
  const location = useLocation()

  useEffect(() => {
    document.title = title
  }, [location.pathname, title])
}

function formatTableName(mesaId) {
  const number = mesaId.replace('mesa-', '').padStart(2, '0')
  return `Mesa ${number}`
}

function createBlankProductForm(categories) {
  return {
    id: '',
    name: '',
    description: '',
    price: 0,
    category: categories[0]?.name ?? 'Pizzas',
    image: '',
    available: true,
    featured: false,
    vegetarian: false,
    prepTime: 15,
  }
}

export default App
