export function getMyProfile() {
  return fetch("https://api.example.com/me").then((res) => res.json());
}
