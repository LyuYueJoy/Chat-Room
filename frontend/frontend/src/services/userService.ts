import { API_BASE_URL } from "@/services/api";


export interface InterestItem {
  id: string;
  interest: string;
}

// 修改 fetchUserInterests 返回数组对象
export async function fetchUserInterests(): Promise<InterestItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/UserInterests/my`,{
    method: "GET",
    credentials: "include", // 发送 cookie
  });

  if (!res.ok) {
    throw new Error("Failed to obtain user interests");
  }

  const data = await res.json();
  return data as InterestItem[];
}
