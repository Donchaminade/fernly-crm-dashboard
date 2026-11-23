import { AnimatePresence, motion } from 'motion/react'
import { Building2, Clock, Eye, Mail, Phone, Search } from 'lucide-react'
import { useState } from 'react'
import { Avatar, Card, Item, Page, PageHeader, PrimaryButton, Segmented } from '../components/ui'
import { fmtK, type Contact } from '../data'
import { useStore } from '../store'

const STATUS = { Hot: 'bg-[#fde8e8] text-[#c93b40]', Warm: 'bg-[#fdf0dc] text-[#b4691f]', Cold: 'bg-[#e3ebfd] text-[#2f5fd0]' }
const initials = (n: string) => n.split(' ').map((x) => x[0]).join('').slice(0, 2)

function IconBtn({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick() }} aria-label={label} className="group/tt relative flex size-8 cursor-pointer items-center justify-center rounded-full text-muted transition hover:bg-white hover:text-brand-700">
      {children}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-ink px-2 py-1 text-[10.5px] font-semibold whitespace-nowrap text-white opacity-0 transition group-hover/tt:opacity-100">{label}</span>
    </button>
  )
}

export default function Contacts() {
  const { contacts, toast, deals } = useStore()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'All' | Contact['status']>('All')
  const [sel, setSel] = useState<Contact>(contacts[0])
  const list = contacts.filter((c) => (status === 'All' || c.status === status) && `${c.name} ${c.company} ${c.title}`.toLowerCase().includes(q.toLowerCase()))
  const related = deals.filter((d) => d.company === sel.company)
  return (
    <Page className="space-y-4 pt-1">
      <PageHeader
        eyebrow="Relationships"
        title="Contacts"
        sub={`${contacts.length} people across ${new Set(contacts.map((c) => c.company)).size} accounts. ${contacts.filter((c) => c.status === 'Hot').length} are hot right now.`}
        actions={<PrimaryButton onClick={() => toast('Contact form opened (demo)')}>+ New contact</PrimaryButton>}
      />
      <Item className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex h-10 w-full items-center gap-2 rounded-full bg-card px-4 sm:w-[300px]">
          <Search className="size-4 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, company, role…" className="flex-1 bg-transparent text-[13px] outline-none" />
        </label>
        <Segmented id="cstatus" options={['All', 'Hot', 'Warm', 'Cold'] as const} value={status} onChange={setStatus} />
      </Item>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_300px]">
        <Item>
          <Card className="p-2">
            <div className="hidden grid-cols-[1.6fr_1.2fr_80px_110px_90px_104px] gap-3 px-3 py-2 text-[11px] font-semibold tracking-wide text-faint uppercase md:grid">
              <span>Name</span><span>Company</span><span>Status</span><span>Last touch</span><span className="text-right">Value</span><span />
            </div>
            <motion.ul layout>
              <AnimatePresence initial={false}>
                {list.map((c) => (
                  <motion.li layout key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(c)} className={`grid cursor-pointer grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-3 py-2.5 transition-colors md:grid-cols-[1.6fr_1.2fr_80px_110px_90px_104px] ${sel.id === c.id ? 'bg-white shadow-[0_6px_18px_-12px_rgba(15,26,20,.35)]' : 'hover:bg-white/70'}`}>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Avatar initials={initials(c.name)} color={c.color} size={32} />
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-semibold">{c.name}</div>
                        <div className="truncate text-[11px] text-muted">{c.title}<span className="md:hidden"> · {c.company}</span></div>
                      </div>
                    </div>
                    <span className="hidden truncate text-[12.5px] text-muted md:block">{c.company}</span>
                    <span className={`w-fit rounded-md px-2 py-0.5 text-[11px] font-semibold ${STATUS[c.status]}`}>{c.status}</span>
                    <span className="hidden text-[12px] text-muted md:block">{c.last}</span>
                    <span className="hidden text-right text-[12.5px] font-bold md:block">{fmtK(c.value)}</span>
                    <div className="hidden justify-end md:flex">
                      <IconBtn label="View" onClick={() => setSel(c)}><Eye className="size-3.5" /></IconBtn>
                      <IconBtn label="Email" onClick={() => toast(`Email drafted to ${c.name}`)}><Mail className="size-3.5" /></IconBtn>
                      <IconBtn label="Call" onClick={() => toast(`Calling ${c.name}… (demo)`)}><Phone className="size-3.5" /></IconBtn>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
            {!list.length && <div className="p-10 text-center text-[13px] text-muted">No contact matches “{q}”.</div>}
          </Card>
        </Item>
        <Item className="lg:sticky lg:top-0 lg:self-start">
          <AnimatePresence mode="wait">
            <motion.div key={sel.id} initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
              <Card className="p-5">
                <div className="flex flex-col items-center text-center">
                  <Avatar initials={initials(sel.name)} color={sel.color} size={64} />
                  <div className="mt-3 text-[16px] font-extrabold">{sel.name}</div>
                  <div className="text-[12px] text-muted">{sel.title}</div>
                  <span className={`mt-2 rounded-md px-2 py-0.5 text-[11px] font-semibold ${STATUS[sel.status]}`}>{sel.status} lead</span>
                </div>
                <ul className="mt-4 space-y-2 text-[12.5px]">
                  <li className="flex items-center gap-2 rounded-xl bg-white px-3 py-2"><Building2 className="size-4 text-brand-700" />{sel.company}</li>
                  <li className="flex items-center gap-2 rounded-xl bg-white px-3 py-2"><Mail className="size-4 text-brand-700" /><span className="truncate">{sel.email}</span></li>
                  <li className="flex items-center gap-2 rounded-xl bg-white px-3 py-2"><Phone className="size-4 text-brand-700" />{sel.phone}</li>
                  <li className="flex items-center gap-2 rounded-xl bg-white px-3 py-2"><Clock className="size-4 text-brand-700" />Last touch: {sel.last}</li>
                </ul>
                <div className="mt-4 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">Open deals</div>
                <ul className="mt-2 space-y-1.5">
                  {related.map((d) => (
                    <li key={d.id} className="flex items-center justify-between rounded-xl bg-brand-50 px-3 py-2 text-[12px]">
                      <span className="truncate font-semibold">{d.name}</span>
                      <span className="shrink-0 pl-2 font-bold text-brand-700">{fmtK(d.value)}</span>
                    </li>
                  ))}
                  {!related.length && <li className="text-[12px] text-muted">No deal yet.</li>}
                </ul>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => toast(`Email drafted to ${sel.name}`)} className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-brand-700 text-[12.5px] font-semibold text-white hover:bg-brand-900"><Mail className="size-3.5" />Email</button>
                  <button onClick={() => toast(`Calling ${sel.name}… (demo)`)} className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white text-[12.5px] font-semibold hover:bg-brand-50"><Phone className="size-3.5" />Call</button>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </Item>
      </div>
    </Page>
  )
}
