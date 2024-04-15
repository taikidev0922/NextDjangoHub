import { render, screen } from "@testing-library/react";
import Card from "./Card";

test("renders Card", () => {
  render(<Card title="test">hoge</Card>);
  console.log(screen.getByText("test"));
  expect(screen.getByText("test")).toBeInTheDocument();
});
