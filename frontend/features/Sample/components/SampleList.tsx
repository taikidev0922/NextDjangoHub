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
import { request } from "@/lib/axiosUtils";
import { useMessage } from "@/context/MessageContext";

type SampleQuery = NonNullable<RequestParameters<"/api/v1/sample/", "get">>;

function SampleList() {
  const { addMessage } = useMessage();
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
      },
      {
        binding: "price",
        header: "price",
      },
      {
        binding: "description",
        header: "description",
      },
    ]);

  const search = async (data: SampleQuery) => {
    const res = await request({
      url: "/api/v1/sample/",
      method: "get",
      params: data,
    });
    setItemsSource(res.data);
    if (res.data.length === 0) {
      addMessage({
        text: "検索結果が見つかりません",
        type: "error",
      });
    }
  };

  const update = async () => {
    try {
      const selectedItems = getSelectedItems({ raiseException: true });
      const res = await request({
        url: "/api/v1/sample/bulk_update/",
        method: "put",
        data: selectedItems,
      });
      applyResults(res.data);
      addMessage({
        text: "更新が完了しました",
        type: "success",
      });
    } catch (error) {
      return;
    }
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
      <GridForm {...register("test")} />
      <Actions>
        <Button onClick={update} className="btn-success">
          F2 更新
        </Button>
      </Actions>
    </section>
  );
}

export default SampleList;
