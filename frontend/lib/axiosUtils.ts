import axios, { AxiosResponse } from "axios";
import * as schemaHelper from "./schemaHelper";

// 環境変数よりエンドポイントを設定 (今回はhttps://jsonplaceholder.typicode.com)
const baseURL = "http://localhost:8000";
// 共通ヘッダー
const headers: { [key: string]: string } = {
  "Content-Type": "application/json",
};
const ApiClient = axios.create({ baseURL, headers });

ApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.url && !config.url.includes("/login")) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export type AxiosConfigWrapper<
  Path extends schemaHelper.UrlPaths,
  Method extends schemaHelper.HttpMethods,
> = {
  url: Path;
  method: Method & schemaHelper.HttpMethodsFilteredByPath<Path>;
  params?: schemaHelper.RequestParameters<Path, Method>;
  data?: schemaHelper.RequestData<Path, Method>;
};

export function request<
  Path extends schemaHelper.UrlPaths,
  Method extends schemaHelper.HttpMethods,
>(config: AxiosConfigWrapper<Path, Method>) {
  return ApiClient.request<
    schemaHelper.ResponseData<Path, Method>,
    AxiosResponse<schemaHelper.ResponseData<Path, Method>>,
    AxiosConfigWrapper<Path, Method>["data"]
  >(config);
}
