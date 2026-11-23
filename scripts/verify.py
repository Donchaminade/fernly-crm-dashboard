import asyncio, json
from playwright.async_api import async_playwright
U='http://127.0.0.1:4174'
O='/workspace/fernly-crm-dashboard/screenshots'
async def run():
    errs=[]; checks=[]
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':1440,'height':900},accept_downloads=True)
        pg=await ctx.new_page(); pg.on('console',lambda m:m.type=='error' and errs.append(m.text)); pg.on('pageerror',lambda e:errs.append(str(e)))
        async def nav(s):
            await pg.goto(U+'/#/'+s); await pg.wait_for_timeout(1500)
        async def shot(s): await pg.screenshot(path=f'{O}/{s}.png')
        await nav('dashboard'); await pg.wait_for_timeout(1000)
        await pg.locator('main button',has_text='Customize').click(); await pg.wait_for_timeout(700); await shot('desktop-9-customize')
        await pg.get_by_role('button',name='Cobalt',exact=True).click(); await pg.wait_for_timeout(400)
        assert await pg.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--a-700')")=='#2350c4'
        await pg.get_by_role('button',name='Emerald',exact=True).click()
        await pg.locator('main h1').click(); checks.append('Customize/accent')
        await pg.get_by_role('button',name='Notifications',exact=True).click(); await shot('desktop-10-notifications'); await pg.get_by_role('button',name='Mark all read').click(); await pg.locator('main h1').click()
        await pg.keyboard.press('Control+k'); await pg.get_by_placeholder('Search contacts, deals, actions…',exact=True).fill('Pinecrest'); await pg.wait_for_timeout(900); await shot('desktop-11-search'); await pg.keyboard.press('Escape'); checks.append('Search/notifications')
        await pg.locator('main button',has_text='New deal').click(); await pg.get_by_placeholder('e.g. Pinecrest expansion').fill('Fernly demo deal'); await pg.get_by_placeholder('e.g. Pinecrest Bank').fill('Test Company'); await pg.wait_for_timeout(900); await shot('desktop-12-new-deal'); await pg.get_by_role('button',name='Create deal').click(); await pg.wait_for_timeout(1500); assert await pg.get_by_text('Fernly demo deal',exact=True).count()>0; checks.append('Create deal')
        await nav('tasks'); await pg.get_by_placeholder('Add a task and press Enter…').fill('Review weekly results'); await pg.get_by_placeholder('Add a task and press Enter…').press('Enter'); await pg.wait_for_timeout(300); assert await pg.get_by_text('Review weekly results',exact=True).count()>0
        await pg.get_by_role('button',name='Mark done',exact=True).first.click(); await pg.wait_for_timeout(300); await shot('desktop-13-task-done')
        await pg.locator('main button').filter(has_text='Calls').first.click(); await pg.wait_for_timeout(300); await shot('desktop-14-tasks-calls'); checks.append('Create/complete/filter tasks')
        await nav('reports'); await pg.get_by_role('button',name='12 months').click(); await pg.wait_for_timeout(1100); await shot('desktop-15-reports-12m')
        async with pg.expect_download() as dl:
            await pg.get_by_role('button',name='Export').click()
        assert (await dl.value).suggested_filename=='fernly-report-12m.csv'; checks.append('Reports range/CSV export')
        await nav('settings'); await pg.get_by_role('button',name='Violet',exact=True).click(); await pg.wait_for_timeout(300); await shot('desktop-16-settings-violet'); await pg.get_by_role('button',name='Reset demo data').click(); await pg.wait_for_timeout(300); checks.append('Settings/reset')
        await nav('contacts'); await pg.get_by_placeholder('Search by name, company, role…').fill('Lumen'); assert await pg.get_by_text('Priya Raman',exact=True).count()>0; checks.append('Contacts filter')
        await ctx.close()
        # responsive overflow check, and mobile lower sections (nested scroller)
        for w,h in [(390,844),(820,1180),(1440,900)]:
            c=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2 if w==390 else 1)
            x=await c.new_page(); x.on('pageerror',lambda e:errs.append(str(e)))
            for pid in ['dashboard','reports','tasks','deals','contacts','calendar','settings','help']:
                await x.goto(U+'/#/'+pid); await x.reload(); await x.wait_for_timeout(2100)
                assert await x.evaluate('document.documentElement.scrollWidth<=window.innerWidth'),f'Page overflow {w} {pid}'
                assert await x.evaluate("document.querySelector('main').scrollWidth<=document.querySelector('main').clientWidth+1"),f'Main overflow {w} {pid}'
                if w==390 and pid in ['dashboard','reports','tasks']:
                    await x.locator('#scroller').evaluate('(e)=>e.scrollTop=e.scrollHeight'); await x.wait_for_timeout(700); await x.screenshot(path=f'{O}/mobile-{pid}-bottom.png')
            if w==390:
                await x.goto(U+'/#/dashboard'); await x.wait_for_timeout(1800); await x.get_by_role('button',name='Open menu').click(); await x.wait_for_timeout(400); await x.locator('aside [aria-label="Reports"]').last.click(); await x.wait_for_timeout(1600); assert await x.locator('main h1').inner_text()=='Reports'
            await c.close()
        checks.append('All pages: desktop/tablet/mobile, no overflow; mobile navigation')
        await b.close()
    assert not errs,errs
    print(json.dumps({'passed':checks,'errors':errs},indent=2))
asyncio.run(run())
