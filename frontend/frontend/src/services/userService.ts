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
export async function deleteInterest(id: string) {
  const res = await fetch(`${API_BASE_URL}/api/UserInterests/delete`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interestId: id }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete interest");
  }
}

//user name and email
export const getUserProfile = async () => {
  const res = await fetch(`${API_BASE_URL}/api/User/profile`, {
    method: "GET",
    credentials: "include", // 自动带 cookie
  });

  if (!res.ok) throw new Error("Failed to obtain user information");

  return await res.json();
};

export const updateDisplayName = async (newDisplayName: string) => {
  const res = await fetch(`${API_BASE_URL}/api/User/profile/display-name`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newDisplayName }),
  });

  if (!res.ok) throw new Error("Failed to modify the user name");
};

//user interest
export const getUserInterestsById = async (userId: string) => {
  const res = await fetch(`${API_BASE_URL}/api/UserInterests/by-user/${userId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch user interests");

  return res.json(); 
};
