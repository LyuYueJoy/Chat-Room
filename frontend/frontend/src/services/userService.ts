import { API_BASE_URL } from "@/services/api";


export interface InterestItem {
  id: string;
  interest: string;
}

// show interests
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
// add interest
export async function addInterest(interest: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/UserInterests/add`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interest }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to add interest");
  }
}
// update interest
export async function updateInterest(interestId: string, newInterest: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/UserInterests/update`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      interestId,
      newInterest,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update interest");
  }
}
// delete interest
// 示例
export async function deleteInterest(id: string) {
  const res = await fetch(`${API_BASE_URL}/api/UserInterests/delete`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interestId: id }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "删除兴趣失败");
  }
}

