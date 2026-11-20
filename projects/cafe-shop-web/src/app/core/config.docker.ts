// Docker 部署用（angular.json 的 docker 設定會拿這個檔案取代 config.ts）
// 前端和後端都在同一個網址底下：Nginx 把 /api、/uploads 轉給後端
export const API_ORIGIN = '';
export const API = `${API_ORIGIN}/api`;
