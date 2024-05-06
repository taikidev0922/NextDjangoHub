import TextInput from "@/components/TextInput/TextInput";
import yup from "@/lib/yup";
import ListTemplate from "@/template/ListTemplate";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberInput from "@/components/NumberInput/NumberInput";

export default function SampleList() {
  const searchForm = yupResolver(
    yup.object({
      title: yup.string(),
      price: yup
        .number()
        .optional()
        .transform((value, originalValue) =>
          isNaN(Number(originalValue)) ? undefined : Number(originalValue)
        ),
      description: yup.string(),
    })
  );
  const searchFormDefaultValues = {
    title: undefined,
    price: undefined,
    description: undefined,
  };
  const listColumns = [
    {
      binding: "title",
      header: "title",
      dataType: "string",
    },
    {
      binding: "price",
      header: "price",
      dataType: "number",
    },
    {
      binding: "description",
      header: "description",
      dataType: "string",
    },
  ];
  return (
    <ListTemplate
      defaultValues={searchFormDefaultValues}
      resolver={searchForm}
      fetchUrl="/api/v1/sample/"
      listColumns={listColumns}
      listName="サンプル一覧"
    >
      {({ control, errors }) => (
        <>
          <TextInput
            name="title"
            label="title"
            control={control}
            errors={errors}
          />
          <NumberInput
            name="price"
            label="price"
            control={control}
            errors={errors}
          />
          <TextInput
            name="description"
            label="description"
            control={control}
            errors={errors}
          />
        </>
      )}
    </ListTemplate>
  );
}
