"use client";
import React, { useState } from "react";
import {
  searchUsersByInterest,
  sendFriendRequest,
} from "@/services/friendService";
import {
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { presetInterests } from "@/models/presetInterests";

export default function FriendSearch() {
  const [interest, setInterest] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState<"error" | "success" | undefined>(undefined);


  const handleSearch = async () => {
    if (!interest) return;
    const data = await searchUsersByInterest(interest);
    setResults(data);
    };

    const handleRequest = async (id: string) => {
    try {
        await sendFriendRequest(id);
        setMessage("Friend request sent!");
        setMessageColor("success");
    } catch (err) {
        console.error(err);
        setMessage("Failed to send friend request");
        setMessageColor("error");
    }
    };


  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Find Users by Interest
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">
            <em>Select an interest</em>
          </MenuItem>
          {presetInterests.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>

        <Button onClick={handleSearch} variant="outlined" disabled={!interest}>
          Search
        </Button>
      </Box>

      <List>
        {results.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.displayName} secondary={user.email} />
            <Button onClick={() => handleRequest(user.id)}>Add Friend</Button>
          </ListItem>
        ))}
      </List>

      {message && (
        <Typography color={messageColor} sx={{ mb: 2 }}>
            {message}
        </Typography>
        )}

    </Box>
  );
}
