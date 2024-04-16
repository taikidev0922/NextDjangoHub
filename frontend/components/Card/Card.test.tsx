import { render, screen } from "@testing-library/react";
import Card from "./Card";

test("renders Card", () => {
  render(<Card title="test">hoge</Card>);
  expect(screen.getByText("test")).toBeInTheDocument();
  expect(screen.getByRole("heading")).toBeInTheDocument();
  expect(screen.getByRole("heading")).toHaveTextContent("test");
});
