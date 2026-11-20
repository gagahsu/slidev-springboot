#!/usr/bin/env bash
# 產生網站上給學生下載的檔案（public/downloads/），投影片用 <a href="/downloads/…" download> 連過去。
# 改了 courses/mysql/sql/ 或 projects/cafe-static、projects/cafe-web 的樣式與圖片之後，重新執行一次：
#   bash scripts/pack-downloads.sh
set -euo pipefail
cd "$(dirname "$0")/.."
out=public/downloads
rm -rf "$out"
mkdir -p "$out/corner_cafe" "$out/cafe_shop"

# MySQL 課的建表與範例資料
cp courses/mysql/sql/corner_cafe/schema.sql courses/mysql/sql/corner_cafe/seed.sql "$out/corner_cafe/"
cp courses/mysql/sql/cafe_shop/schema.sql courses/mysql/sql/cafe_shop/seed.sql "$out/cafe_shop/"

# 壓縮檔裡的時間固定成同一天，內容沒變時重新執行不會產生新的 diff
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
stage() { mkdir -p "$tmp/$1"; cp -r "${@:2}" "$tmp/$1/"; find "$tmp/$1" -exec touch -d '2026-01-01 00:00:00' {} +; }

# Angular ch08–11：靜態版面的參考解答（含圖片），解壓縮後直接打開 index.html
stage static/cafe-static projects/cafe-static/index.html projects/cafe-static/style.css \
  projects/cafe-static/images projects/cafe-static/menu
(cd "$tmp/static" && zip -qrX - cafe-static) > "$out/cafe-static.zip"

# Angular ch58：cafe-web 素材包（菜單圖片 + 全站與各元件的樣式），解壓縮後蓋進自己的 cafe-web
w=projects/cafe-web
for f in public/menu src/styles.scss $(cd $w && ls src/app/components/*/*.scss src/app/pages/*/*.scss); do
  mkdir -p "$tmp/web/$(dirname "$f")"; cp -r "$w/$f" "$tmp/web/$(dirname "$f")/"
done
find "$tmp/web" -exec touch -d '2026-01-01 00:00:00' {} +
(cd "$tmp/web" && zip -qrX - public src) > "$out/cafe-web-starter.zip"

ls -R "$out"
