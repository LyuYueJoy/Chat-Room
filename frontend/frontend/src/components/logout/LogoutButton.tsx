"use client";

import { logoutUser } from "@/services/authService";
import { Button } from "@mui/material";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await logoutUser();
      // 使用原生方式跳转
      window.location.href = "/login";
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
        backgroundColor: "#ef4444", 
        color: "white",
        "&:hover": {
          backgroundColor: "#dc2626", 
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
