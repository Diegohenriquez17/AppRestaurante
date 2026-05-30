import { useEffect, useState } from 'react'

// Observa una lista de ids de sección y devuelve el id de la que está activa
// (la más visible cerca del tope). Pensado para el índice tipo carta.
export function useScrollSpy(ids, { offset = 140 } = {}) {
  const [activeId, setActiveId] = useState(ids[0] ?? null)

  useEffect(() => {
    if (!ids.length) return
    const handler = () => {
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top - offset <= 0) current = id
      }
      setActiveId(current)
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
    }
  }, [ids.join('|'), offset]) // eslint-disable-line react-hooks/exhaustive-deps

  return activeId
}

export function scrollToSection(id, offset = 120) {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: y, behavior: 'smooth' })
}
