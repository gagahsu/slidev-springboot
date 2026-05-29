import urllib.request
from pathlib import Path

SCREENSHOTS = Path(r"C:\Users\yunch\Documents\Work\springboot\screenshots")

images = {
    # MySQL wizard screenshots
    "kucw-mysql-01-download.png":     "https://kucw.io/images/blog/springboot/3/3-7.png",
    "kucw-mysql-02-installer.png":    "https://kucw.io/images/blog/springboot/3/3-8.png",
    "kucw-mysql-03-skip-login.png":   "https://kucw.io/images/blog/springboot/3/3-10.png",
    "kucw-mysql-04-setup-type.png":   "https://kucw.io/images/blog/springboot/3/3-11.png",
    "kucw-mysql-05-encrypt.png":      "https://kucw.io/images/blog/springboot/3/3-12.png",
    "kucw-mysql-06-root-pw.png":      "https://kucw.io/images/blog/springboot/3/3-13.png",
    # Git screenshots
    "kucw-git-01-website.png":        "https://kucw.io/images/blog/springboot/3/3-17.png",
    "kucw-git-02-download.png":       "https://kucw.io/images/blog/springboot/3/3-18.png",
    "kucw-git-03-installer.png":      "https://kucw.io/images/blog/springboot/3/3-19.png",
}

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

for fname, url in images.items():
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        (SCREENSHOTS / fname).write_bytes(data)
        print(f"OK  {fname} ({len(data)//1024} KB)")
    except Exception as e:
        print(f"FAIL {fname}: {e}")

print("Done!")
