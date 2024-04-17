import { render } from "@testing-library/react";
import Login from "../components/page";

describe("Login", () => {
  it("should render", () => {
    render(<Login />);
  });
});
