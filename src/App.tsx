import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { CommandPalette, NewDealModal, Toasts } from './components/Overlays'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import type { PageId } from './data'
import Calendar from './pages/Calendar'
import Contacts from './pages/Contacts'
import Dashboard from './pages/Dashboard'
import Deals from './pages/Deals'
import Help from './pages/Help'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Tasks from './pages/Tasks'
import { StoreProvider, useStore } from './store'

function Skeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="space-y-4 pt-2">
      <div className="skeleton h-6 w-40 rounded-full" />
      <div className="skeleton h-3 w-72 max-w-full rounded-full" />
      <div className="grid grid-cols-2 gap-3 pt-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-[104px] rounded-[18px]" />
        ))}
      </div>
      <div className="skeleton h-[300px] rounded-[18px]" />
    </motion.div>
  )
}

function Shell() {
  const { page } = useStore()
  const reduce = useReducedMotion()
  const wide = () => window.matchMedia('(min-width: 1180px)').matches
  const [collapsed, setCollapsed] = useState(true)
  const [drawer, setDrawer] = useState(false)
  const [shown, setShown] = useState<PageId>(page)
  const [loading, setLoading] = useState(false)
  const [palette, setPalette] = useState(false)
  const [newDeal, setNewDeal] = useState(false)

  // intro: collapsed rail, then the sidebar slides open on wide screens (as in the reel)
  useEffect(() => {
    if (!wide()) return
    const t = setTimeout(() => setCollapsed(false), reduce ? 0 : 1100)
    return () => clearTimeout(t)
  }, [reduce])

  // page change: short skeleton, then content blurs in
  useEffect(() => {
    if (page === shown) return
    setLoading(true)
    const t = setTimeout(() => {
      setShown(page)
      setLoading(false)
      document.getElementById('scroller')?.scrollTo({ top: 0 })
    }, reduce ? 0 : 300)
    return () => clearTimeout(t)
  }, [page, shown, reduce])

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette(true)
      }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])

  const openDeal = useCallback(() => setNewDeal(true), [])
  const P = { dashboard: Dashboard, contacts: Contacts, deals: Deals, tasks: Tasks, calendar: Calendar, reports: Reports, settings: Settings, help: Help }[shown]

  return (
    <div className="app-bg h-dvh p-0 md:p-3 lg:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="shell relative flex h-full overflow-hidden md:rounded-[28px]"
      >
        <div className="hidden md:flex">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        <motion.main
          initial={{ filter: 'blur(14px)', opacity: 0.4 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative z-10 m-1.5 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[22px] bg-white md:ml-0 md:rounded-[24px]"
        >
          <Topbar onSearch={() => setPalette(true)} onNewDeal={openDeal} onMenu={() => setDrawer(true)} />
          <div id="scroller" className="scroll-area flex-1 overflow-y-auto px-4 pb-6 sm:px-7 sm:pb-7">
            <AnimatePresence mode="wait">
              {loading ? <Skeleton key="sk" /> : (
                <motion.div key={shown} className="flex min-h-full flex-col" exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.15 }}>
                  <P onNewDeal={openDeal} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.main>
      </motion.div>

      {/* mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-[70] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawer(false)} />
            <motion.div initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', stiffness: 380, damping: 38 }} className="shell absolute inset-y-0 left-0 rounded-r-[28px] pr-1.5">
              <LayoutGroup id="drawer"><Sidebar mobile collapsed={false} setCollapsed={() => {}} onNavigate={() => setDrawer(false)} /></LayoutGroup>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette open={palette} onClose={() => setPalette(false)} />
      <NewDealModal open={newDeal} onClose={() => setNewDeal(false)} />
      <Toasts />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
