import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ApiClient } from "@/lib/api-client";

function CreateSample() {
  const schema = yup.object({
    title: yup.string().required(),
    price: yup.number().required(),
    description: yup.string().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: any) => {
    ApiClient.post("/sample/", {
      title: data.title,
      price: data.price,
      description: data.description,
    });
  };
  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Title</label>
        <input type="text" {...register("title")} />
        {errors.title && <span>{errors.title.message}</span>}
        <label>Price</label>
        <input type="number" {...register("price")} />
        {errors.price && <span>{errors.price.message}</span>}
        <label>Description</label>
        <input type="text" {...register("description")} />
        {errors.description && <span>{errors.description.message}</span>}
        <button type="submit">Create</button>
      </form>
    </section>
  );
}

export default CreateSample;
