import { motion } from 'motion/react'
import { Bell, Check, Globe, Mail, RotateCcw, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Avatar, Card, Item, Page, PageHeader, PrimaryButton } from '../components/ui'
import { THEMES, USER } from '../data'
import { useStore } from '../store'

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onChange} className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${on ? 'bg-brand-700' : 'bg-[#d9e0dc]'}`}>
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 32 }} className={`absolute top-1 size-4 rounded-full bg-white shadow ${on ? 'right-1' : 'left-1'}`} />
    </button>
  )
}

export default function Settings() {
  const { theme, setTheme, glass, setGlass, reset, toast } = useStore()
  const [prefs, setPrefs] = useState({ digest: true, deals: true, mentions: false, twofa: true })
  const flip = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }))
  return (
    <Page className="space-y-4 pt-1">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        sub="Personalise how Fernly looks and how it keeps you in the loop. Changes are saved on this device."
        actions={
          <PrimaryButton onClick={() => toast('Settings saved')}>
            <Check className="size-4" /> Save changes
          </PrimaryButton>
        }
      />
      <Item>
        <Card className="p-5">
          <div className="text-[14px] font-bold">Appearance</div>
          <div className="text-[11.5px] text-muted">Pick an accent — the sidebar, charts and buttons follow instantly.</div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {THEMES.map((t) => {
              const on = theme.id === t.id
              return (
                <motion.button key={t.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} onClick={() => setTheme(t.id)} className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl p-3 transition-colors ${on ? 'bg-white shadow-[0_10px_24px_-14px_rgba(15,26,20,.4)]' : 'hover:bg-white/70'}`}>
                  <span className="size-12 rounded-full shadow-[inset_0_2px_6px_rgba(255,255,255,.35),0_6px_14px_-6px_rgba(0,0,0,.4)]" style={{ background: `radial-gradient(circle at 30% 25%, ${t.a300}, ${t.a700} 55%, ${t.sb3})` }} />
                  <span className="text-[11.5px] font-semibold text-muted">{t.name}</span>
                  {on && (
                    <motion.span layoutId="swatch-check" className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-brand-500 text-white">
                      <Check className="size-3" strokeWidth={3} />
                    </motion.span>
                  )}
                </motion.button>
              )
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-[12px] font-semibold text-muted">
            <span>Glass intensity</span>
            <span className="text-ink">{glass}%</span>
          </div>
          <input type="range" min={0} max={100} value={glass} onChange={(e) => setGlass(+e.target.value)} className="accent-range mt-2 w-full cursor-pointer" aria-label="Glass intensity" />
        </Card>
      </Item>
      <Item className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card className="p-5">
          <div className="text-[14px] font-bold">Profile</div>
          <div className="mt-4 flex items-center gap-3">
            <Avatar initials={USER.initials} color="#e8913a" size={48} />
            <div>
              <div className="text-[14px] font-bold">{USER.name}</div>
              <div className="text-[12px] text-muted">{USER.role} · {USER.email}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 text-[12.5px] sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5"><Globe className="size-4 text-brand-700" /> English (US)</div>
            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5"><Mail className="size-4 text-brand-700" /> Weekly digest: Mondays</div>
          </div>
          <button
            onClick={() => {
              reset()
              toast('Demo data restored')
            }}
            className="mt-4 inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-white px-3.5 text-[12.5px] font-semibold hover:bg-brand-50"
          >
            <RotateCcw className="size-3.5" /> Reset demo data
          </button>
        </Card>
        <Card className="p-5">
          <div className="text-[14px] font-bold">Notifications & security</div>
          <ul className="mt-3 divide-y divide-line">
            {[
              { k: 'digest', l: 'Daily pipeline digest', s: 'A summary every morning at 8:00', i: Mail },
              { k: 'deals', l: 'Deal stage changes', s: 'When a deal moves forward or back', i: Bell },
              { k: 'mentions', l: 'Mentions only', s: 'Mute everything except @mentions', i: Bell },
              { k: 'twofa', l: 'Two-factor authentication', s: 'Required at every new sign-in', i: ShieldCheck },
            ].map(({ k, l, s, i: I }) => (
              <li key={k} className="flex items-center gap-3 py-2.5">
                <I className="size-4 shrink-0 text-brand-700" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold">{l}</div>
                  <div className="text-[11.5px] text-muted">{s}</div>
                </div>
                <Toggle label={l} on={prefs[k as keyof typeof prefs]} onChange={() => flip(k as keyof typeof prefs)} />
              </li>
            ))}
          </ul>
        </Card>
      </Item>
    </Page>
  )
}
