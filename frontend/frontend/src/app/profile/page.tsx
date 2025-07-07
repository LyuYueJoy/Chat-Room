import Navbar from "@/components/navebar/navbarHome";
import React from "react";
import { Box } from "@mui/material";
import InterestLoader  from "@/components/UserInterests/InterestManager";

export default function ProfilePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>profile</h1>
      <Box>
        <InterestLoader />
      </Box>
      <Navbar />
    </main>
  );
}
