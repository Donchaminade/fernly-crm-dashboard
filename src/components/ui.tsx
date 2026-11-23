import { animate, motion, useInView, useReducedMotion, type Variants } from 'motion/react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export const ease = [0.22, 1, 0.36, 1] as const

/** container that cascades its <Item>s in with a blur, top → down (as in the reel) */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
}
export const item: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease } },
}

export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  )
}

export function Item({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[18px] bg-card ${className}`}>{children}</div>
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-brand-700 uppercase">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-brand-500" />
      </span>
      {children}
    </div>
  )
}

export function PageHeader({ eyebrow, title, sub, actions }: { eyebrow: string; title: ReactNode; sub: ReactNode; actions?: ReactNode }) {
  return (
    <Item className="relative z-30 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-2 text-[26px] leading-tight font-extrabold tracking-[-0.025em] text-ink sm:text-[32px]">{title}</h1>
        <p className="mt-1 text-[13px] text-muted">{sub}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </Item>
  )
}

export function PrimaryButton({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-brand-700 px-4 text-[13px] font-semibold text-white shadow-[0_8px_20px_-8px_var(--a-700),inset_0_1px_0_rgba(255,255,255,.25)] transition-colors hover:bg-brand-900 ${className}`}
    >
      {children}
    </motion.button>
  )
}

export function GhostButton({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-card ${className}`}
    >
      {children}
    </button>
  )
}

export function Segmented<T extends string>({ options, value, onChange, id, labels }: { options: readonly T[]; value: T; onChange: (v: T) => void; id: string; labels?: Record<string, string> }) {
  return (
    <div className="inline-flex rounded-full bg-card p-1">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`relative h-8 cursor-pointer rounded-full px-3.5 text-[12px] font-semibold transition-colors ${value === o ? 'text-ink' : 'text-muted hover:text-ink'}`}
        >
          {value === o && (
            <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-full bg-white shadow-[0_2px_8px_-2px_rgba(15,26,20,.15)]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
          )}
          <span className="relative">{labels?.[o] ?? o}</span>
        </button>
      ))}
    </div>
  )
}

export function Delta({ children, up = true, arrowDown = false }: { children: ReactNode; up?: boolean; arrowDown?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${up ? 'bg-brand-100 text-brand-700' : 'bg-[#fde8e8] text-[#c93b40]'}`}>
      {!arrowDown ? <ArrowUpRight className="size-3" strokeWidth={2.5} /> : <ArrowDownRight className="size-3" strokeWidth={2.5} />}
      {children}
    </span>
  )
}

export function IconChip({ children, tone = 'green', size = 'sm' }: { children: ReactNode; tone?: 'green' | 'amber' | 'red' | 'rose' | 'blue' | 'violet' | 'grey'; size?: 'sm' | 'md' }) {
  const tones = {
    green: 'bg-brand-100 text-brand-700',
    amber: 'bg-[#fdf0dc] text-[#b4691f]',
    red: 'bg-[#fde8e8] text-[#c93b40]',
    rose: 'bg-[#fde7ee] text-[#c23a62]',
    blue: 'bg-[#e3ebfd] text-[#2f5fd0]',
    violet: 'bg-[#efe7fd] text-[#7243c9]',
    grey: 'bg-white text-muted',
  }
  return <span className={`inline-flex shrink-0 items-center justify-center rounded-lg ${size === 'sm' ? 'size-6' : 'size-8'} ${tones[tone]}`}>{children}</span>
}

export function Sparkline({ data, color, down = false }: { data: readonly number[]; color: string; down?: boolean }) {
  const w = 84
  const h = 30
  const vals = down ? [...data].reverse() : data
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const pts = vals.map((v, i) => [(i / (vals.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 8)])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const gid = `sg${useId().replace(/:/g, '')}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-[30px] w-[56px] shrink overflow-visible min-[420px]:w-[70px] sm:w-[84px]">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.25" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#${gid})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} />
      <motion.path d={d} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease, delay: 0.2 }} />
    </svg>
  )
}

/** number that rolls up when it enters the view */
export function Counter({ value, decimals = 0, prefix = '', suffix = '' }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? value : 0)
  const prev = useRef(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setV(value)
      return
    }
    const c = animate(prev.current, value, { duration: 1, ease, onUpdate: setV })
    prev.current = value
    return () => c.stop()
  }, [inView, value, reduce])
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  )
}

export function Ring({ pct, size = 44, stroke = 4, color, track = 'rgba(255,255,255,.15)', children }: { pct: number; size?: number; stroke?: number; color: string; track?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - pct / 100) }} transition={{ duration: 1.1, ease, delay: 0.2 }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

export function Priority({ p }: { p: 'High' | 'Medium' | 'Low' }) {
  const s = { High: 'bg-[#fde8e8] text-[#c93b40]', Medium: 'bg-[#fdf0dc] text-[#b4691f]', Low: 'bg-brand-100 text-brand-700' }[p]
  return <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${s}`}>{p}</span>
}

export function Avatar({ initials, color, size = 32 }: { initials: string; color: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.36, background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 60%, #000))` }}
    >
      {initials}
    </span>
  )
}

export function ChartTooltip({ active, payload, label, fmt }: { active?: boolean; payload?: { name: string; value: number; color: string; dataKey: string }[]; label?: string; fmt?: (v: number, key: string) => string }) {
  if (!active || !payload?.length) return null
  const rows = payload.filter((p) => p.value != null)
  return (
    <div className="rounded-xl bg-ink/95 px-3 py-2 text-[12px] text-white shadow-xl backdrop-blur">
      <div className="mb-1 font-semibold">{label}</div>
      {rows.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-white/80">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto pl-3 font-semibold text-white">{fmt ? fmt(p.value, p.dataKey) : p.value}</span>
        </div>
      ))}
    </div>
  )
}
