import { getMyProfile } from "./fetchers/index";

export async function getGreet() {
  const result = await getMyProfile();
  return `Hello, ${result.name}!`;
}
