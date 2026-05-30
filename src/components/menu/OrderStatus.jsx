import { motion } from 'framer-motion'
import { CheckCircle2, ChefHat, ClipboardList, ShoppingBag } from 'lucide-react'
import { formatTime } from '../../lib/format.js'

export function OrderStatus({ order }) {
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
      className="overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-cream p-5 shadow-warm"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
            Seguimiento en vivo
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
            Pedido #{order.number}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {order.tableLabel} · {formatTime(order.createdAt)}
          </p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500 text-white shadow-glow">
          <ActiveIcon size={24} />
        </div>
      </div>

      <div className="relative mb-5">
        <div className="h-2.5 rounded-full bg-cream-200">
          <motion.div
            className="h-2.5 rounded-full bg-gradient-to-r from-gold-400 to-brand-500"
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
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-100'
                    : isActive
                      ? 'bg-brand-500 text-white shadow-glow ring-4 ring-brand-100'
                      : 'bg-cream-100 text-ink-muted'
                }`}
              >
                <Icon size={20} />
                {isActive ? (
                  <span className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white bg-gold-400" />
                ) : null}
              </div>
              <div>
                <p
                  className={`text-xs font-bold leading-tight ${
                    isCompleted || isActive ? 'text-brand-700' : 'text-ink-muted'
                  }`}
                >
                  {step.label}
                </p>
                {isActive ? (
                  <p className="mt-0.5 text-[0.65rem] font-semibold leading-tight text-brand-500">
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

export function ToastNotification({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed left-1/2 top-4 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand-900 px-4 py-3 text-sm font-bold text-white shadow-2xl"
    >
      <CheckCircle2 className="h-5 w-5 text-gold-400" />
      {text}
    </motion.div>
  )
}
