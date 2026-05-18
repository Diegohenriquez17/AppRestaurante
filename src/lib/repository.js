import { supabase } from './supabase.js'
import { buildProductImage, demoState } from '../data/demoData.js'

function cloneDemoState() {
  return JSON.parse(JSON.stringify(demoState))
}

export function isSupabaseEnabled() {
  return Boolean(supabase)
}

export async function loadRemoteState() {
  if (!supabase) {
    return null
  }

  const [categoriesRes, productsRes, tablesRes, ordersRes, settingsRes] = await Promise.all([
    supabase.from('menu_categories').select('*').order('sort_order').order('name'),
    supabase.from('menu_products').select('*').order('name'),
    supabase.from('restaurant_tables').select('*').order('label'),
    supabase
      .from('orders')
      .select(
        'id, number, table_id, table_label, order_type, note, subtotal, discount, tip_amount, total, status, created_at, whatsapp_message, order_items(id, product_id, product_name, unit_price, quantity, notes)',
      )
      .order('created_at', { ascending: false }),
    supabase.from('restaurant_settings').select('*').eq('singleton', true).maybeSingle(),
  ])

  throwIfError(categoriesRes, 'menu_categories')
  throwIfError(productsRes, 'menu_products')
  throwIfError(tablesRes, 'restaurant_tables')
  throwIfError(ordersRes, 'orders')
  throwIfError(settingsRes, 'restaurant_settings')

  const restaurantSettings = settingsRes.data ?? cloneDemoState().restaurant
  const categories = (categoriesRes.data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description ?? '',
  }))
  const products = (productsRes.data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description ?? '',
    price: item.price,
    category: item.category_name,
    image: item.image_url || buildProductImage(item.name, restaurantSettings.primary_color),
    available: item.available,
    featured: item.featured,
    vegetarian: item.vegetarian,
    prepTime: item.prep_time,
  }))
  const tables = (tablesRes.data ?? []).map((item) => ({
    id: item.id,
    label: item.label,
    slug: item.slug,
  }))
  const orders = (ordersRes.data ?? []).map((item) => ({
    id: item.id,
    number: String(item.number).padStart(4, '0'),
    tableId: item.table_id,
    tableLabel: item.table_label,
    orderType: item.order_type,
    items: (item.order_items ?? []).map((orderItem) => ({
      id: orderItem.product_id,
      name: orderItem.product_name,
      price: orderItem.unit_price,
      quantity: orderItem.quantity,
      notes: orderItem.notes ?? '',
    })),
    note: item.note ?? '',
    subtotal: item.subtotal,
    discount: item.discount,
    tipAmount: item.tip_amount,
    total: item.total,
    status: item.status,
    createdAt: item.created_at,
    whatsAppMessage: item.whatsapp_message ?? '',
  }))

  return {
    restaurant: {
      name: restaurantSettings.name,
      whatsapp: restaurantSettings.whatsapp,
      baseUrl: restaurantSettings.base_url,
      primaryColor: restaurantSettings.primary_color,
    },
    categories,
    promotions: cloneDemoState().promotions,
    products,
    tables,
    orders,
    carts: {},
    orderCounter: orders.reduce((max, order) => Math.max(max, Number(order.number)), 0),
  }
}

export async function createRemoteOrder(payload, state) {
  throwIfMissingClient()
  const tableRecord =
    state.tables.find((table) => table.slug === payload.mesaId) ??
    {
      id: payload.mesaId,
      slug: payload.mesaId,
      label: payload.mesaId.replace('mesa-', 'Mesa '),
    }
  const whatsAppMessage = buildWhatsAppMessage({
    mesa: tableRecord.label,
    orderType: payload.orderType,
    items: payload.items,
    note: payload.note,
    total: payload.total,
  })

  const orderInsert = await supabase
    .from('orders')
    .insert({
      table_id: tableRecord.id,
      table_label: tableRecord.label,
      order_type: payload.orderType,
      note: payload.note,
      subtotal: payload.subtotal,
      discount: payload.discount,
      tip_amount: payload.tipAmount,
      total: payload.total,
      status: 'Pendiente',
      whatsapp_message: whatsAppMessage,
    })
    .select('id, number, created_at')
    .single()

  throwIfError(orderInsert, 'orders.insert')

  const orderItemsInsert = await supabase.from('order_items').insert(
    payload.items.map((item) => ({
      order_id: orderInsert.data.id,
      product_id: item.id,
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      notes: item.notes ?? '',
    })),
  )

  throwIfError(orderItemsInsert, 'order_items.insert')

  return {
    id: orderInsert.data.id,
    number: String(orderInsert.data.number).padStart(4, '0'),
    tableId: payload.mesaId,
    tableLabel: tableRecord.label,
    orderType: payload.orderType,
    items: payload.items,
    note: payload.note,
    subtotal: payload.subtotal,
    discount: payload.discount,
    tipAmount: payload.tipAmount,
    total: payload.total,
    status: 'Pendiente',
    createdAt: orderInsert.data.created_at,
    whatsAppMessage,
  }
}

export async function updateRemoteOrderStatus(orderId, status) {
  throwIfMissingClient()
  const result = await supabase.from('orders').update({ status }).eq('id', orderId)
  throwIfError(result, 'orders.update')
}

export async function saveRemoteProduct(product, state) {
  throwIfMissingClient()
  const payload = {
    id: product.id || undefined,
    name: product.name,
    description: product.description,
    price: product.price,
    category_name: product.category,
    image_url: product.image || buildProductImage(product.name, state.restaurant.primaryColor),
    available: product.available,
    featured: product.featured,
    vegetarian: product.vegetarian,
    prep_time: product.prepTime,
  }
  const result = await supabase
    .from('menu_products')
    .upsert(payload)
    .select('*')
    .single()
  throwIfError(result, 'menu_products.upsert')
  return result.data
}

export async function deleteRemoteProduct(productId) {
  throwIfMissingClient()
  const result = await supabase.from('menu_products').delete().eq('id', productId)
  throwIfError(result, 'menu_products.delete')
}

export async function toggleRemoteProductAvailability(productId, available) {
  throwIfMissingClient()
  const result = await supabase
    .from('menu_products')
    .update({ available })
    .eq('id', productId)
  throwIfError(result, 'menu_products.update')
}

export async function addRemoteCategory(name) {
  throwIfMissingClient()
  const result = await supabase
    .from('menu_categories')
    .insert({ name, description: 'Categoria creada desde el panel admin' })
    .select('*')
    .single()
  throwIfError(result, 'menu_categories.insert')
  return result.data
}

export async function addRemoteTable(label) {
  throwIfMissingClient()
  const result = await supabase
    .from('restaurant_tables')
    .insert({ label, slug: normalizeTableSlug(label) })
    .select('*')
    .single()
  throwIfError(result, 'restaurant_tables.insert')
  return result.data
}

export async function updateRemoteRestaurantConfig(config) {
  throwIfMissingClient()
  const result = await supabase.from('restaurant_settings').upsert(
    {
      singleton: true,
      name: config.name,
      whatsapp: config.whatsapp,
      base_url: config.baseUrl,
      primary_color: config.primaryColor,
    },
    { onConflict: 'singleton' },
  )
  throwIfError(result, 'restaurant_settings.upsert')
}

function throwIfError(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`)
  }
}

function throwIfMissingClient() {
  if (!supabase) {
    throw new Error('Supabase no esta configurado')
  }
}

function buildWhatsAppMessage({ mesa, orderType, items, note, total }) {
  return `Nuevo pedido recibido
Mesa: ${mesa.replace('Mesa ', '')}
Tipo de pedido: ${orderType}

Detalle:
${items.map((item) => `- ${item.quantity}x ${item.name}`).join('\n')}

Notas:
${note || 'Sin notas especiales.'}

Total: ${new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(total)}`
}

export function normalizeTableSlug(value) {
  const digits = value.replace(/\D/g, '')
  if (digits) {
    return `mesa-${digits.padStart(2, '0')}`
  }
  return value.trim().toLowerCase().replaceAll(' ', '-')
}
