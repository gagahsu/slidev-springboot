import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path(r"C:\Users\yunch\Documents\Work\springboot\screenshots")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.firefox.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()

        # CP1: MySQL download page
        print("Loading MySQL download page...")
        await page.goto("https://dev.mysql.com/downloads/installer/", wait_until="networkidle")
        await asyncio.sleep(2)
        await page.screenshot(path=str(SCREENSHOTS / "mysql-01-download-page.png"))
        print("MySQL title:", await page.title())

        # CP2: Git downloads page
        print("Loading Git downloads page...")
        await page.goto("https://git-scm.com/downloads", wait_until="networkidle")
        await asyncio.sleep(2)
        await page.screenshot(path=str(SCREENSHOTS / "git-01-download-page.png"))
        print("Git title:", await page.title())

        # CP3: GitHub Desktop page
        print("Loading GitHub Desktop page...")
        await page.goto("https://desktop.github.com/download/", wait_until="networkidle")
        await asyncio.sleep(2)
        await page.screenshot(path=str(SCREENSHOTS / "github-desktop-01-download.png"))
        print("GitHub Desktop title:", await page.title())

        await browser.close()
        print("Done! All screenshots saved.")

asyncio.run(main())
