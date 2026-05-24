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
      <path d="M30,65 L45,50 L60,58 L75,38" className="stroke-teal-200" strokeWidth="3" />
      <circle cx="75" cy="38" r="3" fill="currentColor" />
      <polyline points="68,38 75,38 75,45" className="stroke-teal-200" strokeWidth="3" />
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
      <main className="grid min-h-screen place-items-center bg-slate-50 p-4">
        <section className="w-full max-w-xl rounded-[2rem] border border-rose-200 bg-white p-6 text-center shadow-soft">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-sans text-2xl font-black text-slate-950">
            El superadmin tuvo un problema temporal
          </h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            La pantalla no quedará en blanco. Revisa el registro creado o recarga para volver al panel.
          </p>
          <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-xs font-bold text-rose-700">
            {this.state.message}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
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
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* LEFT PANEL: Branding (Teal Gradient / Nexo style) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-teal-800 p-12 text-white lg:flex overflow-hidden">
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
        <div className="absolute -right-32 -bottom-32 h-[450px] w-[450px] rounded-full bg-teal-600/30 blur-[100px]" />
        
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
            <NexoLogo className="h-28 w-28 text-teal-200 drop-shadow-xl animate-pulse" />
          </motion.div>

          <h2 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
            Empresa de Jefe
          </h2>
          <p className="mt-3 text-lg font-medium text-teal-100 opacity-90">
            Sistema Inteligente de Gestión
          </p>

          <div className="mt-8 flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-900/30 px-4 py-1.5 text-sm font-bold text-teal-200">
            <CheckCircle2 size={16} className="text-teal-300" />
            <span>Empresa verificada ✓</span>
          </div>
        </div>

        {/* Footer legal */}
        <div className="z-10 flex justify-between text-xs text-teal-200/60">
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
          <div className="flex items-center gap-2 text-teal-700">
            <NexoLogo className="h-10 w-10 text-teal-600" />
            <span className="font-extrabold text-lg">Empresa de Jefe</span>
          </div>
          <span className="text-xs bg-teal-50 border border-teal-200 px-2 py-0.5 rounded text-teal-700 font-bold">✓ Verificado</span>
        </div>

        <div className="my-auto mx-auto w-full max-w-md">
          {/* Lock/Security Icon Badge */}
          <div className="mb-6 flex justify-center lg:justify-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 border border-teal-100">
              <Lock size={20} />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-black text-slate-800">
              {loginMode === 'email' ? 'Administración' : 'Personal de Local'}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 font-semibold">
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="ejemplo@empresa.com"
                    className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Contraseña
                  </label>
                  <button type="button" className="text-xs font-bold text-teal-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-11 pr-12 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-sm font-bold text-white shadow-md shadow-teal-700/10 transition"
              >
                <span>Iniciar Sesión</span>
              </motion.button>
            </form>
          ) : (
            /* PIN Staff Login Form */
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Sucursal / Restaurante
                </label>
                {activeOrg ? (
                  <div className="flex h-12 w-full items-center justify-between rounded-lg border border-teal-200 bg-teal-50/50 px-4 text-sm font-semibold text-teal-800">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-teal-600" />
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
                      className="text-xs font-bold text-teal-600 hover:text-teal-800 hover:underline transition"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                        className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 placeholder:text-slate-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyOrg}
                      className="h-10 w-full rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      PIN de acceso (4 dígitos)
                    </label>
                    <motion.div animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}} transition={{ duration: 0.4 }}>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          ref={inputRef}
                          type="password"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={4}
                          value={pin}
                          onChange={(e) => handlePinChange(e.target.value)}
                          placeholder="••••"
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-11 text-center text-xl font-bold tracking-[0.5em] text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 placeholder:tracking-[0.2em] placeholder:text-slate-300"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-center gap-3 py-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-2.5 w-2.5 rounded-full border transition-all ${
                          pin.length > i ? 'bg-teal-600 border-teal-600 scale-110' : 'border-slate-300 bg-slate-100'
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
                className="text-xs font-extrabold text-teal-600 hover:text-teal-700 hover:underline transition"
              >
                Registrar nueva empresa
              </button>
            )}
          </div>
        </div>

        {/* Footer brand info */}
        <div className="mt-12 text-center text-xs text-slate-400 font-medium">
          Desarrollado por <span className="font-extrabold text-teal-600">AcroDevs</span> · Todos los derechos reservados
        </div>
      </div>

      {/* REGISTER RESTAURANT MODAL */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-100"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowRegisterModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>

              <div className="mb-4">
                <h3 className="text-lg font-black text-slate-800">Registrar Nueva Empresa</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Nombre del Restaurante / Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={regCompanyName}
                    onChange={(e) => setRegCompanyName(e.target.value)}
                    placeholder="Ej. Restaurante Guaton XII"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Nombre del Administrador
                  </label>
                  <input
                    type="text"
                    required
                    value={regAdminName}
                    onChange={(e) => setRegAdminName(e.target.value)}
                    placeholder="Ej. Diego Henríquez"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Correo electrónico del Administrador
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Contraseña del Administrador
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="h-10 rounded-lg px-4 text-sm font-bold text-slate-500 hover:bg-slate-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={regLoading || regSuccess}
                    className="h-10 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-5 text-sm font-bold shadow transition flex items-center justify-center"
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

function RestaurantSuperadmin() {
  const {
    state,
    organizations,
    saveOrganization,
    removeOrganization,
    impersonateTenant,
    logout,
    currentOrganizationId,
    remoteError,
    isHydrating,
  } = useAppStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('resumen')
  const [searchQuery, setSearchQuery] = useState('')
  const [showOrgModal, setShowOrgModal] = useState(false)
  const [editingOrg, setEditingOrg] = useState(null)
  const [form, setForm] = useState(createSuperadminOrgForm())
  const [superadminError, setSuperadminError] = useState('')

  usePageTitle('Superadmin Restaurante | AcroDevs')

  const selectedOrg = organizations.find((org) => org.id === currentOrganizationId) ?? null
  const isAllRestaurants = !selectedOrg
  const activeOrgs = organizations.filter((org) => normalizeAccountStatus(org.status) === 'Activo')
  const inactiveOrgs = organizations.filter((org) => normalizeAccountStatus(org.status) !== 'Activo')
  const totalMrr = organizations.reduce((sum, org) => sum + Number(org.mrr || 0), 0)
  const averageMrr = organizations.length ? Math.round(totalMrr / organizations.length) : 0
  const totalOrders = state.orders?.length ?? 0
  const activeOrders = (state.orders ?? []).filter((order) =>
    ['Pendiente', 'En preparación', 'En preparaciÃ³n', 'Listo'].includes(order.status),
  )
  const pendingOrders = (state.orders ?? []).filter((order) => order.status === 'Pendiente')
  const readyOrders = (state.orders ?? []).filter((order) => order.status === 'Listo')
  const dailySales = (state.orders ?? [])
    .filter((order) => new Date(order.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, order) => sum + Number(order.total || 0), 0)
  const chartData = buildSalesChartData(state.orders ?? [])
  const topProducts = getTopProducts(state.orders ?? []).slice(0, 5)
  const currentHealth = calculateRestaurantHealth(selectedOrg, state)
  const filteredOrgs = organizations.filter((org) =>
    `${org.name} ${org.slug} ${org.rut || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  )
  const supportItems = buildSuperadminSupportItems({
    remoteError,
    inactiveOrgs,
    selectedOrg,
    state,
    activeOrders,
  })
  const onboardingItems = buildRestaurantOnboarding(selectedOrg, state)
  const onboardingDone = onboardingItems.filter((item) => item.done).length
  const onboardingPercent = onboardingItems.length
    ? Math.round((onboardingDone / onboardingItems.length) * 100)
    : 0
  const planRows = buildPlanRows(organizations)
  const restaurantSnapshot = buildRestaurantSnapshot(selectedOrg, state, {
    activeOrders: activeOrders.length,
    pendingOrders: pendingOrders.length,
    readyOrders: readyOrders.length,
    dailySales,
    currentHealth,
  })
  const todayOrders = (state.orders ?? []).filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString())
  const openTicketsCount = 3
  const platformHealthScore = calculatePlatformHealth(organizations)
  const monthlyRevenueData = buildMonthlyRevenueData(totalMrr)
  const planPieData = buildPlanPieData(organizations)
  const enhancedAlerts = buildEnhancedAlerts({ remoteError, inactiveOrgs, selectedOrg, state, activeOrders, organizations })
  const topPerformers = buildTopPerformers(organizations)

  const openCreateModal = () => {
    setSuperadminError('')
    setEditingOrg(null)
    setForm(createSuperadminOrgForm())
    setShowOrgModal(true)
  }

  const openEditModal = (org) => {
    setSuperadminError('')
    setEditingOrg(org)
    setForm(createSuperadminOrgForm(org))
    setShowOrgModal(true)
  }

  const closeOrgModal = () => {
    setShowOrgModal(false)
    setEditingOrg(null)
  }

  const handleSaveOrg = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.slug.trim()) return
    setSuperadminError('')

    try {
      const savedOrg = await saveOrganization({
        id: editingOrg?.id,
        name: form.name.trim(),
        slug: form.slug.trim(),
        plan: normalizePlanForStorage(form.plan),
        status: normalizeAccountStatus(form.status),
        rut: form.rut.trim(),
        mrr: Number(form.mrr || 0),
      })
      closeOrgModal()
      if (!editingOrg && savedOrg?.id) {
        handleSelectTenant(savedOrg.id)
      }
    } catch (error) {
      setSuperadminError(error.message || 'No se pudo guardar el restaurante.')
    }
  }

  const handleDeleteOrg = async (org) => {
    const confirmed = window.confirm(
      `¿Eliminar ${org.name}? Esta acción quita el local del portal superadmin.`,
    )
    if (!confirmed) return
    await removeOrganization(org.id)
  }

  const handleSupportAccess = (org) => {
    impersonateTenant(org.id)
    navigate('/admin')
  }

  const handleSelectTenant = (orgId) => {
    impersonateTenant(orgId)
    setActiveTab('resumen')
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const tabs = [
    ['resumen', 'Dashboard', LayoutDashboard],
    ['restaurantes', 'Restaurantes', Building],
    ['planes', 'Planes', CreditCard],
    ['finanzas', 'Finanzas', DollarSign],
    ['pagos', 'Pagos / MP', Coins],
    ['soporte', 'Soporte', MessageSquare],
    ['modulos', 'Módulos', Sparkles],
    ['monitoreo', 'Monitoreo', Activity],
    ['seguridad', 'Seguridad', Shield],
  ]

  return (
    <main className="mx-0 min-h-screen w-full max-w-none bg-[#f5f7fb] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-xl font-black text-white shadow-lg shadow-emerald-950/20">
              A
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-sans text-xl font-black tracking-tight text-slate-950">
                  AcroDevs Restaurant OS
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  En vivo
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold capitalize text-slate-500">
                {new Date().toLocaleDateString('es-CL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
                · Plataforma de restaurantes
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 sm:w-72">
              <Building className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={currentOrganizationId}
                onChange={(event) => handleSelectTenant(event.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-black text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">Todos los restaurantes</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {decodeUiText(org.name)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Nuevo restaurante
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-black text-rose-700 transition hover:bg-rose-100"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:px-8 [scrollbar-width:none]">
          {tabs.map(([id, label, Icon]) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl px-4 text-sm font-black transition ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-100'
                    : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-950'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            )
          })}
        </nav>
      </header>

      <section className="grid w-full gap-6 px-4 py-6 lg:px-8 2xl:px-10">
        {remoteError ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
            Supabase necesita atención: {remoteError}
          </div>
        ) : null}
        {superadminError ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
            {superadminError}
          </div>
        ) : null}
        {isHydrating ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-500 shadow-soft">
            Sincronizando información del restaurante seleccionado...
          </div>
        ) : null}

        {activeTab === 'resumen' ? (
          <div className="grid gap-6">

            {/* ── KPIs principales ── */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DashKpiCard
                label="MRR Plataforma"
                value={currency.format(totalMrr)}
                sub={`Promedio ${currency.format(averageMrr)}/local`}
                icon={TrendingUp}
                color="from-emerald-500 to-teal-600"
                badge="+12% est. vs mes anterior"
                badgeTone="up"
              />
              <DashKpiCard
                label="Restaurantes activos"
                value={activeOrgs.length}
                sub={`${inactiveOrgs.length} suspendidos · ${organizations.length} totales`}
                icon={Building}
                color="from-teal-500 to-cyan-600"
                badge={`${organizations.length} registrados`}
                badgeTone="neutral"
              />
              <DashKpiCard
                label="Pedidos hoy"
                value={todayOrders.length}
                sub={`${currency.format(dailySales)} en ventas del día`}
                icon={ShoppingBag}
                color="from-amber-500 to-orange-500"
                badge={`${activeOrders.length} activos ahora`}
                badgeTone="up"
              />
              <DashKpiCard
                label="Tickets soporte"
                value={openTicketsCount}
                sub="Pendientes de resolución"
                icon={MessageSquare}
                color="from-rose-500 to-pink-600"
                badge={openTicketsCount > 0 ? 'Requieren atención' : 'Todo resuelto'}
                badgeTone={openTicketsCount > 0 ? 'warn' : 'up'}
              />
            </section>

            {/* ── KPIs secundarios ── */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SuperMetricCard label="Salud plataforma" value={`${platformHealthScore}%`} detail="Índice operativo global" icon={Activity} tone="emerald" />
              <SuperMetricCard label="Módulos activos" value="5 / 6" detail="QR · KDS · POS · Garzón · Reservas" icon={Sparkles} tone="teal" />
              <SuperMetricCard label="Mesas en plataforma" value={String(organizations.length * 8 + (state.tables?.length ?? 0))} detail="Estimado total de la red" icon={Hash} tone="amber" />
              <SuperMetricCard label="Locales por revisar" value={String(inactiveOrgs.length + enhancedAlerts.filter((a) => a.level === 'high').length)} detail="Con alertas o inactivos" icon={Flame} tone="rose" />
            </section>

            {/* ── Gráficas principales ── */}
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_380px]">
              <SuperPanel title="Ingresos mensuales estimados" subtitle="MRR acumulado de la plataforma — últimos 6 meses">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenueData}>
                      <defs>
                        <linearGradient id="dashMrrGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="dashIngGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0891b2" stopOpacity={0.18} />
                          <stop offset="95%" stopColor="#0891b2" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="mes" stroke="#64748b" fontSize={12} fontWeight={700} tick={{ fill: '#64748b' }} />
                      <YAxis stroke="#64748b" fontSize={11} fontWeight={700} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: '#64748b' }} />
                      <Tooltip
                        formatter={(v, n) => [currency.format(v), n]}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}
                      />
                      <Area type="monotone" dataKey="mrr" stroke="#059669" strokeWidth={3} fill="url(#dashMrrGrad)" name="MRR" />
                      <Area type="monotone" dataKey="ingresos" stroke="#0891b2" strokeWidth={2} fill="url(#dashIngGrad)" strokeDasharray="6 3" name="Ingresos" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />MRR acumulado</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />Ingresos estimados</span>
                </div>
              </SuperPanel>

              <SuperPanel title="Distribución de planes" subtitle="Restaurantes por plan contratado">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={planPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value" strokeWidth={0}>
                        {planPieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v, n) => [`${v} restaurante${v !== 1 ? 's' : ''}`, n]}
                        contentStyle={{ borderRadius: '10px', fontSize: 12, fontWeight: 700 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid gap-2">
                  {planPieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
                        <span className="text-sm font-black text-slate-800">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-black text-slate-950">{item.value}</strong>
                        <span className="text-xs font-bold text-slate-400">
                          {organizations.length ? `${Math.round((item.value / organizations.length) * 100)}%` : '0%'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </SuperPanel>
            </section>

            {/* ── Alertas + Locales por revisar ── */}
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
              <SuperPanel
                title="Alertas de plataforma"
                subtitle={`${enhancedAlerts.filter((a) => a.level === 'high').length} críticas · ${enhancedAlerts.length} totales detectadas`}
              >
                <div className="grid gap-3 max-h-80 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
                  {enhancedAlerts.map((alert, i) => (
                    <EnhancedAlertRow key={i} alert={alert} />
                  ))}
                </div>
              </SuperPanel>

              <SuperPanel title="Locales por revisar" subtitle="Suspendidos, sin configurar o con incidencias">
                <div className="grid gap-3 max-h-80 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
                  {inactiveOrgs.length === 0 && !(!state.restaurant?.whatsapp && selectedOrg) ? (
                    <SuperEmptyState text="✅ Todos los locales operando correctamente." />
                  ) : (
                    <>
                      {inactiveOrgs.map((org) => (
                        <ReviewOrgRow
                          key={org.id}
                          org={org}
                          reason="Cuenta suspendida o inactiva"
                          severity="high"
                          onSelect={() => handleSelectTenant(org.id)}
                          onSupport={() => handleSupportAccess(org)}
                        />
                      ))}
                      {selectedOrg && !state.restaurant?.whatsapp && (
                        <ReviewOrgRow
                          org={selectedOrg}
                          reason="WhatsApp no configurado"
                          severity="medium"
                          onSelect={() => handleSelectTenant(selectedOrg.id)}
                          onSupport={() => handleSupportAccess(selectedOrg)}
                        />
                      )}
                    </>
                  )}
                </div>
              </SuperPanel>
            </section>

            {/* ── Actividad reciente + Top locales ── */}
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
              <SuperPanel title="Actividad reciente" subtitle="Últimos pedidos procesados en la plataforma">
                <div className="grid gap-3">
                  {(state.orders ?? []).length === 0 ? (
                    <SuperEmptyState text="No hay pedidos registrados aún." />
                  ) : (
                    (state.orders ?? []).slice(0, 7).map((order) => (
                      <div key={order.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition hover:bg-slate-100">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-[0.65rem] font-black text-white">
                            #{order.number}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-950">{order.tableLabel}</p>
                            <p className="truncate text-xs font-semibold text-slate-400">
                              {(order.items ?? []).slice(0, 2).map((item) => item.name).join(', ')}
                              {(order.items ?? []).length > 2 ? ` +${(order.items ?? []).length - 2}` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <OrderStatusPill status={order.status} />
                          <strong className="text-sm font-black text-slate-950">{currency.format(order.total)}</strong>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </SuperPanel>

              <SuperPanel title="Top restaurantes" subtitle="Mayor MRR en la plataforma">
                <div className="grid gap-3">
                  {topPerformers.length === 0 ? (
                    <SuperEmptyState text="Agrega restaurantes para ver el ranking." />
                  ) : (
                    topPerformers.map((org, i) => (
                      <div key={org.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 transition hover:bg-slate-100 cursor-pointer" onClick={() => handleSelectTenant(org.id)}>
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-slate-950">{decodeUiText(org.name)}</p>
                          <p className="text-xs font-bold text-slate-500">{currency.format(org.mrr || 0)}/mes · <span className="text-slate-400">{normalizePlanLabel(org.plan)}</span></p>
                        </div>
                        <HealthRing value={calculateRestaurantHealth(org)} small />
                      </div>
                    ))
                  )}
                </div>
              </SuperPanel>
            </section>

            {/* ── Estado de módulos ── */}
            <SuperPanel title="Estado de módulos" subtitle="Servicios habilitados en el sistema de plataforma">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  { label: 'Menú QR', ok: true, detail: `${state.tables?.length ?? 0} mesas · ${(state.products ?? []).filter((p) => p.available).length} productos activos`, icon: QrCode },
                  { label: 'Cocina / KDS', ok: true, detail: `${pendingOrders.length} pedidos pendientes · ${readyOrders.length} listos`, icon: ChefHat },
                  { label: 'POS / Caja', ok: true, detail: 'Sistema de cobros y facturación activo', icon: CreditCard },
                  { label: 'Garzón móvil', ok: true, detail: `${(state.staffUsers ?? []).filter((u) => u.role === 'garzon').length} garzones registrados`, icon: Users },
                  { label: 'Reservas', ok: Boolean(state.reservations?.length), detail: `${state.reservations?.length ?? 0} reservas en sistema`, icon: CalendarDays },
                  { label: 'Delivery', ok: false, detail: 'Módulo no activado — próximamente', icon: Package },
                ].map((mod) => (
                  <div
                    key={mod.label}
                    className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
                      mod.ok ? 'border-emerald-100 bg-emerald-50/40' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${ mod.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400' }`}>
                      <mod.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-slate-950">{mod.label}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-black ${ mod.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500' }`}>
                          {mod.ok ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">{mod.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SuperPanel>

          </div>
        ) : null}


        {activeTab === 'restaurantes' ? (
          <div className="grid gap-5">
            <SuperSectionHeader
              eyebrow="Locales"
              title="Restaurantes de la plataforma"
              description="Gestiona cuentas, planes, estado comercial y acceso de soporte a cada local."
              action={
                <button type="button" onClick={openCreateModal} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
                  Nuevo restaurante
                </button>
              }
            />
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar restaurante, slug o RUT..."
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-black outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredOrgs.map((org) => (
                <RestaurantTenantCard
                  key={org.id}
                  org={org}
                  active={org.id === currentOrganizationId}
                  health={org.id === selectedOrg?.id ? currentHealth : calculateRestaurantHealth(org)}
                  onSelect={() => handleSelectTenant(org.id)}
                  onSupport={() => handleSupportAccess(org)}
                  onEdit={() => openEditModal(org)}
                  onDelete={() => handleDeleteOrg(org)}
                />
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'operacion' ? (
          <div className="grid gap-5">
            <SuperSectionHeader
              eyebrow="Operación"
              title={selectedOrg ? `Control de ${decodeUiText(selectedOrg.name)}` : 'Control de operación'}
              description="Vista rápida del local seleccionado: pedidos, cocina, menú, mesas QR y equipo."
            />
            {isAllRestaurants ? (
              <SuperPanel title="Selecciona un restaurante" subtitle="Para ver pedidos, menú, mesas QR, usuarios y configuración completa">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {organizations.map((org) => (
                    <RestaurantCompactRow
                      key={org.id}
                      org={org}
                      onSelect={() => handleSelectTenant(org.id)}
                      onSupport={() => handleSupportAccess(org)}
                    />
                  ))}
                </div>
              </SuperPanel>
            ) : null}
            <section className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-5 ${isAllRestaurants ? 'hidden' : ''}`}>
              <SuperMetricCard label="Pedidos activos" value={activeOrders.length} detail="Pendiente, preparación o listo" icon={ClipboardList} tone="emerald" />
              <SuperMetricCard label="Pendientes" value={pendingOrders.length} detail="Requieren cocina" icon={Clock3} tone="amber" />
              <SuperMetricCard label="Mesas QR" value={state.tables?.length ?? 0} detail="Mesas configuradas" icon={QrCode} tone="teal" />
              <SuperMetricCard label="Productos" value={(state.products ?? []).filter((p) => p.available).length} detail="Activos en menú" icon={Package} tone="slate" />
              <SuperMetricCard label="Usuarios" value={state.staffUsers?.length ?? 0} detail="Admin, cocina, caja y garzones" icon={Users} tone="rose" />
            </section>
            <section className={`grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px] ${isAllRestaurants ? 'hidden' : ''}`}>
              <SuperPanel title="Pedidos en vivo" subtitle="Últimos movimientos del restaurante">
                <div className="grid gap-3">
                  {(state.orders ?? []).slice(0, 8).length ? (state.orders ?? []).slice(0, 8).map((order) => (
                    <div key={order.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <p className="text-sm font-black text-slate-950">#{order.number} · {order.tableLabel}</p>
                        <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-500">
                          {order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <OrderStatusPill status={order.status} />
                        <strong className="text-sm font-black text-slate-950">{currency.format(order.total)}</strong>
                      </div>
                    </div>
                  )) : <SuperEmptyState text="Este local todavía no tiene pedidos." />}
                </div>
              </SuperPanel>

              <SuperPanel title="Módulos activos" subtitle="Lo necesario para vender a restaurantes">
                <div className="grid gap-3">
                  {buildRestaurantModules(state).map((module) => (
                    <ModuleHealthRow key={module.label} {...module} />
                  ))}
                </div>
              </SuperPanel>
            </section>
          </div>
        ) : null}

        {activeTab === 'planes' ? (
          <div className="grid gap-5">
            <SuperSectionHeader
              eyebrow="Comercial"
              title="Planes para AppRestaurante"
              description="Planes simples para vender: QR básico, operación completa y multi-local."
            />
            <div className="grid gap-4 lg:grid-cols-3">
              {restaurantPlans().map((plan) => (
                <PlanCard key={plan.name} plan={plan} />
              ))}
            </div>
            <SuperPanel title="Cuentas y cobros" subtitle="Resumen comercial de restaurantes">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      <th className="py-3">Restaurante</th>
                      <th>Plan</th>
                      <th>Estado</th>
                      <th>MRR</th>
                      <th>RUT</th>
                      <th className="text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.map((org) => (
                      <tr key={org.id} className="border-b border-slate-100 text-sm font-bold text-slate-700">
                        <td className="py-4">{decodeUiText(org.name)}</td>
                        <td><PlanPill plan={org.plan} /></td>
                        <td><AccountStatusPill status={org.status} /></td>
                        <td>{currency.format(org.mrr || 0)}</td>
                        <td>{org.rut || 'Sin RUT'}</td>
                        <td className="text-right">
                          <button type="button" onClick={() => openEditModal(org)} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">
                            Ajustar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SuperPanel>
          </div>
        ) : null}

        {activeTab === 'soporte' ? (
          <div className="grid gap-5">
            <SuperSectionHeader
              eyebrow="Soporte"
              title="Centro de control y alertas"
              description="Solo lo necesario: salud de Supabase, locales inactivos, configuración pendiente y pedidos trabados."
            />
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
              <SuperPanel title="Alertas de plataforma" subtitle={`${supportItems.length} señales detectadas`}>
                <div className="grid gap-3">
                  {supportItems.map((item) => (
                    <SupportAlert key={item.title} item={item} />
                  ))}
                </div>
              </SuperPanel>
              <SuperPanel title="Puesta en marcha" subtitle={`${onboardingDone}/${onboardingItems.length} tareas completas`}>
                <div className="mb-4 h-3 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${onboardingPercent}%` }} />
                </div>
                <div className="grid gap-3">
                  {onboardingItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                      <span className={`mt-0.5 grid h-7 w-7 place-items-center rounded-full ${item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.done ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                      </span>
                      <div>
                        <p className="text-sm font-black text-slate-800">{item.label}</p>
                        <p className="text-xs font-semibold text-slate-500">{item.help}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SuperPanel>
            </div>
          </div>
        ) : null}


        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB: FINANZAS                                           */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'finanzas' ? (
          <div className="grid gap-6">
            {/* KPIs financieros */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DashKpiCard label="MRR Actual" value={currency.format(totalMrr)} sub={`${activeOrgs.length} restaurantes activos`} icon={TrendingUp} color="from-emerald-500 to-teal-600" badge="Ingreso recurrente" badgeTone="up" />
              <DashKpiCard label="Ingresos del mes" value={currency.format(Math.round(totalMrr * 1.08))} sub="Incluye cobros y activaciones" icon={DollarSign} color="from-cyan-500 to-blue-600" badge="+8% vs mes ant." badgeTone="up" />
              <DashKpiCard label="Morosos" value={inactiveOrgs.length} sub="Con pagos pendientes o deuda" icon={AlertTriangle} color="from-rose-500 to-red-600" badge={inactiveOrgs.length > 0 ? 'Atención requerida' : 'Todo al día'} badgeTone={inactiveOrgs.length > 0 ? 'warn' : 'up'} />
              <DashKpiCard label="Churn este mes" value="1.2%" sub="Tasa de cancelación" icon={TrendingDown} color="from-amber-500 to-orange-500" badge="Bajo riesgo" badgeTone="neutral" />
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_360px]">
              {/* Gráfico ingresos 6 meses */}
              <SuperPanel title="Ingresos mensuales" subtitle="Historial de ingresos y MRR acumulado">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={buildMonthlyRevenueData(totalMrr)} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="mes" stroke="#64748b" fontSize={12} fontWeight={700} />
                      <YAxis stroke="#64748b" fontSize={11} fontWeight={700} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v, n) => [currency.format(v), n]} contentStyle={{ borderRadius: '12px', fontSize: 12, fontWeight: 700 }} />
                      <Bar dataKey="mrr" fill="#059669" radius={[8,8,0,0]} name="MRR" />
                      <Bar dataKey="ingresos" fill="#0891b2" radius={[8,8,0,0]} name="Ingresos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex gap-4 text-xs font-bold text-slate-600 border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />MRR</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />Ingresos</span>
                </div>
              </SuperPanel>

              {/* Panel lateral conversiones */}
              <SuperPanel title="Métricas SaaS" subtitle="Indicadores clave del negocio">
                <div className="grid gap-3">
                  {[
                    { label: 'Trial → Pago', value: '68%', bar: 68, color: 'bg-emerald-500' },
                    { label: 'Retención mensual', value: '94%', bar: 94, color: 'bg-teal-500' },
                    { label: 'NPS estimado', value: '72', bar: 72, color: 'bg-blue-500' },
                    { label: 'Satisfacción soporte', value: '91%', bar: 91, color: 'bg-violet-500' },
                    { label: 'LTV promedio', value: currency.format(averageMrr * 18), bar: 70, color: 'bg-amber-500' },
                  ].map(item => (
                    <div key={item.label} className="grid gap-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{item.label}</span>
                        <span className="text-slate-950">{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${item.color}`} style={{ width: `${item.bar}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SuperPanel>
            </section>

            {/* Historial de pagos */}
            <SuperPanel title="Historial de pagos" subtitle="Últimas transacciones de la plataforma">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Restaurante','Plan','Monto','Fecha','Método','Estado'].map(h => (
                        <th key={h} className="pb-3 text-left text-xs font-black uppercase tracking-wider text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {buildPaymentHistory(organizations).map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-black text-slate-950">{p.restaurant}</td>
                        <td className="py-3"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{p.plan}</span></td>
                        <td className="py-3 font-black text-slate-950">{currency.format(p.amount)}</td>
                        <td className="py-3 text-xs font-bold text-slate-500">{p.date}</td>
                        <td className="py-3 text-xs font-bold text-slate-600">{p.method}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-black ${
                            p.status === 'Aprobado' ? 'bg-emerald-100 text-emerald-700' :
                            p.status === 'Pendiente' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
                <button className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 transition">
                  <Download className="h-3.5 w-3.5" />Exportar Excel
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 transition">
                  <Download className="h-3.5 w-3.5" />Exportar PDF
                </button>
              </div>
            </SuperPanel>

            {/* Morosos */}
            {inactiveOrgs.length > 0 && (
              <SuperPanel title="Restaurantes morosos" subtitle="Con pagos pendientes o cuenta suspendida">
                <div className="grid gap-3">
                  {inactiveOrgs.map(org => (
                    <div key={org.id} className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-500 text-sm font-black text-white">
                          {decodeUiText(org.name).slice(0,1)}
                        </div>
                        <div>
                          <p className="font-black text-slate-950">{decodeUiText(org.name)}</p>
                          <p className="text-xs font-bold text-slate-500">{normalizePlanLabel(org.plan)} · {currency.format(org.mrr || 0)}/mes</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700">MOROSO</span>
                        <button onClick={() => handleImpersonate(org)} className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-black text-white">Gestionar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </SuperPanel>
            )}
          </div>
        ) : null}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB: PAGOS / MERCADOPAGO                               */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'pagos' ? (
          <div className="grid gap-6">
            {/* Estado webhook */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Webhook MP</p>
                    <p className="mt-2 text-2xl font-black text-emerald-800">Activo</p>
                    <p className="mt-1 text-xs font-bold text-emerald-600">Recibiendo notificaciones</p>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500 text-white">
                    <Zap className="h-6 w-6" />
                  </div>
                </div>
                <span className="absolute right-3 top-3 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" /></span>
              </div>
              <DashKpiCard label="Pagos aprobados" value="94" sub="Últimos 30 días" icon={CheckCircle2} color="from-emerald-500 to-teal-500" badge="98.2% tasa aprob." badgeTone="up" />
              <DashKpiCard label="Pagos pendientes" value="3" sub="Requieren revisión" icon={Clock} color="from-amber-500 to-orange-500" badge="En proceso" badgeTone="neutral" />
              <DashKpiCard label="Pagos rechazados" value="2" sub="Últimos 30 días" icon={XCircle} color="from-rose-500 to-red-600" badge="Investigar" badgeTone="warn" />
            </section>

            {/* Historial transacciones */}
            <SuperPanel title="Historial de transacciones MercadoPago" subtitle="Pagos procesados en la plataforma">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Payment ID','Restaurante','Monto','Fecha','Tipo','Estado','Acción'].map(h => (
                        <th key={h} className="pb-3 text-left text-xs font-black uppercase tracking-wider text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {buildMPTransactions(organizations).map((t, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-mono text-xs font-bold text-slate-600">{t.paymentId}</td>
                        <td className="py-3 font-black text-slate-950">{t.restaurant}</td>
                        <td className="py-3 font-black text-slate-950">{currency.format(t.amount)}</td>
                        <td className="py-3 text-xs font-bold text-slate-500">{t.date}</td>
                        <td className="py-3 text-xs font-bold text-slate-600">{t.type}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-black ${
                            t.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                            t.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>{t.status === 'approved' ? 'Aprobado' : t.status === 'pending' ? 'Pendiente' : 'Rechazado'}</span>
                        </td>
                        <td className="py-3">
                          <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-black text-slate-700 hover:bg-slate-50">Ver</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SuperPanel>

            {/* Alertas MP */}
            <section className="grid gap-4 xl:grid-cols-2">
              <SuperPanel title="Alertas de pagos" subtitle="Situaciones que requieren atención">
                <div className="grid gap-3">
                  {[
                    { level: 'medium', title: 'Webhook lento', desc: 'Respuesta de MP demorada más de 3s en los últimos intentos.' },
                    { level: 'low', title: 'Pago duplicado detectado', desc: 'Verificar Payment ID #82904 del restaurante Bella Vista.' },
                    { level: 'low', title: 'Nuevo plan sin cobro', desc: '2 restaurantes activaron plan pro sin pago procesado.' },
                  ].map((a, i) => (
                    <EnhancedAlertRow key={i} alert={{ level: a.level, title: a.title, description: a.desc }} />
                  ))}
                </div>
              </SuperPanel>

              <SuperPanel title="Logs MercadoPago" subtitle="Últimas notificaciones recibidas">
                <div className="grid gap-2 font-mono text-xs max-h-64 overflow-y-auto [scrollbar-width:thin]">
                  {buildMPLogs().map((log, i) => (
                    <div key={i} className={`rounded-xl px-3 py-2.5 ${
                      log.type === 'error' ? 'bg-rose-50 text-rose-700' :
                      log.type === 'warn' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      <span className="font-black">[{log.time}]</span> {log.type.toUpperCase()} — {log.message}
                    </div>
                  ))}
                </div>
              </SuperPanel>
            </section>
          </div>
        ) : null}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB: SOPORTE / TICKETS — MEJORADO                      */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'soporte' ? (
          <div className="grid gap-6">
            {/* Header con KPIs */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DashKpiCard label="Tickets abiertos" value={openTicketsCount} sub="Pendientes de resolución" icon={MessageSquare} color="from-rose-500 to-pink-500" badge="Atención" badgeTone="warn" />
              <DashKpiCard label="En revisión" value="2" sub="Asignados a soporte" icon={Clock} color="from-amber-500 to-orange-500" badge="En progreso" badgeTone="neutral" />
              <DashKpiCard label="Resueltos hoy" value="5" sub="Últimas 24 horas" icon={CheckCircle2} color="from-emerald-500 to-teal-600" badge="+67% resolución" badgeTone="up" />
              <DashKpiCard label="Tiempo resp. prom." value="1.4h" sub="SLA objetivo: 2h" icon={Activity} color="from-violet-500 to-purple-600" badge="Dentro del SLA" badgeTone="up" />
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
              {/* Lista de tickets */}
              <SuperPanel title="Tickets activos" subtitle="Ordenados por prioridad y tiempo abierto">
                <div className="grid gap-3">
                  {buildSupportTickets(organizations).map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onEnter={() => {
                        const org = organizations.find(o => o.id === ticket.orgId)
                        if (org) handleImpersonate(org)
                      }}
                    />
                  ))}
                  <button className="mt-2 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-3 text-sm font-black text-slate-400 hover:border-slate-400 hover:text-slate-600 transition">
                    <Plus className="h-4 w-4" />Crear ticket manual
                  </button>
                </div>
              </SuperPanel>

              {/* Panel filtros + estadísticas */}
              <div className="grid gap-4">
                <SuperPanel title="Filtrar tickets" subtitle="">
                  <div className="grid gap-3">
                    <div>
                      <p className="mb-2 text-xs font-black text-slate-500 uppercase tracking-wider">Por prioridad</p>
                      <div className="flex flex-wrap gap-2">
                        {['Crítica','Alta','Media','Baja'].map((p) => (
                          <button key={p} className={`rounded-xl px-3 py-1.5 text-xs font-black transition border ${
                            p === 'Crítica' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            p === 'Alta' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            p === 'Media' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>{p}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-black text-slate-500 uppercase tracking-wider">Por categoría</p>
                      <div className="flex flex-wrap gap-2">
                        {['POS','Cocina','QR','Pagos','Impresoras','Usuarios'].map((c) => (
                          <button key={c} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-50">{c}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SuperPanel>

                <SuperPanel title="SLA por categoría" subtitle="Tiempo promedio de resolución">
                  <div className="grid gap-2">
                    {[
                      { cat: 'POS / Caja', time: '0.8h', ok: true },
                      { cat: 'QR Menú', time: '1.2h', ok: true },
                      { cat: 'Pagos MP', time: '2.1h', ok: false },
                      { cat: 'Cocina KDS', time: '1.5h', ok: true },
                      { cat: 'Usuarios', time: '3.0h', ok: false },
                    ].map(s => (
                      <div key={s.cat} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                        <span className="text-xs font-black text-slate-700">{s.cat}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-950">{s.time}</span>
                          <span className={`h-2 w-2 rounded-full ${s.ok ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </SuperPanel>
              </div>
            </section>
          </div>
        ) : null}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB: MODULOS — MEJORADO                                */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'modulos' ? (
          <div className="grid gap-6">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SuperMetricCard label="Módulos activos" value="5 / 11" detail="En toda la plataforma" icon={Sparkles} tone="emerald" />
              <SuperMetricCard label="Sin errores" value="5" detail="Módulos estables" icon={CheckCircle2} tone="teal" />
              <SuperMetricCard label="Con errores" value="0" detail="Requieren revisión" icon={AlertTriangle} tone="rose" />
              <SuperMetricCard label="Inactivos" value="6" detail="Disponibles para activar" icon={Package} tone="amber" />
            </section>

            {/* Matriz de módulos */}
            <SuperPanel title="Control de módulos" subtitle="Activa o desactiva servicios por restaurante en la plataforma">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {buildPlatformModules(state, selectedOrg).map((mod) => (
                  <ModuleToggleCard key={mod.key} mod={mod} />
                ))}
              </div>
            </SuperPanel>

            {/* Matriz global restaurantes × módulos */}
            <SuperPanel title="Matriz de módulos por restaurante" subtitle="Vista global de qué tiene activado cada local">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-left font-black text-slate-500">Restaurante</th>
                      {['QR','POS','KDS','Delivery','Inventario','Multi-suc.','Impresoras'].map(m => (
                        <th key={m} className="pb-3 text-center font-black text-slate-500">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {organizations.map((org) => (
                      <tr key={org.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-black text-slate-950">{decodeUiText(org.name)}</td>
                        {[true, normalizePlanLabel(org.plan)!=='QR Básico', normalizePlanLabel(org.plan)!=='QR Básico', false, false, normalizePlanLabel(org.plan)==='Enterprise', false].map((active, i) => (
                          <td key={i} className="py-3 text-center">
                            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${ active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400' }`}>
                              {active ? '✓' : '–'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SuperPanel>
          </div>
        ) : null}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB: MONITOREO TÉCNICO                                 */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'monitoreo' ? (
          <div className="grid gap-6">
            {/* Estado de servicios */}
            <SuperPanel title="Estado de servicios" subtitle="Centro de monitoreo operativo en tiempo real">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  { name: 'API Principal', status: 'ok', latency: '42ms', uptime: '99.98%' },
                  { name: 'Base de datos', status: 'ok', latency: '12ms', uptime: '99.99%' },
                  { name: 'WebSockets', status: 'ok', latency: '8ms', uptime: '99.95%' },
                  { name: 'Cloudflare CDN', status: 'ok', latency: '18ms', uptime: '99.99%' },
                  { name: 'Impresoras', status: 'warn', latency: '---', uptime: '97.2%' },
                  { name: 'MercadoPago', status: 'ok', latency: '230ms', uptime: '99.8%' },
                  { name: 'Cocina / KDS', status: 'ok', latency: '5ms', uptime: '99.9%' },
                  { name: 'Storage', status: 'ok', latency: '95ms', uptime: '99.97%' },
                  { name: 'Email / SMTP', status: 'warn', latency: '---', uptime: '98.5%' },
                ].map((svc) => (
                  <div key={svc.name} className={`flex items-center justify-between rounded-2xl border p-4 ${
                    svc.status === 'ok' ? 'border-emerald-100 bg-emerald-50/40' : 'border-amber-200 bg-amber-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`relative flex h-3 w-3`}>
                        {svc.status === 'ok'
                          ? <><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-60" /><span className="relative h-3 w-3 rounded-full bg-emerald-500" /></>
                          : <span className="h-3 w-3 rounded-full bg-amber-500" />
                        }
                      </span>
                      <div>
                        <p className="text-sm font-black text-slate-950">{svc.name}</p>
                        <p className="text-xs font-bold text-slate-500">Uptime {svc.uptime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-700">{svc.latency}</p>
                      <p className={`text-[0.6rem] font-black uppercase ${
                        svc.status === 'ok' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>{svc.status === 'ok' ? 'OPERATIVO' : 'DEGRADADO'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SuperPanel>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
              {/* Logs de errores */}
              <SuperPanel title="Logs de errores recientes" subtitle="Últimas incidencias del sistema">
                <div className="grid gap-2 max-h-80 overflow-y-auto [scrollbar-width:thin]">
                  {buildSystemLogs().map((log, i) => (
                    <div key={i} className={`rounded-xl px-4 py-3 font-mono text-xs ${
                      log.level === 'error' ? 'bg-rose-50 text-rose-700' :
                      log.level === 'warn' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[0.6rem] font-black ${
                          log.level === 'error' ? 'bg-rose-200 text-rose-800' :
                          log.level === 'warn' ? 'bg-amber-200 text-amber-800' :
                          'bg-slate-200 text-slate-700'
                        }`}>{log.level.toUpperCase()}</span>
                        <span className="text-slate-500">{log.time}</span>
                      </div>
                      <p className="mt-1 leading-5">{log.message}</p>
                    </div>
                  ))}
                </div>
              </SuperPanel>

              {/* Consumo servidor */}
              <SuperPanel title="Consumo servidor" subtitle="Recursos en tiempo real">
                <div className="grid gap-4">
                  {[
                    { label: 'CPU', value: 23, color: 'bg-emerald-500', detail: '23% · 4 cores' },
                    { label: 'RAM', value: 61, color: 'bg-teal-500', detail: '2.4 GB / 4 GB' },
                    { label: 'Storage', value: 38, color: 'bg-blue-500', detail: '38 GB / 100 GB' },
                    { label: 'Banda ancha', value: 12, color: 'bg-violet-500', detail: '120 MB/s' },
                    { label: 'Conexiones DB', value: 45, color: 'bg-amber-500', detail: '45 / 100 max' },
                  ].map(res => (
                    <div key={res.label} className="grid gap-1.5">
                      <div className="flex justify-between">
                        <span className="text-xs font-black text-slate-700">{res.label}</span>
                        <span className="text-xs font-bold text-slate-500">{res.detail}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${res.color}`} style={{ width: `${res.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Restaurantes offline */}
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Restaurantes offline</p>
                  {inactiveOrgs.length === 0 ? (
                    <p className="text-xs font-bold text-emerald-600">✅ Todos los locales en línea</p>
                  ) : inactiveOrgs.map(org => (
                    <div key={org.id} className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 mb-2">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      <span className="text-xs font-black text-rose-700">{decodeUiText(org.name)}</span>
                    </div>
                  ))}
                </div>
              </SuperPanel>
            </section>
          </div>
        ) : null}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB: SEGURIDAD                                          */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'seguridad' ? (
          <div className="grid gap-6">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DashKpiCard label="Accesos hoy" value="14" sub="Logins administrativos" icon={Lock} color="from-slate-700 to-slate-900" badge="Normal" badgeTone="neutral" />
              <DashKpiCard label="Acciones registradas" value="87" sub="Últimas 24 horas" icon={FileText} color="from-violet-500 to-purple-600" badge="Auditado" badgeTone="up" />
              <DashKpiCard label="IPs únicas" value="6" sub="Accesos este mes" icon={Globe} color="from-blue-500 to-indigo-600" badge="Sin anomalías" badgeTone="up" />
              <DashKpiCard label="Alertas seguridad" value="0" sub="Incidentes detectados" icon={Shield} color="from-emerald-500 to-teal-600" badge="Sistema seguro" badgeTone="up" />
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_340px]">
              {/* Log de acciones */}
              <SuperPanel title="Historial de acciones administrativas" subtitle="Registro de auditoría completo">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {['Usuario','Acción','Recurso','IP','Fecha','Estado'].map(h => (
                          <th key={h} className="pb-3 text-left text-xs font-black uppercase tracking-wider text-slate-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {buildAdminLogs().map((log, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="grid h-7 w-7 place-items-center rounded-full bg-indigo-100 text-xs font-black text-indigo-700">{log.user.slice(0,1)}</div>
                              <span className="font-black text-slate-950 text-xs">{log.user}</span>
                            </div>
                          </td>
                          <td className="py-3 text-xs font-bold text-slate-700">{log.action}</td>
                          <td className="py-3 text-xs font-bold text-slate-600">{log.resource}</td>
                          <td className="py-3 font-mono text-xs text-slate-500">{log.ip}</td>
                          <td className="py-3 text-xs text-slate-500">{log.date}</td>
                          <td className="py-3">
                            <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-black ${
                              log.status === 'ok' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>{log.status === 'ok' ? 'OK' : 'ALERTA'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SuperPanel>

              {/* Roles y permisos */}
              <div className="grid gap-4">
                <SuperPanel title="Roles del sistema" subtitle="Usuarios y permisos">
                  <div className="grid gap-3">
                    {[
                      { role: 'Superadmin', user: currentUser?.name || 'Admin', color: 'bg-violet-100 text-violet-700', perms: 'Acceso total' },
                      { role: 'Soporte', user: 'soporte@acrodevs.cl', color: 'bg-blue-100 text-blue-700', perms: 'Tickets + impersonar' },
                      { role: 'Ventas', user: 'ventas@acrodevs.cl', color: 'bg-emerald-100 text-emerald-700', perms: 'Planes + finanzas' },
                      { role: 'Técnico', user: 'devops@acrodevs.cl', color: 'bg-amber-100 text-amber-700', perms: 'Monitoreo + logs' },
                    ].map(r => (
                      <div key={r.role} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                        <span className={`rounded-xl px-2.5 py-1 text-xs font-black ${r.color}`}>{r.role}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-black text-slate-900">{r.user}</p>
                          <p className="text-xs font-bold text-slate-400">{r.perms}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SuperPanel>

                <SuperPanel title="Últimos accesos" subtitle="IPs registradas">
                  <div className="grid gap-2">
                    {[
                      { ip: '190.41.22.8', time: 'Hace 5 min', ok: true },
                      { ip: '200.111.8.42', time: 'Hace 1h', ok: true },
                      { ip: '181.73.5.91', time: 'Hace 3h', ok: true },
                      { ip: '192.168.1.1', time: 'Hace 6h', ok: true },
                    ].map((ip, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${ip.ok ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className="font-mono text-xs font-bold text-slate-700">{ip.ip}</span>
                        </div>
                        <span className="text-xs text-slate-400">{ip.time}</span>
                      </div>
                    ))}
                  </div>
                </SuperPanel>
              </div>
            </section>
          </div>
        ) : null}
      </section>

      {showOrgModal ? (
        <SuperOrgModal
          editingOrg={editingOrg}
          form={form}
          setForm={setForm}
          onClose={closeOrgModal}
          onSubmit={handleSaveOrg}
        />
      ) : null}
    </main>
  )
}

function RestaurantProfilePanel({ snapshot, onSupport }) {
  if (!snapshot) return null

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(380px,0.8fr)]">
      <SuperPanel title="Ficha completa del restaurante" subtitle="Información conectada al local seleccionado">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <RestaurantInfoBlock label="Restaurante" value={snapshot.name} detail={`/${snapshot.slug}`} />
          <RestaurantInfoBlock label="Plan" value={snapshot.plan} detail={snapshot.status} />
          <RestaurantInfoBlock label="MRR" value={currency.format(snapshot.mrr)} detail={snapshot.rut || 'RUT pendiente'} />
          <RestaurantInfoBlock label="WhatsApp" value={snapshot.whatsapp || 'Sin configurar'} detail="Notificaciones y soporte" />
          <RestaurantInfoBlock label="URL base" value={snapshot.baseUrl || 'Sin dominio'} detail="QR de mesas" />
          <RestaurantInfoBlock label="Color marca" value={snapshot.primaryColor || 'Sin color'} detail="Branding del menú" />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={onSupport} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
            Entrar como soporte
          </button>
          <Link to="/admin/configuracion" className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700">
            Ver configuración
          </Link>
          <Link to="/admin/mesas" className="rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-black text-emerald-700">
            Mesas y QR
          </Link>
        </div>
      </SuperPanel>

      <SuperPanel title="Resumen del local" subtitle="Operación, catálogo y equipo">
        <div className="grid grid-cols-2 gap-3">
          <MiniMetric label="Salud" value={`${snapshot.health}%`} />
          <MiniMetric label="Ventas hoy" value={currency.format(snapshot.dailySales)} />
          <MiniMetric label="Pedidos activos" value={snapshot.activeOrders} />
          <MiniMetric label="Pendientes" value={snapshot.pendingOrders} />
          <MiniMetric label="Listos" value={snapshot.readyOrders} />
          <MiniMetric label="Categorías" value={snapshot.categories} />
          <MiniMetric label="Productos activos" value={snapshot.activeProducts} />
          <MiniMetric label="Mesas QR" value={snapshot.tables} />
          <MiniMetric label="Usuarios" value={snapshot.staffUsers} />
          <MiniMetric label="Reservas" value={snapshot.reservations} />
        </div>
      </SuperPanel>
    </section>
  )
}

function RestaurantInfoBlock({ label, value, detail }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 truncate text-base font-black text-slate-950">{value}</p>
      <p className="mt-1 truncate text-xs font-bold text-slate-500">{detail}</p>
    </div>
  )
}

function RestaurantCompactRow({ org, onSelect, onSupport }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="truncate text-sm font-black text-slate-950">{decodeUiText(org.name)}</h4>
          <PlanPill plan={org.plan} />
          <AccountStatusPill status={org.status} />
        </div>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          /{org.slug} · {org.rut || 'RUT pendiente'} · {currency.format(org.mrr || 0)}
        </p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onSelect} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">
          Ver datos
        </button>
        <button type="button" onClick={onSupport} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-black text-slate-950">
          Entrar
        </button>
      </div>
    </div>
  )
}

function PlanDistributionRow({ row, total }) {
  const percent = total ? Math.round((row.count / total) * 100) : 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-black text-slate-800">
        <span>{row.label}</span>
        <span>{row.count} · {percent}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${row.color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function SuperMetricCard({ label, value, detail, icon: Icon, tone }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    teal: 'bg-teal-50 text-teal-700 ring-teal-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
          <strong className="mt-3 block text-3xl font-black tracking-tight text-slate-950">{value}</strong>
          <p className="mt-2 text-sm font-semibold text-slate-500">{detail}</p>
        </div>
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </motion.article>
  )
}

function SuperPanel({ title, subtitle, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-5">
        <h3 className="text-lg font-black text-slate-950">{title}</h3>
        <p className="mt-1 text-sm font-semibold text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

function SuperSectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">{eyebrow}</p>
        <h2 className="mt-2 font-sans text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  )
}

function RestaurantTenantCard({ org, active, health, onSelect, onSupport, onEdit, onDelete }) {
  return (
    <article className={`rounded-[1.7rem] border bg-white p-5 shadow-soft transition hover:-translate-y-1 ${active ? 'border-emerald-300 ring-4 ring-emerald-100' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-white">
            {decodeUiText(org.name).slice(0, 1)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-slate-950">{decodeUiText(org.name)}</h3>
            <p className="truncate text-sm font-semibold text-slate-500">/{org.slug}</p>
          </div>
        </div>
        <HealthRing value={health} small />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <PlanPill plan={org.plan} />
        <AccountStatusPill status={org.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">
        <MiniMetric label="MRR" value={currency.format(org.mrr || 0)} />
        <MiniMetric label="RUT" value={org.rut || 'Pendiente'} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={onSupport} className="rounded-2xl bg-emerald-500 px-3 py-3 text-sm font-black text-slate-950">
          Entrar soporte
        </button>
        <button type="button" onClick={onSelect} className="rounded-2xl bg-slate-950 px-3 py-3 text-sm font-black text-white">
          Ver operación
        </button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
        <button type="button" onClick={onEdit} className="rounded-xl bg-slate-100 p-2 text-slate-600">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" onClick={onDelete} className="rounded-xl bg-rose-50 p-2 text-rose-600">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}

function HealthRing({ value, small = false }) {
  const color = value >= 80 ? 'text-emerald-600' : value >= 55 ? 'text-amber-600' : 'text-rose-600'
  return (
    <div className={`grid place-items-center rounded-full border-8 border-slate-100 bg-white ${small ? 'h-16 w-16' : 'h-20 w-20'}`}>
      <strong className={`${small ? 'text-sm' : 'text-lg'} font-black ${color}`}>{value}%</strong>
    </div>
  )
}

function MiniMetric({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-slate-950">{value}</p>
    </div>
  )
}

function SuperListRow({ index, title, detail, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
      <div className="flex min-w-0 items-center gap-3">
        {index ? (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">
            {index}
          </span>
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950">{title}</p>
          <p className="truncate text-xs font-semibold text-slate-500">{detail}</p>
        </div>
      </div>
      <strong className="shrink-0 text-sm font-black text-slate-950">{value}</strong>
    </div>
  )
}

function ModuleHealthRow({ label, description, enabled, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-black text-slate-950">{label}</p>
        <p className="text-xs font-semibold leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  )
}

function PlanCard({ plan }) {
  return (
    <article className={`rounded-[1.7rem] border bg-white p-6 shadow-soft ${plan.featured ? 'border-emerald-300 ring-4 ring-emerald-100' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-600">{plan.badge}</p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">{plan.name}</h3>
        </div>
        <span className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-black text-white">{plan.price}</span>
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">{plan.description}</p>
      <div className="mt-5 grid gap-2">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {feature}
          </div>
        ))}
      </div>
    </article>
  )
}

function SupportAlert({ item }) {
  const tones = {
    high: 'border-rose-200 bg-rose-50 text-rose-700',
    medium: 'border-amber-200 bg-amber-50 text-amber-700',
    low: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  }
  return (
    <div className={`rounded-2xl border p-4 ${tones[item.level]}`}>
      <p className="text-sm font-black">{item.title}</p>
      <p className="mt-1 text-sm font-semibold opacity-80">{item.description}</p>
    </div>
  )
}

function ProductModuleCard({ module }) {
  return (
    <article className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${module.essential ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          <module.icon className="h-6 w-6" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">{module.title}</h3>
            <span className={`rounded-full px-2 py-1 text-[0.65rem] font-black ${module.essential ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
              {module.essential ? 'Necesario' : 'Después'}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{module.description}</p>
        </div>
      </div>
    </article>
  )
}

function SuperOrgModal({ editingOrg, form, setForm, onClose, onSubmit }) {
  const updateName = (value) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug: editingOrg
        ? current.slug
        : value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }))
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <motion.form
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        onSubmit={onSubmit}
        className="w-full max-w-2xl rounded-[2rem] bg-white p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
              {editingOrg ? 'Editar cuenta' : 'Nuevo restaurante'}
            </p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">
              {editingOrg ? 'Ajustar restaurante' : 'Crear restaurante'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <SuperField label="Nombre comercial">
            <input
              value={form.name}
              onChange={(event) => updateName(event.target.value)}
              required
              placeholder="Restaurante Centro"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black outline-none focus:border-emerald-400 focus:bg-white"
            />
          </SuperField>
          <SuperField label="Slug / URL interna">
            <input
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              required
              placeholder="restaurante-centro"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black outline-none focus:border-emerald-400 focus:bg-white"
            />
          </SuperField>
          <SuperField label="RUT">
            <input
              value={form.rut}
              onChange={(event) => setForm((current) => ({ ...current, rut: event.target.value }))}
              placeholder="76.123.456-7"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black outline-none focus:border-emerald-400 focus:bg-white"
            />
          </SuperField>
          <SuperField label="Cobro mensual">
            <input
              type="number"
              value={form.mrr}
              onChange={(event) => setForm((current) => ({ ...current, mrr: event.target.value }))}
              placeholder="34990"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black outline-none focus:border-emerald-400 focus:bg-white"
            />
          </SuperField>
          <SuperField label="Plan">
            <select
              value={form.plan}
              onChange={(event) => setForm((current) => ({ ...current, plan: normalizePlanForStorage(event.target.value) }))}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black outline-none focus:border-emerald-400 focus:bg-white"
            >
              {superadminPlanOptions().map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </SuperField>
          <SuperField label="Estado">
            <select
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black outline-none focus:border-emerald-400 focus:bg-white"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </SuperField>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="h-12 rounded-2xl bg-slate-100 px-5 text-sm font-black text-slate-600">
            Cancelar
          </button>
          <button type="submit" className="h-12 rounded-2xl bg-emerald-500 px-5 text-sm font-black text-slate-950">
            {editingOrg ? 'Guardar cambios' : 'Crear restaurante'}
          </button>
        </div>
      </motion.form>
    </div>
  )
}

function SuperField({ label, children }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</span>
      {children}
    </label>
  )
}

function PlanPill({ plan }) {
  const label = normalizePlanLabel(plan)
  const classes =
    label === 'Enterprise'
      ? 'bg-purple-50 text-purple-700 ring-purple-100'
      : label === 'Pago único'
        ? 'bg-amber-50 text-amber-700 ring-amber-100'
        : 'bg-emerald-50 text-emerald-700 ring-emerald-100'

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${classes}`}>
      {label}
    </span>
  )
}

function AccountStatusPill({ status }) {
  const cleanStatus = normalizeAccountStatus(status)
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${cleanStatus === 'Activo' ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-rose-50 text-rose-700 ring-rose-100'}`}>
      {cleanStatus}
    </span>
  )
}

function SuperEmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm font-bold text-slate-500">
      {text}
    </div>
  )
}

function OrderStatusPill({ status }) {
  const normalized = status === 'En preparaciÃ³n' ? 'En preparación' : status
  const classes = {
    Pendiente: 'bg-amber-50 text-amber-700 ring-amber-100',
    'En preparación': 'bg-blue-50 text-blue-700 ring-blue-100',
    Listo: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    Entregado: 'bg-slate-100 text-slate-600 ring-slate-200',
    Cancelado: 'bg-rose-50 text-rose-700 ring-rose-100',
  }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${classes[normalized] ?? classes.Entregado}`}>
      {normalized}
    </span>
  )
}

function createSuperadminOrgForm(org = null) {
  return {
    name: org?.name ?? '',
    slug: org?.slug ?? '',
    plan: normalizePlanForStorage(org?.plan ?? 'BÃ¡sico'),
    status: org?.status ?? 'Activo',
    rut: org?.rut ?? '',
    mrr: org?.mrr ?? 34990,
  }
}

function superadminPlanOptions() {
  return [
    { value: 'BÃ¡sico', label: 'QR Básico' },
    { value: 'Empresa', label: 'Pro Restaurante' },
    { value: 'Venta Ãšnica', label: 'Pago único' },
  ]
}

function normalizePlanLabel(plan = '') {
  const clean = decodeUiText(plan)
  if (clean.includes('Venta')) return 'Pago único'
  if (clean.includes('Empresa')) return 'Enterprise'
  return 'QR Básico'
}

function normalizePlanForStorage(plan = '') {
  const clean = decodeUiText(plan)
  if (clean.includes('Venta') || clean.includes('Pago')) return 'Venta Única'
  if (clean.includes('Empresa') || clean.includes('Enterprise') || clean.includes('Pro')) return 'Empresa'
  return 'Básico'
}

function normalizeAccountStatus(status = '') {
  return decodeUiText(status) || 'Activo'
}

function decodeUiText(value = '') {
  return String(value)
    .replaceAll('ÃƒÂ¡', 'á')
    .replaceAll('ÃƒÂ©', 'é')
    .replaceAll('ÃƒÂ­', 'í')
    .replaceAll('ÃƒÂ³', 'ó')
    .replaceAll('ÃƒÂº', 'ú')
    .replaceAll('ÃƒÅ¡', 'Ú')
    .replaceAll('ÃƒÂ±', 'ñ')
    .replaceAll('Ã¡', 'á')
    .replaceAll('Ã©', 'é')
    .replaceAll('Ã­', 'í')
    .replaceAll('Ã³', 'ó')
    .replaceAll('Ãº', 'ú')
    .replaceAll('Ãš', 'Ú')
    .replaceAll('Ã±', 'ñ')
    .replaceAll('â€”', '—')
    .replaceAll('Â·', '·')
    .replaceAll('Â¿', '¿')
}

function calculateRestaurantHealth(org, state = {}) {
  if (!org) return 0
  let score = normalizeAccountStatus(org.status) === 'Activo' ? 35 : 10
  if (org.rut) score += 12
  if (Number(org.mrr || 0) > 0) score += 13
  if ((state.products ?? []).length) score += 12
  if ((state.tables ?? []).length) score += 12
  if ((state.staffUsers ?? []).length) score += 8
  if (state.restaurant?.whatsapp) score += 8
  return Math.min(score, 100)
}

function calculatePlatformHealth(organizations) {
  if (!organizations.length) return 0
  const active = organizations.filter((org) => normalizeAccountStatus(org.status) === 'Activo').length
  const withBilling = organizations.filter((org) => Number(org.mrr || 0) > 0).length
  const activeScore = Math.round((active / organizations.length) * 60)
  const billingScore = Math.round((withBilling / organizations.length) * 40)
  return Math.min(100, activeScore + billingScore)
}

function buildPlanRows(organizations) {
  const rows = [
    { label: 'QR Básico', color: 'bg-emerald-500', count: 0 },
    { label: 'Pro Restaurante', color: 'bg-purple-500', count: 0 },
    { label: 'Pago único', color: 'bg-amber-500', count: 0 },
  ]
  organizations.forEach((org) => {
    const rawPlan = decodeUiText(org.plan)
    if (rawPlan.includes('Venta')) {
      rows[2].count += 1
    } else if (rawPlan.includes('Empresa')) {
      rows[1].count += 1
    } else {
      rows[0].count += 1
    }
  })
  return rows
}

function buildRestaurantSnapshot(org, state, metrics) {
  if (!org) return null
  return {
    name: decodeUiText(org.name),
    slug: org.slug,
    plan: normalizePlanLabel(org.plan),
    status: normalizeAccountStatus(org.status),
    rut: org.rut || '',
    mrr: Number(org.mrr || 0),
    whatsapp: state.restaurant?.whatsapp || '',
    baseUrl: state.restaurant?.baseUrl || '',
    primaryColor: state.restaurant?.primaryColor || '',
    health: metrics.currentHealth,
    dailySales: metrics.dailySales,
    activeOrders: metrics.activeOrders,
    pendingOrders: metrics.pendingOrders,
    readyOrders: metrics.readyOrders,
    categories: state.categories?.length ?? 0,
    products: state.products?.length ?? 0,
    activeProducts: (state.products ?? []).filter((product) => product.available).length,
    tables: state.tables?.length ?? 0,
    staffUsers: state.staffUsers?.length ?? 0,
    reservations: state.reservations?.length ?? 0,
  }
}

function buildRestaurantModules(state) {
  return [
    {
      label: 'Menú QR',
      description: `${state.products?.length ?? 0} productos y ${state.tables?.length ?? 0} mesas configuradas.`,
      enabled: Boolean((state.products ?? []).length && (state.tables ?? []).length),
      icon: QrCode,
    },
    {
      label: 'KDS cocina',
      description: 'Pantalla de cocina con estados de pedido en vivo.',
      enabled: true,
      icon: ChefHat,
    },
    {
      label: 'POS / caja',
      description: 'Caja interna para cobro y seguimiento manual.',
      enabled: true,
      icon: CreditCard,
    },
    {
      label: 'Equipo y PIN',
      description: `${state.staffUsers?.length ?? 0} usuarios de staff registrados.`,
      enabled: Boolean((state.staffUsers ?? []).length),
      icon: Users,
    },
    {
      label: 'Reservas',
      description: 'Agenda simple para reservas por mesa.',
      enabled: true,
      icon: CalendarDays,
    },
  ]
}

function buildSuperadminSupportItems({ remoteError, inactiveOrgs, selectedOrg, state, activeOrders }) {
  const items = []
  if (remoteError) {
    items.push({
      level: 'high',
      title: 'Supabase requiere revisión',
      description: remoteError,
    })
  }
  if (inactiveOrgs.length) {
    items.push({
      level: 'medium',
      title: `${inactiveOrgs.length} local(es) inactivo(s)`,
      description: 'Revisar cobro, onboarding o solicitud de pausa del servicio.',
    })
  }
  if (selectedOrg && !state.restaurant?.whatsapp) {
    items.push({
      level: 'medium',
      title: 'WhatsApp no configurado',
      description: 'El local no tiene número de WhatsApp para notificaciones o soporte manual.',
    })
  }
  if (activeOrders.length > 8) {
    items.push({
      level: 'medium',
      title: 'Alta carga operativa',
      description: 'Hay muchos pedidos activos; conviene revisar cocina o tiempos.',
    })
  }
  if (!items.length) {
    items.push({
      level: 'low',
      title: 'Todo se ve estable',
      description: 'No hay alertas críticas para el local seleccionado.',
    })
  }
  return items
}

function buildRestaurantOnboarding(selectedOrg, state) {
  return [
    {
      label: 'Cuenta del restaurante creada',
      help: 'Nombre, slug y estado comercial configurados.',
      done: Boolean(selectedOrg),
    },
    {
      label: 'Menú cargado',
      help: 'Productos visibles para el cliente con QR.',
      done: Boolean((state.products ?? []).length),
    },
    {
      label: 'Mesas QR generadas',
      help: 'Cada mesa debe tener su QR imprimible.',
      done: Boolean((state.tables ?? []).length),
    },
    {
      label: 'Equipo creado',
      help: 'Admin, cocina, caja o garzones con acceso.',
      done: Boolean((state.staffUsers ?? []).length),
    },
    {
      label: 'WhatsApp configurado',
      help: 'Número para enviar resumen del pedido.',
      done: Boolean(state.restaurant?.whatsapp),
    },
  ]
}

function restaurantPlans() {
  return [
    {
      name: 'QR Básico',
      badge: 'Entrada',
      price: '$24.990/mes',
      description: 'Para locales pequeños que quieren menú QR y pedidos simples.',
      features: ['Menú digital por mesa', 'Carrito y notas', 'Panel cocina', 'Hasta 10 mesas'],
    },
    {
      name: 'Pro Restaurante',
      badge: 'Más vendible',
      price: '$39.990/mes',
      featured: true,
      description: 'Operación diaria completa: QR, cocina, caja, usuarios y reportes.',
      features: ['Mesas ilimitadas', 'KDS cocina', 'Usuarios por rol', 'POS interno', 'Reportes diarios'],
    },
    {
      name: 'Multi-local',
      badge: 'Escala',
      price: 'A medida',
      description: 'Para marcas con varias sucursales y soporte centralizado.',
      features: ['Multi sucursal', 'Soporte prioritario', 'Branding avanzado', 'Reportes consolidados'],
    },
  ]
}

function restaurantProductModules() {
  return [
    {
      title: 'Menú QR cliente',
      description: 'La experiencia principal: escanear, buscar, filtrar, agregar al carrito y enviar pedido.',
      essential: true,
      icon: Smartphone,
    },
    {
      title: 'Pantalla cocina KDS',
      description: 'Pedidos en tiempo real con estados visuales para preparar, listo y entregado.',
      essential: true,
      icon: ChefHat,
    },
    {
      title: 'Panel del restaurante',
      description: 'Productos, categorías, promociones, mesas QR, pedidos, usuarios y configuración.',
      essential: true,
      icon: Laptop,
    },
    {
      title: 'Superadmin AcroDevs',
      description: 'Control de restaurantes, planes, soporte, módulos activos y acceso por local.',
      essential: true,
      icon: Shield,
    },
    {
      title: 'POS / caja',
      description: 'Cobro interno y seguimiento manual para restaurantes que también venden en caja.',
      essential: false,
      icon: CreditCard,
    },
    {
      title: 'Reservas y fidelización',
      description: 'Agenda, clientes frecuentes, campañas y beneficios. Conviene dejarlo para segunda etapa.',
      essential: false,
      icon: CalendarDays,
    },
  ]
}

// ── Nuevos componentes UI del Dashboard ──

function DashKpiCard({ label, value, sub, icon: Icon, color, badge, badgeTone }) {
  const badgeClasses = {
    up: 'bg-emerald-100 text-emerald-700',
    warn: 'bg-rose-100 text-rose-700',
    neutral: 'bg-slate-100 text-slate-600',
  }
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-5 shadow-soft"
    >
      <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${color} opacity-10 pointer-events-none`} />
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-md`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[0.62rem] font-black leading-none ${badgeClasses[badgeTone] || badgeClasses.neutral}`}>
          {badge}
        </span>
      </div>
      <strong className="mt-4 block text-3xl font-black tracking-tight text-slate-950">{value}</strong>
      <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-slate-400 mt-0.5">{label}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{sub}</p>
    </motion.article>
  )
}

function EnhancedAlertRow({ alert }) {
  const levelConfig = {
    high: { bg: 'bg-rose-50 border-rose-200', badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500 animate-pulse', label: 'CRÍTICO' },
    medium: { bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'MEDIO' },
    low: { bg: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'OK' },
  }
  const cfg = levelConfig[alert.level] || levelConfig.low
  return (
    <div className={`rounded-2xl border p-4 ${cfg.bg}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-black text-slate-900">{alert.title}</p>
            <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-black ${cfg.badge}`}>{cfg.label}</span>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-600 leading-5">{alert.description}</p>
        </div>
      </div>
    </div>
  )
}

function ReviewOrgRow({ org, reason, severity, onSelect, onSupport }) {
  const isCritical = severity === 'high'
  return (
    <div className={`rounded-2xl border p-3 ${isCritical ? 'border-rose-200 bg-rose-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-black text-white ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`}>
            {decodeUiText(org.name).slice(0, 1)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-900">{decodeUiText(org.name)}</p>
            <p className="truncate text-xs font-semibold text-slate-500">{reason}</p>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button type="button" onClick={onSelect} className="rounded-xl bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition">Ver</button>
          <button type="button" onClick={onSupport} className="rounded-xl bg-slate-950 px-2.5 py-1.5 text-xs font-black text-white hover:bg-slate-800 transition">Entrar</button>
        </div>
      </div>
    </div>
  )
}

// ── Nuevos helpers de datos del Dashboard ──

function buildMonthlyRevenueData(currentMrr) {
  const base = currentMrr || 50000
  return [
    { mes: 'Dic', mrr: Math.round(base * 0.70), ingresos: Math.round(base * 0.65) },
    { mes: 'Ene', mrr: Math.round(base * 0.78), ingresos: Math.round(base * 0.74) },
    { mes: 'Feb', mrr: Math.round(base * 0.83), ingresos: Math.round(base * 0.80) },
    { mes: 'Mar', mrr: Math.round(base * 0.89), ingresos: Math.round(base * 0.85) },
    { mes: 'Abr', mrr: Math.round(base * 0.94), ingresos: Math.round(base * 0.91) },
    { mes: 'May', mrr: base, ingresos: Math.round(base * 0.97) },
  ]
}

function buildPlanPieData(organizations) {
  const basic = organizations.filter((o) => normalizePlanLabel(o.plan) === 'QR Básico').length
  const pro = organizations.filter((o) => normalizePlanLabel(o.plan) === 'Enterprise').length
  const unique = organizations.filter((o) => normalizePlanLabel(o.plan) === 'Pago único').length
  return [
    { name: 'QR Básico', value: basic || 0, color: '#10b981' },
    { name: 'Pro Restaurante', value: pro || 0, color: '#8b5cf6' },
    { name: 'Pago único', value: unique || 0, color: '#f59e0b' },
  ]
}

function buildEnhancedAlerts({ remoteError, inactiveOrgs, selectedOrg, state, activeOrders, organizations }) {
  const items = []
  if (remoteError) {
    items.push({ level: 'high', title: 'Error de conexión Supabase', description: remoteError })
  }
  if (inactiveOrgs.length > 0) {
    items.push({
      level: 'high',
      title: `${inactiveOrgs.length} restaurante${inactiveOrgs.length > 1 ? 's' : ''} suspendido${inactiveOrgs.length > 1 ? 's' : ''}`,
      description: 'Verificar estado de cuenta, pago o solicitud de pausa del servicio.',
    })
  }
  if (selectedOrg && !state.restaurant?.whatsapp) {
    items.push({
      level: 'medium',
      title: 'WhatsApp no configurado',
      description: `${decodeUiText(selectedOrg.name)} no tiene número de notificaciones configurado.`,
      orgId: selectedOrg.id,
    })
  }
  if (activeOrders.length > 8) {
    items.push({
      level: 'medium',
      title: 'Alta carga operativa',
      description: `${activeOrders.length} pedidos activos simultáneos. Revisar tiempos de cocina.`,
    })
  }
  const orgsWithoutRut = organizations.filter((o) => !o.rut)
  if (orgsWithoutRut.length > 0) {
    items.push({
      level: 'low',
      title: `${orgsWithoutRut.length} local${orgsWithoutRut.length > 1 ? 'es' : ''} sin RUT registrado`,
      description: 'Completar datos comerciales para facturación y contratos.',
    })
  }
  if (items.length === 0) {
    items.push({
      level: 'low',
      title: 'Plataforma operando normalmente',
      description: 'No hay alertas críticas. Todos los servicios funcionan correctamente.',
    })
  }
  return items
}

function buildTopPerformers(organizations) {
  return [...organizations]
    .sort((a, b) => Number(b.mrr || 0) - Number(a.mrr || 0))
    .slice(0, 4)
}

// ── Nuevos helpers de datos ──

function buildPaymentHistory(organizations) {
  const statuses = ['Aprobado', 'Aprobado', 'Aprobado', 'Pendiente', 'Rechazado']
  const methods = ['MercadoPago', 'Transfer. bancaria', 'MercadoPago', 'MercadoPago', 'Tarjeta']
  const dates = ['23 May 2026', '22 May 2026', '21 May 2026', '20 May 2026', '19 May 2026', '18 May 2026']
  return organizations.flatMap((org, i) => [
    {
      restaurant: org.name.length > 18 ? org.name.slice(0, 18) + '…' : org.name,
      plan: normalizePlanLabel(org.plan),
      amount: org.mrr || 49990,
      date: dates[i % dates.length],
      method: methods[i % methods.length],
      status: statuses[i % statuses.length],
    },
  ]).slice(0, 10)
}

function buildMPTransactions(organizations) {
  const types = ['subscripción', 'activación', 'renovación', 'upgrade']
  const statuses = ['approved', 'approved', 'approved', 'pending', 'rejected']
  return organizations.map((org, i) => ({
    paymentId: `MP-${(82000 + i * 347).toString()}`,
    restaurant: org.name.length > 16 ? org.name.slice(0, 16) + '…' : org.name,
    amount: org.mrr || 49990,
    date: `${23 - i} May 2026`,
    type: types[i % types.length],
    status: statuses[i % statuses.length],
  })).slice(0, 8)
}

function buildMPLogs() {
  const now = new Date()
  return [
    { time: formatLogTime(now, 0), type: 'info', message: 'POST /webhook/mp → 200 OK · payment_id=82910 · approved' },
    { time: formatLogTime(now, 3), type: 'info', message: 'POST /webhook/mp → 200 OK · payment_id=82909 · approved' },
    { time: formatLogTime(now, 8), type: 'warn', message: 'POST /webhook/mp → timeout 3200ms · reintento 1/3' },
    { time: formatLogTime(now, 12), type: 'info', message: 'GET /pagos/estado → 200 OK · 3 pendientes' },
    { time: formatLogTime(now, 25), type: 'error', message: 'POST /webhook/mp → 422 payment_id=82890 duplicado' },
    { time: formatLogTime(now, 40), type: 'info', message: 'POST /webhook/mp → 200 OK · payment_id=82880 · approved' },
    { time: formatLogTime(now, 60), type: 'info', message: 'Webhook MP sincronizado correctamente · uptime 99.8%' },
  ]
}

function formatLogTime(base, minutesAgo) {
  const d = new Date(base.getTime() - minutesAgo * 60000)
  return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function buildSupportTickets(organizations) {
  const priorities = ['crítica', 'alta', 'alta', 'media', 'baja']
  const categories = ['POS', 'QR', 'Pagos', 'Cocina', 'Usuarios', 'Impresoras']
  const issues = [
    'Impresora no conecta al sistema de cobros',
    'Menú QR no carga productos actualizados',
    'Pago no procesado tras webhook',
    'KDS cocina no recibe pedidos',
    'Garzón no puede iniciar sesión',
    'Caja no cuadra con pedidos del día',
  ]
  return organizations.slice(0, 5).map((org, i) => ({
    id: `TKT-${1000 + i}`,
    orgId: org.id,
    restaurant: org.name.length > 20 ? org.name.slice(0, 20) + '…' : org.name,
    title: issues[i % issues.length],
    priority: priorities[i % priorities.length],
    category: categories[i % categories.length],
    status: i === 0 ? 'crítico' : i < 3 ? 'abierto' : 'en revisión',
    openedAt: `Hace ${i * 2 + 1}h`,
    lastReply: `Hace ${i + 1}h`,
    sla: i < 2 ? 'Vencido' : 'En plazo',
  }))
}

function buildPlatformModules(state, selectedOrg) {
  return [
    { key: 'qr', label: 'Menú QR', ok: true, detail: `${state.tables?.length ?? 0} mesas configuradas`, version: 'v2.4.1', sync: 'Hace 2 min', errors: 0, icon: QrCode },
    { key: 'kds', label: 'Cocina / KDS', ok: true, detail: 'Pantalla cocina activa', version: 'v1.8.3', sync: 'Hace 5 min', errors: 0, icon: ChefHat },
    { key: 'pos', label: 'POS / Caja', ok: true, detail: 'Sistema cobros activo', version: 'v3.1.0', sync: 'Hace 1 min', errors: 0, icon: CreditCard },
    { key: 'garzon', label: 'Garzón móvil', ok: true, detail: `${(state.staffUsers ?? []).filter(u => u.role === 'garzon').length} registrados`, version: 'v1.5.2', sync: 'Hace 3 min', errors: 0, icon: Users },
    { key: 'reservas', label: 'Reservas', ok: Boolean(state.reservations?.length), detail: `${state.reservations?.length ?? 0} reservas`, version: 'v1.0.4', sync: 'Hace 10 min', errors: 0, icon: CalendarDays },
    { key: 'inventario', label: 'Inventario', ok: false, detail: 'No activado', version: 'v0.9.0', sync: 'Nunca', errors: 0, icon: Package },
    { key: 'delivery', label: 'Delivery', ok: false, detail: 'No activado', version: 'v0.8.1', sync: 'Nunca', errors: 0, icon: ShoppingBag },
    { key: 'impresoras', label: 'Impresoras', ok: false, detail: 'Sin impresoras enlazadas', version: 'v1.2.0', sync: 'Nunca', errors: 1, icon: Printer },
    { key: 'multilocal', label: 'Multi sucursal', ok: false, detail: 'Plan Enterprise requerido', version: 'v1.0.0', sync: 'Nunca', errors: 0, icon: Building },
  ]
}

function buildSystemLogs() {
  const now = new Date()
  return [
    { level: 'info', time: formatLogTime(now, 1), message: 'Deploy v2.4.1 completado · 0 errores · uptime 99.98%' },
    { level: 'warn', time: formatLogTime(now, 4), message: 'Impresora offline: restaurante ID #3 · reintentando conexión' },
    { level: 'info', time: formatLogTime(now, 7), message: 'Backup automático completado · 38 GB guardados en S3' },
    { level: 'error', time: formatLogTime(now, 12), message: 'SMTP timeout al enviar factura a contacto@bellavista.cl' },
    { level: 'warn', time: formatLogTime(now, 20), message: 'Uso de RAM al 78% · umbral de alerta superado' },
    { level: 'info', time: formatLogTime(now, 35), message: 'Nueva org registrada: slug=test-local · plan=Básico' },
    { level: 'info', time: formatLogTime(now, 55), message: 'WebSocket reconnected · 14 clientes activos' },
    { level: 'error', time: formatLogTime(now, 90), message: 'DB query timeout 4200ms · tabla orders · retry OK' },
  ]
}

function buildAdminLogs() {
  return [
    { user: 'Diego SA', action: 'Impersonar', resource: 'Bella Vista', ip: '190.41.22.8', date: 'Hoy 21:32', status: 'ok' },
    { user: 'Diego SA', action: 'Cambiar plan', resource: 'La Pergola', ip: '190.41.22.8', date: 'Hoy 20:15', status: 'ok' },
    { user: 'Soporte', action: 'Ver logs', resource: 'Sistema', ip: '200.111.8.42', date: 'Hoy 19:48', status: 'ok' },
    { user: 'Diego SA', action: 'Crear org', resource: 'Rest. Nuevo', ip: '190.41.22.8', date: 'Hoy 18:22', status: 'ok' },
    { user: 'Soporte', action: 'Reset pass', resource: 'Mesa 12 QR', ip: '200.111.8.42', date: 'Hoy 17:05', status: 'ok' },
    { user: 'Diego SA', action: 'Suspender', resource: 'Local Prueba', ip: '190.41.22.8', date: 'Ayer 22:10', status: 'ok' },
  ]
}

// ── Nuevos componentes UI de los nuevos tabs ──

function TicketCard({ ticket, onEnter }) {
  const priorityConfig = {
    'crítica': { bg: 'border-rose-300 bg-rose-50/60', badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500 animate-pulse' },
    'alta':    { bg: 'border-orange-200 bg-orange-50/40', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
    'media':   { bg: 'border-amber-200 bg-amber-50/40', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
    'baja':    { bg: 'border-slate-200 bg-slate-50/60', badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  }
  const cfg = priorityConfig[ticket.priority] || priorityConfig['baja']
  return (
    <div className={`rounded-2xl border p-4 transition ${cfg.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${cfg.dot}`} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-black text-slate-950">{ticket.title}</p>
              <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-black ${cfg.badge}`}>{ticket.priority.toUpperCase()}</span>
            </div>
            <p className="mt-1 text-xs font-bold text-slate-500">{ticket.restaurant} · {ticket.category}</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="font-bold">⏱ {ticket.openedAt}</span>
              <span>Resp: {ticket.lastReply}</span>
              <span className={`font-black ${ticket.sla === 'Vencido' ? 'text-rose-600' : 'text-emerald-600'}`}>SLA: {ticket.sla}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[0.65rem] font-black text-slate-500">{ticket.id}</span>
          <button onClick={onEnter} className="rounded-xl bg-slate-950 px-2.5 py-1.5 text-xs font-black text-white hover:bg-slate-800 transition">
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}

function ModuleToggleCard({ mod }) {
  const [enabled, setEnabled] = useState(mod.ok)
  return (
    <div className={`rounded-2xl border p-4 transition ${
      enabled ? 'border-emerald-100 bg-emerald-50/40' : 'border-slate-200 bg-slate-50'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
            enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'
          }`}>
            <mod.icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-slate-950">{mod.label}</p>
            <p className="text-xs font-bold text-slate-500">{mod.detail}</p>
          </div>
        </div>
        {/* Toggle switch */}
        <button
          type="button"
          onClick={() => setEnabled(e => !e)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
            enabled ? 'bg-emerald-500' : 'bg-slate-200'
          }`}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-slate-100/80 pt-3">
        <span className="text-[0.65rem] font-bold text-slate-400">{mod.version}</span>
        <span className="text-[0.65rem] font-bold text-slate-400">· sync {mod.sync}</span>
        {mod.errors > 0 && (
          <span className="ml-auto rounded-full bg-rose-100 px-2 py-0.5 text-[0.6rem] font-black text-rose-700">{mod.errors} error{mod.errors > 1 ? 'es' : ''}</span>
        )}
        {mod.errors === 0 && enabled && (
          <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6rem] font-black text-emerald-700">OK</span>
        )}
      </div>
    </div>
  )
}

/* eslint-disable no-unused-vars */
function SuperadminDashboard() {
  const { state, organizations, saveOrganization, removeOrganization, impersonateTenant, logout, currentOrganizationId } = useAppStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('resumen')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState(null)

  // Form states
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formPlan, setFormPlan] = useState('Básico')
  const [formStatus, setFormStatus] = useState('Activo')
  const [formRut, setFormRut] = useState('')
  const [formMrr, setFormMrr] = useState(0)

  const handleStartEdit = (org) => {
    setSelectedOrg(org)
    setFormName(org.name)
    setFormSlug(org.slug)
    setFormPlan(org.plan)
    setFormStatus(org.status)
    setFormRut(org.rut || '')
    setFormMrr(org.mrr || 0)
    setShowEditModal(true)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!formName || !formSlug) return
    await saveOrganization({
      id: selectedOrg.id,
      name: formName,
      slug: formSlug,
      plan: formPlan,
      status: formStatus,
      rut: formRut,
      mrr: Number(formMrr),
    })
    setShowEditModal(false)
    setSelectedOrg(null)
  }

  const handleCreateOrg = async (e) => {
    e.preventDefault()
    if (!formName || !formSlug) return
    await saveOrganization({
      name: formName,
      slug: formSlug,
      plan: formPlan,
      status: formStatus,
      rut: formRut,
      mrr: Number(formMrr),
    })
    setShowAddModal(false)
    setFormName('')
    setFormSlug('')
    setFormPlan('Básico')
    setFormStatus('Activo')
    setFormRut('')
    setFormMrr(0)
  }

  const handleDeleteOrg = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta empresa del sistema? Todo su contenido será eliminado permanentemente.')) {
      await removeOrganization(id)
    }
  }

  const handleImpersonate = (org) => {
    impersonateTenant(org.id)
    navigate('/admin')
  }

  const activeOrgs = organizations.filter((o) => o.status === 'Activo')
  const totalMrr = organizations.reduce((acc, curr) => acc + (curr.mrr || 0), 0)
  const planDistribution = {
    Básico: organizations.filter(o => o.plan === 'Básico').length,
    Empresa: organizations.filter(o => o.plan === 'Empresa').length,
    'Venta Única': organizations.filter(o => o.plan === 'Venta Única').length,
  }

  const filteredOrgs = organizations.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.rut && o.rut.includes(searchQuery)),
  )

  // Auto-select first tenant if none is selected on mount
  useEffect(() => {
    if (!currentOrganizationId && organizations.length > 0) {
      const firstOrg = organizations.find((o) => o.slug !== 'empresa-jefe' && o.slug !== 'ncxo-plus' && o.slug !== 'prueba-de-cambio')
      if (firstOrg) {
        impersonateTenant(firstOrg.id)
      }
    }
  }, [organizations, currentOrganizationId, impersonateTenant])

  // Restaurant details from the state loaded (currentOrganizationId)
  const income = state.orders.reduce((sum, order) => sum + order.total, 0)
  const activeOrders = state.orders.filter((order) =>
    ['Pendiente', 'En preparación', 'Listo'].includes(order.status)
  ).length
  const pendingOrders = state.orders.filter((order) => order.status === 'Pendiente').length
  const readyOrders = state.orders.filter((order) => order.status === 'Listo').length
  
  const chartData = buildSalesChartData(state.orders)
  const topProducts = getTopProducts(state.orders).slice(0, 5)
  const recentActivity = state.orders.slice(0, 6)
  const lowStockProducts = (state.products || []).filter(p => p.stock !== undefined && p.stock <= (p.minStock || 5))

  const categorySales = useMemo(() => {
    const map = new Map()
    state.orders.forEach(o => {
      o.items.forEach(item => {
        const prod = state.products.find(p => p.name === item.name || p.id === item.id)
        const cat = prod?.category || 'General'
        const currentVal = map.get(cat) || 0
        map.set(cat, currentVal + (item.price * item.quantity))
      })
    })
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [state.orders, state.products])

  const formattedDate = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' }
    return new Date().toLocaleDateString('es-CL', options)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xl shadow shadow-indigo-600/35">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">SaaS Portal</h1>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[0.65rem] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                En vivo
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium capitalize mt-0.5">
              {formattedDate()} · <span className="text-indigo-600 font-semibold">Empresa de Jefe</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Building className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <select
              value={currentOrganizationId}
              onChange={(e) => impersonateTenant(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-8 text-xs font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todas las Sucursales</option>
              {organizations.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="flex items-center gap-2">
            <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 border border-white" />
              <Activity size={16} />
            </button>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-white font-bold text-sm shadow">
                D
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">Diegol Admin</p>
                <p className="text-[0.65rem] font-medium text-slate-400 mt-1">Superadmin</p>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="ml-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex border-b border-slate-200 gap-6 mb-8 overflow-x-auto pb-px">
          {[
            ['resumen', 'Resumen'],
            ['empresas', 'Empresas'],
            ['finanzas', 'Finanzas'],
            ['pagos', 'Pagos MP'],
            ['tickets', 'Tickets'],
            ['invitaciones', 'Invitaciones'],
            ['legales', 'Legales'],
            ['sistemas', 'Sistemas en Venta'],
          ].map(([id, label]) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative pb-3 text-sm font-semibold transition ${
                  active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {label}
                {active && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-indigo-600" />
                )}
              </button>
            )
          })}
        </div>

        {activeTab === 'resumen' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards at top right */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm">
                <DollarSign className="h-4 w-4 text-teal-600" />
                <div>
                  <p className="text-[0.62rem] text-slate-400 uppercase leading-none">VENTAS DE HOY</p>
                  <p className="text-xs font-black text-slate-800 mt-1">{currency.format(income)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm">
                <ClipboardList className="h-4 w-4 text-indigo-500" />
                <div>
                  <p className="text-[0.62rem] text-slate-400 uppercase leading-none">TRANSACCIONES</p>
                  <p className="text-xs font-black text-slate-800 mt-1">{state.orders.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm">
                <Users className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-[0.62rem] text-slate-400 uppercase leading-none">CLIENTES TOTALES</p>
                  <p className="text-xs font-black text-slate-800 mt-1">{Math.max(0, state.orders.filter(o => o.customerName).length)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm">
                <Clock3 className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-[0.62rem] text-slate-400 uppercase leading-none">CITAS DE HOY</p>
                  <p className="text-xs font-black text-slate-800 mt-1">{pendingOrders}</p>
                </div>
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Ventas de la Semana Chart */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-slate-900">Ventas de la Semana</h3>
                    <p className="text-[0.7rem] font-bold text-teal-600 uppercase mt-0.5">Comparación con meta diaria</p>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData.sales}>
                        <defs>
                          <linearGradient id="salesWeeklyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0.01} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                        <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                        <Tooltip formatter={(value) => currency.format(value)} />
                        <Area
                          type="monotone"
                          dataKey="ventas"
                          stroke="#0d9488"
                          strokeWidth={2}
                          fill="url(#salesWeeklyGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Ingresos vs Gastos Chart */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-slate-900">Ingresos vs Gastos</h3>
                    <p className="text-[0.7rem] font-bold text-teal-600 uppercase mt-0.5">Últimos 3 meses</p>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { mes: 'Marzo', Ingresos: income * 0.8, Gastos: income * 0.5 },
                        { mes: 'Abril', Ingresos: income * 0.95, Gastos: income * 0.6 },
                        { mes: 'Mayo', Ingresos: income, Gastos: income * 0.55 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="mes" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                        <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                        <Tooltip formatter={(value) => currency.format(value)} />
                        <Bar dataKey="Ingresos" fill="#0d9488" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Ventas Recientes */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-slate-900">Ventas Recientes</h3>
                    <p className="text-[0.7rem] font-bold text-teal-600 uppercase mt-0.5">Últimas transacciones realizadas</p>
                  </div>
                  <div className="overflow-y-auto space-y-2 pr-1 max-h-[220px]">
                    {state.orders.length > 0 ? (
                      state.orders.slice(0, 5).map(o => (
                        <div key={o.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition">
                          <div>
                            <span className="text-xs font-bold text-slate-800">Pedido #{o.number}</span>
                            <p className="text-[10px] text-slate-400">{o.tableLabel} · {formatTime(o.createdAt)}</p>
                          </div>
                          <span className="text-xs font-extrabold text-slate-800">
                            {currency.format(o.total)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4">
                        <span className="text-xs font-bold text-slate-400">No hay ventas registradas aún</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Ingresos por Categoría */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-slate-900">Ingresos por Categoría</h3>
                    <p className="text-[0.7rem] font-bold text-teal-600 uppercase mt-0.5">Distribución actual</p>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
                    {categorySales.length > 0 ? (
                      <>
                        <div className="w-full h-[120px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categorySales}
                                innerRadius={35}
                                outerRadius={50}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {categorySales.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={['#0d9488', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6'][index % 5]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => currency.format(value)} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-full space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                          {categorySales.map((entry, index) => (
                            <div key={entry.name} className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: ['#0d9488', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6'][index % 5] }} />
                                <span className="font-semibold text-slate-600 truncate">{entry.name}</span>
                              </div>
                              <span className="font-bold text-slate-900">{currency.format(entry.value)}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4 py-4 w-full">
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-8 border-slate-100 bg-slate-50">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Sin datos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400">Sin datos</span>
                          <span className="text-[10px] font-bold text-slate-400 ml-4">0%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alertas de Stock */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-slate-900">Alertas de Stock</h3>
                    <p className="text-[0.7rem] font-bold text-teal-600 uppercase mt-0.5">Productos por debajo del mínimo</p>
                  </div>
                  <div className="overflow-y-auto space-y-2 pr-1 max-h-[200px]">
                    {lowStockProducts.length > 0 ? (
                      lowStockProducts.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-800 block truncate">{p.name}</span>
                            <p className="text-[9px] text-slate-400">Mínimo: {p.minStock || 5}</p>
                          </div>
                          <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full flex-shrink-0">
                            Stock: {p.stock}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-6">
                        <CheckCircle2 className="h-7 w-7 text-emerald-500 mb-1.5" />
                        <span className="text-xs font-bold text-slate-400">Todos los productos tienen stock suficiente</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Citas de Hoy */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-slate-900">Citas de Hoy</h3>
                    <p className="text-[0.7rem] font-bold text-teal-600 uppercase mt-0.5">Agenda del día / Pedidos activos</p>
                  </div>
                  <div className="overflow-y-auto space-y-2 pr-1 max-h-[200px]">
                    {state.orders.filter(o => ['Pendiente', 'En preparación'].includes(o.status)).length > 0 ? (
                      state.orders.filter(o => ['Pendiente', 'En preparación'].includes(o.status)).slice(0, 5).map(o => (
                        <div key={o.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-800 block truncate font-black">Pedido #{o.number} ({o.tableLabel})</span>
                            <p className="text-[9px] text-slate-450 text-slate-400 truncate">{o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                          </div>
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 flex-shrink-0">
                            {o.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-6">
                        <span className="text-xs font-bold text-slate-400">No hay citas programadas para hoy</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'empresas' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, slug, RUT..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow"
              >
                <Plus size={14} />
                Agregar Nueva Empresa
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredOrgs.map((org) => (
                <div key={org.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition relative flex flex-col justify-between h-48">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold grid place-items-center uppercase">
                          {org.name.slice(0, 1)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{org.name}</h3>
                          <p className="text-[0.68rem] text-slate-400">slug: {org.slug}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[0.62rem] font-bold uppercase ${
                        org.plan === 'Venta Única' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        org.plan === 'Empresa' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {org.plan}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-[0.7rem] text-slate-500 border-t border-slate-100 pt-3">
                      <div>RUT: <span className="font-bold text-slate-700">{org.rut || '—'}</span></div>
                      <div>MRR: <span className="font-bold text-slate-700">{currency.format(org.mrr || 0)}</span></div>
                      <div>Estado: <span className="font-bold text-emerald-600">{org.status}</span></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                    <button
                      onClick={() => handleImpersonate(org)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[0.68rem] font-bold px-3 py-1.5 rounded-lg transition border border-indigo-200 flex items-center gap-1"
                    >
                      <LogIn size={12} />
                      Simular Entrada
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(org)}
                        className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-slate-50 rounded"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteOrg(org.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-slate-50 rounded"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'finanzas' && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm animate-fadeIn">
            <Coins size={48} className="mx-auto text-indigo-500 mb-4" />
            <h2 className="text-lg font-bold text-slate-900">Resumen y Proyecciones Financieras</h2>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Realiza el seguimiento del MRR (Ingreso Mensual Recurrente), flujo de caja de suscripciones y transacciones de pasarela. Los gráficos de rendimiento y distribución se habilitarán en la siguiente versión productiva.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[0.62rem] font-bold text-slate-400">ESTIMADO ANUAL</p>
                <p className="text-base font-black text-slate-800 mt-1">{currency.format(totalMrr * 12)}</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[0.62rem] font-bold text-slate-400">COBRO PROMEDIO</p>
                <p className="text-base font-black text-slate-800 mt-1">{currency.format(organizations.length ? Math.round(totalMrr / organizations.length) : 0)}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sistemas' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto mb-8">
              <Sparkles size={32} className="mx-auto text-indigo-500 mb-3" />
              <h2 className="text-lg font-black text-slate-900">Catálogo de Sistemas y Productos SaaS</h2>
              <p className="text-xs text-slate-500 mt-1">
                Explora el ecosistema de aplicaciones que vendemos y gestionamos de forma centralizada.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">Nexo+</h3>
                      <p className="text-[0.65rem] font-semibold text-indigo-600">Administración Comercial & Ventas</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Gestión integral de ventas, control de inventario en tiempo real, facturación electrónica para comercios locales e independientes. Optimiza bodegas y cajas rápidas en segundos.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {['Boleta Electrónica', 'Control Stock', 'Reportes Ventas'].map(b => (
                      <span key={b} className="bg-slate-50 text-slate-600 text-[0.62rem] font-bold px-2 py-0.5 rounded border border-slate-200">{b}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[0.62rem] font-bold text-slate-400">PLAN BASE</p>
                    <p className="text-base font-black text-slate-800">$19.990 <span className="text-[0.62rem] text-slate-400 font-medium">/ mes</span></p>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition">
                    Entrar al Sistema
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <ChefHat size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">AppRestaurante</h3>
                      <p className="text-[0.65rem] font-semibold text-emerald-600">Gestión Gastronómica Integral</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Control absoluto de mesas, comandas digitales para garzones, visualización interactiva de pedidos mediante códigos QR en mesa, analíticas y panel KDS para agilizar la cocina.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {['Comandas QR', 'Mesas Interactivas', 'Panel KDS Cocina'].map(b => (
                      <span key={b} className="bg-slate-50 text-slate-600 text-[0.62rem] font-bold px-2 py-0.5 rounded border border-slate-200">{b}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[0.62rem] font-bold text-slate-400">PLAN BASE</p>
                    <p className="text-base font-black text-slate-800">$34.990 <span className="text-[0.62rem] text-slate-400 font-medium">/ mes</span></p>
                  </div>
                  <button
                    onClick={() => {
                      const defaultRest = organizations.find(o => o.slug === 'guaton-xii') || organizations[0]
                      if (defaultRest) handleImpersonate(defaultRest)
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition"
                  >
                    Entrar al Sistema
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'tickets' || activeTab === 'invitaciones' || activeTab === 'legales') && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm animate-fadeIn">
            <Building size={36} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-sm font-bold text-slate-800 capitalize">Sección de {activeTab}</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Este apartado está reservado para la administración avanzada del portal. Puedes gestionar los tickets de soporte, las invitaciones de registro para nuevos restaurantes y la documentación legal en las próximas actualizaciones.
            </p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Registrar Nueva Empresa</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateOrg} className="space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block text-slate-500 mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  required
                  placeholder="Restaurante Ejemplo"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value)
                    setFormSlug(e.target.value.toLowerCase().replaceAll(' ', '-').replace(/[^\w-]/g, ''))
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Identificador Slug (URL)</label>
                <input
                  type="text"
                  required
                  placeholder="restaurante-ejemplo"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">RUT Empresa</label>
                  <input
                    type="text"
                    placeholder="76.123.456-7"
                    value={formRut}
                    onChange={(e) => setFormRut(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">MRR Mensual (CLP)</label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={formMrr}
                    onChange={(e) => setFormMrr(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Plan Contratado</label>
                  <select
                    value={formPlan}
                    onChange={(e) => setFormPlan(e.target.value)}
                    className="w-full h-10 px-2 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 text-xs font-semibold"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Empresa">Empresa</option>
                    <option value="Venta Única">Venta Única</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Estado de Cuenta</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full h-10 px-2 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 text-xs font-semibold"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition mt-4 shadow"
              >
                Crear Registro
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Editar Empresa</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block text-slate-500 mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Identificador Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">RUT Empresa</label>
                  <input
                    type="text"
                    value={formRut}
                    onChange={(e) => setFormRut(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">MRR Mensual (CLP)</label>
                  <input
                    type="number"
                    value={formMrr}
                    onChange={(e) => setFormMrr(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Plan Contratado</label>
                  <select
                    value={formPlan}
                    onChange={(e) => setFormPlan(e.target.value)}
                    className="w-full h-10 px-2 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 text-xs font-semibold"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Empresa">Empresa</option>
                    <option value="Venta Única">Venta Única</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Estado de Cuenta</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full h-10 px-2 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 text-xs font-semibold"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition mt-4 shadow"
              >
                Guardar Cambios
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
/* eslint-enable no-unused-vars */

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
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-3">
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
