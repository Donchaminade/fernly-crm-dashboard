import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, CornerDownLeft, Kanban, Search, User, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { STAGES, type PageId, type Stage } from '../data'
import { useStore } from '../store'
import { NAV } from './Sidebar'
import { PrimaryButton } from './ui'

export function Modal({ open, onClose, children, className = '' }: { open: boolean; onClose: () => void; children: ReactNode; className?: string }) {
  useEffect(() => {
    if (!open) return
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 pt-[12vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-[#030907]/45 backdrop-blur-md" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 18, scale: 0.97, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className={`relative w-full rounded-[24px] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,.5)] ${className}`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function NewDealModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addDeal, toast, go } = useStore()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [value, setValue] = useState('25000')
  const [stage, setStage] = useState<Stage>('Lead')
  const submit = () => {
    if (!name.trim() || !company.trim()) return
    addDeal({ name: name.trim(), company: company.trim(), value: Math.max(0, Number(value) || 0), stage, owner: 'Ava Patel', close: 'Dec 31', prob: stage === 'Won' ? 100 : 20 })
    toast(`Deal “${name.trim()}” created`)
    setName('')
    setCompany('')
    onClose()
    go('deals')
  }
  const field = 'mt-1.5 h-11 w-full rounded-xl bg-card px-3.5 text-[13px] outline-none ring-brand-500/40 transition focus:bg-white focus:ring-2'
  return (
    <Modal open={open} onClose={onClose} className="max-w-md p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-bold tracking-[0.14em] text-brand-700 uppercase">Pipeline</div>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight">New deal</h2>
        </div>
        <button onClick={onClose} aria-label="Close" className="flex size-8 cursor-pointer items-center justify-center rounded-full hover:bg-card">
          <X className="size-4" />
        </button>
      </div>
      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <label className="block text-[12px] font-semibold text-muted">
          Deal name
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pinecrest expansion" className={field} />
        </label>
        <label className="block text-[12px] font-semibold text-muted">
          Company
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Pinecrest Bank" className={field} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-[12px] font-semibold text-muted">
            Value ($)
            <input inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))} className={field} />
          </label>
          <label className="block text-[12px] font-semibold text-muted">
            Stage
            <select value={stage} onChange={(e) => setStage(e.target.value as Stage)} className={field}>
              {STAGES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="h-10 cursor-pointer rounded-full px-4 text-[13px] font-semibold hover:bg-card">
            Cancel
          </button>
          <PrimaryButton>
            <Check className="size-4" /> Create deal
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  )
}

type Hit = { id: string; label: string; sub: string; kind: 'page' | 'contact' | 'deal'; to: PageId }

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { contacts, deals, go } = useStore()
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (open) {
      setQ('')
      setI(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])
  const hits = useMemo<Hit[]>(() => {
    const s = q.toLowerCase().trim()
    const pages: Hit[] = [...NAV, { id: 'settings' as PageId, label: 'Settings' }, { id: 'help' as PageId, label: 'Help center' }].map((n) => ({ id: `p-${n.id}`, label: n.label, sub: 'Go to page', kind: 'page', to: n.id }))
    const cs: Hit[] = contacts.map((c) => ({ id: c.id, label: c.name, sub: `${c.title} · ${c.company}`, kind: 'contact', to: 'contacts' }))
    const ds: Hit[] = deals.map((d) => ({ id: d.id, label: d.name, sub: `${d.company} · ${d.stage}`, kind: 'deal', to: 'deals' }))
    const all = [...pages, ...cs, ...ds]
    return (s ? all.filter((h) => `${h.label} ${h.sub}`.toLowerCase().includes(s)) : [...pages.slice(0, 6), ...cs.slice(0, 3)]).slice(0, 8)
  }, [q, contacts, deals])
  const pick = (h?: Hit) => {
    if (!h) return
    go(h.to)
    onClose()
  }
  return (
    <Modal open={open} onClose={onClose} className="max-w-lg overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line px-5">
        <Search className="size-4 text-muted" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setI(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setI((v) => Math.min(v + 1, hits.length - 1))
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              setI((v) => Math.max(v - 1, 0))
            }
            if (e.key === 'Enter') pick(hits[i])
          }}
          placeholder="Search contacts, deals, actions…"
          className="h-14 flex-1 bg-transparent text-[14px] outline-none"
        />
        <kbd className="rounded-md bg-card px-1.5 py-0.5 text-[10px] font-semibold text-muted">ESC</kbd>
      </div>
      <ul className="max-h-[50vh] overflow-y-auto p-2">
        {hits.length === 0 && <li className="px-3 py-8 text-center text-[13px] text-muted">No results for “{q}”</li>}
        {hits.map((h, k) => (
          <li key={h.id}>
            <button onMouseEnter={() => setI(k)} onClick={() => pick(h)} className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left ${i === k ? 'bg-card' : ''}`}>
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                {h.kind === 'page' ? <ArrowRight className="size-4" /> : h.kind === 'contact' ? <User className="size-4" /> : <Kanban className="size-4" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold">{h.label}</span>
                <span className="block truncate text-[11.5px] text-muted">{h.sub}</span>
              </span>
              {i === k && <CornerDownLeft className="size-3.5 text-muted" />}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  )
}

export function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap text-white shadow-2xl">
            <span className="flex size-5 items-center justify-center rounded-full bg-brand-500">
              <Check className="size-3" strokeWidth={3} />
            </span>
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
