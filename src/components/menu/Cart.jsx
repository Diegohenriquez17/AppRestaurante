import { useState } from 'react'
import { motion } from 'framer-motion'
import { Divide, Minus, MessageSquare, Plus, ShoppingBag, Trash2, User, Users, X } from 'lucide-react'
import { currency, formatTableName } from '../../lib/format.js'
import { FoodArt } from './FoodArt.jsx'

export function FloatingCartButton({ count, total, onClick }) {
  if (!count) return null

  return (
    <motion.button
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      type="button"
      onClick={onClick}
      className="fixed inset-x-4 bottom-4 z-40 flex h-16 items-center justify-between rounded-2xl bg-brand-900 px-5 text-left text-white shadow-2xl shadow-brand-900/40 lg:hidden"
    >
      <span className="inline-flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-400 text-brand-900">
          <ShoppingBag className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-black">Ver pedido</span>
          <span className="text-xs text-white/60">{count} productos</span>
        </span>
      </span>
      <strong className="font-display text-lg font-semibold">{currency.format(total)}</strong>
    </motion.button>
  )
}

export function CartDrawer({ open, onClose, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-brand-900/55 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar pedido"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[2rem] bg-cream p-4 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <strong className="font-display text-xl font-semibold text-ink">Tu pedido</strong>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-cream-100 text-ink-muted"
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

function CartQuantityButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full bg-cream-100 text-ink transition hover:bg-cream-200"
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

const PERSON_COLORS = ['#c2553d', '#c4831f', '#4d6b2f', '#7d3122', '#9a3f2c', '#b87b1f']

// Calculadora para repartir la cuenta: por igual entre las personas
// o por producto, asignando cada unidad a una persona concreta.
function SplitBill({ total, items, guestCount, setGuestCount }) {
  const [mode, setMode] = useState('equal') // 'equal' | 'items'
  const [activePerson, setActivePerson] = useState(0)
  const [alloc, setAlloc] = useState({}) // `${itemId}__${persona}` -> cantidad
  const people = Math.max(1, guestCount || 1)
  const active = Math.min(activePerson, people - 1)
  const perPerson = Math.ceil(total / people)
  const activeColor = PERSON_COLORS[active % PERSON_COLORS.length]

  const stepper = (
    <div className="flex items-center gap-1">
      <CartQuantityButton label="Menos personas" onClick={() => setGuestCount(Math.max(1, people - 1))}>
        <Minus className="h-4 w-4" />
      </CartQuantityButton>
      <span className="w-7 text-center text-sm font-black text-ink">{people}</span>
      <CartQuantityButton label="Más personas" onClick={() => setGuestCount(people + 1)}>
        <Plus className="h-4 w-4" />
      </CartQuantityButton>
    </div>
  )

  // Cantidad de cada producto asignada a cada persona.
  const allocOf = (itemId, p) => alloc[`${itemId}__${p}`] || 0
  const assignedTotal = (item) => {
    let s = 0
    for (let p = 0; p < people; p++) s += allocOf(item.id, p)
    return s
  }
  const remaining = (item) => item.quantity - assignedTotal(item)
  const give = (itemId, p, delta) =>
    setAlloc((prev) => {
      const key = `${itemId}__${p}`
      return { ...prev, [key]: Math.max(0, (prev[key] || 0) + delta) }
    })
  const personTotal = (p) => items.reduce((s, it) => s + allocOf(it.id, p) * it.price, 0)
  const unassigned = items.reduce((s, it) => s + remaining(it) * it.price, 0)

  return (
    <div className="grid gap-3 rounded-2xl bg-white p-3 ring-1 ring-cream-200">
      <p className="inline-flex items-center gap-2 text-sm font-bold text-ink">
        <Divide className="h-4 w-4" />
        Dividir cuenta
      </p>

      <div className="grid grid-cols-2 gap-2">
        {[
          ['equal', 'Por igual'],
          ['items', 'Por producto'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-2xl px-3 py-2 text-sm font-bold transition ${
              mode === value
                ? 'bg-brand-900 text-white'
                : 'bg-cream text-ink-muted ring-1 ring-cream-200 hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-muted">Personas</span>
        {stepper}
      </div>

      {mode === 'equal' ? (
        <div className="flex items-end justify-between rounded-2xl bg-cream px-4 py-3">
          <span className="text-sm font-bold text-ink-muted">Cada persona paga</span>
          <strong className="font-display text-2xl font-semibold text-ink">
            {currency.format(perPerson)}
          </strong>
        </div>
      ) : (
        <div className="grid gap-3">
          {/* 1) Elegir la persona activa */}
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
            {Array.from({ length: people }, (_, p) => {
              const on = active === p
              const color = PERSON_COLORS[p % PERSON_COLORS.length]
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActivePerson(p)}
                  className="flex shrink-0 flex-col items-start gap-0.5 rounded-2xl px-3 py-2 text-left transition"
                  style={
                    on
                      ? { background: color, color: '#fff' }
                      : { background: '#faf6f0', color: '#2a221c', boxShadow: 'inset 0 0 0 1px #e8ddd0' }
                  }
                >
                  <span className="text-xs font-black">Persona {p + 1}</span>
                  <span className={`text-[0.7rem] font-bold ${on ? 'text-white/85' : 'text-ink-muted'}`}>
                    {currency.format(personTotal(p))}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 2) Repartir productos a la persona activa */}
          <p className="text-xs font-bold text-ink-muted">
            Asignando a <span style={{ color: activeColor }}>Persona {active + 1}</span> — usa + en cada
            producto
          </p>
          <ul className="grid gap-2">
            {items.map((item) => {
              const count = allocOf(item.id, active)
              const rem = remaining(item)
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-2xl bg-cream p-2.5"
                >
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{item.name}</span>
                    <span className="text-xs text-ink-muted">
                      {currency.format(item.price)} ·{' '}
                      {rem > 0 ? `${rem} libre${rem > 1 ? 's' : ''}` : 'todo repartido'}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <CartQuantityButton
                      label="Quitar"
                      onClick={() => count > 0 && give(item.id, active, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </CartQuantityButton>
                    <span className="w-7 text-center text-sm font-black text-ink">{count}</span>
                    <button
                      type="button"
                      onClick={() => rem > 0 && give(item.id, active, 1)}
                      disabled={rem === 0}
                      aria-label={`Dar ${item.name} a Persona ${active + 1}`}
                      className="grid h-8 w-8 place-items-center rounded-full text-white transition active:scale-90 disabled:cursor-not-allowed disabled:bg-cream-200 disabled:text-ink-muted"
                      style={rem === 0 ? undefined : { background: activeColor }}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          {unassigned > 0 ? (
            <div className="flex items-center justify-between rounded-2xl bg-cream px-4 py-2.5 text-sm font-bold text-brand-600">
              <span>Sin asignar</span>
              <strong className="tabular-nums">{currency.format(unassigned)}</strong>
            </div>
          ) : (
            <div className="rounded-2xl bg-emerald-50 px-4 py-2.5 text-center text-sm font-bold text-emerald-700">
              Todo repartido ✓
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function CartContent({
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
      <div
        className="rounded-2xl p-4 text-white"
        style={{
          background:
            'radial-gradient(circle at 100% 0%, rgba(217,150,65,0.28), transparent 50%), linear-gradient(135deg, #2a221c, #3a2c22)',
        }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-300">Pedido mesa</p>
        <div className="mt-2 flex items-center justify-between">
          <strong className="font-display text-2xl font-semibold">{formatTableName(mesaId)}</strong>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
            {cart.items.length} items
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_110px] gap-2">
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
            Nombre
          </span>
          <span className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              className="h-12 w-full rounded-2xl border border-cream-200 bg-white pl-9 pr-3 font-semibold text-ink outline-none focus:border-brand-400"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Tu nombre"
            />
          </span>
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
            Personas
          </span>
          <span className="relative">
            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              className="h-12 w-full rounded-2xl border border-cream-200 bg-white pl-9 pr-2 font-semibold text-ink outline-none focus:border-brand-400"
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
            <div key={item.id} className="rounded-2xl border border-cream-200 bg-white p-3">
              <div className="grid grid-cols-[58px_1fr_auto] gap-3">
                <FoodArt
                  category={item.category}
                  name={item.name}
                  className="h-14 w-14 overflow-hidden rounded-2xl"
                  iconClassName="h-8 w-8"
                />
                <div>
                  <strong className="line-clamp-1 text-sm font-bold text-ink">{item.name}</strong>
                  <p className="mt-1 text-sm font-bold text-ink-muted">
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
                  <span className="w-7 text-center text-sm font-black text-ink">
                    {item.quantity}
                  </span>
                  <CartQuantityButton label="Sumar" onClick={() => updateCartItem(mesaId, item, 1)}>
                    <Plus className="h-4 w-4" />
                  </CartQuantityButton>
                </div>
              </div>
              <div className="mt-3 grid gap-2">
                <input
                  className="h-11 rounded-2xl border border-cream-200 bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-brand-400"
                  value={item.notes ?? ''}
                  onChange={(event) => setCartItemNote(mesaId, item.id, event.target.value)}
                  placeholder="Nota: sin mayo, sin cebolla..."
                />
                <button
                  type="button"
                  onClick={() => removeFromCart(mesaId, item.id)}
                  className="inline-flex w-fit items-center gap-2 text-sm font-bold text-brand-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Quitar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-cream-300 bg-white p-6 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-cream-300" />
            <p className="mt-2 font-display text-lg font-semibold text-ink">Tu pedido está vacío</p>
            <p className="text-sm text-ink-muted">Agrega productos del menú para comenzar.</p>
          </div>
        )}
      </div>

      <label className="grid gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-ink">
          <MessageSquare className="h-4 w-4" />
          Nota general
        </span>
        <textarea
          className="min-h-24 rounded-2xl border border-cream-200 bg-white p-3 text-sm font-semibold text-ink outline-none focus:border-brand-400"
          value={customerNote}
          onChange={(event) => setCustomerNote(event.target.value)}
          placeholder="Ej: una bebida sin hielo, traer cubiertos..."
        />
      </label>

      <div className="grid gap-2 rounded-2xl bg-white p-3 ring-1 ring-cream-200">
        <p className="text-sm font-bold text-ink">Propina sugerida</p>
        <div className="grid grid-cols-3 gap-2">
          {[0, 10, 15].map((tip) => (
            <button
              key={tip}
              type="button"
              onClick={() => setCartTip(mesaId, tip)}
              className={`rounded-2xl px-3 py-2 text-sm font-bold transition ${
                (cart.tipPercent ?? 10) === tip
                  ? 'bg-brand-900 text-white'
                  : 'bg-cream text-ink-muted ring-1 ring-cream-200 hover:text-ink'
              }`}
            >
              {tip}%
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 rounded-2xl border border-cream-200 bg-white p-4 text-sm font-bold text-ink-muted">
        <CartTotalLine label="Subtotal" value={subtotal} />
        <CartTotalLine label="Descuento" value={-discount} />
        <CartTotalLine label="Propina" value={tipAmount} />
        <div className="mt-2 flex items-center justify-between border-t border-cream-200 pt-3 font-display text-xl font-semibold text-ink">
          <span>Total</span>
          <span>{currency.format(total)}</span>
        </div>
      </div>

      {cart.items.length ? (
        <SplitBill
          total={total}
          items={cart.items}
          guestCount={guestCount}
          setGuestCount={setGuestCount}
        />
      ) : null}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!cart.items.length}
        className="h-14 rounded-2xl bg-brand-500 text-base font-bold text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-cream-200 disabled:text-ink-muted disabled:shadow-none"
      >
        Enviar pedido
      </button>
    </div>
  )
}
