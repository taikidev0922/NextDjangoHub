import { InputNumber } from "@grapecity/wijmo.react.input";
import { InputNumber as InputNumberType } from "@grapecity/wijmo.input";
import { Controller } from "react-hook-form";
import { useFocus } from "@/hooks/useFocus";
import { set } from "lodash";
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
            <InputNumber
              isRequired={false}
              id={name}
              name={name}
              className={`bg-editable${focusedStyle}`}
              valueChanged={(e: InputNumberType) => {
                field.onChange(e.value ?? NaN);
              }}
              value={field.value}
              text=""
              initialized={setFocusedIvent}
            />
          )}
        />
        {errors[name] && <span role="alert">{errors[name].message}</span>}
      </div>
    </section>
  );
}
