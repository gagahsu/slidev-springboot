import asyncio
import urllib.request
from pathlib import Path

SCREENSHOTS = Path(r"C:\Users\yunch\Documents\Work\springboot\screenshots")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

# MySQL screenshots from GeeksforGeeks (2025-06-04)
mysql_images = {
    "mysql-02-installer-run.webp":     "https://media.geeksforgeeks.org/wp-content/uploads/20250604160849579719/Download-MySQL_3.webp",
    "mysql-03-install-progress.webp":  "https://media.geeksforgeeks.org/wp-content/uploads/20250604161112567710/Download-MySQL_6.webp",
    "mysql-04-installation-done.webp": "https://media.geeksforgeeks.org/wp-content/uploads/20250604161231796504/Download-MySQL_7.webp",
    "mysql-05-root-password.webp":     "https://media.geeksforgeeks.org/wp-content/uploads/20250604161311446215/Download-MySql_9.webp",
    "mysql-06-connect-server.webp":    "https://media.geeksforgeeks.org/wp-content/uploads/20250604161350707585/MySql-step10.webp",
    "mysql-07-workbench.webp":         "https://media.geeksforgeeks.org/wp-content/uploads/20250604161511099900/Download-MySQL_12.webp",
}

# GitHub Desktop screenshots from codearmo.com (2025-04-17)
github_images = {
    "github-desktop-02-welcome.png":       "https://www.codearmo.com/media/uploads/2025/04/17/image_UBLoBbo.png",
    "github-desktop-03-configure-git.png": "https://www.codearmo.com/media/uploads/2025/04/17/image_Rx94TS7.png",
    "github-desktop-04-main-screen.png":   "https://www.codearmo.com/media/uploads/2025/04/17/image_uV6RZil.png",
}

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

def download(url, dest):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        dest.write_bytes(data)
        print(f"  OK {dest.name} ({len(data)//1024} KB)")
    except Exception as e:
        print(f"  FAIL {dest.name}: {e}")

print("=== MySQL (GeeksforGeeks 2025-06) ===")
for fname, url in mysql_images.items():
    download(url, SCREENSHOTS / fname)

print("\n=== GitHub Desktop (codearmo.com 2025-04) ===")
for fname, url in github_images.items():
    download(url, SCREENSHOTS / fname)

print("\nDone!")
