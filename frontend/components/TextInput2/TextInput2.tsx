import { ComboBox } from "@grapecity/wijmo.react.input";
import { ComboBox as ComboBoxType } from "@grapecity/wijmo.input";
import { Controller } from "react-hook-form";
type Props = {
  control: any;
  name: string;
  errors: any;
  label: string;
};
export default function TextInput2({ control, name, errors, label }: Props) {
  return (
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
            className="bg-editable"
            textChanged={(e: ComboBoxType) => field.onChange(e.text)}
            text={field.value}
            inputType="text"
          />
        )}
      />
      {errors[name] && <span role="alert">{errors[name].message}</span>}
    </div>
  );
}
