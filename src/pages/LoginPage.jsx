import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Building,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Ticket,
  X,
} from 'lucide-react'
import { useAppStore } from '../store/AppStore.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'

// Marca minimalista: plato en línea fina con destello (line-art)
export function BrandMark({ className = 'h-12 w-12 text-[#c2553d]' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="22" />
      <circle cx="32" cy="32" r="13" opacity="0.45" />
      <path d="M10 14v10c0 2.8 4 2.8 4 0V14" opacity="0.8" />
      <path d="M12 24v10" opacity="0.8" />
      <path d="M54 14c-3 1.5-4 5-4 9v11" opacity="0.8" />
      <path d="M49 50l1.6 3.4L54 55l-3.4 1.6L49 60l-1.6-3.4L44 55l3.4-1.6z" fill="currentColor" stroke="none" opacity="0.9" />
    </svg>
  )
}

// Ilustración decorativa de fondo: trazos de mesa servida, muy sutil
function TableLinesArt({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 420 420" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <ellipse cx="210" cy="240" rx="170" ry="64" opacity="0.35" />
      <ellipse cx="210" cy="228" rx="120" ry="42" opacity="0.5" />
      <ellipse cx="210" cy="222" rx="64" ry="22" opacity="0.7" />
      <path d="M150 150c10-22 36-36 60-36s50 14 60 36" opacity="0.6" />
      <path d="M210 102v-16" opacity="0.6" />
      <circle cx="210" cy="80" r="5" opacity="0.6" />
      <path d="M64 210c-10 6-16 14-16 24" opacity="0.4" />
      <path d="M356 210c10 6 16 14 16 24" opacity="0.4" />
    </svg>
  )
}

export function LoginPage({ initialMode = 'email' }) {
  const { login, currentUser, organizations, switchOrganization, currentOrganizationId, registerRestaurant, remoteMode } = useAppStore()
  const navigate = useNavigate()
  const [loginMode] = useState(initialMode) // 'email' | 'pin'
  const [pin, setPin] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef(null)

  usePageTitle(loginMode === 'pin' ? 'Acceso del equipo' : 'Iniciar sesión')

  // Deep-link opcional: ?org=slug fija la sucursal (p. ej. desde un QR del local).
  // El acceso por PIN igualmente requiere que la empresa tenga sesión iniciada.
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

  // Registro de empresa (requiere código de invitación del proveedor)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [regInviteCode, setRegInviteCode] = useState('')
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

  const failFeedback = (message) => {
    setError(message)
    setShake(true)
    setTimeout(() => {
      setShake(false)
      if (loginMode === 'pin') setPin('')
    }, 600)
  }

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
          failFeedback('PIN incorrecto o usuario inactivo')
        }
      } catch (err) {
        failFeedback(err.message || 'Error al iniciar sesión')
      }
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) return setError('Ingresa tu correo electrónico')
    if (!password) return setError('Ingresa tu contraseña')

    try {
      const user = await login(email, password)
      if (user) {
        navigate(user.role === 'superadmin' ? '/superadmin' : '/admin', { replace: true })
      } else {
        failFeedback('Credenciales incorrectas o usuario inactivo')
      }
    } catch (err) {
      failFeedback(err.message || 'Error al iniciar sesión')
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setRegError('')
    if (!regInviteCode.trim()) {
      setRegError('Ingresa el código de invitación que te entregó tu proveedor.')
      return
    }
    if (!regCompanyName || !regAdminName || !regEmail || !regPassword) {
      setRegError('Completa todos los campos')
      return
    }
    setRegLoading(true)
    try {
      await registerRestaurant(regCompanyName, regAdminName, regEmail, regPassword, regInviteCode.trim())
      setRegSuccess(true)
      setTimeout(() => {
        setShowRegisterModal(false)
        setRegSuccess(false)
        setRegInviteCode('')
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
    <div className="glass-page relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 font-sans text-stone-900">
      {/* Blobs ambientales */}
      <div className="glass-blob h-[420px] w-[420px] bg-[#c2553d]/30" style={{ top: '-12%', left: '-8%' }} />
      <div className="glass-blob h-[360px] w-[360px] bg-[#d99641]/30" style={{ bottom: '-14%', right: '-6%', animationDelay: '-7s' }} />
      <TableLinesArt className="pointer-events-none absolute -right-24 top-1/2 hidden w-[460px] -translate-y-1/2 text-[#9a3f2c]/15 lg:block" />
      <TableLinesArt className="pointer-events-none absolute -left-36 bottom-[-120px] hidden w-[420px] rotate-12 text-[#c2553d]/10 md:block" />

      <div className="relative z-10 w-full max-w-[26rem]">
        {/* Marca */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="glass-soft grid h-20 w-20 place-items-center rounded-[1.6rem]">
            <BrandMark className="h-11 w-11 text-[#c2553d]" />
          </div>
          <h1 className="mt-5 text-[1.9rem] leading-none text-stone-900" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.02em' }}>
            {loginMode === 'email' ? 'Bienvenido de vuelta' : 'Acceso del equipo'}
          </h1>
          <p className="mt-2 max-w-xs text-sm font-medium text-stone-500">
            {loginMode === 'email'
              ? 'Ingresa con las credenciales de tu empresa para gestionar tu restaurante.'
              : 'Marca tu PIN de 4 dígitos para comenzar tu turno.'}
          </p>
          {!remoteMode && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-300/70 bg-amber-50/80 px-3 py-1.5 text-[0.68rem] font-bold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Modo demo local — los datos se guardan solo en este navegador
            </div>
          )}
        </div>

        {/* Tarjeta principal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="glass-card p-7"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-xl border border-rose-200/70 bg-rose-50/80 p-3 text-center text-xs font-bold text-rose-600"
            >
              {error}
            </motion.div>
          )}

          {loginMode === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-stone-500">Correo electrónico</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder="hola@turestaurante.cl"
                    className="glass-input h-12 pl-11 text-sm font-semibold"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-stone-500">Contraseña</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                    placeholder="••••••••"
                    className="glass-input h-12 pl-11 pr-12 text-sm font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-600"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c2553d] text-sm font-bold text-white shadow-lg shadow-[#c2553d]/25 transition hover:bg-[#9a3f2c]"
              >
                Iniciar sesión
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            </form>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              {activeOrg ? (
                <>
                  <div className="glass-soft flex items-center justify-between gap-3 rounded-xl px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Building className="h-4 w-4 shrink-0 text-[#c2553d]" />
                      <span className="truncate text-sm font-bold text-stone-800">{activeOrg.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="shrink-0 text-xs font-bold text-[#9a3f2c] transition hover:underline"
                    >
                      Cambiar
                    </button>
                  </div>

                  <motion.div animate={shake ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}} transition={{ duration: 0.4 }}>
                    <input
                      ref={inputRef}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => handlePinChange(e.target.value)}
                      placeholder="• • • •"
                      autoFocus
                      className="glass-input h-16 text-center text-3xl font-black tracking-[0.6em] placeholder:text-xl placeholder:tracking-[0.3em]"
                      aria-label="PIN de acceso de 4 dígitos"
                    />
                  </motion.div>

                  <div className="flex items-center justify-center gap-3">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-2.5 w-2.5 rounded-full transition-all ${
                          pin.length > i ? 'scale-110 bg-[#c2553d]' : 'bg-stone-300/70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                /* Sin empresa activa en este dispositivo: el administrador debe
                   iniciar sesión primero para habilitar el acceso por PIN. */
                <div className="space-y-4 text-center">
                  <div className="glass-soft mx-auto grid h-14 w-14 place-items-center rounded-2xl text-[#c2553d]">
                    <Building size={22} />
                  </div>
                  <p className="text-sm font-semibold text-stone-600">
                    Este dispositivo aún no tiene una empresa activa. El administrador debe iniciar sesión primero para habilitar el acceso por PIN.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="h-12 w-full rounded-xl bg-stone-900 text-sm font-bold text-white transition hover:bg-stone-800"
                  >
                    Iniciar sesión de empresa
                  </button>
                </div>
              )}
            </form>
          )}
        </motion.div>

        {/* Acciones secundarias */}
        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          {loginMode === 'email' ? (
            <>
              <button
                type="button"
                onClick={() => navigate('/pin')}
                className="glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-stone-600 transition hover:text-stone-900"
              >
                <KeyRound size={13} className="text-[#c2553d]" />
                Soy del equipo, entrar con PIN
              </button>
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9a3f2c] transition hover:underline"
              >
                <Ticket size={13} />
                Tengo un código de invitación · Registrar mi restaurante
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-stone-600 transition hover:text-stone-900"
            >
              <Mail size={13} className="text-[#c2553d]" />
              Entrar con correo de empresa
            </button>
          )}
        </div>

        <p className="mt-8 text-center text-[0.7rem] font-medium text-stone-400">
          Desarrollado por <span className="font-bold text-[#9a3f2c]">AcroDevs</span> · Sistema de gestión para restaurantes
        </p>
      </div>

      {/* Modal: registrar empresa con código de invitación */}
      <AnimatePresence>
        {showRegisterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              className="glass-strong relative w-full max-w-md p-7"
            >
              <button
                onClick={() => setShowRegisterModal(false)}
                className="absolute right-5 top-5 text-stone-400 transition hover:text-stone-600"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>

              <div className="mb-5">
                <div className="glass-soft mb-4 grid h-12 w-12 place-items-center rounded-2xl text-[#c2553d]">
                  <Ticket size={20} />
                </div>
                <h3 className="text-xl text-stone-900" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                  Registrar mi restaurante
                </h3>
                <p className="mt-1 text-xs font-semibold text-stone-500">
                  Necesitas un código de invitación entregado por tu proveedor para crear la cuenta.
                </p>
                {!remoteMode && (
                  <p className="mt-2 rounded-xl border border-amber-300/70 bg-amber-50/80 p-2.5 text-[0.68rem] font-bold text-amber-700">
                    ⚠ Estás en modo demo local: esta cuenta NO se guardará en el servidor, solo en este navegador.
                  </p>
                )}
              </div>

              {regError && (
                <div className="mb-4 rounded-xl border border-rose-200/70 bg-rose-50/80 p-3 text-xs font-bold text-rose-600">
                  {regError}
                </div>
              )}

              {regSuccess && (
                <div className="mb-4 rounded-xl border border-emerald-200/70 bg-emerald-50/80 p-3 text-center text-xs font-bold text-emerald-700">
                  🎉 ¡Empresa registrada con éxito! Puedes iniciar sesión ahora.
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <label className="block">
                  <span className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.12em] text-stone-500">Código de invitación</span>
                  <input
                    type="text"
                    required
                    value={regInviteCode}
                    onChange={(e) => setRegInviteCode(e.target.value.toUpperCase())}
                    placeholder="ACRO-XXXX-XXXX"
                    className="glass-input h-11 text-center font-mono text-sm font-bold uppercase tracking-[0.18em]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.12em] text-stone-500">Nombre del restaurante</span>
                  <input
                    type="text"
                    required
                    value={regCompanyName}
                    onChange={(e) => setRegCompanyName(e.target.value)}
                    placeholder="Ej. La Parrilla del Puerto"
                    className="glass-input h-11 text-sm font-semibold"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.12em] text-stone-500">Nombre del administrador</span>
                  <input
                    type="text"
                    required
                    value={regAdminName}
                    onChange={(e) => setRegAdminName(e.target.value)}
                    placeholder="Ej. Diego Henríquez"
                    className="glass-input h-11 text-sm font-semibold"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.12em] text-stone-500">Correo electrónico</span>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="glass-input h-11 text-sm font-semibold"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.12em] text-stone-500">Contraseña</span>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="glass-input h-11 text-sm font-semibold"
                  />
                </label>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="h-11 rounded-xl px-4 text-sm font-bold text-stone-500 transition hover:bg-stone-100/60"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={regLoading || regSuccess}
                    className="flex h-11 items-center justify-center rounded-xl bg-[#c2553d] px-6 text-sm font-bold text-white shadow-lg shadow-[#c2553d]/25 transition hover:bg-[#9a3f2c] disabled:opacity-50"
                  >
                    {regLoading ? 'Registrando…' : 'Crear cuenta'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
