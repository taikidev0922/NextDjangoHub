"use client";
import * as yup from "yup";
import { useApiClient } from "@/hooks/useApiClient";
import GridForm from "@/components/GridForm";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGridForm } from "@/hooks/useGridForm";
import Card from "@/components/Card";
import Actions from "@/components/Actions";

function SampleList() {
  const apiClient = useApiClient();

  const methods = useForm({
    resolver: yupResolver(
      yup
        .object({
          title: yup.string(),
          price: yup.string(),
          description: yup.string(),
        })
        .required()
    ),
  });

  const { register, setItemsSource, getSelectedItems, applyResults } =
    useGridForm([
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

  const search = async (data: any) => {
    const res = await apiClient.get("/sample/", {
      params: data,
      isSearch: true,
    });
    setItemsSource(res.data);
  };

  const update = async () => {
    try {
      const selectedItems = getSelectedItems({ raiseException: true });
      const res = await apiClient.put("/sample/bulk_update/", selectedItems, {
        isUpdate: true,
      });
      applyResults(res.data);
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
