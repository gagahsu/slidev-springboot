import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path(r"C:\Users\yunch\Documents\Work\springboot\screenshots")

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.firefox.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 1800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0"
        )
        page = await context.new_page()

        print("Loading iThome article...")
        await page.goto("https://ithelp.ithome.com.tw/m/articles/10382339", wait_until="networkidle")
        await asyncio.sleep(3)
        print("Title:", await page.title())

        # 截整頁截圖
        await page.screenshot(path=str(SCREENSHOTS / "ithome-article.png"))

        # 找所有圖片 URL
        imgs = await page.evaluate("""
            () => Array.from(document.querySelectorAll('img')).map(img => ({
                src: img.src,
                alt: img.alt,
                width: img.naturalWidth,
                height: img.naturalHeight
            })).filter(i => i.width > 200)
        """)
        for img in imgs:
            print(f"  [{img['width']}x{img['height']}] {img['src'][:100]}  alt={img['alt'][:50]}")

        await browser.close()

asyncio.run(main())
