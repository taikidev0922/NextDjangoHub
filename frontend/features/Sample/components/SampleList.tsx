"use client";
import { useState } from "react";
import * as yup from "yup";
import { useApiClient } from "@/hooks/useApiClient";
import GridForm from "@/components/GridForm";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import Form from "@/components/Form";

function SampleList() {
  const [queryParams, setQueryParams] = useState({});
  const [samples, setSamples] = useState([]);
  const apiClient = useApiClient();
  const schema = yup
    .object({
      title: yup.string(),
      price: yup.string(),
      description: yup.string(),
    })
    .required();

  const onSubmit = async (data: any) => {
    setQueryParams(data);
    const res = await apiClient.get("/sample/", { params: queryParams });
    console.log(res.data);
    setSamples(res.data);
  };

  const columns = [
    {
      binding: "id",
      header: "id",
    },
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
  ];

  const onListSubmit = (selectedItems: any[]) => {
    console.log(selectedItems);
    const res = apiClient.put("/sample/bulk_update/", selectedItems);
    return res;
  };

  // データをレンダリングする
  return (
    <section>
      <Form onSubmit={onSubmit} schema={schema}>
        <div className="flex">
          <TextInput name="title" label="title" />
          <TextInput name="price" label="price" />
          <TextInput name="description" label="description" />
          <Button className="btn-primary" type="submit">
            検索
          </Button>
        </div>
      </Form>
      <GridForm itemsSource={samples} columns={columns} onSubmit={onListSubmit}>
        <Button className="btn-success" type="submit">
          更新
        </Button>
      </GridForm>
    </section>
  );
}

export default SampleList;
