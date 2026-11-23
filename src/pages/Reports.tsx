import { motion } from 'motion/react'
import { Download, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Avatar, Card, ChartTooltip, Counter, Item, Page, PageHeader, PrimaryButton, Segmented } from '../components/ui'
import { DEALS_CREATED_WON, LEADERBOARD, LEAD_SOURCES, QUOTA, STAGES, fmtK } from '../data'
import { useStore } from '../store'
import { KpiCard } from './Dashboard'

export default function Reports() {
  const { theme, deals, toast } = useStore()
  const [range, setRange] = useState<'6' | '12'>('6')
  const [hoverSrc, setHoverSrc] = useState<number | null>(null)
  const data = DEALS_CREATED_WON[range === '6' ? 6 : 12]
  const won = deals.filter((d) => d.stage === 'Won')
  const wonSum = won.reduce((a, d) => a + d.value, 0)
  const pipe = deals.filter((d) => d.stage !== 'Won').reduce((a, d) => a + d.value, 0)
  const coverage = pipe / Math.max(1, QUOTA.target - wonSum)
  const funnel = useMemo(() => STAGES.map((s, i) => ({ s, n: deals.filter((d) => STAGES.indexOf(d.stage) >= i).length })), [deals])
  const srcColors = [theme.a500, theme.a700, theme.a300, '#e8a33c', '#e0555a']
  const total = LEAD_SOURCES.reduce((a, s) => a + s.value, 0)

  const exportCsv = () => {
    const rows = [['Month', 'Created', 'Won'], ...data.map((d) => [d.m, d.created, d.won])]
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `fernly-report-${range}m.csv` })
    a.click()
    URL.revokeObjectURL(url)
    toast('Report exported as CSV')
  }

  return (
    <Page className="space-y-4 pt-1">
      <PageHeader
        eyebrow="Performance"
        title="Reports"
        sub="Quarter to date, calculated live from your pipeline. Move a deal and these numbers follow."
        actions={
          <>
            <Segmented id="range" options={['6', '12'] as const} value={range} onChange={setRange} labels={{ '6': '6 months', '12': '12 months' }} />
            <PrimaryButton onClick={exportCsv}>
              <Download className="size-4" /> Export
            </PrimaryButton>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        <KpiCard icon="dollar" label="Revenue won" value={Math.round(wonSum / 1000)} prefix="$" suffix="K" note={`of ${fmtK(QUOTA.target)}`} delta="+18.6%" spark={[6, 8, 7, 10, 11, 12, 14, 16, 17, 20]} />
        <KpiCard icon="trophy" label="Deals won" value={won.length} note="this quarter" delta="+3" spark={[3, 4, 4, 5, 4, 6, 7, 6, 8, 9]} />
        <KpiCard icon="calendar" label="Avg. sales cycle" value={34} note="days" delta="−4 days" spark={[10, 12, 11, 13, 14, 13, 15, 16, 17, 18]} down />
        <KpiCard icon="target" label="Pipeline coverage" value={+coverage.toFixed(1)} decimals={1} suffix="×" note="of remaining quota" delta="+ healthy" spark={[5, 5, 6, 5, 6, 6, 7, 7, 9, 14]} />
      </div>

      <Item className="grid grid-cols-1 gap-3 lg:grid-cols-[1.65fr_1fr]">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[14px] font-bold">Deals created vs won</div>
              <div className="text-[11.5px] text-muted">Last {range} months</div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded" style={{ background: theme.a300 }} />Created</span>
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded" style={{ background: theme.a700 }} />Won</span>
            </div>
          </div>
          <div className="mt-3 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart key={range} data={data} barGap={6} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e6ebe8" />
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fontSize: 10.5, fill: '#9aa39e' }} dy={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10.5, fill: '#9aa39e' }} domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} />
                <Tooltip cursor={{ fill: theme.a50 }} content={<ChartTooltip />} />
                <Bar dataKey="created" name="created" fill={theme.a300} fillOpacity={0.75} radius={[6, 6, 6, 6]} maxBarSize={range === '6' ? 12 : 8} animationDuration={800} />
                <Bar dataKey="won" name="won" fill={theme.a500} radius={[6, 6, 6, 6]} maxBarSize={range === '6' ? 12 : 8} animationDuration={800} animationBegin={150} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[14px] font-bold">Lead sources</div>
          <div className="text-[11.5px] text-muted">{total} contacts by origin</div>
          <div className="mt-3 flex flex-col items-center gap-5 sm:flex-row lg:flex-col xl:flex-row">
            <div className="relative size-[170px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={LEAD_SOURCES} dataKey="value" innerRadius={58} outerRadius={80} paddingAngle={3} cornerRadius={4} stroke="none" startAngle={90} endAngle={-270} animationDuration={1000} onMouseEnter={(_, i) => setHoverSrc(i)} onMouseLeave={() => setHoverSrc(null)}>
                    {LEAD_SOURCES.map((s, i) => (
                      <Cell key={s.name} fill={srcColors[i]} opacity={hoverSrc === null || hoverSrc === i ? 1 : 0.35} style={{ transition: 'opacity .2s' }} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[26px] leading-none font-extrabold">
                  <Counter value={hoverSrc === null ? total : LEAD_SOURCES[hoverSrc].value} />
                </span>
                <span className="mt-1 text-[11px] text-muted">{hoverSrc === null ? 'contacts' : LEAD_SOURCES[hoverSrc].name}</span>
              </div>
            </div>
            <ul className="w-full flex-1 space-y-2.5 text-[12px]">
              {LEAD_SOURCES.map((s, i) => (
                <li key={s.name} onMouseEnter={() => setHoverSrc(i)} onMouseLeave={() => setHoverSrc(null)} className={`flex cursor-default items-center gap-2 rounded-lg px-1 transition-opacity ${hoverSrc !== null && hoverSrc !== i ? 'opacity-40' : ''}`}>
                  <span className="size-2.5 rounded-[3px]" style={{ background: srcColors[i] }} />
                  <span className="text-ink/80">{s.name}</span>
                  <span className="ml-auto font-bold">{s.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </Item>

      <Item className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card className="p-5">
          <div className="text-[14px] font-bold">Leaderboard</div>
          <div className="text-[11.5px] text-muted">Closed-won against a $60K quota each</div>
          <ul className="mt-4 space-y-3">
            {LEADERBOARD.map((p, i) => (
              <li key={p.name} className="flex items-center gap-3">
                <span className={`flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${i === 0 ? 'bg-[#fdf0dc] text-[#b4691f]' : 'bg-white text-muted'}`}>{i === 0 ? <Trophy className="size-3.5" /> : i + 1}</span>
                <Avatar initials={p.initials} color={p.color} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[13px] font-bold">{p.name}</span>
                    <span className="text-[13px] font-bold">{fmtK(p.closed)}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2 text-[11px] text-muted">
                    <span className="truncate">{p.role} · {p.won} won · {p.open} open</span>
                    <span className={`font-semibold ${p.quota >= 100 ? 'text-brand-700' : ''}`}>{p.quota}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white">
                    <motion.div className="h-full rounded-full bg-brand-500" initial={{ width: 0 }} animate={{ width: `${Math.min(100, p.quota)}%` }} transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <div className="text-[14px] font-bold">Conversion funnel</div>
          <div className="text-[11.5px] text-muted">Share of deals reaching each stage</div>
          <ul className="mt-4 space-y-3.5">
            {funnel.map((f, i) => (
              <li key={f.s}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-semibold">{f.s}</span>
                  <span className="font-bold">{f.n} <span className="font-medium text-faint">· {Math.round((f.n / funnel[0].n) * 100)}%</span></span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white">
                  <motion.div className="h-full rounded-full" style={{ background: `color-mix(in srgb, ${theme.a700} ${100 - i * 14}%, ${theme.a300})` }} initial={{ width: 0 }} animate={{ width: `${(f.n / funnel[0].n) * 100}%` }} transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </Item>
    </Page>
  )
}
