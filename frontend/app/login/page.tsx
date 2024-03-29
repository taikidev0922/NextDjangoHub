"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";

type Inputs = {
  username: string;
  password: string;
};

const schema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

export default function App() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(schema) });
  const { login, user } = useAuth();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const response = await fetch("http://127.0.0.1:8000/api/v1/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    login(json.user, json.access_token);
    router.replace("/sample");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {user && <p>{user.username}</p>}
      <input defaultValue="admin" {...register("username")} />
      <p>{errors.username?.message}</p>

      <input {...register("password")} />
      <p>{errors.password?.message}</p>

      <input type="submit" />
    </form>
  );
}
