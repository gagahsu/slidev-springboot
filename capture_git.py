import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path(r"C:\Users\yunch\Documents\Work\springboot\screenshots")

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.firefox.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()

        print("Loading Git downloads page...")
        await page.goto("https://git-scm.com/downloads/win", wait_until="networkidle")
        await asyncio.sleep(3)
        print("URL:", page.url)
        print("Title:", await page.title())
        snapshot = await page.locator("body").aria_snapshot()
        print("ARIA:", snapshot[:2000])
        await page.screenshot(path=str(SCREENSHOTS / "git-01-download-page.png"))
        print("Screenshot saved.")

        await browser.close()

asyncio.run(main())
