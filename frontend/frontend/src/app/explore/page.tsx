import Navbar from "@/components/navebar/navbarHome";
import { Box } from "@mui/material";
import FriendSearch from "@/components/Friend/FriendSearch";
import FriendSuggestions from "@/components/Friend/FriendSuggestions";


export default function ExplorePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>explore</h1>
      <Box>
        <FriendSearch />
        <FriendSuggestions />
      </Box>
      <Navbar />
    </main>
  );
}
