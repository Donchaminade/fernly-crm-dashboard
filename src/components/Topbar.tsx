import { AnimatePresence, motion } from 'motion/react'
import { Bell, CalendarDays, CheckSquare, ChevronRight, Kanban, Menu, Plus, Search, UserPlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NOTIFICATIONS } from '../data'
import { useStore } from '../store'

export const today = new Date()
export const dateLabel = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

function useOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const on = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close()
    document.addEventListener('mousedown', on)
    return () => document.removeEventListener('mousedown', on)
  }, [open, close])
  return ref
}

const pop = { initial: { opacity: 0, y: -6, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -4, scale: 0.98 }, transition: { duration: 0.18 } }

export function Topbar({ onSearch, onNewDeal, onMenu }: { onSearch: () => void; onNewDeal: () => void; onMenu: () => void }) {
  const { go, toast } = useStore()
  const [bell, setBell] = useState(false)
  const [plus, setPlus] = useState(false)
  const [read, setRead] = useState(false)
  const bellRef = useOutside(bell, () => setBell(false))
  const plusRef = useOutside(plus, () => setPlus(false))
  return (
    <header className="flex h-[68px] shrink-0 items-center gap-2 px-4 sm:px-7">
      <button onClick={onMenu} aria-label="Open menu" className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-card md:hidden">
        <Menu className="size-4" />
      </button>
      <button onClick={() => go('calendar')} className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-3 text-[12.5px] font-semibold text-ink shadow-[0_0_0_1px_var(--color-line)] transition hover:bg-card">
        <CalendarDays className="size-3.5 text-muted" />
        {dateLabel}
        <ChevronRight className="size-3.5 text-faint" />
      </button>
      <div className="flex-1" />
      <button onClick={onSearch} className="hidden h-9 w-[260px] cursor-pointer items-center gap-2 rounded-full bg-card px-3.5 text-[12px] text-faint transition hover:bg-[#eef2f0] lg:flex">
        <Search className="size-3.5" />
        <span className="flex-1 truncate text-left">Search contacts, deals, actions…</span>
        <kbd className="text-[10px] font-semibold text-muted">⌘K</kbd>
      </button>
      <button onClick={onSearch} aria-label="Search" className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-card lg:hidden">
        <Search className="size-4" />
      </button>
      <div ref={bellRef} className="relative">
        <button onClick={() => setBell((v) => !v)} aria-label="Notifications" className="relative flex size-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-card">
          <Bell className="size-4" />
          {!read && <span className="absolute top-2 right-2.5 size-2 rounded-full border-2 border-white bg-[#e5484d]" />}
        </button>
        <AnimatePresence>
          {bell && (
            <motion.div {...pop} className="absolute top-11 right-0 z-50 w-[300px] origin-top-right rounded-2xl bg-white p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,.3),0_0_0_1px_var(--color-line)]">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-[13px] font-bold">Notifications</span>
                <button onClick={() => setRead(true)} className="cursor-pointer text-[11.5px] font-semibold text-brand-700">
                  Mark all read
                </button>
              </div>
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="flex items-start gap-2.5 rounded-xl px-2 py-2 hover:bg-card">
                  <span className={`mt-1.5 size-2 shrink-0 rounded-full ${read ? 'bg-line' : n.tone === 'green' ? 'bg-brand-500' : n.tone === 'amber' ? 'bg-[#e8913a]' : 'bg-[#e5484d]'}`} />
                  <div>
                    <div className="text-[12.5px] font-semibold">{n.title}</div>
                    <div className="text-[11px] text-muted">{n.time}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div ref={plusRef} className="relative">
        <motion.button whileHover={{ rotate: 90 }} whileTap={{ scale: 0.92 }} onClick={() => setPlus((v) => !v)} aria-label="Create" className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-brand-700 text-white shadow-[0_8px_18px_-6px_var(--a-700),inset_0_1px_0_rgba(255,255,255,.3)]">
          <Plus className="size-4" strokeWidth={2.5} />
        </motion.button>
        <AnimatePresence>
          {plus && (
            <motion.div {...pop} className="absolute top-12 right-0 z-50 w-[200px] origin-top-right rounded-2xl bg-white p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,.3),0_0_0_1px_var(--color-line)]">
              {[
                { l: 'New deal', i: Kanban, f: onNewDeal },
                { l: 'New task', i: CheckSquare, f: () => { go('tasks'); setTimeout(() => window.dispatchEvent(new Event('fernly:new-task')), 400) } },
                { l: 'New contact', i: UserPlus, f: () => { go('contacts'); toast('Contact form opened (demo)') } },
              ].map(({ l, i: I, f }) => (
                <button key={l} onClick={() => { setPlus(false); f() }} className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-semibold hover:bg-card">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700"><I className="size-3.5" /></span>
                  {l}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
