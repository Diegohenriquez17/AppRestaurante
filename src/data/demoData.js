function svgDataUrl(background, title, accent) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" rx="48" fill="url(#bg)" />
      <circle cx="660" cy="130" r="96" fill="rgba(255,255,255,0.16)" />
      <circle cx="160" cy="470" r="140" fill="rgba(255,255,255,0.12)" />
      <text x="60" y="330" fill="#ffffff" font-size="64" font-family="Segoe UI Variable Display, Trebuchet MS, sans-serif" font-weight="700">${title}</text>
    </svg>
  `.trim()
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export function buildProductImage(name, brandColor = '#d92d48') {
  const palette = {
    Pizza: ['#ff8552', '#ff4560'],
    Hamburguesa: ['#c17c3a', '#f04d3a'],
    HotDog: ['#ec7a31', '#ffb64c'],
    Bebida: ['#4f78ff', '#0fb7ff'],
    Papas: ['#efb121', '#f76b1c'],
  }
  const match = Object.entries(palette).find(([key]) => name.includes(key))
  const [background, accent] = match ? match[1] : ['#364153', brandColor]
  return svgDataUrl(background, name, accent)
}

function getDemoBaseUrl() {
  return import.meta.env.VITE_APP_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
}

const categories = [
  { id: 'cat-1', name: 'Pizzas', description: 'Pizzas artesanales al horno' },
  { id: 'cat-2', name: 'Hamburguesas', description: 'Burgers smash y clasicas' },
  { id: 'cat-3', name: 'HotDogs', description: 'Hot dogs y completos' },
  { id: 'cat-4', name: 'Bebidas', description: 'Refrescos y jugos' },
  { id: 'cat-5', name: 'Promociones', description: 'Combos y destacados del dia' },
]

const products = [
  {
    id: 'prod-1',
    name: 'Pizza Margarita',
    description: 'Salsa de tomate, mozzarella fresca y albahaca.',
    price: 11900,
    category: 'Pizzas',
    available: true,
    featured: true,
    vegetarian: true,
    prepTime: 18,
  },
  {
    id: 'prod-2',
    name: 'Pizza Pepperoni',
    description: 'Mozzarella, salsa casera y pepperoni crocante.',
    price: 12900,
    category: 'Pizzas',
    available: true,
    featured: true,
    vegetarian: false,
    prepTime: 18,
  },
  {
    id: 'prod-3',
    name: 'Pizza Vegetariana',
    description: 'Champinones, pimenton, cebolla morada y aceitunas.',
    price: 12400,
    category: 'Pizzas',
    available: true,
    featured: false,
    vegetarian: true,
    prepTime: 19,
  },
  {
    id: 'prod-4',
    name: 'Hamburguesa Clásica',
    description: 'Carne smash, cheddar, tomate y salsa especial.',
    price: 9900,
    category: 'Hamburguesas',
    available: true,
    featured: true,
    vegetarian: false,
    prepTime: 14,
  },
  {
    id: 'prod-5',
    name: 'Hamburguesa Vegana',
    description: 'Medallon de legumbres, palta y mayo vegana.',
    price: 10400,
    category: 'Hamburguesas',
    available: true,
    featured: false,
    vegetarian: true,
    prepTime: 15,
  },
  {
    id: 'prod-6',
    name: 'HotDog Italiano',
    description: 'Vienesa premium, palta, tomate y mayo.',
    price: 6900,
    category: 'HotDogs',
    available: true,
    featured: false,
    vegetarian: false,
    prepTime: 9,
  },
  {
    id: 'prod-7',
    name: 'Bebida Coca-Cola',
    description: 'Lata 350cc bien helada.',
    price: 2200,
    category: 'Bebidas',
    available: true,
    featured: false,
    vegetarian: true,
    prepTime: 2,
  },
  {
    id: 'prod-8',
    name: 'Papas fritas',
    description: 'Papas doradas con sal de romero.',
    price: 4800,
    category: 'Promociones',
    available: true,
    featured: true,
    vegetarian: true,
    prepTime: 8,
  },
].map((product) => ({
  ...product,
  image: buildProductImage(product.name),
}))

export const demoState = {
  restaurant: {
    name: 'LastHit Bistro',
    whatsapp: '',
    baseUrl: getDemoBaseUrl(),
    primaryColor: '#d92d48',
  },
  categories,
  promotions: [
    {
      id: 'promo-1',
      name: 'Promo bienvenida',
      description: 'Descuento demo aplicado a pedidos pequenos.',
      discountAmount: 1200,
      active: true,
    },
  ],
  products,
  tables: [
    { id: 'table-1', label: 'Mesa 01', slug: 'mesa-01' },
    { id: 'table-2', label: 'Mesa 02', slug: 'mesa-02' },
    { id: 'table-3', label: 'Mesa 03', slug: 'mesa-03' },
    { id: 'table-4', label: 'Mesa 04', slug: 'mesa-04' },
    { id: 'table-5', label: 'Mesa 05', slug: 'mesa-05' },
  ],
  orders: [],
  carts: {},
  orderCounter: 120,
  staffUsers: [
    { id: 'staff-1', name: 'Admin Principal', role: 'administrador', pin: '1234', active: true, createdAt: new Date().toISOString() },
    { id: 'staff-2', name: 'Chef Marco', role: 'cocina', pin: '5678', active: true, createdAt: new Date().toISOString() },
    { id: 'staff-3', name: 'Cajero Ana', role: 'cajero', pin: '9012', active: true, createdAt: new Date().toISOString() },
    { id: 'staff-4', name: 'Garzon Pedro', role: 'garzon', pin: '3456', active: true, createdAt: new Date().toISOString() },
    { id: 'staff-5', name: 'Maria Gonzalez', role: 'garzon', pin: '7890', active: true, createdAt: new Date().toISOString() },
  ],
  reservations: [],
}
