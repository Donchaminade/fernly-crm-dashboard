import re, asyncio, subprocess, os, time, shutil
from playwright.async_api import async_playwright
os.environ['DISPLAY']=':78'
xv=subprocess.Popen(['Xvfb',':78','-screen','0','1920x1080x24','-nocursor'])
time.sleep(1.5)
shutil.rmtree('/tmp/fernly-rec-profile', ignore_errors=True)
U='http://127.0.0.1:4174/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch_persistent_context('/tmp/fernly-rec-profile',headless=False,no_viewport=True,args=['--kiosk','--window-position=0,0','--window-size=1440,810','--force-device-scale-factor=1.3334','--hide-scrollbars','--disable-infobars','--no-first-run'],ignore_default_args=['--enable-automation'])
        pg=b.pages[0] if b.pages else await b.new_page()
        await pg.goto(U+'#/dashboard'); await pg.wait_for_timeout(2500)
        await pg.reload(); await pg.wait_for_timeout(150)
        ff=subprocess.Popen(['ffmpeg','-loglevel','error','-y','-f','x11grab','-framerate','30','-video_size','1920x1080','-draw_mouse','0','-i',':78','-c:v','libx264','-crf','14','-preset','medium','-pix_fmt','yuv420p','/tmp/fernly-raw.mp4'],stdin=subprocess.PIPE)
        w=pg.wait_for_timeout
        pg.set_default_timeout(5000)
        try:
            await w(2600)
            # hover KPI cards + insight
            for x in (330, 560, 760, 960):
                await pg.mouse.move(x, 230, steps=8); await w(280)
            await pg.mouse.move(420, 320, steps=8); await w(500)
            # chart hover along the curve
            for x in range(300, 830, 60):
                await pg.mouse.move(x, 520, steps=4); await w(110)
            await pg.locator('main button', has_text=re.compile('^Deals$')).first.click(); await w(1300)
            await pg.locator('main button', has_text=re.compile('^Revenue$')).first.click(); await w(900)
            # Reports
            await pg.locator('aside [aria-label="Reports"]').click(); await w(1700)
            await pg.get_by_role('button', name='12 months').click(); await w(1200)
            await pg.mouse.move(1040, 450, steps=10); await w(900)
            await pg.mouse.move(1080, 380, steps=6); await w(700)
            # Tasks
            await pg.locator('aside [aria-label="Tasks"]').click(); await w(1600)
            await pg.get_by_role('button', name='Mark done').first.click(); await w(1000)
            await pg.get_by_role('button', name='Mark done').first.click(); await w(1000)
            await pg.locator('main button', has_text=re.compile('^Calls$')).first.click(); await w(900)
            await pg.locator('main button', has_text=re.compile('^All$')).first.click(); await w(600)
            # Deals: move a card forward
            await pg.locator('aside [aria-label="Deals"]').click(); await w(1500)
            await pg.get_by_role('button', name='Move forward').nth(12).click(); await w(1100)
            # Settings: change accent
            await pg.locator('aside [aria-label="Settings"]').click(); await w(1500)
            await pg.get_by_role('button', name='Cobalt').click(); await w(1300)
            await pg.get_by_role('button', name='Violet').click(); await w(1100)
            await pg.get_by_role('button', name='Emerald').click(); await w(900)
            # back to dashboard; collapse + expand sidebar
            await pg.locator('aside [aria-label="Dashboard"]').click(); await w(1800)
            await pg.get_by_role('button', name='Collapse sidebar').click(); await w(1000)
            await pg.get_by_role('button', name='Expand sidebar').click(); await w(1500)
        finally:
            ff.communicate(b'q')
        await b.close()
asyncio.run(main())
xv.terminate()
