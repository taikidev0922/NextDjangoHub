"use client";
import * as yup from "yup";
import GridForm from "@/components/GridForm/GridForm";
import Button from "@/components/Button/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGridForm } from "@/hooks/useGridForm";
import { Sample } from "@/models/Sample";
import { RequestParameters } from "@/lib/schemaHelper";
import { useUpdate } from "@/hooks/useUpdate";
import { useFetch } from "@/hooks/useFetch";
import TextInput from "@/components/TextInput/TextInput";
import Card from "@/components/Card/Card";
import { OperationHeader } from "@/components/OperationHeader/OperationHeader";
import NumberInput from "@/components/NumberInput/NumberInput";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

type SampleQuery = NonNullable<RequestParameters<"/api/v1/sample/", "get">>;

function SampleList() {
  const { update } = useUpdate();
  const { fetch } = useFetch();
  useKeyboardShortcuts([
    {
      keys: "F1",
      action: () => {
        handleSubmit(search)();
      },
    },
  ]);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SampleQuery>({
    resolver: yupResolver(
      yup.object({
        title: yup.string(),
        price: yup
          .number()
          .optional()
          .transform((value, originalValue) =>
            isNaN(Number(originalValue)) ? undefined : Number(originalValue)
          ),
        description: yup.string(),
      })
    ),
    defaultValues: {
      title: undefined,
      price: undefined,
      description: undefined,
    },
  });

  const { register, setItemsSource, getSelectedItems, applyResults } =
    useGridForm<Sample>([
      {
        binding: "title",
        header: "title",
        dataType: "string",
      },
      {
        binding: "price",
        header: "price",
        dataType: "number",
      },
      {
        binding: "description",
        header: "description",
        dataType: "string",
      },
    ]);

  const search = async (data: SampleQuery) => {
    const items = await fetch({
      url: "/api/v1/sample/",
      method: "get",
      params: data,
    });
    setItemsSource(items);
  };

  const onUpdate = async () => {
    await update(
      { url: "/api/v1/sample/bulk_update/", method: "put" },
      getSelectedItems()
    ).then((results) => {
      applyResults(results);
    });
  };

  return (
    <div>
      <OperationHeader onUpdate={onUpdate} />
      <Card title="検索項目">
        <form noValidate className="flex gap-4 items-end">
          <TextInput
            name="title"
            label="title"
            control={control}
            errors={errors}
          />
          <NumberInput
            name="price"
            label="price"
            control={control}
            errors={errors}
          />
          <TextInput
            name="description"
            label="description"
            control={control}
            errors={errors}
          />
          <div className="flex-grow"></div>
          <Button className="btn-primary" onClick={handleSubmit(search)}>
            F1 検索
          </Button>
        </form>
      </Card>
      <GridForm {...register("サンプル一覧")} />
    </div>
  );
}

export default SampleList;
