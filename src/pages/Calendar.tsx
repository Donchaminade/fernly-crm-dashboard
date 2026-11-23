import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Card, IconChip, Item, Page, PageHeader, PrimaryButton } from '../components/ui'
import { CALENDAR_EVENTS } from '../data'
import { useStore } from '../store'
import { TYPE_ICON, TYPE_TONE } from './Tasks'

const today = new Date()
const monday = new Date(today)
monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
const week = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(monday)
  d.setDate(monday.getDate() + i)
  return d
})

export default function Calendar() {
  const { toast } = useStore()
  const [day, setDay] = useState(today.getDate())
  // seed events are anchored to Nov 23–29; map them onto the current week
  const offset = week[0].getDate() - 23
  const events = CALENDAR_EVENTS.map((e) => ({ ...e, day: e.day + offset }))
  const list = events.filter((e) => e.day === day)
  const first = new Date(today.getFullYear(), today.getMonth(), 1)
  const lead = (first.getDay() + 6) % 7
  const days = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  return (
    <Page className="space-y-4 pt-1">
      <PageHeader
        eyebrow="Schedule"
        title="Calendar"
        sub={`${events.length} meetings and calls this week, ${events.filter((e) => e.day === today.getDate()).length} of them today.`}
        actions={
          <PrimaryButton onClick={() => toast('Event scheduled (demo)')}>
            <Plus className="size-4" strokeWidth={2.5} /> New event
          </PrimaryButton>
        }
      />
      <Item className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {week.map((d) => {
          const n = d.getDate()
          const on = n === day
          const count = events.filter((e) => e.day === n).length
          return (
            <button key={n} onClick={() => setDay(n)} className={`relative flex cursor-pointer flex-col items-center rounded-2xl py-2.5 transition-colors sm:py-3 ${on ? 'text-white' : 'bg-card hover:bg-brand-50'}`}>
              {on && <motion.span layoutId="cal-day" className="absolute inset-0 rounded-2xl bg-brand-700" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className={`relative text-[10.5px] font-semibold uppercase ${on ? 'text-white/70' : 'text-muted'}`}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="relative text-[17px] font-extrabold sm:text-[20px]">{n}</span>
              <span className="relative mt-1 flex h-1.5 gap-0.5">
                {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
                  <span key={i} className={`size-1.5 rounded-full ${on ? 'bg-white/80' : 'bg-brand-500'}`} />
                ))}
              </span>
            </button>
          )
        })}
      </Item>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_290px]">
        <Item>
          <Card className="p-4">
            <div className="px-1 text-[14px] font-bold">{week.find((d) => d.getDate() === day)?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            <AnimatePresence mode="wait">
              <motion.ul key={day} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 space-y-2">
                {list.map((e) => {
                  const I = TYPE_ICON[e.type]
                  return (
                    <li key={e.title} className="flex items-center gap-3 rounded-xl bg-white p-3">
                      <div className="w-[52px] shrink-0 text-[12px] font-bold">
                        {e.time}
                        <div className="text-[10.5px] font-medium text-faint">{e.end}</div>
                      </div>
                      <span className="h-9 w-1 rounded-full bg-brand-500" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold">{e.title}</div>
                        <div className="truncate text-[11.5px] text-muted">with {e.who}</div>
                      </div>
                      <IconChip tone={TYPE_TONE[e.type]}><I className="size-3.5" /></IconChip>
                    </li>
                  )
                })}
                {!list.length && <li className="rounded-xl bg-white p-8 text-center text-[13px] text-muted">Nothing booked — a good day for prospecting.</li>}
              </motion.ul>
            </AnimatePresence>
          </Card>
        </Item>
        <Item>
          <Card className="p-4">
            <div className="text-[14px] font-bold">{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10.5px] font-semibold text-faint">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1 text-center text-[12px]">
              {Array.from({ length: lead }).map((_, i) => <span key={`l${i}`} />)}
              {Array.from({ length: days }).map((_, i) => {
                const n = i + 1
                const inWeek = week.some((d) => d.getDate() === n && d.getMonth() === today.getMonth())
                return (
                  <button key={n} disabled={!inWeek} onClick={() => setDay(n)} className={`flex aspect-square items-center justify-center rounded-lg font-semibold transition ${n === day ? 'bg-brand-700 text-white' : inWeek ? 'cursor-pointer bg-white hover:bg-brand-100' : 'text-muted'} ${n === today.getDate() && n !== day ? 'ring-2 ring-brand-500' : ''}`}>
                    {n}
                  </button>
                )
              })}
            </div>
          </Card>
        </Item>
      </div>
    </Page>
  )
}
