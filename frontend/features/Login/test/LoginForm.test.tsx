import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../components/LoginForm2";

const mockLogin = jest.fn((username, password) => {
  return Promise.resolve();
});

it("必須エラーが表示されること", async () => {
  render(<App login={mockLogin} />);

  await userEvent.click(screen.getByRole("button"));

  expect(await screen.findAllByRole("alert")).toHaveLength(2);
  expect(mockLogin).not.toHaveBeenCalled();
});

it("ユーザー名に全角を入れたらエラーが表示される", async () => {
  render(<App login={mockLogin} />);

  const input = "あああ";

  await userEvent.type(
    screen.getByRole("textbox", { name: /ユーザー名/i }),
    input
  );
  await userEvent.type(screen.getByLabelText("パスワード"), "password");

  await userEvent.click(screen.getByRole("button"));

  expect(await screen.findAllByRole("alert")).toHaveLength(1);
  expect(await screen.findByText("半角英数字で入力してください"));
  expect(mockLogin).not.toHaveBeenCalled();
  expect(screen.getByRole("textbox", { name: /ユーザー名/i })).toHaveValue(
    input
  );
  expect(screen.getByLabelText("パスワード")).toHaveValue("password");
});

it("値が有効な場合にエラーを表示せず、ログインが実行される", async () => {
  render(<App login={mockLogin} />);
  await userEvent.type(
    screen.getByRole("textbox", { name: /ユーザー名/i }),
    "test"
  );
  expect(screen.getByRole("textbox", { name: /ユーザー名/i })).toHaveValue(
    "test"
  );
  await userEvent.type(screen.getByLabelText("パスワード"), "password");
  userEvent.click(screen.getByRole("button"));
  expect(screen.queryAllByRole("alert")).toHaveLength(0);
  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith("test", "password");
  });
});
