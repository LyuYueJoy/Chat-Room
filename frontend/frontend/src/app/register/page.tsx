"use client";
import { useState } from "react";
import { register } from "@/services/authService";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register({ email, password, displayName });
      alert("Successful registration！");
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />
        <button type="submit" style={{ width: "100%" }}>
          register
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p style={{ marginTop: 16 }}>
        Already have an account？ <a href="/login">login</a>
      </p>
    </main>
  );
}
