import { render, screen } from "@testing-library/react";
import TextInput from "./TextInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "@/lib/yup";
import userEvent from "@testing-library/user-event";

describe("TextInput", () => {
  it("ユーザーの入力を受け付ける", async () => {
    const { control } = useForm(); // useFormからcontrolを取得
    render(
      <TextInput
        label="テスト"
        control={control}
        name="testInput"
        errors={{}}
      />
    );

    // userEventを使用してテキストフィールドに入力
    await userEvent.type(screen.getByLabelText("テスト"), "テスト入力");

    // 入力された値がテキストフィールドに反映されていることを検証
    expect(screen.getByLabelText("テスト")).toHaveValue("テスト入力");
  });
});
