"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import TextInput from "@/components/TextInput";
import Form from "@/components/Form";
import Button from "@/components/Button";
import { useApiClient } from "@/hooks/useApiClient";
import { yupResolver } from "@hookform/resolvers/yup";

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
  const apiClient = useApiClient();

  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const { login } = useAuth();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const res = await apiClient.post("/auth/login/", data);
    login(res.data.user, res.data.access_token);
    router.replace("/sample");
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <Form methods={methods} onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold">Login</h1>
        <TextInput name="username" label="username" />
        <TextInput
          name="password"
          label="password"
          type="password"
          className="mt-2"
        />
        <Button className="btn-primary w-full mt-4">Login</Button>
      </Form>
    </section>
  );
}

App.getLayout = function getLayout(page: React.ReactNode) {
  return <section>{page}</section>;
};
