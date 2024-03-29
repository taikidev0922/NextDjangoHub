import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ApiClient } from "@/lib/api-client";

function SampleList() {
  const [queryParams, setQueryParams] = useState({});
  const [samples, setSamples] = useState([]);
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
    const res = await ApiClient.get("/sample/", { params: queryParams });
    setSamples(res.data);
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
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {samples?.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.price}</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default SampleList;
