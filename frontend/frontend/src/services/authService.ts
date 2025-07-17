import { API_BASE_URL } from "@/services/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

// login
export async function login(data: LoginRequest) {
  const res = await fetch(`${API_BASE_URL}/api/Auth/login`, {
    method: "POST",
    credentials: "include", // cookie
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login Failed");
  }
  return res;
}

// register
export async function register(data: RegisterRequest) {
  const res = await fetch(`${API_BASE_URL}/api/Auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Registration failed");
  }
  return res;
}

//current id 
// { id: "...", email: "...", displayName: "..." }
export async function getCurrentUser() {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to get current user");
  return await res.json(); 
}

// logout
export const logoutUser  = async () => {
  const res = await fetch(`${API_BASE_URL}/api/Auth/logout`, {
    method: "POST",
    credentials: "include", 
    headers: {
      "Accept": "*/*",
    },
  });

  if (res.ok) {
    console.log("Logout successful");
  } else {
    console.error("Logout failed");
  }
};
