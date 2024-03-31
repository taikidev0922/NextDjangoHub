import { getToken } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { ApiClient } from "@/lib/api-client";

export function useApiClient() {
  const { startLoading, stopLoading } = useLoading();
  // レスポンスのエラー判定処理
  ApiClient.interceptors.response.use(
    (response) => {
      stopLoading();
      return response;
    },
    (error) => {
      stopLoading();
      console.log(error);
      switch (error?.response?.status) {
        case 401:
          break;
        case 404:
          break;
        default:
          console.log("== internal server error");
      }

      const errorMessage = (error.response?.data?.message || "").split(",");
      throw new Error(errorMessage);
    }
  );

  // token付与等のリクエスト処理の共通化
  ApiClient.interceptors.request.use(async (request: any) => {
    startLoading();
    // アクセストークンを取得し共通headerに格納
    if (request.url.includes("/auth/login/")) {
      return request;
    }
    const accessToken = getToken();
    request.headers["Authorization"] = "JWT " + accessToken;
    return request;
  });
  return ApiClient;
}
