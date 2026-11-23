import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, GripVertical, Plus } from 'lucide-react'
import { useState } from 'react'
import { Avatar, Item, Page, PageHeader, PrimaryButton } from '../components/ui'
import { STAGES, fmtK, type Stage } from '../data'
import { useStore } from '../store'

const DOT: Record<Stage, string> = { Lead: 'bg-[#9aa39e]', Qualified: 'bg-[#4f7ff0]', Proposal: 'bg-[#e8913a]', Negotiation: 'bg-[#9466ec]', Won: 'bg-brand-500' }
const ini = (n: string) => n.split(' ').map((x) => x[0]).join('')

export default function Deals({ onNewDeal }: { onNewDeal: () => void }) {
  const { deals, moveDeal, toast } = useStore()
  const [drag, setDrag] = useState<string | null>(null)
  const [over, setOver] = useState<Stage | null>(null)
  const move = (id: string, dir: -1 | 1) => {
    const d = deals.find((x) => x.id === id)
    if (!d) return
    const s = STAGES[STAGES.indexOf(d.stage) + dir]
    if (!s) return
    moveDeal(id, s)
    toast(`${d.name} → ${s}`)
  }
  const open = deals.filter((d) => d.stage !== 'Won')
  return (
    <Page className="space-y-4 pt-1">
      <PageHeader
        eyebrow="Pipeline"
        title="Deals"
        sub={`${open.length} open deals worth ${fmtK(open.reduce((a, d) => a + d.value, 0))}. Drag a card or use the arrows to move it — Reports update live.`}
        actions={
          <PrimaryButton onClick={onNewDeal}>
            <Plus className="size-4" strokeWidth={2.5} /> New deal
          </PrimaryButton>
        }
      />
      <Item>
        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:-mx-7 sm:px-7 xl:mx-0 xl:grid xl:grid-cols-5 xl:overflow-visible xl:px-0">
          {STAGES.map((s) => {
            const items = deals.filter((d) => d.stage === s)
            return (
              <div
                key={s}
                onDragOver={(e) => {
                  e.preventDefault()
                  setOver(s)
                }}
                onDragLeave={() => setOver((o) => (o === s ? null : o))}
                onDrop={() => {
                  if (drag) {
                    const d = deals.find((x) => x.id === drag)
                    if (d && d.stage !== s) {
                      moveDeal(drag, s)
                      toast(`${d.name} → ${s}`)
                    }
                  }
                  setDrag(null)
                  setOver(null)
                }}
                className={`flex w-[250px] shrink-0 snap-start flex-col rounded-[18px] p-2 transition-colors xl:w-auto ${over === s ? 'bg-brand-100' : 'bg-card'}`}
              >
                <div className="flex items-center gap-2 px-2 pt-1.5 pb-2">
                  <span className={`size-2 rounded-full ${DOT[s]}`} />
                  <span className="text-[12.5px] font-bold">{s}</span>
                  <span className="text-[11.5px] text-faint">{items.length}</span>
                  <span className="ml-auto text-[11.5px] font-bold text-muted">{fmtK(items.reduce((a, d) => a + d.value, 0))}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {items.map((d) => (
                    <motion.div
                      layout
                      layoutId={d.id}
                      key={d.id}
                      draggable
                      onDragStart={() => setDrag(d.id)}
                      onDragEnd={() => setDrag(null)}
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      className={`group cursor-grab rounded-[14px] bg-white p-3 shadow-[0_1px_0_rgba(15,26,20,.04)] transition-shadow hover:shadow-[0_12px_26px_-16px_rgba(15,26,20,.4)] active:cursor-grabbing ${drag === d.id ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start gap-1.5">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[12.5px] font-bold">{d.name}</div>
                          <div className="truncate text-[11px] text-muted">{d.company}</div>
                        </div>
                        <GripVertical className="size-3.5 shrink-0 text-faint opacity-0 transition group-hover:opacity-100" />
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[14px] font-extrabold">{fmtK(d.value)}</span>
                        <span className="text-[10.5px] font-semibold text-muted">{d.close}</span>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-card">
                        <div className="h-full rounded-full bg-brand-500" style={{ width: `${d.prob}%` }} />
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] text-muted">
                          <Avatar initials={ini(d.owner)} color="#1f7a4a" size={20} />
                          {d.prob}%
                        </span>
                        <span className="flex gap-1">
                          <button aria-label="Move back" disabled={s === 'Lead'} onClick={() => move(d.id, -1)} className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-card text-muted transition hover:bg-brand-100 hover:text-brand-700 disabled:cursor-default disabled:opacity-30">
                            <ChevronLeft className="size-3.5" />
                          </button>
                          <button aria-label="Move forward" disabled={s === 'Won'} onClick={() => move(d.id, 1)} className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-card text-muted transition hover:bg-brand-100 hover:text-brand-700 disabled:cursor-default disabled:opacity-30">
                            <ChevronRight className="size-3.5" />
                          </button>
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Item>
    </Page>
  )
}
