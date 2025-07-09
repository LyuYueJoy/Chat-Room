import Navbar from "@/components/navebar/navbarHome";
import { Box } from "@mui/material";
import FriendSearch from "@/components/Friend/FriendSearch";

export default function ExplorePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>explore</h1>
      <p>explore</p>
      <Box>
        <FriendSearch />
      </Box>
      <Navbar />
    </main>
  );
}
