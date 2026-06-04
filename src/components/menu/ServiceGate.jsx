import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Bike, MapPin, Phone, QrCode, User } from 'lucide-react'
import { formatTableName } from '../../lib/format.js'

// Pantalla de bienvenida: el cliente elige cómo pedir (mesa o domicilio)
// antes de ver el menú.
export function ServiceGate({ restaurant, mesaId, onChoose }) {
  const [view, setView] = useState('choices') // 'choices' | 'delivery'
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const tableName = formatTableName(mesaId)

  const submitDelivery = (e) => {
    e.preventDefault()
    if (!address.trim() || !phone.trim()) return
    onChoose('domicilio', { address: address.trim(), phone: phone.trim(), name: name.trim() })
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-900 text-cream">
      {/* Capas cálidas (mismo lenguaje que el header del menú) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 8%, rgba(194,85,61,0.45), transparent 42%), radial-gradient(circle at 88% 4%, rgba(217,150,65,0.35), transparent 46%), linear-gradient(180deg, #241d18 0%, #2a221c 60%, #1f1813 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.35em] text-gold-300">
            <span className="h-px w-8 bg-gold-300/60" /> Bienvenido
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            {restaurant.name}
          </h1>
          <p className="mt-3 text-base text-cream/70">¿Cómo quieres pedir hoy?</p>
        </motion.div>

        {view === 'choices' ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <OptionCard
              icon={QrCode}
              title="Escoger mesa"
              subtitle={`Estás en ${tableName}`}
              hint="Pides desde tu mesa"
              onClick={() => onChoose('mesa')}
            />
            <OptionCard
              icon={Bike}
              title="Pedir a domicilio"
              subtitle="Te lo llevamos"
              hint="Ingresa tu dirección"
              onClick={() => setView('delivery')}
            />
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={submitDelivery}
            className="rounded-[1.6rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur"
          >
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-gold-300">
              Datos de entrega
            </p>
            <div className="mt-4 space-y-3">
              <Field icon={MapPin} value={address} onChange={setAddress} placeholder="Dirección de entrega" required />
              <Field icon={Phone} value={phone} onChange={setPhone} placeholder="Teléfono de contacto" type="tel" required />
              <Field icon={User} value={name} onChange={setName} placeholder="Tu nombre (opcional)" />
            </div>
            <button
              type="submit"
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-bold text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.98]"
            >
              Continuar al menú <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView('choices')}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-cream/60 transition hover:text-cream"
            >
              <ArrowLeft className="h-4 w-4" /> Volver
            </button>
          </motion.form>
        )}
      </div>
    </main>
  )
}

function OptionCard({ icon: Icon, title, subtitle, hint, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group flex flex-col items-start gap-4 rounded-[1.6rem] border border-white/10 bg-white/[0.06] p-6 text-left backdrop-blur transition hover:border-gold-300/40 hover:bg-white/[0.1]"
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/90 text-cream shadow-glow transition group-hover:bg-brand-500">
        <Icon className="h-7 w-7" />
      </span>
      <div>
        <h2 className="font-display text-xl font-semibold text-cream">{title}</h2>
        <p className="mt-1 text-sm text-cream/65">{subtitle}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
        {hint} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </motion.button>
  )
}

function Field({ icon: Icon, value, onChange, placeholder, type = 'text', required = false }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-4 text-sm font-medium text-cream outline-none transition placeholder:text-cream/40 focus:border-gold-300/50 focus:bg-white/10"
      />
    </div>
  )
}
