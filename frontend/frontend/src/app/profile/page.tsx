import Navbar from "@/components/navebar/navbarHome";
import React from "react";
import { Box } from "@mui/material";
import InterestLoader  from "@/components/UserInterests/InterestManager";
import UserProfile from "@/components/UserProfile/UserProfile";
import LogoutButton from "@/components/logout/LogoutButton";

export default function ProfilePage() {
  return (
    <main style={{ padding: "2rem" ,paddingBottom: "80px"}}>
      <h1>profile</h1>
      <Box>
        <LogoutButton />
        <UserProfile />
        <InterestLoader />
      </Box>
      <Navbar />
    </main>
  );
}
