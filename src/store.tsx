import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CONTACTS, DEALS, TASKS, THEMES, type Contact, type Deal, type PageId, type Stage, type Task, type Theme } from './data'

type Toast = { id: number; text: string }

type Store = {
  page: PageId
  go: (p: PageId) => void
  theme: Theme
  setTheme: (id: string) => void
  glass: number
  setGlass: (v: number) => void
  deals: Deal[]
  moveDeal: (id: string, stage: Stage) => void
  addDeal: (d: Omit<Deal, 'id'>) => void
  tasks: Task[]
  toggleTask: (id: string) => void
  addTask: (t: Omit<Task, 'id' | 'done'>) => void
  contacts: Contact[]
  toasts: Toast[]
  toast: (text: string) => void
  reset: () => void
}

const Ctx = createContext<Store | null>(null)
const KEY = 'fernly-crm-v1'

type Saved = { theme?: string; glass?: number; deals?: Deal[]; tasks?: Task[] }
const load = (): Saved => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}

const pageFromHash = (): PageId => {
  const h = location.hash.replace('#/', '') as PageId
  return ['dashboard', 'contacts', 'deals', 'tasks', 'calendar', 'reports', 'settings', 'help'].includes(h) ? h : 'dashboard'
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const saved = useMemo(load, [])
  const [page, setPage] = useState<PageId>(pageFromHash)
  const [themeId, setThemeId] = useState(saved.theme ?? 'emerald')
  const [glass, setGlass] = useState(saved.glass ?? 60)
  const [deals, setDeals] = useState<Deal[]>(saved.deals ?? DEALS)
  const [tasks, setTasks] = useState<Task[]>(saved.tasks ?? TASKS)
  const [toasts, setToasts] = useState<Toast[]>([])

  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0]

  useEffect(() => {
    const r = document.documentElement.style
    r.setProperty('--a-900', theme.a900)
    r.setProperty('--a-700', theme.a700)
    r.setProperty('--a-500', theme.a500)
    r.setProperty('--a-300', theme.a300)
    r.setProperty('--a-100', theme.a100)
    r.setProperty('--a-50', theme.a50)
    r.setProperty('--sb-1', theme.sb1)
    r.setProperty('--sb-2', theme.sb2)
    r.setProperty('--sb-3', theme.sb3)
    r.setProperty('--glow', theme.glow)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty('--glass-a', (0.02 + (glass / 100) * 0.1).toFixed(3))
  }, [glass])

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ theme: themeId, glass, deals, tasks }))
  }, [themeId, glass, deals, tasks])

  useEffect(() => {
    const on = () => setPage(pageFromHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const go = useCallback((p: PageId) => {
    if (location.hash !== `#/${p}`) location.hash = `/${p}`
    setPage(p)
  }, [])

  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  const value: Store = {
    page,
    go,
    theme,
    setTheme: setThemeId,
    glass,
    setGlass,
    deals,
    moveDeal: (id, stage) => setDeals((ds) => ds.map((d) => (d.id === id ? { ...d, stage, prob: stage === 'Won' ? 100 : d.prob } : d))),
    addDeal: (d) => setDeals((ds) => [{ ...d, id: `d${Date.now()}` }, ...ds]),
    tasks,
    toggleTask: (id) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    addTask: (t) => setTasks((ts) => [{ ...t, id: `t${Date.now()}`, done: false }, ...ts]),
    contacts: CONTACTS,
    toasts,
    toast,
    reset: () => {
      setDeals(DEALS)
      setTasks(TASKS)
      setThemeId('emerald')
      setGlass(60)
    },
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => {
  const s = useContext(Ctx)
  if (!s) throw new Error('StoreProvider missing')
  return s
}
