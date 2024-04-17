import Form from "@/components/Form";
import * as yup from "yup";
// import { useRouter } from "next/navigation";
import TextInput from "@/components/TextInput/TextInput";
import Button from "@/components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

export type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginForm({
  onSubmit,
}: {
  onSubmit: SubmitHandler<LoginFormData>;
}) {
  const schema = yup
    .object({
      username: yup.string().required(),
      password: yup.string().required(),
    })
    .required();
  const methods = useForm({
    resolver: yupResolver(schema),
  });
  return (
    <>
      <Form
        methods={methods}
        onSubmit={methods.handleSubmit(onSubmit)}
        actionButton={
          <Button className="btn-primary w-full mt-4" name="login">
            Login
          </Button>
        }
      >
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <TextInput name="username" label="username" />
          <TextInput
            name="password"
            label="password"
            type="password"
            className="mt-2"
          />
        </div>
      </Form>
    </>
  );
}
