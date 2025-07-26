"use client";

import Navbar from "@/components/navebar/navbarHome";
import React from "react";
import { Box, Typography } from "@mui/material";
import InterestLoader from "@/components/UserInterests/InterestManager";
import UserProfile from "@/components/UserProfile/UserProfile";
import LogoutButton from "@/components/logout/LogoutButton";

export default function ProfilePage() {
  return (
    <main style={{ padding: "2rem", paddingBottom: "80px" }}>
      <Typography
        variant="h3"
        component="h1"
        align="center"
        sx={{
          fontWeight: "bold",
          background: "linear-gradient(to right, #2196f3, #21cbf3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "2rem",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        Profile
      </Typography>

      <Box>
        <LogoutButton />
        <UserProfile />
        <InterestLoader />
      </Box>

      <Navbar />
    </main>
  );
}
