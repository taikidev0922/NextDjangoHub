import { FormProvider } from "react-hook-form";
import Card from "./Card/Card";
import Button from "./Button";

type PropType = {
  children: React.ReactNode;
  methods: any;
  onSubmit: any;
  actionButton: React.ReactNode;
  title?: string;
};

export default function Form({
  children,
  methods,
  onSubmit,
  actionButton,
  title,
}: PropType) {
  if (!methods) {
    throw new Error("methods is required");
  }
  return (
    <FormProvider {...methods}>
      <Card title={title}>
        <form
          onSubmit={methods?.handleSubmit(onSubmit)}
          noValidate
          className="flex gap-3"
        >
          {children}
          <div className="self-end ml-auto mr-2">{actionButton}</div>
        </form>
      </Card>
    </FormProvider>
  );
}
