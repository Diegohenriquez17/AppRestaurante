// Ilustraciones SVG de comida en line-art monocromo (solo trazo, sin color).
// Se elige el dibujo según la categoría o el nombre del producto.

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function getFoodKind(category, name) {
  const c = norm(category)
  const n = norm(name)
  const hit = (re) => re.test(c) || re.test(n)
  if (hit(/pizza/)) return 'pizza'
  if (hit(/hamburg|burger/)) return 'burger'
  if (hit(/hot ?dog|completo|vienesa|salchich/)) return 'hotdog'
  if (hit(/ensalada|salad/)) return 'salad'
  if (hit(/postre|helado|dulce|torta|cookie|brownie/)) return 'dessert'
  if (hit(/bebida|jugo|refresc|gaseosa|soda|cerveza|agua|cafe|\bte\b|limonada|drink|vino|malteada|batido/)) return 'drink'
  if (hit(/promo|oferta|combo|papas|fries|frita/)) return 'fries'
  return 'plate'
}

// Atributos comunes de line-art (trazo que hereda el color del contenedor).
const svgProps = {
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}
const dot = { fill: 'currentColor', stroke: 'none' }

function Pizza(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M32 54 L13 18 Q32 8 51 18 Z" />
      <path d="M16.5 24 Q32 15.5 47.5 24" />
      <circle cx="27" cy="30" r="2.6" {...dot} />
      <circle cx="37.5" cy="32" r="2.2" {...dot} />
      <circle cx="31" cy="42" r="2.2" {...dot} />
    </svg>
  )
}

function Burger(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M12 27 Q12 12 32 12 Q52 12 52 27 Z" />
      <path d="M11 31 Q22 37 32 33.5 Q42 37 53 31" />
      <rect x="13" y="34.5" width="38" height="7" rx="3.5" />
      <path d="M13 45 q0 6 6 6 h26 q6 0 6 -6 Z" />
      <circle cx="24" cy="19" r="1" {...dot} />
      <circle cx="33" cy="16" r="1" {...dot} />
      <circle cx="41" cy="20" r="1" {...dot} />
    </svg>
  )
}

function Hotdog(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="7" y="26" width="50" height="12" rx="6" />
      <rect x="12" y="24" width="40" height="9" rx="4.5" />
      <path d="M15 30 q5 -4 10 0 q5 4 10 0 q5 -4 9 0" strokeWidth="1.6" />
    </svg>
  )
}

function Drink(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M22.5 22 L41.5 22 L38.7 53 Q38.4 55 36.4 55 L27.6 55 Q25.6 55 25.3 53 Z" />
      <line x1="20.5" y1="22" x2="43.5" y2="22" />
      <path d="M24 31 L40 31" strokeWidth="1.5" />
      <line x1="34" y1="9" x2="37" y2="22" />
    </svg>
  )
}

function Fries(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M17 31 L47 31 L43 54 Q42.6 56 40.6 56 L23.4 56 Q21.4 56 21 54 Z" />
      <line x1="17.5" y1="37" x2="46.5" y2="37" />
      <line x1="24" y1="31" x2="22" y2="13" />
      <line x1="30" y1="31" x2="30" y2="10" />
      <line x1="36" y1="31" x2="38" y2="12" />
      <line x1="42" y1="31" x2="44" y2="16" />
    </svg>
  )
}

function Salad(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M12 33 L52 33 Q50 50 32 50 Q14 50 12 33 Z" />
      <line x1="14.5" y1="38" x2="49.5" y2="38" strokeWidth="1.5" />
      <circle cx="26" cy="27" r="5.5" />
      <circle cx="37" cy="25.5" r="4.5" />
      <circle cx="32" cy="30" r="4.5" />
    </svg>
  )
}

function Dessert(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M22 31 Q22 18 32 18 Q42 18 42 31 Z" />
      <path d="M24 31 L40 31 L33 56 Q32 58 31 56 Z" />
      <circle cx="32" cy="16.5" r="2.4" />
      <path d="M27 38 L31 34 M33 41 L38 36" strokeWidth="1.4" />
    </svg>
  )
}

function Plate(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M14 41 Q14 22 32 22 Q50 22 50 41 Z" />
      <path d="M19 38 Q32 30 45 38" strokeWidth="1.5" />
      <line x1="10" y1="41" x2="54" y2="41" />
      <circle cx="32" cy="19" r="2" {...dot} />
    </svg>
  )
}

const ARTS = {
  pizza: Pizza,
  burger: Burger,
  hotdog: Hotdog,
  drink: Drink,
  fries: Fries,
  salad: Salad,
  dessert: Dessert,
  plate: Plate,
}

export function FoodArt({ category, name, className = '', iconClassName = 'h-1/2 w-1/2' }) {
  const kind = getFoodKind(category, name)
  const Art = ARTS[kind] || Plate
  return (
    <div className={`grid place-items-center bg-cream-100 text-ink ${className}`}>
      <Art className={iconClassName} />
    </div>
  )
}
