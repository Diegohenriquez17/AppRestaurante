import { motion } from 'framer-motion'
import { Clock3, Flame, Leaf, Plus, Star } from 'lucide-react'
import { currency } from '../../lib/format.js'
import { FoodArt } from './FoodArt.jsx'

export function ProductBadge({ tone, icon: Icon, label }) {
  const tones = {
    amber: 'text-gold-600',
    green: 'text-emerald-600',
    rose: 'text-brand-500',
  }
  return (
    <span className={`inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider ${tones[tone]}`}>
      {Icon ? <Icon className="h-3 w-3" /> : null}
      {label}
    </span>
  )
}

// Encabezado de sección estilo carta impresa.
export function SectionHeader({ index, title, count }) {
  return (
    <div className="mb-2 flex items-end justify-between gap-4 border-b border-cream-200 pb-4">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-lg font-semibold text-brand-400">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
      </div>
      <span className="shrink-0 pb-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {count} {count === 1 ? 'plato' : 'platos'}
      </span>
    </div>
  )
}

// Fila editorial con "línea de puntos" entre nombre y precio.
export function ProductRow({ index, product, quantity, onAdd }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="group flex items-start gap-4 py-5"
    >
      {/* Miniatura */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28">
        <FoodArt
          category={product.category}
          name={product.name}
          className="h-full w-full transition duration-500 group-hover:scale-105"
          iconClassName="h-1/2 w-1/2"
        />
        {quantity ? (
          <span className="absolute inset-x-0 bottom-0 bg-brand-900/85 py-1 text-center text-xs font-bold text-cream backdrop-blur">
            ×{quantity}
          </span>
        ) : null}
      </div>

      {/* Contenido */}
      <div className="min-w-0 flex-1">
        <div className="flex items-end gap-2">
          <h3 className="shrink-0 font-display text-xl font-semibold leading-tight text-ink">
            <span className="mr-2 align-middle text-xs font-semibold text-brand-400">
              {String(index).padStart(2, '0')}
            </span>
            {product.name}
          </h3>
          <span className="mb-1.5 hidden flex-1 border-b border-dotted border-ink/25 sm:block" />
          <strong className="hidden shrink-0 font-display text-xl font-semibold tabular-nums text-ink sm:block">
            {currency.format(product.price)}
          </strong>
        </div>

        <p className="mt-1 line-clamp-2 max-w-prose text-sm italic leading-relaxed text-ink-muted">
          {product.description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {product.featured ? <ProductBadge tone="amber" icon={Star} label="Destacado" /> : null}
          {product.vegetarian ? <ProductBadge tone="green" icon={Leaf} label="Veg" /> : null}
          {product.category === 'Promociones' ? (
            <ProductBadge tone="rose" icon={Flame} label="Promo" />
          ) : null}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted">
            <Clock3 className="h-3.5 w-3.5" />
            {product.prepTime} min
          </span>
        </div>
      </div>

      {/* Precio (móvil) + botón agregar */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <strong className="font-display text-lg font-semibold tabular-nums text-ink sm:hidden">
          {currency.format(product.price)}
        </strong>
        <button
          type="button"
          onClick={() => onAdd(product)}
          className="grid h-11 w-11 place-items-center rounded-full border border-brand-200 bg-white text-brand-500 transition hover:border-brand-500 hover:bg-brand-500 hover:text-white active:scale-90"
          aria-label={`Agregar ${product.name}`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </motion.article>
  )
}

// Plato destacado grande, tipo portada.
export function FeaturedDish({ product, onAdd }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="group relative flex min-w-[300px] max-w-[300px] flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-warm ring-1 ring-cream-200 sm:min-w-[340px] sm:max-w-[340px]"
    >
      <div className="relative h-52 overflow-hidden">
        <FoodArt
          category={product.category}
          name={product.name}
          className="h-full w-full transition duration-700 group-hover:scale-110"
          iconClassName="h-24 w-24"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-cream/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur">
          <Flame className="h-3 w-3" /> Más pedido
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-2xl font-semibold leading-tight text-ink">{product.name}</h3>
        <p className="line-clamp-2 flex-1 text-sm italic leading-relaxed text-ink-muted">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <strong className="font-display text-2xl font-semibold tabular-nums text-ink">
            {currency.format(product.price)}
          </strong>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-bold text-white shadow-glow transition hover:bg-brand-600 active:scale-95"
          >
            <Plus className="h-4 w-4" /> Agregar
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export function PromoBanner({ product, onAdd }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="group relative flex min-w-[300px] max-w-[300px] overflow-hidden rounded-[1.75rem] text-cream shadow-soft sm:min-w-[400px] sm:max-w-[400px]"
      style={{
        background:
          'radial-gradient(circle at 100% 100%, rgba(217,150,65,0.35), transparent 55%), linear-gradient(135deg, #2a221c 0%, #3a2c22 100%)',
      }}
    >
      <div className="flex flex-1 flex-col justify-between gap-4 p-6">
        <div>
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-500 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider">
            <Flame className="h-3 w-3" /> Oferta de hoy
          </span>
          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-cream/65">{product.description}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <strong className="font-display text-2xl font-semibold tabular-nums">
            {currency.format(product.price)}
          </strong>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="rounded-full bg-gold-400 px-5 py-2.5 text-sm font-bold text-brand-900 transition hover:bg-gold-300 active:scale-95"
          >
            Agregar
          </button>
        </div>
      </div>
      <FoodArt
        category={product.category}
        name={product.name}
        className="w-28 shrink-0 sm:w-36"
        iconClassName="h-20 w-20"
      />
    </motion.article>
  )
}
