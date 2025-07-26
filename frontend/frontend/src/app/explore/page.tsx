"use client";

import Navbar from "@/components/navebar/navbarHome";
import { Box, Typography } from "@mui/material";
import FriendSearch from "@/components/Friend/FriendSearch";
import FriendSuggestions from "@/components/Friend/FriendSuggestions";

export default function ExplorePage() {
  return (
    <main style={{ padding: "2rem" }}>
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
        Explore
      </Typography>

      <Box>
        <FriendSearch />
        <FriendSuggestions />
      </Box>

      <Navbar />
    </main>
  );
}
