import { Search, X } from 'lucide-react'
import { scrollToSection } from '../../hooks/useScrollSpy.js'

// Barra sticky: buscador + índice horizontal de secciones (scroll-spy).
export function MenuNavBar({ sections, activeId, search, onSearch }) {
  return (
    <div className="sticky top-0 z-30 border-b border-cream-200 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-3 lg:px-10">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar un plato, bebida o ingrediente…"
            className="h-12 w-full rounded-full border border-cream-200 bg-white pl-11 pr-10 text-sm font-medium text-ink shadow-sm outline-none transition placeholder:text-ink-muted/70 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
          {search ? (
            <button
              type="button"
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-cream-100 text-ink-muted hover:text-ink"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {!search && sections.length > 1 ? (
          <nav className="-mx-6 mt-3 flex gap-1 overflow-x-auto px-6 [scrollbar-width:none] lg:mx-0 lg:px-0">
            {sections.map((s, i) => {
              const active = s.id === activeId
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  className={`group shrink-0 rounded-full px-3.5 py-2 text-sm transition ${
                    active ? 'bg-brand-900 text-cream' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <span
                    className={`mr-1.5 font-display text-xs ${active ? 'text-gold-300' : 'text-brand-400'}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-semibold">{s.name}</span>
                </button>
              )
            })}
          </nav>
        ) : null}
      </div>
    </div>
  )
}

// Índice vertical (tabla de contenidos) para desktop.
export function MenuIndex({ sections, activeId }) {
  return (
    <nav className="sticky top-32 hidden lg:block">
      <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-ink-muted">
        Índice
      </p>
      <ul className="space-y-1">
        {sections.map((s, i) => {
          const active = s.id === activeId
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => scrollToSection(s.id)}
                className="group flex w-full items-center gap-3 py-1.5 text-left"
              >
                <span
                  className={`font-display text-sm tabular-nums transition ${
                    active ? 'text-brand-500' : 'text-ink-muted/50'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`h-px flex-none transition-all ${
                    active ? 'w-8 bg-brand-500' : 'w-4 bg-cream-300 group-hover:w-6'
                  }`}
                />
                <span
                  className={`text-sm font-semibold transition ${
                    active ? 'text-ink' : 'text-ink-muted group-hover:text-ink'
                  }`}
                >
                  {s.name}
                </span>
                <span className="ml-auto text-xs text-ink-muted/50">{s.count}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
