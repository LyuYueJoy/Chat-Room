import { API_BASE_URL } from "@/services/api";

export async function sendMessage(receiverId: string, content: string, senderId: string) {
  const res = await fetch(`${API_BASE_URL}/api/chat/send`, {
    method: "POST",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ senderId, receiverId, content }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to send message: ${errorText || res.statusText}`);
  }
  return await res.text();
}
