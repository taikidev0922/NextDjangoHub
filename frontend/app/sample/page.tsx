"use client";
import CreateSample from "@/features/Sample/components/CreateSample";
import SampleList from "@/features/Sample/components/SampleList";

function Page() {
  return (
    <section>
      <SampleList />
      <CreateSample />
    </section>
  );
}

export default Page;
