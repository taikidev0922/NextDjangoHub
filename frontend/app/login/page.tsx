import Login from "@/features/Login/components/page";

export default function Page() {
  return <Login />;
}

Page.getLayout = function getLayout(page: React.ReactNode) {
  return <section>{page}</section>;
};
