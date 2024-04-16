import { useGridForm } from "@/hooks/useGridForm";
import GridForm from "./GridForm";
import { render, renderHook, screen, waitFor } from "@testing-library/react";

const setup = async () => {
  // wijmoはブラウザAPIを使用するのでstorybookじゃないとテストできない？
  const { result } = renderHook(() =>
    useGridForm([
      {
        binding: "test",
        header: "test",
        dataType: "string",
      },
    ])
  );
  render(<GridForm {...result.current.register("test")} />);
  await waitFor(() => expect(result.current.grid).toBeDefined());
  return result;
};

describe("レンダリング", () => {
  test("wijmoがレンダリングされる", async () => {
    await setup();
    const element = document.querySelector(".wj-content");
    expect(element).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
