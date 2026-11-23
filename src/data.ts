export type PageId = 'dashboard' | 'contacts' | 'deals' | 'tasks' | 'calendar' | 'reports' | 'settings' | 'help'

export type Theme = {
  id: string
  name: string
  a900: string
  a700: string
  a500: string
  a300: string
  a100: string
  a50: string
  sb1: string
  sb2: string
  sb3: string
  glow: string
}

export const THEMES: Theme[] = [
  { id: 'emerald', name: 'Emerald', a900: '#0f3d26', a700: '#1f7a4a', a500: '#3fae6e', a300: '#8fd9ae', a100: '#daeee2', a50: '#eef7f1', sb1: '#2d784f', sb2: '#173726', sb3: '#0d1f15', glow: '#4c946c' },
  { id: 'cobalt', name: 'Cobalt', a900: '#132a5e', a700: '#2350c4', a500: '#4f7ff0', a300: '#a3bdf7', a100: '#dde6fb', a50: '#eff3fd', sb1: '#2c4fa0', sb2: '#16244a', sb3: '#0c142b', glow: '#4f6fb8' },
  { id: 'violet', name: 'Violet', a900: '#33175e', a700: '#6b35c9', a500: '#9466ec', a300: '#c9b0f6', a100: '#ebe1fb', a50: '#f5f0fd', sb1: '#5d3a9e', sb2: '#2a1a4a', sb3: '#170e2a', glow: '#7d5bb8' },
  { id: 'amber', name: 'Amber', a900: '#5a3208', a700: '#b4651a', a500: '#e8913a', a300: '#f5c88f', a100: '#fbecd7', a50: '#fdf6ec', sb1: '#9a5a1f', sb2: '#3f2610', sb3: '#22150a', glow: '#b8844f' },
  { id: 'rose', name: 'Rose', a900: '#5e1630', a700: '#c23a62', a500: '#e5678c', a300: '#f4b2c5', a100: '#fbe1e9', a50: '#fdf1f5', sb1: '#9c3656', sb2: '#43182a', sb3: '#250d17', glow: '#b85b78' },
  { id: 'graphite', name: 'Graphite', a900: '#1b1f24', a700: '#3b4350', a500: '#6b7585', a300: '#b3bac4', a100: '#e3e6ea', a50: '#f2f4f6', sb1: '#4a5260', sb2: '#22262d', sb3: '#121418', glow: '#6b7380' },
]

export const USER = { first: 'Ava', name: 'Ava Patel', role: 'Head of Sales', initials: 'AP', email: 'ava.patel@fernly.app' }

export const QUOTA = { target: 250_000, closed: 171_300, commit: 326_000, best: 464_000 }

export const KPIS_DASH = [
  { id: 'rev', icon: 'dollar', label: 'Revenue won', value: 171, prefix: '$', suffix: 'K', note: 'this quarter', delta: '+18.6%', up: true, spark: [8, 10, 9, 12, 11, 14, 15, 17, 18, 21] },
  { id: 'pipe', icon: 'kanban', label: 'Open pipeline', value: 641, prefix: '$', suffix: 'K', note: '15 deals', delta: '+9.1%', up: true, spark: [6, 7, 7, 9, 8, 10, 11, 12, 14, 15] },
  { id: 'win', icon: 'target', label: 'Win rate', value: 32.4, prefix: '', suffix: '', unit: '%', note: '', delta: '+3.2 pts', up: true, spark: [9, 10, 9, 11, 12, 11, 13, 14, 15, 17] },
  { id: 'leads', icon: 'users', label: 'New leads', value: 6, prefix: '', suffix: '', note: 'this month', delta: '+4', up: true, spark: [6, 9, 7, 11, 8, 12, 10, 13, 11, 14] },
] as const

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// $K closed-won per month vs plan (Nov is the current month)
export const REVENUE = MONTHS.map((m, i) => {
  const rev = [94, 106, 98, 121, 128, 124, 137, 143, 139, 158, 171][i]
  const deals = [5, 6, 5, 7, 8, 7, 8, 9, 8, 10, 11][i]
  return {
    month: m,
    revenue: rev ?? null,
    deals: deals ?? null,
    target: Math.round(100 + (i * 50) / 11),
    dealTarget: +(6 + (i * 4) / 11).toFixed(1),
    forecast: i === 10 ? 171 : i === 11 ? 186 : null,
    dealForecast: i === 10 ? 11 : i === 11 ? 12 : null,
  }
})

export const INSIGHTS = [
  { id: 'i1', tone: 'amber', icon: 'kanban', html: '<b>4 deals</b> worth <b>$191K</b> close in the next 7 days.', action: 'Review', to: 'deals' as PageId },
  { id: 'i2', tone: 'green', icon: 'target', html: "You're at <b>69%</b> of quota. <b>$78.7K</b> to go with 6 weeks left.", action: 'Forecast', to: 'reports' as PageId },
  { id: 'i3', tone: 'red', icon: 'users', html: "<b>Jonas Weber</b> at Pinecrest Bank hasn't heard from you in <b>14 days</b>.", action: 'Open', to: 'contacts' as PageId },
  { id: 'i4', tone: 'rose', icon: 'calendar', html: '<b>2 overdue</b> follow-ups need attention today.', action: 'Tasks', to: 'tasks' as PageId },
]

export type Stage = 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won'
export const STAGES: Stage[] = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won']

export type Deal = { id: string; name: string; company: string; owner: string; value: number; stage: Stage; close: string; prob: number }

export const DEALS: Deal[] = [
  { id: 'd1', name: 'Pinecrest core banking', company: 'Pinecrest Bank', owner: 'Ava Patel', value: 84_000, stage: 'Proposal', close: 'Nov 27', prob: 60 },
  { id: 'd2', name: 'Helios renewal 2027', company: 'Helios Energy', owner: 'Victor Alvarez', value: 46_000, stage: 'Negotiation', close: 'Nov 25', prob: 80 },
  { id: 'd3', name: 'Cobalt SOC rollout', company: 'Cobalt Security', owner: 'Samuel Adeyemi', value: 38_000, stage: 'Qualified', close: 'Dec 12', prob: 35 },
  { id: 'd4', name: 'Lumen clinic suite', company: 'Lumen Health', owner: 'Priya Raman', value: 23_000, stage: 'Negotiation', close: 'Nov 28', prob: 75 },
  { id: 'd5', name: 'Orbital fleet tracking', company: 'Orbital Freight', owner: 'Mateo Silva', value: 61_000, stage: 'Proposal', close: 'Dec 04', prob: 55 },
  { id: 'd6', name: 'Northwind POS upgrade', company: 'Northwind Retail', owner: 'Chloe Martin', value: 29_000, stage: 'Lead', close: 'Jan 15', prob: 15 },
  { id: 'd7', name: 'Aster analytics seats', company: 'Aster Labs', owner: 'Ava Patel', value: 52_000, stage: 'Qualified', close: 'Dec 18', prob: 40 },
  { id: 'd8', name: 'Kestrel field app', company: 'Kestrel Logistics', owner: 'Mateo Silva', value: 74_000, stage: 'Lead', close: 'Jan 30', prob: 10 },
  { id: 'd9', name: 'Vega onboarding', company: 'Vega Insurance', owner: 'Priya Raman', value: 33_000, stage: 'Proposal', close: 'Nov 26', prob: 65 },
  { id: 'd10', name: 'Summit data platform', company: 'Summit Foods', owner: 'Victor Alvarez', value: 58_000, stage: 'Negotiation', close: 'Dec 09', prob: 70 },
  { id: 'd11', name: 'Harbor CRM migration', company: 'Harbor Ports', owner: 'Chloe Martin', value: 41_000, stage: 'Lead', close: 'Feb 06', prob: 10 },
  { id: 'd12', name: 'Quill e-sign bundle', company: 'Quill Legal', owner: 'Samuel Adeyemi', value: 19_000, stage: 'Qualified', close: 'Dec 15', prob: 30 },
  { id: 'd13', name: 'Atlas BI expansion', company: 'Atlas Mining', owner: 'Ava Patel', value: 27_000, stage: 'Proposal', close: 'Dec 02', prob: 50 },
  { id: 'd14', name: 'Nimbus API tier', company: 'Nimbus Cloud', owner: 'Priya Raman', value: 31_000, stage: 'Qualified', close: 'Dec 20', prob: 30 },
  { id: 'd15', name: 'Riverstone payroll', company: 'Riverstone Co.', owner: 'Mateo Silva', value: 25_000, stage: 'Lead', close: 'Jan 22', prob: 10 },
  { id: 'w1', name: 'Juniper ERP licences', company: 'Juniper Foods', owner: 'Ava Patel', value: 48_000, stage: 'Won', close: 'Oct 14', prob: 100 },
  { id: 'w2', name: 'Maple support plan', company: 'Maple Health', owner: 'Victor Alvarez', value: 22_500, stage: 'Won', close: 'Oct 22', prob: 100 },
  { id: 'w3', name: 'Granite security audit', company: 'Granite Bank', owner: 'Samuel Adeyemi', value: 31_000, stage: 'Won', close: 'Oct 30', prob: 100 },
  { id: 'w4', name: 'Solace telehealth', company: 'Solace Care', owner: 'Priya Raman', value: 26_500, stage: 'Won', close: 'Nov 06', prob: 100 },
  { id: 'w5', name: 'Fjord routing module', company: 'Fjord Shipping', owner: 'Mateo Silva', value: 24_000, stage: 'Won', close: 'Nov 13', prob: 100 },
  { id: 'w6', name: 'Ember loyalty app', company: 'Ember Coffee', owner: 'Chloe Martin', value: 19_300, stage: 'Won', close: 'Nov 19', prob: 100 },
]

export type Contact = { id: string; name: string; title: string; company: string; email: string; phone: string; status: 'Hot' | 'Warm' | 'Cold'; last: string; value: number; color: string }

export const CONTACTS: Contact[] = [
  { id: 'c1', name: 'Jonas Weber', title: 'CFO', company: 'Pinecrest Bank', email: 'jonas@pinecrest.bank', phone: '+49 30 5551 2201', status: 'Warm', last: '14 days ago', value: 84_000, color: '#e8913a' },
  { id: 'c2', name: 'Chloe Martin', title: 'Procurement lead', company: 'Pinecrest Bank', email: 'chloe.m@pinecrest.bank', phone: '+33 1 55 20 44 10', status: 'Hot', last: 'Today', value: 84_000, color: '#9466ec' },
  { id: 'c3', name: 'Samuel Adeyemi', title: 'CISO', company: 'Cobalt Security', email: 'samuel@cobaltsec.io', phone: '+234 803 555 0192', status: 'Hot', last: 'Yesterday', value: 38_000, color: '#4f7ff0' },
  { id: 'c4', name: 'Victor Alvarez', title: 'VP Operations', company: 'Helios Energy', email: 'v.alvarez@helios.energy', phone: '+34 91 555 7781', status: 'Hot', last: '2 days ago', value: 46_000, color: '#3fae6e' },
  { id: 'c5', name: 'Priya Raman', title: 'COO', company: 'Lumen Health', email: 'priya@lumenhealth.com', phone: '+1 415 555 0134', status: 'Warm', last: '3 days ago', value: 23_000, color: '#e5678c' },
  { id: 'c6', name: 'Mateo Silva', title: 'Head of Fleet', company: 'Orbital Freight', email: 'mateo@orbitalfreight.co', phone: '+351 21 555 6620', status: 'Warm', last: 'Yesterday', value: 61_000, color: '#1f7a4a' },
  { id: 'c7', name: 'Hana Kobayashi', title: 'Data Director', company: 'Aster Labs', email: 'hana@asterlabs.ai', phone: '+81 3 5550 1188', status: 'Cold', last: '3 weeks ago', value: 52_000, color: '#6b7585' },
  { id: 'c8', name: 'Liam O’Connor', title: 'IT Manager', company: 'Northwind Retail', email: 'liam@northwind.shop', phone: '+353 1 555 0921', status: 'Cold', last: '1 month ago', value: 29_000, color: '#b4651a' },
  { id: 'c9', name: 'Amara Diallo', title: 'CEO', company: 'Vega Insurance', email: 'amara@vega-ins.com', phone: '+221 77 555 31 20', status: 'Hot', last: 'Today', value: 33_000, color: '#c23a62' },
  { id: 'c10', name: 'Noah Fischer', title: 'CTO', company: 'Summit Foods', email: 'noah@summitfoods.de', phone: '+49 89 5552 7710', status: 'Warm', last: '5 days ago', value: 58_000, color: '#2350c4' },
]

export type TaskType = 'call' | 'email' | 'meeting' | 'todo'
export type Task = { id: string; title: string; type: TaskType; when: 'overdue' | 'today' | 'upcoming'; meta: string; contact: string; company: string; priority: 'High' | 'Medium' | 'Low'; done: boolean }

export const TASKS: Task[] = [
  { id: 't1', title: 'Update Q4 forecast', type: 'todo', when: 'overdue', meta: '2 days overdue', contact: '', company: '', priority: 'Medium', done: false },
  { id: 't2', title: 'Check in with Orbital Freight', type: 'call', when: 'overdue', meta: 'Yesterday', contact: 'Mateo Silva', company: 'Orbital Freight', priority: 'High', done: false },
  { id: 't3', title: 'Follow up on Pinecrest proposal', type: 'email', when: 'today', meta: 'Today · 10:30 AM', contact: 'Chloe Martin', company: 'Pinecrest Bank', priority: 'High', done: false },
  { id: 't4', title: 'Discovery call with Cobalt Security', type: 'call', when: 'today', meta: 'Today · 1:00 PM', contact: 'Samuel Adeyemi', company: 'Cobalt Security', priority: 'High', done: false },
  { id: 't5', title: 'Send Helios renewal redlines', type: 'email', when: 'today', meta: 'Today · 3:30 PM', contact: 'Victor Alvarez', company: 'Helios Energy', priority: 'High', done: false },
  { id: 't6', title: 'Prep demo for Lumen Health', type: 'todo', when: 'today', meta: 'Today · 5:00 PM', contact: 'Priya Raman', company: 'Lumen Health', priority: 'Medium', done: false },
  { id: 't7', title: 'Quarterly review with Vega', type: 'meeting', when: 'today', meta: 'Today · 9:00 AM', contact: 'Amara Diallo', company: 'Vega Insurance', priority: 'Low', done: true },
  { id: 't8', title: 'Pricing workshop with Summit', type: 'meeting', when: 'upcoming', meta: 'Tue · 11:00 AM', contact: 'Noah Fischer', company: 'Summit Foods', priority: 'Medium', done: false },
  { id: 't9', title: 'Intro email to Aster Labs data team', type: 'email', when: 'upcoming', meta: 'Wed · 9:30 AM', contact: 'Hana Kobayashi', company: 'Aster Labs', priority: 'Low', done: false },
  { id: 't10', title: 'Call Northwind about POS timeline', type: 'call', when: 'upcoming', meta: 'Thu · 2:00 PM', contact: 'Liam O’Connor', company: 'Northwind Retail', priority: 'Low', done: false },
  { id: 't11', title: 'Draft Kestrel mutual action plan', type: 'todo', when: 'upcoming', meta: 'Fri · 10:00 AM', contact: 'Mateo Silva', company: 'Kestrel Logistics', priority: 'Medium', done: false },
  { id: 't12', title: 'Exec sync — Pinecrest Bank', type: 'meeting', when: 'upcoming', meta: 'Fri · 4:00 PM', contact: 'Jonas Weber', company: 'Pinecrest Bank', priority: 'High', done: false },
]

export const DEALS_CREATED_WON = {
  6: [
    { m: 'Jun', created: 24, won: 8 },
    { m: 'Jul', created: 29, won: 10 },
    { m: 'Aug', created: 31, won: 11 },
    { m: 'Sep', created: 28, won: 9 },
    { m: 'Oct', created: 33, won: 11 },
    { m: 'Nov', created: 35, won: 12 },
  ],
  12: [
    { m: 'Dec', created: 18, won: 5 }, { m: 'Jan', created: 21, won: 6 }, { m: 'Feb', created: 19, won: 6 },
    { m: 'Mar', created: 22, won: 7 }, { m: 'Apr', created: 25, won: 8 }, { m: 'May', created: 23, won: 7 },
    { m: 'Jun', created: 24, won: 8 }, { m: 'Jul', created: 29, won: 10 }, { m: 'Aug', created: 31, won: 11 },
    { m: 'Sep', created: 28, won: 9 }, { m: 'Oct', created: 33, won: 11 }, { m: 'Nov', created: 35, won: 12 },
  ],
}

export const LEAD_SOURCES = [
  { name: 'Referral', value: 5, pct: 21, color: '#3fae6e' },
  { name: 'Outbound', value: 5, pct: 21, color: '#1f7a4a' },
  { name: 'Organic', value: 6, pct: 25, color: '#a8e0c0' },
  { name: 'Events', value: 5, pct: 21, color: '#e8a33c' },
  { name: 'Paid', value: 3, pct: 13, color: '#e0555a' },
]

export const LEADERBOARD = [
  { name: 'Ava Patel', role: 'Head of Sales', won: 2, open: '$212K', closed: 67_100, quota: 112, initials: 'AP', color: '#e8913a' },
  { name: 'Victor Alvarez', role: 'Account Exec', won: 2, open: '$104K', closed: 48_200, quota: 80, initials: 'VA', color: '#3fae6e' },
  { name: 'Priya Raman', role: 'Account Exec', won: 1, open: '$87K', closed: 31_400, quota: 52, initials: 'PR', color: '#e5678c' },
  { name: 'Mateo Silva', role: 'Account Exec', won: 1, open: '$160K', closed: 24_300, quota: 41, initials: 'MS', color: '#4f7ff0' },
]

export const CALENDAR_EVENTS = [
  { day: 23, time: '09:00', end: '09:45', title: 'Quarterly review — Vega', type: 'meeting' as TaskType, who: 'Amara Diallo' },
  { day: 23, time: '10:30', end: '11:00', title: 'Pinecrest proposal follow-up', type: 'email' as TaskType, who: 'Chloe Martin' },
  { day: 23, time: '13:00', end: '13:45', title: 'Discovery call — Cobalt', type: 'call' as TaskType, who: 'Samuel Adeyemi' },
  { day: 23, time: '15:30', end: '16:00', title: 'Helios renewal redlines', type: 'email' as TaskType, who: 'Victor Alvarez' },
  { day: 24, time: '11:00', end: '12:00', title: 'Pricing workshop — Summit', type: 'meeting' as TaskType, who: 'Noah Fischer' },
  { day: 25, time: '09:30', end: '10:00', title: 'Intro — Aster Labs', type: 'email' as TaskType, who: 'Hana Kobayashi' },
  { day: 25, time: '14:00', end: '15:30', title: 'Helios close plan', type: 'meeting' as TaskType, who: 'Victor Alvarez' },
  { day: 26, time: '14:00', end: '14:30', title: 'Northwind POS timeline', type: 'call' as TaskType, who: 'Liam O’Connor' },
  { day: 27, time: '10:00', end: '11:00', title: 'Kestrel action plan', type: 'todo' as TaskType, who: 'Mateo Silva' },
  { day: 27, time: '16:00', end: '16:45', title: 'Exec sync — Pinecrest', type: 'meeting' as TaskType, who: 'Jonas Weber' },
]

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Helios moved to Negotiation', time: '12 min ago', tone: 'green' },
  { id: 'n2', title: 'Chloe Martin opened your proposal', time: '1 h ago', tone: 'amber' },
  { id: 'n3', title: 'Orbital Freight follow-up is overdue', time: 'Yesterday', tone: 'red' },
]

export const fmtK = (v: number) => `$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K`
export const fmtK0 = (v: number) => `$${Math.round(v / 1000)}K`
