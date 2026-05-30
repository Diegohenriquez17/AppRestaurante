import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { formatTableName } from '../../lib/format.js'

export function MenuHeader({ restaurant, mesaId }) {
  return (
    <header className="relative overflow-hidden bg-brand-900 text-cream">
      {/* Capa de gradiente cálido */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 10%, rgba(194,85,61,0.45), transparent 40%), radial-gradient(circle at 90% 0%, rgba(217,150,65,0.35), transparent 45%), linear-gradient(180deg, #241d18 0%, #2a221c 60%, #1f1813 100%)',
        }}
      />
      {/* Grano sutil */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Marca de agua gigante detrás */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-display text-[10rem] font-semibold leading-none text-white/[0.04] sm:text-[16rem]"
      >
        Carta
      </span>

      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-10 lg:px-10 lg:pb-16 lg:pt-14">
        {/* eyebrow + meta */}
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.35em] text-gold-300">
            <span className="h-px w-8 bg-gold-300/60" />
            La Carta
          </span>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Abierto · 15–20 min
          </div>
        </div>

        {/* Nombre gigante */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-4xl font-display text-[3rem] font-semibold leading-[0.95] tracking-tight sm:text-[5rem] lg:text-[6rem]"
        >
          {restaurant.name}
        </motion.h1>

        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          <p className="max-w-md text-base leading-relaxed text-cream/70">
            Pide desde tu mesa. Cada plato va directo a cocina, recién hecho.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Meta label="Mesa" value={formatTableName(mesaId).replace('Mesa ', '')} />
            <span className="h-8 w-px bg-white/10" />
            <Meta label="Servicio" value="En sala" />
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="mt-10 flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-cream/40">
          <ChevronDown className="h-4 w-4 animate-bounce" />
          Desliza para ver la carta
        </div>
      </div>
    </header>
  )
}

function Meta({ label, value }) {
  return (
    <div className="leading-tight">
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-cream/40">{label}</p>
      <p className="mt-0.5 font-display text-xl font-semibold text-cream">{value}</p>
    </div>
  )
}
