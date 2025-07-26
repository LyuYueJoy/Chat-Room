"use client";

import Navbar from "@/components/navebar/navbarHome";
import MatchPage from "@/components/Match/MatchPage";
import { Typography } from "@mui/material";

export default function HomePage() {
  return (
    <div style={{ padding: "2rem" }}>
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
        Home
      </Typography>

      <MatchPage />
      <Navbar />
    </div>
  );
}
