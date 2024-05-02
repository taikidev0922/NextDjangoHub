import { ComboBox } from "@grapecity/wijmo.react.input";
import { ComboBox as ComboBoxType } from "@grapecity/wijmo.input";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { useFocus } from "@/hooks/useFocus";
type Props = {
  control: any;
  name: string;
  errors: any;
  label: string;
  className?: string;
  inputType?: "text";
};
export default function TextInput({
  control,
  name,
  errors,
  label,
  className,
  inputType = "text",
}: Props) {
  const { focusedStyle, setFocusedIvent } = useFocus();
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
              id={name}
              name={name}
              className={`bg-editable${focusedStyle}`}
              textChanged={(e: ComboBoxType) => field.onChange(e.text)}
              text={field.value}
              inputType={inputType}
              initialized={setFocusedIvent}
            />
          )}
        />
        {errors[name] && <span role="alert">{errors[name].message}</span>}
      </div>
    </section>
  );
}
