insert into public.restaurant_settings (singleton, name, whatsapp, base_url, primary_color)
values (true, 'LastHit Bistro', '56912345678', 'https://dominio.cl', '#d92d48')
on conflict (singleton) do update
set
  name = excluded.name,
  whatsapp = excluded.whatsapp,
  base_url = excluded.base_url,
  primary_color = excluded.primary_color;

insert into public.menu_categories (name, description, sort_order)
values
  ('Pizzas', 'Pizzas artesanales al horno', 1),
  ('Hamburguesas', 'Burgers smash y clasicas', 2),
  ('HotDogs', 'Hot dogs y completos', 3),
  ('Bebidas', 'Refrescos y jugos', 4),
  ('Promociones', 'Combos y destacados del dia', 5)
on conflict (name) do nothing;

insert into public.restaurant_tables (label, slug)
values
  ('Mesa 01', 'mesa-01'),
  ('Mesa 02', 'mesa-02'),
  ('Mesa 03', 'mesa-03'),
  ('Mesa 04', 'mesa-04'),
  ('Mesa 05', 'mesa-05')
on conflict (slug) do nothing;

insert into public.menu_products
  (name, description, price, category_name, image_url, available, featured, vegetarian, prep_time)
values
  ('Pizza Margarita', 'Salsa de tomate, mozzarella fresca y albahaca.', 11900, 'Pizzas', null, true, true, true, 18),
  ('Pizza Pepperoni', 'Mozzarella, salsa casera y pepperoni crocante.', 12900, 'Pizzas', null, true, true, false, 18),
  ('Pizza Vegetariana', 'Champinones, pimenton, cebolla morada y aceitunas.', 12400, 'Pizzas', null, true, false, true, 19),
  ('Hamburguesa Clásica', 'Carne smash, cheddar, tomate y salsa especial.', 9900, 'Hamburguesas', null, true, true, false, 14),
  ('Hamburguesa Vegana', 'Medallon de legumbres, palta y mayo vegana.', 10400, 'Hamburguesas', null, true, false, true, 15),
  ('HotDog Italiano', 'Vienesa premium, palta, tomate y mayo.', 6900, 'HotDogs', null, true, false, false, 9),
  ('Bebida Coca-Cola', 'Lata 350cc bien helada.', 2200, 'Bebidas', null, true, false, true, 2),
  ('Papas fritas', 'Papas doradas con sal de romero.', 4800, 'Promociones', null, true, true, true, 8)
on conflict do nothing;
