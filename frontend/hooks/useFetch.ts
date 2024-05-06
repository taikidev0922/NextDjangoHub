import { useLoading } from "@/context/LoadingContext";
import { useToast } from "@/context/Toast/ToastContext";
import { AxiosConfigWrapper, request } from "@/lib/axiosUtils";
import * as schemaHelper from "@/lib/schemaHelper";

export function useFetch() {
  const { showToast } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const fetch = async <
    Path extends schemaHelper.UrlPaths,
    Method extends schemaHelper.HttpMethods,
  >(
    config: AxiosConfigWrapper<Path, Method>
  ): Promise<schemaHelper.ResponseData<Path, Method>> => {
    startLoading();
    try {
      const res = await request(config);
      stopLoading();
      if (Array.isArray(res.data) && res.data.length === 0) {
        showToast({
          text: "検索結果が見つかりません",
          type: "error",
        });
      }
      return res.data as schemaHelper.ResponseData<Path, Method>;
    } catch (e) {
      stopLoading();
      return [] as schemaHelper.ResponseData<Path, Method>;
    }
  };
  return { fetch };
}
