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
