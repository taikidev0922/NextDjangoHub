import { sayGoodBye, greet } from "./sayGoodBye";

jest.mock("./sayGoodBye", () => {
  return {
    ...jest.requireActual("./sayGoodBye"),
    sayGoodBye: (name: string) => `goodbye ${name}`,
  };
});

test("sayGoodBye", () => {
  expect(sayGoodBye("John")).toBe("goodbye John");
});
test("greet", () => {
  expect(greet("John")).toBe("Hello, John!");
});
