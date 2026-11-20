// 後端的位址：API 在 /api，上傳的圖片在 /uploads
// 部署到 Docker 時用 config.docker.ts（ng build --configuration docker），由 Nginx 反向代理
export const API_ORIGIN = 'http://localhost:8080';
export const API = `${API_ORIGIN}/api`;
