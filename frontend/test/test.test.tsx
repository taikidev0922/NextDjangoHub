class NegativeError extends Error {}
const add = (a: number, b: number) => {
  if (a < 0) {
    throw new NegativeError("a is negative");
  }
  return a + b;
};
describe("Simple Test Suite", () => {
  it("should pass a simple test", () => {
    expect(true).toBe(true);
  });
  test("1+1は2", () => {
    expect(1 + 1).toBe(2);
  });
});

describe("add", () => {
  it("1+1", () => {
    expect(add(1, 1)).toBe(2);
  });
  test("throw NegativeError", () => {
    expect(() => add(-1, 1)).toThrow(NegativeError);
  });
});
