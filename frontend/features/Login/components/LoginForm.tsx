import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import yup from "@/lib/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "@/components/TextInput/TextInput";
import Button from "@/components/Button";

export type FormData = {
  username: string;
  password: string;
};

const schema = yup
  .object({
    username: yup
      .string()
      .label("ユーザー名")
      .matches(/^[A-Za-z0-9]+$/, "半角英数字で入力してください")
      .required(),
    password: yup.string().label("パスワード").required(),
  })
  .required();

export default function LoginForm({
  login,
}: {
  login: (username: string, password: string) => Promise<void>;
}) {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await login(data.username, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextInput
        control={control}
        name="username"
        errors={errors}
        label="ユーザー名"
      />
      <TextInput
        control={control}
        name="password"
        errors={errors}
        label="パスワード"
      />

      <Button type="submit" className="btn-primary w-full mt-5">
        Login
      </Button>
    </form>
  );
}
