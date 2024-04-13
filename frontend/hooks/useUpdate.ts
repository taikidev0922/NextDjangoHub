import { useLoading } from "@/context/LoadingContext";
import { useMessage } from "@/context/MessageContext";
import { AxiosConfigWrapper, request } from "@/lib/axiosUtils";
import * as schemaHelper from "@/lib/schemaHelper";

export function useUpdate() {
  const { addMessage } = useMessage();
  const { startLoading, stopLoading } = useLoading();
  const update = async <
    Path extends schemaHelper.UrlPaths,
    Method extends schemaHelper.HttpMethods,
  >(
    config: AxiosConfigWrapper<Path, Method>,
    data: schemaHelper.RequestData<Path, Method>
  ): Promise<schemaHelper.ResponseData<Path, Method>> => {
    if (Array.isArray(data) && data.length === 0) {
      addMessage({
        text: "明細を選択してください",
        type: "error",
      });
      return [] as schemaHelper.ResponseData<Path, Method>;
    }
    startLoading();
    try {
      const res = await request<Path, Method>({
        ...config,
        data: data,
      });
      stopLoading();
      addMessage({
        text: "更新が完了しました",
        type: "success",
      });
      return res.data as schemaHelper.ResponseData<Path, Method>;
    } catch (e) {
      stopLoading();
      addMessage({
        text: "更新に失敗しました",
        type: "error",
      });
      return [] as schemaHelper.ResponseData<Path, Method>;
    }
  };
  return { update };
}
