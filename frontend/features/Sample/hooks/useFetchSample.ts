import { ApiClient } from "@/lib/api-client";
import { useState } from "react";
import useSWR from "swr";

export type SampleQuery = {
  title?: string;
  price?: number;
};

const fetcher = (url: string) => ApiClient.get(url);

export async function useFetchSample(queryParams?: SampleQuery) {
  const [samples, setSamples] = useState([]);
  const res = await ApiClient.get("/sample/", { params: queryParams });
  setSamples(res?.data);
  return {
    samples,
  };
}
