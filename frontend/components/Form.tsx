import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

type PropType = {
  children: React.ReactNode;
  schema: any;
  onSubmit: any;
};

export default function Form({ children, schema, onSubmit }: PropType) {
  const methods = useForm({
    resolver: yupResolver(schema),
  });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </FormProvider>
  );
}
