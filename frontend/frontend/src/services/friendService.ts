import { API_BASE_URL } from "./api";

// get all users except current user
export async function getAllUsers() {
  const res = await fetch(`${API_BASE_URL}/api/friend/users`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// find user by interest
export async function searchUsersByInterest(interest: string) {
  const res = await fetch(`${API_BASE_URL}/api/friend/search?interest=${encodeURIComponent(interest)}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to search users");
  return res.json();
}

// get friend list
export async function getFriendList() {
  const res = await fetch(`${API_BASE_URL}/api/friend/list`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch friend list");
  return res.json();
}

// send add friend request
export async function sendFriendRequest(receiverId: string) {
  const res = await fetch(`${API_BASE_URL}/api/friend/request`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(receiverId),
  });
  if (!res.ok) throw new Error("Failed to send friend request");
}

// get friend requests
export async function getFriendRequests() {
  const res = await fetch(`${API_BASE_URL}/api/friend/requests`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch friend requests");
  return res.json();
}

// accept friend request
export async function acceptFriendRequest(requestId: string) {
  const res = await fetch(`${API_BASE_URL}/api/friend/request/${requestId}/accept`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to accept friend request");
}

// reject friend request
export async function rejectFriendRequest(requestId: string) {
  const res = await fetch(`${API_BASE_URL}/api/friend/request/${requestId}/reject`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to reject friend request");
}

// delete friend
export async function deleteFriend(friendUserId: string) {
  const res = await fetch(`${API_BASE_URL}/api/friend/${friendUserId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete friend");
}

// search user by email
export async function searchUserByEmail(email: string) {
  const res = await fetch(`${API_BASE_URL}/api/friend/search-by-email?email=${encodeURIComponent(email)}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to search user by email");
  }
  return res.json();
}
