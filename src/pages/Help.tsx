import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Keyboard, LifeBuoy, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Card, Item, Page, PageHeader, PrimaryButton } from '../components/ui'
import { useStore } from '../store'

const FAQ = [
  { q: 'How is the quarter forecast calculated?', a: 'Closed-won deals of the quarter are compared with your $250K quota. Commit adds deals in Negotiation, best case adds every open deal weighted by probability.' },
  { q: 'Can I move a deal to another stage?', a: 'Yes. On the Deals page, drag a card to another column or use the arrows on the card. Dashboard and Reports update instantly.' },
  { q: 'Where is my data stored?', a: 'This demo keeps everything in your browser (localStorage). Use Settings → Reset demo data to start over.' },
  { q: 'How do I change the colours?', a: 'Open Settings → Appearance, or Customize on the dashboard, and pick one of the six accents. The whole interface follows.' },
]

export default function Help() {
  const { toast } = useStore()
  const [open, setOpen] = useState(0)
  return (
    <Page className="space-y-4 pt-1">
      <PageHeader eyebrow="Support" title="Help center" sub="Answers to common questions, keyboard shortcuts and a direct line to our team." actions={<PrimaryButton onClick={() => toast('Chat opened — we reply in ~2 min')}><MessageCircle className="size-4" /> Chat with us</PrimaryButton>} />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_290px]">
        <Item>
          <Card className="p-2">
            {FAQ.map((f, i) => (
              <div key={f.q} className={`rounded-xl transition-colors ${open === i ? 'bg-white' : ''}`}>
                <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left text-[13.5px] font-semibold">
                  {f.q}
                  <motion.span animate={{ rotate: open === i ? 180 : 0 }}><ChevronDown className="size-4 text-muted" /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-4 pb-4 text-[12.5px] leading-relaxed text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </Card>
        </Item>
        <Item className="space-y-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-[14px] font-bold"><Keyboard className="size-4 text-brand-700" /> Shortcuts</div>
            <ul className="mt-3 space-y-2 text-[12.5px]">
              {[['Search', '⌘ K'], ['Close a window', 'Esc'], ['Add a task', 'Enter']].map(([l, k]) => (
                <li key={l} className="flex items-center justify-between"><span className="text-muted">{l}</span><kbd className="rounded-md bg-white px-2 py-0.5 text-[11px] font-bold">{k}</kbd></li>
              ))}
            </ul>
          </Card>
          <div className="rounded-[18px] bg-gradient-to-br from-brand-700 to-brand-900 p-4 text-white">
            <LifeBuoy className="size-5" />
            <div className="mt-2 text-[14px] font-bold">Need a hand?</div>
            <div className="text-[12px] text-white/70">Our success team answers Monday to Friday, 8 am – 6 pm.</div>
          </div>
        </Item>
      </div>
    </Page>
  )
}
