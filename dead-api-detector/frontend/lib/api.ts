import { ApiRecord, CheckAllResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function fetchApis(params?: {
  category?: string;
  search?: string;
}): Promise<ApiRecord[]> {
  const url = new URL(`${BASE_URL}/apis`);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.search)   url.searchParams.set("search", params.search);

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Failed to fetch APIs: ${res.statusText}`);
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/categories`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
  return res.json();
}

export async function triggerCheckAll(): Promise<CheckAllResponse> {
  const res = await fetch(`${BASE_URL}/check-all`, { method: "POST" });
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}
