import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, CheckSquare, ChevronDown, Clock, Mail, Phone, Plus, Video } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Card, IconChip, Item, Page, PageHeader, Priority, PrimaryButton, Ring, Segmented } from '../components/ui'
import type { Task, TaskType } from '../data'
import { useStore } from '../store'

export const TYPE_ICON = { call: Phone, email: Mail, meeting: Video, todo: CheckSquare }
export const TYPE_TONE = { call: 'green', email: 'blue', meeting: 'violet', todo: 'green' } as const
const FILTERS = ['All', 'Calls', 'Emails', 'Meetings', 'To-dos'] as const
const FILTER_TYPE: Record<string, TaskType | null> = { All: null, Calls: 'call', Emails: 'email', Meetings: 'meeting', 'To-dos': 'todo' }

function Row({ t }: { t: Task }) {
  const { toggleTask } = useStore()
  const I = TYPE_ICON[t.type]
  const overdue = t.when === 'overdue'
  return (
    <motion.li layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="group flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-white">
      <button onClick={() => toggleTask(t.id)} aria-label={t.done ? 'Mark as not done' : 'Mark done'} className={`flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-[5px] border transition-colors ${t.done ? 'border-brand-700 bg-brand-700 text-white' : 'border-[#cfd8d3] bg-white hover:border-brand-500'}`}>
        <AnimatePresence>{t.done && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="size-3" strokeWidth={3.5} /></motion.span>}</AnimatePresence>
      </button>
      <IconChip tone={TYPE_TONE[t.type]}>
        <I className="size-3.5" />
      </IconChip>
      <div className="min-w-0 flex-1">
        <div className={`truncate text-[13px] font-semibold transition-colors ${t.done ? 'text-faint line-through' : ''}`}>{t.title}</div>
        <div className="flex min-w-0 items-center gap-1.5 text-[11px]">
          <Clock className={`size-3 shrink-0 ${overdue ? 'text-[#d94046]' : 'text-faint'}`} />
          <span className={`shrink-0 ${overdue ? 'font-semibold text-[#d94046]' : 'text-muted'}`}>{t.meta}</span>
          {t.contact && <span className="truncate text-brand-700">{t.contact} · {t.company}</span>}
        </div>
      </div>
      <Priority p={t.priority} />
    </motion.li>
  )
}

export default function Tasks() {
  const { tasks, addTask, toggleTask, toast } = useStore()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [type, setType] = useState<TaskType>('todo')
  const [title, setTitle] = useState('')
  const [when, setWhen] = useState<'today' | 'upcoming'>('today')
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const on = () => input.current?.focus()
    window.addEventListener('fernly:new-task', on)
    return () => window.removeEventListener('fernly:new-task', on)
  }, [])

  const ft = FILTER_TYPE[filter]
  const list = tasks.filter((t) => !ft || t.type === ft)
  const groups = [
    { id: 'overdue', label: 'Overdue', tone: 'text-[#d94046]' },
    { id: 'today', label: 'Today', tone: 'text-brand-700' },
    { id: 'upcoming', label: 'Upcoming', tone: 'text-ink' },
  ] as const
  const todays = tasks.filter((t) => t.when === 'today')
  const doneToday = todays.filter((t) => t.done).length
  const pct = Math.round((doneToday / Math.max(1, todays.length)) * 100)
  const next = tasks.find((t) => !t.done && t.when === 'overdue') ?? tasks.find((t) => !t.done)
  const openCount = tasks.filter((t) => !t.done && t.when !== 'upcoming').length
  const upcoming = tasks.filter((t) => !t.done && t.when === 'upcoming').length

  const submit = () => {
    if (!title.trim()) return
    addTask({ title: title.trim(), type, when, meta: when === 'today' ? 'Today · 6:00 PM' : 'Tomorrow · 9:00 AM', contact: '', company: '', priority: 'Medium' })
    setTitle('')
    toast('Task added')
  }

  return (
    <Page className="space-y-4 pt-1">
      <PageHeader
        eyebrow="Follow-ups"
        title="Tasks"
        sub={`${openCount} open for today, ${upcoming} coming up. Check things off as you go.`}
        actions={
          <PrimaryButton onClick={() => input.current?.focus()}>
            <Plus className="size-4" strokeWidth={2.5} /> New task
          </PrimaryButton>
        }
      />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_250px] xl:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-3">
          <Item>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit()
              }}
              className="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-[0_0_0_1px_var(--color-line),0_6px_18px_-12px_rgba(15,26,20,.25)]"
            >
              <div className="hidden items-center gap-0.5 sm:flex">
                {(Object.keys(TYPE_ICON) as TaskType[]).map((k) => {
                  const I = TYPE_ICON[k]
                  return (
                    <button type="button" key={k} onClick={() => setType(k)} aria-label={k} className={`flex size-8 cursor-pointer items-center justify-center rounded-lg transition ${type === k ? 'bg-brand-100 text-brand-700' : 'text-faint hover:text-ink'}`}>
                      <I className="size-3.5" />
                    </button>
                  )
                })}
              </div>
              <input ref={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task and press Enter…" className="h-9 min-w-0 flex-1 bg-transparent px-2 text-[13px] outline-none" />
              <label className="relative hidden min-[420px]:block">
                <select value={when} onChange={(e) => setWhen(e.target.value as 'today' | 'upcoming')} className="h-9 cursor-pointer appearance-none rounded-xl bg-card pr-8 pl-3 text-[12px] font-semibold outline-none">
                  <option value="today">Today</option>
                  <option value="upcoming">Upcoming</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted" />
              </label>
              <button aria-label="Add task" className={`flex size-9 cursor-pointer items-center justify-center rounded-xl text-white transition ${title.trim() ? 'bg-brand-700' : 'bg-brand-300'}`}>
                <ArrowRight className="size-4" />
              </button>
            </form>
          </Item>
          <Item>
            <Segmented id="taskf" options={FILTERS} value={filter} onChange={setFilter} />
          </Item>
          {groups.map((g) => {
            const items = list.filter((t) => t.when === g.id)
            if (!items.length) return null
            return (
              <Item key={g.id}>
                <Card className="p-2.5">
                  <div className="flex items-center gap-2 px-2.5 pt-1 pb-1.5 text-[12px] font-bold">
                    <span className={g.tone}>{g.label}</span>
                    <span className="text-faint">{items.length}</span>
                  </div>
                  <motion.ul layout>
                    <AnimatePresence initial={false}>
                      {items.map((t) => (
                        <Row key={t.id} t={t} />
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </Card>
              </Item>
            )
          })}
          {!list.length && (
            <Item>
              <Card className="p-10 text-center text-[13px] text-muted">No {filter.toLowerCase()} yet — add one above.</Card>
            </Item>
          )}
        </div>

        <div className="space-y-3 lg:sticky lg:top-0 lg:self-start">
          <Item>
            <Card className="flex items-center gap-4 p-4">
              <Ring pct={pct} size={72} stroke={6} color="var(--a-500)" track="#e3e9e5">
                <div className="text-center leading-none">
                  <div className="text-[15px] font-extrabold">{pct}%</div>
                  <div className="mt-0.5 text-[9.5px] text-muted">today</div>
                </div>
              </Ring>
              <div>
                <div className="text-[13.5px] font-bold">Daily progress</div>
                <div className="text-[11.5px] text-muted">{doneToday} of {todays.length} tasks done</div>
              </div>
            </Card>
          </Item>
          <Item>
            <Card className="p-4">
              <div className="text-[13.5px] font-bold">By type</div>
              <ul className="mt-3 space-y-3">
                {(['call', 'email', 'meeting', 'todo'] as TaskType[]).map((k) => {
                  const I = TYPE_ICON[k]
                  const all = tasks.filter((t) => t.type === k)
                  const open = all.filter((t) => !t.done).length
                  return (
                    <li key={k} className="flex items-center gap-2.5 text-[12.5px]">
                      <IconChip tone={TYPE_TONE[k]}>
                        <I className="size-3.5" />
                      </IconChip>
                      <span className="font-medium">{{ call: 'Calls', email: 'Emails', meeting: 'Meetings', todo: 'To-dos' }[k]}</span>
                      <span className="ml-auto font-bold">
                        {open}
                        <span className="font-medium text-faint">/{all.length}</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Card>
          </Item>
          {next && (
            <Item>
              <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-brand-700 to-brand-900 p-4 text-white">
                <div className="absolute -top-10 -right-10 size-32 rounded-full bg-white/10 blur-2xl" />
                <div className="relative text-[10.5px] font-bold tracking-[0.14em] text-white/70">↗ UP NEXT</div>
                <AnimatePresence mode="wait">
                  <motion.div key={next.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="relative">
                    <div className="mt-1.5 text-[14.5px] font-bold">{next.title}</div>
                    <div className="text-[11.5px] text-white/65">{next.meta}</div>
                  </motion.div>
                </AnimatePresence>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    toggleTask(next.id)
                    toast(`“${next.title}” done`)
                  }}
                  className="relative mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white text-[13px] font-semibold text-ink transition hover:bg-white/90"
                >
                  <Check className="size-4" /> Mark done
                </motion.button>
              </div>
            </Item>
          )}
        </div>
      </div>
    </Page>
  )
}
