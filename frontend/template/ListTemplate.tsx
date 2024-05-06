"use client";
import GridForm from "@/components/GridForm/GridForm";
import Button from "@/components/Button/Button";
import { useForm } from "react-hook-form";
import { useGridForm } from "@/hooks/useGridForm";
import { useUpdate } from "@/hooks/useUpdate";
import { useFetch } from "@/hooks/useFetch";
import Card from "@/components/Card/Card";
import { OperationHeader } from "@/components/OperationHeader/OperationHeader";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { AxiosConfigWrapper } from "@/lib/axiosUtils";
import * as schemaHelper from "@/lib/schemaHelper";

function ListTemplate({
  defaultValues,
  resolver,
  listColumns,
  fetchUrl,
  listName,
  children,
}: {
  defaultValues: any;
  resolver: any;
  listColumns: any;
  fetchUrl: AxiosConfigWrapper<
    schemaHelper.UrlPaths,
    schemaHelper.HttpMethods
  >["url"];
  listName: string;
  children: (props: { control: any; errors: any }) => React.ReactNode;
}) {
  const { update } = useUpdate();
  const { fetch } = useFetch();
  useKeyboardShortcuts([
    {
      keys: "F1",
      action: () => {
        handleSubmit(search)();
      },
    },
    {
      keys: "Alt+S",
      action: () => {
        reset();
      },
    },
  ]);
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver,
    defaultValues,
  });

  const { register, setItemsSource, getSelectedItems, applyResults } =
    useGridForm<any>(listColumns);

  const search = async (data: any) => {
    const items = (await fetch({
      url: fetchUrl,
      method: "get",
      params: data,
    })) as any[];
    setItemsSource(items);
  };

  const onUpdate = async () => {
    await update(
      { url: (fetchUrl + "bulk_update/") as any, method: "put" },
      getSelectedItems()
    ).then((results) => {
      applyResults(results as any[]);
    });
  };

  return (
    <div>
      <OperationHeader onUpdate={onUpdate} />
      <Card title="検索項目">
        <form noValidate className="flex gap-4 items-end">
          {children({ control, errors })}
          <div className="flex-grow"></div>
          <Button className="btn-primary" onClick={handleSubmit(search)}>
            F1 検索
          </Button>
          <Button className="btn-outline" onClick={reset}>
            Alt+S 検索項目リセット
          </Button>
        </form>
      </Card>
      <GridForm {...register(listName)} />
    </div>
  );
}

export default ListTemplate;
