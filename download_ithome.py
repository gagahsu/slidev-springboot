import urllib.request
from pathlib import Path

SCREENSHOTS = Path(r"C:\Users\yunch\Documents\Work\springboot\screenshots\ithome")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

urls = [
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546UmN2LSVwhW.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546lHiZqaMvue.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546v2UqZnqa5M.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546Toezxi8WPK.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/201785465qFE62LPDj.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546OD2o9TnK9n.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546CK1KDoeCgd.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546RgA5J8RZHz.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546gnQVxZc3U3.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546brjVwjZxsO.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546Du7SyXHbel.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546k3QX4QSsNW.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546xkE0mFU5eQ.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/201785465DdOPoehvV.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/201785461BF39HoZHk.png",
    "https://ithelp.ithome.com.tw/upload/images/20250918/20178546E831kgobwm.png",
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
    "Referer": "https://ithelp.ithome.com.tw/",
}

for i, url in enumerate(urls, 1):
    fname = f"img-{i:02d}.png"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        (SCREENSHOTS / fname).write_bytes(data)
        print(f"OK  {fname} ({len(data)//1024} KB)")
    except Exception as e:
        print(f"FAIL {fname}: {e}")
