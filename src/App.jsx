/* eslint-disable react-hooks/set-state-in-effect, react-hooks/purity */
import { Component, useEffect, useRef, useState, useMemo } from 'react'
import QRCode from 'qrcode'
import { motion, AnimatePresence } from 'framer-motion'
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
  Cell,
  Pie,
  PieChart,
} from 'recharts'
import {
  Activity,
  BadgePercent,
  BarChart3,
  CalendarDays,
  ChefHat,
  CheckCircle2,
  ChevronDown,
  Check,
  ClipboardList,
  Clock3,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Flame,
  Hash,
  History,
  LayoutDashboard,
  Lock,
  LogIn,
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
  TrendingDown,
  User,
  UserCog,
  UserPlus,
  Users,
  X,
  XCircle,
  Building,
  Shield,
  Sparkles,
  Coins,
  Laptop,
  Smartphone,
  Globe,
  FileText,
  Zap,
  AlertTriangle,
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
import { MenuPage } from './pages/MenuPage.jsx'
import {
  currency,
  formatTime,
  elapsedMinutes,
  slugify,
  formatTableName,
  getKitchenBorderClass,
  buildSalesChartData,
  getTopProducts,
  createBlankProductForm,
} from './lib/format.js'
import { usePageTitle } from './hooks/usePageTitle.js'
import { SyncBanner } from './components/ui/SyncBanner.jsx'

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
  const { impersonatedOrgId, impersonateTenant, state } = useAppStore()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen">
      {impersonatedOrgId && (
        <div className="bg-[#10b981] text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold shadow-md z-[999] select-none border-b border-emerald-500">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>MODO SOPORTE ACTIVO: Visualizando datos de "{state?.restaurant?.name || 'Restaurante'}"</span>
          </div>
          <button
            onClick={() => {
              impersonateTenant(null)
              navigate('/superadmin')
            }}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition border border-white/20 text-[0.7rem] uppercase tracking-wider"
          >
            Volver a Superadmin
          </button>
        </div>
      )}
      <div className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage initialMode="email" />} />
          <Route path="/pin" element={<LoginPage initialMode="pin" />} />
          <Route path="/menu/:mesaId" element={<MenuPage />} />

          {/* Protected: Cocina */}
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

          {/* Protected: Cajero layout */}
          <Route path="/cajero" element={
            <RequireAuth roles={['cajero']}>
              <CajeroLayout />
            </RequireAuth>
          }>
            <Route index element={<AdminOrdersPage />} />
            <Route path="pedidos" element={<AdminOrdersPage />} />
            <Route path="reportes" element={<AdminReportsPage />} />
          </Route>

          {/* Protected: Garzon layout */}
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

          {/* Protected: Admin */}
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

          {/* Protected: Superadmin */}
          <Route path="/superadmin" element={
            <RequireAuth roles={['superadmin']}>
              <SuperadminErrorBoundary>
                <RestaurantSuperadmin />
              </SuperadminErrorBoundary>
            </RequireAuth>
          } />

          {/* Default redirects */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </div>
    </div>
  )
}

function RootRedirect() {
  const { currentUser } = useAppStore()
  if (!currentUser) return <Navigate to="/login" replace />
  const redirectMap = {
    superadmin: '/superadmin',
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
    const redirectMap = {
      superadmin: '/superadmin',
      administrador: '/admin',
      cocina: '/cocina',
      cajero: '/cajero',
      garzon: '/garzon',
    }
    return <Navigate to={redirectMap[currentUser.role] || '/login'} replace />
  }

  return children
}

function NexoLogo({ className = "h-20 w-20 text-white" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" fill="none" className="stroke-current" />
      <line x1="50" y1="15" x2="50" y2="95" className="stroke-current opacity-30" />
      <line x1="15" y1="35" x2="50" y2="55" className="stroke-current opacity-30" />
      <line x1="85" y1="35" x2="50" y2="55" className="stroke-current opacity-30" />
      <path d="M30,65 L45,50 L60,58 L75,38" className="stroke-brand-200" strokeWidth="3" />
      <circle cx="75" cy="38" r="3" fill="currentColor" />
      <polyline points="68,38 75,38 75,45" className="stroke-brand-200" strokeWidth="3" />
    </svg>
  )
}

class SuperadminErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Error inesperado' }
  }

  componentDidCatch(error) {
    console.error('Superadmin render error:', error)
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <main className="grid min-h-screen place-items-center bg-stone-50 p-4">
        <section className="w-full max-w-xl rounded-[2rem] border border-rose-200 bg-white p-6 text-center shadow-soft">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-sans text-2xl font-black text-stone-950">
            El superadmin tuvo un problema temporal
          </h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">
            La pantalla no quedará en blanco. Revisa el registro creado o recarga para volver al panel.
          </p>
          <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-xs font-bold text-rose-700">
            {this.state.message}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-2xl bg-stone-950 px-5 py-3 text-sm font-black text-white"
          >
            Recargar superadmin
          </button>
        </section>
      </main>
    )
  }
}

function LoginPage({ initialMode = 'email' }) {
  const { login, currentUser, organizations, switchOrganization, currentOrganizationId, registerRestaurant } = useAppStore()
  const navigate = useNavigate()
  const [loginMode] = useState(initialMode) // 'email' | 'pin'
  const [pin, setPin] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef(null)

  const [orgSlugInput, setOrgSlugInput] = useState('')
  const [orgSearchError, setOrgSearchError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orgParam = params.get('org') || params.get('sucursal')
    if (orgParam && organizations.length > 0) {
      const cleanParam = orgParam.trim().toLowerCase()
      const found = organizations.find(
        (o) =>
          o.slug?.trim().toLowerCase() === cleanParam ||
          o.name?.trim().toLowerCase() === cleanParam
      )
      if (found) {
        switchOrganization(found.id)
      }
    }
  }, [organizations, switchOrganization])

  const handleVerifyOrg = () => {
    if (!orgSlugInput.trim()) {
      setOrgSearchError('Por favor ingresa el nombre o código de tu sucursal.')
      return
    }
    const cleanInput = orgSlugInput.trim().toLowerCase()
    const found = organizations
      .filter((o) => o.slug !== 'empresa-jefe' && o.slug !== 'ncxo-plus' && o.slug !== 'prueba-de-cambio')
      .find(
        (o) =>
          o.slug?.trim().toLowerCase() === cleanInput ||
          o.name?.trim().toLowerCase() === cleanInput
      )
    if (found) {
      switchOrganization(found.id)
      setOrgSearchError('')
    } else {
      setOrgSearchError('No se encontró ninguna sucursal con ese nombre o código.')
    }
  }

  // Registration modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [regCompanyName, setRegCompanyName] = useState('')
  const [regAdminName, setRegAdminName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)
  const [regLoading, setRegLoading] = useState(false)

  useEffect(() => {
    if (currentUser) {
      const redirectMap = {
        superadmin: '/superadmin',
        administrador: '/admin',
        cocina: '/cocina',
        cajero: '/cajero',
        garzon: '/garzon',
      }
      navigate(redirectMap[currentUser.role] || '/admin', { replace: true })
    }
  }, [currentUser, navigate])

  const handlePinChange = async (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    setPin(digits)
    setError('')

    if (digits.length === 4) {
      try {
        const user = await login(digits)
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
          }, 600)
        }
      } catch (err) {
        setError(err.message || 'Error al iniciar sesión')
        setShake(true)
        setTimeout(() => {
          setShake(false)
          setPin('')
        }, 600)
      }
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Ingresa tu correo electrónico')
      return
    }
    if (!password) {
      setError('Ingresa tu contraseña')
      return
    }

    try {
      const user = await login(email, password)
      if (user) {
        if (user.role === 'superadmin') {
          navigate('/superadmin', { replace: true })
        } else {
          navigate('/admin', { replace: true })
        }
      } else {
        setError('Credenciales incorrectas o usuario inactivo')
        setShake(true)
        setTimeout(() => setShake(false), 600)
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setRegError('')
    if (!regCompanyName || !regAdminName || !regEmail || !regPassword) {
      setRegError('Completa todos los campos')
      return
    }
    setRegLoading(true)
    try {
      await registerRestaurant(regCompanyName, regAdminName, regEmail, regPassword)
      setRegSuccess(true)
      setTimeout(() => {
        setShowRegisterModal(false)
        setRegSuccess(false)
        setRegCompanyName('')
        setRegAdminName('')
        setRegEmail('')
        setRegPassword('')
        setEmail(regEmail)
      }, 2500)
    } catch (err) {
      setRegError(err.message || 'Error al registrar la empresa')
    } finally {
      setRegLoading(false)
    }
  }

  const activeOrg = organizations.find((o) => o.id === currentOrganizationId)

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans">
      {/* LEFT PANEL: Branding (Teal Gradient / Nexo style) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-brand-900 p-12 text-white lg:flex overflow-hidden">
        {/* Background wave decorative pattern */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute -right-32 -bottom-32 h-[450px] w-[450px] rounded-full bg-brand-600/30 blur-[100px]" />
        
        {/* Top brand indicator */}
        <div className="z-10 flex items-center gap-2">
          <span className="text-sm font-bold tracking-[0.2em] uppercase opacity-75">AcroDevs Systems</span>
        </div>

        {/* Center graphics matching nexo.acrodevs.cl */}
        <div className="z-10 my-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <NexoLogo className="h-28 w-28 text-brand-200 drop-shadow-xl animate-pulse" />
          </motion.div>

          <h2 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
            Empresa de Jefe
          </h2>
          <p className="mt-3 text-lg font-medium text-brand-100 opacity-90">
            Sistema Inteligente de Gestión
          </p>

          <div className="mt-8 flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-900/30 px-4 py-1.5 text-sm font-bold text-brand-200">
            <CheckCircle2 size={16} className="text-brand-300" />
            <span>Empresa verificada ✓</span>
          </div>
        </div>

        {/* Footer legal */}
        <div className="z-10 flex justify-between text-xs text-brand-200/60">
          <span>AcroDevs · Sistema de Ventas</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Términos</a>
            <a href="#" className="hover:underline">Privacidad</a>
            <a href="#" className="hover:underline">Contacto</a>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Form */}
      <div className="flex w-full flex-col justify-between bg-white px-6 py-12 lg:w-1/2 md:px-16 lg:px-24">
        {/* Responsive Header for Mobile/Tablet */}
        <div className="flex justify-between items-center lg:hidden">
          <div className="flex items-center gap-2 text-brand-700">
            <NexoLogo className="h-10 w-10 text-brand-600" />
            <span className="font-extrabold text-lg">Empresa de Jefe</span>
          </div>
          <span className="text-xs bg-brand-50 border border-brand-200 px-2 py-0.5 rounded text-brand-700 font-bold">✓ Verificado</span>
        </div>

        <div className="my-auto mx-auto w-full max-w-md">
          {/* Lock/Security Icon Badge */}
          <div className="mb-6 flex justify-center lg:justify-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 border border-brand-100">
              <Lock size={20} />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-black text-stone-800">
              {loginMode === 'email' ? 'Administración' : 'Personal de Local'}
            </h1>
            <p className="mt-1.5 text-sm text-stone-500 font-semibold">
              {loginMode === 'email' 
                ? 'Ingresa las credenciales de tu empresa' 
                : 'Selecciona tu sucursal e ingresa tu PIN de acceso'}
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg bg-rose-50 border border-rose-100 p-3 text-xs font-bold text-rose-600 text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Email / Password Form */}
          {loginMode === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="ejemplo@empresa.com"
                    className="h-12 w-full rounded-lg border border-stone-200 bg-stone-50/50 pl-11 pr-4 text-sm font-semibold text-stone-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                    Contraseña
                  </label>
                  <button type="button" className="text-xs font-bold text-brand-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-lg border border-stone-200 bg-stone-50/50 pl-11 pr-12 text-sm font-semibold text-stone-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#c2553d] hover:bg-[#9a3f2c] text-sm font-bold text-white shadow-md shadow-brand-700/10 transition"
              >
                <span>Iniciar Sesión</span>
              </motion.button>
            </form>
          ) : (
            /* PIN Staff Login Form */
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Sucursal / Restaurante
                </label>
                {activeOrg ? (
                  <div className="flex h-12 w-full items-center justify-between rounded-lg border border-brand-200 bg-brand-50/50 px-4 text-sm font-semibold text-brand-900">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-brand-600" />
                      <span>{activeOrg.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        switchOrganization('')
                        setOrgSlugInput('')
                        setOrgSearchError('')
                        setPin('')
                      }}
                      className="text-xs font-bold text-brand-600 hover:text-brand-900 hover:underline transition"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Escribe el nombre o código de tu sucursal"
                        value={orgSlugInput}
                        onChange={(e) => {
                          setOrgSlugInput(e.target.value)
                          setOrgSearchError('')
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleVerifyOrg()
                          }
                        }}
                        className="h-12 w-full rounded-lg border border-stone-200 bg-stone-50/50 pl-11 pr-4 text-sm font-semibold text-stone-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 placeholder:text-stone-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyOrg}
                      className="h-10 w-full rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                    >
                      Verificar Sucursal
                    </button>
                    {orgSearchError && (
                      <p className="text-xs text-red-500 font-semibold">{orgSearchError}</p>
                    )}
                  </div>
                )}
              </div>

              {activeOrg && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      PIN de acceso (4 dígitos)
                    </label>
                    <motion.div animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}} transition={{ duration: 0.4 }}>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        <input
                          ref={inputRef}
                          type="password"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={4}
                          value={pin}
                          onChange={(e) => handlePinChange(e.target.value)}
                          placeholder="••••"
                          className="h-12 w-full rounded-lg border border-stone-200 bg-stone-50/50 pl-11 text-center text-xl font-bold tracking-[0.5em] text-stone-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500 placeholder:tracking-[0.2em] placeholder:text-stone-300"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-center gap-3 py-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-2.5 w-2.5 rounded-full border transition-all ${
                          pin.length > i ? 'bg-brand-600 border-brand-600 scale-110' : 'border-stone-300 bg-stone-100'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </form>
          )}

          {/* Links and Mode Switchers */}
          <div className="mt-8 flex flex-col items-center space-y-3 text-center">
            {loginMode === 'email' && (
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="text-xs font-extrabold text-brand-600 hover:text-brand-700 hover:underline transition"
              >
                Registrar nueva empresa
              </button>
            )}
          </div>
        </div>

        {/* Footer brand info */}
        <div className="mt-12 text-center text-xs text-stone-400 font-medium">
          Desarrollado por <span className="font-extrabold text-brand-600">AcroDevs</span> · Todos los derechos reservados
        </div>
      </div>

      {/* REGISTER RESTAURANT MODAL */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-stone-100"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowRegisterModal(false)}
                className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 transition"
              >
                <X size={18} />
              </button>

              <div className="mb-4">
                <h3 className="text-lg font-black text-stone-800">Registrar Nueva Empresa</h3>
                <p className="text-xs text-stone-500 font-semibold mt-0.5">
                  Crea tu local en el sistema e ingresa las credenciales administrativas.
                </p>
              </div>

              {regError && (
                <div className="mb-4 rounded-lg bg-rose-50 border border-rose-100 p-3 text-xs font-bold text-rose-600">
                  {regError}
                </div>
              )}

              {regSuccess && (
                <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-xs font-bold text-emerald-700 text-center">
                  🎉 ¡Empresa registrada con éxito! Puedes iniciar sesión ahora.
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Nombre del Restaurante / Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={regCompanyName}
                    onChange={(e) => setRegCompanyName(e.target.value)}
                    placeholder="Ej. Restaurante Guaton XII"
                    className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm font-semibold outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Nombre del Administrador
                  </label>
                  <input
                    type="text"
                    required
                    value={regAdminName}
                    onChange={(e) => setRegAdminName(e.target.value)}
                    placeholder="Ej. Diego Henríquez"
                    className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm font-semibold outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Correo electrónico del Administrador
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm font-semibold outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Contraseña del Administrador
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm font-semibold outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-800"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="h-10 rounded-lg px-4 text-sm font-bold text-stone-500 hover:bg-stone-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={regLoading || regSuccess}
                    className="h-10 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white px-5 text-sm font-bold shadow transition flex items-center justify-center"
                  >
                    {regLoading ? 'Registrando...' : 'Registrar Empresa'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}


// ─── Datos demo para el superadmin ────────────────────────────────────────────
const DEMO_TICKETS = [
  { id: 't1', restaurant: 'Restaurante Guaton XII', subject: 'Error al imprimir comandas', priority: 'alta', status: 'abierto', created: new Date(Date.now() - 90*60000).toISOString(), sla: 4, assignee: 'Diego H.' },
  { id: 't2', restaurant: 'Ncxo+', subject: 'No carga el menu QR', priority: 'alta', status: 'en_progreso', created: new Date(Date.now() - 120*60000).toISOString(), sla: 2, assignee: 'Sin asignar' },
  { id: 't3', restaurant: 'Restaurante El Dios', subject: 'Solicitud de cambio de plan', priority: 'media', status: 'abierto', created: new Date(Date.now() - 300*60000).toISOString(), sla: 24, assignee: 'Sin asignar' },
]

const DEMO_AUDIT = [
  { id: 'a1', user: 'diegohenriquez176@gmail.com', action: 'Inicio de sesion como superadmin', ts: new Date(Date.now() - 5*60000).toISOString(), level: 'info' },
  { id: 'a2', user: 'diegohen2005gonzales@gmail.com', action: 'Login como administrador — Restaurante Guaton XII', ts: new Date(Date.now() - 18*60000).toISOString(), level: 'info' },
  { id: 'a3', user: 'unknown@intento.com', action: 'Intento de login fallido (5 intentos)', ts: new Date(Date.now() - 42*60000).toISOString(), level: 'warn' },
  { id: 'a4', user: 'diegohenriquez176@gmail.com', action: 'Cambio de plan: Guaton XII a Pro', ts: new Date(Date.now() - 2*3600000).toISOString(), level: 'info' },
  { id: 'a5', user: 'sistema', action: 'Backup automatico completado', ts: new Date(Date.now() - 6*3600000).toISOString(), level: 'success' },
]

const DEMO_MODULES_LIST = [
  { id: 'pos', name: 'POS / Caja', icon: '💳', desc: 'Sistema de punto de venta', enabled: true },
  { id: 'qr', name: 'Menu QR', icon: '📱', desc: 'Menu digital via codigo QR', enabled: true },
  { id: 'kds', name: 'Panel Cocina (KDS)', icon: '👨‍🍳', desc: 'Display para cocina en tiempo real', enabled: true },
  { id: 'delivery', name: 'Delivery', icon: '🛵', desc: 'Gestion de pedidos a domicilio', enabled: false },
  { id: 'reservas', name: 'Reservas', icon: '📅', desc: 'Sistema de reservas de mesas', enabled: true },
  { id: 'reportes', name: 'Reportes Avanzados', icon: '📊', desc: 'Reportes con exportacion CSV', enabled: false },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', desc: 'Notificaciones por WhatsApp', enabled: true },
  { id: 'fidelizacion', name: 'Fidelizacion', icon: '🎁', desc: 'Puntos y recompensas para clientes', enabled: false },
]

const SERVICE_STATUS_LIST = [
  { name: 'API', status: 'ok', uptime: '99.98%', latency: '42ms' },
  { name: 'Base de Datos', status: 'ok', uptime: '99.95%', latency: '8ms' },
  { name: 'Pagos', status: 'ok', uptime: '99.9%', latency: '210ms' },
  { name: 'KDS / Cocina', status: 'degraded', uptime: '98.2%', latency: '180ms' },
  { name: 'Menu QR', status: 'ok', uptime: '100%', latency: '28ms' },
  { name: 'Storage', status: 'ok', uptime: '100%', latency: '15ms' },
]

function saFormatRelative(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (diff < 60) return `hace ${diff}s`
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  return `hace ${Math.floor(diff / 86400)}d`
}

function saPlanColor(plan) {
  const p = plan || ''
  if (p.includes('Empresa') || p.includes('Pro')) return 'bg-purple-50 text-purple-700 border-purple-200'
  if (p.includes('Unica') || p.includes('Única')) return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-brand-50 text-brand-700 border-brand-200'
}

function saStatusDot(status) {
  const s = (status || '').toLowerCase()
  if (s === 'activo') return 'bg-emerald-500'
  if (s === 'inactivo') return 'bg-red-400'
  return 'bg-stone-300'
}

function RestaurantSuperadmin() {
  const {
    state,
    organizations,
    saveOrganization,
    removeOrganization,
    impersonateTenant,
    logout,
    currentUser,
    remoteError,
  } = useAppStore()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [showOrgModal, setShowOrgModal] = useState(false)
  const [editingOrg, setEditingOrg] = useState(null)
  const [orgForm, setOrgForm] = useState({ name: '', slug: '', rut: '', mrr: '', plan: 'Basico', status: 'Activo' })
  const [orgSaving, setOrgSaving] = useState(false)
  const [orgError, setOrgError] = useState('')

  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketMsg, setTicketMsg] = useState('')
  const [ticketChats, setTicketChats] = useState({ t1: [], t2: [], t3: [] })

  const [modulesByOrg, setModulesByOrg] = useState(null)
  const [modulesOrgId, setModulesOrgId] = useState('')

  usePageTitle('Superadmin | AcroDevs SV')

  const totalMrr = organizations.reduce((s, o) => s + Number(o.mrr || 0), 0)
  const activeOrgs = organizations.filter(o => (o.status || '').toLowerCase().includes('activ'))
  const inactiveOrgs = organizations.filter(o => !(o.status || '').toLowerCase().includes('activ'))
  const todayOrders = (state.orders || []).filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
  const dailySales = todayOrders.reduce((s, o) => s + Number(o.total || 0), 0)
  const activeOrders = (state.orders || []).filter(o => ['Pendiente', 'En preparacion', 'Listo'].includes(o.status))
  const openTickets = DEMO_TICKETS.filter(t => t.status !== 'cerrado').length
  const urgentTickets = DEMO_TICKETS.filter(t => t.priority === 'alta')

  const filteredOrgs = organizations.filter(o =>
    (o.name + ' ' + o.slug + ' ' + (o.rut || '')).toLowerCase().includes(searchQuery.toLowerCase())
  )

  const mrrByPlan = organizations.reduce((acc, o) => {
    const p = o.plan || 'Basico'
    acc[p] = (acc[p] || 0) + Number(o.mrr || 0)
    return acc
  }, {})

  const mrrChartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const factor = 0.7 + i * 0.06
    return {
      mes: d.toLocaleDateString('es-CL', { month: 'short' }),
      mrr: Math.round(totalMrr * factor),
      meta: Math.round(totalMrr * 1.1),
    }
  })

  const openEditModal = (org) => {
    setEditingOrg(org)
    setOrgForm({ name: org.name, slug: org.slug, rut: org.rut || '', mrr: org.mrr || '', plan: org.plan || 'Basico', status: org.status || 'Activo' })
    setOrgError('')
    setShowOrgModal(true)
  }

  const openCreateModal = () => {
    setEditingOrg(null)
    setOrgForm({ name: '', slug: '', rut: '', mrr: '', plan: 'Basico', status: 'Activo' })
    setOrgError('')
    setShowOrgModal(true)
  }

  const handleSaveOrg = async (e) => {
    e.preventDefault()
    if (!orgForm.name.trim() || !orgForm.slug.trim()) { setOrgError('Nombre y slug son requeridos.'); return }
    setOrgSaving(true); setOrgError('')
    try {
      await saveOrganization({
        id: editingOrg?.id,
        name: orgForm.name.trim(), slug: orgForm.slug.trim(),
        plan: orgForm.plan, status: orgForm.status,
        rut: orgForm.rut.trim(), mrr: Number(orgForm.mrr || 0),
      })
      setShowOrgModal(false)
    } catch (err) { setOrgError(err.message || 'Error al guardar.') }
    finally { setOrgSaving(false) }
  }

  const handleDeleteOrg = async (org) => {
    if (!window.confirm('Eliminar "' + org.name + '"? Esta accion no se puede deshacer.')) return
    await removeOrganization(org.id)
  }

  const handleImpersonate = (org) => { impersonateTenant(org.id); navigate('/admin') }
  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const toggleModule = (orgId, moduleId) => {
    setModulesByOrg(prev => {
      const base = prev || Object.fromEntries(organizations.map(o => [o.id, DEMO_MODULES_LIST.map(m => ({ ...m }))]))
      return { ...base, [orgId]: base[orgId].map(m => m.id === moduleId ? { ...m, enabled: !m.enabled } : m) }
    })
  }

  const getOrgModules = (orgId) => modulesByOrg?.[orgId] || DEMO_MODULES_LIST.map(m => ({ ...m }))

  const sendTicketMsg = (ticketId) => {
    if (!ticketMsg.trim()) return
    setTicketChats(prev => ({ ...prev, [ticketId]: [...(prev[ticketId] || []), { from: 'superadmin', msg: ticketMsg.trim(), ts: new Date().toISOString() }] }))
    setTicketMsg('')
  }

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'restaurantes', label: 'Restaurantes', icon: Building },
    { id: 'finanzas', label: 'Finanzas', icon: DollarSign },
    { id: 'soporte', label: 'Soporte', icon: MessageSquare, badge: openTickets },
    { id: 'modulos', label: 'Modulos', icon: Sparkles },
    { id: 'monitoreo', label: 'Monitoreo', icon: Activity },
    { id: 'seguridad', label: 'Seguridad', icon: Shield },
  ]

  const serviceAll = SERVICE_STATUS_LIST.every(s => s.status === 'ok')
  const fmtCLP = v => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v)

  return (
    <main className="min-h-screen w-full bg-[#faf6f0] text-stone-950">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg,#c2553d,#9a3f2c)' }}>
              <span className="text-base font-black text-white">A</span>
            </div>
            <div className="hidden sm:block min-w-0">
              <h1 className="text-base font-black text-stone-900 leading-none">AcroDevs SV</h1>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-0.5">Panel Superadmin</p>
            </div>
          </div>

          <div className={`hidden lg:flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold border ${serviceAll ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
            <span className={`h-2 w-2 rounded-full ${serviceAll ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
            {serviceAll ? 'Todos los servicios operativos' : 'Servicio degradado detectado'}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={openCreateModal}
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-black text-white shadow transition hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#c2553d,#9a3f2c)' }}>
              <Plus size={14} /> Nuevo restaurante
            </button>
            <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
              <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-black text-brand-700">
                {currentUser?.name?.[0] || 'S'}
              </div>
              <span className="text-xs font-bold text-stone-700 hidden sm:block">{currentUser?.name || 'Superadmin'}</span>
            </div>
            <button onClick={handleLogout}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-600 transition hover:bg-rose-100">
              <LogOut size={14} /> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto px-4 pb-3 lg:px-8 [scrollbar-width:none]">
          {TABS.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} type="button" onClick={() => setActiveTab(id)}
              className={`relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-4 text-xs font-black transition-all ${activeTab === id ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-500 ring-1 ring-stone-200 hover:ring-stone-300 hover:text-stone-800'}`}>
              <Icon size={14} />{label}
              {badge > 0 && <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">{badge}</span>}
            </button>
          ))}
        </nav>
      </header>

      <div className="px-4 py-6 lg:px-8 space-y-6">
        {remoteError && (
          <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
            <AlertTriangle size={16} /> {remoteError}
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {activeTab === 'dashboard' && (
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'MRR Total', value: fmtCLP(totalMrr), sub: '+12% vs mes anterior', icon: TrendingUp, color: '#c2553d' },
                { label: 'Restaurantes activos', value: activeOrgs.length, sub: inactiveOrgs.length + ' suspendidos · ' + organizations.length + ' total', icon: Building, color: '#7c3aed' },
                { label: 'Pedidos hoy', value: todayOrders.length, sub: fmtCLP(dailySales) + ' en ventas', icon: ShoppingBag, color: '#f59e0b' },
                { label: 'Tickets soporte', value: openTickets, sub: urgentTickets.length + ' de alta prioridad', icon: MessageSquare, color: urgentTickets.length > 0 ? '#ef4444' : '#c2553d' },
              ].map(kpi => (
                <div key={kpi.label} className="relative overflow-hidden rounded-2xl bg-white border border-stone-200/80 p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: kpi.color + '18' }}>
                      <kpi.icon size={18} style={{ color: kpi.color }} />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-stone-900">{kpi.value}</div>
                  <div className="mt-1 text-[11px] font-semibold text-stone-500">{kpi.label}</div>
                  <div className="mt-0.5 text-[10px] font-medium text-stone-400">{kpi.sub}</div>
                  <div className="absolute bottom-0 left-0 h-1 w-full rounded-b-2xl" style={{ background: kpi.color + '40' }} />
                </div>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <div className="rounded-2xl bg-white border border-stone-200/80 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-black text-stone-900">Ingresos Mensuales (MRR)</h2>
                    <p className="text-[11px] text-stone-400 mt-0.5">Linea verde = meta mensual</p>
                  </div>
                  <span className="text-xs font-bold text-brand-600">Ultimos 6 meses</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mrrChartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="saMrrGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c2553d" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#c2553d" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => '$' + (v/1000).toFixed(0) + 'k'} />
                      <Tooltip formatter={(v, n) => [fmtCLP(v), n === 'mrr' ? 'MRR' : 'Meta']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 12 }} />
                      <Area type="monotone" dataKey="mrr" stroke="#c2553d" strokeWidth={2.5} fill="url(#saMrrGrad)" dot={{ fill: '#c2553d', r: 4 }} name="mrr" />
                      <Area type="monotone" dataKey="meta" stroke="#c2553d" strokeWidth={1.5} fill="none" strokeDasharray="6 3" dot={false} name="meta" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(mrrByPlan).map(([plan, mrr]) => (
                    <div key={plan} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${saPlanColor(plan)}`}>
                      {plan}: {fmtCLP(mrr)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-stone-200/80 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-black text-stone-900">Restaurantes</h2>
                  <button onClick={() => setActiveTab('restaurantes')} className="text-[11px] font-bold text-brand-600 hover:underline">Ver todos →</button>
                </div>
                <div className="space-y-2">
                  {organizations.slice(0, 5).map(org => (
                    <div key={org.id} className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-3 py-2.5 hover:bg-stone-100/80 transition">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-[11px] font-black text-brand-700">
                          {org.name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-stone-800">{org.name}</p>
                          <p className="text-[10px] text-stone-400">{org.plan}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`h-2 w-2 rounded-full ${saStatusDot(org.status)}`} />
                        <button onClick={() => handleImpersonate(org)} className="rounded-lg bg-white border border-stone-200 px-2 py-1 text-[10px] font-black text-stone-600 hover:border-brand-400 hover:text-brand-700 transition">Ver</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl bg-white border border-stone-200/80 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-black text-stone-900">Tickets Urgentes</h2>
                  <button onClick={() => setActiveTab('soporte')} className="text-[11px] font-bold text-rose-500 hover:underline">Ver soporte →</button>
                </div>
                {urgentTickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-stone-400">
                    <CheckCircle2 size={28} className="text-emerald-400 mb-2" />
                    <p className="text-xs font-semibold">Sin tickets urgentes</p>
                  </div>
                ) : urgentTickets.map(t => (
                  <div key={t.id} className="rounded-xl border border-red-100 bg-red-50 p-3 mb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-black text-stone-800">{t.subject}</p>
                        <p className="text-[11px] font-semibold text-stone-500 mt-0.5">🏪 {t.restaurant}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-red-100 border border-red-200 px-2 py-0.5 text-[9px] font-black uppercase text-red-600">ALTA</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400">SLA: {t.sla}h · {saFormatRelative(t.created)}</span>
                      <button onClick={() => { setSelectedTicket(t); setActiveTab('soporte') }} className="text-[10px] font-black text-red-600 hover:underline">Atender →</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-white border border-stone-200/80 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-black text-stone-900">Estado de Servicios</h2>
                  <button onClick={() => setActiveTab('monitoreo')} className="text-[11px] font-bold text-brand-600 hover:underline">Ver monitoreo →</button>
                </div>
                <div className="space-y-2">
                  {SERVICE_STATUS_LIST.map(svc => (
                    <div key={svc.name} className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${svc.status === 'ok' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
                        <span className="text-xs font-bold text-stone-700">{svc.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-semibold text-stone-500">
                        <span>{svc.latency}</span>
                        <span className={svc.status === 'ok' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{svc.uptime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── RESTAURANTES ── */}
        {activeTab === 'restaurantes' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, slug, RUT..."
                  className="h-10 w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 text-sm font-semibold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
              </div>
              <button onClick={openCreateModal}
                className="sm:ml-auto flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-black text-white shadow"
                style={{ background: 'linear-gradient(135deg,#c2553d,#9a3f2c)' }}>
                <Plus size={14} /> Nuevo restaurante
              </button>
            </div>
            <div className="rounded-2xl bg-white border border-stone-200/80 shadow-sm overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    {['Restaurante','Plan','MRR','Estado','Acciones'].map(h => (
                      <th key={h} className="px-5 py-3 text-left font-black text-stone-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrgs.map(org => (
                    <tr key={org.id} className="hover:bg-stone-50/60 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg font-black text-sm" style={{ background: '#c2553d20', color: '#c2553d' }}>
                            {org.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-stone-800">{org.name}</p>
                            <p className="text-stone-400 font-medium">{org.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black ${saPlanColor(org.plan)}`}>{org.plan}</span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-stone-700">{fmtCLP(org.mrr || 0)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`flex items-center gap-1.5 w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-black ${(org.status||'').toLowerCase().includes('activ') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${saStatusDot(org.status)}`} />
                          {org.status || 'Activo'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleImpersonate(org)} className="flex h-7 items-center gap-1 rounded-lg border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-black text-brand-700 hover:bg-brand-100 transition">
                            <LogIn size={11} /> Soporte
                          </button>
                          <button onClick={() => openEditModal(org)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 text-stone-400 hover:text-indigo-600 hover:border-indigo-300 transition">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => handleDeleteOrg(org)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-200 transition">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredOrgs.length === 0 && (
                    <tr><td colSpan={5} className="py-12 text-center text-sm font-semibold text-stone-400">No se encontraron restaurantes</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── FINANZAS ── */}
        {activeTab === 'finanzas' && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'MRR Total', value: fmtCLP(totalMrr), trend: '+12%' },
                { label: 'ARR Estimado', value: fmtCLP(totalMrr * 12), trend: '+12%' },
                { label: 'Churn Rate', value: '2.4%', trend: '-0.3%' },
                { label: 'ARPU', value: fmtCLP(organizations.length ? Math.round(totalMrr / organizations.length) : 0), trend: '+5%' },
              ].map(k => (
                <div key={k.label} className="rounded-2xl bg-white border border-stone-200/80 p-5 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">{k.label}</p>
                  <p className="mt-2 text-2xl font-black text-stone-900">{k.value}</p>
                  <p className="mt-1 text-[10px] font-black text-emerald-600">{k.trend}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-white border border-stone-200/80 p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-black text-stone-900">MRR por Plan</h2>
              <div className="space-y-3">
                {Object.entries(mrrByPlan).map(([plan, mrr]) => {
                  const pct = totalMrr > 0 ? Math.round((mrr / totalMrr) * 100) : 0
                  return (
                    <div key={plan}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-bold text-stone-700">{plan}</span>
                        <span className="font-black text-stone-900">{fmtCLP(mrr)} <span className="text-stone-400">({pct}%)</span></span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-stone-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: pct + '%', background: plan.includes('Empresa') || plan.includes('Pro') ? '#7c3aed' : plan.includes('nica') ? '#f59e0b' : '#c2553d' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── SOPORTE ── */}
        {activeTab === 'soporte' && (
          <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="space-y-2">
              <h2 className="text-sm font-black text-stone-900">Tickets ({DEMO_TICKETS.length})</h2>
              {DEMO_TICKETS.map(t => (
                <button key={t.id} onClick={() => setSelectedTicket(t)}
                  className={`w-full text-left rounded-xl border p-4 transition hover:shadow-md ${selectedTicket?.id === t.id ? 'border-brand-400 bg-brand-50 shadow-md' : 'border-stone-200 bg-white'}`}>
                  <div className="flex items-start gap-2 justify-between">
                    <p className="text-xs font-black text-stone-800 leading-tight">{t.subject}</p>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${t.priority === 'alta' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>{t.priority}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] font-semibold text-stone-500">🏪 {t.restaurant}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black ${t.status === 'abierto' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {t.status === 'abierto' ? 'Abierto' : 'En progreso'}
                    </span>
                    <span className="text-[10px] text-stone-400">{saFormatRelative(t.created)}</span>
                  </div>
                </button>
              ))}
            </div>
            {selectedTicket ? (
              <div className="rounded-2xl bg-white border border-stone-200/80 shadow-sm flex flex-col" style={{ minHeight: 480 }}>
                <div className="border-b border-stone-100 px-6 py-4">
                  <h2 className="text-base font-black text-stone-900">{selectedTicket.subject}</h2>
                  <p className="text-[11px] text-stone-500 mt-0.5">🏪 {selectedTicket.restaurant} · Asignado: <strong>{selectedTicket.assignee}</strong> · SLA: {selectedTicket.sla}h</p>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3" style={{ maxHeight: 280 }}>
                  {(ticketChats[selectedTicket.id] || []).length === 0 && (
                    <p className="text-center text-xs text-stone-400 mt-8">No hay mensajes. Inicia la conversacion.</p>
                  )}
                  {(ticketChats[selectedTicket.id] || []).map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'superadmin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-xs font-semibold ${msg.from === 'superadmin' ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-700'}`}>
                        <p>{msg.msg}</p>
                        <p className={`mt-1 text-[10px] ${msg.from === 'superadmin' ? 'text-brand-200' : 'text-stone-400'}`}>{saFormatRelative(msg.ts)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-100 px-6 py-4 flex gap-2">
                  <input type="text" value={ticketMsg} onChange={e => setTicketMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') sendTicketMsg(selectedTicket.id) }}
                    placeholder="Respuesta interna..."
                    className="flex-1 h-10 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm font-semibold outline-none focus:border-brand-500" />
                  <button onClick={() => sendTicketMsg(selectedTicket.id)}
                    className="h-10 px-4 rounded-xl font-black text-white text-xs shadow"
                    style={{ background: 'linear-gradient(135deg,#c2553d,#9a3f2c)' }}>Enviar</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20 text-stone-400">
                <MessageSquare size={32} className="mb-3 text-stone-300" />
                <p className="text-sm font-semibold">Selecciona un ticket</p>
              </div>
            )}
          </div>
        )}

        {/* ── MODULOS ── */}
        {activeTab === 'modulos' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-stone-200/80 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-black text-stone-900">Modulos por restaurante</h2>
                <select value={modulesOrgId} onChange={e => setModulesOrgId(e.target.value)}
                  className="h-9 rounded-xl border border-stone-200 bg-stone-50 px-3 text-xs font-bold text-stone-700 outline-none">
                  <option value="">— Seleccionar —</option>
                  {organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
              {modulesOrgId ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {getOrgModules(modulesOrgId).map(mod => (
                    <div key={mod.id} className={`rounded-xl border p-4 transition-all ${mod.enabled ? 'border-brand-200 bg-brand-50' : 'border-stone-200 bg-stone-50'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl">{mod.icon}</span>
                        <button onClick={() => toggleModule(modulesOrgId, mod.id)}
                          className={`relative h-5 w-9 rounded-full transition-all ${mod.enabled ? 'bg-brand-500' : 'bg-stone-300'}`}>
                          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${mod.enabled ? 'left-4' : 'left-0.5'}`} />
                        </button>
                      </div>
                      <p className="text-xs font-black text-stone-800">{mod.name}</p>
                      <p className="mt-0.5 text-[10px] text-stone-500">{mod.desc}</p>
                      <p className={`mt-2 text-[9px] font-black uppercase ${mod.enabled ? 'text-brand-600' : 'text-stone-400'}`}>{mod.enabled ? '✓ Activo' : '○ Inactivo'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-stone-400">
                  <Sparkles size={32} className="mb-3 text-stone-300" />
                  <p className="text-sm font-semibold">Selecciona un restaurante</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MONITOREO ── */}
        {activeTab === 'monitoreo' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-stone-200/80 p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-black text-stone-900">Estado de Servicios en Tiempo Real</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {SERVICE_STATUS_LIST.map(svc => (
                  <div key={svc.name} className={`rounded-xl border p-4 ${svc.status === 'ok' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-stone-800">{svc.name}</span>
                      <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${svc.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="rounded-lg bg-white px-2 py-1.5 text-center">
                        <p className="font-black text-stone-900">{svc.uptime}</p>
                        <p className="text-stone-400">Uptime</p>
                      </div>
                      <div className="rounded-lg bg-white px-2 py-1.5 text-center">
                        <p className="font-black text-stone-900">{svc.latency}</p>
                        <p className="text-stone-400">Latencia</p>
                      </div>
                    </div>
                    <p className={`mt-2 text-[10px] font-black text-center ${svc.status === 'ok' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {svc.status === 'ok' ? '✓ Operativo' : '⚠ Degradado'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SEGURIDAD ── */}
        {activeTab === 'seguridad' && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Sesiones activas', value: '2', icon: '🟢', sub: 'Superadmin + Admin Guaton' },
                { label: 'Intentos fallidos hoy', value: '1', icon: '⚠️', sub: 'Bloqueada 60s automaticamente' },
                { label: 'Ultimo acceso superadmin', value: 'Hace 5min', icon: '🔐', sub: currentUser?.email || '' },
              ].map(k => (
                <div key={k.label} className="rounded-2xl bg-white border border-stone-200/80 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{k.icon}</span>
                    <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">{k.label}</p>
                  </div>
                  <p className="text-2xl font-black text-stone-900">{k.value}</p>
                  <p className="mt-1 text-[10px] text-stone-500 font-medium">{k.sub}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-white border border-stone-200/80 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <h2 className="text-sm font-black text-stone-900">Log de Auditoria</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {DEMO_AUDIT.map(entry => (
                  <div key={entry.id} className="flex items-start gap-4 px-6 py-4 hover:bg-stone-50/60 transition">
                    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${entry.level === 'success' ? 'bg-emerald-500' : entry.level === 'warn' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-800 truncate">{entry.action}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5 truncate">{entry.user}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold text-stone-400">{saFormatRelative(entry.ts)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal org ── */}
      <AnimatePresence>
        {showOrgModal && (
          <motion.div key="samodal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)' }}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                <h3 className="text-base font-black text-stone-900">{editingOrg ? 'Editar Restaurante' : 'Nuevo Restaurante'}</h3>
                <button onClick={() => setShowOrgModal(false)} className="text-stone-400 hover:text-stone-600"><X size={18} /></button>
              </div>
              <form onSubmit={handleSaveOrg} className="px-6 py-5 space-y-4">
                {orgError && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600">{orgError}</div>}
                {[
                  { label: 'Nombre comercial *', key: 'name', placeholder: 'Restaurante La Parilla' },
                  { label: 'Slug (URL) *', key: 'slug', placeholder: 'la-parilla' },
                  { label: 'RUT empresa', key: 'rut', placeholder: '76.123.456-7' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-stone-400">{f.label}</label>
                    <input type="text" value={orgForm[f.key]} placeholder={f.placeholder}
                      onChange={e => setOrgForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="h-10 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm font-semibold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-stone-400">MRR (CLP)</label>
                    <input type="number" value={orgForm.mrr} onChange={e => setOrgForm(p => ({ ...p, mrr: e.target.value }))}
                      className="h-10 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm font-semibold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-stone-400">Plan</label>
                    <select value={orgForm.plan} onChange={e => setOrgForm(p => ({ ...p, plan: e.target.value }))}
                      className="h-10 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm font-semibold outline-none focus:border-brand-500">
                      <option>Basico</option><option>Empresa</option><option>Venta Unica</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowOrgModal(false)}
                    className="flex-1 h-10 rounded-xl border border-stone-200 text-sm font-bold text-stone-600 hover:bg-stone-50">Cancelar</button>
                  <button type="submit" disabled={orgSaving}
                    className="flex-1 h-10 rounded-xl text-sm font-black text-white shadow disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#c2553d,#9a3f2c)' }}>
                    {orgSaving ? 'Guardando...' : editingOrg ? 'Guardar' : 'Crear'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function CajeroLayout() {
  const { state, currentUser, logout } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()

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
                : 'bg-brand-50 text-brand-700'
          }`}>
            <span className={`h-2 w-2 rounded-full ${
              isMine ? 'bg-emerald-500 animate-pulse' : isOccupied ? 'bg-rose-500 animate-pulse' : 'bg-brand-500'
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
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-brand-50 p-2.5">
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
  <script>window.onload=function(){window.print();}</script>
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
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600">KDS</p>
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
                className={`grid gap-4 rounded-xl border bg-white p-4 shadow-soft xl:grid-cols-[210px_minmax(260px,1fr)_minmax(220px,0.8fr)_260px] xl:items-center transition-all duration-700 ${getKitchenBorderClass(order.status)} ${fadingOrders.has(order.id) ? 'scale-95 opacity-40 bg-brand-50 border-brand-400' : ''}`}
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
                      className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 font-black text-brand-700"
                      onClick={() => handleMarkReady(order.id)}
                    >
                      Listo
                    </button>
                  ) : null}
                  {fadingOrders.has(order.id) ? (
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 font-black text-white">
                      <CheckCircle2 size={18} />
                      Moviendo a pedidos de hoy...
                    </div>
                  ) : null}
                </div>
              </motion.article>
            ))
          ) : (
            <div className="rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 p-10 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-brand-400" />
              <strong className="mt-4 block text-xl text-brand-900">¡Todo al día!</strong>
              <p className="mt-1 text-brand-600">No hay pedidos pendientes en cocina.</p>
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
  const { state, currentUser, logout } = useAppStore()
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
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600">
            Panel administrador
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-stone-950 sm:text-4xl">
            Control del restaurante
          </h1>
          <p className="mt-2 max-w-2xl text-stone-500">
            Ventas, cocina, pedidos y catalogo en una vista de operacion diaria.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-sm font-bold text-brand-700">
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
                  <span className="text-sm font-black text-brand-600">
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
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-600">
                Editor
              </p>
              <h2 className="text-xl font-black">
                {form.id ? 'Editar producto' : 'Nuevo producto'}
              </h2>
            </div>
            <Package className="text-brand-600" size={24} />
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
                className="w-full rounded-lg border border-stone-200 bg-stone-50 py-3 pl-10 pr-3 outline-none focus:border-brand-500"
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
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-700">
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
            <BadgePercent className="text-brand-600" size={26} />
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
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-black text-brand-700">
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
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-600">Nueva</p>
              <h2 className="text-xl font-black text-stone-950">Crear reserva</h2>
            </div>
            <CalendarDays className="text-brand-600" size={24} />
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
  const { state, sessions, addStaffUser, removeStaffUser, toggleStaffUser, getUserSessions } = useAppStore()
  usePageTitle(`Usuarios | ${state.restaurant.name}`)
  const [form, setForm] = useState({ name: '', role: 'garzon' })
  const [filterRole, setFilterRole] = useState('todos')
  const [activeTab, setActiveTab] = useState('equipo')
  const [expandedUser, setExpandedUser] = useState(null)
  const [expandedSession, setExpandedSession] = useState(null)
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

  const formatSessionTime = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const getSessionDuration = (loginAt, logoutAt) => {
    if (!loginAt) return '—'
    const start = new Date(loginAt).getTime()
    const end = logoutAt ? new Date(logoutAt).getTime() : Date.now()
    const diff = end - start
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
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

      {/* Tab navigation */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('equipo')}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition ${
            activeTab === 'equipo'
              ? 'bg-stone-950 text-white shadow-lg shadow-stone-300'
              : 'border border-stone-200 bg-white text-stone-600 shadow-sm'
          }`}
        >
          <Users size={18} />
          Equipo
          <span className="rounded-full bg-stone-500/20 px-2.5 py-0.5 text-xs">{staffUsers.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('actividad')}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition ${
            activeTab === 'actividad'
              ? 'bg-stone-950 text-white shadow-lg shadow-stone-300'
              : 'border border-stone-200 bg-white text-stone-600 shadow-sm'
          }`}
        >
          <Activity size={18} />
          Actividad
          {sessions.length ? (
            <span className="rounded-full bg-stone-500/20 px-2.5 py-0.5 text-xs">{sessions.length}</span>
          ) : null}
        </button>
      </div>

      {activeTab === 'equipo' ? (
      <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        {/* Create user form */}
        <form className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft" onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-600">Nuevo</p>
              <h2 className="text-xl font-black text-stone-950">Crear usuario</h2>
            </div>
            <UserPlus className="text-brand-600" size={24} />
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
      ) : (
      /* Actividad tab */
      <section className="grid gap-5">
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">Registro</p>
              <h2 className="text-xl font-black text-stone-950">Historial de sesiones</h2>
              <p className="mt-1 text-sm text-stone-500">Cada inicio y cierre de sesión queda registrado con las mesas atendidas y pedidos creados.</p>
            </div>
            <History className="text-blue-600" size={24} />
          </div>

          {/* Per-user activity */}
          <div className="grid gap-4">
            {staffUsers.filter((u) => u.role === 'garzon' || getUserSessions(u.id).length > 0).length ? (
              staffUsers
                .filter((u) => u.role === 'garzon' || getUserSessions(u.id).length > 0)
                .map((user) => {
                  const cfg = roleConfig[user.role] || roleConfig.garzon
                  const Icon = cfg.icon
                  const userSessions = getUserSessions(user.id)
                  const isExpanded = expandedUser === user.id
                  const activeSess = userSessions.find((s) => !s.logoutAt)
                  const allUserOrders = state.orders.filter((o) => o.waiterId === user.id)
                  const allTables = [...new Set(allUserOrders.map((o) => o.tableLabel))]
                  const totalSales = allUserOrders.reduce((sum, o) => sum + o.total, 0)

                  return (
                    <article key={user.id} className="rounded-xl border border-stone-200 bg-stone-50 overflow-hidden">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-stone-100"
                        onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                      >
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
                              {activeSess ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-black text-emerald-700">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                  En línea
                                </span>
                              ) : (
                                <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-bold text-stone-500">
                                  Desconectado
                                </span>
                              )}
                              <span className="text-xs text-stone-400">{userSessions.length} sesiones</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="hidden text-right sm:block">
                            <p className="text-xs text-stone-400">{allTables.length} mesas · {allUserOrders.length} pedidos</p>
                            <p className="text-sm font-black text-stone-700">{currency.format(totalSales)}</p>
                          </div>
                          <ChevronDown size={18} className={`text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {isExpanded ? (
                        <div className="border-t border-stone-200 bg-white p-4">
                          {/* Summary stats */}
                          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <div className="rounded-lg bg-stone-50 p-3 text-center">
                              <p className="text-[0.6rem] font-black uppercase text-stone-400">Total sesiones</p>
                              <strong className="text-lg text-stone-950">{userSessions.length}</strong>
                            </div>
                            <div className="rounded-lg bg-stone-50 p-3 text-center">
                              <p className="text-[0.6rem] font-black uppercase text-stone-400">Pedidos total</p>
                              <strong className="text-lg text-stone-950">{allUserOrders.length}</strong>
                            </div>
                            <div className="rounded-lg bg-stone-50 p-3 text-center">
                              <p className="text-[0.6rem] font-black uppercase text-stone-400">Mesas atendidas</p>
                              <strong className="text-lg text-stone-950">{allTables.length}</strong>
                            </div>
                            <div className="rounded-lg bg-stone-50 p-3 text-center">
                              <p className="text-[0.6rem] font-black uppercase text-stone-400">Ventas total</p>
                              <strong className="text-lg text-stone-950">{currency.format(totalSales)}</strong>
                            </div>
                          </div>

                          {/* Session list */}
                          <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-stone-400">Sesiones recientes</p>
                          <div className="grid gap-2">
                            {userSessions.length ? userSessions.slice(0, 20).map((sess) => (
                              <div key={sess.id} className="rounded-lg border border-stone-200 bg-stone-50 overflow-hidden">
                                <button
                                  type="button"
                                  className="flex w-full items-center justify-between gap-3 p-3 text-left transition hover:bg-stone-100"
                                  onClick={() => setExpandedSession(expandedSession === sess.id ? null : sess.id)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${sess.logoutAt ? 'bg-stone-200 text-stone-500' : 'bg-emerald-100 text-emerald-700'}`}>
                                      {sess.logoutAt ? <LogOut size={16} /> : <LogIn size={16} />}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-stone-700">
                                          {formatSessionTime(sess.loginAt)}
                                        </span>
                                        <span className="text-xs text-stone-400">→</span>
                                        <span className="text-sm font-bold text-stone-700">
                                          {sess.logoutAt ? formatSessionTime(sess.logoutAt) : 'En curso'}
                                        </span>
                                      </div>
                                      <div className="mt-0.5 flex items-center gap-2 text-xs text-stone-400">
                                        <span className="inline-flex items-center gap-1"><Timer size={12} /> {getSessionDuration(sess.loginAt, sess.logoutAt)}</span>
                                        {sess.tablesServed?.length ? (
                                          <span>· {sess.tablesServed.length} mesas</span>
                                        ) : null}
                                        {sess.ordersCreated?.length ? (
                                          <span>· {sess.ordersCreated.length} pedidos</span>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronDown size={14} className={`text-stone-400 transition-transform ${expandedSession === sess.id ? 'rotate-180' : ''}`} />
                                </button>

                                {expandedSession === sess.id ? (
                                  <div className="border-t border-stone-200 bg-white p-3">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                      <div>
                                        <p className="mb-1 text-[0.6rem] font-black uppercase text-stone-400">Mesas atendidas</p>
                                        {sess.tablesServed?.length ? (
                                          <div className="flex flex-wrap gap-1">
                                            {sess.tablesServed.map((t) => (
                                              <span key={t} className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-black text-emerald-700">{t}</span>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="text-xs text-stone-400">Sin mesas registradas</p>
                                        )}
                                      </div>
                                      <div>
                                        <p className="mb-1 text-[0.6rem] font-black uppercase text-stone-400">Pedidos creados</p>
                                        {sess.ordersCreated?.length ? (
                                          <div className="grid gap-1">
                                            {sess.ordersCreated.map((o) => (
                                              <div key={o.id} className="flex items-center justify-between rounded-lg bg-stone-50 px-2 py-1 text-xs">
                                                <span className="font-bold text-stone-700">#{o.number} · {o.tableLabel}</span>
                                                <span className="font-black text-stone-950">{currency.format(o.total)}</span>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="text-xs text-stone-400">Sin pedidos en esta sesión</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            )) : (
                              <p className="text-sm text-stone-400">Este usuario aún no tiene sesiones registradas. Se registrarán al iniciar sesión.</p>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </article>
                  )
                })
            ) : (
              <EmptyAdminState text="No hay actividad de sesiones registrada. Los garzones y staff generarán registros al iniciar y cerrar sesión." />
            )}
          </div>
        </div>
      </section>
      )}
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
            <MetricLine label="Tendencia" value={<span className="inline-flex items-center gap-1 text-brand-600"><TrendingUp size={16} /> Operativa</span>} />
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
              placeholder="+56 9 XXXX XXXX"
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
            {import.meta.env.VITE_SUPABASE_URL || 'No configurada'}
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
              : 'bg-brand-50 text-brand-700'
          }`}>
            <span className={`h-2 w-2 rounded-full ${isOccupied ? 'bg-rose-500 animate-pulse' : 'bg-brand-500'}`} />
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

      {/* Waiter badge - prominent */}
      {tableWaiter ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-brand-50 p-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-500 text-white shadow-md shadow-emerald-200">
            <User size={20} />
          </div>
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-emerald-600">
              Mesero atendiendo
            </p>
            <p className="text-base font-black text-stone-950">{tableWaiter}</p>
          </div>
        </div>
      ) : isOccupied ? (
        <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-stone-300 text-white">
            <User size={20} />
          </div>
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-stone-400">
              Mesero
            </p>
            <p className="text-sm font-bold text-stone-500">Sin asignar (pedido del cliente)</p>
          </div>
        </div>
      ) : null}

      {isOccupied && elapsed ? (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-brand-50 p-3">
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
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600">
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
    emerald: 'bg-brand-50 text-brand-700',
    blue: 'bg-amber-50 text-amber-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-brand-50 text-brand-700',
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
            product.available ? 'bg-brand-50 text-brand-700' : 'bg-rose-50 text-rose-700'
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
              product.available ? 'bg-brand-50 text-brand-700' : 'bg-rose-50 text-rose-700'
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

export default App
