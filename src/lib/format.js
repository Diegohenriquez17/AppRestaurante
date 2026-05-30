// Helpers de formato y utilidades compartidas en toda la app.

export const currency = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

export function formatTime(dateValue) {
  return new Date(dateValue).toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function elapsedMinutes(dateValue) {
  return Math.max(0, Math.floor((Date.now() - new Date(dateValue).getTime()) / 60000))
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll('ó', 'o')
    .replaceAll('í', 'i')
}

export function formatTableName(mesaId) {
  const number = mesaId.replace('mesa-', '').padStart(2, '0')
  return `Mesa ${number}`
}

export function getKitchenBorderClass(status) {
  const classes = {
    Pendiente: 'border-amber-300 shadow-amber-100',
    'En preparación': 'border-amber-300 shadow-amber-100',
    Listo: 'border-orange-300 shadow-orange-100',
    Entregado: 'border-stone-200',
    Cancelado: 'border-rose-300 shadow-rose-100',
  }
  return classes[status] ?? 'border-stone-200'
}

export function buildSalesChartData(orders) {
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

export function getTopProducts(orders) {
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

export function createBlankProductForm(categories) {
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
