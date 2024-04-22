"use client";
import * as yup from "yup";
import GridForm from "@/components/GridForm/GridForm";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGridForm } from "@/hooks/useGridForm";
import { Sample } from "@/models/Sample";
import { RequestParameters } from "@/lib/schemaHelper";
import { useUpdate } from "@/hooks/useUpdate";
import { useFetch } from "@/hooks/useFetch";
import TextInput from "@/components/TextInput/TextInput";
import Card from "@/components/Card/Card";
import { OperationHeader } from "@/components/OperationHeader";

type SampleQuery = NonNullable<RequestParameters<"/api/v1/sample/", "get">>;

function SampleList() {
  const { update } = useUpdate();
  const { fetch } = useFetch();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SampleQuery>({
    resolver: yupResolver(
      yup.object({
        title: yup.string(),
        price: yup.number(),
        description: yup.string(),
      })
    ),
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
    const results = await update(
      { url: "/api/v1/sample/bulk_update/", method: "put" },
      getSelectedItems()
    );
    applyResults(results);
  };

  return (
    <div>
      <OperationHeader onUpdate={onUpdate} />
      <Card title="検索項目">
        <form
          onSubmit={handleSubmit(search)}
          noValidate
          className="flex gap-4 items-end"
        >
          <TextInput
            name="title"
            label="title"
            control={control}
            errors={errors}
          />
          <TextInput
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
          <Button className="btn-primary">F1 検索</Button>
        </form>
      </Card>
      <GridForm {...register("サンプル一覧")} />
    </div>
  );
}

export default SampleList;
