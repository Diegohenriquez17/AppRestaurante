import { supabase } from './supabase.js'
import { buildProductImage, demoState } from '../data/demoData.js'

function cloneDemoState() {
  return JSON.parse(JSON.stringify(demoState))
}

function getDefaultBaseUrl() {
  return import.meta.env.VITE_APP_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
}

export function isSupabaseEnabled() {
  return Boolean(supabase)
}

export async function loadOrganizations() {
  if (!supabase) return []
  const { data, error } = await supabase.from('organizations').select('*').order('name')
  if (error) throw new Error(`organizations: ${error.message}`)
  return data || []
}

export async function saveRemoteOrganization(org) {
  if (!supabase) return org
  const payload = {
    id: org.id || undefined,
    name: org.name,
    slug: org.slug,
    plan: normalizeOrganizationPlan(org.plan),
    status: org.status,
    rut: org.rut,
    mrr: org.mrr
  }
  let { data, error } = await supabase
    .from('organizations')
    .upsert(payload)
    .select('*')
    .single()
  if (error && error.message?.toLowerCase().includes('plan')) {
    const retry = await supabase
      .from('organizations')
      .upsert({ ...payload, plan: normalizeLegacyOrganizationPlan(org.plan) })
      .select('*')
      .single()
    data = retry.data
    error = retry.error
  }
  if (error) throw new Error(`organizations.upsert: ${error.message}`)
  return data
}

function normalizeOrganizationPlan(plan = '') {
  if (plan.includes('Venta') || plan.includes('Pago')) return 'Venta Única'
  if (plan.includes('Empresa') || plan.includes('Enterprise') || plan.includes('Pro')) return 'Empresa'
  return 'Básico'
}

function normalizeLegacyOrganizationPlan(plan = '') {
  if (plan.includes('Venta') || plan.includes('Pago')) return 'Venta Ãšnica'
  if (plan.includes('Empresa') || plan.includes('Enterprise') || plan.includes('Pro')) return 'Empresa'
  return 'BÃ¡sico'
}

export async function deleteRemoteOrganization(orgId) {
  if (!supabase) return
  const { error } = await supabase.from('organizations').delete().eq('id', orgId)
  if (error) throw new Error(`organizations.delete: ${error.message}`)
}

export async function loadRemoteState(organizationId) {
  if (!supabase || !organizationId) {
    return null
  }

  const [categoriesRes, productsRes, tablesRes, ordersRes, settingsRes, staffRes] = await Promise.all([
    supabase.from('menu_categories').select('*').eq('organization_id', organizationId).order('sort_order').order('name'),
    supabase.from('menu_products').select('*').eq('organization_id', organizationId).order('name'),
    supabase.from('restaurant_tables').select('*').eq('organization_id', organizationId).order('label'),
    supabase
      .from('orders')
      .select(
        'id, number, table_id, table_label, order_type, note, subtotal, discount, tip_amount, total, status, created_at, waiter_id, waiter_name, whatsapp_message, order_items(id, product_id, product_name, unit_price, quantity, notes)',
      )
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false }),
    supabase.from('restaurant_settings').select('*').eq('organization_id', organizationId).maybeSingle(),
    supabase.from('staff_users').select('*').eq('organization_id', organizationId).order('name'),
  ])

  throwIfError(categoriesRes, 'menu_categories')
  throwIfError(productsRes, 'menu_products')
  throwIfError(tablesRes, 'restaurant_tables')
  throwIfError(ordersRes, 'orders')
  throwIfError(settingsRes, 'restaurant_settings')
  throwIfError(staffRes, 'staff_users')

  const restaurantSettings = settingsRes.data ?? {
    name: 'Restaurante Demo',
    whatsapp: '',
    base_url: getDefaultBaseUrl(),
    primary_color: '#c2553d'
  }
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
    image: item.image_url || buildProductImage(item.name, restaurantSettings.primary_color || restaurantSettings.primaryColor || '#c2553d'),
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
  const tableIdToSlug = new Map(
    (tablesRes.data ?? []).map((t) => [t.id, t.slug]),
  )
  const orders = (ordersRes.data ?? []).map((item) => ({
    id: item.id,
    number: String(item.number).padStart(4, '0'),
    tableId: tableIdToSlug.get(item.table_id) || item.table_id,
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
    waiterId: item.waiter_id,
    waiterName: item.waiter_name,
    createdAt: item.created_at,
    whatsAppMessage: item.whatsapp_message ?? '',
  }))
  const staffUsers = (staffRes.data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    role: item.role,
    pin: item.pin,
    active: item.active,
    rut: item.rut || '',
    phone: item.phone || '',
    email: item.email || '',
    createdAt: item.created_at,
  }))

  return {
    restaurant: {
      name: restaurantSettings.name,
      whatsapp: restaurantSettings.whatsapp,
      baseUrl: restaurantSettings.base_url || restaurantSettings.baseUrl,
      primaryColor: restaurantSettings.primary_color || restaurantSettings.primaryColor || '#c2553d',
    },
    categories,
    promotions: cloneDemoState().promotions,
    products,
    tables,
    orders,
    staffUsers,
    carts: {},
    orderCounter: orders.reduce((max, order) => Math.max(max, Number(order.number)), 0),
  }
}

export async function createRemoteOrder(payload, state, organizationId) {
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

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tableRecord.id)
  const { data: rpcData, error: rpcError } = await supabase.rpc('place_order', {
    p_org: organizationId,
    p_table_id: isUuid ? tableRecord.id : null,
    p_table_label: tableRecord.label,
    p_order_type: payload.orderType,
    p_note: payload.note,
    p_subtotal: payload.subtotal,
    p_discount: payload.discount,
    p_tip: payload.tipAmount,
    p_total: payload.total,
    p_waiter_id: payload.waiterId || null,
    p_waiter_name: payload.waiterName || null,
    p_whatsapp: whatsAppMessage,
    p_items: payload.items.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      notes: item.notes ?? '',
    })),
    p_channel: payload.channel || 'salon',
    p_customer_name: payload.customerName || null,
    p_customer_phone: payload.customerPhone || null,
    p_customer_address: payload.customerAddress || null,
  })

  if (rpcError) throw new Error(`orders.place: ${rpcError.message}`)
  const created = Array.isArray(rpcData) ? rpcData[0] : rpcData

  return {
    id: created.order_id,
    number: String(created.order_number).padStart(4, '0'),
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
    waiterId: payload.waiterId || null,
    waiterName: payload.waiterName || null,
    createdAt: created.order_created_at,
    whatsAppMessage,
  }
}

export async function updateRemoteOrderStatus(orderId, status) {
  throwIfMissingClient()
  const result = await supabase.from('orders').update({ status }).eq('id', orderId)
  throwIfError(result, 'orders.update')
}

export async function saveRemoteProduct(product, state, organizationId) {
  throwIfMissingClient()
  const payload = {
    id: product.id || undefined,
    name: product.name,
    description: product.description,
    price: product.price,
    category_name: product.category,
    image_url: product.image || buildProductImage(product.name, state.restaurant.primaryColor || '#c2553d'),
    available: product.available,
    featured: product.featured,
    vegetarian: product.vegetarian,
    prep_time: product.prepTime,
    organization_id: organizationId,
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

export async function addRemoteCategory(name, organizationId) {
  throwIfMissingClient()
  const result = await supabase
    .from('menu_categories')
    .insert({ name, description: 'Categoria creada desde el panel admin', organization_id: organizationId })
    .select('*')
    .single()
  throwIfError(result, 'menu_categories.insert')
  return result.data
}

export async function addRemoteTable(label, organizationId) {
  throwIfMissingClient()
  const result = await supabase
    .from('restaurant_tables')
    .insert({ label, slug: normalizeTableSlug(label), organization_id: organizationId })
    .select('*')
    .single()
  throwIfError(result, 'restaurant_tables.insert')
  return result.data
}

export async function updateRemoteRestaurantConfig(config, organizationId) {
  throwIfMissingClient()
  const result = await supabase.from('restaurant_settings').upsert(
    {
      singleton: false,
      name: config.name,
      whatsapp: config.whatsapp ?? '',
      base_url: config.baseUrl || getDefaultBaseUrl(),
      primary_color: config.primaryColor || '#c2553d',
      organization_id: organizationId,
    },
    { onConflict: 'organization_id' },
  )
  throwIfError(result, 'restaurant_settings.upsert')
}

export async function saveRemoteStaffUser(user, organizationId) {
  throwIfMissingClient()
  const payload = {
    id: user.id || undefined,
    name: user.name,
    role: user.role,
    pin: user.pin,
    active: user.active,
    organization_id: organizationId,
    email: user.email || null,
    rut: user.rut || '',
    phone: user.phone || '',
  }
  const result = await supabase
    .from('staff_users')
    .upsert(payload)
    .select('*')
    .single()
  throwIfError(result, 'staff_users.upsert')
  return result.data
}

export async function deleteRemoteStaffUser(userId) {
  throwIfMissingClient()
  const result = await supabase.from('staff_users').delete().eq('id', userId)
  throwIfError(result, 'staff_users.delete')
}

export async function toggleRemoteStaffUser(userId, active) {
  throwIfMissingClient()
  const result = await supabase.from('staff_users').update({ active }).eq('id', userId)
  throwIfError(result, 'staff_users.update')
}

export async function updateRemoteStaffPin(userId, pin) {
  throwIfMissingClient()
  const result = await supabase.from('staff_users').update({ pin }).eq('id', userId)
  throwIfError(result, 'staff_users.update_pin')
}

// --- Invite codes (gestión exclusiva del superadmin vía RLS) ---

export async function loadInviteCodes() {
  throwIfMissingClient()
  const result = await supabase
    .from('invite_codes')
    .select('*')
    .order('created_at', { ascending: false })
  throwIfError(result, 'invite_codes')
  return result.data || []
}

export async function createRemoteInviteCode({ code, note, expiresAt, createdBy }) {
  throwIfMissingClient()
  const result = await supabase
    .from('invite_codes')
    .insert({
      code,
      note: note || '',
      expires_at: expiresAt || null,
      created_by: createdBy || null,
    })
    .select('*')
    .single()
  throwIfError(result, 'invite_codes.insert')
  return result.data
}

export async function revokeRemoteInviteCode(codeId) {
  throwIfMissingClient()
  const result = await supabase
    .from('invite_codes')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', codeId)
  throwIfError(result, 'invite_codes.revoke')
}

export async function deleteRemoteInviteCode(codeId) {
  throwIfMissingClient()
  const result = await supabase.from('invite_codes').delete().eq('id', codeId)
  throwIfError(result, 'invite_codes.delete')
}

// Pre-valida un código de invitación sin necesidad de sesión (RPC anon).
export async function checkInviteCode(inviteCode) {
  throwIfMissingClient()
  const { data, error } = await supabase.rpc('check_invite_code', { invite_code: inviteCode })
  if (error) throw new Error(`invite.check: ${error.message}`)
  return data // 'valid' | 'invalid' | 'used' | 'revoked' | 'expired'
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

// --- Authentication (Supabase Auth) ---

// Loads the staff profile (with its organization) for a given auth user id.
export async function loadStaffProfileById(uid) {
  throwIfMissingClient()
  const { data, error } = await supabase
    .from('staff_users')
    .select('*, organizations(*)')
    .eq('id', uid)
    .eq('active', true)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

// Signs in with email/password against Supabase Auth and returns the staff
// profile. Returns null on invalid credentials or inactive/missing profile.
export async function signInWithEmail(email, password) {
  throwIfMissingClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })
  if (error) return null
  const uid = data.user?.id
  if (!uid) return null
  return loadStaffProfileById(uid)
}

// Restores the staff profile for the persisted device session, if any.
export async function getSessionProfile() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  const uid = data.session?.user?.id
  if (!uid) return null
  return loadStaffProfileById(uid)
}

export async function signOutRemote() {
  if (!supabase) return
  await supabase.auth.signOut()
}

// Registers a new restaurant: creates the Supabase Auth user, then calls the
// register_restaurant RPC (SECURITY DEFINER) which atomically creates the
// organization, default settings and the admin staff profile (id = auth.uid()).
export async function registerRestaurantRemote(restaurantName, adminName, adminEmail, adminPassword, inviteCode) {
  throwIfMissingClient()
  const email = adminEmail.trim().toLowerCase()

  // Validar el código ANTES de crear la cuenta de Auth para no dejar
  // usuarios huérfanos si el código no sirve.
  const codeStatus = await checkInviteCode(inviteCode)
  if (codeStatus !== 'valid') {
    throw new Error(inviteCodeErrorMessage(codeStatus))
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: adminPassword,
    options: { data: { name: adminName } },
  })
  if (signUpError) throw new Error(signUpError.message)

  let session = signUpData.session
  if (!session) {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: adminPassword,
    })
    if (signInError) {
      throw new Error('Cuenta creada. Revisa tu correo para confirmarla antes de iniciar sesion.')
    }
    session = signInData.session
  }

  const { data: org, error: rpcError } = await supabase.rpc('register_restaurant', {
    restaurant_name: restaurantName,
    admin_name: adminName,
    invite_code: inviteCode,
  })
  if (rpcError) {
    const msg = rpcError.message || ''
    if (msg.includes('INVITE_')) {
      throw new Error(inviteCodeErrorMessage(msg.replace('INVITE_', '').toLowerCase()))
    }
    throw new Error(msg)
  }

  const staff = await loadStaffProfileById(session.user.id)
  return { organization: org, staff }
}

function inviteCodeErrorMessage(status) {
  const messages = {
    invalid: 'El código de invitación no existe. Verifícalo con tu proveedor.',
    used: 'Este código de invitación ya fue utilizado.',
    revoked: 'Este código de invitación fue revocado.',
    expired: 'Este código de invitación está vencido.',
  }
  return messages[status] || 'Código de invitación no válido.'
}
