import { ComboBox } from "@grapecity/wijmo.react.input";
import { Controller } from "react-hook-form";
import { ComboBox as ComboBoxType } from "@grapecity/wijmo.input";
import { useFormContext } from "react-hook-form";
export default function TextInput({
  name,
  label,
  type = "text",
  className,
  isReadOnly = false,
}: {
  name: string;
  label: string;
  type?: string;
  className?: string;
  isReadOnly?: boolean;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <section className={className}>
      <div className="flex flex-col">
        <label htmlFor={name} className="font-medium">
          {label}
        </label>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <ComboBox
              isReadOnly={isReadOnly}
              className={isReadOnly ? "" : "bg-editable"}
              textChanged={(e: ComboBoxType) => field.onChange(e.text)}
              id={name}
              inputType={type}
            />
          )}
        />
        <p className="text-red-500">
          {errors[name]?.message?.toString() || ""}
        </p>
      </div>
    </section>
  );
}
