"use client";
import React, { useState } from "react";
import { searchUserByEmail, sendFriendRequest } from "@/services/friendService";
import { TextField, Button, Typography, ListItem, ListItemText } from "@mui/material";
import { User } from "@/models/User";

export default function FriendEmailSearch() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    setUser(null);
    setMessage("");
    try {
      const result = await searchUserByEmail(email);
      if (!result) {
        setMessage("User not found.");
      } else {
        setUser(result);
      }
    } catch {
      setMessage("Search failed.");
    }
  };

  const handleRequest = async () => {
    if (!user) return;
    try {
      await sendFriendRequest(user.id);
      setMessage("Friend request sent!");
    } catch {
      setMessage("Failed to send request.");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <Typography variant="h6">Add Friend by Email</Typography>
      <TextField
        label="User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <Button variant="outlined" onClick={handleSearch}>Search</Button>

      {user && (
        <ListItem>
          <ListItemText primary={user.displayName} secondary={user.email} />
          <Button onClick={handleRequest}>Add Friend</Button>
        </ListItem>
      )}

      {message && <Typography color="textSecondary">{message}</Typography>}
    </div>
  );
}
