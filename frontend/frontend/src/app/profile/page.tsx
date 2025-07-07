import Navbar from "@/components/navebar/navbarHome";
import React from "react";
import { Box, Typography } from "@mui/material";
import InterestLoader  from "@/components/UserInterests/InterestLoader";

export default function ProfilePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>profile</h1>
      <Box>
        <Typography variant="h4" gutterBottom>
         My Interests
        </Typography>
        <InterestLoader />
      </Box>
      <Navbar />
    </main>
  );
}
