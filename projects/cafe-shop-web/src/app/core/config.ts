// 後端的位址：API 在 /api，上傳的圖片在 /uploads
// 部署到 Docker 時由 Nginx 反向代理，改成 '' 即可
export const API_ORIGIN = 'http://localhost:8080';
export const API = `${API_ORIGIN}/api`;
