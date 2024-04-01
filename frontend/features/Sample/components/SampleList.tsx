"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useApiClient } from "@/hooks/useApiClient";
import GridForm from "@/components/GridForm";
import Button from "@/components/Button";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>title</label>
        <input type="text" {...register("title")} />
        {errors.title && <p>{errors.title.message}</p>}
        <label>price</label>
        <input {...register("price")} />
        {errors.price && <p>{errors.price.message}</p>}
        <label>description</label>
        <input type="text" {...register("description")} />
        {errors.description && <p>{errors.description.message}</p>}
        <button type="submit">Search</button>
      </form>
      <GridForm itemsSource={samples} columns={columns} onSubmit={onListSubmit}>
        <Button type="submit">更新</Button>
      </GridForm>
    </section>
  );
}

export default SampleList;
