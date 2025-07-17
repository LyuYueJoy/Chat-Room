"use client";

import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  sendFriendRequest,
} from "@/services/friendService";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

export default function FriendSuggestions() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState<"error" | "success" | undefined>(undefined);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
        setMessage("Unable to load user list");
        setMessageColor("error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRequest = async (id: string) => {
    setAddingId(id);
    try {
      await sendFriendRequest(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      setMessage("Friend request sent!");
      setMessageColor("success");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send request");
      setMessageColor("error");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Suggested Friends
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <Typography color="text.secondary">No friends available to add</Typography>
      ) : (
        <List>
          {users.map((user) => (
            <ListItem key={user.id}>
              <ListItemText
                primary={user.displayName || "Unknown User"}
                secondary={user.email}
              />
              <Button
                onClick={() => handleRequest(user.id)}
                disabled={addingId === user.id}
                variant="outlined"
              >
                {addingId === user.id ? "Sending..." : "Add Friend"}
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      {message && (
        <Typography color={messageColor} sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
