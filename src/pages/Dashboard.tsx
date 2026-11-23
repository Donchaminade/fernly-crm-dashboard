import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, CalendarClock, Trophy, Check, ChevronRight, CircleDollarSign, Kanban, Plus, SlidersHorizontal, Sparkles, Target, Users } from 'lucide-react'
import { useMemo, useRef, useState, useEffect } from 'react'
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip, Counter, Delta, GhostButton, IconChip, Item, Page, PageHeader, PrimaryButton, Segmented, Sparkline, Card } from '../components/ui'
import { INSIGHTS, KPIS_DASH, QUOTA, REVENUE, THEMES, USER, fmtK } from '../data'
import { useStore } from '../store'

const ICONS = { dollar: CircleDollarSign, kanban: Kanban, target: Target, users: Users, calendar: CalendarClock, trophy: Trophy }

export function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export function KpiCard({ icon, label, value, prefix = '', suffix = '', unit, note, delta, up = true, spark, down, decimals }: { icon: keyof typeof ICONS | 'trophy' | 'clock' | 'gauge'; label: string; value: number; prefix?: string; suffix?: string; unit?: string; note?: string; delta: string; up?: boolean; spark: readonly number[]; down?: boolean; decimals?: number }) {
  const { theme } = useStore()
  const I = ICONS[icon as keyof typeof ICONS] ?? Target
  return (
    <Item>
      <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
        <Card className="group flex h-full flex-col p-4 transition-shadow hover:shadow-[0_14px_30px_-18px_rgba(15,26,20,.35)]">
          <div className="flex items-center gap-2 text-[12px] font-medium text-muted">
            <IconChip>
              <I className="size-3.5" />
            </IconChip>
            {label}
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-[24px] leading-none font-extrabold tracking-[-0.02em]">
              <Counter value={value} decimals={decimals ?? (value % 1 ? 1 : 0)} prefix={prefix} suffix={suffix} />
            </span>
            {unit && <span className="text-[13px] font-semibold text-muted">{unit}</span>}
            {note && <span className="truncate text-[11px] text-faint">{note}</span>}
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <Delta up={up} arrowDown={down}>{delta}</Delta>
            <Sparkline data={spark} color={theme.a500} down={down} />
          </div>
        </Card>
      </motion.div>
    </Item>
  )
}

const toneMap = { amber: 'amber', green: 'green', red: 'red', rose: 'rose' } as const

function Insights() {
  const { go } = useStore()
  return (
    <Item>
      <div className="flex flex-col gap-2 rounded-[18px] bg-brand-50 p-2 sm:flex-row">
        <div className="flex shrink-0 items-center gap-2 px-3 py-2 sm:w-[84px] sm:flex-col sm:justify-center sm:gap-2.5 sm:px-0">
          <motion.span animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} className="flex size-8 items-center justify-center rounded-[10px] bg-brand-700 text-white shadow-[0_6px_14px_-6px_var(--a-700)]">
            <Sparkles className="size-4" />
          </motion.span>
          <span className="text-[10px] font-bold tracking-[0.14em] text-brand-700">INSIGHTS</span>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {INSIGHTS.map((s) => {
            const I = ICONS[s.icon as keyof typeof ICONS]
            return (
              <motion.button key={s.id} whileHover={{ y: -2 }} onClick={() => go(s.to)} className="flex cursor-pointer gap-2.5 rounded-[14px] bg-white p-3 text-left shadow-[0_1px_0_rgba(15,26,20,.04)] transition-shadow hover:shadow-[0_10px_24px_-14px_rgba(15,26,20,.35)]">
                <IconChip tone={toneMap[s.tone as keyof typeof toneMap]}>
                  <I className="size-3.5" />
                </IconChip>
                <span className="min-w-0">
                  <span className="block text-[12px] leading-snug text-muted [&_b]:font-bold [&_b]:text-ink" dangerouslySetInnerHTML={{ __html: s.html }} />
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-bold text-brand-700">
                    {s.action} <ArrowRight className="size-3" />
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </Item>
  )
}

function RevenueChart() {
  const { theme } = useStore()
  const [mode, setMode] = useState<'Revenue' | 'Deals'>('Revenue')
  const rev = mode === 'Revenue'
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] font-bold">{rev ? 'Revenue vs target' : 'Deals vs target'}</div>
          <div className="text-[11.5px] text-muted">{rev ? 'Monthly closed-won revenue against plan' : 'Monthly closed-won deals against plan'}</div>
        </div>
        <Segmented id="rev" options={['Revenue', 'Deals'] as const} value={mode} onChange={setMode} />
      </div>
      <div className="mt-3 h-[230px] lg:h-auto lg:min-h-[230px] lg:flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart key={mode} data={REVENUE} margin={{ top: 10, right: 6, left: -4, bottom: 0 }}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={theme.a500} stopOpacity={0.35} />
                <stop offset="1" stopColor={theme.a500} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e6ebe8" strokeDasharray="0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10.5, fill: '#9aa39e' }} dy={6} interval={0} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10.5, fill: '#9aa39e' }} width={54} domain={rev ? [50, 200] : [0, 16]} ticks={rev ? [50, 100, 150, 200] : [0, 4, 8, 12, 16]} tickFormatter={(v) => (rev ? `$${v}K` : `${v}`)} />
            <Tooltip cursor={{ stroke: theme.a300, strokeDasharray: '3 3' }} content={<ChartTooltip fmt={(v) => (rev ? `$${v}K` : `${v} deals`)} />} />
            <Line dataKey={rev ? 'target' : 'dealTarget'} name="target" stroke="#9fb3a8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} isAnimationActive animationDuration={900} />
            <Area
              dataKey={rev ? 'revenue' : 'deals'}
              name={rev ? 'revenue' : 'deals'}
              type="monotone"
              stroke={theme.a700}
              strokeWidth={2.4}
              fill="url(#revFill)"
              animationDuration={1100}
              activeDot={{ r: 5, stroke: theme.a700, strokeWidth: 2.5, fill: '#fff' }}
              dot={(p: { cx?: number; cy?: number; index?: number }) => (p.index === 10 ? <circle key="last" cx={p.cx} cy={p.cy} r={4.5} fill="#fff" stroke={theme.a700} strokeWidth={2.5} /> : <g key={p.index} />)}
            />
            <Line dataKey={rev ? 'forecast' : 'dealForecast'} name="forecast" stroke={theme.a700} strokeWidth={2} strokeDasharray="2 4" dot={false} activeDot={false} connectNulls={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

function Gauge({ pct }: { pct: number }) {
  const { theme } = useStore()
  const r = 80
  const len = Math.PI * r
  const arc = `M 20 100 A ${r} ${r} 0 0 1 180 100`
  return (
    <div className="relative mx-auto w-[200px]">
      <svg viewBox="0 0 200 110" className="w-full">
        <path d={arc} fill="none" stroke={theme.a100} strokeWidth="14" strokeLinecap="round" />
        <motion.path d={arc} fill="none" stroke={theme.a300} strokeWidth="14" strokeLinecap="round" strokeDasharray={len} initial={{ strokeDashoffset: len }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} />
        <motion.path d={arc} fill="none" stroke={theme.a700} strokeWidth="14" strokeLinecap="round" strokeDasharray={len} initial={{ strokeDashoffset: len }} animate={{ strokeDashoffset: len * (1 - pct / 100) }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.45 }} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="text-[28px] leading-none font-extrabold tracking-tight">
          <Counter value={pct} suffix="%" />
        </div>
        <div className="mt-1 text-[11px] text-muted">of quota closed</div>
      </div>
    </div>
  )
}

function Forecast({ closed }: { closed: number }) {
  const { go } = useStore()
  const pct = Math.round((closed / QUOTA.target) * 100)
  const gap = Math.max(0, QUOTA.target - closed)
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[14px] font-bold">Quarter forecast</div>
          <div className="text-[11.5px] text-muted">Against a {fmtK(QUOTA.target)} quota</div>
        </div>
        <button onClick={() => go('reports')} className="inline-flex cursor-pointer items-center gap-0.5 text-[12px] font-bold text-brand-700 hover:underline">
          Report <ChevronRight className="size-3.5" />
        </button>
      </div>
      <div className="mt-4 flex-1">
        <Gauge pct={pct} />
      </div>
      <ul className="mt-4 space-y-2 text-[12px]">
        {[
          { l: 'Closed won', v: Math.round(closed / 1000) * 1000, c: 'bg-brand-700 rounded-full' },
          { l: 'Commit', v: QUOTA.commit, c: 'bg-brand-500 rounded-full' },
          { l: 'Best case', v: QUOTA.best, c: 'bg-brand-300 rounded-[3px]' },
        ].map((r) => (
          <li key={r.l} className="flex items-center gap-2">
            <span className={`size-2 ${r.c}`} />
            <span className="text-muted">{r.l}</span>
            <span className="ml-auto font-bold">{fmtK(r.v)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#fbecd7] px-3 py-2 text-[11.5px] font-semibold text-[#b4691f]">
        <Target className="size-3.5" />
        {gap ? `${fmtK(gap)} gap to quota` : 'Quota reached 🎉'}
      </div>
    </Card>
  )
}

function Customize({ show, setShow }: { show: Record<string, boolean>; setShow: (k: string) => void }) {
  const { theme, setTheme } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const on = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', on)
    return () => document.removeEventListener('mousedown', on)
  }, [open])
  return (
    <div ref={ref} className="relative">
      <GhostButton onClick={() => setOpen((v) => !v)}>
        <SlidersHorizontal className="size-4" /> Customize
      </GhostButton>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="absolute top-12 left-0 z-40 w-[250px] origin-top-left rounded-2xl bg-white p-3 shadow-[0_20px_50px_-12px_rgba(0,0,0,.3),0_0_0_1px_var(--color-line)] sm:right-0 sm:left-auto sm:origin-top-right">
            <div className="px-1 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">Widgets</div>
            {[
              ['kpis', 'Key metrics'],
              ['insights', 'Insights'],
              ['revenue', 'Revenue vs target'],
              ['forecast', 'Quarter forecast'],
            ].map(([k, l]) => (
              <button key={k} onClick={() => setShow(k)} className="mt-1 flex w-full cursor-pointer items-center justify-between rounded-xl px-2 py-2 text-[13px] font-semibold hover:bg-card">
                {l}
                <span className={`relative h-5 w-9 rounded-full transition-colors ${show[k] ? 'bg-brand-700' : 'bg-line'}`}>
                  <motion.span layout className={`absolute top-0.5 size-4 rounded-full bg-white shadow ${show[k] ? 'right-0.5' : 'left-0.5'}`} />
                </span>
              </button>
            ))}
            <div className="mt-2 px-1 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">Accent</div>
            <div className="mt-2 flex gap-2 px-1">
              {THEMES.map((t) => (
                <button key={t.id} aria-label={t.name} title={t.name} onClick={() => setTheme(t.id)} className="flex size-7 cursor-pointer items-center justify-center rounded-full text-white ring-offset-2 transition hover:scale-110" style={{ background: `linear-gradient(135deg, ${t.a500}, ${t.a900})`, boxShadow: theme.id === t.id ? `0 0 0 2px #fff, 0 0 0 4px ${t.a500}` : undefined }}>
                  {theme.id === t.id && <Check className="size-3.5" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Dashboard({ onNewDeal }: { onNewDeal: () => void }) {
  const { deals, tasks } = useStore()
  const [show, setShowState] = useState<Record<string, boolean>>({ kpis: true, insights: true, revenue: true, forecast: true })
  const setShow = (k: string) => setShowState((s) => ({ ...s, [k]: !s[k] }))
  const stats = useMemo(() => {
    const won = deals.filter((d) => d.stage === 'Won').reduce((a, d) => a + d.value, 0)
    const open = deals.filter((d) => d.stage !== 'Won')
    return { won, pipe: open.reduce((a, d) => a + d.value, 0), openCount: open.length }
  }, [deals])
  const dueToday = tasks.filter((t) => !t.done && t.when === 'today').length
  const kpis = KPIS_DASH.map((k) => (k.id === 'rev' ? { ...k, value: Math.round(stats.won / 1000) } : k.id === 'pipe' ? { ...k, value: +(stats.pipe / 1000).toFixed(0), note: `${stats.openCount} deals` } : k))

  return (
    <Page className="flex flex-1 flex-col gap-4 pt-1">
      <PageHeader
        eyebrow="Overview"
        title={`${greeting()}, ${USER.first}`}
        sub={`You have ${dueToday + 2} tasks due today and 4 deals closing this week.`}
        actions={
          <>
            <Customize show={show} setShow={setShow} />
            <PrimaryButton onClick={onNewDeal}>
              <Plus className="size-4" strokeWidth={2.5} /> New deal
            </PrimaryButton>
          </>
        }
      />
      {show.kpis && (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
          {kpis.map((k) => (
            <KpiCard key={k.id} icon={k.icon} label={k.label} value={k.value} prefix={k.prefix} suffix={k.suffix} unit={'unit' in k ? k.unit : undefined} note={k.note} delta={k.delta} up={k.up} spark={k.spark} />
          ))}
        </div>
      )}
      {show.insights && <Insights />}
      {(show.revenue || show.forecast) && (
        <Item className={`grid flex-1 grid-cols-1 gap-3 ${show.revenue && show.forecast ? 'lg:grid-cols-[1.75fr_1fr]' : ''}`}>
          {show.revenue && <RevenueChart />}
          {show.forecast && <Forecast closed={stats.won} />}
        </Item>
      )}
    </Page>
  )
}
