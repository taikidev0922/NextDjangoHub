"use client";
import Button from "@/components/Button";
import SampleList from "@/features/Sample/components/SampleList";
import { ApiClient } from "@/lib/api-client";

function Page() {
  const update = () => {
    ApiClient.put("/api/samples/bulk_update", [
      { id: 1, name: "test" },
      { id: 2, name: "test" },
    ]);
  };
  return (
    <section>
      <SampleList />
      <Button type="button" className="btn-success" onClick={update}>
        更新
      </Button>
    </section>
  );
}

export default Page;
