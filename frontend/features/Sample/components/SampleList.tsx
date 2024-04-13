"use client";
import * as yup from "yup";
import GridForm from "@/components/GridForm";
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

type SampleQuery = NonNullable<RequestParameters<"/api/v1/sample/", "get">>;

function SampleList() {
  const { update } = useUpdate();
  const { fetch } = useFetch();
  const methods = useForm<SampleQuery>({
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
      <Form
        title="検索項目"
        methods={methods}
        onSubmit={search}
        actionButton={<Button className="btn-primary">F1 検索</Button>}
      >
        <TextInput name="title" label="title" />
        <TextInput name="price" label="price" />
        <TextInput name="description" label="description" />
      </Form>
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
