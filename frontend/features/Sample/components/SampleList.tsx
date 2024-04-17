"use client";
import * as yup from "yup";
import GridForm from "@/components/GridForm/GridForm";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput/TextInput";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGridForm } from "@/hooks/useGridForm";
import Actions from "@/components/Actions";
import { Sample } from "@/models/Sample";
import { RequestParameters } from "@/lib/schemaHelper";
import { useUpdate } from "@/hooks/useUpdate";
import { useFetch } from "@/hooks/useFetch";
import TextInput2 from "@/components/TextInput2/TextInput2";
import Card from "@/components/Card/Card";

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
    <section>
      <Card title="検索項目">
        <form onSubmit={handleSubmit(search)} noValidate className="flex gap-4">
          <TextInput2
            name="title"
            label="title"
            control={control}
            errors={errors}
          />
          <TextInput2
            name="price"
            label="price"
            control={control}
            errors={errors}
          />
          <TextInput2
            name="description"
            label="description"
            control={control}
            errors={errors}
          />
          <Button className="btn-primary">F1 検索</Button>
        </form>
      </Card>
      <GridForm {...register("サンプル一覧")} />
      <Actions>
        <Button onClick={onUpdate} className="btn-success">
          F2 更新
        </Button>
      </Actions>
    </section>
  );
}

export default SampleList;
