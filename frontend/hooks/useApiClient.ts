import { getToken } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { useMessage } from "@/context/MessageContext";
import { ApiClient } from "@/lib/api-client";
import { AxiosError, AxiosRequestConfig } from "axios";
import { AxiosResponse } from "axios";
import * as schemaHelper from "@/lib/schemaHelper";

export type AxiosConfigWrapper<
  Path extends schemaHelper.UrlPaths,
  Method extends schemaHelper.HttpMethods
> = {
  url: Path;
  method: Method & schemaHelper.HttpMethodsFilteredByPath<Path>;
  params?: schemaHelper.RequestParameters<Path, Method>;
  data?: schemaHelper.RequestData<Path, Method>;
};

export function useApiClient() {
  const { addMessage } = useMessage();
  const { startLoading, stopLoading } = useLoading();
  // レスポンスのエラー判定処理
  ApiClient.interceptors.response.use(
    (response) => {
      stopLoading();
      if (response.config.message) {
        addMessage({
          text: response.config.message,
          type: "success",
        });
      }
      if (response.config.isSearch && response.data.length === 0) {
        addMessage({
          text: "検索結果が見つかりません",
          type: "error",
        });
      }
      if (response.config.isUpdate) {
        addMessage({
          text: "更新が完了しました",
          type: "success",
        });
      }
      return response;
    },
    (error: AxiosError) => {
      stopLoading();
      switch (error?.response?.status) {
        case 401:
          break;
        case 404:
          break;
        default:
      }
    }
  );

  // token付与等のリクエスト処理の共通化
  ApiClient.interceptors.request.use(async (request: any) => {
    startLoading();
    // アクセストークンを取得し共通headerに格納
    if (request.url?.includes("/auth/login/")) {
      return request;
    }
    const accessToken = getToken();
    if (request.headers) {
      request.headers["Authorization"] = "JWT " + accessToken;
    }
    return request;
  });

  function request<
    Path extends schemaHelper.UrlPaths,
    Method extends schemaHelper.HttpMethods
  >(config: AxiosConfigWrapper<Path, Method> & AxiosRequestConfig) {
    return ApiClient.request<
      schemaHelper.ResponseData<Path, Method>,
      AxiosResponse<schemaHelper.ResponseData<Path, Method>>,
      AxiosConfigWrapper<Path, Method>["data"]
    >(config);
  }
  return {
    request,
  };
}
