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
  CreditCard,
  DollarSign,
  Download,
  Eye,
  Flame,
  Hash,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  Minus,
  Package,
  Pencil,
  Plus,
  Printer,
  QrCode,
  Search,
  Settings,
  Share2,
  ShoppingBag,
  Tags,
  Timer,
  Trash2,
  TrendingUp,
  User,
  UserCog,
  UserPlus,
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
  useNavigate,
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
  const { currentUser } = useAppStore()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/menu/:mesaId" element={<MenuPage />} />

      {/* Protected: Cocina - only cocina + admin */}
      <Route path="/cocina" element={
        <RequireAuth roles={['administrador', 'cocina']}>
          <KitchenPage />
        </RequireAuth>
      } />

      {/* Protected: POS */}
      <Route path="/pos" element={
        <RequireAuth roles={['administrador', 'cajero']}>
          <PosPage />
        </RequireAuth>
      } />

      {/* Protected: Cajero layout (limited views) */}
      <Route path="/cajero" element={
        <RequireAuth roles={['cajero']}>
          <CajeroLayout />
        </RequireAuth>
      }>
        <Route index element={<AdminOrdersPage />} />
        <Route path="pedidos" element={<AdminOrdersPage />} />
        <Route path="reportes" element={<AdminReportsPage />} />
      </Route>

      {/* Protected: Garzon layout (tables + menu) */}
      <Route path="/garzon" element={
        <RequireAuth roles={['garzon']}>
          <GarzonLayout />
        </RequireAuth>
      }>
        <Route index element={<GarzonTablesPage />} />
      </Route>
      <Route path="/garzon/mesa/:mesaId" element={
        <RequireAuth roles={['garzon']}>
          <MenuPage isGarzon />
        </RequireAuth>
      } />

      {/* Protected: Admin - full access */}
      <Route path="/admin" element={
        <RequireAuth roles={['administrador']}>
          <AdminLayout />
        </RequireAuth>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProductsPage />} />
        <Route path="categorias" element={<AdminCategoriesPage />} />
        <Route path="promociones" element={<AdminPromotionsPage />} />
        <Route path="mesas" element={<AdminTablesPage />} />
        <Route path="pedidos" element={<AdminOrdersPage />} />
        <Route path="reservas" element={<AdminReservationsPage />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="configuracion" element={<AdminConfigPage />} />
        <Route path="reportes" element={<AdminReportsPage />} />
      </Route>

      {/* Default: redirect based on auth state */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

function RootRedirect() {
  const { currentUser } = useAppStore()
  if (!currentUser) return <Navigate to="/login" replace />
  const redirectMap = {
    administrador: '/admin',
    cocina: '/cocina',
    cajero: '/cajero',
    garzon: '/garzon',
  }
  return <Navigate to={redirectMap[currentUser.role] || '/login'} replace />
}

function RequireAuth({ roles, children }) {
  const { currentUser } = useAppStore()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(currentUser.role)) {
    // User is authenticated but doesn't have the right role
    const redirectMap = {
      administrador: '/admin',
      cocina: '/cocina',
      cajero: '/cajero',
      garzon: '/garzon',
    }
    return <Navigate to={redirectMap[currentUser.role] || '/login'} replace />
  }

  return children
}

function LoginPage() {
  const { state, login, currentUser } = useAppStore()
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (currentUser) {
      const redirectMap = {
        administrador: '/admin',
        cocina: '/cocina',
        cajero: '/cajero',
        garzon: '/garzon',
      }
      navigate(redirectMap[currentUser.role] || '/admin', { replace: true })
    }
  }, [currentUser, navigate])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handlePinChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    setPin(digits)
    setError('')

    if (digits.length === 4) {
      const user = login(digits)
      if (user) {
        const redirectMap = {
          administrador: '/admin',
          cocina: '/cocina',
          cajero: '/cajero',
          garzon: '/garzon',
        }
        navigate(redirectMap[user.role] || '/admin', { replace: true })
      } else {
        setError('PIN incorrecto o usuario inactivo')
        setShake(true)
        setTimeout(() => {
          setShake(false)
          setPin('')
          inputRef.current?.focus()
        }, 600)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pin.length < 4) {
      setError('Ingresa tu PIN de 4 dígitos')
      return
    }
    handlePinChange(pin)
  }

  const roleLabels = {
    administrador: { icon: UserCog, label: 'Administrador', desc: 'Acceso completo', color: 'from-purple-500 to-indigo-600' },
    cocina: { icon: ChefHat, label: 'Cocina', desc: 'Panel de cocina', color: 'from-amber-500 to-orange-600' },
    cajero: { icon: CreditCard, label: 'Cajero', desc: 'Pedidos y cobros', color: 'from-blue-500 to-cyan-600' },
    garzon: { icon: User, label: 'Garzón', desc: 'Atención de mesas', color: 'from-emerald-500 to-teal-600' },
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-950 px-4">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#c2553d]/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-orange-500/15 blur-[140px]" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-[#c2553d] to-[#e8824a] text-3xl font-black text-white shadow-2xl shadow-orange-900/40"
          >
            A
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c2553d]">
              AcroDevs
            </p>
            <h1 className="mt-2 text-3xl font-black text-white">
              {state.restaurant.name}
            </h1>
            <p className="mt-2 text-sm text-stone-400">
              Ingresa tu PIN para acceder al sistema
            </p>
          </motion.div>
        </div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
        >
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                  PIN de acceso
                </label>
                <motion.div animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-500" />
                    <input
                      ref={inputRef}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => handlePinChange(e.target.value)}
                      placeholder="• • • •"
                      className={`h-16 w-full rounded-2xl border bg-white/5 pl-12 pr-4 text-center text-2xl font-black tracking-[0.5em] text-white outline-none transition placeholder:tracking-[0.3em] placeholder:text-stone-600 ${
                        error
                          ? 'border-rose-500 ring-2 ring-rose-500/30'
                          : 'border-white/10 focus:border-[#c2553d] focus:ring-2 focus:ring-[#c2553d]/30'
                      }`}
                    />
                  </div>
                </motion.div>
                {error ? (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-center text-sm font-bold text-rose-400"
                  >
                    {error}
                  </motion.p>
                ) : null}
              </div>

              {/* PIN dots indicator */}
              <div className="mb-6 flex items-center justify-center gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: pin.length > i ? 1.3 : 1,
                      backgroundColor: pin.length > i ? '#c2553d' : 'rgba(255,255,255,0.1)',
                    }}
                    className="h-3.5 w-3.5 rounded-full border border-white/10"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={pin.length < 4}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c2553d] to-[#e8824a] text-base font-black text-white shadow-lg shadow-orange-900/30 transition hover:shadow-xl hover:shadow-orange-900/40 disabled:opacity-40 disabled:shadow-none"
              >
                <Lock size={18} />
                Ingresar
              </button>
            </form>
          </div>

          {/* Roles info section */}
          <div className="border-t border-white/5 bg-white/[0.02] px-6 py-5 sm:px-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-stone-500">
              Roles del sistema
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(roleLabels).map(([role, cfg]) => {
                const Icon = cfg.icon
                return (
                  <div
                    key={role}
                    className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5"
                  >
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${cfg.color} text-white`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{cfg.label}</p>
                      <p className="text-[0.6rem] text-stone-500">{cfg.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-stone-600">
          Powered by <span className="font-bold text-[#c2553d]">AcroDevs</span> · Sistema de gestión de restaurantes
        </p>
      </motion.div>
    </div>
  )
}

function CajeroLayout() {
  const { state, currentUser, logout } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const navItems = [
    ['Pedidos', '/cajero', ClipboardList],
    ['Reportes', '/cajero/reportes', BarChart3],
  ]

  const isActive = (href) =>
    href === '/cajero' ? location.pathname === '/cajero' : location.pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-[#faf6f0] text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/90 backdrop-blur">
        <div className="flex w-full items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex shrink-0 items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-md bg-[#2a221c] text-base text-[#faf6f0]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              A
            </div>
            <div className="leading-tight">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#c2553d]">
                Cajero
              </p>
              <h2
                className="mt-0.5 text-base text-stone-900"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                {state.restaurant.name}
              </h2>
            </div>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navItems.map(([label, href, Icon]) => {
              const active = isActive(href)
              return (
                <NavLink
                  key={href}
                  to={href}
                  end={href === '/cajero'}
                  className={`relative inline-flex items-center gap-1.5 px-4 py-4 text-sm transition ${
                    active ? 'font-semibold text-[#9a3f2c]' : 'font-medium text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.4 : 2} />
                  {label}
                  {active ? <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[#c2553d]" /> : null}
                </NavLink>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-stone-200 bg-[#fbf8f3] px-3 py-1.5 lg:flex">
              <CreditCard size={14} className="text-blue-600" />
              <span className="text-xs font-semibold text-stone-700">{currentUser?.name}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 transition hover:bg-rose-100"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <section className="min-w-0 w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </section>
    </div>
  )
}

function GarzonLayout() {
  const { state, currentUser, logout } = useAppStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#faf6f0] text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/90 backdrop-blur">
        <div className="flex w-full items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex shrink-0 items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-md bg-emerald-600 text-base text-white"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              G
            </div>
            <div className="leading-tight">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-emerald-600">
                Garzón
              </p>
              <h2
                className="mt-0.5 text-base text-stone-900"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                {state.restaurant.name}
              </h2>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-[#fbf8f3] px-3 py-1.5">
              <User size={14} className="text-emerald-600" />
              <span className="text-xs font-semibold text-stone-700">{currentUser?.name}</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.6rem] font-black text-emerald-700">
                PIN: {currentUser?.pin}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 transition hover:bg-rose-100"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <section className="min-w-0 w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </section>
    </div>
  )
}

function GarzonTablesPage() {
  const { state, currentUser } = useAppStore()
  usePageTitle(`Mis Mesas | ${state.restaurant.name}`)

  const today = new Date().toISOString().slice(0, 10)
  const todayOrders = state.orders.filter(
    (order) => new Date(order.createdAt).toISOString().slice(0, 10) === today,
  )
  const myOrders = todayOrders.filter((order) => order.waiterId === currentUser?.id)
  const myTotalSales = myOrders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="grid gap-5 w-full overflow-hidden">
      {/* Garzon header */}
      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Mi turno</p>
            <h1 className="mt-2 text-3xl font-black text-stone-950">Hola, {currentUser?.name} 👋</h1>
            <p className="mt-1 text-sm text-stone-500">Selecciona una mesa para tomar el pedido. Cada pedido queda registrado a tu nombre.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-center">
              <p className="text-[0.6rem] font-black uppercase text-stone-400">Pedidos</p>
              <strong className="mt-1 block text-xl font-black text-stone-950">{myOrders.length}</strong>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-center">
              <p className="text-[0.6rem] font-black uppercase text-stone-400">Ventas</p>
              <strong className="mt-1 block text-xl font-black text-stone-950">{currency.format(myTotalSales)}</strong>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-center">
              <p className="text-[0.6rem] font-black uppercase text-stone-400">Mesas</p>
              <strong className="mt-1 block text-xl font-black text-stone-950">
                {[...new Set(myOrders.map((o) => o.tableLabel))].length}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Tables grid */}
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {state.tables.map((table) => (
          <GarzonTableCard key={table.id} table={table} currentUser={currentUser} />
        ))}
      </div>
    </div>
  )
}

function GarzonTableCard({ table, currentUser }) {
  const { state } = useAppStore()
  const [qrCode, setQrCode] = useState('')
  const [elapsed, setElapsed] = useState('')

  const tableActiveOrders = state.orders.filter(
    (order) => order.tableId === table.slug && !['Entregado', 'Cancelado'].includes(order.status),
  )
  const isOccupied = tableActiveOrders.length > 0
  const isMine = tableActiveOrders.some((o) => o.waiterId === currentUser?.id)
  const tableWaiter = isOccupied
    ? tableActiveOrders.find((o) => o.waiterName)?.waiterName
    : null

  const oldestOrderTime = isOccupied
    ? tableActiveOrders.reduce((oldest, order) => {
        const t = new Date(order.createdAt).getTime()
        return t < oldest ? t : oldest
      }, Infinity)
    : null

  useEffect(() => {
    if (!isOccupied || !oldestOrderTime) {
      setElapsed('')
      return
    }
    const tick = () => {
      const diff = Date.now() - oldestOrderTime
      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setElapsed(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      )
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [isOccupied, oldestOrderTime])

  useEffect(() => {
    let active = true
    QRCode.toDataURL(`${window.location.origin}/garzon/mesa/${table.slug}`, {
      margin: 1,
      width: 280,
    }).then((value) => {
      if (active) setQrCode(value)
    })
    return () => {
      active = false
    }
  }, [table.slug])

  return (
    <article className={`grid min-w-0 gap-3 rounded-xl border p-4 shadow-soft ${
      isMine
        ? 'border-emerald-300 bg-emerald-50'
        : isOccupied
          ? 'border-rose-200 bg-rose-50/50'
          : 'border-stone-200 bg-white'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
            isMine
              ? 'bg-emerald-100 text-emerald-700'
              : isOccupied
                ? 'bg-rose-100 text-rose-700'
                : 'bg-orange-50 text-orange-700'
          }`}>
            <span className={`h-2 w-2 rounded-full ${
              isMine ? 'bg-emerald-500 animate-pulse' : isOccupied ? 'bg-rose-500 animate-pulse' : 'bg-orange-500'
            }`} />
            {isMine ? 'Mi mesa' : isOccupied ? `Ocupada (${tableWaiter || 'otro'})` : 'Libre'}
          </div>
          <h2 className="text-xl font-black text-stone-950">{table.label}</h2>
          {tableWaiter ? (
            <p className="mt-1 text-sm font-bold text-stone-500">
              <User size={14} className="mr-1 inline" />
              {tableWaiter}
            </p>
          ) : null}
        </div>
        <Link
          to={`/garzon/mesa/${table.slug}`}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 font-black text-white shadow-md transition hover:bg-emerald-700"
        >
          Atender ↗
        </Link>
      </div>

      {isOccupied && elapsed ? (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 p-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-500 text-white shadow-md shadow-rose-200">
            <Timer size={18} />
          </div>
          <div>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.14em] text-rose-600">Ocupada</p>
            <p className="text-lg font-black tabular-nums text-stone-950">{elapsed}</p>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-2">
        {qrCode ? (
          <img
            src={qrCode}
            alt={`QR ${table.label}`}
            className="mx-auto aspect-square w-full max-w-[180px] rounded-lg bg-white p-1.5"
          />
        ) : (
          <div className="mx-auto aspect-square w-full max-w-[180px] rounded-lg bg-white" />
        )}
      </div>

      <Link
        to={`/garzon/mesa/${table.slug}`}
        className="grid h-11 place-items-center rounded-lg bg-emerald-600 font-black text-white shadow-md transition hover:bg-emerald-700"
      >
        Tomar pedido de {table.label}
      </Link>
    </article>
  )
}

function MenuPage({ isGarzon }) {
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
      waiterId: isGarzon && currentUser ? currentUser.id : undefined,
      waiterName: isGarzon && currentUser ? currentUser.name : undefined,
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

      {isGarzon && currentUser ? (
        <div className="flex items-center justify-between gap-3 bg-emerald-600 px-4 py-2 text-white">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span className="text-sm font-black">Garzón: {currentUser.name}</span>
            <span className="rounded bg-emerald-800 px-2 py-0.5 text-[0.6rem] font-black">
              Pedidos de esta mesa se registran a tu nombre
            </span>
          </div>
          <Link to="/garzon" className="inline-flex items-center gap-1 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-black transition hover:bg-white/30">
            ← Volver a mesas
          </Link>
        </div>
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
  const { state, updateOrderStatus, remoteMode, currentUser, logout } = useAppStore()
  usePageTitle(`Cocina | ${state.restaurant.name}`)
  const navigate = useNavigate()
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

  const printComanda = (order) => {
    const itemsHtml = order.items.map((item) =>
      `<tr>
        <td style="padding:4px 0;font-size:15px;font-weight:700">${item.quantity}x</td>
        <td style="padding:4px 8px;font-size:15px;font-weight:700">${item.name}</td>
      </tr>
      ${item.notes ? `<tr><td></td><td style="padding:0 8px 6px;font-size:13px;color:#555;font-style:italic">📝 ${item.notes}</td></tr>` : ''}`
    ).join('')

    const html = `<!DOCTYPE html>
<html><head><title>Comanda #${order.number}</title>
<style>
  @page { size: 80mm auto; margin: 4mm; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Courier New', monospace; width: 72mm; padding: 2mm; }
  .header { text-align:center; border-bottom: 2px dashed #000; padding-bottom: 8px; margin-bottom: 8px; }
  .header h1 { font-size: 22px; font-weight: 900; }
  .header p { font-size: 13px; margin-top: 4px; }
  .meta { margin-bottom: 8px; font-size: 13px; }
  .meta div { display:flex; justify-content:space-between; padding: 2px 0; }
  .items { width:100%; border-collapse:collapse; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 6px 0; }
  .notes { margin-top: 8px; padding: 6px; background: #f5f5f5; font-size: 12px; border-radius: 4px; }
  .footer { text-align:center; margin-top: 10px; font-size: 11px; color: #666; border-top: 1px dashed #000; padding-top: 8px; }
  .total { text-align:right; font-size: 16px; font-weight: 900; margin-top: 6px; }
</style></head><body>
  <div class="header">
    <h1>🔥 COMANDA</h1>
    <p>Pedido #${order.number}</p>
  </div>
  <div class="meta">
    <div><span><strong>${order.tableLabel}</strong></span><span>${new Date(order.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span></div>
    <div><span>Estado: ${order.status}</span></div>
    ${order.waiterName ? `<div><span>Garzón: ${order.waiterName}</span></div>` : ''}
  </div>
  <table class="items">${itemsHtml}</table>
  ${order.note ? `<div class="notes"><strong>Notas:</strong><br/>${order.note}</div>` : ''}
  <div class="total">Total: ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(order.total)}</div>
  <div class="footer">
    <p>${new Date().toLocaleDateString('es-CL')} · ${state.restaurant.name}</p>
    <p style="margin-top:4px;font-size:10px">---- COLGAR EN COCINA ----</p>
  </div>
  <script>window.onload=function(){window.print();}<\/script>
</body></html>`
    const printWindow = window.open('', '_blank', 'width=350,height=600')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
    }
  }

  return (
    <main className="grid gap-5 w-full px-4 py-5 sm:px-6 lg:px-8">
      {/* Kitchen top bar */}
      <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-[#2a221c] text-base text-[#faf6f0]" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            A
          </div>
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#c2553d]">Cocina</p>
            <h2 className="text-sm font-black text-stone-900">{state.restaurant.name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-stone-200 bg-[#fbf8f3] px-3 py-1.5 sm:flex">
            <ChefHat size={14} className="text-amber-600" />
            <span className="text-xs font-semibold text-stone-700">{currentUser?.name || 'Cocina'}</span>
          </div>
          <button
            type="button"
            onClick={() => { logout(); navigate('/login', { replace: true }) }}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 transition hover:bg-rose-100"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

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
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-3 font-black text-stone-700 transition hover:bg-stone-50"
                    onClick={() => printComanda(order)}
                  >
                    <Printer size={18} />
                    Imprimir comanda
                  </button>
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
  const { state, remoteMode, currentUser, logout } = useAppStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const navItems = [
    ['Dashboard', '/admin', LayoutDashboard],
    ['Pedidos', '/admin/pedidos', ClipboardList],
    ['Cocina', '/cocina', ChefHat, true],
    ['Mesas', '/admin/mesas', QrCode],
    ['Productos', '/admin/productos', Package],
    ['Categorías', '/admin/categorias', Tags],
    ['Promociones', '/admin/promociones', BadgePercent],
    ['Reservas', '/admin/reservas', CalendarDays],
    ['Usuarios', '/admin/usuarios', UserCog],
    ['Reportes', '/admin/reportes', BarChart3],
    ['Configuración', '/admin/configuracion', Settings],
  ]

  const isActive = (href) =>
    href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href)

  const renderDesktopLink = ([label, href, Icon, external]) => {
    const active = isActive(href)
    const baseClass =
      'relative inline-flex items-center gap-1 whitespace-nowrap px-2 py-4 text-[0.8rem] transition'
    const stateClass = active
      ? 'text-[#9a3f2c] font-semibold'
      : 'text-stone-600 font-medium hover:text-stone-900'

    const content = (
      <>
        <Icon size={14} strokeWidth={active ? 2.4 : 2} />
        <span>{label}</span>
        {external ? <Share2 size={10} className="opacity-50" /> : null}
        {active ? (
          <span className="absolute inset-x-1 bottom-0 h-[2px] rounded-full bg-[#c2553d]" />
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
        <div className="flex w-full items-center gap-2 px-3 py-3 sm:px-4 lg:px-5 lg:py-0">
          <Link to="/admin" className="flex shrink-0 items-center gap-2">
            <div
              className="grid h-9 w-9 place-items-center rounded-md bg-[#2a221c] text-sm text-[#faf6f0]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              A
            </div>
            <div className="hidden leading-tight min-[1100px]:block">
              <p className="text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-[#c2553d]">
                AcroDevs
              </p>
              <h2
                className="mt-0.5 text-sm text-stone-900"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                {state.restaurant.name}
              </h2>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-0 lg:flex">
            {navItems.map(renderDesktopLink)}
          </nav>

          <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
            <div className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#fbf8f3] px-2.5 py-1">
              <span className="relative grid h-2 w-2 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#c2553d] opacity-40" />
                <span className="relative h-2 w-2 rounded-full bg-[#c2553d]" />
              </span>
              <span className="max-w-[100px] truncate text-xs font-semibold text-stone-700">
                {currentUser?.name || 'Admin'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-black text-rose-700 transition hover:bg-rose-100"
              title="Cerrar sesión"
            >
              <LogOut size={14} />
              Salir
            </button>
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
  const { state, updateOrderStatus, setOrderPaymentMethod } = useAppStore()
  usePageTitle(`Pedidos | ${state.restaurant.name}`)
  const today = new Date().toISOString().slice(0, 10)
  const todayOrders = state.orders.filter(
    (order) => new Date(order.createdAt).toISOString().slice(0, 10) === today,
  )

  return (
    <div className="grid gap-5 w-full overflow-hidden">
      <AdminPageHeader
        eyebrow="Pedidos"
        title="Seguimiento manual"
        description="Revisa pedidos, mesa, detalle, método de pago y cambia el estado operativo."
      />

      <section className="grid gap-4">
          {state.orders.length ? (
            state.orders.map((order) => (
              <article
                key={order.id}
                className="grid min-w-0 gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-soft xl:grid-cols-[180px_minmax(0,1fr)_200px_240px] xl:items-center"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                    Pedido #{order.number}
                  </p>
                  <h2 className="text-xl font-black text-stone-950">{order.tableLabel}</h2>
                  <p className="text-sm text-stone-500">{formatTime(order.createdAt)}</p>
                  {order.waiterName ? (
                    <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-600">
                      <User size={12} /> {order.waiterName}
                    </p>
                  ) : null}
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
                  <p className="mt-2 text-sm font-black text-stone-700">{currency.format(order.total)}</p>
                </div>

                <div className="grid gap-2">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-400">Pago</p>
                  <CustomSelect
                    value={order.paymentMethod || ''}
                    onChange={(val) => setOrderPaymentMethod(order.id, val)}
                    options={[
                      { value: 'Efectivo', label: '💵 Efectivo' },
                      { value: 'Débito', label: '💳 Débito' },
                      { value: 'Crédito', label: '💳 Crédito' },
                      { value: 'Transferencia', label: '🏦 Transferencia' },
                    ]}
                    placeholder="Sin pago"
                  />
                  {order.paymentMethod ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      <CreditCard size={14} />
                      {order.paymentMethod}
                    </span>
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

function AdminReservationsPage() {
  const { state, addReservation, updateReservationStatus, removeReservation } = useAppStore()
  usePageTitle(`Reservas | ${state.restaurant.name}`)
  const [form, setForm] = useState({
    customerName: '',
    guestCount: 2,
    reservationDate: new Date().toISOString().slice(0, 10),
    reservationTime: '19:00',
    tableLabel: state.tables[0]?.label || 'Mesa 01',
    tableId: state.tables[0]?.id || '',
    notes: '',
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    addReservation(form)
    setForm({
      customerName: '',
      guestCount: 2,
      reservationDate: new Date().toISOString().slice(0, 10),
      reservationTime: '19:00',
      tableLabel: state.tables[0]?.label || 'Mesa 01',
      tableId: state.tables[0]?.id || '',
      notes: '',
    })
  }

  const reservations = state.reservations || []
  const statusColors = {
    Pendiente: 'bg-amber-50 text-amber-700',
    Confirmada: 'bg-blue-50 text-blue-700',
    Completada: 'bg-emerald-50 text-emerald-700',
    Cancelada: 'bg-rose-50 text-rose-700',
  }

  return (
    <div className="grid gap-5 w-full overflow-hidden">
      <AdminPageHeader
        eyebrow="Reservas"
        title="Reserva de mesas"
        description="Gestiona las reservas del restaurante. Fecha, hora, mesa y número de personas."
      />

      <section className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <form className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft" onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">Nueva</p>
              <h2 className="text-xl font-black text-stone-950">Crear reserva</h2>
            </div>
            <CalendarDays className="text-orange-600" size={24} />
          </div>
          <div className="grid gap-3">
            <label className="field">
              <span>Nombre del cliente</span>
              <input
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                placeholder="Juan Perez"
                required
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="field">
                <span>Fecha</span>
                <input
                  type="date"
                  value={form.reservationDate}
                  onChange={(e) => setForm({ ...form, reservationDate: e.target.value })}
                  required
                />
              </label>
              <label className="field">
                <span>Hora</span>
                <input
                  type="time"
                  value={form.reservationTime}
                  onChange={(e) => setForm({ ...form, reservationTime: e.target.value })}
                  required
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="field">
                <span>Personas</span>
                <input
                  type="number"
                  min="1"
                  value={form.guestCount}
                  onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })}
                  required
                />
              </label>
              <label className="field">
                <span>Mesa</span>
                <CustomSelect
                  value={form.tableLabel}
                  onChange={(val) => {
                    const t = state.tables.find((tb) => tb.label === val)
                    setForm({ ...form, tableLabel: val, tableId: t?.id || '' })
                  }}
                  options={state.tables.map((t) => t.label)}
                  placeholder="Mesa"
                />
              </label>
            </div>
            <label className="field">
              <span>Notas</span>
              <textarea
                rows="2"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Cumpleaños, alergias, etc."
              />
            </label>
            <button type="submit" className="primary-button">
              Reservar mesa
            </button>
          </div>
        </form>

        <div className="min-w-0 rounded-xl border border-stone-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-stone-950">Reservas activas</h2>
              <p className="text-sm text-stone-500">{reservations.length} reservas registradas</p>
            </div>
          </div>
          <div className="grid gap-3">
            {reservations.length ? (
              reservations.map((res) => (
                <article key={res.id} className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-stone-950">{res.customerName}</strong>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${statusColors[res.status] || 'bg-stone-100 text-stone-600'}`}>
                        {res.status}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500">
                      📅 {res.reservationDate} · 🕐 {res.reservationTime} · 👥 {res.guestCount} personas
                    </p>
                    <p className="text-sm font-bold text-stone-600">{res.tableLabel}</p>
                    {res.notes ? <p className="text-sm text-stone-400 italic">{res.notes}</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <CustomSelect
                      value={res.status}
                      onChange={(val) => updateReservationStatus(res.id, val)}
                      options={['Pendiente', 'Confirmada', 'Completada', 'Cancelada']}
                      className="w-40"
                    />
                    <button
                      type="button"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-rose-100 bg-rose-50 text-rose-700"
                      onClick={() => removeReservation(res.id)}
                      title="Eliminar reserva"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <EmptyAdminState text="No hay reservas registradas. Crea una desde el formulario." />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function AdminUsersPage() {
  const { state, addStaffUser, removeStaffUser, toggleStaffUser } = useAppStore()
  usePageTitle(`Usuarios | ${state.restaurant.name}`)
  const [form, setForm] = useState({ name: '', role: 'garzon' })
  const [filterRole, setFilterRole] = useState('todos')
  const staffUsers = state.staffUsers || []
  const today = new Date().toISOString().slice(0, 10)

  const roleConfig = {
    administrador: { label: 'Administrador', icon: UserCog, color: 'bg-purple-50 text-purple-700', description: 'Acceso completo al sistema' },
    cocina: { label: 'Cocina', icon: ChefHat, color: 'bg-amber-50 text-amber-700', description: 'Gestión de comandas y estados' },
    cajero: { label: 'Cajero', icon: CreditCard, color: 'bg-blue-50 text-blue-700', description: 'Pedidos, cobros y reportes' },
    garzon: { label: 'Garzón', icon: User, color: 'bg-emerald-50 text-emerald-700', description: 'Atención de mesas y pedidos' },
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.name.trim()) return
    addStaffUser(form.name.trim(), form.role)
    setForm({ name: '', role: form.role })
  }

  const filteredUsers = filterRole === 'todos'
    ? staffUsers
    : staffUsers.filter((u) => u.role === filterRole)

  // Calculate daily stats per user
  const getUserDayStats = (userId) => {
    const userOrders = state.orders.filter(
      (o) => o.waiterId === userId && new Date(o.createdAt).toISOString().slice(0, 10) === today,
    )
    return {
      orderCount: userOrders.length,
      totalSales: userOrders.reduce((sum, o) => sum + o.total, 0),
      tables: [...new Set(userOrders.map((o) => o.tableLabel))],
    }
  }

  const roleCounts = {
    administrador: staffUsers.filter((u) => u.role === 'administrador').length,
    cocina: staffUsers.filter((u) => u.role === 'cocina').length,
    cajero: staffUsers.filter((u) => u.role === 'cajero').length,
    garzon: staffUsers.filter((u) => u.role === 'garzon').length,
  }

  return (
    <div className="grid gap-5 w-full">
      <AdminPageHeader
        eyebrow="Equipo"
        title="Usuarios"
        description="Gestiona roles de administradores, cocina, cajeros y garzones. Los garzones reciben un PIN aleatorio de acceso."
      />

      {/* Role summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(roleConfig).map(([role, cfg]) => {
          const Icon = cfg.icon
          return (
            <motion.article
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-stone-500">{cfg.label}</p>
                  <strong className="mt-1 block text-2xl font-black text-stone-950">{roleCounts[role]}</strong>
                </div>
                <div className={`grid h-12 w-12 place-items-center rounded-xl ${cfg.color}`}>
                  <Icon size={24} />
                </div>
              </div>
              <p className="mt-2 text-xs text-stone-400">{cfg.description}</p>
            </motion.article>
          )
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        {/* Create user form */}
        <form className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft" onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">Nuevo</p>
              <h2 className="text-xl font-black text-stone-950">Crear usuario</h2>
            </div>
            <UserPlus className="text-orange-600" size={24} />
          </div>
          <div className="grid gap-3">
            <label className="field">
              <span>Nombre completo</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Carlos Lopez"
                required
              />
            </label>
            <label className="field">
              <span>Rol</span>
              <CustomSelect
                value={form.role}
                onChange={(val) => setForm({ ...form, role: val })}
                options={[
                  { value: 'administrador', label: '👑 Administrador' },
                  { value: 'cocina', label: '👨‍🍳 Cocina' },
                  { value: 'cajero', label: '💰 Cajero' },
                  { value: 'garzon', label: '🍽️ Garzón' },
                ]}
              />
            </label>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              <strong>PIN auto-generado:</strong> Al crear un usuario se genera un PIN aleatorio de 4 dígitos como login.
              {form.role === 'garzon' ? ' El garzón queda asociado a las mesas que atiende.' : ''}
              {form.role === 'cocina' ? ' Solo podrá acceder al panel de cocina.' : ''}
              {form.role === 'cajero' ? ' Solo podrá acceder a pedidos y reportes.' : ''}
              {form.role === 'administrador' ? ' Tendrá acceso completo al sistema.' : ''}
            </div>
            <button type="submit" className="primary-button">
              <span className="inline-flex items-center gap-2">
                <UserPlus size={18} />
                Crear usuario
              </span>
            </button>
          </div>
        </form>

        {/* Users list */}
        <div className="min-w-0 rounded-xl border border-stone-200 bg-white shadow-soft">
          <div className="flex flex-col gap-3 border-b border-stone-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-stone-950">Equipo registrado</h2>
              <p className="text-sm text-stone-500">{staffUsers.length} usuarios</p>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['todos', 'administrador', 'cocina', 'cajero', 'garzon'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFilterRole(role)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-black capitalize transition ${
                    filterRole === role
                      ? 'bg-stone-950 text-white'
                      : 'border border-stone-200 bg-white text-stone-500'
                  }`}
                >
                  {role === 'todos' ? 'Todos' : roleConfig[role]?.label || role}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 p-4">
            {filteredUsers.length ? (
              filteredUsers.map((user) => {
                const cfg = roleConfig[user.role] || roleConfig.garzon
                const Icon = cfg.icon
                const stats = getUserDayStats(user.id)
                return (
                  <article key={user.id} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${cfg.color}`}>
                          <Icon size={22} />
                        </div>
                        <div>
                          <strong className="text-stone-950">{user.name}</strong>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${cfg.color}`}>
                              {cfg.label}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-bold text-stone-600">
                              <Hash size={12} /> PIN: {user.pin}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-black ${user.active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              {user.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className={`grid h-9 w-9 place-items-center rounded-lg border text-sm ${user.active ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}
                          onClick={() => toggleStaffUser(user.id)}
                          title={user.active ? 'Desactivar' : 'Activar'}
                        >
                          {user.active ? <X size={16} /> : <Check size={16} />}
                        </button>
                        <button
                          type="button"
                          className="grid h-9 w-9 place-items-center rounded-lg border border-rose-100 bg-rose-50 text-rose-700"
                          onClick={() => removeStaffUser(user.id)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Day stats */}
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-white p-2 text-center">
                        <p className="text-[0.6rem] font-black uppercase text-stone-400">Pedidos hoy</p>
                        <strong className="text-sm text-stone-700">{stats.orderCount}</strong>
                      </div>
                      <div className="rounded-lg bg-white p-2 text-center">
                        <p className="text-[0.6rem] font-black uppercase text-stone-400">Ventas hoy</p>
                        <strong className="text-sm text-stone-700">{currency.format(stats.totalSales)}</strong>
                      </div>
                      <div className="rounded-lg bg-white p-2 text-center">
                        <p className="text-[0.6rem] font-black uppercase text-stone-400">Mesas</p>
                        <strong className="text-sm text-stone-700">{stats.tables.length ? stats.tables.join(', ') : '—'}</strong>
                      </div>
                    </div>

                    {/* Login link */}
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 p-2.5">
                      <Lock size={14} className="shrink-0 text-blue-600" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.6rem] font-black uppercase tracking-[0.1em] text-blue-600">Link de acceso</p>
                        <p className="truncate text-xs font-mono text-blue-800">
                          {window.location.origin}/login → PIN: {user.pin}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 rounded-md border border-blue-200 bg-white px-2 py-1 text-[0.65rem] font-black text-blue-700 transition hover:bg-blue-100"
                        onClick={() => {
                          void navigator.clipboard?.writeText(`${window.location.origin}/login — PIN: ${user.pin} (${cfg.label}: ${user.name})`)
                        }}
                        title="Copiar link + PIN"
                      >
                        Copiar
                      </button>
                    </div>
                  </article>
                )
              })
            ) : (
              <EmptyAdminState text="No hay usuarios con este filtro." />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function AdminReportsPage() {
  const { state } = useAppStore()
  usePageTitle(`Reportes | ${state.restaurant.name}`)
  const chartData = buildSalesChartData(state.orders)
  const staffUsers = state.staffUsers || []

  const roleConfig = {
    administrador: { label: 'Administrador', color: 'bg-purple-50 text-purple-700', route: '/admin' },
    cocina: { label: 'Cocina', color: 'bg-amber-50 text-amber-700', route: '/cocina' },
    cajero: { label: 'Cajero', color: 'bg-blue-50 text-blue-700', route: '/cajero' },
    garzon: { label: 'Garzón', color: 'bg-emerald-50 text-emerald-700', route: '/garzon' },
  }

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

      {/* Staff credentials section */}
      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">Seguridad</p>
            <h2 className="text-xl font-black text-stone-950">Credenciales de acceso</h2>
            <p className="mt-1 text-sm text-stone-500">PINs de login y rutas de acceso de cada usuario del sistema.</p>
          </div>
          <Lock className="text-blue-600" size={24} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="px-3 py-3 text-xs font-black uppercase tracking-[0.1em] text-stone-400">Usuario</th>
                <th className="px-3 py-3 text-xs font-black uppercase tracking-[0.1em] text-stone-400">Rol</th>
                <th className="px-3 py-3 text-xs font-black uppercase tracking-[0.1em] text-stone-400">PIN</th>
                <th className="px-3 py-3 text-xs font-black uppercase tracking-[0.1em] text-stone-400">Ruta de acceso</th>
                <th className="px-3 py-3 text-xs font-black uppercase tracking-[0.1em] text-stone-400">Estado</th>
              </tr>
            </thead>
            <tbody>
              {staffUsers.map((user) => {
                const cfg = roleConfig[user.role] || roleConfig.garzon
                return (
                  <tr key={user.id} className="border-b border-stone-100 transition hover:bg-stone-50">
                    <td className="px-3 py-3 font-bold text-stone-900">{user.name}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-black ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <code className="rounded-md bg-stone-100 px-2.5 py-1 font-mono text-sm font-black text-stone-800">
                        {user.pin}
                      </code>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-stone-500">
                      {window.location.origin}{cfg.route}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-black ${user.active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {user.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          <strong>Login:</strong> Todos los usuarios acceden desde <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs">{window.location.origin}/login</code> ingresando su PIN de 4 dígitos.
        </div>
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
  const [elapsed, setElapsed] = useState('')

  const tableActiveOrders = state.orders.filter(
    (order) => order.tableId === table.slug && !['Entregado', 'Cancelado'].includes(order.status),
  )
  const isOccupied = tableActiveOrders.length > 0

  // Find the oldest active order to calculate occupancy time
  const oldestOrderTime = isOccupied
    ? tableActiveOrders.reduce((oldest, order) => {
        const t = new Date(order.createdAt).getTime()
        return t < oldest ? t : oldest
      }, Infinity)
    : null

  // Find waiter assigned to this table
  const tableWaiter = isOccupied
    ? tableActiveOrders.find((o) => o.waiterName)?.waiterName
    : null

  useEffect(() => {
    if (!isOccupied || !oldestOrderTime) {
      setElapsed('')
      return
    }
    const tick = () => {
      const diff = Date.now() - oldestOrderTime
      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setElapsed(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      )
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [isOccupied, oldestOrderTime])

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
          {tableWaiter ? (
            <p className="mt-1 text-sm font-bold text-stone-500">
              <User size={14} className="mr-1 inline" />
              {tableWaiter}
            </p>
          ) : null}
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

      {isOccupied && elapsed ? (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 p-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-rose-500 text-white shadow-md shadow-rose-200">
            <Timer size={20} />
          </div>
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-rose-600">
              Tiempo ocupada
            </p>
            <p className="text-xl font-black tabular-nums text-stone-950">{elapsed}</p>
          </div>
        </div>
      ) : null}

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
