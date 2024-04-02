import axios from "axios";
// 環境変数よりエンドポイントを設定 (今回はhttps://jsonplaceholder.typicode.com)
const baseURL = "http://localhost:8000/api/v1";
// 共通ヘッダー
const headers = {
  "Content-Type": "application/json",
};
// axiosの初期設定
export const ApiClient = axios.create({ baseURL, headers });
