import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, CheckSquare, ChevronLeft, CircleHelp, Kanban, LayoutGrid, LogOut, PieChart, SlidersHorizontal, Users } from 'lucide-react'
import type { ComponentType } from 'react'
import { QUOTA, USER, fmtK0, type PageId } from '../data'
import { useStore } from '../store'
import { FernMark } from './Logo'
import { Ring } from './ui'

type NavItem = { id: PageId; label: string; icon: ComponentType<{ className?: string; strokeWidth?: number }> }
export const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'deals', label: 'Deals', icon: Kanban },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'reports', label: 'Reports', icon: PieChart },
]
const BOTTOM: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
  { id: 'help', label: 'Help center', icon: CircleHelp },
]

const spring = { type: 'spring', stiffness: 380, damping: 36 } as const

function NavButton({ it, collapsed, badge, onNavigate, joined = true }: { it: NavItem; collapsed: boolean; badge?: number; onNavigate?: () => void; joined?: boolean }) {
  const { page, go } = useStore()
  const active = page === it.id
  const Icon = it.icon
  return (
    <div className="group relative flex h-[38px] items-center pl-3">
      {active && (
        <motion.span
          layoutId="nav-tab"
          transition={spring}
          className={`absolute inset-y-0 bg-white ${collapsed ? 'right-3 left-3 rounded-full' : joined ? 'tab-join right-0 left-3 rounded-l-full' : 'right-3 left-3 rounded-full'}`}
        />
      )}
      <button
        onClick={() => {
          go(it.id)
          onNavigate?.()
        }}
        aria-label={it.label}
        aria-current={active ? 'page' : undefined}
        className={`relative z-10 flex h-[38px] cursor-pointer items-center gap-2.5 rounded-full text-[13px] font-semibold transition-colors ${collapsed ? 'w-[60px] justify-center' : 'px-3'} ${active ? 'text-ink' : 'glass-pill text-white/85 hover:text-white'}`}
      >
        <Icon className="size-[15px] shrink-0" strokeWidth={2} />
        {!collapsed && <span className="whitespace-nowrap">{it.label}</span>}
        {badge ? (
          <span className={`inline-flex size-4 items-center justify-center rounded-full text-[9px] font-bold ${active ? 'bg-ink text-white' : 'bg-[#e8913a] text-white'} ${collapsed ? 'absolute top-1 right-3 size-2 text-[0px]' : ''}`}>{badge}</span>
        ) : null}
      </button>
      {collapsed && (
        <span className="pointer-events-none absolute top-1/2 left-[78px] z-50 -translate-y-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-[12px] font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {it.label}
        </span>
      )}
    </div>
  )
}

export function Sidebar({ collapsed, setCollapsed, mobile, onNavigate }: { collapsed: boolean; setCollapsed: (v: boolean) => void; mobile?: boolean; onNavigate?: () => void }) {
  const { tasks, toast, deals } = useStore()
  const won = deals.filter((d) => d.stage === 'Won').reduce((a, d) => a + d.value, 0)
  const due = tasks.filter((t) => !t.done && (t.when === 'today' || t.when === 'overdue')).length
  const pct = Math.min(100, Math.round((won / QUOTA.target) * 100))
  const c = mobile ? false : collapsed
  return (
    <motion.aside
      initial={false}
      animate={{ width: c ? 84 : 216 }}
      transition={spring}
      className="relative flex h-full shrink-0 flex-col py-4 text-white"
    >
      {/* brand */}
      <div className={`flex items-center gap-2.5 pr-3 ${c ? 'justify-center pl-3' : 'pl-4'}`}>
        <button
          onClick={() => c && setCollapsed(false)}
          aria-label={c ? 'Expand sidebar' : 'Fernly'}
          className="glass-pill flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-white/25 to-white/5"
        >
          <FernMark className="size-[18px]" />
        </button>
        <AnimatePresence initial={false}>
          {!c && (
            <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.2 }} className="min-w-0 flex-1 leading-tight">
              <div className="text-[15px] font-bold">Fernly</div>
              <div className="text-[10.5px] text-white/55">Sales CRM</div>
            </motion.div>
          )}
        </AnimatePresence>
        {!c && !mobile && (
          <button onClick={() => setCollapsed(true)} aria-label="Collapse sidebar" className="glass-pill flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full">
            <ChevronLeft className="size-3.5" />
          </button>
        )}
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2">
        {NAV.map((it) => (
          <NavButton key={it.id} it={it} collapsed={c} badge={it.id === 'tasks' ? due : undefined} onNavigate={onNavigate} joined={!mobile} />
        ))}
      </nav>

      <div className="mt-3 flex flex-col gap-2">
        <div className={`mx-3 flex items-center gap-2.5 rounded-2xl bg-black/25 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)] ${c ? 'justify-center' : ''}`}>
          <Ring pct={pct} size={36} stroke={3.5} color="var(--a-300)">
            <span className="text-[8.5px] font-bold">{pct}%</span>
          </Ring>
          {!c && (
            <div className="min-w-0 leading-tight">
              <div className="text-[12px] font-semibold">Q4 quota</div>
              <div className="text-[10.5px] text-white/55">{fmtK0(won)} of {fmtK0(QUOTA.target)}</div>
            </div>
          )}
        </div>
        {BOTTOM.map((it) => (
          <NavButton key={it.id} it={it} collapsed={c} onNavigate={onNavigate} joined={!mobile} />
        ))}
        <div className={`mt-2 flex items-center gap-2.5 ${c ? 'justify-center px-3' : 'pr-3 pl-4'}`}>
          <span className="relative shrink-0">
            <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f4a06a] to-[#d8673f] text-[11px] font-bold">{USER.initials}</span>
            <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-[var(--sb-3)] bg-[#3fdc7e]" />
          </span>
          {!c && (
            <>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-[12.5px] font-semibold">{USER.name}</div>
                <div className="truncate text-[10.5px] text-white/55">{USER.role}</div>
              </div>
              <button onClick={() => toast('Signed out (demo) — welcome back, Ava!')} aria-label="Sign out" className="glass-pill flex size-7 cursor-pointer items-center justify-center rounded-full">
                <LogOut className="size-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
