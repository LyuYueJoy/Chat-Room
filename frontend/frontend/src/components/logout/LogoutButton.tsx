"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/authService";
import { Button } from "@mui/material";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="contained"
      sx={{
        backgroundColor: "#ef4444", // Tailwind 的 red-500
        color: "white",
        "&:hover": {
          backgroundColor: "#dc2626", // Tailwind 的 red-600
        },
        position: "fixed", 
        top: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      Logout
    </Button>
  );
}
