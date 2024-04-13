import * as Fetchers from "./fetchers";
import { getGreet } from "./getGreet";

jest.mock("./fetchers");

test("spyon", async () => {
  jest.spyOn(Fetchers, "getMyProfile").mockResolvedValueOnce({
    name: "hogehoge",
  });
  const result = await getGreet();
  expect(result).toBe("Hello, hogehoge!");
});
