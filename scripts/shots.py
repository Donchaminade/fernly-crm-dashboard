import sys, asyncio
from playwright.async_api import async_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:5191'
OUT = '/workspace/fernly-crm-dashboard/screenshots'
PAGES = ['dashboard', 'reports', 'tasks', 'deals', 'contacts', 'calendar', 'settings', 'help']
async def run():
    errs = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, vp, mob in [('desktop', {'width': 1440, 'height': 900}, False), ('tablet', {'width': 820, 'height': 1180}, False), ('mobile', {'width': 390, 'height': 844}, True)]:
            ctx = await b.new_context(viewport=vp, device_scale_factor=2 if mob else 1, is_mobile=mob, has_touch=mob)
            pg = await ctx.new_page()
            pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
            pg.on('pageerror', lambda e: errs.append(str(e)))
            for i, pid in enumerate(PAGES):
                if name == 'tablet' and pid not in ('dashboard', 'tasks'): continue
                await pg.goto(f'{BASE}/#/{pid}')
                await pg.reload()
                await pg.wait_for_timeout(2600)
                await pg.screenshot(path=f'{OUT}/{name}-{i+1}-{pid}.png')
                if name == 'mobile' and pid == 'dashboard':
                    await pg.screenshot(path=f'{OUT}/{name}-{i+1}-{pid}-full.png', full_page=False)
            if name == 'mobile':
                await pg.goto(f'{BASE}/#/dashboard'); await pg.reload(); await pg.wait_for_timeout(1500)
                await pg.click('[aria-label="Open menu"]'); await pg.wait_for_timeout(700)
                await pg.screenshot(path=f'{OUT}/mobile-0-drawer.png')
            await ctx.close()
        await b.close()
    print('ERRORS:', errs)
asyncio.run(run())
