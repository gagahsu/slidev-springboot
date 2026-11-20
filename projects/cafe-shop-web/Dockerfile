# 轉角咖啡線上商店前端（Docker ch04：多階段建置）

# 第一階段：用 Node.js 打包 Angular
FROM node:24-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# docker 設定會把 config.ts 換成 config.docker.ts（API 走同一個網址的 /api）
RUN npx ng build --configuration docker

# 第二階段：用 Nginx 提供打包好的檔案，/api 轉給後端
FROM nginx:1.31-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist/cafe-shop-web/browser /usr/share/nginx/html
EXPOSE 80
