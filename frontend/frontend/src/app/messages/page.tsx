import Navbar from "@/components/navebar/navbarHome";
import FriendList from "@/components/Friend/FriendList";
import FriendRequests from "@/components/Friend/FriendRequests";
import { Box } from "@mui/material";

export default function MessagesPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>message</h1>
      <p>message</p>
      <Box>
        <FriendRequests />
        <FriendList />
      </Box>
      <Navbar />
    </main>
  );
}
